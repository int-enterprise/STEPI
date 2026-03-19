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
      ? "bg-[#000000] text-white border-transparent"
      : variant === "muted"
        ? "bg-[rgba(10,36,101,0.03)] text-[var(--muted)] border-[var(--border)]"
        : variant === "rose"
          ? "bg-[rgba(91,107,149,0.06)] text-[#0A2465] border-[rgba(91,107,149,0.24)]"
          : variant === "amber"
            ? "bg-[#FAFAFA] text-[#5B6B95] border-[rgba(123,141,184,0.26)]"
            : variant === "sky"
              ? "bg-[rgba(10,36,101,0.04)] text-[#0A2465] border-[rgba(10,36,101,0.22)]"
              : "bg-white text-[#000000] border-[var(--border)]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}
