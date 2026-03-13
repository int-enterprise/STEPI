export type CandidateGrade = "S" | "A" | "B" | "C" | "D";

export type TimelineItem = {
  label: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM or "현재"
  type: "학력" | "경력" | "프로젝트" | "연구";
};

export type RadarMetric = {
  key: string;
  label: string;
  value: number; // 0-100
  reference: number; // 0-100
};

export type Candidate = {
  id: string;
  name: string;
  gender: "남" | "여";
  ageGroup: "20대" | "30대" | "40대";
  appliedRole:
    | "AI Engineer"
    | "Data Analyst"
    | "MLOps Engineer"
    | "Backend Engineer"
    | "Cloud Engineer"
    | "Product Analyst";

  education: {
    level: "학사" | "석사" | "박사";
    major: string;
    school: string;
  };

  experienceYears: number;
  prevCompany: string;
  skills: string[];
  projects: string[];
  coverLetterSummary: string;
  personalityKeywords: string[];
  aptitude: {
    overall: CandidateGrade;
    aptitude: CandidateGrade;
    personality: CandidateGrade;
    strengths: string[];
    weaknesses: string[];
  };

  grade: CandidateGrade;
  gradePercentile: number; // 0~100, 낮을수록 상위
  gradeStages: {
    first: CandidateGrade;
    second: CandidateGrade;
    final: CandidateGrade;
  };

  clusterFit: Array<{ label: "AI" | "Digital" | "DX Eng." | "Cloud"; value: number }>;
  coreTalentSimilarity: RadarMetric[];
  jobFitRadar: RadarMetric[];
  timeline: TimelineItem[];
  aiUsageRate: number;

  summaryTitle: string;
  summaryParagraphs: string[];
  resumeHighlights: Array<{
    title: string;
    bullets: string[];
    emphasis?: string[];
  }>;

  generatedQuestions: string[];
  uploadedAt: string;
  evaluationDone: boolean;
};

