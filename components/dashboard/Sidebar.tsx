"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: "H" },
  { label: "Agents", href: "/agents", icon: "A" },
  { label: "Conversations", href: "/conversations", icon: "C" },
  { label: "Orchestrator", href: "/orchestrator", icon: "O" },
  { label: "Settings", href: "/settings", icon: "S" },
];

export function Sidebar({ companyName, slug }: { companyName: string; slug: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border bg-bg-primary flex flex-col h-full">
      <Link href={`/${slug}/dashboard`} className="block p-5 hover:bg-bg-secondary/50 transition-colors">
        <span className="text-lg font-bold tracking-tight">{companyName}</span>
      </Link>
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map((item) => {
          const href = `/${slug}${item.href}`;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === href
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
              )}
            >
              <span className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center text-[10px] font-bold">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-text-tertiary">Powered by <span className="text-text-secondary">tel</span><span className="text-accent">let</span></p>
      </div>
    </aside>
  );
}
