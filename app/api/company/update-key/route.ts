import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { company_id, api_key } = await request.json();

  if (!company_id || !api_key) {
    return Response.json({ error: "company_id and api_key required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceSupabase();

  // Get current company config
  const { data: company } = await admin
    .from("companies")
    .select("id, owner_id, config")
    .eq("id", company_id)
    .single();

  if (!company) {
    return Response.json({ error: "Company not found" }, { status: 404 });
  }

  if (company.owner_id !== user.id) {
    return Response.json({ error: "Only the owner can update the API key" }, { status: 403 });
  }

  // Merge into existing config
  const config = { ...(company.config as Record<string, unknown> || {}), anthropic_api_key: api_key };

  const { error } = await admin
    .from("companies")
    .update({ config })
    .eq("id", company_id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
