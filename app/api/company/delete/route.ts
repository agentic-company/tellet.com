import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";

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

  const admin = createServiceSupabase();

  // Verify user is the owner
  const { data: company } = await admin
    .from("companies")
    .select("id, owner_id")
    .eq("id", company_id)
    .single();

  if (!company) {
    return Response.json({ error: "Company not found" }, { status: 404 });
  }

  if (company.owner_id !== user.id) {
    return Response.json(
      { error: "Only the owner can delete a company" },
      { status: 403 }
    );
  }

  // CASCADE handles agents, conversations, messages, documents, activity_log, scheduled_tasks
  const { error } = await admin
    .from("companies")
    .delete()
    .eq("id", company_id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
