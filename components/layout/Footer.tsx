import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-text-primary">tel</span>
            <span className="text-highlight">let</span>
          </span>
          <span className="text-text-tertiary text-sm">
            — AI Agentic Company Framework
          </span>
        </div>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/agentic-company"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
        </div>

        <p className="text-text-tertiary text-xs">
          &copy; {new Date().getFullYear()} tellet. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
