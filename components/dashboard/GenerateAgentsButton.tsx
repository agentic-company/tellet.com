"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateAgentsButton({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/company/generate-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate agents");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary">
        No agents yet. Generate your AI team based on your business description.
      </p>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-lg bg-accent hover:bg-accent-hover px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Generating..." : "Generate AI Team"}
      </button>
    </div>
  );
}
