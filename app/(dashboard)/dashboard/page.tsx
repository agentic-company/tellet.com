import { createClient } from "@/lib/supabase/server";

const roleColors: Record<string, string> = {
  cs: "bg-green-500/10 text-green-400 border-green-500/20",
  marketing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  sales: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  devops: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const roleLabels: Record<string, string> = {
  cs: "Customer Support",
  marketing: "Marketing",
  sales: "Sales",
  devops: "DevOps",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: agents } = await supabase.from("agents").select("*").order("created_at");
  const { data: recentActivity } = await supabase
    .from("activity_log")
    .select("*, agents(name, role)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back{user?.user?.email ? `, ${user.user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Your AI team is ready. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents?.map((agent) => (
          <a
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="rounded-xl border border-border bg-bg-secondary/50 p-5 hover:border-border-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold">{agent.name}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${roleColors[agent.role] || ""}`}
              >
                {roleLabels[agent.role] || agent.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  agent.status === "active" ? "bg-green-400" : "bg-text-tertiary"
                }`}
              />
              <span className="text-xs text-text-secondary capitalize">
                {agent.status}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-bg-secondary/30 px-4 py-3"
              >
                <span
                  className={`mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold ${
                    roleColors[(activity.agents as { role: string })?.role] || "bg-bg-tertiary text-text-secondary"
                  }`}
                >
                  AI
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium text-text-primary">
                      {(activity.agents as { name: string })?.name}
                    </span>{" "}
                    <span className="text-text-secondary">
                      {activity.summary || activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                {activity.cost_usd > 0 && (
                  <span className="text-xs text-text-tertiary">
                    ${Number(activity.cost_usd).toFixed(4)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border border-dashed bg-bg-secondary/20 p-8 text-center">
            <p className="text-text-secondary text-sm">
              No activity yet. Your agents are ready to work.
            </p>
            <p className="text-text-tertiary text-xs mt-1">
              Activity will appear here as your agents handle tasks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
