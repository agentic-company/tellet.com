import Link from "next/link";
import type { TemplateProps } from "./index";

const ROLE_COLORS: Record<string, string> = {
  customer_support: "from-blue-500 to-blue-600",
  marketing: "from-fuchsia-500 to-purple-600",
  sales: "from-emerald-500 to-green-600",
  operations: "from-amber-500 to-orange-600",
  development: "from-sky-500 to-cyan-600",
  analytics: "from-rose-500 to-pink-600",
};

export function BoldTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight">{company.name}</h1>
        <Link
          href="/"
          className="text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          tellet
        </Link>
      </header>

      {/* Hero — full-width color block */}
      <section className="bg-gradient-to-r from-accent to-violet-600 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl sm:text-6xl font-black leading-tight max-w-3xl">
            {config.tagline || company.name}
          </h2>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* About — large text */}
        {sections.includes("about") && config.about && (
          <section>
            <div className="grid sm:grid-cols-[200px_1fr] gap-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 pt-1">
                About
              </h3>
              <p className="text-xl sm:text-2xl text-white/70 leading-relaxed font-light whitespace-pre-line">
                {config.about}
              </p>
            </div>
          </section>
        )}

        {/* Team — large cards with color accent */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-8">
              The Team
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {agents.map((agent) => {
                const gradient = ROLE_COLORS[agent.role] || "from-gray-500 to-gray-600";
                return (
                  <div
                    key={agent.id}
                    className="rounded-2xl bg-white/5 p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-black text-lg text-white`}>
                        {agent.name[0]}
                      </div>
                      <div>
                        <p className="font-bold">{agent.name}</p>
                        <p className="text-sm text-white/40 capitalize font-medium">
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
                );
              })}
            </div>
          </section>
        )}

        {/* Chat CTA — bold banner */}
        {sections.includes("chat") && (
          <section>
            <div className="rounded-2xl bg-gradient-to-r from-accent to-violet-600 p-8 sm:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-black mb-3">Talk to us</h3>
              <p className="text-white/70">
                Our AI team is ready to help — anytime.
              </p>
            </div>
          </section>
        )}

        {/* Contact — grid */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-8">
                Contact
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {config.contact.email && (
                  <div className="rounded-xl bg-white/5 p-5">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Email</p>
                    <a href={`mailto:${config.contact.email}`} className="text-sm font-medium text-accent hover:underline">
                      {config.contact.email}
                    </a>
                  </div>
                )}
                {config.contact.phone && (
                  <div className="rounded-xl bg-white/5 p-5">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Phone</p>
                    <p className="text-sm font-medium">{config.contact.phone}</p>
                  </div>
                )}
                {config.contact.address && (
                  <div className="rounded-xl bg-white/5 p-5">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Location</p>
                    <p className="text-sm font-medium">{config.contact.address}</p>
                  </div>
                )}
              </div>
            </section>
          )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm font-black text-white/20">{company.name}</span>
          <span className="text-xs text-white/20">
            Powered by{" "}
            <Link href="/" className="text-accent hover:underline">
              tellet.com
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
