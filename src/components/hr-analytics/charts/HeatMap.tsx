"use client";

import React from "react";

interface HeatMapProps {
  data: { label: string; values: number[] }[];
  columns: string[];
}

function getCellClass(value: number) {
  if (value >= 85) return "bg-[#0A2465] text-white";
  if (value >= 70) return "bg-[#5B6B95] text-white";
  if (value >= 55) return "bg-[#7B8DB8] text-white";
  return "bg-[#E6FBF8] text-[#0A2465]";
}

export function HeatMap({ data, columns }: HeatMapProps) {
  return (
    <div className="overflow-auto">
      <div
        className="inline-grid gap-2"
        style={{ gridTemplateColumns: `minmax(180px, 1fr) repeat(${columns.length}, 64px)` }}
      >
        <div />
        {columns.map((column) => (
          <div
            key={column}
            className="px-1 text-center text-[11px] font-medium text-[var(--muted)]"
          >
            {column}
          </div>
        ))}
        {data.map((row) => (
          <React.Fragment key={row.label}>
            <div className="flex items-center pr-3 text-xs font-medium text-[#000000]">
              {row.label}
            </div>
            {row.values.map((value, index) => (
              <div
                key={`${row.label}-${index}`}
                className={`flex h-10 items-center justify-center rounded-[12px] text-xs font-semibold ${getCellClass(value)}`}
              >
                {value}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
