import { createServerSupabase } from "@/lib/supabase/server";
import { addDocument, searchKnowledge, listDocuments, deleteDocument } from "@/lib/mcp/knowledge";
import { TOOL_REGISTRY } from "@/lib/mcp/registry";

export async function executeTool(
  name: string,
  input: Record<string, unknown>,
  companyId?: string
): Promise<string> {
  const supabase = await createServerSupabase();

  switch (name) {
    case "list_agents": {
      const query = supabase
        .from("agents")
        .select("id, name, role, status, model")
        .order("created_at");
      const { data } = await (companyId ? query.eq("company_id", companyId) : query);
      return JSON.stringify(data || []);
    }

    case "get_stats": {
      let convQuery = supabase.from("conversations").select("*", { count: "exact", head: true });
      let msgQuery = supabase.from("messages").select("*", { count: "exact", head: true });
      let agentQuery = supabase.from("agents").select("id, status");
      let costQuery = supabase.from("activity_log").select("cost_usd");

      if (companyId) {
        convQuery = convQuery.eq("company_id", companyId);
        agentQuery = agentQuery.eq("company_id", companyId);
        costQuery = costQuery.eq("company_id", companyId);
      }

      const [
        { count: conversations },
        { count: messages },
        { data: agents },
        { data: costData },
      ] = await Promise.all([convQuery, msgQuery, agentQuery, costQuery]);

      const activeAgents = (agents || []).filter((a) => a.status === "active").length;
      const totalCost = (costData || []).reduce(
        (sum, r) => sum + Number(r.cost_usd || 0),
        0
      );
      return JSON.stringify({
        conversations: conversations || 0,
        messages: messages || 0,
        activeAgents,
        totalAgents: agents?.length || 0,
        estimatedCost: `$${totalCost.toFixed(2)}`,
      });
    }

    case "update_agent_prompt": {
      const { agent_id, system_prompt } = input as {
        agent_id: string;
        system_prompt: string;
      };
      const { error } = await supabase
        .from("agents")
        .update({ system_prompt })
        .eq("id", agent_id);
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ success: true, agent_id });
    }

    case "get_recent_conversations": {
      const limit = (input.limit as number) || 10;
      let query = supabase
        .from("conversations")
        .select("id, channel, created_at, agents(name, role)")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (companyId) query = query.eq("company_id", companyId);
      const { data } = await query;
      return JSON.stringify(data || []);
    }

    case "add_knowledge": {
      const { title, content, category } = input as {
        title: string;
        content: string;
        category?: string;
      };
      return addDocument(title, content, category, companyId);
    }

    case "search_knowledge": {
      return searchKnowledge(input.query as string, companyId);
    }

    case "list_knowledge": {
      return listDocuments(companyId);
    }

    case "delete_knowledge": {
      return deleteDocument(input.document_id as string);
    }

    case "list_available_tools": {
      return JSON.stringify(
        TOOL_REGISTRY.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          category: t.category,
          compatibleRoles: t.compatibleRoles,
        }))
      );
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
