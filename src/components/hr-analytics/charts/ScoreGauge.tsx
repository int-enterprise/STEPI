"use client";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

function getGaugeColor(score: number) {
  if (score >= 85) return "#4f8bd6";
  if (score >= 75) return "#e56a8a";
  if (score >= 60) return "#f1b04a";
  return "#e56a8a";
}

export function ScoreGauge({
  score,
  size = 200,
  label = "Turing score",
}: ScoreGaugeProps) {
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(17,24,39,0.08)"
          strokeWidth="10"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getGaugeColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-[-0.04em] text-[#111827]">
          {score.toFixed(1)}
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          {label}
        </span>
      </div>
    </div>
  );
}
