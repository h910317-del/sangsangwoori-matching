"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { calculateScore } from "@/lib/matching";

export type RegisterState = { error: string } | null;

export async function registerSenior(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = (formData.get("name") as string)?.trim();
  const region = (formData.get("region") as string)?.trim();
  const desired_job = (formData.get("desired_job") as string)?.trim();
  const career_years = parseInt(formData.get("career_years") as string, 10);

  if (!name) return { error: "이름을 입력해 주세요." };
  if (!region) return { error: "지역을 입력해 주세요." };
  if (!desired_job) return { error: "희망 직종을 입력해 주세요." };
  if (isNaN(career_years) || career_years < 0)
    return { error: "경력 연수를 올바르게 입력해 주세요." };

  // ── 시니어 저장 ────────────────────────────────────────
  const { data: senior, error: insertErr } = await supabase
    .from("seniors")
    .insert({ name, region, desired_job, career_years })
    .select()
    .single();

  if (insertErr || !senior)
    return { error: "등록 실패: " + (insertErr?.message ?? "알 수 없는 오류") };

  // ── 전체 일자리 조회 후 점수 계산 ──────────────────────
  const { data: jobs } = await supabase.from("jobs").select("*");

  if (jobs && jobs.length > 0) {
    const matches = jobs
      .map((job) => ({
        senior_id: senior.id,
        job_id: job.id,
        score: calculateScore(senior, job),
      }))
      .filter((m) => m.score > 0);

    if (matches.length > 0) {
      await supabase.from("matches").insert(matches);
    }
  }

  redirect(`/recommendations?senior_id=${senior.id}`);
}

export async function assignMatch(matchId: string): Promise<void> {
  await supabase
    .from("matches")
    .update({ status: "assigned" })
    .eq("id", matchId);

  revalidatePath("/admin");
}
