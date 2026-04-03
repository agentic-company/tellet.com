"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "describe" | "generating" | "done";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
}

interface OnboardingResult {
  company: { id: string; slug: string; name: string };
  agents: Agent[];
  industry: string;
  summary: string;
}

const ROLE_COLORS: Record<string, string> = {
  customer_support: "bg-blue-500/20 text-blue-400",
  marketing: "bg-purple-500/20 text-purple-400",
  sales: "bg-green-500/20 text-green-400",
  operations: "bg-orange-500/20 text-orange-400",
  development: "bg-cyan-500/20 text-cyan-400",
  analytics: "bg-pink-500/20 text-pink-400",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("describe");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!companyName.trim() || description.trim().length < 20) return;

    setStep("generating");
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data: OnboardingResult = await res.json();
      setResult(data);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("describe");
    }
  };

  const goToDashboard = () => {
    if (result) {
      router.push(`/${result.company.slug}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold">
            <span className="text-text-primary">tel</span>
            <span className="text-highlight">let</span>
          </h1>
        </div>

        {/* Step 1: Describe your business */}
        {step === "describe" && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-2">
              Tell us about your business
            </h2>
            <p className="text-text-secondary text-center mb-8">
              We&apos;ll create an AI team tailored to your needs.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">
                  Company name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Sunny Coffee"
                  className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1.5">
                  Describe your business
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="We sell specialty coffee online and in our two shops in Seoul. Our customers are young professionals who care about ethically sourced beans..."
                  rows={4}
                  className="w-full rounded-lg bg-bg-secondary border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none"
                />
                <p className="text-xs text-text-tertiary mt-1">
                  {description.length < 20
                    ? `At least 20 characters (${description.length}/20)`
                    : "The more detail, the better your AI team."}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!companyName.trim() || description.trim().length < 20}
                className="w-full rounded-lg bg-accent hover:bg-accent-hover px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Generate my AI team
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Generating */}
        {step === "generating" && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
              <svg
                className="w-8 h-8 text-accent animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Building your AI team...
            </h2>
            <p className="text-text-secondary">
              Analyzing your business and creating specialized agents.
            </p>
          </div>
        )}

        {/* Step 3: Done */}
        {step === "done" && result && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2">Your team is ready!</h2>
              <p className="text-text-secondary">{result.summary}</p>
            </div>

            <div className="space-y-3 mb-8">
              {result.agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 rounded-xl bg-bg-secondary border border-border p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                    {agent.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{agent.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[agent.role] || "bg-bg-tertiary text-text-secondary"}`}
                      >
                        {agent.role.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 truncate">
                      {agent.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToDashboard}
              className="w-full rounded-lg bg-accent hover:bg-accent-hover px-4 py-3 text-sm font-medium text-white transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
