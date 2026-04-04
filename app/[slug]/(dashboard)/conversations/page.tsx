import Link from "next/link";
import { createServiceSupabase } from "@/lib/supabase/server";

export default async function ConversationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!company) return null;

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*, agents(name), messages(count)")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
      {conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/${slug}/conversations/${c.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-bg-secondary/50 p-4 hover:border-border-hover transition-colors"
            >
              <div className="flex-1">
                <span className="font-medium text-sm">
                  {(c.agents as { name: string })?.name}
                </span>
                <span className="text-xs text-text-tertiary ml-2">
                  via {c.channel}
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                {(c.messages as { count: number }[])?.[0]?.count || 0} messages
              </span>
              <span className="text-xs text-text-tertiary">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-bg-secondary/20 p-8 text-center">
          <p className="text-text-secondary text-sm">No conversations yet.</p>
          <p className="text-text-tertiary text-xs mt-2">
            Start chatting with an agent from the Dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
