import { redirect } from "next/navigation";
import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
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

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Use service role to read company (bypasses RLS)
  const admin = createServiceSupabase();
  const { data: company } = await admin
    .from("companies")
    .select("id, name, slug, owner_id")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/onboarding");

  // Verify user belongs to this company
  const { data: membership } = await admin
    .from("company_members")
    .select("user_id")
    .eq("company_id", company.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) redirect("/onboarding");

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
