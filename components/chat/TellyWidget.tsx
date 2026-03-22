"use client";

import { useEffect, useState } from "react";
import { ChatWidget } from "./ChatWidget";

export function TellyWidget() {
  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((agents) => {
        const telly = agents.find(
          (a: { role: string }) => a.role === "cs"
        );
        if (telly) setAgentId(telly.id);
      })
      .catch(() => {});
  }, []);

  if (!agentId) return null;

  return <ChatWidget agentId={agentId} />;
}
