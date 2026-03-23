export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Compare", href: "#compare" },
  { label: "Docs", href: "https://github.com/agentic-company/create-tellet#readme" },
] as const;

export const FEATURES = [
  {
    title: "AI Orchestrator",
    description: "Run your company through conversation",
    icon: "brain",
    detail: "Talk to your Orchestrator to manage agents, update your website, check stats, and install tools. No code needed — just tell it what to do.",
  },
  {
    title: "Knowledge Base",
    description: "Your agents know your business",
    icon: "messages",
    detail: "Vector-powered knowledge base with pgvector. Add product info, policies, and FAQ — your agents reference them to give accurate answers.",
  },
  {
    title: "Tool Marketplace",
    description: "Stripe, Email, Slack, GitHub, Notion",
    icon: "plug",
    detail: "One command to connect tools. Orchestrator auto-assigns to the right agents. Powered by MCP — 19,000+ integrations available.",
  },
  {
    title: "3-Tier Deployment",
    description: "Free to enterprise, you choose",
    icon: "globe",
    detail: "Quick Start (Vercel, free), Cloud (Railway/Docker, $5/mo), or Enterprise (AWS CDK). No vendor lock-in — switch anytime.",
  },
  {
    title: "Connect Mode",
    description: "Add AI to your existing business",
    icon: "workflow",
    detail: "Already have a website? Use Connect mode. Embed our chat widget with one script tag. Your agents, your data, your infrastructure.",
  },
  {
    title: "Autonomous Agents",
    description: "Scheduled tasks, zero babysitting",
    icon: "layout",
    detail: "Set up cron schedules for your agents. Daily marketing reports, weekly analytics, automated customer follow-ups — all running on autopilot.",
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Run one command",
    description: "npx @tellet/create — choose New or Connect, pick your cloud, answer a few questions. 60 seconds.",
  },
  {
    number: "02",
    title: "AI builds everything",
    description: "AI generates your agent team, website, dashboard, and Knowledge Base — all tailored to your specific business.",
  },
  {
    number: "03",
    title: "Talk to your Orchestrator",
    description: "Manage your AI company through conversation. Install tools, update content, schedule tasks — all by chatting with the Orchestrator.",
  },
] as const;

export const COMPARE_ROWS = [
  { feature: "Setup", tellet: "One command", paperclip: "Git clone + config", mission: "Sales demo" },
  { feature: "Agent creation", tellet: "AI auto-generates", paperclip: "Manual definition", mission: "Consultant setup" },
  { feature: "Management", tellet: "Orchestrator (chat)", paperclip: "Dashboard UI", mission: "Enterprise UI" },
  { feature: "Existing business", tellet: "Connect mode + widget", paperclip: "Manual integration", mission: "Legacy adapters" },
  { feature: "Tool ecosystem", tellet: "MCP marketplace", paperclip: "Plugin system", mission: "Built-in only" },
  { feature: "Deployment", tellet: "Free / Cloud / AWS", paperclip: "Self-hosted only", mission: "Their cloud" },
  { feature: "Target user", tellet: "Anyone (non-dev OK)", paperclip: "Developers", mission: "Enterprises" },
  { feature: "Cost to start", tellet: "$0", paperclip: "$0", mission: "Contact sales" },
] as const;
