"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/Button";
import { PRICING_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <SectionWrapper id="pricing">
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-4">
          Start free. Scale when you&apos;re ready.
        </h2>
        <p className="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-16">
          No credit card required. Set up in under 5 minutes.
        </p>
      </FadeUp>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PRICING_TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            className={cn(
              "relative rounded-xl border p-6 flex flex-col",
              tier.highlighted
                ? "border-accent/50 bg-accent/5"
                : "border-border bg-bg-secondary/50"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-white">
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                {tier.name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {tier.description}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-text-tertiary">
                    {tier.period}
                  </span>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <svg
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      tier.highlighted ? "text-accent" : "text-text-tertiary"
                    )}
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
                  {feature}
                </li>
              ))}
            </ul>

            {tier.cta === "npx create-tellet" ? (
              <code className="block w-full text-center rounded-lg bg-bg-primary border border-border px-4 py-3 text-sm font-mono text-text-primary">
                $ {tier.cta}
              </code>
            ) : (
              <Button
                variant={tier.highlighted ? "primary" : "secondary"}
                className="w-full"
              >
                {tier.cta}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
