export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const FEATURES = [
  {
    title: "Agent Engine",
    description: "Hire AI agents with real roles",
    icon: "brain",
    detail: "Create, deploy, and manage AI agents powered by OpenClaw. Each agent has a defined role — from sales to support to ops.",
  },
  {
    title: "Communication Hub",
    description: "They talk where you talk",
    icon: "messages",
    detail: "Slack, Teams, Discord, Email, SMS, web chat — your agents respond on every channel your customers use.",
  },
  {
    title: "Integrations",
    description: "Connected to your stack",
    icon: "plug",
    detail: "CRM, ERP, GitHub, Jira, Google Workspace, Notion, and any custom API. Your agents work with your existing tools.",
  },
  {
    title: "Automation Studio",
    description: "No-code workflows, one-click templates",
    icon: "workflow",
    detail: "Build triggers, schedules, and multi-step automations visually. Start from templates or create your own.",
  },
  {
    title: "Dashboard",
    description: "See everything. Control everything.",
    icon: "layout",
    detail: "Monitor agent activity, track costs, review performance metrics, and approve decisions — all in one place.",
  },
  {
    title: "AI Website Builder",
    description: "Your website, built and staffed by AI",
    icon: "globe",
    detail: "AI generates your company website with built-in agent-powered customer service. SEO and content managed automatically.",
  },
] as const;

export const PAIN_POINTS = [
  { role: "Sales", pain: "Chasing leads manually" },
  { role: "Support", pain: "Answering the same questions" },
  { role: "Marketing", pain: "Creating content alone" },
  { role: "Operations", pain: "Managing everything yourself" },
  { role: "Development", pain: "Building without a team" },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Tell it what you need",
    description: "Describe your business in plain English. tellet creates your agent team automatically.",
  },
  {
    number: "02",
    title: "Watch them work",
    description: "Your agents handle sales, support, marketing, and ops. You approve what matters.",
  },
  {
    number: "03",
    title: "Scale without hiring",
    description: "Add new agents, new channels, new workflows. Your AI team grows with you.",
  },
] as const;

export const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with your first AI agents",
    features: ["3 AI agents", "Basic integrations", "Web chat channel", "Community support"],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Scale your AI workforce",
    features: ["Unlimited agents", "All integrations", "All channels", "Automation Studio", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    description: "For ambitious solo operators",
    features: ["Everything in Pro", "Dedicated support", "Custom integrations", "SLA guarantee", "White-label option"],
    cta: "Contact us",
    highlighted: false,
  },
] as const;

export const SOCIAL_LOGOS = [
  "Slack",
  "GitHub",
  "Notion",
  "Google",
  "Discord",
  "Linear",
] as const;
