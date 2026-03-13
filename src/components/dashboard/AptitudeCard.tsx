"use client";

import type { Candidate, CandidateGrade } from "@/types/candidate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

function gradeVariant(g: CandidateGrade) {
  if (g === "S") return "rose";
  if (g === "A") return "sky";
  if (g === "B") return "amber";
  return "muted";
}

export function AptitudeCard({ candidate }: { candidate: Candidate }) {
  return (
    <Card>
      <CardHeader
        title="인적성검사 결과"
        sub="최종 / 적성 / 인성"
        right={<Button size="xs">상세</Button>}
      />
      <CardBody className="pt-0.5">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-2.5 py-2">
            <div className="text-[10px] text-[var(--muted)]">최종</div>
            <div className="mt-0.5">
              <Badge variant={gradeVariant(candidate.aptitude.overall)}>
                {candidate.aptitude.overall}
              </Badge>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-2.5 py-2">
            <div className="text-[10px] text-[var(--muted)]">적성</div>
            <div className="mt-0.5">
              <Badge variant={gradeVariant(candidate.aptitude.aptitude)}>
                {candidate.aptitude.aptitude}
              </Badge>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-2.5 py-2">
            <div className="text-[10px] text-[var(--muted)]">인성</div>
            <div className="mt-0.5">
              <Badge variant={gradeVariant(candidate.aptitude.personality)}>
                {candidate.aptitude.personality}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-[11px] font-medium text-[#111827]">강점</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {candidate.aptitude.strengths.slice(0, 8).map((k) => (
              <Badge key={k} variant="sky" className="font-normal">
                {k}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-2.5">
          <div className="text-[11px] font-medium text-[#111827]">약점</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {candidate.aptitude.weaknesses.slice(0, 6).map((k) => (
              <Badge key={k} variant="rose" className="font-normal">
                {k}
              </Badge>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

