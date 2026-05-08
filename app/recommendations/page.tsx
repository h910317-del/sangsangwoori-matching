import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { MatchWithDetails } from "@/lib/supabase";

export const metadata = { title: "추천 일자리 — 상상우리" };

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 100
      ? "bg-amber-100 text-amber-800 border-amber-400"
      : score >= 60
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-gray-100 text-gray-600 border-gray-300";
  const label =
    score >= 100 ? "매우 적합" : score >= 60 ? "적합" : "보통";
  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className={`inline-flex items-center gap-1 rounded-full border px-4 py-1 text-xl font-bold ${cls}`}>
        {score >= 100 && "★ "}
        {score}점
      </span>
      <span className="text-base text-gray-500">{label}</span>
    </div>
  );
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string; registered?: string }>;
}) {
  const { senior_id: seniorId, registered } = await searchParams;

  if (!seniorId) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <h1 className="text-4xl font-bold">추천 일자리</h1>
        <p className="text-2xl text-gray-500">먼저 프로필을 등록해 주세요.</p>
        <Link href="/register" className="rounded-xl bg-blue-700 text-white text-xl font-bold px-10 py-4 hover:bg-blue-800">
          프로필 등록하기
        </Link>
      </div>
    );
  }

  const [{ data: senior }, { data: rawMatches }] = await Promise.all([
    supabase.from("seniors").select("*").eq("id", seniorId).single(),
    supabase
      .from("matches")
      .select("*, seniors(*), jobs(*)")
      .eq("senior_id", seniorId)
      .gt("score", 0)
      .order("score", { ascending: false }),
  ]);

  const matches = (rawMatches ?? []) as MatchWithDetails[];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-1">
        {senior ? `${senior.name} 님께 맞는 일자리` : "나에게 맞는 일자리"}
      </h1>
      {senior && (
        <p className="text-xl text-gray-500 mb-8">
          {senior.region} · {senior.desired_job} · 경력 {senior.career_years}년
        </p>
      )}

      {registered === "1" && (
        <div className="rounded-lg bg-green-50 border border-green-300 text-green-700 text-lg px-4 py-3 mb-6">
          등록이 완료되었습니다. 담당자가 곧 연락드립니다.
        </div>
      )}

      {matches.length === 0 ? (
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-10 text-center">
          <p className="text-3xl mb-3">😔</p>
          <p className="text-2xl font-semibold text-gray-600">현재 매칭되는 일자리가 없습니다</p>
          <p className="text-lg text-gray-400 mt-2">지역·직종을 달리해서 다시 등록해 보세요.</p>
          <p className="text-lg text-blue-600 mt-1 font-medium">담당자가 직접 연락드리니 잠시만 기다려 주세요.</p>
          <Link href="/register" className="inline-block mt-6 rounded-xl bg-blue-700 text-white text-xl font-bold px-8 py-3 hover:bg-blue-800">
            다시 등록하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((m, idx) => (
            <div
              key={m.id}
              className="rounded-2xl border-2 border-gray-200 bg-white p-6 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300 w-8 shrink-0">{idx + 1}</span>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{m.jobs.title}</p>
                  <p className="text-lg text-gray-500 mt-1">
                    {m.jobs.region} · {m.jobs.job_type} · 경력 {m.jobs.required_career}년 이상
                  </p>
                </div>
              </div>
              <ScoreBadge score={m.score} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/register" className="text-blue-600 underline text-lg hover:text-blue-800">
          다른 프로필로 다시 검색
        </Link>
      </div>
    </div>
  );
}
