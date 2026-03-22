import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (!agent) notFound();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("agent_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: activity } = await supabase
    .from("activity_log")
    .select("*")
    .eq("agent_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{agent.name}</h1>
          <p className="text-text-secondary text-sm mt-1 capitalize">{agent.role} Agent</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              agent.status === "active" ? "bg-green-400" : "bg-text-tertiary"
            }`}
          />
          <span className="text-sm text-text-secondary capitalize">{agent.status}</span>
        </div>
      </div>

      {/* System Prompt */}
      <div className="rounded-xl border border-border bg-bg-secondary/50 p-5">
        <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-3">
          System Prompt
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
          {agent.system_prompt}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Conversations */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Conversations ({conversations?.length || 0})
          </h2>
          {conversations && conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="rounded-lg border border-border bg-bg-secondary/30 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{conv.channel}</span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">No conversations yet.</p>
          )}
        </div>

        {/* Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Activity ({activity?.length || 0})
          </h2>
          {activity && activity.length > 0 ? (
            <div className="space-y-2">
              {activity.map((act) => (
                <div
                  key={act.id}
                  className="rounded-lg border border-border bg-bg-secondary/30 px-4 py-3"
                >
                  <p className="text-sm">{act.summary || act.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-text-tertiary">
                      {new Date(act.created_at).toLocaleString()}
                    </span>
                    {act.cost_usd > 0 && (
                      <span className="text-xs text-text-tertiary">
                        ${Number(act.cost_usd).toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
