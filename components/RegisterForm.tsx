"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerSenior, type RegisterState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-16 w-full rounded-lg bg-blue-700 text-white text-2xl font-bold mt-4
                 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed
                 transition-colors"
    >
      {pending ? "등록 중…" : "등록하기"}
    </button>
  );
}

const inputClass =
  "h-14 w-full rounded-lg border-2 border-gray-300 px-4 text-xl " +
  "focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition";

export default function RegisterForm() {
  const [state, action] = useActionState<RegisterState, FormData>(
    registerSenior,
    null
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 border border-red-300 text-red-700 text-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold" htmlFor="name">이름</label>
        <input id="name" name="name" type="text" placeholder="홍길동" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold" htmlFor="region">지역</label>
        <input id="region" name="region" type="text" placeholder="서울 강남구" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold" htmlFor="desired_job">희망 직종</label>
        <input id="desired_job" name="desired_job" type="text" placeholder="경비, 청소, 배달, 시설관리 등" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl font-semibold" htmlFor="career_years">경력 (년)</label>
        <input
          id="career_years" name="career_years" type="number"
          placeholder="0" min={0} max={50} defaultValue={0}
          required className={inputClass}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
