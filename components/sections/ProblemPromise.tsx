"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";
import { PAIN_POINTS } from "@/lib/constants";

const agentNames = ["Alex", "Sam", "Jordan", "Riley", "Casey"];

export function ProblemPromise() {
  return (
    <SectionWrapper>
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-16">
          You&apos;re one person.
          <br />
          <span className="text-text-secondary">What if you had a team?</span>
        </h2>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Pain side */}
        <FadeUp delay={0.1}>
          <div className="space-y-4">
            <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-6">
              Today
            </p>
            {PAIN_POINTS.map((item, i) => (
              <motion.div
                key={item.role}
                className="flex items-center gap-4 rounded-lg border border-border bg-bg-secondary/50 px-5 py-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <span className="text-sm font-medium text-text-primary w-24">
                  {item.role}
                </span>
                <span className="text-sm text-text-tertiary">{item.pain}</span>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* Promise side */}
        <FadeUp delay={0.2}>
          <div className="space-y-4">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-6">
              With tellet
            </p>
            {PAIN_POINTS.map((item, i) => (
              <motion.div
                key={item.role}
                className="flex items-center gap-4 rounded-lg border border-accent/20 bg-accent/5 px-5 py-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
              >
                <span className="text-sm font-medium text-text-primary w-24">
                  {item.role}
                </span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                    AI
                  </span>
                  <span className="text-sm text-accent">
                    Agent {agentNames[i]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.4}>
        <p className="text-center mt-16 text-lg text-text-secondary">
          tellet gives you a full AI team.{" "}
          <span className="text-text-primary font-medium">
            You stay the founder.
          </span>
        </p>
      </FadeUp>
    </SectionWrapper>
  );
}
