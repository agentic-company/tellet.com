import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function streamAgentResponse(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  model = "claude-sonnet-4-6"
) {
  const stream = anthropic.messages.stream({
    model,
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  return stream;
}

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string
): number {
  // Approximate pricing per 1M tokens (2026 rates)
  const pricing: Record<string, { input: number; output: number }> = {
    "claude-sonnet-4-6": { input: 3, output: 15 },
    "claude-haiku-4-5": { input: 0.25, output: 1.25 },
    "claude-opus-4-6": { input: 15, output: 75 },
  };

  const rates = pricing[model] || pricing["claude-sonnet-4-6"];
  return (inputTokens * rates.input + outputTokens * rates.output) / 1_000_000;
}
