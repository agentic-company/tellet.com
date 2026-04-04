"use client";

import { useState } from "react";

export function ExternalSiteWrapper({
  url,
  companyId,
  companyName,
}: {
  url: string;
  companyId: string;
  companyName: string;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));

  // Fetch first active agent
  const fetchAgent = async (): Promise<string | null> => {
    if (agentId) return agentId;
    try {
      const res = await fetch(`/api/widget/config?company_id=${companyId}`);
      const data = await res.json();
      if (data.agent?.id) {
        setAgentId(data.agent.id);
        return data.agent.id;
      }
    } catch { /* ignore */ }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const resolvedAgentId = await fetchAgent();
    if (!resolvedAgentId) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/widget/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          agent_id: resolvedAgentId,
          company_id: companyId,
          session_id: sessionId,
        }),
      });
      const reader = res.body?.getReader();
      if (!reader) return;

      let agentText = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                agentText += parsed.text;
                setMessages((m) => {
                  const updated = [...m];
                  updated[updated.length - 1] = { role: "assistant", content: agentText };
                  return updated;
                });
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* External site iframe */}
      <iframe
        src={url}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        title="Website"
      />

      {/* Floating chat button */}
      {!chatOpen && (
        <button
          onClick={() => { setChatOpen(true); fetchAgent(); }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover shadow-2xl flex items-center justify-center transition-all cursor-pointer z-50 hover:scale-105"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center text-[11px] font-bold text-accent">
                {companyName[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{companyName}</p>
                <p className="text-[10px] text-white/40">AI assistant</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-white/30 text-center mt-8">Ask us anything</p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-white"
                      : "bg-white/[0.06] text-white/80"
                  }`}
                >
                  {msg.content || (loading && i === messages.length - 1 ? (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:300ms]" />
                    </span>
                  ) : "")}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/[0.06]">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-accent hover:bg-accent-hover flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
