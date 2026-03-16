"use client";

import { cn } from "@/lib/cn";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[rgba(10,36,101,0.10)]",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out",
          barClassName || "bg-[#0A2465]"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
