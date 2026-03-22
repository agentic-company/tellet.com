-- Agents
create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  system_prompt text not null,
  model text default 'claude-sonnet-4-6',
  status text default 'active' check (status in ('active', 'paused', 'error')),
  config jsonb default '{}',
  created_at timestamptz default now()
);

-- Conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  channel text not null,
  external_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Activity log
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  action text not null,
  summary text,
  metadata jsonb default '{}',
  cost_usd numeric(10,4) default 0,
  created_at timestamptz default now()
);

-- Indexes
create index idx_conversations_agent on conversations(agent_id);
create index idx_messages_conversation on messages(conversation_id);
create index idx_activity_agent on activity_log(agent_id);
create index idx_activity_created on activity_log(created_at desc);

-- Enable realtime for activity feed
alter publication supabase_realtime add table activity_log;
alter publication supabase_realtime add table messages;

-- RLS (row level security) - disabled for MVP single-user
-- Will enable in Phase 3 for multi-tenant
alter table agents enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table activity_log enable row level security;

-- Allow all for authenticated users (single-user MVP)
create policy "Allow all for authenticated" on agents for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on conversations for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on messages for all to authenticated using (true) with check (true);
create policy "Allow all for authenticated" on activity_log for all to authenticated using (true) with check (true);

-- Allow anon to insert into conversations & messages (for web chat widget)
create policy "Allow anon chat" on conversations for insert to anon with check (channel = 'web_chat');
create policy "Allow anon messages" on messages for insert to anon with check (true);
create policy "Allow anon read messages" on messages for select to anon using (true);

-- Seed: 4 default agents
insert into agents (name, role, system_prompt, model) values
(
  'Telly',
  'cs',
  'You are Telly, the customer support agent for tellet — an AI Agentic Company platform for solo founders. You help visitors understand what tellet is, how it works, and how to get started. Be friendly, concise, and helpful. If you don''t know something, say so honestly. Key facts: tellet lets solo founders build an AI workforce to run their business. It includes agent management, multi-channel communication, system integrations, automation, a dashboard, and an AI website builder. Powered by OpenClaw. Currently in early access.',
  'claude-sonnet-4-6'
),
(
  'Maru',
  'marketing',
  'You are Maru, the marketing agent for tellet. You create compelling blog posts, social media content, and newsletters about AI agents, solo entrepreneurship, and the future of work. Write in a conversational, insightful tone. Focus on practical value for solo founders. Always output in markdown format.',
  'claude-sonnet-4-6'
),
(
  'Scout',
  'sales',
  'You are Scout, the sales agent for tellet. You manage leads from the waitlist, craft personalized welcome emails, and follow up with potential users. Be warm but professional. Focus on understanding what the lead needs and how tellet can help their specific business.',
  'claude-sonnet-4-6'
),
(
  'Cody',
  'devops',
  'You are Cody, the DevOps agent for tellet. You review pull requests for code quality, security, and best practices. You triage GitHub issues by labeling and prioritizing them. Be technical, precise, and constructive in feedback. Focus on actionable suggestions.',
  'claude-sonnet-4-6'
);
