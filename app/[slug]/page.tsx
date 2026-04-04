import { createServiceSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTemplate, type HomepageConfig } from "@/components/homepage/templates";
import { ExternalSiteWrapper } from "@/components/homepage/ExternalSiteWrapper";

export default async function CompanyHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServiceSupabase();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, slug, description, config")
    .eq("slug", slug)
    .single();

  if (!company) notFound();

  const config = (company.config as Record<string, unknown>) || {};
  const homepage = config.homepage as HomepageConfig | undefined;

  if (!homepage?.enabled) notFound();

  // External site mode: iframe + floating chat widget
  if (homepage.externalUrl) {
    return (
      <ExternalSiteWrapper
        url={homepage.externalUrl}
        companyId={company.id}
        companyName={company.name}
      />
    );
  }

  // Template mode
  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, role, description")
    .eq("company_id", company.id)
    .eq("status", "active");

  const template = getTemplate(homepage.template);
  const Template = template.component;

  return (
    <Template
      company={{
        name: company.name,
        slug: company.slug,
        description: company.description,
      }}
      agents={agents || []}
      config={homepage}
    />
  );
}
