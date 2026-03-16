"use client";

import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { ClientOnly } from "@/components/utils/ClientOnly";

type Point = { t: string; v: number };

function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    // xorshift32 (deterministic)
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function genSeries(seed: number, base: number, volatility: number, n = 28): Point[] {
  const rnd = prng(seed * 12345 + 6789);
  let x = base;
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const noise =
      Math.sin((i + seed) / 3.2) * volatility + (rnd() - 0.5) * volatility * 0.9;
    x = Math.max(0, Math.min(100, x + noise));
    out.push({ t: `${(i + 1).toString().padStart(2, "0")}:00`, v: Number(x.toFixed(1)) });
  }
  return out;
}

function status(v: number) {
  if (v >= 85) return { label: "경고", variant: "rose" as const };
  if (v >= 70) return { label: "주의", variant: "amber" as const };
  return { label: "정상", variant: "sky" as const };
}

export default function MonitoringPage() {
  const cpu = useMemo(() => genSeries(1, 52, 7), []);
  const gpu = useMemo(() => genSeries(4, 62, 9), []);
  const mem = useMemo(() => genSeries(7, 58, 5), []);
  const api = useMemo(() => genSeries(10, 44, 11).map((p) => ({ ...p, v: Math.round(p.v * 18) })), []);

  const cpuNow = cpu[cpu.length - 1]?.v ?? 0;
  const gpuNow = gpu[gpu.length - 1]?.v ?? 0;
  const memNow = mem[mem.length - 1]?.v ?? 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {[
          { title: "CPU 사용률", v: cpuNow, unit: "%", s: status(cpuNow) },
          { title: "GPU 사용률", v: gpuNow, unit: "%", s: status(gpuNow) },
          { title: "메모리 사용률", v: memNow, unit: "%", s: status(memNow) },
          { title: "동시 평가 건수", v: Math.round(8 + (gpuNow / 100) * 14), unit: "건", s: status(gpuNow) },
        ].map((m) => (
          <Card key={m.title} tone="sky">
            <CardBody className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[12px] text-[var(--muted)]">{m.title}</div>
                  <div className="mt-1 text-2xl font-semibold text-[#000000]">
                    {m.v.toFixed ? m.v.toFixed(1) : m.v}
                    <span className="ml-1 text-[12px] text-[rgba(10,36,101,0.60)]">
                      {m.unit}
                    </span>
                  </div>
                </div>
                <Badge variant={m.s.variant}>{m.s.label}</Badge>
              </div>
              <div className="mt-3 h-2 w-full rounded-[999px] bg-[rgba(10,36,101,0.06)] overflow-hidden">
                <div
                  className="h-full rounded-[999px] bg-[#0A2465]"
                  style={{ width: `${Math.min(100, Math.max(0, Number(m.v)))}%` }}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-3">
        <Card>
          <CardHeader
            title="리소스 트렌드"
            sub="실시간처럼 보이는 mock 그래프"
            right={<Button size="xs">상세</Button>}
          />
          <CardBody className="pt-0">
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "CPU", data: cpu, color: "#0A2465" },
                { title: "GPU", data: gpu, color: "#5B6B95" },
                { title: "MEM", data: mem, color: "#7B8DB8" },
              ].map((c) => (
                <div key={c.title} className="rounded-[14px] border border-[var(--border)] bg-white px-3.5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-[#000000]">
                      {c.title}
                    </div>
                    <Badge variant="muted">{c.data[c.data.length - 1]?.v.toFixed(1)}%</Badge>
                  </div>
                  <div className="mt-2 h-[140px]">
                    <ClientOnly fallback={<div className="h-full w-full" />}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={c.data} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
                          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
                          <XAxis dataKey="t" tick={{ fontSize: 10, fill: "rgba(10,36,101,0.55)" }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "rgba(10,36,101,0.45)" }} axisLine={false} tickLine={false} />
                          <Tooltip
                            formatter={(v: unknown) => [`${v}%`, c.title]}
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid rgba(10,36,101,0.12)",
                              boxShadow: "0 12px 30px rgba(10,36,101,0.12)",
                            }}
                          />
                          <Line type="monotone" dataKey="v" stroke={c.color} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ClientOnly>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card tone="amber">
          <CardHeader title="API 호출/지연" sub="호출 수 · 평균 응답 시간 · 실패율" />
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "API 호출 수", v: api[api.length - 1]?.v ?? 0, unit: "회", variant: "sky" as const },
                { k: "평균 응답 시간", v: Math.round(240 + (cpuNow / 100) * 320), unit: "ms", variant: "amber" as const },
                { k: "평가 실패율", v: Number((0.3 + (gpuNow / 100) * 2.2).toFixed(1)), unit: "%", variant: gpuNow > 80 ? ("rose" as const) : ("muted" as const) },
                { k: "스토리지 사용량", v: Math.round(62 + (memNow / 100) * 18), unit: "%", variant: memNow > 75 ? ("amber" as const) : ("sky" as const) },
              ].map((m) => (
                <div key={m.k} className="rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div className="text-[12px] text-[var(--muted)]">{m.k}</div>
                    <Badge variant={m.variant}>{m.variant === "muted" ? "정상" : "상태"}</Badge>
                  </div>
                  <div className="mt-1 text-xl font-semibold text-[#000000]">
                    {m.v}
                    <span className="ml-1 text-[12px] text-[rgba(10,36,101,0.60)]">{m.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-semibold text-[#000000]">
                  API 호출 추세
                </div>
                <Badge variant="muted">최근 {api.length}시간</Badge>
              </div>
              <div className="mt-2 h-[170px]">
                <ClientOnly fallback={<div className="h-full w-full" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={api} margin={{ top: 6, right: 6, bottom: 0, left: -10 }}>
                      <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
                      <XAxis dataKey="t" tick={{ fontSize: 10, fill: "rgba(10,36,101,0.55)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "rgba(10,36,101,0.45)" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v: unknown) => [`${v}회`, "호출 수"]}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(10,36,101,0.12)",
                          boxShadow: "0 12px 30px rgba(10,36,101,0.12)",
                        }}
                      />
                      <Area type="monotone" dataKey="v" stroke="#0A2465" fill="rgba(10,36,101,0.14)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ClientOnly>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

