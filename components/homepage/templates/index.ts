import { ComponentType } from "react";
import { DefaultTemplate } from "./default";
import { GradientTemplate } from "./gradient";
import { MinimalTemplate } from "./minimal";
import { BoldTemplate } from "./bold";

export interface HomepageConfig {
  enabled: boolean;
  template: string;
  tagline: string;
  about: string;
  sections: string[];
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface TemplateProps {
  company: {
    name: string;
    slug: string;
    description: string | null;
  };
  agents: {
    id: string;
    name: string;
    role: string;
    description: string | null;
  }[];
  config: HomepageConfig;
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  component: ComponentType<TemplateProps>;
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "default",
    name: "Classic",
    description: "Clean dark theme, grid-based layout, refined typography",
    component: DefaultTemplate,
  },
  {
    id: "gradient",
    name: "Aura",
    description: "Ambient glows, frosted glass, ethereal dark aesthetic",
    component: GradientTemplate,
  },
  {
    id: "minimal",
    name: "Paper",
    description: "Light, editorial feel — whitespace-forward, elegant type",
    component: MinimalTemplate,
  },
  {
    id: "bold",
    name: "Impact",
    description: "Full-bleed color hero, oversized type, high contrast",
    component: BoldTemplate,
  },
];

export function getTemplate(id: string): TemplateInfo {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0]!;
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  enabled: false,
  template: "default",
  tagline: "",
  about: "",
  sections: ["about", "team", "chat"],
  contact: {},
};
