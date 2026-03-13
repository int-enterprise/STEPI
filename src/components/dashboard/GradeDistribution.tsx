"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";
import type { CandidateGrade } from "@/types/candidate";
import { ClientOnly } from "@/components/utils/ClientOnly";

function normalCurvePoints() {
  // 0~100 분포, 정규분포 형태(시각용)
  const mean = 55;
  const sd = 16;
  const pts: Array<{ x: number; y: number }> = [];
  for (let x = 0; x <= 100; x += 4) {
    const z = (x - mean) / sd;
    const y = Math.exp(-0.5 * z * z);
    pts.push({ x, y: Number(y.toFixed(4)) });
  }
  return pts;
}

function gradeToX(grade: CandidateGrade) {
  return grade === "S" ? 85 : grade === "A" ? 72 : grade === "B" ? 58 : grade === "C" ? 44 : 30;
}

export function GradeDistribution({
  grade,
  percentile,
}: {
  grade: CandidateGrade;
  percentile: number;
}) {
  const data = normalCurvePoints();
  const highlightX = gradeToX(grade);

  return (
    <div className="h-[92px] w-full">
      <ClientOnly fallback={<div className="h-full w-full" />}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 2, left: 0 }}>
            <XAxis
              dataKey="x"
              tick={{ fontSize: 10, fill: "rgba(17,24,39,0.55)" }}
              ticks={[20, 40, 60, 80]}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 1.2]} />
            <Tooltip
              formatter={(v: unknown) => [`${Number(v).toFixed(3)}`, "밀도"]}
              labelFormatter={(l) => `점수 ${l}`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(17,24,39,0.12)",
                boxShadow: "0 12px 30px rgba(17,24,39,0.12)",
              }}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="rgba(229,106,138,0.55)"
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={highlightX}
              y={data.reduce((best, p) =>
                Math.abs(p.x - highlightX) < Math.abs(best.x - highlightX) ? p : best
              ).y}
              r={5}
              fill="var(--chart-2)"
              stroke="white"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ClientOnly>
      <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--muted)]">
        <span>하위</span>
        <span className="text-[#111827] font-medium">
          {grade} · 상위 {percentile.toFixed(1)}%
        </span>
        <span>상위</span>
      </div>
    </div>
  );
}

