"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";
import { STEPS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-4">
          Three steps. That&apos;s it.
        </h2>
        <p className="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-16">
          No complex setup. No DevOps. Describe what you need and your AI team
          gets to work.
        </p>
      </FadeUp>

      <div className="relative max-w-2xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent hidden md:block" />

        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex gap-6 md:gap-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              {/* Step number */}
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-bg-secondary border border-accent/30 flex items-center justify-center">
                <span className="text-sm font-mono font-bold text-accent">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
