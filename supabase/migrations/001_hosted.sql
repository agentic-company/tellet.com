-- tellet Hosted SaaS: Multi-tenant schema
-- All tables use company_id for tenant isolation via RLS

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Companies (tenant)
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  config jsonb DEFAULT '{}',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX companies_slug_idx ON companies(slug);
CREATE INDEX companies_owner_idx ON companies(owner_id);

-- Company members (user ↔ company mapping)
CREATE TABLE company_members (
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (company_id, user_id)
);

CREATE INDEX company_members_user_idx ON company_members(user_id);

-- Agents
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('customer_support', 'marketing', 'sales', 'operations', 'development', 'analytics')),
  description text,
  system_prompt text,
  model text DEFAULT 'claude-haiku-4-5',
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX agents_company_idx ON agents(company_id);

-- Conversations
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  channel text DEFAULT 'web',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX conversations_company_idx ON conversations(company_id);
CREATE INDEX conversations_agent_idx ON conversations(agent_id);

-- Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX messages_conversation_idx ON messages(conversation_id);

-- Documents (Knowledge Base with pgvector)
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX documents_company_idx ON documents(company_id);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_company_id uuid,
  match_count int DEFAULT 3,
  match_threshold float DEFAULT 0.7
)
RETURNS TABLE (id uuid, title text, content text, category text, similarity float)
LANGUAGE sql STABLE
AS $$
  SELECT
    d.id, d.title, d.content, d.category,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE d.company_id = match_company_id
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Activity log
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  action text NOT NULL,
  summary text,
  cost_usd numeric(10,6) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX activity_log_company_idx ON activity_log(company_id);
CREATE INDEX activity_log_created_idx ON activity_log(created_at DESC);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Helper: get user's company IDs
CREATE OR REPLACE FUNCTION user_company_ids()
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT company_id FROM company_members WHERE user_id = auth.uid();
$$;

-- Companies: members can access
CREATE POLICY companies_select ON companies FOR SELECT
  USING (id IN (SELECT user_company_ids()));
CREATE POLICY companies_insert ON companies FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY companies_update ON companies FOR UPDATE
  USING (id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- Company members: members can see their own company's members
CREATE POLICY members_select ON company_members FOR SELECT
  USING (company_id IN (SELECT user_company_ids()));
CREATE POLICY members_insert ON company_members FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- Agents: company members can CRUD
CREATE POLICY agents_all ON agents FOR ALL
  USING (company_id IN (SELECT user_company_ids()));

-- Conversations: company members can CRUD
CREATE POLICY conversations_all ON conversations FOR ALL
  USING (company_id IN (SELECT user_company_ids()));

-- Messages: via conversation's company
CREATE POLICY messages_all ON messages FOR ALL
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE company_id IN (SELECT user_company_ids())
  ));

-- Documents: company members can CRUD
CREATE POLICY documents_all ON documents FOR ALL
  USING (company_id IN (SELECT user_company_ids()));

-- Activity log: company members can read, system can write
CREATE POLICY activity_log_select ON activity_log FOR SELECT
  USING (company_id IN (SELECT user_company_ids()));
CREATE POLICY activity_log_insert ON activity_log FOR INSERT
  WITH CHECK (company_id IN (SELECT user_company_ids()));

-- ============================================================
-- Auto-add owner as company member on company creation
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_company()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO company_members (company_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_company_created
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_company();
