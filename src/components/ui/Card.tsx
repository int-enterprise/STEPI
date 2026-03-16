"use client";

import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  tone = "default",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "rose" | "amber" | "sky";
}) {
  const toneClass =
    tone === "rose"
      ? "border-[rgba(91,107,149,0.28)] bg-[var(--surface)]"
      : tone === "amber"
        ? "border-[rgba(123,141,184,0.30)] bg-[var(--surface)]"
        : tone === "sky"
          ? "border-[rgba(10,36,101,0.22)] bg-[var(--surface)]"
          : "border-[var(--border)] bg-[var(--surface)]";

  return (
    <section
      className={cn(
        "rounded-[var(--radius)] border shadow-[0_10px_26px_rgba(10,36,101,0.06)]",
        "overflow-hidden",
        toneClass,
        className
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  right,
  sub,
  className,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("px-4 pt-3.5 pb-2.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold tracking-tight text-[#000000]">
            {title}
          </div>
          {sub ? (
            <div className="mt-0.5 text-[11px] text-[var(--muted)]">
              {sub}
            </div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
}

