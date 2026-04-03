"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/chat/Markdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function OrchestratorFullPage({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolStatus]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setStreaming(true);
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          company_id: companyId,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder
          .decode(value)
          .split("\n")
          .filter((l) => l.startsWith("data: "))) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.text) {
              setMessages((p) => {
                const u = [...p];
                const last = u[u.length - 1];
                if (last.role === "assistant")
                  u[u.length - 1] = { ...last, content: last.content + data.text };
                return u;
              });
            }

            if (data.tool) {
              setToolStatus(
                data.status === "running"
                  ? `Running ${data.tool.replace("_", " ")}...`
                  : null
              );
            }

            if (data.error) {
              setMessages((p) => {
                const u = [...p];
                u[u.length - 1] = { role: "assistant", content: `Error: ${data.error}` };
                return u;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((p) => {
        const u = [...p];
        u[u.length - 1] = { role: "assistant", content: "Connection error." };
        return u;
      });
    } finally {
      setStreaming(false);
      setToolStatus(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Orchestrator</h1>
        <p className="text-text-secondary text-sm mt-1">
          Manage {companyName} with natural language
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <p className="text-text-secondary">
              Ask me anything about your company
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {[
                "Show my stats",
                "List all agents",
                "Show recent conversations",
                "Add knowledge about our refund policy",
                "Update the customer support agent's prompt",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "rounded-xl px-4 py-3 max-w-[70%] text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-accent text-white"
                  : "bg-bg-secondary text-text-primary border border-border"
              )}
            >
              {m.content ? (
                <Markdown content={m.content} />
              ) : (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}

        {toolStatus && (
          <div className="flex items-center gap-2 text-xs text-accent">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {toolStatus}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-3 pt-3 border-t border-border"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell the orchestrator what to do..."
          disabled={streaming}
          className="flex-1 rounded-xl bg-bg-secondary border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="rounded-xl bg-accent px-5 py-3 text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 cursor-pointer transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
