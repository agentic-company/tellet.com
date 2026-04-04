import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { createServerSupabase } from "@/lib/supabase/server";
import { orchestratorTools } from "@/lib/orchestrator/tools";
import { executeTool } from "@/lib/orchestrator/executor";
import { getConfig, getCompanyLLMConfig } from "@/lib/tellet-db";

async function buildSystemPrompt(companyId: string): Promise<string> {
  const config = await getConfig(companyId);
  return `You are the Orchestrator for "${config.company.name}", an AI-powered company management system.

Your role is to help the Owner manage and operate their company through conversation. You can:
- View and manage AI agents (list, update prompts)
- Check company statistics (conversations, messages, costs)
- Manage the knowledge base (add, search, list, delete documents)
- Schedule automated tasks for agents
- View recent conversations

Company: ${config.company.name}
Description: ${config.company.description}
Agents: ${config.agents.map((a) => `${a.name} (${a.role})`).join(", ")}

Guidelines:
- Be helpful and proactive. Suggest improvements when you see opportunities.
- When updating content, explain what you changed and why.
- For potentially impactful changes, confirm with the owner before executing.
- Keep responses concise and actionable.
- Speak in the language the owner uses.`;
}

export async function POST(request: Request) {
  const { messages, company_id } = await request.json();

  if (!messages || !Array.isArray(messages) || !company_id) {
    return Response.json(
      { error: "messages array and company_id required" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const llmConfig = await getCompanyLLMConfig(company_id);
        if (!llmConfig) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "No LLM provider configured. Go to Settings to connect OpenRouter or add an API key." })}\n\n`
            )
          );
          controller.close();
          return;
        }

        const systemPrompt = await buildSystemPrompt(company_id);

        if (llmConfig.provider === "openrouter") {
          await runOpenRouterOrchestrator(controller, encoder, llmConfig.apiKey, systemPrompt, messages, company_id);
        } else {
          await runAnthropicOrchestrator(controller, encoder, llmConfig.apiKey, systemPrompt, messages, company_id);
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: err instanceof Error ? err.message : "Orchestrator error" })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// --- Anthropic path ---
async function runAnthropicOrchestrator(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  apiKey: string,
  systemPrompt: string,
  inputMessages: { role: string; content: string }[],
  companyId: string
) {
  const client = new Anthropic({ apiKey });
  let currentMessages: Anthropic.MessageParam[] = inputMessages.map(
    (m) => ({ role: m.role as "user" | "assistant", content: m.content })
  );

  while (true) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      tools: orchestratorTools,
      messages: currentMessages,
    });

    let hasToolUse = false;
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type === "text" && block.text) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: block.text })}\n\n`));
      }
      if (block.type === "tool_use") {
        hasToolUse = true;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tool: block.name, status: "running" })}\n\n`));
        const result = await executeTool(block.name, block.input as Record<string, unknown>, companyId);
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tool: block.name, status: "done" })}\n\n`));
      }
    }

    if (!hasToolUse) break;
    currentMessages = [
      ...currentMessages,
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults },
    ];
  }
}

// --- OpenRouter (OpenAI-compatible) path ---
async function runOpenRouterOrchestrator(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  apiKey: string,
  systemPrompt: string,
  inputMessages: { role: string; content: string }[],
  companyId: string
) {
  const client = new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });

  // Convert orchestrator tools to OpenAI format
  const openaiTools: OpenAI.ChatCompletionTool[] = orchestratorTools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description || "",
      parameters: t.input_schema as Record<string, unknown>,
    },
  }));

  let currentMessages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...inputMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "anthropic/claude-sonnet-4-6",
      max_tokens: 4096,
      messages: currentMessages,
      tools: openaiTools,
    });

    const choice = response.choices[0];
    if (!choice) break;

    if (choice.message.content) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: choice.message.content })}\n\n`));
    }

    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
      const toolMessages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "assistant", tool_calls: choice.message.tool_calls, content: choice.message.content },
      ];

      for (const call of choice.message.tool_calls) {
        if (call.type !== "function") continue;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tool: call.function.name, status: "running" })}\n\n`));
        const input = JSON.parse(call.function.arguments);
        const result = await executeTool(call.function.name, input, companyId);
        toolMessages.push({ role: "tool", tool_call_id: call.id, content: result });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ tool: call.function.name, status: "done" })}\n\n`));
      }

      currentMessages = [...currentMessages, ...toolMessages];
      continue;
    }

    break;
  }
}
