"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "평가 대시보드" },
  { href: "/resumes", label: "이력서 관리" },
  { href: "/settings", label: "평가 설정" },
  { href: "/upload", label: "대상자/업로드" },
  { href: "/monitoring", label: "서버 모니터링" },
  { href: "/hr-analytics", label: "HR 효율 분석" },
];

function isAuthed() {
  try {
    return localStorage.getItem("stepi_auth") === "1";
  } catch {
    return false;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthed()) router.replace("/login");
  }, [router]);

  const user = useMemo(() => {
    try {
      return {
        email: localStorage.getItem("stepi_user") ?? "hr@company.com",
        role: localStorage.getItem("stepi_role") ?? "HR 담당자",
      };
    } catch {
      return { email: "hr@company.com", role: "HR 담당자" };
    }
  }, []);

  return (
    <div className="min-h-screen app-grid-bg">
      <div className="mx-auto max-w-[1440px] px-6 py-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--accent-sky-bg)] grid place-items-center text-[var(--chart-1)] font-semibold">
                S
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  STEPI
                </div>
                <div className="text-[11px] text-[var(--muted)] -mt-0.5">
                  AI 지원자 평가 시스템
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 rounded-[999px] border border-[var(--border)] bg-[rgba(255,255,255,0.7)] px-1 py-1 backdrop-blur">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3.5 py-1.5 text-xs rounded-[999px] transition",
                      active
                        ? "bg-white shadow-sm border border-[var(--border)] text-[#111827]"
                        : "text-[var(--muted)] hover:text-[#111827] hover:bg-white/60"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 rounded-[999px] border border-[var(--border)] bg-white/70 px-3 py-1.5 backdrop-blur">
              <div className="h-7 w-7 rounded-full border border-[var(--border)] bg-[rgba(17,24,39,0.03)]" />
              <div className="leading-tight">
                <div className="text-[12px] font-medium">{user.role}</div>
                <div className="text-[11px] text-[var(--muted)] -mt-0.5">
                  {user.email}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-[var(--muted)]" />
            </div>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem("stepi_auth");
                } catch {
                  // ignore
                }
                router.replace("/login");
              }}
              className="rounded-[999px] border border-[var(--border)] bg-white px-3.5 py-2 text-xs text-[var(--muted)] hover:text-[#111827] hover:bg-white/70 transition"
            >
              로그아웃
            </button>
          </div>
        </header>

        <main className="mt-5">{children}</main>
      </div>
    </div>
  );
}

