import Link from "next/link";
import type { TemplateProps } from "./index";

export function MinimalTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1a1a1a]">
      {/* Header */}
      <header className="max-w-2xl mx-auto px-6 pt-16 pb-4">
        <p className="text-sm text-[#999] tracking-wide">{company.name}</p>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-20">
        {/* Hero — just text */}
        <section>
          {config.tagline ? (
            <h1 className="text-3xl sm:text-4xl font-light leading-snug text-[#333]">
              {config.tagline}
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-4xl font-light leading-snug text-[#333]">
              {company.name}
            </h1>
          )}
        </section>

        {/* About */}
        {sections.includes("about") && config.about && (
          <section>
            <p className="text-base text-[#666] leading-[1.8] whitespace-pre-line">
              {config.about}
            </p>
          </section>
        )}

        {/* Divider */}
        {sections.includes("team") && agents.length > 0 && (
          <div className="border-t border-[#e5e5e5]" />
        )}

        {/* Team — clean list */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <p className="text-xs text-[#999] uppercase tracking-[0.2em] mb-8">Team</p>
            <div className="space-y-6">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#f0f0ee] flex items-center justify-center text-sm font-medium text-[#999] flex-shrink-0 mt-0.5">
                    {agent.name[0]}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-[#bbb] capitalize">
                        {agent.role.replace("_", " ")}
                      </p>
                    </div>
                    {agent.description && (
                      <p className="text-sm text-[#888] mt-1 leading-relaxed">
                        {agent.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat */}
        {sections.includes("chat") && (
          <>
            <div className="border-t border-[#e5e5e5]" />
            <section>
              <p className="text-sm text-[#888]">
                Questions? Our AI team is here to help.
              </p>
            </section>
          </>
        )}

        {/* Contact */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
            <>
              <div className="border-t border-[#e5e5e5]" />
              <section className="space-y-2">
                <p className="text-xs text-[#999] uppercase tracking-[0.2em] mb-4">Contact</p>
                {config.contact.email && (
                  <p className="text-sm">
                    <a href={`mailto:${config.contact.email}`} className="text-[#1a1a1a] underline underline-offset-4 decoration-[#ddd] hover:decoration-[#999]">
                      {config.contact.email}
                    </a>
                  </p>
                )}
                {config.contact.phone && (
                  <p className="text-sm text-[#666]">{config.contact.phone}</p>
                )}
                {config.contact.address && (
                  <p className="text-sm text-[#666]">{config.contact.address}</p>
                )}
              </section>
            </>
          )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs text-[#ccc]">
          Powered by{" "}
          <Link href="/" className="text-[#999] hover:text-[#666] transition-colors">
            tellet.com
          </Link>
        </p>
      </footer>
    </div>
  );
}
