"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";

export function GetStarted() {
  return (
    <SectionWrapper id="get-started">
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-4">
          Get started in 60 seconds
        </h2>
        <p className="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-12">
          Free forever. MIT licensed. No account needed.
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-bg-secondary/80 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-secondary">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-text-tertiary font-mono">Quickstart</span>
          </div>
          <div className="p-5 font-mono text-sm space-y-4">
            <div>
              <p className="text-text-tertiary mb-1"># 1. Create your AI company</p>
              <p className="text-text-primary">$ npx @tellet/create</p>
            </div>
            <div>
              <p className="text-text-tertiary mb-1"># 2. Install and run</p>
              <p className="text-text-primary">$ cd your-company</p>
              <p className="text-text-primary">$ npm install</p>
              <p className="text-text-primary">$ npm run dev</p>
            </div>
            <div>
              <p className="text-text-tertiary mb-1"># 3. Deploy to production</p>
              <p className="text-text-primary">$ vercel deploy</p>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-green-400">
                Your AI company is live.
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a
            href="https://github.com/agentic-company/create-tellet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star on GitHub
          </a>
          <a
            href="https://github.com/agentic-company/create-tellet#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-bg-secondary border border-border px-6 py-3 text-sm font-medium text-text-primary hover:border-border-hover transition-colors"
          >
            Read the Docs
          </a>
        </div>
      </FadeUp>
    </SectionWrapper>
  );
}
