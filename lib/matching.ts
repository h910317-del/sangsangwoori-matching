import type { Senior, Job } from "./supabase";

// 비교용 정규화 — 원본 데이터를 변경하지 않음
const REGION_MAP: Record<string, string> = {
  "서울특별시": "서울",
  "경기도":     "경기",
  "인천광역시": "인천",
};

const JOB_MAP: Record<string, string> = {
  "경비직": "경비",
  "청소직": "청소",
  "조리직": "조리",
  "돌봄직": "돌봄",
};

function normalizeRegion(r: string): string {
  const t = r.trim();
  return REGION_MAP[t] ?? t;
}

function normalizeJob(j: string): string {
  const t = j.trim();
  return (JOB_MAP[t] ?? t).toLowerCase();
}

/**
 * 규칙 기반 매칭 점수 계산 (최대 100점)
 *
 * 지역 일치  : 완전 일치 40점 / 부분 포함 20점
 * 직종 일치  : 포함 관계 40점
 * 경력 충족  : career_years >= required_career 이면 20점
 *
 * 지역·직종은 정규화 후 비교 (원본 데이터 무변경)
 */
export type ScoreBreakdown = {
  region: { score: number; label: string };
  job:    { score: number; label: string };
  career: { score: number; label: string };
};

export function calculateBreakdown(senior: Senior, job: Job): ScoreBreakdown {
  const sr = normalizeRegion(senior.region);
  const jr = normalizeRegion(job.region);
  const sj = normalizeJob(senior.desired_job);
  const jt = normalizeJob(job.job_type);

  let regionScore = 0, regionLabel = "지역 불일치";
  if (sr === jr)                                    { regionScore = 40; regionLabel = "지역 일치"; }
  else if (sr.includes(jr) || jr.includes(sr))     { regionScore = 20; regionLabel = "지역 근접"; }

  let jobScore = 0, jobLabel = "직종 불일치";
  if (sj === jt || sj.includes(jt) || jt.includes(sj)) { jobScore = 40; jobLabel = "직종 일치"; }

  let careerScore = 0, careerLabel = "경력 부족";
  if (senior.career_years >= job.required_career)  { careerScore = 20; careerLabel = "경력 충족"; }

  return {
    region: { score: regionScore, label: regionLabel },
    job:    { score: jobScore,    label: jobLabel    },
    career: { score: careerScore, label: careerLabel },
  };
}

export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;

  // ── 지역 매칭 ──────────────────────────────────────────
  const sr = normalizeRegion(senior.region);
  const jr = normalizeRegion(job.region);
  if (sr === jr) {
    score += 40;
  } else if (sr.includes(jr) || jr.includes(sr)) {
    score += 20;
  }

  // ── 직종 매칭 ──────────────────────────────────────────
  const sj = normalizeJob(senior.desired_job);
  const jt = normalizeJob(job.job_type);
  if (sj === jt || sj.includes(jt) || jt.includes(sj)) {
    score += 40;
  }

  // ── 경력 충족 ──────────────────────────────────────────
  if (senior.career_years >= job.required_career) {
    score += 20;
  }

  return score;
}
