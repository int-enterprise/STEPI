"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Cpu,
  HeartHandshake,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/hr-analytics/Progress";
import { BarChart } from "@/components/hr-analytics/charts/BarChart";
import { DonutChart } from "@/components/hr-analytics/charts/DonutChart";
import { HeatMap } from "@/components/hr-analytics/charts/HeatMap";
import { RadarChart } from "@/components/hr-analytics/charts/RadarChart";
import { ScoreGauge } from "@/components/hr-analytics/charts/ScoreGauge";
import type {
  HrEvaluationReport,
  Turing10Result,
  Turing30Result,
  Turing50Result,
} from "@/data/hr-analytics";

function titleize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function scoreClass(score: number) {
  if (score >= 85) return "text-[#4f8bd6]";
  if (score >= 75) return "text-[#e56a8a]";
  if (score >= 60) return "text-[#b57a16]";
  return "text-[#b33c5c]";
}

function scoreBar(score: number) {
  if (score >= 85) return "bg-[#4f8bd6]";
  if (score >= 75) return "bg-[#e56a8a]";
  if (score >= 60) return "bg-[#f1b04a]";
  return "bg-[#e56a8a]";
}

function scoreChip(score: number): "sky" | "amber" | "rose" | "default" {
  if (score >= 85) return "sky";
  if (score >= 60) return "amber";
  if (score < 60) return "rose";
  return "default";
}

function decisionConfig(decision: Turing50Result["go_decision"]) {
  if (decision === "go") {
    return {
      label: "GO",
      description: "Ready for controlled rollout",
      badge: "sky" as const,
      icon: CheckCircle2,
      bg: "bg-[linear-gradient(135deg,#f2f8ff_0%,#ffffff_100%)]",
    };
  }

  if (decision === "conditional") {
    return {
      label: "CONDITIONAL",
      description: "Pilot with governance gates",
      badge: "amber" as const,
      icon: AlertTriangle,
      bg: "bg-[linear-gradient(135deg,#fff6e8_0%,#ffffff_100%)]",
    };
  }

  return {
    label: "NO-GO",
    description: "Further remediation needed",
    badge: "rose" as const,
    icon: XCircle,
    bg: "bg-[linear-gradient(135deg,#fff3f7_0%,#ffffff_100%)]",
  };
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  tone = "sky",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  tone?: "sky" | "amber" | "rose";
}) {
  const toneStyles =
    tone === "amber"
      ? "bg-[var(--accent-amber-bg)]"
      : tone === "rose"
        ? "bg-[var(--accent-rose-bg)]"
        : "bg-[var(--accent-sky-bg)]";

  return (
    <Card className="border-transparent">
      <CardBody className="py-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-[14px] p-2.5 ${toneStyles}`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {title}
            </p>
            <p className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[#111827]">
              {value}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

export function Turing10Panel({ data }: { data: Turing10Result }) {
  const radarData = Object.entries(data.ai_profile).map(([key, value]) => ({
    subject: titleize(key),
    value,
    fullMark: 100,
  }));

  const pipelineChartData = data.pipeline_results.map((pipeline) => ({
    name: pipeline.benchmark_name,
    value: pipeline.score,
    color:
      pipeline.score >= 85
        ? "#4f8bd6"
        : pipeline.score >= 70
          ? "#e56a8a"
          : "#f1b04a",
  }));

  const heatmapColumns = ["Score", "Weight", "Time"];
  const heatmapData = data.pipeline_results.map((pipeline) => ({
    label: pipeline.benchmark_name,
    values: [
      Math.round(pipeline.score),
      Math.round(pipeline.tier_weight * 100),
      Math.round(pipeline.execution_time_ms / 100) / 10,
    ],
  }));

  const tierBreakdown = Object.entries(data.tier_breakdown).map(([name, value]) => ({
    name,
    score: value.score,
    passed: value.passed,
    benchmarks: value.benchmarks,
    passedBenchmarks: value.passed_benchmarks,
  }));

  const topPipeline = data.pipeline_results.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  const profileAverage =
    radarData.reduce((sum, item) => sum + item.value, 0) / radarData.length;

  const tierDonutData = tierBreakdown.map((tier) => ({
    name: tier.name,
    value: tier.score,
    fill: tier.passed ? "#4f8bd6" : "#e56a8a",
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="종합 점수"
          value={data.turing_score.toFixed(1)}
          subtitle={`등급 ${data.grade}`}
          icon={<Brain className="h-5 w-5 text-[#4f8bd6]" />}
        />
        <KpiCard
          title="최고 벤치마크"
          value={topPipeline.score.toFixed(1)}
          subtitle={topPipeline.benchmark_name}
          icon={<TrendingUp className="h-5 w-5 text-[#e56a8a]" />}
        />
        <KpiCard
          title="프로파일 평균"
          value={profileAverage.toFixed(1)}
          subtitle="5개 역량 축 평균"
          icon={<Cpu className="h-5 w-5 text-[#b57a16]" />}
          tone="amber"
        />
        <KpiCard
          title="Tier 통과율"
          value={`${tierBreakdown.filter((tier) => tier.passed).length}/${tierBreakdown.length}`}
          subtitle="통과한 평가 단계 수"
          icon={<ShieldCheck className="h-5 w-5 text-[#b33c5c]" />}
          tone="rose"
        />
      </div>

      <SectionGrid>
        <Card>
          <CardHeader
            title="Turing 1.0 점수"
            sub="핵심 역량과 벤치마크 수행 결과"
          />
          <CardBody className="flex items-center justify-center pt-0">
            <div className="flex flex-col items-center gap-3">
              <ScoreGauge score={data.turing_score} label="Turing 1.0" />
              <Badge variant="sky" className="px-3 py-1.5 text-xs">
                {data.grade} 등급 / mock 결과
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Capability Profile"
            sub="역량 분포를 한눈에 보는 레이더 차트"
          />
          <CardBody className="pt-0">
            <RadarChart data={radarData} />
          </CardBody>
        </Card>
      </SectionGrid>

      <SectionGrid>
        <Card>
          <CardHeader
            title="파이프라인 매트릭스"
            sub="점수, 가중치, 처리 시간 요약"
          />
          <CardBody className="pt-0">
            <HeatMap data={heatmapData} columns={heatmapColumns} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="벤치마크 점수"
            sub="스크리닝 기능별 성능 비교"
          />
          <CardBody className="pt-0">
            <BarChart data={pipelineChartData} />
          </CardBody>
        </Card>
      </SectionGrid>

      <Card>
        <CardHeader
          title="Tier 세부 결과"
          sub="Turing 1.0 단계별 통과 여부와 점수"
        />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Tier
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Score
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Benchmarks
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {tierBreakdown.map((tier) => (
                  <tr key={tier.name} className="border-b border-[rgba(17,24,39,0.06)]">
                    <td className="px-3 py-3 font-medium text-[#111827]">{tier.name}</td>
                    <td className={`px-3 py-3 text-center font-semibold ${scoreClass(tier.score)}`}>
                      {tier.score.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-center text-[var(--muted)]">
                      {tier.passedBenchmarks}/{tier.benchmarks}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={tier.passed ? "sky" : "rose"}>
                        {tier.passed ? "통과" : "보완 필요"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Progress
                        value={tier.score}
                        barClassName={tier.passed ? "bg-[#4f8bd6]" : "bg-[#e56a8a]"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px_1fr]">
        <Card>
          <CardHeader title="강점" sub="현재 잘 수행하는 영역" />
          <CardBody className="pt-0">
            <ul className="space-y-3">
              {data.strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4f8bd6]" />
                  <span className="text-sm leading-6 text-[#111827]">{strength}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Tier 분포" sub="단계별 점수 비중" />
          <CardBody className="pt-0">
            <DonutChart
              data={tierDonutData}
              tooltipLabel="points"
              centerLabel="Overall"
              centerValue={data.turing_score.toFixed(1)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="보완 포인트" sub="파일럿 운영 전 점검이 필요한 영역" />
          <CardBody className="pt-0">
            <ul className="space-y-3">
              {data.weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#e56a8a]" />
                  <span className="text-sm leading-6 text-[#111827]">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function Turing30Panel({ data }: { data: Turing30Result }) {
  const dimensions = [
    { key: "task_accuracy", label: "Task accuracy", icon: Brain },
    { key: "efficiency", label: "Efficiency", icon: Zap },
    { key: "adaptability", label: "Adaptability", icon: Workflow },
    { key: "communication", label: "Communication", icon: Sparkles },
    { key: "collaboration", label: "Collaboration", icon: Users },
    { key: "autonomy", label: "Autonomy", icon: Cpu },
    { key: "safety", label: "Safety", icon: Shield },
  ] as const;

  const radarData = dimensions.map((dimension) => ({
    subject: dimension.label,
    value: data.anthropomorphic[dimension.key],
    fullMark: 100,
  }));

  const heatmapColumns = ["Acc", "Eff", "Adapt", "Comm", "Collab", "Auto", "Safe"];
  const dimensionValues = dimensions.map(
    (dimension) => data.anthropomorphic[dimension.key]
  );
  const heatmapData = data.scenario_results.map((scenario) => ({
    label: scenario.name,
    values: dimensionValues.map((value) =>
      Math.round((scenario.score * value) / 100)
    ),
  }));

  const metaData = Object.entries(data.meta_cognition).map(([key, value]) => ({
    subject: titleize(key),
    value: Math.round(value * 100),
    fullMark: 100,
  }));

  const faultEntries = Object.entries(data.fault_tolerance).map(([key, value]) => ({
    name: titleize(key),
    tolerance: Math.round(value.tolerance * 100),
  }));

  const donutData = dimensions.map((dimension, index) => ({
    name: dimension.label,
    value: data.anthropomorphic[dimension.key],
    fill: ["#4f8bd6", "#e56a8a", "#f1b04a", "#ffb6c8", "#b9daf8", "#ffd798", "#d8ddf0"][index],
  }));

  const scenarioBarData = data.scenario_results.map((scenario) => ({
    name: scenario.name,
    value: scenario.score,
    color:
      scenario.score >= 80 ? "#4f8bd6" : scenario.score >= 70 ? "#e56a8a" : "#f1b04a",
  }));

  const collaborationIndex =
    (data.anthropomorphic.collaboration + data.anthropomorphic.communication) / 2;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="업무 시나리오 점수"
          value={data.anthropomorphic.overall_score.toFixed(1)}
          subtitle="업무형 상호작용 종합 결과"
          icon={<HeartHandshake className="h-5 w-5 text-[#4f8bd6]" />}
        />
        <KpiCard
          title="안전성"
          value={data.anthropomorphic.safety.toFixed(1)}
          subtitle="편향 및 정책 제어 수준"
          icon={<Shield className="h-5 w-5 text-[#e56a8a]" />}
        />
        <KpiCard
          title="협업 지수"
          value={collaborationIndex.toFixed(1)}
          subtitle="커뮤니케이션 + 협업 평균"
          icon={<Users className="h-5 w-5 text-[#b57a16]" />}
          tone="amber"
        />
        <KpiCard
          title="시나리오"
          value={`${data.scenario_results.filter((scenario) => scenario.score >= 70).length}/${data.scenario_results.length}`}
          subtitle="기준 점수 이상 시나리오 수"
          icon={<Activity className="h-5 w-5 text-[#b33c5c]" />}
          tone="rose"
        />
      </div>

      <SectionGrid>
        <Card>
          <CardHeader title="7차원 프로파일" sub="업무형 상호작용 역량 분포" />
          <CardBody className="pt-0">
            <RadarChart data={radarData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="시나리오 매트릭스"
            sub="업무 상황별 역량 반응 분포"
          />
          <CardBody className="pt-0">
            <HeatMap data={heatmapData} columns={heatmapColumns} />
          </CardBody>
        </Card>
      </SectionGrid>

      <Card>
        <CardHeader
          title="차원별 세부 점수"
          sub="Turing 3.0 핵심 역량 세부 결과"
        />
        <CardBody className="space-y-3 pt-0">
          {dimensions.map((dimension) => {
            const value = data.anthropomorphic[dimension.key];
            const Icon = dimension.icon;

            return (
              <div key={dimension.key} className="flex items-center gap-3">
                <div className="rounded-[12px] bg-[var(--accent-sky-bg)] p-2">
                  <Icon className="h-4 w-4 text-[#4f8bd6]" />
                </div>
                <div className="w-28 text-sm font-medium text-[#111827]">
                  {dimension.label}
                </div>
                <Progress value={value} barClassName={scoreBar(value)} className="flex-1" />
                <div className={`w-12 text-right text-sm font-semibold ${scoreClass(value)}`}>
                  {value.toFixed(1)}
                </div>
                <Badge variant={scoreChip(value)}>{value >= 70 ? "안정" : "검토"}</Badge>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="시나리오 결과"
          sub="채용 업무 시뮬레이션 평가 결과"
        />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Scenario
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Type
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Difficulty
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Score
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.scenario_results.map((scenario) => (
                  <tr
                    key={scenario.name}
                    className="border-b border-[rgba(17,24,39,0.06)] align-top"
                  >
                    <td className="px-3 py-3 font-medium text-[#111827]">{scenario.name}</td>
                    <td className="px-3 py-3">
                      <Badge variant="sky">{titleize(scenario.type)}</Badge>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={scenario.difficulty >= 7 ? "rose" : "amber"}>
                        {scenario.difficulty}
                      </Badge>
                    </td>
                    <td className={`px-3 py-3 text-center font-semibold ${scoreClass(scenario.score)}`}>
                      {scenario.score.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {scenario.score >= 80 ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-[#4f8bd6]" />
                      ) : scenario.score >= 70 ? (
                        <AlertTriangle className="mx-auto h-4 w-4 text-[#f1b04a]" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 text-[#e56a8a]" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs leading-5 text-[var(--muted)]">
                      {scenario.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <SectionGrid>
        <Card>
          <CardHeader title="Meta-cognition" sub="불확실성을 어떻게 인지하는지" />
          <CardBody className="pt-0">
            <RadarChart data={metaData} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Fault tolerance" sub="불완전한 맥락에서의 회복력" />
          <CardBody className="grid gap-3 pt-0 sm:grid-cols-2">
            {faultEntries.map((fault) => (
              <div
                key={fault.name}
                className="rounded-[16px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  {fault.name}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${scoreClass(fault.tolerance)}`}>
                  {fault.tolerance}%
                </p>
                <Progress
                  value={fault.tolerance}
                  className="mt-3"
                  barClassName={scoreBar(fault.tolerance)}
                />
              </div>
            ))}
          </CardBody>
        </Card>
      </SectionGrid>

      <SectionGrid>
        <Card>
          <CardHeader title="차원별 분포" sub="업무 역량별 상대 비중" />
          <CardBody className="pt-0">
            <DonutChart
              data={donutData}
              tooltipLabel="points"
              centerLabel="Overall"
              centerValue={data.anthropomorphic.overall_score.toFixed(1)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="시나리오 점수 분포" sub="업무 장면별 빠른 비교" />
          <CardBody className="pt-0">
            <BarChart data={scenarioBarData} />
          </CardBody>
        </Card>
      </SectionGrid>
    </div>
  );
}

export function Turing50Panel({ report }: { report: HrEvaluationReport }) {
  const { overall, turing10, turing30, turing50 } = report;
  const decision = decisionConfig(turing50.go_decision);
  const DecisionIcon = decision.icon;
  const riskValues = Object.values(turing50.risk_breakdown);
  const avgRisk = riskValues.reduce((sum, value) => sum + value, 0) / riskValues.length;

  const riskDonutData = Object.entries(turing50.risk_breakdown).map(([key, value]) => ({
    name: titleize(key),
    value,
    fill: {
      technical: "#4f8bd6",
      operational: "#e56a8a",
      security: "#b9daf8",
      regulatory: "#f1b04a",
      human: "#ffd798",
    }[key] || "#4f8bd6",
  }));

  const benefitBarData = Object.entries(turing50.benefit_breakdown).map(([key, value]) => ({
    name: titleize(key),
    value,
    color: "#4f8bd6",
  }));

  const profileData = Object.entries(turing10.ai_profile).map(([key, value]) => ({
    subject: titleize(key),
    value,
    fullMark: 100,
  }));

  const scorecard = [
    {
      metric: "Turing 1.0",
      value: turing10.turing_score.toFixed(1),
      grade: turing10.grade,
      status: turing10.turing_score >= 75,
    },
    {
      metric: "Turing 3.0",
      value: turing30.anthropomorphic.overall_score.toFixed(1),
      grade: turing30.anthropomorphic.overall_score >= 75 ? "Strong" : "Monitor",
      status: turing30.anthropomorphic.overall_score >= 75,
    },
    {
      metric: "Turing 5.0 ROI",
      value: `${turing50.risk_adjusted_roi.toFixed(1)}x`,
      grade: decision.label,
      status: turing50.risk_adjusted_roi >= 2,
    },
    {
      metric: "Safety",
      value: turing30.anthropomorphic.safety.toFixed(1),
      grade: turing30.anthropomorphic.safety >= 80 ? "Stable" : "Review",
      status: turing30.anthropomorphic.safety >= 80,
    },
  ];

  const roadmapPhases = [
    {
      label: "Short term",
      items: turing50.improvement_roadmap.short_term,
      badge: "sky" as const,
    },
    {
      label: "Mid term",
      items: turing50.improvement_roadmap.mid_term,
      badge: "amber" as const,
    },
    {
      label: "Long term",
      items: turing50.improvement_roadmap.long_term,
      badge: "rose" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <Card className={`border-transparent ${decision.bg}`}>
        <CardBody className="py-6">
          <div className="grid gap-6 xl:grid-cols-[auto_220px_1fr] xl:items-center">
            <div>
              <Badge variant={decision.badge} className="px-3 py-1.5 text-xs">
                Turing 5.0 의사결정
              </Badge>
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-[16px] bg-white p-3 shadow-[0_10px_22px_rgba(17,24,39,0.08)]">
                  <DecisionIcon className="h-6 w-6 text-[#111827]" />
                </div>
                <div>
                  <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#111827]">
                    {decision.label}
                  </p>
                  <p className="text-sm text-[var(--muted)]">{decision.description}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-white/60 bg-white/80 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Risk-adjusted ROI
              </p>
              <p className="mt-2 text-[40px] font-semibold tracking-[-0.05em] text-[#111827]">
                {turing50.risk_adjusted_roi.toFixed(1)}x
              </p>
              <p className="text-sm text-[var(--muted)]">{overall.hiringImpact}</p>
            </div>

            <div className="rounded-[18px] border border-white/60 bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Recommendation
              </p>
              <p className="mt-2 text-sm leading-6 text-[#111827]">
                {turing50.recommendation}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="평균 리스크"
          value={avgRisk.toFixed(1)}
          subtitle="영역별 리스크 평균"
          icon={<ShieldAlert className="h-5 w-5 text-[#4f8bd6]" />}
        />
        <KpiCard
          title="안전성 수준"
          value={turing30.anthropomorphic.safety.toFixed(1)}
          subtitle="운영 및 공정성 관점"
          icon={<ShieldCheck className="h-5 w-5 text-[#e56a8a]" />}
        />
        <KpiCard
          title="배포 상태"
          value={turing50.go_decision === "go" ? "확대 가능" : turing50.go_decision === "conditional" ? "파일럿 권장" : "보류"}
          subtitle={overall.deploymentReadiness}
          icon={<BriefcaseBusiness className="h-5 w-5 text-[#b57a16]" />}
          tone="amber"
        />
        <KpiCard
          title="백분위"
          value={`Top ${100 - overall.percentile}%`}
          subtitle={`${overall.percentile}th percentile 기준`}
          icon={<TrendingUp className="h-5 w-5 text-[#b33c5c]" />}
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader
            title="효과 분해"
            sub="개인, 조직, 전사 관점의 기대 효과"
          />
          <CardBody className="pt-0">
            <div className="grid gap-3 md:grid-cols-3">
              {Object.entries(turing50.benefit_breakdown).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-[16px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {titleize(key)}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#111827]">
                    {value.toFixed(1)}
                  </p>
                  <Progress value={value} className="mt-3" barClassName="bg-[#4f8bd6]" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <BarChart data={benefitBarData} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="전체 점수 기준" sub="Turing 1.0 결과를 기준점으로 표시" />
          <CardBody className="flex items-center justify-center pt-0">
            <div className="flex flex-col items-center gap-3">
              <ScoreGauge score={turing10.turing_score} label="Overall score" />
              <Badge variant="sky" className="px-3 py-1.5 text-xs">
                등급 {overall.grade} / {overall.percentile}th percentile
              </Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      <SectionGrid>
        <Card>
          <CardHeader title="리스크 분포" sub="확대 배포를 막을 수 있는 요인" />
          <CardBody className="pt-0">
            <DonutChart
              data={riskDonutData}
              tooltipLabel="risk"
              centerLabel="Avg risk"
              centerValue={avgRisk.toFixed(1)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Capability Profile" sub="거버넌스 판단을 위한 기준 프로파일" />
          <CardBody className="pt-0">
            <RadarChart data={profileData} />
          </CardBody>
        </Card>
      </SectionGrid>

      <Card>
        <CardHeader title="리스크 평가" sub="HR 리더십 검토용 운영 관점 요약" />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Category
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Score
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Severity
                  </th>
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Recommended action
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(turing50.risk_breakdown).map(([key, value]) => (
                  <tr key={key} className="border-b border-[rgba(17,24,39,0.06)]">
                    <td className="px-3 py-3 font-medium text-[#111827]">{titleize(key)}</td>
                    <td className={`px-3 py-3 text-center font-semibold ${scoreClass(100 - value)}`}>
                      {value.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={value >= 20 ? "rose" : value >= 15 ? "amber" : "sky"}>
                        {value >= 20 ? "High" : value >= 15 ? "Monitor" : "Low"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-xs leading-5 text-[var(--muted)]">
                      {value >= 20
                        ? "Add explicit review and sign-off before release."
                        : "Keep on monthly governance dashboard with trend watch."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="개선 로드맵" sub="파일럿 확대 전 우선 개선 순서" />
        <CardBody className="grid gap-4 pt-0 md:grid-cols-3">
          {roadmapPhases.map((phase) => (
            <div
              key={phase.label}
              className="rounded-[18px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111827]">{phase.label}</p>
                <Badge variant={phase.badge}>{phase.label}</Badge>
              </div>
              <ul className="mt-4 space-y-3">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#111827]">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="종합 스코어카드" sub="최종 의사결정을 위한 요약" />
        <CardBody className="pt-0">
          <div className="overflow-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Metric
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Value
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Grade
                  </th>
                  <th className="px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {scorecard.map((row) => (
                  <tr key={row.metric} className="border-b border-[rgba(17,24,39,0.06)]">
                    <td className="px-3 py-3 font-medium text-[#111827]">{row.metric}</td>
                    <td className="px-3 py-3 text-center font-semibold text-[#111827]">
                      {row.value}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={row.status ? "sky" : "amber"}>{row.grade}</Badge>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.status ? (
                        <CheckCircle2 className="mx-auto h-4 w-4 text-[#4f8bd6]" />
                      ) : (
                        <AlertTriangle className="mx-auto h-4 w-4 text-[#f1b04a]" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
