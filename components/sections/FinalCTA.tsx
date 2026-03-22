"use client";

import { useState } from "react";
import { FadeUp } from "@/components/animations/FadeUp";

export function FinalCTA() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText("npx @tellet/create");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 lg:py-32 px-6">
      <FadeUp>
        <div
          className="mx-auto max-w-[1200px] rounded-2xl p-12 lg:p-20 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.1) 50%, rgba(139,92,246,0.05) 100%)",
          }}
        >
          <div className="absolute inset-0 border border-accent/20 rounded-2xl pointer-events-none" />

          <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-4 relative">
            Build your AI company now.
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto relative">
            One command. Your infrastructure. Zero cost to start.
          </p>
          <div className="relative">
            <button
              onClick={copy}
              className="inline-flex items-center gap-3 rounded-xl bg-bg-secondary border border-border hover:border-accent/50 px-6 py-4 transition-all cursor-pointer"
            >
              <span className="text-text-tertiary font-mono text-sm">$</span>
              <code className="font-mono text-lg text-text-primary">
                npx @tellet/create
              </code>
              <span className="text-text-tertiary">
                {copied ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
