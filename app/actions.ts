"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { calculateScore } from "@/lib/matching";

export type FormState = { error: string } | null;
export type RegisterState = FormState;

// ── 시니어 등록 + rematch_senior RPC ──────────────────────
export async function registerSenior(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name        = (formData.get("name")        as string)?.trim();
  const region      = (formData.get("region")      as string)?.trim();
  const desired_job = (formData.get("desired_job") as string)?.trim();
  const career_years = parseInt(formData.get("career_years") as string, 10);

  if (!name)        return { error: "이름을 입력해 주세요." };
  if (!region)      return { error: "지역을 입력해 주세요." };
  if (!desired_job) return { error: "희망 직종을 입력해 주세요." };
  if (isNaN(career_years) || career_years < 0)
    return { error: "경력 연수를 올바르게 입력해 주세요." };

  const { data: senior, error: insertErr } = await supabase
    .from("seniors")
    .insert({ name, region, desired_job, career_years })
    .select()
    .single();

  if (insertErr || !senior)
    return { error: "등록 실패: " + (insertErr?.message ?? "알 수 없는 오류") };

  // RPC 시도 → 실패 시 Server Action 폴백
  const { error: rpcErr } = await supabase.rpc("rematch_senior", {
    p_senior_id: senior.id,
  });

  if (rpcErr) {
    // 폴백: 앱 레이어에서 재계산
    const { data: jobs } = await supabase.from("jobs").select("*");
    if (jobs?.length) {
      const rows = jobs
        .map((job) => ({ senior_id: senior.id, job_id: job.id, score: calculateScore(senior, job) }))
        .filter((r) => r.score > 0);
      if (rows.length) {
        await supabase
          .from("matches")
          .upsert(rows, { onConflict: "senior_id,job_id" });
      }
    }
  }

  redirect(`/recommendations?senior_id=${senior.id}&registered=1`);
}

// ── 일자리 추가 + rematch_job RPC ─────────────────────────
export async function addJob(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const title           = (formData.get("title")    as string)?.trim();
  const region          = (formData.get("region")   as string)?.trim();
  const job_type        = (formData.get("job_type") as string)?.trim();
  const required_career = parseInt(formData.get("required_career") as string, 10);

  if (!title)    return { error: "공고명을 입력해 주세요." };
  if (!region)   return { error: "지역을 입력해 주세요." };
  if (!job_type) return { error: "직종을 입력해 주세요." };
  if (isNaN(required_career) || required_career < 0)
    return { error: "요구 경력을 올바르게 입력해 주세요." };

  const { data: job, error: insertErr } = await supabase
    .from("jobs")
    .insert({ title, region, job_type, required_career })
    .select()
    .single();

  if (insertErr || !job)
    return { error: "추가 실패: " + (insertErr?.message ?? "알 수 없는 오류") };

  const { error: rpcErr } = await supabase.rpc("rematch_job", {
    p_job_id: job.id,
  });

  if (rpcErr) {
    const { data: seniors } = await supabase.from("seniors").select("*");
    if (seniors?.length) {
      const rows = seniors
        .map((s) => ({ senior_id: s.id, job_id: job.id, score: calculateScore(s, job) }))
        .filter((r) => r.score > 0);
      if (rows.length) {
        await supabase
          .from("matches")
          .upsert(rows, { onConflict: "senior_id,job_id" });
      }
    }
  }

  revalidatePath("/admin");
  return null;
}

// ── 매치 상태 변경 ────────────────────────────────────────
export async function updateMatchStatus(
  matchId: string,
  status: "assigned" | "done"
): Promise<void> {
  await supabase.from("matches").update({ status }).eq("id", matchId);
  revalidatePath("/admin");
}

export async function assignMatch(matchId: string): Promise<void> {
  return updateMatchStatus(matchId, "assigned");
}
