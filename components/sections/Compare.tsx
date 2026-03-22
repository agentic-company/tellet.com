"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeUp } from "@/components/animations/FadeUp";
import { COMPARE_ROWS } from "@/lib/constants";

export function Compare() {
  return (
    <SectionWrapper id="compare">
      <FadeUp>
        <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-center mb-4">
          Why tellet?
        </h2>
        <p className="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-12">
          The only framework where AI sets up your AI company.
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-tertiary font-medium w-1/4" />
                <th className="text-left py-3 px-4 font-semibold text-accent">
                  tellet
                </th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">
                  Paperclip
                </th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">
                  Mission Control
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  className="border-b border-border/50"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <td className="py-3 px-4 text-text-tertiary">{row.feature}</td>
                  <td className="py-3 px-4 text-text-primary font-medium">{row.tellet}</td>
                  <td className="py-3 px-4 text-text-secondary">{row.paperclip}</td>
                  <td className="py-3 px-4 text-text-secondary">{row.mission}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeUp>
    </SectionWrapper>
  );
}
