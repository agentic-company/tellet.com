"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";

const lines = [
  { text: "$ npx create-tellet", type: "command" },
  { text: "", type: "blank" },
  { text: "  ? What would you like to do?", type: "prompt" },
  { text: "  > New — Build a new AI company", type: "input" },
  { text: "", type: "blank" },
  { text: "  ? Deployment mode:", type: "prompt" },
  { text: "  > Cloud — Railway ($5/mo)", type: "input" },
  { text: "", type: "blank" },
  { text: "  ? What's your company name?", type: "prompt" },
  { text: "  > Sunny Coffee", type: "input" },
  { text: "", type: "blank" },
  { text: "  Generating your AI team and website...", type: "spinner" },
  { text: "", type: "blank" },
  { text: "  Your team:", type: "success" },
  { text: "  Barista  CS  ·  Roaster  Marketing  ·  Grinder  Sales", type: "agent" },
  { text: "  Your website:", type: "success" },
  { text: '  "Coffee worth waking up for"', type: "agent" },
  { text: "", type: "blank" },
  { text: "  ✓ Project created!", type: "success" },
  { text: "  docker compose up → localhost:3000", type: "success" },
] as const;

const typeColors: Record<string, string> = {
  command: "text-text-primary font-bold",
  prompt: "text-accent",
  input: "text-highlight",
  spinner: "text-text-tertiary italic",
  success: "text-green-400",
  agent: "text-text-secondary",
  blank: "",
};

export function TerminalDemo() {
  return (
    <SectionWrapper>
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-4">
          See it in action
        </h2>
        <p className="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-12">
          One command. A few questions. Your AI company is live.
        </p>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-bg-secondary/80 overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-secondary">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-text-tertiary font-mono">
              Terminal
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 font-mono text-sm leading-relaxed">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className={`${typeColors[line.type] || ""} ${line.type === "blank" ? "h-3" : ""}`}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>
    </SectionWrapper>
  );
}
