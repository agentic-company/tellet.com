import { createServerSupabase } from "@/lib/supabase/server";

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
