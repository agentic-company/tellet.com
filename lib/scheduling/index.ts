import { createServiceSupabase } from "@/lib/supabase/server";
import { streamAgentWithTools } from "@/lib/engine";
import { getToolsForRole } from "@/lib/actions";

/**
 * Calculate the next run time from a cron expression.
 * Supports: minute hour day-of-month month day-of-week
 * Simple implementation covering common patterns.
 */
export function getNextRun(cron: string, after: Date = new Date()): Date {
  const [min, hour, dom, mon, dow] = cron.split(" ");
  const next = new Date(after);
  next.setSeconds(0, 0);
  next.setMinutes(next.getMinutes() + 1); // at least 1 min in the future

  // Try up to 366 days ahead
  for (let i = 0; i < 366 * 24 * 60; i++) {
    if (matches(next.getMinutes(), min!) &&
        matches(next.getHours(), hour!) &&
        matches(next.getDate(), dom!) &&
        matches(next.getMonth() + 1, mon!) &&
        matches(next.getDay(), dow!)) {
      return next;
    }
    next.setMinutes(next.getMinutes() + 1);
  }

  // Fallback: 24 hours from now
  return new Date(after.getTime() + 86400000);
}

function matches(value: number, pattern: string): boolean {
  if (pattern === "*") return true;
  // Handle */n (every n)
  if (pattern.startsWith("*/")) {
    const step = parseInt(pattern.slice(2));
    return value % step === 0;
  }
  // Handle comma-separated values
  if (pattern.includes(",")) {
    return pattern.split(",").map(Number).includes(value);
  }
  // Handle ranges like 1-5
  if (pattern.includes("-")) {
    const [start, end] = pattern.split("-").map(Number);
    return value >= start! && value <= end!;
  }
  return value === parseInt(pattern);
}

/**
 * Execute a single scheduled task: send prompt to agent, collect response, log result.
 */
export async function executeScheduledTask(taskId: string): Promise<{
  success: boolean;
  result?: string;
  error?: string;
}> {
  const admin = createServiceSupabase();

  // Get task + agent
  const { data: task, error: taskErr } = await admin
    .from("scheduled_tasks")
    .select("*, agents(*)")
    .eq("id", taskId)
    .single();

  if (taskErr || !task) {
    return { success: false, error: "Task not found" };
  }

  const agent = task.agents;
  if (!agent) {
    return { success: false, error: "Agent not found" };
  }

  // Create run record
  const { data: run } = await admin
    .from("scheduled_task_runs")
    .insert({ task_id: taskId, status: "running" })
    .select("id")
    .single();

  try {
    // Build tools for this agent's role
    const builtinTools = getToolsForRole(agent.role, task.company_id);

    // Stream agent response
    const stream = await streamAgentWithTools({
      agent: {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        model: agent.model || "claude-haiku-4-5",
        systemPrompt: agent.system_prompt || "",
        channels: ["scheduled"],
        tools: [],
      },
      messages: [{ role: "user", content: task.prompt }],
      builtinTools,
    });

    // Collect full response
    let result = "";
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += value.text;
    }

    // Update run as completed
    await admin
      .from("scheduled_task_runs")
      .update({ status: "completed", result, completed_at: new Date().toISOString() })
      .eq("id", run?.id);

    // Update task: last_run_at + next_run_at
    const nextRun = getNextRun(task.cron_expression);
    await admin
      .from("scheduled_tasks")
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: nextRun.toISOString(),
      })
      .eq("id", taskId);

    // Log activity
    await admin.from("activity_log").insert({
      company_id: task.company_id,
      agent_id: agent.id,
      action: "scheduled_task",
      summary: `Scheduled "${task.name}": ${result.slice(0, 120)}${result.length > 120 ? "..." : ""}`,
    });

    return { success: true, result };
  } catch (err) {
    // Mark run as failed
    await admin
      .from("scheduled_task_runs")
      .update({
        status: "failed",
        result: err instanceof Error ? err.message : "Unknown error",
        completed_at: new Date().toISOString(),
      })
      .eq("id", run?.id);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Execution failed",
    };
  }
}

/**
 * Find and execute all due tasks. Called by the cron endpoint.
 */
export async function executeDueTasks(): Promise<{
  executed: number;
  results: { taskId: string; name: string; success: boolean }[];
}> {
  const admin = createServiceSupabase();

  const { data: tasks } = await admin
    .from("scheduled_tasks")
    .select("id, name")
    .eq("enabled", true)
    .lte("next_run_at", new Date().toISOString());

  if (!tasks || tasks.length === 0) {
    return { executed: 0, results: [] };
  }

  const results = [];
  for (const task of tasks) {
    const res = await executeScheduledTask(task.id);
    results.push({ taskId: task.id, name: task.name, success: res.success });
  }

  return { executed: results.length, results };
}
