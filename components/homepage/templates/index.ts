import { ComponentType } from "react";
import { DefaultTemplate } from "./default";

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
    description: "Clean layout with hero, team section, and contact info",
    component: DefaultTemplate,
  },
  // Future templates:
  // { id: "minimal", name: "Minimal", description: "...", component: MinimalTemplate },
  // { id: "bold", name: "Bold", description: "...", component: BoldTemplate },
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
