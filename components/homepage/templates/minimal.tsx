import Link from "next/link";
import type { TemplateProps } from "./index";

export function MinimalTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#fdfdfc] text-[#1a1a1a] selection:bg-[#1a1a1a]/10">
      {/* Nav */}
      <nav className="max-w-xl mx-auto px-6 pt-12 pb-4 flex items-center justify-between">
        <span className="text-[13px] font-normal text-[#aaa] tracking-wide">{company.name}</span>
        <Link href="/" className="text-[10px] text-[#ccc] hover:text-[#999] transition-colors uppercase tracking-[0.15em]">
          tellet
        </Link>
      </nav>

      <main className="max-w-xl mx-auto px-6 pt-16 pb-24">
        {/* Hero */}
        <section className="mb-20">
          <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] font-normal leading-[1.4] tracking-[-0.01em] text-[#2a2a2a]">
            {config.tagline || company.name}
          </h1>
        </section>

        <div className="space-y-16">
          {/* About */}
          {sections.includes("about") && config.about && (
            <section>
              <p className="text-[15px] text-[#777] leading-[2] whitespace-pre-line font-light">
                {config.about}
              </p>
            </section>
          )}

          {/* Team */}
          {sections.includes("team") && agents.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#bbb] mb-8">Team</p>
              <div className="space-y-0">
                {agents.map((agent, i) => (
                  <div key={agent.id}>
                    {i > 0 && <div className="border-t border-[#f0f0ee] my-0" />}
                    <div className="py-5">
                      <div className="flex items-baseline gap-4">
                        <span className="text-[14px] font-normal text-[#333]">{agent.name}</span>
                        <span className="text-[11px] text-[#ccc] capitalize">{agent.role.replace("_", " ")}</span>
                      </div>
                      {agent.description && (
                        <p className="text-[13px] text-[#999] mt-2 leading-[1.7] font-light">{agent.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Chat */}
          {sections.includes("chat") && (
            <section className="py-8 border-t border-b border-[#f0f0ee]">
              <p className="text-[13px] text-[#aaa] font-light">
                Questions? Our team is here to help.
              </p>
            </section>
          )}

          {/* Contact */}
          {sections.includes("contact") &&
            (config.contact.email || config.contact.phone || config.contact.address) && (
            <section>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#bbb] mb-6">Contact</p>
              <div className="space-y-1.5">
                {config.contact.email && (
                  <a href={`mailto:${config.contact.email}`} className="block text-[14px] text-[#555] underline underline-offset-[3px] decoration-[#e0e0e0] hover:decoration-[#999] transition-colors">
                    {config.contact.email}
                  </a>
                )}
                {config.contact.phone && <p className="text-[14px] text-[#999] font-light">{config.contact.phone}</p>}
                {config.contact.address && <p className="text-[14px] text-[#999] font-light">{config.contact.address}</p>}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="max-w-xl mx-auto px-6 pb-12">
        <p className="text-[10px] text-[#ddd] tracking-wide">
          <Link href="/" className="hover:text-[#aaa] transition-colors">tellet.com</Link>
        </p>
      </footer>
    </div>
  );
}
