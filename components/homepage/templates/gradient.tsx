import Link from "next/link";
import type { TemplateProps } from "./index";

const ROLE_ICONS: Record<string, string> = {
  customer_support: "CS",
  marketing: "MK",
  sales: "SL",
  operations: "OP",
  development: "DV",
  analytics: "AN",
};

export function GradientTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero with gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-500/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-500/10 to-transparent rounded-full blur-3xl" />

        <header className="relative max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center font-bold text-sm">
              {company.name[0]}
            </div>
            <span className="font-semibold">{company.name}</span>
          </div>
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Powered by tellet
          </Link>
        </header>

        <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            {company.name}
          </h1>
          {config.tagline && (
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              {config.tagline}
            </p>
          )}
        </section>
      </div>

      <main className="max-w-5xl mx-auto px-6 -mt-16 space-y-20 pb-20">
        {/* About — glass card */}
        {sections.includes("about") && config.about && (
          <section className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
                About
              </h2>
              <p className="text-lg text-white/70 leading-relaxed whitespace-pre-line">
                {config.about}
              </p>
            </div>
          </section>
        )}

        {/* Team — gradient border cards */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-6 text-center">
              AI Team
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent.id} className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/20 to-white/5">
                  <div className="rounded-2xl bg-[#0a0a0f] p-6 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 flex items-center justify-center text-xs font-bold text-violet-300">
                        {ROLE_ICONS[agent.role] || agent.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-white/40 capitalize">
                          {agent.role.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    {agent.description && (
                      <p className="text-sm text-white/50 leading-relaxed">
                        {agent.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat CTA */}
        {sections.includes("chat") && (
          <section className="text-center">
            <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-10 py-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <p className="text-sm text-white/60">
                Chat with our AI team anytime.
              </p>
            </div>
          </section>
        )}

        {/* Contact */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-6 text-center">
                Contact
              </h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 max-w-md mx-auto space-y-3">
                {config.contact.email && (
                  <p className="text-sm text-center">
                    <a href={`mailto:${config.contact.email}`} className="text-cyan-400 hover:underline">
                      {config.contact.email}
                    </a>
                  </p>
                )}
                {config.contact.phone && (
                  <p className="text-sm text-white/60 text-center">{config.contact.phone}</p>
                )}
                {config.contact.address && (
                  <p className="text-sm text-white/60 text-center">{config.contact.address}</p>
                )}
              </div>
            </section>
          )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-white/30">
          Powered by{" "}
          <Link href="/" className="text-violet-400 hover:underline">
            tellet.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
