"use client";

export interface PipelineResultItem {
  pipeline_name: string;
  tier: number;
  benchmark_name: string;
  metrics: Record<string, number>;
  score: number;
  tier_weight: number;
  execution_time_ms: number;
}

export interface Turing10Result {
  tier_name: string;
  pipeline_results: PipelineResultItem[];
  turing_score: number;
  grade: string;
  tier_breakdown: Record<
    string,
    {
      score: number;
      passed: boolean;
      benchmarks: number;
      passed_benchmarks: number;
    }
  >;
  ai_profile: {
    reasoning: number;
    perception: number;
    generation: number;
    robustness: number;
    efficiency: number;
  };
  strengths: string[];
  weaknesses: string[];
}

export interface Turing30Result {
  tier_name: string;
  anthropomorphic: {
    task_accuracy: number;
    efficiency: number;
    adaptability: number;
    communication: number;
    collaboration: number;
    autonomy: number;
    safety: number;
    overall_score: number;
  };
  meta_cognition: Record<string, number>;
  fault_tolerance: Record<string, { tolerance: number }>;
  scenario_results: Array<{
    name: string;
    type: string;
    difficulty: number;
    score: number;
    details: string;
  }>;
}

export interface Turing50Result {
  tier_name: string;
  benefit_breakdown: {
    individual: number;
    organization: number;
    enterprise: number;
  };
  risk_breakdown: {
    technical: number;
    operational: number;
    security: number;
    regulatory: number;
    human: number;
  };
  risk_adjusted_roi: number;
  go_decision: "go" | "conditional" | "no_go";
  recommendation: string;
  improvement_roadmap: {
    short_term: string[];
    mid_term: string[];
    long_term: string[];
  };
}

export interface HrEvaluationReport {
  summary: {
    modelName: string;
    version: string;
    organization: string;
    status: string;
    lastUpdated: string;
    evaluator: string;
    useCase: string;
  };
  overall: {
    turingScore: number;
    grade: string;
    percentile: number;
    deploymentReadiness: string;
    hiringImpact: string;
  };
  turing10: Turing10Result;
  turing30: Turing30Result;
  turing50: Turing50Result;
}

export const MOCK_HR_EVALUATION: HrEvaluationReport = {
  summary: {
    modelName: "Talent Copilot Screening Assistant",
    version: "5.2.1-hr",
    organization: "STEPI HR Innovation Lab",
    status: "Mock evaluation complete",
    lastUpdated: "2026-03-14 09:30 KST",
    evaluator: "HR Analytics Team",
    useCase: "resume screening, interview briefing, and recruiter decision support",
  },
  overall: {
    turingScore: 81.4,
    grade: "A-",
    percentile: 88,
    deploymentReadiness: "Pilot ready with governance controls",
    hiringImpact: "Expected 31% reduction in screening turnaround time",
  },
  turing10: {
    tier_name: "Core capability assessment",
    pipeline_results: [
      {
        pipeline_name: "HR Screening",
        tier: 1,
        benchmark_name: "Resume parsing accuracy",
        metrics: { accuracy: 0.94, recall: 0.9 },
        score: 91.2,
        tier_weight: 0.25,
        execution_time_ms: 1240,
      },
      {
        pipeline_name: "HR Screening",
        tier: 2,
        benchmark_name: "Job description matching",
        metrics: { precision: 0.88, recall: 0.83 },
        score: 84.6,
        tier_weight: 0.25,
        execution_time_ms: 1750,
      },
      {
        pipeline_name: "HR Screening",
        tier: 3,
        benchmark_name: "Interview prompt generation",
        metrics: { usefulness: 0.81, clarity: 0.86 },
        score: 79.3,
        tier_weight: 0.2,
        execution_time_ms: 2190,
      },
      {
        pipeline_name: "HR Screening",
        tier: 4,
        benchmark_name: "Bias guardrail consistency",
        metrics: { fairness: 0.78, stability: 0.74 },
        score: 73.5,
        tier_weight: 0.15,
        execution_time_ms: 2420,
      },
      {
        pipeline_name: "HR Screening",
        tier: 5,
        benchmark_name: "Edge case reasoning",
        metrics: { reasoning: 0.69, calibration: 0.72 },
        score: 68.1,
        tier_weight: 0.15,
        execution_time_ms: 2875,
      },
    ],
    turing_score: 81.4,
    grade: "A-",
    tier_breakdown: {
      "Tier 1 Core": { score: 91.2, passed: true, benchmarks: 4, passed_benchmarks: 4 },
      "Tier 2 Matching": { score: 84.6, passed: true, benchmarks: 3, passed_benchmarks: 3 },
      "Tier 3 Generation": { score: 79.3, passed: true, benchmarks: 3, passed_benchmarks: 2 },
      "Tier 4 Governance": { score: 73.5, passed: true, benchmarks: 3, passed_benchmarks: 2 },
      "Tier 5 Reasoning": { score: 68.1, passed: false, benchmarks: 2, passed_benchmarks: 1 },
    },
    ai_profile: {
      reasoning: 74.1,
      perception: 89.4,
      generation: 81.3,
      robustness: 72.4,
      efficiency: 86.7,
    },
    strengths: [
      "Resume parsing remains highly stable across Korean and English candidate profiles.",
      "The assistant produces interview question sets with strong role alignment and low repetition.",
      "Screening throughput stays efficient even during high-volume application bursts.",
    ],
    weaknesses: [
      "Edge case reasoning still drops when candidate histories are sparse or highly non-linear.",
      "Bias guardrails need tighter calibration for ambiguous leadership or career break cases.",
      "The model occasionally overconfidently ranks adjacent-fit candidates too aggressively.",
    ],
  },
  turing30: {
    tier_name: "Anthropomorphic workflow assessment",
    anthropomorphic: {
      task_accuracy: 83.7,
      efficiency: 86.5,
      adaptability: 76.8,
      communication: 81.2,
      collaboration: 79.4,
      autonomy: 70.5,
      safety: 84.1,
      overall_score: 80.3,
    },
    meta_cognition: {
      self_awareness: 0.74,
      uncertainty_estimation: 0.78,
      learning_rate: 0.66,
      error_detection: 0.82,
      strategy_selection: 0.71,
    },
    fault_tolerance: {
      missing_resume_fields: { tolerance: 0.76 },
      adversarial_prompting: { tolerance: 0.69 },
      policy_conflict: { tolerance: 0.73 },
      partial_context_loss: { tolerance: 0.81 },
    },
    scenario_results: [
      {
        name: "High-volume screening sprint",
        type: "operations",
        difficulty: 4,
        score: 88.4,
        details: "Maintained ranking quality while processing a surge of 500 applicants in one batch.",
      },
      {
        name: "Hiring manager calibration sync",
        type: "collaboration",
        difficulty: 6,
        score: 79.1,
        details: "Balanced recruiter guidance with hiring manager feedback and highlighted score disagreements.",
      },
      {
        name: "Ambiguous resume escalation",
        type: "judgment",
        difficulty: 8,
        score: 67.3,
        details: "Handled non-traditional career paths reasonably well but confidence calibration needs work.",
      },
      {
        name: "Bias-sensitive shortlist review",
        type: "safety",
        difficulty: 7,
        score: 82.8,
        details: "Flagged risky phrasing and suggested policy-aligned rationale for candidate comparisons.",
      },
      {
        name: "Candidate summary handoff",
        type: "communication",
        difficulty: 5,
        score: 84.6,
        details: "Produced concise recruiter notes with strong traceability back to source evidence.",
      },
    ],
  },
  turing50: {
    tier_name: "Business payoff and governance assessment",
    benefit_breakdown: {
      individual: 84.2,
      organization: 78.5,
      enterprise: 72.1,
    },
    risk_breakdown: {
      technical: 16.8,
      operational: 21.4,
      security: 13.6,
      regulatory: 18.2,
      human: 20.5,
    },
    risk_adjusted_roi: 2.4,
    go_decision: "conditional",
    recommendation:
      "The model is strong enough for a recruiter copilot pilot. Launch with human review checkpoints, shortlist justification logs, and monthly fairness audits before broader rollout.",
    improvement_roadmap: {
      short_term: [
        "Add reviewer confidence prompts for ambiguous candidate histories.",
        "Tighten policy prompts around bias-sensitive ranking language.",
        "Expose source traceability snippets in recruiter summaries.",
      ],
      mid_term: [
        "Introduce department-specific calibration packs for engineering, policy, and operations roles.",
        "Connect evaluation logs to HR governance review dashboards.",
      ],
      long_term: [
        "Automate post-hire outcome feedback loops for model recalibration.",
        "Expand governance to multilingual and region-specific recruiting workflows.",
      ],
    },
  },
};
