"use client";

import { useMemo, useState } from "react";
import { useCandidateStore } from "@/store/candidate-store";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function ResumesPage() {
  const { candidates, setSelectedId } = useCandidateStore();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"전체" | string>("전체");

  const roles = useMemo(() => {
    const set = new Set(candidates.map((c) => c.appliedRole));
    return ["전체", ...Array.from(set)];
  }, [candidates]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return candidates
      .filter((c) => (role === "전체" ? true : c.appliedRole === role))
      .filter((c) => {
        if (!s) return true;
        return (
          c.name.toLowerCase().includes(s) ||
          c.appliedRole.toLowerCase().includes(s) ||
          c.education.school.toLowerCase().includes(s) ||
          c.prevCompany.toLowerCase().includes(s)
        );
      });
  }, [candidates, q, role]);

  return (
    <div className="grid grid-cols-[1fr_420px] gap-3">
      <Card>
        <CardHeader
          title="이력서 데이터 관리"
          sub="지원자 목록 조회 · 업로드 상태 · 평가 완료 여부"
          right={
            <div className="flex items-center gap-2">
              <Button variant="outline">PDF/DOCX 업로드</Button>
              <Button variant="primary">신규 지원자</Button>
            </div>
          }
        />
        <CardBody className="pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="이름/직무/학교/이전 회사 검색"
                className={cn(
                  "w-[320px] rounded-xl border bg-white px-3.5 py-2 text-sm outline-none transition",
                  "border-[var(--border)] focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[rgba(79,139,214,0.10)]"
                )}
              />
            </div>
            <div className="flex items-center gap-1 rounded-[999px] border border-[var(--border)] bg-white px-1 py-1">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-[999px] px-3 py-1.5 text-xs transition",
                    role === r
                      ? "bg-[rgba(17,24,39,0.06)] text-[#111827]"
                      : "text-[var(--muted)] hover:text-[#111827]"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <Badge variant="muted">총 {rows.length}명</Badge>
          </div>

          <div className="mt-3 overflow-hidden rounded-[14px] border border-[var(--border)] bg-white">
            <div className="grid grid-cols-[120px_140px_1fr_120px_120px_120px_140px] gap-0 border-b border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-3 py-2 text-[11px] font-medium text-[rgba(17,24,39,0.70)]">
              <div>이름</div>
              <div>지원 직무</div>
              <div>학력/전공</div>
              <div>경력(연차)</div>
              <div>업로드</div>
              <div>평가</div>
              <div className="text-right">액션</div>
            </div>

            {rows.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[120px_140px_1fr_120px_120px_120px_140px] items-center px-3 py-2.5 text-sm border-b border-[rgba(17,24,39,0.06)] hover:bg-[rgba(17,24,39,0.015)] transition"
              >
                <div className="font-medium text-[#111827]">{c.name}</div>
                <div className="text-[12px] text-[rgba(17,24,39,0.75)]">
                  {c.appliedRole}
                </div>
                <div className="text-[12px] text-[rgba(17,24,39,0.72)]">
                  {c.education.school} · {c.education.level} · {c.education.major}
                </div>
                <div className="text-[12px] text-[rgba(17,24,39,0.72)]">
                  {c.experienceYears.toFixed(1)}년
                </div>
                <div>
                  <Badge variant="muted">{c.uploadedAt}</Badge>
                </div>
                <div>
                  {c.evaluationDone ? (
                    <Badge variant="sky">완료</Badge>
                  ) : (
                    <Badge variant="amber">대기</Badge>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="xs"
                    onClick={() => {
                      setSelectedId(c.id);
                      window.location.href = "/dashboard";
                    }}
                  >
                    대시보드
                  </Button>
                  <Button size="xs" variant="outline">
                    수정
                  </Button>
                  <Button size="xs" variant="ghost">
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card tone="sky">
        <CardHeader title="지원자 상세(미리보기)" sub="선택 후 대시보드로 이동" />
        <CardBody className="pt-1">
          <div className="rounded-[14px] border border-[var(--border)] bg-white px-4 py-4">
            <div className="text-sm font-semibold text-[#111827]">
              사용 방법
            </div>
            <div className="mt-2 text-[12px] leading-[1.7] text-[rgba(17,24,39,0.72)]">
              - 목록에서 지원자를 확인하고 <b>대시보드</b> 버튼을 누르면 해당 지원자의 평가 결과 화면으로 이동합니다.
              <br />- 업로드/평가 상태는 목데이터 기반으로 표시됩니다.
              <br />- 실제 파일 업로드는 <b>대상자/업로드</b> 페이지에서 UX 형태로 제공됩니다.
            </div>
          </div>

          <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-4 py-4">
            <div className="text-[12px] font-medium text-[#111827]">
              목데이터 필드 예시
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                "이름",
                "성별",
                "연령대",
                "학력/전공/학교",
                "경력 연차",
                "이전 회사",
                "프로젝트 경험",
                "기술 스택",
                "지원 직무",
                "자기소개서 요약",
                "인적성 결과",
                "업로드 일시",
              ].map((t) => (
                <Badge key={t} variant="muted" className="bg-white/60">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

