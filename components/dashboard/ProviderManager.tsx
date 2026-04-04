"use client";

import { useState } from "react";
import { ApiKeyManager } from "./ApiKeyManager";

export function ProviderManager({
  companyId,
  currentProvider,
  hasAnthropicKey,
}: {
  companyId: string;
  currentProvider: string | null;
  hasAnthropicKey: boolean;
}) {
  const [connecting, setConnecting] = useState(false);
  const [tab, setTab] = useState<"openrouter" | "anthropic">(
    currentProvider === "anthropic" || hasAnthropicKey ? "anthropic" : "openrouter"
  );

  const connectOpenRouter = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/openrouter/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start connection");
        setConnecting(false);
      }
    } catch {
      alert("Connection failed");
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Provider tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("openrouter")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            tab === "openrouter"
              ? "bg-accent text-white"
              : "bg-bg-secondary border border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          OpenRouter
        </button>
        <button
          onClick={() => setTab("anthropic")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            tab === "anthropic"
              ? "bg-accent text-white"
              : "bg-bg-secondary border border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          Anthropic API Key
        </button>
      </div>

      {tab === "openrouter" && (
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            Connect your OpenRouter account to access 300+ models (Claude, GPT, Gemini, Llama, Mistral...).
            One login, all providers.
          </p>

          {currentProvider === "openrouter" ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-green-400 font-medium">Connected</span>
              <button
                onClick={connectOpenRouter}
                className="ml-auto text-sm text-accent hover:underline cursor-pointer"
              >
                Reconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectOpenRouter}
              disabled={connecting}
              className="rounded-lg bg-accent hover:bg-accent-hover px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              {connecting ? "Connecting..." : "Connect OpenRouter"}
            </button>
          )}

          <p className="text-xs text-text-tertiary">
            Don&apos;t have an account?{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Sign up at openrouter.ai
            </a>{" "}
            — free models available.
          </p>
        </div>
      )}

      {tab === "anthropic" && (
        <ApiKeyManager companyId={companyId} hasKey={hasAnthropicKey} />
      )}
    </div>
  );
}
