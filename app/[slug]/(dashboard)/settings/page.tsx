import { createServiceSupabase } from "@/lib/supabase/server";
import { DeleteCompanyButton } from "@/components/dashboard/DeleteCompanyButton";
import { ProviderManager } from "@/components/dashboard/ProviderManager";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!company) return null;

  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, role, model, status")
    .eq("company_id", company.id);

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="rounded-xl border border-border bg-bg-secondary/50 p-6 space-y-3">
        <h2 className="text-lg font-semibold">Company</h2>
        <div className="grid gap-2">
          <div>
            <span className="text-sm text-text-secondary">Name:</span>{" "}
            <span className="text-sm font-medium ml-2">{company.name}</span>
          </div>
          <div>
            <span className="text-sm text-text-secondary">Slug:</span>{" "}
            <span className="text-sm font-medium ml-2">{company.slug}</span>
          </div>
          {company.description && (
            <div>
              <span className="text-sm text-text-secondary">Description:</span>{" "}
              <span className="text-sm font-medium ml-2">{company.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 space-y-3">
        <h2 className="text-lg font-semibold">LLM Provider</h2>
        <ProviderManager
          companyId={company.id}
          currentProvider={((company.config as Record<string, unknown>)?.provider as string) || null}
          hasAnthropicKey={!!(company.config as Record<string, unknown>)?.anthropic_api_key}
        />
      </div>

      <div className="rounded-xl border border-border bg-bg-secondary/50 p-6 space-y-3">
        <h2 className="text-lg font-semibold">Infrastructure</h2>
        <div className="grid gap-2">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Platform</p>
              <p className="text-xs text-text-tertiary">tellet.com Hosted</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">LLM Provider</p>
              <p className="text-xs text-text-tertiary">Anthropic / claude-haiku-4-5</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Storage</p>
              <p className="text-xs text-text-tertiary">Supabase (managed)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-secondary/50 p-6 space-y-3">
        <h2 className="text-lg font-semibold">Agents ({agents?.length || 0})</h2>
        <div className="grid gap-2">
          {(agents || []).map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{agent.name}</p>
                <p className="text-xs text-text-tertiary capitalize">
                  {agent.role.replace("_", " ")} &middot; {agent.model}
                </p>
              </div>
              <span
                className={`text-xs ${agent.status === "active" ? "text-green-400" : "text-text-tertiary"}`}
              >
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="text-sm text-text-secondary">
          Permanently delete this company and all associated data.
        </p>
        <DeleteCompanyButton companyId={company.id} companyName={company.name} />
      </div>
    </div>
  );
}
