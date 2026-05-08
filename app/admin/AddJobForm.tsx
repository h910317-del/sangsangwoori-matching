"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addJob, type FormState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 rounded-lg bg-blue-700 text-white text-lg font-bold px-8
                 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "추가 중…" : "일자리 추가"}
    </button>
  );
}

const inputCls =
  "h-11 w-full rounded-lg border-2 border-gray-300 px-3 text-base " +
  "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition";

export default function AddJobForm() {
  const [state, action] = useActionState<FormState, FormData>(addJob, null);

  return (
    <details className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
      <summary className="cursor-pointer text-xl font-bold text-blue-700 select-none">
        ＋ 새 일자리 추가
      </summary>

      <form action={action} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state?.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 border border-red-300 text-red-700 px-4 py-2 text-base">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-base font-semibold">공고명</label>
          <input name="title" type="text" placeholder="강남구 경비원" required className={inputCls} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-semibold">지역</label>
          <input name="region" type="text" placeholder="서울 강남구" required className={inputCls} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-semibold">직종</label>
          <input name="job_type" type="text" placeholder="경비 / 청소 / 배달 등" required className={inputCls} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-semibold">요구 경력 (년)</label>
          <input name="required_career" type="number" min={0} max={50} defaultValue={0} required className={inputCls} />
        </div>

        <div className="sm:col-span-2 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </details>
  );
}
