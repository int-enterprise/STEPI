"use client";

import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";

type Settings = {
  tech: number;
  exp: number;
  edu: number;
  project: number;
  leadership: number;
  comm: number;
  aptitudeRate: number;
  summaryStrength: number;
  questionDifficulty: number;
  sensitivity: number;
  roleTemplate: string;
  talentProfile: string;
  model: string;
};

const DEFAULTS: Settings = {
  tech: 28,
  exp: 18,
  edu: 10,
  project: 18,
  leadership: 10,
  comm: 16,
  aptitudeRate: 35,
  summaryStrength: 55,
  questionDifficulty: 60,
  sensitivity: 52,
  roleTemplate: "AI Engineer",
  talentProfile: "핵심인재(기준A)",
  model: "SmartHire Eval LLM (mock)",
};

function SliderRow({
  label,
  value,
  onChange,
  hint,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr_70px] items-center gap-4 rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
      <div>
        <div className="text-[12px] font-medium text-[#111827]">{label}</div>
        {hint ? (
          <div className="mt-0.5 text-[11px] text-[var(--muted)]">{hint}</div>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[var(--chart-1)]"
        />
        <div className="h-2 w-2 rounded-full bg-[rgba(79,139,214,0.35)]" />
      </div>
      <div className="text-right text-[12px] font-semibold text-[#111827]">
        {value}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem("stepi_eval_settings");
      if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
    } catch {
      // ignore
    }
    return DEFAULTS;
  });
  const [saved, setSaved] = useState(false);

  const weightSum = useMemo(() => {
    return s.tech + s.exp + s.edu + s.project + s.leadership + s.comm;
  }, [s]);

  function update<K extends keyof Settings>(k: K, v: Settings[K]) {
    setSaved(false);
    setS((prev) => ({ ...prev, [k]: v }));
  }

  function save() {
    try {
      localStorage.setItem("stepi_eval_settings", JSON.stringify(s));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  function reset() {
    setSaved(false);
    setS(DEFAULTS);
  }

  return (
    <div className="grid grid-cols-[1fr_420px] gap-3">
      <Card>
        <CardHeader
          title="평가 설정"
          sub="AI 평가 파라미터 조절(mock UI)"
          right={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={reset}>
                초기화
              </Button>
              <Button variant="primary" onClick={save}>
                설정 저장
              </Button>
            </div>
          }
        />
        <CardBody className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="muted">가중치 합계</Badge>
              <Badge
                variant={weightSum === 100 ? "sky" : "amber"}
                className="font-semibold"
              >
                {weightSum}/100
              </Badge>
            </div>
            <div className={cn("text-[11px]", weightSum === 100 ? "text-[var(--muted)]" : "text-[#7a4a00]")}>
              {weightSum === 100
                ? "정상(권장)"
                : "권장: 기술/경력/프로젝트/커뮤니케이션 가중치 합을 100으로 맞추세요."}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5">
            <SliderRow
              label="기술 적합도 가중치"
              value={s.tech}
              onChange={(v) => update("tech", v)}
              hint="직무 핵심 기술·품질·재현성"
            />
            <SliderRow
              label="경력 가중치"
              value={s.exp}
              onChange={(v) => update("exp", v)}
              hint="연차/도메인 적합/성장 궤적"
            />
            <SliderRow
              label="학력 가중치"
              value={s.edu}
              onChange={(v) => update("edu", v)}
              hint="전공/연구 경험 가산"
            />
            <SliderRow
              label="프로젝트 경험 가중치"
              value={s.project}
              onChange={(v) => update("project", v)}
              hint="문제 정의/실행/성과 연결"
            />
            <SliderRow
              label="리더십 가중치"
              value={s.leadership}
              onChange={(v) => update("leadership", v)}
              hint="주도/조율/영향력"
            />
            <SliderRow
              label="커뮤니케이션 가중치"
              value={s.comm}
              onChange={(v) => update("comm", v)}
              hint="정량적 설명/문서화/협업"
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5">
            <SliderRow
              label="인적성 반영 비율"
              value={s.aptitudeRate}
              onChange={(v) => update("aptitudeRate", v)}
              hint="인적성 결과를 최종 점수에 반영"
            />
            <SliderRow
              label="LLM 요약 강도"
              value={s.summaryStrength}
              onChange={(v) => update("summaryStrength", v)}
              hint="요약 압축률/강조 키워드 강도"
            />
            <SliderRow
              label="질문 생성 난이도"
              value={s.questionDifficulty}
              onChange={(v) => update("questionDifficulty", v)}
              hint="심층 질문/검증 질문 비중"
            />
            <SliderRow
              label="평가 민감도"
              value={s.sensitivity}
              onChange={(v) => update("sensitivity", v)}
              hint="상/중/하 편향(엄격함)"
            />
          </div>
        </CardBody>
      </Card>

      <Card tone="sky">
        <CardHeader title="추가 옵션" sub="직무 템플릿/핵심 인재/모델 선택" />
        <CardBody className="pt-1">
          <div className="space-y-3">
            <div className="rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <div className="text-[12px] font-medium text-[#111827]">
                직무 템플릿 선택
              </div>
              <div className="mt-2">
                <Select
                  value={s.roleTemplate}
                  onChange={(v) => update("roleTemplate", v)}
                  options={[
                    { value: "AI Engineer", label: "AI Engineer" },
                    { value: "Data Analyst", label: "Data Analyst" },
                    { value: "MLOps Engineer", label: "MLOps Engineer" },
                    { value: "Backend Engineer", label: "Backend Engineer" },
                    { value: "Cloud Engineer", label: "Cloud Engineer" },
                    { value: "Product Analyst", label: "Product Analyst" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>

            <div className="rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <div className="text-[12px] font-medium text-[#111827]">
                핵심 인재 기준 프로필
              </div>
              <div className="mt-2">
                <Select
                  value={s.talentProfile}
                  onChange={(v) => update("talentProfile", v)}
                  options={[
                    { value: "핵심인재(기준A)", label: "핵심인재(기준A)" },
                    { value: "핵심인재(기준B)", label: "핵심인재(기준B)" },
                    { value: "전문가(리더형)", label: "전문가(리더형)" },
                    { value: "전문가(실무형)", label: "전문가(실무형)" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>

            <div className="rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <div className="text-[12px] font-medium text-[#111827]">
                평가 모델 선택(mock)
              </div>
              <div className="mt-2">
                <Select
                  value={s.model}
                  onChange={(v) => update("model", v)}
                  options={[
                    { value: "SmartHire Eval LLM (mock)", label: "SmartHire Eval LLM (mock)" },
                    { value: "SmartHire Eval LLM Pro (mock)", label: "SmartHire Eval LLM Pro (mock)" },
                    { value: "SmartHire Eval LLM Lite (mock)", label: "SmartHire Eval LLM Lite (mock)" },
                  ]}
                  className="w-full"
                />
              </div>
              <div className="mt-2 text-[11px] text-[var(--muted)] leading-[1.6]">
                실제 호출/서버 연동 없이 UI만 구현된 상태입니다. “평가 수행”은
                목데이터 기반으로 대시보드 화면을 갱신하는 UX로 동작합니다.
              </div>
            </div>

            <button
              onClick={() => {
                setSaved(false);
                setTimeout(() => setSaved(true), 450);
                setTimeout(() => setSaved(false), 1200);
              }}
              className="w-full rounded-[14px] border border-[rgba(241,176,74,0.35)] bg-[var(--accent-amber-bg)] px-4 py-3 text-left transition hover:bg-[rgba(241,176,74,0.16)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#7a4a00]">
                    평가 수행
                  </div>
                  <div className="mt-0.5 text-[11px] text-[rgba(122,74,0,0.72)]">
                    현재 설정으로 평가를 수행한 것처럼 시뮬레이션합니다.
                  </div>
                </div>
                <Badge variant={saved ? "sky" : "amber"}>
                  {saved ? "완료" : "실행"}
                </Badge>
              </div>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

