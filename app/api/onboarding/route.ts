import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { generateAgents } from "@/lib/ai/generate";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyName, description, apiKey, provider } = await request.json();

  if (!companyName || !description) {
    return NextResponse.json(
      { error: "Company name and description are required" },
      { status: 400 }
    );
  }

  // OpenRouter flow: create company only (agents generated after OAuth)
  const isOpenRouter = provider === "openrouter";

  if (!isOpenRouter && !apiKey) {
    return NextResponse.json(
      { error: "API key is required for Anthropic provider" },
      { status: 400 }
    );
  }

  // Use service role client for DB writes (bypasses RLS)
  const admin = createServiceSupabase();

  // Generate slug from company name
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check slug availability
  const { data: existing } = await admin
    .from("companies")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  // Create company
  const { data: company, error: companyError } = await admin
    .from("companies")
    .insert({
      name: companyName,
      slug: finalSlug,
      description,
      owner_id: user.id,
      config: isOpenRouter
        ? { provider: "openrouter" }
        : { anthropic_api_key: apiKey, provider: "anthropic" },
    })
    .select()
    .single();

  if (companyError) {
    console.error("Company creation error:", companyError);
    return NextResponse.json(
      { error: `Failed to create company: ${companyError.message}` },
      { status: 500 }
    );
  }

  // Add user as company member
  await admin.from("company_members").insert({
    company_id: company.id,
    user_id: user.id,
    role: "owner",
  });

  // OpenRouter: return company now, agents will be generated after OAuth callback
  if (isOpenRouter) {
    return NextResponse.json({
      company: { id: company.id, slug: finalSlug, name: companyName },
      agents: [],
      industry: "",
      summary: "Connect OpenRouter to start using your AI team.",
    });
  }

  // Generate agents with AI
  try {
    const result = await generateAgents(companyName, description, apiKey);

    // Insert agents into DB
    const agentRows = result.agents.map((agent) => ({
      company_id: company.id,
      name: agent.name,
      role: agent.role,
      description: agent.description,
      system_prompt: agent.systemPrompt,
      model: agent.model,
      status: "active",
    }));

    const { error: agentsError } = await admin
      .from("agents")
      .insert(agentRows);

    if (agentsError) {
      console.error("Agents insertion error:", agentsError);
      return NextResponse.json(
        { error: `Failed to save agents: ${agentsError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      company: { id: company.id, slug: finalSlug, name: companyName },
      agents: result.agents,
      industry: result.industry,
      summary: result.summary,
    });
  } catch (err) {
    console.error("Agent generation error:", err);
    // Cleanup company if agent generation fails
    await admin.from("companies").delete().eq("id", company.id);
    return NextResponse.json(
      { error: `Failed to generate agents: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
