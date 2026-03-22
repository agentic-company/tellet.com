"use client";

import { FadeUp } from "@/components/animations/FadeUp";
import { SOCIAL_LOGOS } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="py-12 px-6 border-y border-border">
      <FadeUp>
        <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Powered by</span>
            <span className="text-sm font-semibold text-text-primary">
              OpenClaw
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-bg-secondary border border-border px-2.5 py-0.5 text-xs text-text-secondary">
              <svg
                className="w-3 h-3 text-highlight"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              60k+
            </span>
          </div>

          <div className="flex items-center gap-6">
            {SOCIAL_LOGOS.map((name) => (
              <span
                key={name}
                className="text-xs font-medium text-text-tertiary uppercase tracking-wider"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
