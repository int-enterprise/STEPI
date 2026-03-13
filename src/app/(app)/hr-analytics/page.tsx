"use client";

import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

export default function HrAnalyticsPage() {
  const beforeAfter = useMemo(
    () => [
      { k: "평균 검토 시간(분)", before: 45, after: 8 },
      { k: "월 처리 이력서", before: 210, after: 520 },
      { k: "채용 리드타임(일)", before: 28, after: 19 },
      { k: "수작업 비율(%)", before: 72, after: 18 },
    ],
    []
  );

  const cumulative = useMemo(() => {
    const out: Array<{ m: string; saved: number }> = [];
    let sum = 0;
    for (let i = 1; i <= 12; i++) {
      // deterministic "noise" (lint: render purity)
      const noise = ((i * 9301 + 49297) % 233280) / 233280; // 0~1
      sum += 18 + Math.round(Math.sin(i / 2.2) * 4) + Math.round(noise * 3);
      out.push({ m: `${i}월`, saved: sum });
    }
    return out;
  }, []);

  const cards = [
    { title: "기존 인사 담당", value: "4명", sub: "수작업 중심" },
    { title: "도입 후 필요 인력", value: "1.5명", sub: "실질 필요" },
    { title: "절감률", value: "62.5%", sub: "업무 절감" },
    { title: "월 절감 시간", value: "320시간", sub: "예상치" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c) => (
          <Card key={c.title} tone="sky">
            <CardBody className="py-4">
              <div className="text-[12px] text-[var(--muted)]">{c.title}</div>
              <div className="mt-1 text-2xl font-semibold text-[#111827]">
                {c.value}
              </div>
              <div className="mt-1 text-[11px] text-[rgba(17,24,39,0.60)]">
                {c.sub}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-3">
        <Card>
          <CardHeader
            title="Before / After 비교"
            sub="AI 도입 전후 핵심 지표 변화"
            right={<Button size="xs">상세</Button>}
          />
          <CardBody className="pt-0">
            <div className="h-[320px] rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <ClientOnly fallback={<div className="h-full w-full" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={beforeAfter} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
                    <XAxis dataKey="k" tick={{ fontSize: 10, fill: "rgba(17,24,39,0.65)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "rgba(17,24,39,0.45)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(17,24,39,0.12)",
                        boxShadow: "0 12px 30px rgba(17,24,39,0.12)",
                      }}
                    />
                    <Bar dataKey="before" name="Before" fill="rgba(17,24,39,0.18)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="after" name="After" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnly>
            </div>
          </CardBody>
        </Card>

        <Card tone="amber">
          <CardHeader title="ROI 스냅샷" sub="투자 대비 효율(목데이터)" />
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "AI 자동 평가 비율", v: "78%" },
                { k: "질문 자동 생성 수", v: "1,240개/월" },
                { k: "리드타임 감소율", v: "32%" },
                { k: "생산성 향상률", v: "2.6x" },
              ].map((m) => (
                <div key={m.k} className="rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
                  <div className="text-[12px] text-[var(--muted)]">{m.k}</div>
                  <div className="mt-1 text-xl font-semibold text-[#111827]">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-semibold text-[#111827]">
                  누적 절감 시간(월)
                </div>
                <Badge variant="muted">최근 12개월</Badge>
              </div>
              <div className="mt-2 h-[180px]">
                <ClientOnly fallback={<div className="h-full w-full" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cumulative} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                      <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
                      <XAxis dataKey="m" tick={{ fontSize: 10, fill: "rgba(17,24,39,0.65)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "rgba(17,24,39,0.45)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v: unknown) => [`${v}시간`, "누적 절감"]}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(17,24,39,0.12)",
                          boxShadow: "0 12px 30px rgba(17,24,39,0.12)",
                        }}
                      />
                      <Line type="monotone" dataKey="saved" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ClientOnly>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

