import type Anthropic from "@anthropic-ai/sdk";
import { searchKnowledge } from "@/lib/mcp/knowledge";
import { sendEmail } from "./email";
import { delegateToAgent } from "./delegate";

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

function delegateTool(companyId: string): BuiltinTool {
  return {
    name: "delegate_to_agent",
    description:
      "Delegate a task to another agent in your company. Use when a request falls outside your expertise — e.g., a support agent delegates a billing question to the sales agent.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_name: {
          type: "string",
          description: "Name of the agent to delegate to (e.g. 'Sales Agent')",
        },
        task: {
          type: "string",
          description: "The task or question to send to the other agent",
        },
      },
      required: ["agent_name", "task"],
    },
    execute: async (input) =>
      delegateToAgent(
        input.agent_name as string,
        input.task as string,
        companyId
      ),
  };
}

// --- Role → Tool mapping ---

const ROLE_TOOLS: Record<string, string[]> = {
  // Customer-facing roles
  customer_support: ["search_knowledge", "send_email", "delegate_to_agent"],
  sales: ["search_knowledge", "send_email", "delegate_to_agent"],
  receptionist: ["search_knowledge", "send_email", "delegate_to_agent"],
  concierge: ["search_knowledge", "send_email", "delegate_to_agent"],
  // Internal/ops roles
  operations: ["search_knowledge", "send_email", "delegate_to_agent"],
  marketing: ["search_knowledge", "send_email", "delegate_to_agent"],
  analyst: ["search_knowledge", "delegate_to_agent"],
  // Catch-all
  general: ["search_knowledge"],
};

const ALL_TOOL_FACTORIES: Record<string, (companyId: string) => BuiltinTool> = {
  search_knowledge: (companyId) => knowledgeSearchTool(companyId),
  send_email: () => emailTool(),
  delegate_to_agent: (companyId) => delegateTool(companyId),
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
