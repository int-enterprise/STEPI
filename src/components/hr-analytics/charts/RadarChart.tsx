"use client";

import { useId } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
} from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

interface RadarChartProps {
  data: { subject: string; value: number; fullMark?: number }[];
}

export function RadarChart({ data }: RadarChartProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div className="h-[280px]">
      <ClientOnly fallback={<div className="h-full w-full" />}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f8bd6" stopOpacity="0.95" />
                <stop offset="52%" stopColor="#e56a8a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f1b04a" stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(17,24,39,0.12)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(17,24,39,0.72)", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "rgba(17,24,39,0.45)", fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={`url(#${gradientId})`}
              fill={`url(#${gradientId})`}
              fillOpacity={0.3}
              strokeWidth={2.4}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  );
}
