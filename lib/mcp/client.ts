import type Anthropic from "@anthropic-ai/sdk";

// SaaS version: MCP stdio servers are not supported in serverless.
// Only builtin tools (knowledge base) are available.
// Full MCP support requires self-hosted CLI deployment.

export async function getToolsForAgent(
  _agentId: string
): Promise<Anthropic.Tool[]> {
  // Return builtin knowledge base tools
  return [
    {
      name: "search_knowledge",
      description:
        "Search the company knowledge base for relevant information.",
      input_schema: {
        type: "object" as const,
        properties: {
          query: { type: "string", description: "The search query" },
        },
        required: ["query"],
      },
    },
  ];
}

export async function callMCPTool(
  _toolName: string,
  _args: Record<string, unknown>
): Promise<string> {
  return "MCP tools are only available in self-hosted mode. Use npx @tellet/create for full MCP support.";
}
