import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OrchestratorChat } from "@/components/dashboard/OrchestratorChat";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/onboarding");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar companyName={company.name} slug={company.slug} />
      <main className="flex-1 overflow-y-auto bg-bg-primary">
        <div className="p-8">{children}</div>
      </main>
      <OrchestratorChat companyId={company.id} />
    </div>
  );
}
