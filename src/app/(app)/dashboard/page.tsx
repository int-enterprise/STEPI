"use client";

import { useCandidateStore } from "@/store/candidate-store";
import { Select } from "@/components/ui/Select";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GradeDistribution } from "@/components/dashboard/GradeDistribution";
import { AptitudeCard } from "@/components/dashboard/AptitudeCard";
import { ClusterFitCard } from "@/components/dashboard/ClusterFitCard";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { TimelineCard } from "@/components/dashboard/TimelineCard";
import { RadarCompareCard } from "@/components/dashboard/RadarCompareCard";
import { QuestionsCard } from "@/components/dashboard/QuestionsCard";

export default function DashboardPage() {
  const { candidates, selectedId, selected, setSelectedId } = useCandidateStore();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={selectedId}
            onChange={setSelectedId}
            options={candidates.map((c) => ({
              value: c.id,
              label: `${c.name} · ${c.appliedRole}`,
            }))}
            className="min-w-[240px]"
          />
          <Badge variant="muted">대상자 변경</Badge>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Badge variant={selected.grade === "S" ? "rose" : "sky"}>
            최종 등급 {selected.grade}
          </Badge>
          <Badge variant="muted">업로드 {selected.uploadedAt}</Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[280px_1fr_440px] gap-3">
        {/* 좌측 1열 */}
        <div className="space-y-3">
          <Card tone="sky">
            <CardHeader
              title="지원자 등급"
              sub={`S 상위 ${selected.gradePercentile.toFixed(1)}%`}
              right={<Button size="xs">상세</Button>}
            />
            <CardBody className="pt-1">
              <GradeDistribution grade={selected.grade} percentile={selected.gradePercentile} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-2.5 py-2">
                  <div className="text-[10px] text-[var(--muted)]">1차</div>
                  <div className="mt-0.5 text-lg font-semibold">{selected.gradeStages.first}</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-2.5 py-2">
                  <div className="text-[10px] text-[var(--muted)]">2차</div>
                  <div className="mt-0.5 text-lg font-semibold">{selected.gradeStages.second}</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-2.5 py-2">
                  <div className="text-[10px] text-[var(--muted)]">최종</div>
                  <div className="mt-0.5 text-lg font-semibold">{selected.gradeStages.final}</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <AptitudeCard candidate={selected} />
          <ClusterFitCard candidate={selected} />
        </div>

        {/* 중앙 */}
        <div className="space-y-3">
          <SummaryCard candidate={selected} />
        </div>

        {/* 우측 */}
        <div className="space-y-3">
          <TimelineCard candidate={selected} />
          <div className="grid grid-cols-2 gap-3">
            <RadarCompareCard
              title="핵심인재와의 유사도"
              candidate={selected}
              kind="core"
              tone="rose"
            />
            <RadarCompareCard
              title="직무 적합도"
              candidate={selected}
              kind="job"
              tone="amber"
            />
          </div>
          <QuestionsCard candidate={selected} />
        </div>
      </div>
    </div>
  );
}

