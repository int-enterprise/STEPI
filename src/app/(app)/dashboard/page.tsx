"use client";

import { useMemo } from "react";
import { Select } from "@/components/ui/Select";
import { useCandidateStore } from "@/store/candidate-store";

type DashboardProfile = {
  grade: "S" | "A" | "B";
  percentile: number;
  stageGrades: { aptitude: string; first: string; second: string };
  aptitude: {
    final: string;
    practical: string;
    personality: string;
    strengths: string[];
    competencies: string[];
  };
  fitBars: Array<{ label: string; value: number; accent?: boolean }>;
  aiUsage: number;
  summaryBullets: string[];
  resumeSections: Array<{ title: string; items: string[] }>;
  timeline: Array<{
    label: string;
    range: string;
    start: number;
    end: number;
    tone: "amber" | "sky" | "solid";
  }>;
  coreRadar: Array<{ label: string; applicant: number; benchmark: number }>;
  jobRadar: Array<{ label: string; applicant: number; benchmark: number }>;
  questions: string[];
};

const RESUME_HIGHLIGHT_PRESETS: string[][][] = [
  [
    [
      "AI 기술의 실질적 가치",
      "NLP·LLM 프로젝트 경험",
      "고객 맞춤형 서비스 설계",
    ],
    [
      "도메인 데이터 분석 역량",
      "행동 예측 모델 구현",
      "특징량 설계와 변수 선택",
    ],
    [
      "실환경 적용 가능한 AI 기술",
      "머신러닝 이론 학습",
      "구조화된 분석 설계",
    ],
  ],
  [
    [
      "배포 자동화 경험",
      "Kubernetes·Terraform 운영",
      "운영 기준 정립",
    ],
    [
      "Feature Store·MLflow 도입",
      "비용·성능 균형 설계",
      "관측 지표 기반 의사결정",
    ],
    [
      "운영 자동화 관점",
      "장애 재발 방지 프로세스",
      "실행 중심 운영 역량",
    ],
  ],
  [
    [
      "의사결정을 돕는 분석 언어",
      "전환 퍼널 분석 경험",
      "이해관계자 맞춤 설명",
    ],
    [
      "A/B 테스트 설계",
      "지표 정의 문서화",
      "사용자 관점 해석",
    ],
    [
      "분석 자동화 방향성",
      "설득력 있는 리포팅",
      "협업형 분석 포지션",
    ],
  ],
];

const QUESTION_POINT_PRESETS: Array<Array<{ point: string; text: string }>> = [
  [
    {
      point: "AI 기술의 실질적 가치",
      text: "AI 기술이 실질적 가치 창출로 이어졌다고 판단한 기준은 무엇이었나요?",
    },
    {
      point: "NLP·LLM 프로젝트 경험",
      text: "NLP with Deep Learning과 LLM 프로젝트에서 본인이 맡은 핵심 역할은 무엇이었나요?",
    },
    {
      point: "고객 맞춤형 서비스 설계",
      text: "고객 맞춤형 서비스를 설계할 때 어떤 데이터와 맥락을 가장 우선적으로 보셨나요?",
    },
    {
      point: "행동 예측 모델 구현",
      text: "행동 예측 모델을 구현하면서 가장 중요했던 특징량은 무엇이었나요?",
    },
    {
      point: "특징량 설계와 변수 선택",
      text: "최소한의 가정으로 특징량을 설계한 구체적인 사례를 설명해 주세요.",
    },
    {
      point: "실환경 적용 가능한 AI 기술",
      text: "실환경 적용을 고려할 때 연구용 모델과 가장 다르게 봤던 기준은 무엇이었나요?",
    },
  ],
  [
    {
      point: "배포 자동화 경험",
      text: "배포 자동화가 실제 운영 안정성 향상으로 이어졌던 대표 사례는 무엇이었나요?",
    },
    {
      point: "Kubernetes·Terraform 운영",
      text: "Kubernetes와 Terraform을 함께 운영하면서 가장 어려웠던 관리 포인트는 무엇이었나요?",
    },
    {
      point: "Feature Store·MLflow 도입",
      text: "Feature Store와 MLflow 도입 전후로 팀의 일하는 방식은 어떻게 달라졌나요?",
    },
    {
      point: "비용·성능 균형 설계",
      text: "비용과 성능이 충돌할 때 어떤 기준으로 설계 결정을 내리셨나요?",
    },
    {
      point: "관측 지표 기반 의사결정",
      text: "운영 지표를 실제 의사결정으로 연결했던 장면을 설명해 주세요.",
    },
    {
      point: "장애 재발 방지 프로세스",
      text: "장애 이후 재발 방지 프로세스를 어떻게 구조화하셨나요?",
    },
  ],
  [
    {
      point: "의사결정을 돕는 분석 언어",
      text: "분석 결과를 의사결정 언어로 바꾸기 위해 어떤 방식으로 설명 구조를 잡으셨나요?",
    },
    {
      point: "전환 퍼널 분석 경험",
      text: "전환 퍼널 분석에서 가장 중요하게 봤던 이탈 구간은 어디였나요?",
    },
    {
      point: "이해관계자 맞춤 설명",
      text: "이해관계자별로 같은 데이터를 다르게 설명했던 경험이 있나요?",
    },
    {
      point: "A/B 테스트 설계",
      text: "A/B 테스트 설계 시 가장 먼저 검증하고 싶었던 가설은 무엇이었나요?",
    },
    {
      point: "지표 정의 문서화",
      text: "지표 정의 문서화가 실제 협업 효율에 어떤 영향을 줬나요?",
    },
    {
      point: "분석 자동화 방향성",
      text: "분석 자동화를 추진한다면 가장 먼저 자동화하고 싶은 단계는 무엇인가요?",
    },
  ],
];

const DISPLAY_CANDIDATES: Record<string, { name: string; role: string }> = {
  "c-park-jiyun": { name: "홍길동", role: "AI Engineer" },
  "c-kim-seongho": { name: "김성호", role: "MLOps Engineer" },
  "c-lee-hyejin": { name: "이혜진", role: "Data Analyst" },
  "c-choi-minsu": { name: "최민수", role: "Backend Engineer" },
  "c-jung-yeonwoo": { name: "정연우", role: "AI Engineer" },
  "c-han-sumin": { name: "한수민", role: "Product Analyst" },
  "c-song-jihoon": { name: "송지훈", role: "AI Engineer" },
  "c-oh-nayeon": { name: "오나연", role: "Backend Engineer" },
  "c-yoon-harim": { name: "윤하림", role: "Data Analyst" },
  "c-bae-donghyun": { name: "배동현", role: "Cloud Engineer" },
  "c-jang-yuna": { name: "장유나", role: "Product Analyst" },
};

const PROFILE_PRESETS: DashboardProfile[] = [
  {
    grade: "S",
    percentile: 3.2,
    stageGrades: { aptitude: "A", first: "A", second: "S" },
    aptitude: {
      final: "A",
      practical: "B",
      personality: "B",
      strengths: ["침착S", "직무구두A", "구조소통A"],
      competencies: ["타인협동력C", "성취지향B", "소프트킬B"],
    },
    fitBars: [
      { label: "AI", value: 90, accent: true },
      { label: "Digital", value: 70 },
      { label: "DX Eng.", value: 60 },
      { label: "Cloud", value: 50 },
    ],
    aiUsage: 54,
    summaryBullets: [
      "LG CNS의 AI 기술이 다양한 산업에 실질적 가치를 창출하는 방식과 현장 데이터 기반의 맞춤형 서비스 설계에 깊은 동기를 느끼고 관련 경험을 통해 NLP와 LLM 기반 프로젝트를 수행했습니다.",
      "사용자 관점에서 결과를 해석 및 개선 과제로 연결하고, 다양한 도메인 데이터 분석과 모델링 경험이 실제 현장 문제에 적용 가능한 솔루션 설계 역량을 키웠습니다.",
      "AI 기술의 체계적 학습과 실전형 분석 경험을 통해 데이터 분석, 모델링, 실무 적용 관점에서 균형 잡힌 평가를 제시할 수 있습니다.",
    ],
    resumeSections: [
      {
        title: "자기소개서 1번",
        items: [
          "LG CNS 선택 이유: AI 기술의 실질적 가치 창출과 현장 데이터를 기반으로 한 고객 맞춤형 서비스 설계 경험을 넓히고 싶습니다.",
          "경험: 고려대와 컴퓨터비전 연구실 인턴, NLP with Deep Learning 스터디, LLM 기반 레시피 생성 프로젝트를 수행했습니다.",
          "목표: 고객 데이터 분석 및 AI 기술 설계, 다양한 도메인 데이터의 맥락 해석과 최적화된 모델 적용 역량을 강화하고 싶습니다.",
        ],
      },
      {
        title: "자기소개서 2번",
        items: [
          "역량: 다양한 도메인 데이터 분석 및 모델링, 실제 환경에 적용 가능한 솔루션 설계.",
          "경험: UIUC Mobility Lab 연구, 다중성 경향을 반영한 행동 예측 모델 구현, 텍스트 기반 인과 추론 프로젝트 경험.",
          "강점: 최소한의 가정만으로 특징량을 설계하고, 효율적인 인코딩과 변수 선택 전략 수립이 가능합니다.",
        ],
      },
      {
        title: "자기소개서 3번",
        items: [
          "역량: 실제 환경에 적용하여 실질적인 가치를 창출할 수 있는 AI 기술 구현.",
          "학습 경험: Modeling and Learning in Data Science 과목에서 머신러닝 이론 학습과 감성 분석 프로젝트 수행.",
          "추구점: 현업 문제에 맞는 구조화된 분석 설계와 실행 가능한 결과 요약.",
        ],
      },
    ],
    timeline: [
      { label: "John S Burke Catholic", range: "2016.09 - 2020.06 (3년 11개월)", start: 12, end: 44, tone: "amber" },
      { label: "비즈니스랩", range: "2020.06 - 현재", start: 8, end: 30, tone: "solid" },
      { label: "경력 공백", range: "2020.06 - 2024.05 (3년 11개월)", start: 58, end: 92, tone: "sky" },
    ],
    coreRadar: [
      { label: "문제 해결", applicant: 8, benchmark: 8 },
      { label: "프로젝트 경험", applicant: 8, benchmark: 10 },
      { label: "커뮤니케이션", applicant: 8, benchmark: 8 },
      { label: "분석", applicant: 8, benchmark: 10 },
      { label: "팀워크", applicant: 8, benchmark: 8 },
    ],
    jobRadar: [
      { label: "분석", applicant: 3.5, benchmark: 2.6 },
      { label: "자료 해석", applicant: 3.3, benchmark: 2.4 },
      { label: "소통", applicant: 2.2, benchmark: 2.0 },
      { label: "리더십", applicant: 2.4, benchmark: 1.8 },
      { label: "실행", applicant: 4.5, benchmark: 3.0 },
    ],
    questions: [
      "AI 기술이 어떻게 실질적인 가치를 창출할 수 있다고 생각하시나요?",
      "NLP with Deep Learning 스터디에서 어떤 주제들을 다뤘는지 설명해 주시겠어요?",
      "LLM 기반 레시피 생성 프로젝트의 목표와 결과를 어떻게 평가하셨나요?",
      "Ollama를 활용한 프로젝트 설계에서 가장 어려웠던 점은 무엇이었나요?",
      "다중성 경향을 반영한 데이터 분석을 어떻게 수행하고 해석했나요?",
      "행동 예측 모델 구축에서 어떤 가설과 기준들을 사용하셨나요?",
      "적용 데이터 분석 프로젝트에서 가장 중요한 결과는 무엇이었나요?",
      "최소한의 가정만으로 특징량을 설계한 사례를 설명해 주세요.",
      "효율적인 인코딩 및 변수 선택 전략을 수립하면서 어떤 기준을 사용하셨나요?",
      "Modeling and Learning in Data Science 과목에서 가장 기억에 남는 프로젝트는 무엇이었나요?",
      "감성 분석 프로젝트를 진행하면서 어떤 도전을 겪었나요?",
    ],
  },
  {
    grade: "A",
    percentile: 8.4,
    stageGrades: { aptitude: "B", first: "A", second: "A" },
    aptitude: {
      final: "A",
      practical: "A",
      personality: "B",
      strengths: ["체계성A", "문제해결A", "실행력B"],
      competencies: ["유연성B", "협업C", "분석집중A"],
    },
    fitBars: [
      { label: "AI", value: 74, accent: true },
      { label: "Digital", value: 76 },
      { label: "DX Eng.", value: 68 },
      { label: "Cloud", value: 82 },
    ],
    aiUsage: 41,
    summaryBullets: [
      "지원자는 운영 안정성과 자동화 중심의 사고가 강하며, 실제 서비스 환경에서 AI 및 데이터 파이프라인을 안정적으로 관리한 경험이 풍부합니다.",
      "관측 가능성과 배포 전략 수립 경험이 두드러져 장애 예방과 비용 효율성 측면에서 높은 기여 가능성이 있습니다.",
      "기술적 깊이뿐 아니라 시스템화된 운영 문서화 경험이 있어 장기 운영 관점의 적합도가 높습니다.",
    ],
    resumeSections: [
      {
        title: "자기소개서 1번",
        items: [
          "MLOps 환경에서 모델 배포와 운영 모니터링을 자동화하며 서비스 신뢰성을 높인 경험을 강조했습니다.",
          "Kubernetes, Terraform, Airflow 기반으로 반복 작업을 줄이고 장애 복구 시간을 단축한 사례를 설명했습니다.",
          "대규모 실무 협업 속에서 운영 기준과 실행 프로세스를 정립한 점을 핵심 성과로 제시했습니다.",
        ],
      },
      {
        title: "자기소개서 2번",
        items: [
          "Feature Store와 MLflow를 도입하며 데이터 추적성과 실험 재현성을 높인 경험을 기술했습니다.",
          "비용, 성능, 운영 편의성의 균형을 맞춘 설계 기준과 팀 설득 과정이 구체적으로 드러납니다.",
          "실제 배포 후 관측 지표를 통해 의사결정에 기여한 점이 강점으로 보입니다.",
        ],
      },
      {
        title: "자기소개서 3번",
        items: [
          "운영 자동화는 결국 서비스 품질과 인력 효율을 동시에 높이는 일이라는 관점을 제시했습니다.",
          "복잡한 장애를 구조적으로 분석하고 재발 방지 프로세스를 세운 경험이 돋보입니다.",
          "기술 리더십보다는 실무 운영과 실행 역량에서 높은 평가가 가능합니다.",
        ],
      },
    ],
    timeline: [
      { label: "정보보호학", range: "2012.03 - 2016.02", start: 10, end: 34, tone: "amber" },
      { label: "SRE 엔지니어", range: "2016.03 - 2020.02", start: 36, end: 62, tone: "solid" },
      { label: "MLOps 엔지니어", range: "2020.03 - 현재", start: 63, end: 95, tone: "sky" },
    ],
    coreRadar: [
      { label: "문제 해결", applicant: 7.8, benchmark: 8.2 },
      { label: "프로젝트 경험", applicant: 8.6, benchmark: 8.8 },
      { label: "커뮤니케이션", applicant: 8.2, benchmark: 8.0 },
      { label: "분석", applicant: 7.2, benchmark: 8.0 },
      { label: "팀워크", applicant: 8.4, benchmark: 8.0 },
    ],
    jobRadar: [
      { label: "분석", applicant: 3.0, benchmark: 2.8 },
      { label: "자료 해석", applicant: 3.1, benchmark: 2.7 },
      { label: "소통", applicant: 3.3, benchmark: 2.6 },
      { label: "리더십", applicant: 3.0, benchmark: 2.4 },
      { label: "실행", applicant: 4.2, benchmark: 3.3 },
    ],
    questions: [
      "Kubernetes 기반 배포 환경에서 가장 중요한 운영 지표는 무엇이었나요?",
      "관측 가능성 확보를 위해 어떤 로깅 및 모니터링 전략을 설계하셨나요?",
      "Airflow 파이프라인 장애를 예방하기 위해 어떤 구조를 적용했나요?",
      "MLflow 도입 전후로 실험 관리 방식은 어떻게 달라졌나요?",
      "Feature Store PoC에서 가장 어려웠던 의사결정은 무엇이었나요?",
      "운영 효율과 배포 속도가 충돌할 때 어떤 기준으로 우선순위를 정하시나요?",
      "Terraform 상태 관리와 보안 관리를 어떻게 병행하셨나요?",
      "실무 협업에서 운영 문서화가 실제로 어떤 효과를 냈나요?",
      "비용 최적화와 안정성 확보를 동시에 이끈 대표 사례를 설명해 주세요.",
      "MLOps 역할에서 본인의 가장 큰 강점은 무엇이라고 생각하시나요?",
      "앞으로 더 강화하고 싶은 기술 영역은 무엇인가요?",
    ],
  },
  {
    grade: "B",
    percentile: 22.6,
    stageGrades: { aptitude: "B", first: "B", second: "A" },
    aptitude: {
      final: "B",
      practical: "B",
      personality: "A",
      strengths: ["소통A", "해석력B", "협업A"],
      competencies: ["주도성B", "리더십C", "문제정의B"],
    },
    fitBars: [
      { label: "AI", value: 52, accent: true },
      { label: "Digital", value: 82 },
      { label: "DX Eng.", value: 63 },
      { label: "Cloud", value: 46 },
    ],
    aiUsage: 36,
    summaryBullets: [
      "지원자는 데이터 해석과 스토리텔링 능력이 강하며, 이력서와 자기소개서 전반에서 이해관계자 설득 경험이 일관되게 드러납니다.",
      "가설 수립, 분석 설계, 대시보드 운영까지 경험 범위가 넓어 실무 협업형 분석가로서 강점이 있습니다.",
      "기술적 깊이보다 분석 결과를 실행 가능한 언어로 전환하는 역량이 돋보입니다.",
    ],
    resumeSections: [
      {
        title: "자기소개서 1번",
        items: [
          "데이터 분석은 단순한 리포팅이 아니라 의사결정을 돕는 언어라고 정의하고 있습니다.",
          "유저 행동과 전환 퍼널을 분석해 실제 서비스 개선 실험까지 연결한 경험을 강조했습니다.",
          "지표 해석 결과를 다양한 이해관계자에게 맞춤형으로 설명한 점이 인상적입니다.",
        ],
      },
      {
        title: "자기소개서 2번",
        items: [
          "A/B 테스트 설계와 코호트 분석, 대시보드 구축 경험을 통해 서비스 성장에 기여한 사례를 소개했습니다.",
          "지표 정의를 문서화하고 공통 언어를 만든 경험이 협업 강점으로 보입니다.",
          "정량 분석뿐 아니라 사용자 관점 해석을 함께 제시하는 역량이 강합니다.",
        ],
      },
      {
        title: "자기소개서 3번",
        items: [
          "앞으로는 분석 자동화와 AI 기반 요약 기능을 활용해 더 빠른 의사결정을 돕고 싶다는 방향성이 드러납니다.",
          "구조화된 실험 설계와 설득력 있는 리포팅은 즉시 활용 가능한 역량으로 보입니다.",
          "기술 심화보다는 조직 커뮤니케이션형 분석 포지션에서 더 높은 시너지가 기대됩니다.",
        ],
      },
    ],
    timeline: [
      { label: "산업공학 전공", range: "2011.03 - 2015.02", start: 10, end: 36, tone: "amber" },
      { label: "Data Analyst", range: "2018.01 - 현재", start: 44, end: 94, tone: "solid" },
      { label: "리텐션 프로젝트", range: "2022.03 - 2023.05", start: 68, end: 82, tone: "sky" },
    ],
    coreRadar: [
      { label: "문제 해결", applicant: 7.4, benchmark: 8.0 },
      { label: "프로젝트 경험", applicant: 7.2, benchmark: 8.4 },
      { label: "커뮤니케이션", applicant: 8.8, benchmark: 8.0 },
      { label: "분석", applicant: 8.0, benchmark: 8.4 },
      { label: "팀워크", applicant: 8.6, benchmark: 8.1 },
    ],
    jobRadar: [
      { label: "분석", applicant: 4.0, benchmark: 3.2 },
      { label: "자료 해석", applicant: 3.8, benchmark: 2.8 },
      { label: "소통", applicant: 4.4, benchmark: 3.0 },
      { label: "리더십", applicant: 2.2, benchmark: 1.9 },
      { label: "실행", applicant: 3.1, benchmark: 2.7 },
    ],
    questions: [
      "사용자 전환 퍼널 분석에서 가장 중요한 전제는 무엇이라고 생각하시나요?",
      "A/B 테스트 설계 시 가장 주의했던 변수는 무엇이었나요?",
      "코호트 분석을 실제 의사결정과 연결한 경험을 설명해 주세요.",
      "이해관계자 설득을 위해 어떤 방식으로 결과를 시각화하셨나요?",
      "지표 정의가 서로 달랐던 상황을 어떻게 정리하셨나요?",
      "대시보드 운영에서 가장 중요하게 본 품질 기준은 무엇이었나요?",
      "분석 결과가 실제 서비스 개선으로 이어지지 않았던 경험이 있나요?",
      "정량 분석 외에 사용자 맥락을 해석하기 위해 어떤 노력을 하셨나요?",
      "AI 기반 요약 기능을 분석 업무에 접목한다면 어디부터 시작하시겠나요?",
      "본인이 강점을 느끼는 협업 상황은 어떤 장면인가요?",
      "앞으로 강화하고 싶은 분석 기술은 무엇인가요?",
    ],
  },
];

function panelClassName(extra?: string) {
  return [
    "rounded-[16px] border border-[rgba(10,36,101,0.08)] bg-white",
    "shadow-[0_4px_20px_rgba(10,36,101,0.04)]",
    extra ?? "",
  ].join(" ");
}

function gradeTone(grade: string) {
  if (grade === "S") return "text-[#0A2465]";
  if (grade === "A") return "text-[#5B6B95]";
  return "text-[#7B8DB8]";
}

function DetailButton() {
  return (
    <button className="rounded-[10px] border border-[rgba(10,36,101,0.08)] bg-white px-2.5 py-1 text-[11px] font-medium text-[#5B6B95] transition hover:bg-[#FAFAFA] hover:text-[#000000]">
      상세
    </button>
  );
}

function GradeCurveChart({ grade }: { grade: string }) {
  const markerX = grade === "S" ? 195 : grade === "A" ? 160 : 120;

  return (
    <svg viewBox="0 0 220 120" className="h-[128px] w-full">
      <line x1="18" y1="95" x2="208" y2="95" stroke="#e5e7eb" strokeWidth="1.5" />
      <line x1="18" y1="18" x2="18" y2="95" stroke="#E4E7EF" strokeWidth="1" />

      {["D", "C", "B", "A", "S"].map((label, index) => (
        <text
          key={label}
          x={32 + index * 40}
          y={16}
          textAnchor="middle"
          className="fill-[#7B8DB8] text-[10px] font-medium"
        >
          {label}
        </text>
      ))}

      <path
        d="M18 95 C42 95, 54 95, 78 95 C92 95, 104 58, 114 58 C124 58, 136 95, 150 95 C165 95, 176 95, 188 95"
        fill="none"
        stroke="#7B8DB8"
        strokeWidth="3"
      />
      <path
        d="M112 95 C126 95, 138 95, 160 95 C172 95, 184 28, 194 28 C204 28, 208 95, 208 95"
        fill="none"
        stroke="#5B6B95"
        strokeWidth="3"
      />
      <line x1={markerX} y1="20" x2={markerX} y2="95" stroke="#C8F5EE" strokeDasharray="4 4" />
      <circle cx={markerX} cy={grade === "S" ? 28 : 58} r="5" fill="#40E0D0" />
    </svg>
  );
}

function VerticalFitChart({
  items,
}: {
  items: Array<{ label: string; value: number; accent?: boolean }>;
}) {
  function formatLabel(label: string) {
    return label === "DX Eng." ? "DX\nEng." : label;
  }

  return (
    <div className="relative h-[170px]">
      <div className="absolute inset-x-0 top-5 bottom-9">
        {[25, 50, 75, 100].map((tick) => (
          <div
            key={tick}
            className="absolute left-0 right-0 border-t border-dashed border-[rgba(10,36,101,0.06)]"
            style={{ bottom: `${tick - 8}%` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-end justify-between gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end">
            <div className="mb-2 text-[16px] font-semibold tracking-[-0.03em] text-[#5B6B95]">
              {item.value}%
            </div>
            <div className="flex h-[108px] w-full items-end justify-center">
              <div
                className="w-9 rounded-t-[14px]"
                style={{
                  height: `${item.value}%`,
                  background: item.accent
                    ? "#40E0D0"
                    : "#C6CEDF",
                }}
              />
            </div>
            <div className="mt-3 h-8 text-center text-[11px] font-medium leading-[1.15] whitespace-pre-line text-[#5B6B95]">
              {formatLabel(item.label)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarPanel({
  title,
  items,
  valueLabel,
  benchmarkLabel,
  applicantColor,
}: {
  title: string;
  items: Array<{ label: string; applicant: number; benchmark: number }>;
  valueLabel: string;
  benchmarkLabel: string;
  applicantColor: string;
}) {
  const size = 180;
  const center = size / 2;
  const radius = 52;
  const maxValue = 10;
  const levels = 5;
  const angleStep = (Math.PI * 2) / items.length;

  const toPoint = (value: number, index: number) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const scaled = (value / maxValue) * radius;
    return {
      x: center + Math.cos(angle) * scaled,
      y: center + Math.sin(angle) * scaled,
    };
  };

  const polygonPoints = (values: number[]) =>
    values
      .map((value, index) => {
        const point = toPoint(value, index);
        return `${point.x},${point.y}`;
      })
      .join(" ");

  return (
    <div className={panelClassName("p-4")}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="text-[16px] font-semibold tracking-[-0.03em] text-[#000000]">
          {title}
        </div>
        <DetailButton />
      </div>

      <div className="flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-[180px] w-[180px]">
          {Array.from({ length: levels }).map((_, levelIndex) => {
            const scale = (levelIndex + 1) / levels;
            const points = items
              .map((_, itemIndex) => {
                const angle = -Math.PI / 2 + angleStep * itemIndex;
                const x = center + Math.cos(angle) * radius * scale;
                const y = center + Math.sin(angle) * radius * scale;
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={scale}
                points={points}
                fill="none"
                stroke="#E4E7EF"
                strokeWidth="1"
              />
            );
          })}

          {items.map((item, index) => {
            const angle = -Math.PI / 2 + angleStep * index;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const labelX = center + Math.cos(angle) * (radius + 28);
            const labelY = center + Math.sin(angle) * (radius + 28);
            const anchor =
              Math.cos(angle) > 0.3 ? "start" : Math.cos(angle) < -0.3 ? "end" : "middle";

            return (
              <g key={item.label}>
                <line x1={center} y1={center} x2={x} y2={y} stroke="#eceff4" strokeWidth="1" />
                <text
                  x={labelX}
                  y={labelY - 6}
                  textAnchor={anchor}
                  className="fill-[#7B8DB8] text-[9px] font-medium"
                >
                  {item.label}
                </text>
                <text
                  x={labelX}
                  y={labelY + 8}
                  textAnchor={anchor}
                  className="fill-[#000000] text-[10px] font-semibold"
                >
                  {item.applicant.toFixed(1)}/10
                </text>
              </g>
            );
          })}

          <polygon
            points={polygonPoints(items.map((item) => item.benchmark))}
            fill="rgba(123, 141, 184, 0.16)"
            stroke="#7B8DB8"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <polygon
            points={polygonPoints(items.map((item) => item.applicant))}
            fill={applicantColor === "#40E0D0" ? "rgba(64, 224, 208, 0.24)" : "rgba(91, 107, 149, 0.22)"}
            stroke={applicantColor}
            strokeWidth="2.4"
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[#5B6B95]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#7B8DB8]" />
          {benchmarkLabel}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: applicantColor }} />
          {valueLabel}
        </div>
      </div>
    </div>
  );
}

function TimelinePanel({
  items,
}: {
  items: DashboardProfile["timeline"];
}) {
  const years = ["2016.09", "2018.07", "2019.07", "2020.07", "2021.07", "2022.07", "2023.07", "2024.07", "2025.06"];

  return (
    <div className={panelClassName("p-5")}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="text-[16px] font-semibold tracking-[-0.03em] text-[#000000]">
          지원자 이력 타임라인
        </div>
        <DetailButton />
      </div>

      <div className="relative rounded-[12px] bg-[#FAFAFA] px-4 pb-5 pt-4">
        <div className="grid grid-cols-9 text-center text-[10px] font-medium text-[#7B8DB8]">
          {years.map((year) => (
            <div key={year}>{year}</div>
          ))}
        </div>

        <div className="relative mt-7 h-[126px]">
          <div className="absolute left-0 right-0 top-8 border-t border-dashed border-[rgba(10,36,101,0.10)]" />
          <div className="absolute left-0 right-0 top-[84px] border-t border-dashed border-[rgba(10,36,101,0.10)]" />

          {items.map((item, index) => {
            const top = index === 0 ? 2 : index === 1 ? 50 : 56;
            const height = index === 2 ? 40 : 34;
            const toneClass =
              item.tone === "amber"
                ? "border-[#7B8DB8] bg-[#FCF5EA] text-[#0A2465]"
                : item.tone === "sky"
                  ? "border-[#7B8DB8] bg-[#FAFAFA] text-[#5B6B95] border-dashed"
                  : "border-[#E5E7EB] bg-white text-[#5B6B95]";

            return (
              <div
                key={`${item.label}-${item.range}`}
                className={`absolute overflow-hidden rounded-[10px] border px-2.5 py-2 shadow-[0_1px_6px_rgba(17,24,39,0.03)] ${toneClass}`}
                style={{
                  left: `${item.start}%`,
                  width: `${item.end - item.start}%`,
                  top,
                  height,
                }}
              >
                <div className="truncate text-[10px] font-semibold leading-tight">{item.label}</div>
                <div className="mt-0.5 truncate text-[8px] leading-tight">{item.range}</div>
              </div>
            );
          })}

          <div className="absolute bottom-0 left-2 right-2 h-3 rounded-full border border-[rgba(17,24,39,0.08)] bg-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { candidates, selectedId, setSelectedId } = useCandidateStore();

  const selectedIndex = useMemo(() => {
    const found = candidates.findIndex((candidate) => candidate.id === selectedId);
    return found >= 0 ? found : 0;
  }, [candidates, selectedId]);

  const selectedProfile = PROFILE_PRESETS[selectedIndex % PROFILE_PRESETS.length];
  const selectedResumeHighlights =
    RESUME_HIGHLIGHT_PRESETS[selectedIndex % RESUME_HIGHLIGHT_PRESETS.length] ?? [];
  const selectedQuestionPoints =
    QUESTION_POINT_PRESETS[selectedIndex % QUESTION_POINT_PRESETS.length] ?? [];
  const displayCandidate =
    DISPLAY_CANDIDATES[selectedId] ??
    DISPLAY_CANDIDATES[candidates[0]?.id] ?? { name: "홍길동", role: "AI Engineer" };

  return (
    <div className="space-y-4">
      <div>
        <Select
          value={selectedId}
          onChange={setSelectedId}
          options={candidates.map((candidate) => ({
            value: candidate.id,
            label: DISPLAY_CANDIDATES[candidate.id]?.name ?? candidate.id,
          }))}
          className="min-w-[180px]"
          size="sm"
        />
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[264px_minmax(0,1fr)_490px]">
        <div className="flex h-full flex-col gap-4">
          <div className={panelClassName("min-h-[336px] p-5")}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="text-[16px] font-semibold tracking-[-0.03em] text-[#000000]">
                지원자 등급 <span className={gradeTone(selectedProfile.grade)}>{selectedProfile.grade}</span>
              </div>
              <DetailButton />
            </div>

            <div className="mt-2">
              <GradeCurveChart grade={selectedProfile.grade} />
            </div>

            <div className="space-y-3 border-t border-[rgba(10,36,101,0.06)] pt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#7B8DB8]">인적성 등급</span>
                <span className="rounded-full bg-[#FAFAFA] px-2.5 py-1 font-semibold text-[#000000]">
                  {selectedProfile.stageGrades.aptitude}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#7B8DB8]">1차 면접 등급</span>
                <span className="rounded-full bg-[#FAFAFA] px-2.5 py-1 font-semibold text-[#000000]">
                  {selectedProfile.stageGrades.first}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#7B8DB8]">2차 면접 등급</span>
                <span className="rounded-full bg-[#FAFAFA] px-2.5 py-1 font-semibold text-[#000000]">
                  {selectedProfile.stageGrades.second}
                </span>
              </div>
            </div>
          </div>

          <div className={panelClassName("min-h-[318px] p-5")}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="text-[16px] font-semibold tracking-[-0.03em] text-[#000000]">
                인적성검사 결과
              </div>
              <DetailButton />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "최종", value: selectedProfile.aptitude.final },
                { label: "적성", value: selectedProfile.aptitude.practical },
                { label: "인성", value: selectedProfile.aptitude.personality },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[12px] bg-[#FAFAFA] px-3 py-3 text-center"
                >
                  <div className="text-[12px] font-medium text-[#7B8DB8]">{item.label}</div>
                  <div className={`mt-2 text-[34px] font-semibold ${gradeTone(item.value)}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-[13px] font-semibold text-[#000000]">인성강점</div>
                <div className="space-y-2">
                  {selectedProfile.aptitude.strengths.map((item, index) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-[#5B6B95]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#E6FBF8] text-[11px] font-semibold text-[#0A2465]">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[13px] font-semibold text-[#000000]">인성역량</div>
                <div className="space-y-2">
                  {selectedProfile.aptitude.competencies.map((item, index) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-[#5B6B95]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#E6ECF8] text-[11px] font-semibold text-[#5B6B95]">
                        {index + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={panelClassName("flex flex-1 flex-col p-5")}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="text-[16px] font-semibold tracking-[-0.03em] text-[#000000]">
                직군 적합도
              </div>
              <DetailButton />
            </div>

            <div className="flex-1 overflow-hidden rounded-[14px] bg-[#FAFAFA] px-4 pb-3 pt-4">
              <VerticalFitChart items={selectedProfile.fitBars} />
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col gap-4">
          <div className={panelClassName("flex h-full flex-col p-5")}>
            <div className="flex flex-col gap-3 border-b border-[rgba(10,36,101,0.06)] pb-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-[31px] font-semibold tracking-[-0.05em] text-[#000000]">
                  {displayCandidate.name} 님은 이런 사람 입니다.
                </div>
                <div className="mt-1 text-[13px] text-[#7B8DB8]">{displayCandidate.role}</div>
              </div>
              <div className="flex items-center gap-2 self-start rounded-full bg-[#E6FBF8] px-3 py-1.5 text-[13px] font-semibold text-[#0A2465]">
                AI 사용률 {selectedProfile.aiUsage}%
                <span className="rounded-full bg-[#40E0D0] px-2 py-0.5 text-[11px] text-[#0A2465]">상</span>
              </div>
            </div>

            <div className="mt-4 rounded-[18px] bg-[#0A2465] p-[2px]">
              <div className="rounded-[17px] bg-white px-4 py-4">
                <div className="inline-flex rounded-full bg-[#E6FBF8] px-3 py-1 text-[12px] font-semibold text-[#0A2465]">
                  AI 요약
                </div>
                <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#5B6B95]">
                  {selectedProfile.summaryBullets.map((bullet) => (
                    <p key={bullet}>- {bullet}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[16px] font-semibold tracking-[-0.02em] text-[#000000]">
                이력서 주요 내용 요약
              </div>

              <div className="mt-3 space-y-4">
                {selectedProfile.resumeSections.map((section, sectionIndex) => (
                  <div key={section.title}>
                    <div className="text-[18px] font-semibold tracking-[-0.03em] text-[#000000]">
                      {section.title}
                    </div>
                    <div className="mt-2.5 space-y-2.5">
                      {section.items.map((item, index) => {
                        const highlight = selectedResumeHighlights[sectionIndex]?.[index];

                        return (
                          <div key={item} className="flex items-start gap-3">
                            <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] bg-[#40E0D0] text-[11px] font-semibold text-[#0A2465]">
                              {index + 1}
                            </div>
                            <p className="text-[14px] leading-7 text-[#5B6B95]">
                              {highlight ? (
                                <span className="mr-1.5 inline rounded-[4px] bg-[#E6FBF8] px-1 font-semibold text-[#0A2465]">
                                  {highlight}
                                </span>
                              ) : null}
                              {item}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col gap-4">
          <TimelinePanel items={selectedProfile.timeline} />

          <div className="grid gap-4 md:grid-cols-2">
            <RadarPanel
              title="핵심인재와의 유사도"
              items={selectedProfile.coreRadar}
              benchmarkLabel="핵심인재"
              valueLabel="지원자"
              applicantColor="#40E0D0"
            />
            <RadarPanel
              title="직무 적합도"
              items={selectedProfile.jobRadar}
              benchmarkLabel="직무 평균"
              valueLabel="지원자"
              applicantColor="#5B6B95"
            />
          </div>

          <div className="flex flex-1 rounded-[16px] bg-[#0A2465] p-[2px] shadow-[0_4px_20px_rgba(10,36,101,0.04)]">
            <div className="h-full w-full rounded-[15px] bg-white p-4">
              <div className="mb-3 text-[16px] font-semibold tracking-[-0.03em] text-[#000000]">
                AI 생성 질문
              </div>
              <div className="space-y-2.5">
                {(selectedQuestionPoints.length > 0
                  ? selectedQuestionPoints
                  : selectedProfile.questions.map((question) => ({
                      point: "핵심 포인트",
                      text: question,
                    }))
                ).map((question, index) => (
                  <div key={`${question.point}-${question.text}`} className="flex items-start gap-3">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[6px] bg-[#40E0D0] text-[11px] font-semibold text-[#0A2465]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="inline rounded-[4px] bg-[#E6FBF8] px-1 text-[11px] font-semibold text-[#0A2465]">
                        {question.point}
                      </div>
                      <p className="mt-1 text-[13px] leading-6 text-[#5B6B95]">{question.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
