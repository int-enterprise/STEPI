"use client";

import type { Candidate } from "@/types/candidate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

export function ClusterFitCard({ candidate }: { candidate: Candidate }) {
  const data = candidate.clusterFit.map((d) => ({ name: d.label, value: d.value }));
  const colors = ["#0A2465", "#5B6B95", "#7B8DB8", "#C6CEDF"];

  return (
    <Card>
      <CardHeader
        title="직군 적합도"
        sub="AI / Digital / DX Eng. / Cloud"
        right={<Button size="xs">상세</Button>}
      />
      <CardBody className="pt-1">
        <div className="h-[140px]">
          <ClientOnly fallback={<div className="h-full w-full" />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 6, bottom: 0, left: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "rgba(10,36,101,0.55)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(10,36,101,0.70)" }} width={70} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: unknown) => [`${v}%`, "적합도"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(10,36,101,0.12)",
                    boxShadow: "0 12px 30px rgba(10,36,101,0.12)",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={12}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} opacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ClientOnly>
        </div>
        <div className="-mt-2 grid grid-cols-4 gap-2">
          {candidate.clusterFit.map((d) => (
            <div key={d.label} className="rounded-xl border border-[var(--border)] bg-[rgba(10,36,101,0.02)] px-2 py-2 text-center">
              <div className="text-[10px] text-[var(--muted)]">{d.label}</div>
              <div className="mt-0.5 text-[13px] font-semibold text-[#000000]">{d.value}%</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

