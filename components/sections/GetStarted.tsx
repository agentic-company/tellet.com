"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";

export function GetStarted() {
  return (
    <SectionWrapper id="get-started">
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-4">
          Two ways to start
        </h2>
        <p className="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-12">
          Hosted for everyone. Self-hosted for developers. Both free.
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Hosted */}
          <div className="rounded-xl border-2 border-accent/30 bg-accent/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-accent/20">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-accent/20 text-accent px-2.5 py-0.5 text-xs font-medium">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-semibold mt-2">Hosted</h3>
              <p className="text-sm text-text-secondary mt-1">For everyone. No setup required.</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <p className="text-sm text-text-secondary">Sign up and describe your business</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <p className="text-sm text-text-secondary">AI generates your agent team instantly</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <p className="text-sm text-text-secondary">Start chatting with your AI agents</p>
              </div>
              <a
                href="/login"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
              >
                Start free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Self-hosted */}
          <div className="rounded-xl border border-border bg-bg-secondary/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-xl font-semibold mt-2">Self-hosted</h3>
              <p className="text-sm text-text-secondary mt-1">For developers. Full control.</p>
            </div>
            <div className="p-5 font-mono text-sm space-y-3">
              <div>
                <p className="text-text-tertiary mb-1 font-sans text-xs"># Create your AI company</p>
                <p className="text-text-primary">$ npx @tellet/create</p>
              </div>
              <div>
                <p className="text-text-tertiary mb-1 font-sans text-xs"># Run locally</p>
                <p className="text-text-primary">$ npm run dev</p>
              </div>
              <div>
                <p className="text-text-tertiary mb-1 font-sans text-xs"># Deploy anywhere</p>
                <p className="text-text-primary">$ vercel deploy</p>
              </div>
              <a
                href="https://github.com/agentic-company/create-tellet"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-bg-secondary border border-border px-6 py-3 text-sm font-medium text-text-primary hover:border-border-hover transition-colors font-sans"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </FadeUp>
    </SectionWrapper>
  );
}
