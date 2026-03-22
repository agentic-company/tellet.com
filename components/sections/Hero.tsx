"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ParticleGrid } from "@/components/animations/ParticleGrid";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.08) 0%, transparent 70%)",
        }}
      />

      <ParticleGrid />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
            <span className="text-text-primary">Tell </span>
            <span className="text-accent">it</span>
            <span className="text-text-primary">.</span>
            <br />
            <span className="text-text-primary">Let </span>
            <span className="text-highlight">it</span>
            <span className="text-text-primary">.</span>
          </h1>
        </motion.div>

        <motion.p
          className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          Your AI workforce that actually runs your business.
          <br className="hidden sm:block" />
          Not a chatbot. Not a dashboard.{" "}
          <span className="text-text-primary font-medium">A team.</span>
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <Button variant="primary" href="#pricing">
            Start for free
          </Button>
          <Button variant="ghost" href="#how-it-works">
            See how it works &darr;
          </Button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
}
