import { createClient } from "@/lib/supabase/server";

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*, agents(name, role)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>

      {conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-bg-secondary/50 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {(conv.agents as { name: string })?.name}
                  </span>
                  <span className="text-xs text-text-tertiary">via {conv.channel}</span>
                </div>
              </div>
              <span className="text-xs text-text-tertiary">
                {new Date(conv.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border border-dashed bg-bg-secondary/20 p-8 text-center">
          <p className="text-text-secondary text-sm">No conversations yet.</p>
          <p className="text-text-tertiary text-xs mt-1">
            Conversations will appear here when visitors chat with your agents.
          </p>
        </div>
      )}
    </div>
  );
}
