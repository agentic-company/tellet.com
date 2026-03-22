export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "GitHub", href: "https://github.com/agentic-company/create-tellet" },
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
    description: "npx create-tellet — answer a few questions about your business. That's it.",
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

export const PRICING_TIERS = [
  {
    name: "Community",
    price: "Free",
    period: "forever",
    description: "Full framework, no limits",
    features: [
      "Unlimited agents",
      "Web chat channel",
      "Anthropic provider",
      "Dashboard included",
      "MIT licensed",
    ],
    cta: "npx create-tellet",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Premium templates & channels",
    features: [
      "Everything in Community",
      "Slack & Email channels",
      "OpenAI & OpenRouter",
      "Premium agent templates",
      "Priority support",
    ],
    cta: "Coming soon",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams & agencies",
    features: [
      "Everything in Pro",
      "Custom agent development",
      "OpenClaw orchestration",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact us",
    highlighted: false,
  },
] as const;

export const ARCHITECTURE_LAYERS = [
  { name: "Engine", options: ["Default", "OpenClaw"], default: "Default" },
  { name: "LLM", options: ["Anthropic", "OpenAI", "OpenRouter", "Google"], default: "Anthropic" },
  { name: "Channels", options: ["Web Chat", "Slack", "Email", "Discord"], default: "Web Chat" },
  { name: "Storage", options: ["Supabase", "PostgreSQL", "SQLite"], default: "Supabase" },
] as const;
