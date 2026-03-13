"use client";

import { useMemo, useRef, useState } from "react";
import { useCandidateStore } from "@/store/candidate-store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type FakeFile = { name: string; size: number; type: string };

export default function UploadPage() {
  const { candidates, selectedId, selected, setSelectedId } = useCandidateStore();
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<FakeFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [connected, setConnected] = useState(false);
  const timerRef = useRef<number | null>(null);

  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedId) ?? candidates[0],
    [candidates, selectedId]
  );

  function startFakeUpload(f: FakeFile) {
    setFile(f);
    setConnected(false);
    setProgress(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.max(3, Math.round(Math.random() * 11)));
        if (next >= 100 && timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return next;
      });
    }, 260);
  }

  function onPickFile() {
    // 실제 파일 업로드 대신 목데모 UX
    const f: FakeFile = {
      name: `${selectedCandidate.name}_resume.pdf`,
      size: 420_000 + Math.round(Math.random() * 1_200_000),
      type: "application/pdf",
    };
    startFakeUpload(f);
  }

  return (
    <div className="grid grid-cols-[360px_1fr] gap-3">
      <Card>
        <CardHeader
          title="대상자 선택"
          sub="좌측 리스트에서 지원자를 선택하세요."
          right={<Badge variant="muted">{candidates.length}명</Badge>}
        />
        <CardBody className="pt-0">
          <div className="space-y-2">
            {candidates.map((c) => {
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full rounded-[14px] border px-4 py-3 text-left transition",
                    active
                      ? "border-[rgba(79,139,214,0.35)] bg-[var(--accent-sky-bg)]"
                      : "border-[var(--border)] bg-white hover:bg-[rgba(17,24,39,0.015)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-[#111827]">
                        {c.name}
                        <span className="ml-2 text-[11px] text-[rgba(17,24,39,0.55)] font-normal">
                          {c.gender} · {c.ageGroup}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[12px] text-[rgba(17,24,39,0.70)]">
                        {c.appliedRole} · {c.prevCompany} · {c.experienceYears.toFixed(1)}년
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {c.skills.slice(0, 5).map((s) => (
                          <Badge key={s} variant="muted" className="bg-white/70">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={c.evaluationDone ? "sky" : "amber"}>
                      {c.evaluationDone ? "평가 완료" : "평가 대기"}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card tone="sky" className="min-h-[560px]">
        <CardHeader
          title="이력서 업로드"
          sub="드래그 앤 드롭 · 파일 업로드 UX(실제 처리 없음)"
          right={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onPickFile}>
                파일 업로드
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setConnected(true);
                  setTimeout(() => {
                    window.location.href = "/dashboard";
                  }, 450);
                }}
                disabled={!file || progress < 100}
              >
                평가 시작
              </Button>
            </div>
          }
        />
        <CardBody className="pt-0">
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              startFakeUpload({
                name: "resume_uploaded.pdf",
                size: 980_000,
                type: "application/pdf",
              });
            }}
            className={cn(
              "mt-1 rounded-[18px] border border-dashed px-6 py-10 transition",
              drag
                ? "border-[rgba(79,139,214,0.55)] bg-[rgba(79,139,214,0.08)]"
                : "border-[rgba(17,24,39,0.20)] bg-white"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-[#111827]">
                  파일을 여기로 드롭하세요
                </div>
                <div className="mt-1 text-[12px] text-[var(--muted)]">
                  지원 형식: PDF / DOCX · 최대 10MB(목데모)
                </div>
              </div>
              <Badge variant="muted">Drag & Drop</Badge>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { k: "형식", v: "PDF/DOCX" },
                { k: "처리", v: "mock" },
                { k: "연동", v: "지원자 연결" },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-[14px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-4 py-3"
                >
                  <div className="text-[11px] text-[var(--muted)]">{x.k}</div>
                  <div className="mt-0.5 text-[13px] font-semibold text-[#111827]">
                    {x.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_340px] gap-3">
            <div className="rounded-[18px] border border-[var(--border)] bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-[#111827]">
                  업로드 상태
                </div>
                <Badge variant={progress >= 100 ? "sky" : "muted"}>
                  {progress >= 100 ? "완료" : "대기"}
                </Badge>
              </div>
              <div className="mt-3 h-2 w-full rounded-[999px] bg-[rgba(17,24,39,0.06)] overflow-hidden">
                <div
                  className="h-full rounded-[999px] bg-[var(--chart-1)] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-[12px] text-[var(--muted)]">
                {file ? (
                  <>
                    <b className="text-[#111827]">{file.name}</b> ·{" "}
                    {(file.size / 1024 / 1024).toFixed(2)}MB · {progress}%
                  </>
                ) : (
                  "아직 선택된 파일이 없습니다."
                )}
              </div>

              <div className="mt-4 rounded-[14px] border border-[rgba(79,139,214,0.22)] bg-[var(--accent-sky-bg)] px-4 py-3">
                <div className="text-[12px] font-semibold text-[#1f4e86]">
                  선택된 지원자에 평가 연결
                </div>
                <div className="mt-1 text-[12px] text-[rgba(31,78,134,0.78)] leading-[1.6]">
                  업로드된 이력서는 <b>{selectedCandidate.name}</b>({selectedCandidate.appliedRole})에게 연결됩니다.
                  평가 시작을 누르면 대시보드 카드가 해당 지원자 기준으로 동기화됩니다.
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[var(--border)] bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-[#111827]">
                  미리보기
                </div>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setProgress(0);
                    setConnected(false);
                  }}
                >
                  초기화
                </Button>
              </div>
              <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-4 py-4">
                <div className="text-[11px] text-[var(--muted)]">
                  (목데모) PDF 미리보기 영역
                </div>
                <div className="mt-2 h-[180px] rounded-xl border border-[rgba(17,24,39,0.10)] bg-white grid place-items-center text-[12px] text-[rgba(17,24,39,0.60)]">
                  {file ? "미리보기 준비 완료" : "파일을 업로드하면 표시됩니다"}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => startFakeUpload({ name: "prev_resume.docx", size: 760_000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })}
                >
                  이전 데이터 불러오기
                </Button>
                <Badge variant={connected ? "sky" : "muted"}>
                  {connected ? "연결됨" : "미연결"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-[14px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-4 py-3">
            <div className="text-[12px] text-[rgba(17,24,39,0.70)]">
              현재 선택: <b className="text-[#111827]">{selected.name}</b> ·{" "}
              {selected.appliedRole}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              대시보드로 이동
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

