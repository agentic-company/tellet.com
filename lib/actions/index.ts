import type Anthropic from "@anthropic-ai/sdk";
import { searchKnowledge } from "@/lib/mcp/knowledge";
import { sendEmail } from "./email";

export interface BuiltinTool {
  name: string;
  description: string;
  input_schema: Anthropic.Tool.InputSchema;
  execute: (input: Record<string, unknown>) => Promise<string>;
}

// --- Tool definitions ---

function knowledgeSearchTool(companyId: string): BuiltinTool {
  return {
    name: "search_knowledge",
    description:
      "Search the company knowledge base for product info, policies, and FAQ",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
    execute: async (input) => searchKnowledge(input.query as string, companyId),
  };
}

function emailTool(): BuiltinTool {
  return {
    name: "send_email",
    description:
      "Send an email to a customer or team member. Use for follow-ups, confirmations, notifications, and outreach.",
    input_schema: {
      type: "object" as const,
      properties: {
        to: { type: "string", description: "Recipient email address" },
        subject: { type: "string", description: "Email subject line" },
        body: {
          type: "string",
          description: "Email body in HTML format",
        },
        from_name: {
          type: "string",
          description: "Sender display name (defaults to 'Tellet Agent')",
        },
      },
      required: ["to", "subject", "body"],
    },
    execute: async (input) =>
      sendEmail(input as { to: string; subject: string; body: string; from_name?: string }),
  };
}

// --- Role → Tool mapping ---

const ROLE_TOOLS: Record<string, string[]> = {
  // Customer-facing roles
  customer_support: ["search_knowledge", "send_email"],
  sales: ["search_knowledge", "send_email"],
  receptionist: ["search_knowledge", "send_email"],
  concierge: ["search_knowledge", "send_email"],
  // Internal/ops roles
  operations: ["search_knowledge", "send_email"],
  marketing: ["search_knowledge", "send_email"],
  analyst: ["search_knowledge"],
  // Catch-all
  general: ["search_knowledge"],
};

const ALL_TOOL_FACTORIES: Record<string, (companyId: string) => BuiltinTool> = {
  search_knowledge: (companyId) => knowledgeSearchTool(companyId),
  send_email: () => emailTool(),
};

/**
 * Get the builtin tools available for a given agent role.
 * Falls back to "general" if the role is not mapped.
 */
export function getToolsForRole(
  role: string,
  companyId: string
): BuiltinTool[] {
  const normalizedRole = role.toLowerCase().replace(/[\s-]/g, "_");
  const toolNames = ROLE_TOOLS[normalizedRole] || ROLE_TOOLS.general!;

  return toolNames
    .map((name) => ALL_TOOL_FACTORIES[name]?.(companyId))
    .filter(Boolean) as BuiltinTool[];
}
