import { createServiceSupabase } from "@/lib/supabase/server";
import { AgentsListClient } from "@/components/dashboard/AgentsListClient";

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!company) return null;

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
      <AgentsListClient agents={agents || []} companyId={company.id} />
    </div>
  );
}
