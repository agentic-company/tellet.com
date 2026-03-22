"use client";

import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
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
            Your AI team is waiting.
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto relative">
            Join thousands of solo founders who scaled their business with
            tellet.
          </p>
          <div className="relative">
            <Button variant="primary" href="#pricing">
              Start for free
            </Button>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
