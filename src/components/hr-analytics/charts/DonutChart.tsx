"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

interface DonutChartProps {
  data: { name: string; value: number; fill: string }[];
  tooltipLabel?: string;
  centerLabel?: string;
  centerValue?: string;
  size?: "sm" | "md";
}

function CustomTooltip({
  active,
  payload,
  tooltipLabel,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  tooltipLabel?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-white px-3 py-2 shadow-[0_12px_26px_rgba(10,36,101,0.12)]">
      <p className="text-sm font-semibold text-[#000000]">{payload[0].name}</p>
      <p className="text-xs text-[var(--muted)]">
        {payload[0].value.toFixed(1)} {tooltipLabel || "score"}
      </p>
    </div>
  );
}

export function DonutChart({
  data,
  tooltipLabel,
  centerLabel,
  centerValue,
  size = "md",
}: DonutChartProps) {
  const chartHeight = size === "sm" ? 220 : 280;
  const innerRadius = size === "sm" ? 52 : 66;
  const outerRadius = size === "sm" ? 82 : 104;
  const valueClass = size === "sm" ? "text-2xl" : "text-3xl";
  const labelClass = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div className="relative" style={{ height: chartHeight }}>
      <ClientOnly fallback={<div className="h-full w-full" />}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip tooltipLabel={tooltipLabel} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </ClientOnly>
      {centerLabel ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${valueClass} font-semibold tracking-[-0.04em] text-[#000000]`}>
            {centerValue}
          </span>
          <span className={`${labelClass} uppercase tracking-[0.14em] text-[var(--muted)]`}>
            {centerLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
