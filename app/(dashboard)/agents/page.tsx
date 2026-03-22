import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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

export default async function AgentsPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase.from("agents").select("*").order("created_at");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
      </div>

      <div className="grid gap-4">
        {agents?.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="flex items-center gap-4 rounded-xl border border-border bg-bg-secondary/50 p-5 hover:border-border-hover transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent text-sm font-bold">
              {agent.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{agent.name}</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${roleColors[agent.role]}`}
                >
                  {roleLabels[agent.role]}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-1 truncate">
                {agent.system_prompt.slice(0, 100)}...
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  agent.status === "active" ? "bg-green-400" : "bg-text-tertiary"
                }`}
              />
              <span className="text-xs text-text-secondary capitalize">{agent.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
