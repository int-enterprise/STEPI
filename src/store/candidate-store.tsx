"use client";

import { candidates } from "@/data/candidates";
import type { Candidate } from "@/types/candidate";
import { createContext, useContext, useMemo, useState } from "react";

type CandidateStore = {
  candidates: Candidate[];
  selectedId: string;
  selected: Candidate;
  setSelectedId: (id: string) => void;
};

const Ctx = createContext<CandidateStore | null>(null);

function getInitialId() {
  try {
    const saved = localStorage.getItem("stepi_candidate_id");
    if (saved && candidates.some((c) => c.id === saved)) return saved;
  } catch {
    // ignore
  }
  return candidates[0]?.id ?? "c-park-jiyun";
}

export function CandidateProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedIdState] = useState<string>(() => getInitialId());

  function setSelectedId(id: string) {
    setSelectedIdState(id);
    try {
      localStorage.setItem("stepi_candidate_id", id);
    } catch {
      // ignore
    }
  }

  const selected = useMemo(() => {
    return candidates.find((c) => c.id === selectedId) ?? candidates[0];
  }, [selectedId]);

  const value = useMemo<CandidateStore>(
    () => ({
      candidates,
      selectedId: selectedId || candidates[0]?.id || "",
      selected: selected ?? candidates[0],
      setSelectedId,
    }),
    [selected, selectedId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCandidateStore() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useCandidateStore must be used within CandidateProvider");
  }
  return ctx;
}

