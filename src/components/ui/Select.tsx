"use client";

import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

export function Select({
  value,
  onChange,
  options,
  className,
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "appearance-none rounded-[12px] border bg-white pr-9 outline-none transition",
          "border-[var(--border)] focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[rgba(79,139,214,0.10)]",
          size === "sm"
            ? "px-3 py-1.5 text-xs"
            : "px-3.5 py-2 text-sm"
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
    </div>
  );
}

