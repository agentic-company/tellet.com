import Link from "next/link";
import type { TemplateProps } from "./index";

const ROLE_BG: Record<string, string> = {
  customer_support: "bg-blue-500",
  marketing: "bg-fuchsia-500",
  sales: "bg-emerald-500",
  operations: "bg-amber-500",
  development: "bg-sky-500",
  analytics: "bg-rose-500",
};

export function BoldTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-white/20">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-base font-black tracking-[-0.02em]">{company.name}</span>
        <Link href="/" className="text-[10px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-[0.15em]">
          tellet
        </Link>
      </nav>

      {/* Hero — accent stripe */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7]" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.95] tracking-[-0.04em] max-w-4xl">
            {config.tagline || company.name}
          </h1>
          {config.tagline && company.description && (
            <p className="mt-6 text-lg text-white/60 max-w-xl font-light">{company.description}</p>
          )}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-28">
        {/* About */}
        {sections.includes("about") && config.about && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-8">About</p>
            <p className="text-xl sm:text-2xl text-white/55 leading-[1.7] font-light max-w-3xl whitespace-pre-line">
              {config.about}
            </p>
          </section>
        )}

        {/* Team — bento grid */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-8">Team</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => {
                const accent = ROLE_BG[agent.role] || "bg-zinc-500";
                return (
                  <div
                    key={agent.id}
                    className="rounded-2xl bg-white/[0.04] p-6 hover:bg-white/[0.07] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center text-base font-black text-white`}>
                        {agent.name[0]}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold tracking-[-0.01em]">{agent.name}</p>
                        <p className="text-[11px] text-white/30 capitalize font-medium">{agent.role.replace("_", " ")}</p>
                      </div>
                    </div>
                    {agent.description && (
                      <p className="text-[13px] text-white/35 leading-relaxed font-light">{agent.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Chat — accent block */}
        {sections.includes("chat") && (
          <section>
            <div className="rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] p-10 sm:p-14">
              <h3 className="text-2xl sm:text-3xl font-black tracking-[-0.03em] mb-2">Talk to us</h3>
              <p className="text-white/60 font-light">Our AI team is online 24/7.</p>
            </div>
          </section>
        )}

        {/* Contact */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-8">Contact</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {config.contact.email && (
                <div className="rounded-xl bg-white/[0.04] p-5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-2">Email</p>
                  <a href={`mailto:${config.contact.email}`} className="text-[14px] font-medium text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                    {config.contact.email}
                  </a>
                </div>
              )}
              {config.contact.phone && (
                <div className="rounded-xl bg-white/[0.04] p-5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-2">Phone</p>
                  <p className="text-[14px] font-medium">{config.contact.phone}</p>
                </div>
              )}
              {config.contact.address && (
                <div className="rounded-xl bg-white/[0.04] p-5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-2">Location</p>
                  <p className="text-[14px] font-medium">{config.contact.address}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-[11px] text-white/15">
          <span className="font-black">{company.name}</span>
          <Link href="/" className="hover:text-white/30 transition-colors">Powered by tellet</Link>
        </div>
      </footer>
    </div>
  );
}
