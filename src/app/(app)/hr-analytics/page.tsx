"use client";

import { useState } from "react";
import {
  BarChart3,
  Brain,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/hr-analytics/Tabs";
import {
  Turing10Panel,
  Turing30Panel,
  Turing50Panel,
} from "@/components/hr-analytics/TuringPanels";
import { MOCK_HR_EVALUATION } from "@/data/hr-analytics";

const TAB_META = {
  turing10: {
    title: "Turing 1.0",
    description: "핵심 벤치마크, 역량 프로파일, 스크리닝 품질 결과",
  },
  turing30: {
    title: "Turing 3.0",
    description: "업무 시나리오 적합도, 협업 행동, 운영 안정성 결과",
  },
  turing50: {
    title: "Turing 5.0",
    description: "비즈니스 효과, 거버넌스 리스크, 배포 권고안",
  },
} as const;

export default function HrAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_META>("turing10");

  const tabs = [
    {
      id: "turing10",
      label: "Turing 1.0",
      icon: <Brain className="h-4 w-4" />,
      description: "역량 점수와 벤치마크 근거",
    },
    {
      id: "turing30",
      label: "Turing 3.0",
      icon: <Users className="h-4 w-4" />,
      description: "업무 시뮬레이션과 협업 품질",
    },
    {
      id: "turing50",
      label: "Turing 5.0",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "ROI, 거버넌스, 배포 준비도",
    },
  ];

  const activeMeta = TAB_META[activeTab];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Tabs tabs={tabs} value={activeTab} onChange={(value) => setActiveTab(value as keyof typeof TAB_META)} />

        <Card>
          <CardHeader title={activeMeta.title} sub={activeMeta.description} />
          <CardBody className="pt-0">
            {activeTab === "turing10" ? (
              <Turing10Panel data={MOCK_HR_EVALUATION.turing10} />
            ) : null}
            {activeTab === "turing30" ? (
              <Turing30Panel data={MOCK_HR_EVALUATION.turing30} />
            ) : null}
            {activeTab === "turing50" ? (
              <Turing50Panel report={MOCK_HR_EVALUATION} />
            ) : null}
          </CardBody>
        </Card>
      </div>

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
