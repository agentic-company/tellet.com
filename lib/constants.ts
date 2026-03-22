export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Compare", href: "#compare" },
  { label: "Docs", href: "https://github.com/agentic-company/create-tellet#readme" },
] as const;

export const FEATURES = [
  {
    title: "AI-Generated Agents",
    description: "Describe your business, get a team",
    icon: "brain",
    detail: "No YAML. No config files. Just tell tellet what your business does — AI creates agents with tailored system prompts, roles, and models.",
  },
  {
    title: "Pluggable LLM Routing",
    description: "Any model, any provider, per agent",
    icon: "workflow",
    detail: "Anthropic, OpenAI, OpenRouter, Google — use different models for different agents. CS on Haiku, marketing on GPT-4.1, code review on Opus.",
  },
  {
    title: "Multi-Channel",
    description: "Web chat, Slack, Email, and more",
    icon: "messages",
    detail: "Start with the built-in chat widget. Add Slack, email, Discord, or WhatsApp with a single command: tellet add slack.",
  },
  {
    title: "Dashboard Included",
    description: "Monitor, manage, control",
    icon: "layout",
    detail: "A full management dashboard comes built-in. Track agent activity, review conversations, monitor costs — all in a dark minimal UI.",
  },
  {
    title: "OpenClaw Ready",
    description: "Upgrade to advanced orchestration",
    icon: "plug",
    detail: "Start with the lightweight default engine. When you need multi-agent workflows, cron jobs, or persistent memory — upgrade to OpenClaw with one command.",
  },
  {
    title: "Your Infrastructure",
    description: "Zero vendor lock-in, $0 to start",
    icon: "globe",
    detail: "Runs on your own Vercel + Supabase (both free tier). MIT licensed. You own everything — code, data, agents.",
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Run one command",
    description: "npx @tellet/create — answer a few questions about your business. That's it.",
  },
  {
    number: "02",
    title: "AI builds your team",
    description: "Claude analyzes your business and generates 3-5 agents with custom system prompts tailored to your needs.",
  },
  {
    number: "03",
    title: "Deploy and go live",
    description: "npm run dev to preview. vercel deploy to go live. Your AI company is operational.",
  },
] as const;

export const COMPARE_ROWS = [
  { feature: "Setup", tellet: "One command", paperclip: "YAML config files", mission: "Sales demo" },
  { feature: "Agent creation", tellet: "AI auto-generates", paperclip: "Manual definition", mission: "Consultant setup" },
  { feature: "Target user", tellet: "Any entrepreneur", paperclip: "Developers", mission: "Enterprises" },
  { feature: "Infrastructure", tellet: "Your Vercel + Supabase", paperclip: "Your Node + PostgreSQL", mission: "Their cloud" },
  { feature: "LLM choice", tellet: "Per-agent routing", paperclip: "OpenClaw default", mission: "Fixed" },
  { feature: "Cost to start", tellet: "$0", paperclip: "$0", mission: "Contact sales" },
  { feature: "License", tellet: "MIT", paperclip: "MIT", mission: "Proprietary" },
] as const;
