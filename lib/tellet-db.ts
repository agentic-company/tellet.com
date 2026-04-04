import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";

export interface TelletConfig {
  company: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  llm: {
    provider: "anthropic" | "openai";
    defaultModel: string;
  };
  agents: Array<{
    id: string;
    name: string;
    role: string;
    model: string;
    systemPrompt: string;
    tools: string[];
  }>;
}

export async function getConfig(companyId: string): Promise<TelletConfig> {
  const supabase = await createServerSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (!company) throw new Error("Company not found");

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "active");

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      description: company.description,
    },
    llm: {
      provider: "anthropic",
      defaultModel: "claude-haiku-4-5",
    },
    agents: (agents || []).map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      model: a.model || "claude-haiku-4-5",
      systemPrompt: a.system_prompt || "",
      tools: [],
    })),
  };
}

export interface CompanyLLMConfig {
  provider: "anthropic" | "openrouter";
  apiKey: string;
}

/**
 * Get the company's LLM provider config.
 * Checks for OpenRouter first (preferred), then Anthropic key.
 */
export async function getCompanyLLMConfig(companyId: string): Promise<CompanyLLMConfig | undefined> {
  const admin = createServiceSupabase();
  const { data } = await admin
    .from("companies")
    .select("config")
    .eq("id", companyId)
    .single();

  const config = data?.config as Record<string, unknown> | undefined;
  if (!config) return undefined;

  // Prefer OpenRouter if connected
  if (config.openrouter_api_key) {
    return { provider: "openrouter", apiKey: config.openrouter_api_key as string };
  }

  // Fall back to Anthropic
  if (config.anthropic_api_key) {
    return { provider: "anthropic", apiKey: config.anthropic_api_key as string };
  }

  return undefined;
}

/** @deprecated Use getCompanyLLMConfig instead */
export async function getCompanyApiKey(companyId: string): Promise<string | undefined> {
  const llm = await getCompanyLLMConfig(companyId);
  return llm?.apiKey;
}
