"use client";

import { ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import {
  Turing10Panel,
  Turing30Panel,
  Turing50Panel,
} from "@/components/hr-analytics/TuringPanels";
import { MOCK_HR_EVALUATION } from "@/data/hr-analytics";

const TURING_PANELS = {
  turing10: {
    title: "Turing",
    description: "핵심 벤치마크, 역량 프로파일, 스크리닝 품질 결과",
    render: () => <Turing10Panel data={MOCK_HR_EVALUATION.turing10} />,
  },
  turing30: {
    title: "Turing",
    description: "업무 시나리오 적합도, 협업 행동, 운영 안정성 결과",
    render: () => <Turing30Panel data={MOCK_HR_EVALUATION.turing30} />,
  },
  turing50: {
    title: "Turing",
    description: "현업 운영 효과, 비용 절감, 거버넌스 안정성 평가",
    render: () => <Turing50Panel report={MOCK_HR_EVALUATION} />,
  },
} as const;

const PUBLIC_TURING_KEY: keyof typeof TURING_PANELS = "turing50";

export default function HrAnalyticsPage() {
  const activeMeta = TURING_PANELS[PUBLIC_TURING_KEY];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title={activeMeta.title} />
        <CardBody className="pt-0">
          {activeMeta.render()}
        </CardBody>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card tone="sky">
          <CardHeader title="평가 정보" sub="현재 화면에서 사용하는 mock 기준" />
          <CardBody className="grid gap-4 pt-0 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Model
              </p>
              <p className="mt-1 text-sm font-medium text-[#000000]">
                {MOCK_HR_EVALUATION.summary.modelName}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                v{MOCK_HR_EVALUATION.summary.version}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Evaluator
              </p>
              <p className="mt-1 text-sm font-medium text-[#000000]">
                {MOCK_HR_EVALUATION.summary.evaluator}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Status
              </p>
              <p className="mt-1 text-sm font-medium text-[#000000]">
                {MOCK_HR_EVALUATION.summary.status}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Percentile
              </p>
              <p className="mt-1 text-sm font-medium text-[#000000]">
                {MOCK_HR_EVALUATION.overall.percentile}th percentile
              </p>
            </div>
          </CardBody>
        </Card>

        <Card tone="amber">
          <CardHeader title="핵심 메모" sub="눈여겨볼 만한 요약 정보" />
          <CardBody className="grid gap-4 pt-0 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0A2465]" />
                <p className="text-sm font-semibold text-[#000000]">배포 메모</p>
              </div>
              <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                {MOCK_HR_EVALUATION.overall.hiringImpact}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#5B6B95]" />
                <p className="text-sm font-semibold text-[#000000]">Target use case</p>
              </div>
              <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                {MOCK_HR_EVALUATION.summary.useCase}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000000]">기관</p>
              <p className="mt-1 text-xs leading-6 text-[var(--muted)]">
                {MOCK_HR_EVALUATION.summary.organization}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
