import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      {/* Profile */}
      <div className="rounded-xl border border-border bg-bg-secondary/50 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <div className="grid gap-4">
          <div>
            <label className="text-sm text-text-secondary">Email</label>
            <p className="text-sm font-medium mt-1">
              {user?.user?.email || "—"}
            </p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Provider</label>
            <p className="text-sm font-medium mt-1 capitalize">
              {user?.user?.app_metadata?.provider || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-border bg-bg-secondary/50 p-6 space-y-4">
        <h2 className="text-lg font-semibold">API Keys</h2>
        <p className="text-sm text-text-secondary">
          Configure your API keys for agent integrations.
        </p>
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Anthropic API</p>
              <p className="text-xs text-text-tertiary">Claude models for agents</p>
            </div>
            <span className="text-xs text-green-400">Configured via env</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">GitHub</p>
              <p className="text-xs text-text-tertiary">PR reviews & issue management</p>
            </div>
            <span className="text-xs text-text-tertiary">Not configured</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Resend</p>
              <p className="text-xs text-text-tertiary">Email notifications & outreach</p>
            </div>
            <span className="text-xs text-text-tertiary">Not configured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
