import { createServerSupabase } from "@/lib/supabase/server";
import { OrchestratorFullPage } from "./OrchestratorFullPage";

export default async function OrchestratorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!company) return null;

  return <OrchestratorFullPage companyId={company.id} companyName={company.name} />;
}
