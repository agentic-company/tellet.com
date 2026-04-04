import { createServiceSupabase } from "@/lib/supabase/server";
import { streamAgentWithTools } from "@/lib/engine";
import { getToolsForRole } from "@/lib/actions";
import { getCompanyApiKey } from "@/lib/tellet-db";

export async function POST(request: Request) {
  const { message, agent_id, company_id, session_id } = await request.json();

  if (!message || !agent_id || !company_id) {
    return Response.json(
      { error: "message, agent_id, and company_id required" },
      { status: 400 }
    );
  }

  const admin = createServiceSupabase();

  // Get agent (must be active)
  const { data: agent } = await admin
    .from("agents")
    .select("*")
    .eq("id", agent_id)
    .eq("company_id", company_id)
    .eq("status", "active")
    .single();

  if (!agent) {
    return Response.json({ error: "Agent not found" }, { status: 404 });
  }

  // Get or create conversation using session_id
  let convId: string | undefined;
  if (session_id) {
    const { data: existing } = await admin
      .from("conversations")
      .select("id")
      .eq("company_id", company_id)
      .eq("agent_id", agent_id)
      .eq("channel", "widget")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    convId = existing?.id;
  }

  if (!convId) {
    const { data: conv } = await admin
      .from("conversations")
      .insert({ agent_id, company_id, channel: "widget" })
      .select("id")
      .single();
    convId = conv?.id;
  }

  // Save user message
  await admin
    .from("messages")
    .insert({ conversation_id: convId, role: "user", content: message });

  // Get recent history (limited for widget)
  const { data: history } = await admin
    .from("messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at")
    .limit(10);

  const messages = (history || []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Only safe tools for public widget (no email, no delegation)
  const builtinTools = getToolsForRole(agent.role, company_id).filter(
    (t) => t.name === "search_knowledge"
  );

  const apiKey = await getCompanyApiKey(company_id);
  if (!apiKey) {
    return Response.json({ error: "Service not configured" }, { status: 503 });
  }

  const stream = await streamAgentWithTools({
    agent: {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      model: agent.model || "claude-haiku-4-5",
      systemPrompt: agent.system_prompt || "",
      channels: ["widget"],
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

        await admin.from("messages").insert({
          conversation_id: convId,
          role: "assistant",
          content: fullResponse,
        });

        await admin.from("activity_log").insert({
          company_id,
          agent_id,
          action: "widget_reply",
          summary: `Widget: "${fullResponse.slice(0, 80)}${fullResponse.length > 80 ? "..." : ""}"`,
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
