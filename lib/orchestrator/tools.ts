import type Anthropic from "@anthropic-ai/sdk";

export const orchestratorTools: Anthropic.Tool[] = [
  {
    name: "list_agents",
    description:
      "List all AI agents in the company with their name, role, status, and model.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_stats",
    description:
      "Get company statistics: total conversations, messages, active agents, and estimated cost.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "update_agent_prompt",
    description:
      "Update an agent's system prompt. Use this when the owner wants to change how an agent behaves.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "The agent ID to update",
        },
        system_prompt: {
          type: "string",
          description: "The new system prompt for the agent",
        },
      },
      required: ["agent_id", "system_prompt"],
    },
  },
  {
    name: "get_recent_conversations",
    description:
      "Get recent conversations with message counts and agent info.",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description: "Number of conversations to return (default 10)",
        },
      },
      required: [],
    },
  },
  {
    name: "add_knowledge",
    description:
      "Add a document to the company knowledge base. Agents use this to answer customer questions accurately.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "Document title (e.g. 'Refund Policy')",
        },
        content: {
          type: "string",
          description: "Full document content",
        },
        category: {
          type: "string",
          description: "Category: policy, product, faq, or general",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "search_knowledge",
    description:
      "Search the knowledge base to check what information agents have access to.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "list_knowledge",
    description:
      "List all documents in the knowledge base.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "delete_knowledge",
    description:
      "Delete a document from the knowledge base by ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        document_id: {
          type: "string",
          description: "The document ID to delete",
        },
      },
      required: ["document_id"],
    },
  },
  {
    name: "list_available_tools",
    description:
      "List all tools available in the tellet marketplace that can be installed.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "install_tool",
    description:
      "Install a tool from the marketplace and assign it to agents. Updates tellet.json. The owner will need to set the required API key in .env.",
    input_schema: {
      type: "object" as const,
      properties: {
        tool_id: {
          type: "string",
          description: "Tool ID from the marketplace (e.g. 'stripe', 'email', 'github')",
        },
        agent_ids: {
          type: "array",
          items: { type: "string" },
          description: "Agent IDs to assign this tool to",
        },
      },
      required: ["tool_id"],
    },
  },
];
