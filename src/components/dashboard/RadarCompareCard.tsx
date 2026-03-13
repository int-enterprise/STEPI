"use client";

import type { Candidate } from "@/types/candidate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

export function RadarCompareCard({
  title,
  candidate,
  kind,
  tone,
}: {
  title: string;
  candidate: Candidate;
  kind: "core" | "job";
  tone: "rose" | "amber" | "sky" | "default";
}) {
  const metrics = kind === "core" ? candidate.coreTalentSimilarity : candidate.jobFitRadar;
  const data = metrics.map((m) => ({
    subject: m.label,
    지원자: m.value,
    핵심인재: m.reference,
  }));

  return (
    <Card tone={tone} className="min-h-[220px]">
      <CardHeader title={title} sub="지원자 vs 기준 프로필" right={<Button size="xs">상세</Button>} />
      <CardBody className="pt-1">
        <div className="h-[170px]">
          <ClientOnly fallback={<div className="h-full w-full" />}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius="70%">
                <PolarGrid stroke="var(--chart-grid)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "rgba(17,24,39,0.70)" }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "rgba(17,24,39,0.45)" }} domain={[0, 100]} />
                <Tooltip
                  formatter={(v: unknown, n: unknown) => [`${v}`, String(n)]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(17,24,39,0.12)",
                    boxShadow: "0 12px 30px rgba(17,24,39,0.12)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10, color: "rgba(17,24,39,0.65)" }} />
                <Radar
                  name="핵심인재"
                  dataKey="핵심인재"
                  stroke="rgba(17,24,39,0.35)"
                  fill="rgba(17,24,39,0.10)"
                  fillOpacity={1}
                />
                <Radar
                  name="지원자"
                  dataKey="지원자"
                  stroke="var(--chart-2)"
                  fill="rgba(229,106,138,0.22)"
                  fillOpacity={1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ClientOnly>
        </div>
      </CardBody>
    </Card>
  );
}

