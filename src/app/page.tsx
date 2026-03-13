"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function isAuthed() {
  try {
    return localStorage.getItem("stepi_auth") === "1";
  } catch {
    return false;
  }
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthed() ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="min-h-screen app-grid-bg grid place-items-center">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--muted)] shadow-[0_12px_30px_rgba(17,24,39,0.08)]">
        리다이렉트 중...
      </div>
    </div>
  );
}
