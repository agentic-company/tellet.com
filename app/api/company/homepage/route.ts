import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId, homepage } = await request.json();
  const admin = createServiceSupabase();

  const { data: company } = await admin
    .from("companies")
    .select("id, config, owner_id")
    .eq("id", companyId)
    .single();

  if (!company || company.owner_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const config = {
    ...((company.config as Record<string, unknown>) || {}),
    homepage,
  };

  const { error } = await admin
    .from("companies")
    .update({ config })
    .eq("id", companyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
