import Link from "next/link";
import type { TemplateProps } from "./index";

export function DefaultTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-white/20">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-[11px] font-semibold text-white/80">
              {company.name[0]}
            </div>
            <span className="text-[13px] font-medium text-white/90">{company.name}</span>
          </div>
          <Link href="/" className="text-[11px] text-white/25 hover:text-white/40 transition-colors">
            tellet.com
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] max-w-3xl">
          {config.tagline || company.name}
        </h1>
        {config.tagline && company.description && (
          <p className="mt-5 text-base text-white/40 max-w-xl leading-relaxed">
            {company.description}
          </p>
        )}
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24 space-y-24">
        {/* About */}
        {sections.includes("about") && config.about && (
          <section className="grid sm:grid-cols-[1fr_2fr] gap-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/30 pt-1">About</p>
            <p className="text-[17px] text-white/60 leading-[1.75] whitespace-pre-line">
              {config.about}
            </p>
          </section>
        )}

        {/* Team */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/30 mb-8">Team</p>
            <div className="grid gap-px bg-white/[0.06] rounded-xl overflow-hidden">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-[#09090b] p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-[12px] font-medium text-white/50 flex-shrink-0">
                    {agent.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-medium">{agent.name}</span>
                      <span className="text-[11px] text-white/25 capitalize">{agent.role.replace("_", " ")}</span>
                    </div>
                    {agent.description && (
                      <p className="text-[13px] text-white/35 mt-1 leading-relaxed">{agent.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat */}
        {sections.includes("chat") && (
          <section className="rounded-xl border border-white/[0.06] p-8 text-center">
            <p className="text-[15px] text-white/50">Need help? Our AI team is available 24/7.</p>
          </section>
        )}

        {/* Contact */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
          <section className="grid sm:grid-cols-[1fr_2fr] gap-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/30 pt-1">Contact</p>
            <div className="space-y-2">
              {config.contact.email && (
                <a href={`mailto:${config.contact.email}`} className="block text-[15px] text-white/60 hover:text-white transition-colors">
                  {config.contact.email}
                </a>
              )}
              {config.contact.phone && <p className="text-[15px] text-white/40">{config.contact.phone}</p>}
              {config.contact.address && <p className="text-[15px] text-white/40">{config.contact.address}</p>}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between text-[11px] text-white/20">
          <span>{company.name}</span>
          <Link href="/" className="hover:text-white/40 transition-colors">Powered by tellet</Link>
        </div>
      </footer>
    </div>
  );
}
