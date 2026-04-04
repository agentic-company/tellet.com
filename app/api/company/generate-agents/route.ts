import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { generateAgents } from "@/lib/ai/generate";
import { getCompanyLLMConfig } from "@/lib/tellet-db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await request.json();
  const admin = createServiceSupabase();

  // Verify ownership
  const { data: company } = await admin
    .from("companies")
    .select("id, name, description, owner_id")
    .eq("id", companyId)
    .single();

  if (!company || company.owner_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!company.description) {
    return NextResponse.json({ error: "Company has no description" }, { status: 400 });
  }

  // Get LLM config
  const llmConfig = await getCompanyLLMConfig(companyId);
  if (!llmConfig) {
    return NextResponse.json({ error: "No LLM provider configured" }, { status: 400 });
  }

  try {
    const result = await generateAgents(
      company.name,
      company.description,
      llmConfig.apiKey,
      llmConfig.provider as "anthropic" | "openrouter"
    );

    const agentRows = result.agents.map((agent) => ({
      company_id: companyId,
      name: agent.name,
      role: agent.role,
      description: agent.description,
      system_prompt: agent.systemPrompt,
      model: agent.model,
      status: "active",
    }));

    const { error: insertErr } = await admin.from("agents").insert(agentRows);
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      agents: result.agents,
      summary: result.summary,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent generation failed" },
      { status: 500 }
    );
  }
}
