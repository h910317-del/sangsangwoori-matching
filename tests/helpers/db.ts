import { createClient } from "@supabase/supabase-js";

// process.env 는 playwright.config.ts 에서 .env.local 로딩 후 워커에 상속됨
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/** 테스트 전 DB를 깨끗하게 비움 (FK 순서 준수: matches → seniors/jobs) */
export async function resetDb() {
  await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("seniors").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

type JobInput = {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
};

export async function insertJob(job: JobInput) {
  const { data, error } = await supabase.from("jobs").insert(job).select().single();
  if (error) throw new Error("insertJob 실패: " + error.message);
  return data;
}

/** 마지막으로 등록된 시니어를 이름으로 조회 */
export async function findSeniorByName(name: string) {
  const { data } = await supabase
    .from("seniors")
    .select("*")
    .eq("name", name)
    .limit(1)
    .single();
  return data;
}

export async function countSeniors(): Promise<number> {
  const { count } = await supabase.from("seniors").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export { supabase };
