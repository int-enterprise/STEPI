"use client";

import type { Candidate, TimelineItem } from "@/types/candidate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

function toMonthIndex(ym: string) {
  if (ym === "현재") return null;
  const [y, m] = ym.split("-").map((n) => Number(n));
  return y * 12 + (m - 1);
}

function range(items: TimelineItem[]) {
  const starts = items.map((i) => toMonthIndex(i.start)).filter((v): v is number => v !== null);
  const ends = items
    .map((i) => (i.end === "현재" ? null : toMonthIndex(i.end)))
    .filter((v): v is number => v !== null);
  const min = Math.min(...starts);
  const max = Math.max(...ends, ...starts);
  return { min, max: max + 1 };
}

function color(type: TimelineItem["type"]) {
  if (type === "학력") return "bg-[rgba(79,139,214,0.16)] border-[rgba(79,139,214,0.35)]";
  if (type === "연구") return "bg-[rgba(229,106,138,0.16)] border-[rgba(229,106,138,0.35)]";
  if (type === "프로젝트") return "bg-[rgba(241,176,74,0.18)] border-[rgba(241,176,74,0.35)]";
  return "bg-[rgba(17,24,39,0.05)] border-[var(--border)]";
}

export function TimelineCard({ candidate }: { candidate: Candidate }) {
  const items = candidate.timeline;
  const { min, max } = range(items);
  const total = Math.max(1, max - min);

  return (
    <Card tone="amber">
      <CardHeader
        title="지원자 이력 타임라인"
        sub="학력 / 경력 / 프로젝트 / 연구"
        right={<Button size="xs">상세</Button>}
      />
      <CardBody className="pt-1">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="sky">학력</Badge>
          <Badge variant="rose">연구</Badge>
          <Badge variant="amber">프로젝트</Badge>
          <Badge variant="muted">경력</Badge>
        </div>

        <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-white px-3 py-3">
          <div className="relative h-[128px]">
            <div className="absolute left-0 right-0 top-[18px] h-[1px] bg-[rgba(17,24,39,0.10)]" />
            {items.slice(0, 6).map((it, idx) => {
              const s = toMonthIndex(it.start) ?? min;
              const e = it.end === "현재" ? max : toMonthIndex(it.end) ?? max;
              const left = ((s - min) / total) * 100;
              const width = (Math.max(1, e - s) / total) * 100;
              const top = 34 + idx * 15;
              return (
                <div key={`${it.label}-${idx}`} className="absolute left-0 right-0" style={{ top }}>
                  <div
                    className={cn(
                      "absolute h-6 rounded-[10px] border px-2.5 text-[11px] leading-6 text-[#111827] overflow-hidden whitespace-nowrap text-ellipsis",
                      color(it.type)
                    )}
                    style={{ left: `${left}%`, width: `${Math.max(10, width)}%` }}
                    title={`${it.label} (${it.start} ~ ${it.end})`}
                  >
                    {it.label}
                    <span className="ml-2 text-[10px] text-[rgba(17,24,39,0.55)]">
                      {it.start} ~ {it.end}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--muted)]">
            <span>{items[0]?.start}</span>
            <span>{items.some((i) => i.end === "현재") ? "현재" : items[items.length - 1]?.end}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

