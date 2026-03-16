"use client";

import type { Candidate } from "@/types/candidate";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function QuestionsCard({ candidate }: { candidate: Candidate }) {
  return (
    <Card tone="rose" className="h-[320px]">
      <CardHeader
        title="AI 생성 질문"
        sub="면접 질문 자동 생성(목데이터)"
        right={
          <div className="flex items-center gap-2">
            <Badge variant="muted">{candidate.generatedQuestions.length}개</Badge>
            <Button size="xs">상세</Button>
          </div>
        }
      />
      <CardBody className="pt-0.5">
        <div className="h-[250px] overflow-auto rounded-[14px] border border-[rgba(10,36,101,0.14)] bg-[rgba(10,36,101,0.03)] px-3.5 py-3">
          <ol className="space-y-2.5">
            {candidate.generatedQuestions.map((q, idx) => (
              <li key={idx} className="flex gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg border border-[rgba(10,36,101,0.22)] bg-white text-[11px] font-semibold text-[#0A2465] shrink-0">
                  {idx + 1}
                </span>
                <div className="text-[12px] leading-[1.6] text-[#5B6B95]">
                  {q}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </CardBody>
    </Card>
  );
}

