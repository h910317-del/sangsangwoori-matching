import { supabase } from "@/lib/supabase";
import type { MatchWithDetails, Senior } from "@/lib/supabase";
import AssignButton from "./AssignButton";

export const metadata = { title: "담당자 대시보드 — 상상우리" };

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    { data: allSeniors },
    { data: pendingRaw },
    { data: assignedRaw },
    { data: matchedIds },
  ] = await Promise.all([
    supabase.from("seniors").select("*"),
    supabase
      .from("matches")
      .select("*, seniors(*), jobs(*)")
      .eq("status", "pending")
      .order("score", { ascending: false }),
    supabase
      .from("matches")
      .select("*, seniors(*), jobs(*)")
      .eq("status", "assigned")
      .order("score", { ascending: false }),
    supabase.from("matches").select("senior_id"),
  ]);

  const pending = (pendingRaw ?? []) as MatchWithDetails[];
  const assigned = (assignedRaw ?? []) as MatchWithDetails[];

  const matchedSet = new Set((matchedIds ?? []).map((r) => r.senior_id));
  const unmatched = ((allSeniors ?? []) as Senior[]).filter(
    (s) => !matchedSet.has(s.id)
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-500 mb-8">
        매칭 현황을 한눈에 확인하고 배정을 관리합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* ── 미매칭 ─────────────────────────────────────── */}
        <section className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 flex flex-col gap-3 min-h-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <h2 className="text-2xl font-bold">미매칭</h2>
            <span className="ml-auto text-lg font-semibold text-red-500">{unmatched.length}명</span>
          </div>
          {unmatched.length === 0 && (
            <p className="text-gray-400 text-base text-center py-6">없음</p>
          )}
          {unmatched.map((s) => (
            <div key={s.id} className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
              <p className="text-lg font-bold text-gray-900">{s.name}</p>
              <p className="text-base text-gray-500">{s.region} · {s.desired_job} · 경력 {s.career_years}년</p>
            </div>
          ))}
        </section>

        {/* ── 매칭 대기 ───────────────────────────────────── */}
        <section className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-5 flex flex-col gap-3 min-h-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <h2 className="text-2xl font-bold">매칭 대기</h2>
            <span className="ml-auto text-lg font-semibold text-yellow-600">{pending.length}건</span>
          </div>
          {pending.length === 0 && (
            <p className="text-gray-400 text-base text-center py-6">없음</p>
          )}
          {pending.map((m) => (
            <div key={m.id} className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{m.seniors.name}</p>
                  <p className="text-base text-gray-500">{m.jobs.title}</p>
                  <p className="text-sm text-gray-400">{m.jobs.region}</p>
                </div>
                <span className="text-xl font-bold text-yellow-700 shrink-0">{m.score}점</span>
              </div>
              <AssignButton matchId={m.id} />
            </div>
          ))}
        </section>

        {/* ── 배정 완료 ───────────────────────────────────── */}
        <section className="rounded-2xl border-2 border-green-300 bg-green-50 p-5 flex flex-col gap-3 min-h-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <h2 className="text-2xl font-bold">배정 완료</h2>
            <span className="ml-auto text-lg font-semibold text-green-700">{assigned.length}건</span>
          </div>
          {assigned.length === 0 && (
            <p className="text-gray-400 text-base text-center py-6">없음</p>
          )}
          {assigned.map((m) => (
            <div key={m.id} className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm opacity-80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{m.seniors.name}</p>
                  <p className="text-base text-gray-500">{m.jobs.title}</p>
                  <p className="text-sm text-gray-400">{m.jobs.region}</p>
                </div>
                <span className="text-xl font-bold text-green-700 shrink-0">{m.score}점</span>
              </div>
              <p className="mt-2 text-center text-sm text-green-600 font-semibold">✓ 배정 완료</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
