export interface Agent {
  id: string;
  name: string;
  role: "cs" | "marketing" | "sales" | "devops";
  system_prompt: string;
  model: string;
  status: "active" | "paused" | "error";
  config: Record<string, unknown>;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  agent_id: string;
  channel: string;
  external_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  agent_id: string;
  action: string;
  summary: string | null;
  metadata: Record<string, unknown>;
  cost_usd: number;
  created_at: string;
}
