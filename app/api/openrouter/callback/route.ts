import { cookies } from "next/headers";
import { createServiceSupabase } from "@/lib/supabase/server";
import { exchangeCode } from "@/lib/openrouter/pkce";
import { generateAgents } from "@/lib/ai/generate";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "No code provided" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const verifier = cookieStore.get("or_verifier")?.value;
  const companyId = cookieStore.get("or_company_id")?.value;

  if (!verifier || !companyId) {
    return Response.json(
      { error: "Session expired. Please try connecting again." },
      { status: 400 }
    );
  }

  // Clean up cookies
  cookieStore.delete("or_verifier");
  cookieStore.delete("or_company_id");

  try {
    const apiKey = await exchangeCode(code, verifier);

    // Store in company config
    const admin = createServiceSupabase();
    const { data: company } = await admin
      .from("companies")
      .select("config, slug, name, description")
      .eq("id", companyId)
      .single();

    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }

    const config = {
      ...(company.config as Record<string, unknown> || {}),
      openrouter_api_key: apiKey,
      provider: "openrouter",
    };

    await admin
      .from("companies")
      .update({ config })
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
        // Non-fatal — user can still use the dashboard
      }
    }

    redirect(`/${company.slug}/settings?connected=openrouter`);
  } catch (err) {
    // Next.js redirect() throws internally — re-throw it
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    return Response.json(
      { error: err instanceof Error ? err.message : "Connection failed" },
      { status: 500 }
    );
  }
}
