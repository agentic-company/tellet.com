import Link from "next/link";
import type { TemplateProps } from "./index";

const ROLE_COLORS: Record<string, string> = {
  customer_support: "bg-blue-500/20 text-blue-400",
  marketing: "bg-purple-500/20 text-purple-400",
  sales: "bg-green-500/20 text-green-400",
  operations: "bg-orange-500/20 text-orange-400",
  development: "bg-cyan-500/20 text-cyan-400",
  analytics: "bg-pink-500/20 text-pink-400",
};

export function DefaultTemplate({ company, agents, config }: TemplateProps) {
  const sections = config.sections;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {company.name[0]}
            </div>
            <h1 className="text-lg font-semibold">{company.name}</h1>
          </div>
          <Link
            href="/"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Powered by <span className="text-text-secondary">tel</span>
            <span className="text-accent">let</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h2 className="text-4xl font-bold mb-4">{company.name}</h2>
        {config.tagline && (
          <p className="text-xl text-text-secondary">{config.tagline}</p>
        )}
      </section>

      <main className="max-w-4xl mx-auto px-6 pb-12 space-y-16">
        {/* About */}
        {sections.includes("about") && config.about && (
          <section>
            <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              About
            </h3>
            <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
              {config.about}
            </p>
          </section>
        )}

        {/* Team */}
        {sections.includes("team") && agents.length > 0 && (
          <section>
            <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              Our AI Team
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-xl border border-border bg-bg-secondary/50 p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[agent.role] || "bg-bg-tertiary text-text-secondary"}`}
                      >
                        {agent.role.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  {agent.description && (
                    <p className="text-sm text-text-secondary mt-2">
                      {agent.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Chat */}
        {sections.includes("chat") && (
          <section className="text-center">
            <div className="inline-flex flex-col items-center gap-3 rounded-xl border border-border bg-bg-secondary/50 px-8 py-6">
              <p className="text-sm text-text-secondary">
                Have a question? Chat with our AI team.
              </p>
              <div className="text-xs text-text-tertiary">
                Embed our chat widget on your site for instant support.
              </div>
            </div>
          </section>
        )}

        {/* Contact */}
        {sections.includes("contact") &&
          (config.contact.email || config.contact.phone || config.contact.address) && (
            <section>
              <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
                Contact
              </h3>
              <div className="rounded-xl border border-border bg-bg-secondary/50 p-6 space-y-2">
                {config.contact.email && (
                  <p className="text-sm">
                    <span className="text-text-tertiary">Email:</span>{" "}
                    <a href={`mailto:${config.contact.email}`} className="text-accent hover:underline">
                      {config.contact.email}
                    </a>
                  </p>
                )}
                {config.contact.phone && (
                  <p className="text-sm">
                    <span className="text-text-tertiary">Phone:</span>{" "}
                    <span className="text-text-primary">{config.contact.phone}</span>
                  </p>
                )}
                {config.contact.address && (
                  <p className="text-sm">
                    <span className="text-text-tertiary">Address:</span>{" "}
                    <span className="text-text-primary">{config.contact.address}</span>
                  </p>
                )}
              </div>
            </section>
          )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-text-tertiary">
          Powered by{" "}
          <Link href="/" className="text-accent hover:underline">
            tellet.com
          </Link>{" "}
          — AI agents that run your business
        </div>
      </footer>
    </div>
  );
}
