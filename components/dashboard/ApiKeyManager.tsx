"use client";

import { useState } from "react";

export function ApiKeyManager({
  companyId,
  hasKey,
}: {
  companyId: string;
  hasKey: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentHasKey, setCurrentHasKey] = useState(hasKey);

  const handleSave = async () => {
    if (!newKey.trim()) return;
    setSaving(true);
    const res = await fetch("/api/company/update-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_id: companyId, api_key: newKey }),
    });

    if (res.ok) {
      setSaved(true);
      setEditing(false);
      setNewKey("");
      setCurrentHasKey(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Anthropic API Key</p>
          <p className="text-xs text-text-tertiary">
            {currentHasKey ? "sk-ant-...configured" : "Not configured"}
          </p>
        </div>
        {saved && (
          <span className="text-xs text-green-400">Saved</span>
        )}
      </div>

      {editing ? (
        <div className="flex gap-2">
          <input
            type="password"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="flex-1 rounded-lg bg-bg-secondary border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent font-mono"
          />
          <button
            onClick={handleSave}
            disabled={!newKey.trim() || saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-40 cursor-pointer"
          >
            {saving ? "..." : "Save"}
          </button>
          <button
            onClick={() => { setEditing(false); setNewKey(""); }}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-accent hover:underline cursor-pointer"
        >
          {currentHasKey ? "Update key" : "Add API key"}
        </button>
      )}

      <p className="text-xs text-text-tertiary">
        Get your key at{" "}
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          console.anthropic.com
        </a>
      </p>
    </div>
  );
}
