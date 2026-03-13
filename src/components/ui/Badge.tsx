"use client";

import { cn } from "@/lib/cn";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?:
    | "default"
    | "muted"
    | "rose"
    | "amber"
    | "sky"
    | "solid";
  className?: string;
}) {
  const styles =
    variant === "solid"
      ? "bg-[#111827] text-white border-transparent"
      : variant === "muted"
        ? "bg-[rgba(17,24,39,0.03)] text-[var(--muted)] border-[var(--border)]"
        : variant === "rose"
          ? "bg-[var(--accent-rose-bg)] text-[#9a2e47] border-[rgba(229,106,138,0.35)]"
          : variant === "amber"
            ? "bg-[var(--accent-amber-bg)] text-[#7a4a00] border-[rgba(241,176,74,0.35)]"
            : variant === "sky"
              ? "bg-[var(--accent-sky-bg)] text-[#1f4e86] border-[rgba(79,139,214,0.30)]"
              : "bg-white text-[#111827] border-[var(--border)]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] border px-2.5 py-1 text-[11px] font-medium",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}

