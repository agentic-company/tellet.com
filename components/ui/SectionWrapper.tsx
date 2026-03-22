import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function SectionWrapper({ children, id, className }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("py-24 lg:py-32 px-6", className)}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}
