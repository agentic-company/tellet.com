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
    detail: "Manage agents, schedule tasks, check stats, update knowledge — all by chatting. Your Orchestrator is the CEO interface to your AI company.",
  },
  {
    title: "Agents That Act",
    description: "Email, delegate, search, automate",
    icon: "plug",
    detail: "Agents don't just chat — they send emails via Resend, delegate tasks to each other, and search your knowledge base. Role-based tools mean each agent gets exactly what it needs.",
  },
  {
    title: "Team Collaboration",
    description: "Agents work together automatically",
    icon: "messages",
    detail: "Your support agent can delegate billing questions to sales. Marketing can ask analytics for data. Agents route tasks to the right teammate — no manual handoffs.",
  },
  {
    title: "Scheduled Automation",
    description: "Cron tasks, zero babysitting",
    icon: "layout",
    detail: "Schedule any agent to run on a cron. Daily reports, weekly summaries, automated follow-ups — set it once through the Orchestrator and it runs on autopilot.",
  },
  {
    title: "Embed Anywhere",
    description: "One script tag, any website",
    icon: "globe",
    detail: "Add your AI agents to any website with a single script tag. Dark/light theme, streaming responses, session persistence — your customers get instant help.",
  },
  {
    title: "Knowledge Base",
    description: "Your agents know your business",
    icon: "workflow",
    detail: "Vector-powered knowledge base with pgvector. Add product info, policies, and FAQ — agents reference them to give accurate, grounded answers.",
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Describe your business",
    description: "Sign up on tellet.com or run npx @tellet/create. Tell us what you do in a sentence or two. That's it.",
  },
  {
    number: "02",
    title: "AI builds your team",
    description: "AI generates 3-5 specialized agents with role-based tools: email, knowledge search, and inter-agent delegation — all tailored to your business.",
  },
  {
    number: "03",
    title: "Your agents go to work",
    description: "Agents answer customers, send emails, delegate tasks to each other, and run scheduled automations. Manage everything through the Orchestrator.",
  },
] as const;

export const COMPARE_ROWS = [
  { feature: "Setup", tellet: "Describe your business", paperclip: "Git clone + config", mission: "Sales demo" },
  { feature: "Agent creation", tellet: "AI auto-generates", paperclip: "Manual definition", mission: "Consultant setup" },
  { feature: "Agent actions", tellet: "Email, delegate, schedule", paperclip: "Chat only", mission: "Custom integrations" },
  { feature: "Agent collaboration", tellet: "Built-in delegation", paperclip: "Manual routing", mission: "Workflow builder" },
  { feature: "Embed widget", tellet: "One script tag", paperclip: "Manual integration", mission: "SDK required" },
  { feature: "Scheduling", tellet: "Cron via Orchestrator", paperclip: "External cron", mission: "Enterprise scheduler" },
  { feature: "Management", tellet: "Orchestrator (chat)", paperclip: "Dashboard UI", mission: "Enterprise UI" },
  { feature: "Cost to start", tellet: "$0", paperclip: "$0", mission: "Contact sales" },
] as const;
