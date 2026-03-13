"use client";

import { cn } from "@/lib/cn";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-[20px] border border-[var(--border)] bg-white p-2 shadow-[0_16px_40px_rgba(17,24,39,0.05)]",
        "md:grid-cols-3",
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-[16px] border px-4 py-4 text-left transition",
              active
                ? "border-[rgba(79,139,214,0.22)] bg-[var(--accent-sky-bg)] text-[#111827] shadow-[0_12px_26px_rgba(17,24,39,0.08)]"
                : "border-transparent bg-[rgba(17,24,39,0.03)] text-[#111827] hover:border-[var(--border)] hover:bg-[rgba(79,139,214,0.05)]"
            )}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {tab.icon ? <span className="inline-flex">{tab.icon}</span> : null}
              <span>{tab.label}</span>
            </div>
            {tab.description ? (
              <p
                className={cn(
                  "mt-1 text-xs leading-5",
                  active ? "text-[#5f6775]" : "text-[var(--muted)]"
                )}
              >
                {tab.description}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
