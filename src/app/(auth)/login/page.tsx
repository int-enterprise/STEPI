"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Chrome, Github } from "lucide-react";
import { cn } from "@/lib/cn";

const MOCK_ACCOUNTS = new Map<string, string>([
  ["admin@company.com", "1234"],
  ["hr@company.com", "1234"],
]);

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("hr@company.com");
  const [password, setPassword] = useState("1234");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const roleLabel = useMemo(() => {
    if (email.startsWith("admin@")) return "Administrator";
    if (email.startsWith("hr@")) return "HR Manager";
    return "Viewer";
  }, [email]);

  const title = mode === "signup" ? "SIGN UP" : "SIGN IN";
  const submitLabel = loading
    ? mode === "signup"
      ? "Creating account..."
      : "Signing in..."
    : mode === "signup"
      ? "Create account"
      : "Sign in";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 650));

    if (mode === "signup") {
      if (!email || !password || !repeatPassword) {
        setLoading(false);
        setError("Please complete every field to continue.");
        return;
      }

      if (password !== repeatPassword) {
        setLoading(false);
        setError("Passwords do not match.");
        return;
      }

      setLoading(false);
      setNotice("Demo mode supports sign in only. Use one of the demo accounts below.");
      return;
    }

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

  function activateMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
    if (nextMode === "signin") {
      setRepeatPassword("");
    }
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setError(null);
    setNotice(null);
    setMode("signin");
  }

  return (
    <div className="min-h-screen bg-white px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="flex w-full items-center justify-center py-6 sm:py-8">
          <div className="mx-auto w-full max-w-[34rem]">
            <div className="rounded-[34px] border border-[rgba(17,24,39,0.08)] bg-white px-6 py-8 shadow-[0_24px_60px_rgba(17,24,39,0.08)] sm:px-8 sm:py-10">
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-[0.32em] text-[#1f4e86]">
                  SmartHire Eval
                </div>
                <h2 className="mt-5 text-5xl font-semibold tracking-[-0.08em] text-[#9a2e47] sm:text-6xl">
                  {title}
                </h2>
                </div>

                <ul className="mt-10 flex items-center justify-between gap-4 text-sm font-semibold uppercase tracking-[0.24em]">
                  <li>
                    <button
                      type="button"
                      onClick={() => activateMode("signin")}
                      className={cn(
                        "transition",
                        mode === "signin"
                          ? "text-slate-900"
                          : "text-slate-400 hover:text-slate-700"
                      )}
                    >
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => activateMode("signup")}
                      className={cn(
                        "transition",
                        mode === "signup"
                          ? "text-slate-900"
                          : "text-slate-400 hover:text-slate-700"
                      )}
                    >
                      Sign Up
                    </button>
                  </li>
                  <li className="ml-auto">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      Reset
                    </button>
                  </li>
                </ul>

                <form onSubmit={onSubmit} className="mt-7">
                  <div className="space-y-5">
                    <div className="relative">
                      <span
                        className={cn(
                          "pointer-events-none absolute -top-3 block h-6 w-6 rotate-45 border border-b-0 border-r-0 bg-white shadow-[0_2px_12px_rgba(17,24,39,0.04)] transition-all",
                          mode === "signin" ? "left-8" : "left-[8.25rem]"
                        )}
                      />
                      <div className="rounded-[28px] border border-[rgba(79,139,214,0.16)] bg-white px-5 py-1 shadow-[0_16px_36px_rgba(79,139,214,0.08)]">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className={cn(
                            "w-full bg-transparent py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                          )}
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-[rgba(229,106,138,0.16)] bg-white px-5 py-1 shadow-[0_16px_36px_rgba(229,106,138,0.08)]">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        className="w-full bg-transparent py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      />
                    </div>

                    {mode === "signup" ? (
                      <div className="rounded-[28px] border border-[rgba(241,176,74,0.18)] bg-white px-5 py-1 shadow-[0_16px_36px_rgba(241,176,74,0.08)]">
                        <input
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          placeholder="Repeat password"
                          type="password"
                          className="w-full bg-transparent py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                          autoComplete="new-password"
                        />
                      </div>
                    ) : null}

                    {error ? (
                      <div className="rounded-[22px] border border-[rgba(248,113,113,0.25)] bg-[rgba(254,242,242,0.95)] px-4 py-3 text-sm text-rose-700">
                        {error}
                      </div>
                    ) : null}

                    {notice ? (
                      <div className="rounded-[22px] border border-[rgba(79,139,214,0.18)] bg-[rgba(242,248,255,0.95)] px-4 py-3 text-sm text-[#1f4e86]">
                        {notice}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-[28px] px-4 py-4 text-sm font-semibold text-white transition",
                        "bg-[linear-gradient(135deg,#4f8bd6,#7eaee7_55%,#e56a8a_125%)] shadow-[0_18px_30px_rgba(79,139,214,0.24)]",
                        "hover:translate-y-[-1px] hover:shadow-[0_22px_34px_rgba(79,139,214,0.28)]",
                        "disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                      )}
                    >
                      {submitLabel}
                    </button>
                  </div>
                </form>

                <div className="relative mx-auto mt-8 flex w-[92%] items-center justify-center text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                  <span className="absolute left-0 top-1/2 h-px w-[42%] -translate-y-1/2 bg-[rgba(17,24,39,0.12)]" />
                  <span className="absolute right-0 top-1/2 h-px w-[42%] -translate-y-1/2 bg-[rgba(17,24,39,0.12)]" />
                  <span className="bg-transparent px-3">OR</span>
                </div>

                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-[28px] bg-[linear-gradient(135deg,#4f8bd6,#7eaee7)] px-4 py-4 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(79,139,214,0.24)] transition hover:translate-y-[-1px]"
                  >
                    <Chrome className="h-4 w-4" />
                    Sign in with Google
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-[28px] border border-[var(--border)] bg-white/82 px-4 py-4 text-sm font-semibold text-slate-900 shadow-[0_16px_28px_rgba(17,24,39,0.08)] transition hover:translate-y-[-1px]"
                  >
                    <Github className="h-4 w-4" />
                    Sign in with GitHub
                  </button>
                </div>

                <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-white px-5 py-4 text-center text-sm text-slate-600">
                  Demo access:
                  <span className="ml-1 font-medium text-slate-900">
                    admin@company.com / 1234
                  </span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="font-medium text-slate-900">
                    hr@company.com / 1234
                  </span>
                </div>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}
