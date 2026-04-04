import { createServiceSupabase } from "@/lib/supabase/server";
import { streamAgentWithTools } from "@/lib/engine";
import { getToolsForRole } from "./index";
import { getCompanyApiKey } from "@/lib/tellet-db";

/**
 * Delegate a task to another agent in the same company.
 * The target agent runs with its own tools (but without delegate_to_agent to prevent infinite loops).
 */
export async function delegateToAgent(
  agentName: string,
  task: string,
  companyId: string
): Promise<string> {
  try {
    const admin = createServiceSupabase();

    // Find the target agent by name (case-insensitive partial match)
    const { data: agents } = await admin
      .from("agents")
      .select("id, name, role, model, system_prompt, status")
      .eq("company_id", companyId)
      .eq("status", "active");

    if (!agents || agents.length === 0) {
      return JSON.stringify({ error: "No active agents found" });
    }

    const target = agents.find(
      (a) => a.name.toLowerCase().includes(agentName.toLowerCase())
    );

    if (!target) {
      const names = agents.map((a) => a.name).join(", ");
      return JSON.stringify({
        error: `Agent "${agentName}" not found. Available agents: ${names}`,
      });
    }

    // Get tools for target agent, but filter out delegate_to_agent to prevent loops
    const targetTools = getToolsForRole(target.role, companyId).filter(
      (t) => t.name !== "delegate_to_agent"
    );

    const apiKey = await getCompanyApiKey(companyId);

    // Run the target agent
    const stream = await streamAgentWithTools({
      agent: {
        id: target.id,
        name: target.name,
        role: target.role,
        model: target.model || "claude-haiku-4-5",
        systemPrompt: target.system_prompt || "",
        channels: ["internal"],
        tools: [],
      },
      messages: [{ role: "user", content: task }],
      builtinTools: targetTools,
      apiKey,
    });

    // Collect response
    let result = "";
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += value.text;
    }

    // Log activity
    await admin.from("activity_log").insert({
      company_id: companyId,
      agent_id: target.id,
      action: "delegation",
      summary: `Delegated task: "${task.slice(0, 80)}${task.length > 80 ? "..." : ""}"`,
    });

    return JSON.stringify({
      agent: target.name,
      role: target.role,
      response: result,
    });
  } catch (err) {
    return JSON.stringify({
      error: err instanceof Error ? err.message : "Delegation failed",
    });
  }
}
