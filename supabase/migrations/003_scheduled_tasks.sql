-- Scheduled tasks for agent automation
CREATE TABLE scheduled_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  cron_expression text NOT NULL,       -- e.g. "0 9 * * 1" (Mon 9am)
  prompt text NOT NULL,                -- the message sent to the agent
  enabled boolean DEFAULT true,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX scheduled_tasks_company_idx ON scheduled_tasks(company_id);
CREATE INDEX scheduled_tasks_next_run_idx ON scheduled_tasks(next_run_at) WHERE enabled = true;

-- Task run history
CREATE TABLE scheduled_task_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES scheduled_tasks(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  result text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX task_runs_task_idx ON scheduled_task_runs(task_id);

-- RLS
ALTER TABLE scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_task_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY scheduled_tasks_all ON scheduled_tasks FOR ALL
  USING (company_id IN (SELECT user_company_ids()));

CREATE POLICY task_runs_all ON scheduled_task_runs FOR ALL
  USING (task_id IN (
    SELECT id FROM scheduled_tasks WHERE company_id IN (SELECT user_company_ids())
  ));
