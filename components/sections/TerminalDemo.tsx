"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";

const lines = [
  { text: "  You: \"I run a coffee shop called Sunny Coffee\"", type: "command" },
  { text: "", type: "blank" },
  { text: "  Generating your AI team...", type: "spinner" },
  { text: "", type: "blank" },
  { text: "  Your team:", type: "success" },
  { text: "  Barista  CS  ·  Roaster  Marketing  ·  Grinder  Sales", type: "agent" },
  { text: "", type: "blank" },
  { text: "  What they can do:", type: "success" },
  { text: "  ✓ Answer customers via chat & email", type: "agent" },
  { text: "  ✓ Delegate tasks to each other", type: "agent" },
  { text: "  ✓ Run scheduled automations", type: "agent" },
  { text: "  ✓ Search your knowledge base", type: "agent" },
  { text: "", type: "blank" },
  { text: "  Embed on your site:", type: "success" },
  { text: "  <script src=\"tellet.com/widget.js\"></script>", type: "agent" },
  { text: "", type: "blank" },
  { text: "  ✓ Your AI company is live!", type: "success" },
  { text: "  tellet.com/sunny-coffee/dashboard", type: "success" },
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
          One sentence. AI builds your team. They start working.
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
