import { createServiceSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

const ROLE_COLORS: Record<string, string> = {
  customer_support: "bg-blue-500/20 text-blue-400",
  marketing: "bg-purple-500/20 text-purple-400",
  sales: "bg-green-500/20 text-green-400",
  operations: "bg-orange-500/20 text-orange-400",
  development: "bg-cyan-500/20 text-cyan-400",
  analytics: "bg-pink-500/20 text-pink-400",
};

export default async function CompanyHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .single();

  if (!company) notFound();

  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, role, description, status")
    .eq("company_id", company.id)
    .eq("status", "active");

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {company.name[0]}
            </div>
            <h1 className="text-lg font-semibold">{company.name}</h1>
          </div>
          <Link
            href="/"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Powered by <span className="text-text-secondary">tel</span>
            <span className="text-accent">let</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* About */}
        {company.description && (
          <section className="mb-12">
            <p className="text-lg text-text-secondary leading-relaxed">
              {company.description}
            </p>
          </section>
        )}

        {/* AI Team */}
        {agents && agents.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              Our AI Team
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-xl border border-border bg-bg-secondary/50 p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[agent.role] || "bg-bg-tertiary text-text-secondary"}`}
                      >
                        {agent.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  {agent.description && (
                    <p className="text-sm text-text-secondary mt-2">
                      {agent.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat CTA */}
        <section className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 rounded-xl border border-border bg-bg-secondary/50 px-8 py-6">
            <p className="text-sm text-text-secondary">
              Have a question? Chat with our AI team.
            </p>
            <div className="text-xs text-text-tertiary">
              Widget coming soon — or embed it on your own site.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-text-tertiary">
          Powered by{" "}
          <Link href="/" className="text-accent hover:underline">
            tellet.com
          </Link>{" "}
          — AI agents that run your business
        </div>
      </footer>
    </div>
  );
}
