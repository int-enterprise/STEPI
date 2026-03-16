"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/resumes", label: "이력서 관리" },
  { href: "/settings", label: "평가 설정" },
  { href: "/upload", label: "지원자 업로드" },
  { href: "/monitoring", label: "모니터링" },
  { href: "/hr-analytics", label: "Turing" },
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
        role: localStorage.getItem("stepi_role") ?? "HR Manager",
      };
    } catch {
      return { email: "hr@company.com", role: "HR Manager" };
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1500px] px-6 py-5">
        <header className="flex flex-col gap-4 rounded-[20px] border border-[rgba(10,36,101,0.08)] bg-white px-5 py-4 shadow-[0_8px_30px_rgba(10,36,101,0.04)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
            <div>
              <div className="text-[22px] font-semibold tracking-[-0.03em] text-[#000000]">
                SmartHire Eval
              </div>
              <div className="mt-1 text-[12px] text-[#7B8DB8]">
                AI candidate evaluation dashboard
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                      active
                        ? "bg-[#000000] text-white"
                        : "text-[#5B6B95] hover:bg-[#FAFAFA] hover:text-[#000000]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="text-right">
              <div className="text-[12px] font-medium text-[#000000]">{user.role}</div>
              <div className="mt-0.5 text-[12px] text-[#7B8DB8]">{user.email}</div>
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
              className="rounded-full border border-[rgba(10,36,101,0.08)] bg-white px-4 py-2 text-[13px] font-medium text-[#5B6B95] transition hover:bg-[#FAFAFA] hover:text-[#000000]"
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
