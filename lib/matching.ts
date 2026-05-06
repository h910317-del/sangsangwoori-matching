import type { Senior, Job } from "./supabase";

/**
 * 규칙 기반 매칭 점수 계산 (최대 100점)
 *
 * 지역 일치  : 완전 일치 40점 / 부분 포함 20점
 * 직종 일치  : 포함 관계 40점
 * 경력 충족  : career_years >= required_career 이면 20점
 */
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;

  // ── 지역 매칭 ──────────────────────────────────────────
  const sr = senior.region.trim();
  const jr = job.region.trim();
  if (sr === jr) {
    score += 40;
  } else if (sr.includes(jr) || jr.includes(sr)) {
    score += 20;
  }

  // ── 직종 매칭 ──────────────────────────────────────────
  const sj = senior.desired_job.trim().toLowerCase();
  const jt = job.job_type.trim().toLowerCase();
  if (sj === jt || sj.includes(jt) || jt.includes(sj)) {
    score += 40;
  }

  // ── 경력 충족 ──────────────────────────────────────────
  if (senior.career_years >= job.required_career) {
    score += 20;
  }

  return score;
}
