import { createServiceSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("company_id");

  if (!companyId) {
    return Response.json({ error: "company_id required" }, { status: 400 });
  }

  const admin = createServiceSupabase();

  const { data: company } = await admin
    .from("companies")
    .select("id, name")
    .eq("id", companyId)
    .single();

  if (!company) {
    return Response.json({ error: "Company not found" }, { status: 404 });
  }

  // Get the first active customer-facing agent
  const { data: agents } = await admin
    .from("agents")
    .select("id, name, role, description")
    .eq("company_id", companyId)
    .eq("status", "active")
    .in("role", ["customer_support", "receptionist", "concierge", "sales"])
    .limit(1);

  const agent = agents?.[0];

  return Response.json(
    {
      company: { id: company.id, name: company.name },
      agent: agent
        ? { id: agent.id, name: agent.name, role: agent.role, description: agent.description }
        : null,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    }
  );
}
