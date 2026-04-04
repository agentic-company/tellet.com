import Link from "next/link";
import type { TemplateProps } from "./index";

export function GradientTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#050510] text-white selection:bg-violet-500/30">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-fuchsia-500/[0.04] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#050510]/60 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500/80 to-cyan-400/80 flex items-center justify-center text-[11px] font-bold">
              {company.name[0]}
            </div>
            <span className="text-[13px] font-medium">{company.name}</span>
          </div>
          <Link href="/" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">
            tellet.com
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent">
          {config.tagline || company.name}
        </h1>
        {config.tagline && company.description && (
          <p className="mt-6 text-base text-white/35 max-w-lg mx-auto leading-relaxed">
            {company.description}
          </p>
        )}
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24 space-y-28">
        {/* About */}
        {sections.includes("about") && config.about && (
          <section className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 sm:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-violet-400/80 mb-5">About</p>
              <p className="text-[16px] text-white/55 leading-[1.85] whitespace-pre-line">
                {config.about}
              </p>
            </div>
          </section>
        )}

        {/* Team */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400/80 mb-8 text-center">Team</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 flex items-center justify-center text-[12px] font-semibold text-white/60 group-hover:from-violet-500/30 group-hover:to-cyan-400/30 transition-all duration-300">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium">{agent.name}</p>
                      <p className="text-[11px] text-white/25 capitalize">{agent.role.replace("_", " ")}</p>
                    </div>
                  </div>
                  {agent.description && (
                    <p className="text-[12px] text-white/30 leading-relaxed">{agent.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat */}
        {sections.includes("chat") && (
          <section className="text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-8 py-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[13px] text-white/50">AI team online — ready to help</p>
            </div>
          </section>
        )}

        {/* Contact */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
          <section className="max-w-md mx-auto text-center space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-violet-400/80 mb-5">Contact</p>
            {config.contact.email && (
              <a href={`mailto:${config.contact.email}`} className="block text-[15px] text-white/50 hover:text-violet-300 transition-colors">
                {config.contact.email}
              </a>
            )}
            {config.contact.phone && <p className="text-[14px] text-white/30">{config.contact.phone}</p>}
            {config.contact.address && <p className="text-[14px] text-white/30">{config.contact.address}</p>}
          </section>
        )}
      </main>

      <footer className="border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-[11px] text-white/15">
          Powered by <Link href="/" className="text-violet-400/60 hover:text-violet-400 transition-colors">tellet</Link>
        </div>
      </footer>
    </div>
  );
}
