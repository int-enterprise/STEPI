"use client";

import { cn } from "@/lib/cn";

export function Button({
  children,
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "xs" | "sm";
}) {
  const v =
    variant === "primary"
      ? "bg-[#111827] text-white hover:bg-[#0b1220] border-transparent"
      : variant === "outline"
        ? "bg-white text-[#111827] hover:bg-white/70 border-[var(--border)]"
        : "bg-transparent text-[var(--muted)] hover:text-[#111827] hover:bg-[rgba(17,24,39,0.03)] border-transparent";

  const s = size === "xs" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";

  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[999px] border transition disabled:opacity-60 disabled:cursor-not-allowed",
        v,
        s,
        className
      )}
    >
      {children}
    </button>
  );
}

