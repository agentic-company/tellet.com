import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { streamAgentWithTools } from "@/lib/engine";
import { getToolsForRole } from "@/lib/actions";
import { getCompanyApiKey } from "@/lib/tellet-db";

export async function POST(request: Request) {
  const { message, agent_id, conversation_id, company_id } =
    await request.json();

  if (!message || !agent_id || !company_id) {
    return Response.json(
      { error: "message, agent_id, and company_id required" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceSupabase();

  // Get agent
  const { data: agent } = await admin
    .from("agents")
    .select("*")
    .eq("id", agent_id)
    .eq("company_id", company_id)
    .single();

  if (!agent) {
    return Response.json({ error: "Agent not found" }, { status: 404 });
  }

  // Get or create conversation
  let convId = conversation_id;
  if (!convId) {
    const { data: conv } = await admin
      .from("conversations")
      .insert({ agent_id, company_id, channel: "web" })
      .select("id")
      .single();
    convId = conv?.id;
  }

  // Save user message
  await admin
    .from("messages")
    .insert({ conversation_id: convId, role: "user", content: message });

  // Get history
  const { data: history } = await admin
    .from("messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at")
    .limit(20);

  const messages = (history || []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Role-based tools
  const builtinTools = getToolsForRole(agent.role, company_id);
  const apiKey = await getCompanyApiKey(company_id);

  if (!apiKey) {
    return Response.json(
      { error: "API key not configured. Go to Settings to add your Anthropic API key." },
      { status: 400 }
    );
  }

  // Stream with tool use
  const stream = await streamAgentWithTools({
    agent: {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      model: agent.model || "claude-haiku-4-5",
      systemPrompt: agent.system_prompt || "",
      channels: ["web"],
      tools: [],
    },
    messages,
    builtinTools,
    apiKey,
  });

  let fullResponse = "";
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullResponse += value.text;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: value.text })}\n\n`)
          );
        }

        // Save response
        await admin.from("messages").insert({
          conversation_id: convId,
          role: "assistant",
          content: fullResponse,
        });

        // Log activity
        await admin.from("activity_log").insert({
          company_id,
          agent_id,
          action: "replied",
          summary: `Replied: "${fullResponse.slice(0, 80)}${fullResponse.length > 80 ? "..." : ""}"`,
        });

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, conversation_id: convId })}\n\n`
          )
        );
        controller.close();
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream failed" })}\n\n`
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
