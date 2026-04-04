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
    name: "schedule_task",
    description:
      "Schedule a recurring task for an agent. The agent will automatically execute the given prompt on the specified schedule.",
    input_schema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "The agent ID to assign this task to",
        },
        name: {
          type: "string",
          description: "Short name for the task (e.g. 'Daily Sales Report')",
        },
        prompt: {
          type: "string",
          description:
            "The instruction to send to the agent each time the task runs",
        },
        schedule: {
          type: "string",
          description:
            "Cron expression: 'minute hour day-of-month month day-of-week'. Examples: '0 9 * * 1-5' (weekdays 9am), '0 */6 * * *' (every 6 hours), '0 8 * * 1' (Monday 8am)",
        },
        description: {
          type: "string",
          description: "Optional description of what this task does",
        },
      },
      required: ["agent_id", "name", "prompt", "schedule"],
    },
  },
  {
    name: "list_scheduled_tasks",
    description:
      "List all scheduled tasks with their status, schedule, and last run time.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "cancel_scheduled_task",
    description: "Disable or delete a scheduled task by ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        task_id: {
          type: "string",
          description: "The scheduled task ID to cancel",
        },
        delete_permanently: {
          type: "boolean",
          description: "If true, deletes the task. If false, just disables it (default: false)",
        },
      },
      required: ["task_id"],
    },
  },
];
