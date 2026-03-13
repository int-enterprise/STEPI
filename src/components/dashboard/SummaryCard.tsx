"use client";

import type { Candidate } from "@/types/candidate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function highlight(text: string, emphasis: string[]) {
  if (!emphasis?.length) return <>{text}</>;

  // 간단 하이라이트: 첫 번째 매칭만 mark 처리 (과한 변형 방지)
  let out: React.ReactNode = text;
  for (const key of emphasis) {
    if (typeof out !== "string") continue;
    const idx = out.indexOf(key);
    if (idx === -1) continue;
    out = (
      <>
        {out.slice(0, idx)}
        <mark className="rounded-md bg-[var(--accent-rose-bg)] px-1 py-0.5 text-[#9a2e47] border border-[rgba(229,106,138,0.25)]">
          {key}
        </mark>
        {out.slice(idx + key.length)}
      </>
    );
  }
  return out;
}

export function SummaryCard({ candidate }: { candidate: Candidate }) {
  return (
    <Card tone="rose" className="min-h-[690px]">
      <CardHeader
        title={candidate.summaryTitle}
        sub="AI 요약 · 이력서/자소서 기반"
        right={
          <div className="flex items-center gap-2">
            <Badge variant="sky">AI 사용률 {candidate.aiUsageRate}%</Badge>
            <Button size="xs">상세</Button>
          </div>
        }
        className="pb-2"
      />
      <CardBody className="pt-1">
        <div className="rounded-[14px] border border-[rgba(229,106,138,0.18)] bg-[var(--accent-rose-bg)] px-4 py-3">
          <div className="text-[11px] text-[#9a2e47] font-medium">요약</div>
          <div className="mt-1 space-y-2 text-[13px] leading-[1.7] text-[#1f2937]">
            {candidate.summaryParagraphs.slice(0, 4).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {candidate.personalityKeywords.slice(0, 6).map((k) => (
              <Badge key={k} variant="muted" className="bg-white/70">
                {k}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-semibold text-[#111827]">
              이력서 주요 내용 요약
            </div>
            <Badge variant="muted">LLM 요약 결과</Badge>
          </div>

          <div className="mt-2.5 space-y-3">
            {candidate.resumeHighlights.slice(0, 3).map((sec) => (
              <div key={sec.title} className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.015)] px-3.5 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-medium text-[#111827]">
                    {sec.title}
                  </div>
                  <Button size="xs" variant="ghost">
                    보기
                  </Button>
                </div>
                <ul className="mt-2 space-y-1.5 text-[12px] leading-[1.6] text-[#374151]">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[rgba(229,106,138,0.7)] shrink-0" />
                      <span>{highlight(b, sec.emphasis ?? [])}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

