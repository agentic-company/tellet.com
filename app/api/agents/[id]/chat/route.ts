import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { streamAgentResponse, estimateCost } from "@/lib/agents/engine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { message, conversation_id } = await request.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  // Get agent
  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (agentError || !agent) {
    return Response.json({ error: "Agent not found" }, { status: 404 });
  }

  // Get or create conversation
  let convId = conversation_id;
  if (!convId) {
    const { data: conv } = await supabase
      .from("conversations")
      .insert({ agent_id: id, channel: "web_chat" })
      .select("id")
      .single();
    convId = conv?.id;
  }

  // Save user message
  await supabase.from("messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  // Get conversation history
  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true })
    .limit(20);

  const messages = (history || []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Stream response
  const stream = await streamAgentResponse(
    agent.system_prompt,
    messages,
    agent.model
  );

  let fullResponse = "";

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        stream.on("text", (text) => {
          fullResponse += text;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        });

        const finalMessage = await stream.finalMessage();

        // Save assistant message
        await supabase.from("messages").insert({
          conversation_id: convId,
          role: "assistant",
          content: fullResponse,
        });

        // Log activity
        const cost = estimateCost(
          finalMessage.usage.input_tokens,
          finalMessage.usage.output_tokens,
          agent.model
        );

        await supabase.from("activity_log").insert({
          agent_id: id,
          action: "replied",
          summary: `Replied in web chat: "${fullResponse.slice(0, 80)}${fullResponse.length > 80 ? "..." : ""}"`,
          cost_usd: cost,
          metadata: {
            conversation_id: convId,
            input_tokens: finalMessage.usage.input_tokens,
            output_tokens: finalMessage.usage.output_tokens,
          },
        });

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ done: true, conversation_id: convId })}\n\n`
          )
        );
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream failed" })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
