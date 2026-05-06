"use client";

import { useTransition } from "react";
import { assignMatch } from "@/app/actions";

export default function AssignButton({ matchId }: { matchId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => assignMatch(matchId))}
      className="mt-2 w-full rounded-lg bg-green-600 text-white text-base font-semibold
                 py-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? "처리 중…" : "배정 완료로 이동"}
    </button>
  );
}
