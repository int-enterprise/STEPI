"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const MOCK_ACCOUNTS = new Map<string, string>([
  ["admin@company.com", "1234"],
  ["hr@company.com", "1234"],
]);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("hr@company.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => {
    if (email.startsWith("admin@")) return "관리자";
    if (email.startsWith("hr@")) return "HR 담당자";
    return "사용자";
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 650));

    const ok = MOCK_ACCOUNTS.get(email) === password;
    if (!ok) {
      setLoading(false);
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    try {
      localStorage.setItem("stepi_auth", "1");
      localStorage.setItem("stepi_role", roleLabel);
      localStorage.setItem("stepi_user", email);
    } catch {
      // ignore
    }

    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-[420px] rounded-[18px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_40px_rgba(17,24,39,0.10)]">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <div className="h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--accent-sky-bg)] grid place-items-center text-[var(--chart-1)] font-semibold">
                S
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-tight">
                  STEPI
                </div>
                <div className="text-xs text-[var(--muted)] -mt-0.5">
                  AI 지원자 평가 시스템
                </div>
              </div>
            </div>
            <div className="text-xs text-[var(--muted)]">
              프로토타입
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[18px] font-semibold tracking-tight">
              로그인
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">
              관리자/HR 담당자 계정으로 데모를 확인하세요.
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="px-8 pb-8">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[var(--muted)]">
                이메일
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className={cn(
                  "mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition",
                  "border-[var(--border)] focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[rgba(79,139,214,0.12)]"
                )}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted)]">
                비밀번호
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
                type="password"
                className={cn(
                  "mt-1 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition",
                  "border-[var(--border)] focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[rgba(229,106,138,0.12)]"
                )}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-[rgba(229,106,138,0.35)] bg-[var(--accent-rose-bg)] px-3.5 py-2.5 text-sm text-[#9a2e47]">
              {error}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[rgba(17,24,39,0.02)] px-3.5 py-2.5 text-xs text-[var(--muted)]">
              목데모 계정: <b>admin@company.com</b> / <b>1234</b>,{" "}
              <b>hr@company.com</b> / <b>1234</b>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition",
              "bg-[#111827] text-white hover:bg-[#0b1220] disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="mt-5 text-xs text-[var(--muted)] flex items-center justify-between">
            <span>
              현재 역할: <b className="text-[#111827]">{roleLabel}</b>
            </span>
            <span className="text-[rgba(17,24,39,0.55)]">
              데스크탑 최적화(1440px)
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

