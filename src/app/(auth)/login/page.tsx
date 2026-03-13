"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const MOCK_ACCOUNTS = new Map<string, string>([
  ["admin@company.com", "1234"],
  ["hr@company.com", "1234"],
]);

const HIGHLIGHTS = [
  "AI interview summaries and score trends in one place",
  "Role-based review flow for admin and HR teams",
  "Fast access to resume, monitoring, and analytics pages",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("hr@company.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => {
    if (email.startsWith("admin@")) return "Administrator";
    if (email.startsWith("hr@")) return "HR Manager";
    return "Viewer";
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 650));

    const ok = MOCK_ACCOUNTS.get(email) === password;
    if (!ok) {
      setLoading(false);
      setError("The email or password you entered is incorrect.");
      return;
    }

    try {
      localStorage.setItem("stepi_auth", "1");
      localStorage.setItem("stepi_role", roleLabel);
      localStorage.setItem("stepi_user", email);
    } catch {
      // ignore storage failures in demo mode
    }

    router.replace("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,177,153,0.24),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(64,196,196,0.16),transparent_24%),linear-gradient(135deg,#07141a_0%,#0f2730_42%,#173e46_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[rgba(255,166,138,0.18)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-0 h-80 w-80 rounded-full bg-[rgba(78,214,199,0.15)] blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/12 bg-white/8 shadow-[0_30px_80px_rgba(3,10,14,0.38)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
          <section className="relative flex min-h-[420px] flex-col justify-between border-b border-white/10 px-7 py-8 text-white sm:px-10 sm:py-10 lg:border-b-0 lg:border-r">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/82 backdrop-blur">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#ffd7c8,#8ce3d4)] text-sm font-semibold text-slate-900">
                  S
                </span>
                <div>
                  <div className="text-sm font-semibold tracking-[0.22em] text-white">
                    STEPI
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.32em] text-white/55">
                    Talent Intelligence Suite
                  </div>
                </div>
              </div>

              <div className="mt-10 max-w-xl">
                <p className="text-sm uppercase tracking-[0.34em] text-[#ffb199]">
                  Recruitment Command Center
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  A sharper login experience for modern hiring teams.
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/72 sm:text-base">
                  Inspired by your sample layout, reworked with a deeper teal
                  atmosphere and warmer accents so it feels closer to the rest
                  of the product.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/48">
                    Sessions
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    128
                  </div>
                  <div className="mt-1 text-xs text-[#8ce3d4]">
                    Active this week
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/48">
                    Review flow
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    3-step
                  </div>
                  <div className="mt-1 text-xs text-[#ffd7c8]">
                    Screening to final
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/48">
                    Access
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    Role-based
                  </div>
                  <div className="mt-1 text-xs text-[#c7f1ea]">
                    Admin and HR ready
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] p-6 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.32em] text-white/48">
                  Why teams use STEPI
                </div>
                <div className="mt-4 grid gap-3">
                  {HIGHLIGHTS.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
                    >
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(255,177,153,0.18)] text-xs font-semibold text-[#ffd7c8]">
                        0{index + 1}
                      </div>
                      <p className="text-sm leading-6 text-white/76">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center bg-[linear-gradient(180deg,rgba(255,248,244,0.95),rgba(245,251,250,0.92))] px-5 py-7 sm:px-8 sm:py-9">
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[30px] border border-[rgba(15,23,42,0.08)] bg-white/88 p-6 shadow-[0_20px_55px_rgba(10,34,44,0.12)] backdrop-blur sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-[#0f766e]">
                      Secure access
                    </div>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                      Sign in
                    </h2>
                  </div>
                  <div className="rounded-full border border-[rgba(15,118,110,0.14)] bg-[rgba(240,253,250,0.92)] px-4 py-2 text-right">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Workspace
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-900">
                      STEPI Portal
                    </div>
                  </div>
                </div>

                <div className="mt-6 inline-flex rounded-full border border-[rgba(15,23,42,0.08)] bg-[rgba(248,250,252,0.9)] p-1">
                  <div className="rounded-full bg-[linear-gradient(135deg,#12343b,#1c5b62)] px-4 py-2 text-sm font-medium text-white shadow-[0_10px_25px_rgba(18,52,59,0.22)]">
                    Sign In
                  </div>
                  <div className="px-4 py-2 text-sm text-slate-400">
                    Team Access
                  </div>
                </div>

                <form onSubmit={onSubmit} className="mt-7">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Email
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@company.com"
                        className={cn(
                          "mt-2 w-full rounded-full border px-4 py-3 text-sm text-slate-900 outline-none transition",
                          "border-[rgba(15,23,42,0.08)] bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
                          "focus:border-[rgba(15,118,110,0.45)] focus:ring-4 focus:ring-[rgba(20,184,166,0.12)]"
                        )}
                        autoComplete="username"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Password
                        </label>
                        <span className="text-xs text-slate-400">
                          Demo access only
                        </span>
                      </div>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="1234"
                        type="password"
                        className={cn(
                          "mt-2 w-full rounded-full border px-4 py-3 text-sm text-slate-900 outline-none transition",
                          "border-[rgba(15,23,42,0.08)] bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]",
                          "focus:border-[rgba(249,115,22,0.45)] focus:ring-4 focus:ring-[rgba(251,146,60,0.14)]"
                        )}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <label className="flex items-center gap-3 text-slate-500">
                      <span className="grid h-5 w-5 place-items-center rounded-md border border-[rgba(15,118,110,0.2)] bg-[rgba(240,253,250,0.9)] text-[10px] font-bold text-[#0f766e]">
                        ✓
                      </span>
                      Keep me signed in
                    </label>
                    <button
                      type="button"
                      className="text-sm text-[#0f766e] transition hover:text-[#115e59]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error ? (
                    <div className="mt-5 rounded-[22px] border border-[rgba(248,113,113,0.25)] bg-[rgba(254,242,242,0.95)] px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[22px] border border-[rgba(15,23,42,0.08)] bg-[rgba(248,250,252,0.9)] px-4 py-3 text-sm text-slate-600">
                      Demo accounts:
                      <span className="ml-1 font-medium text-slate-900">
                        admin@company.com / 1234
                      </span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span className="font-medium text-slate-900">
                        hr@company.com / 1234
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold text-white transition",
                      "bg-[linear-gradient(135deg,#12343b,#1d5f67_55%,#f08c54_130%)] shadow-[0_18px_30px_rgba(18,52,59,0.26)]",
                      "hover:translate-y-[-1px] hover:shadow-[0_22px_34px_rgba(18,52,59,0.3)]",
                      "disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                  >
                    {loading ? "Signing in..." : "Enter STEPI"}
                  </button>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-[rgba(15,23,42,0.08)] pt-5 text-sm">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">
                        Current role
                      </div>
                      <div className="mt-1 font-medium text-slate-900">
                        {roleLabel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">
                        Viewport
                      </div>
                      <div className="mt-1 font-medium text-slate-900">
                        Optimized for desktop
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
