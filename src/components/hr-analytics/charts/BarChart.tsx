"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  dataKey?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-white px-3 py-2 shadow-[0_12px_26px_rgba(17,24,39,0.12)]">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="text-sm font-semibold text-[#111827]">
        {payload[0].value.toFixed(1)}
      </p>
    </div>
  );
}

export function BarChart({ data, dataKey = "value" }: BarChartProps) {
  return (
    <div className="h-[280px]">
      <ClientOnly fallback={<div className="h-full w-full" />}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 8, right: 8, left: -20, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(17,24,39,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(17,24,39,0.72)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(17,24,39,0.45)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={entry.color || "#4f8bd6"}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  );
}
