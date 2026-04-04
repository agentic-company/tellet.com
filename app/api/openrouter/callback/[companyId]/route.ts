import { createServiceSupabase } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/openrouter/pkce";
import { generateAgents } from "@/lib/ai/generate";
import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const admin = createServiceSupabase();

  // Get company + stored verifier
  const { data: company } = await admin
    .from("companies")
    .select("config, slug, name, description")
    .eq("id", companyId)
    .single();

  if (!company) {
    return Response.json({ error: "Company not found" }, { status: 404 });
  }

  const config = (company.config as Record<string, unknown>) || {};
  const verifier = config._or_verifier as string;

  if (!verifier) {
    return Response.json(
      { error: "Session expired. Please try connecting again." },
      { status: 400 }
    );
  }

  try {
    const apiKey = await exchangeCode(code, verifier);

    // Store key and clean up verifier
    const newConfig = { ...config, openrouter_api_key: apiKey, provider: "openrouter" };
    delete (newConfig as Record<string, unknown>)._or_verifier;

    await admin
      .from("companies")
      .update({ config: newConfig })
      .eq("id", companyId);

    // If company has no agents yet (fresh onboarding), generate them now
    const { count } = await admin
      .from("agents")
      .select("id", { count: "exact", head: true })
      .eq("company_id", companyId);

    if (count === 0 && company.description) {
      try {
        const result = await generateAgents(
          company.name,
          company.description,
          apiKey,
          "openrouter"
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
        await admin.from("agents").insert(agentRows);
      } catch (e) {
        console.error("Agent generation after OAuth failed:", e);
      }
    }

    redirect(`/${company.slug}/settings?connected=openrouter`);
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    return Response.json(
      { error: err instanceof Error ? err.message : "Connection failed" },
      { status: 500 }
    );
  }
}
