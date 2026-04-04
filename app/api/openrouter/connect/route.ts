import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { generatePKCE, getAuthURL } from "@/lib/openrouter/pkce";

export async function POST(request: Request) {
  const { company_id } = await request.json();

  if (!company_id) {
    return Response.json({ error: "company_id required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { verifier, challenge } = generatePKCE();

  // Store verifier in company config (more reliable than cookies across redirects)
  const admin = createServiceSupabase();
  const { data: company } = await admin
    .from("companies")
    .select("config")
    .eq("id", company_id)
    .single();

  await admin
    .from("companies")
    .update({
      config: {
        ...((company?.config as Record<string, unknown>) || {}),
        _or_verifier: verifier,
      },
    })
    .eq("id", company_id);

  const origin = request.headers.get("origin") || "https://tellet.com";
  const callbackUrl = `${origin}/api/openrouter/callback/${company_id}`;
  const authUrl = getAuthURL(callbackUrl, challenge);

  return Response.json({ url: authUrl });
}
