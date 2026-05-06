import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-20 text-center">
      <h1 className="text-5xl font-bold text-blue-700 leading-tight">
        시니어 일자리 매칭
        <br />
        <span className="text-gray-900">상상우리</span>
      </h1>
      <p className="text-2xl text-gray-600 max-w-xl">
        나에게 맞는 일자리를 빠르게 찾아드립니다.
        <br />
        프로필을 등록하면 자동으로 추천해 드려요.
      </p>
      <div className="flex gap-6 flex-wrap justify-center">
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-xl bg-blue-700 text-white text-xl font-bold h-16 px-10 hover:bg-blue-800 transition-colors"
        >
          프로필 등록하기
        </Link>
        <Link
          href="/recommendations"
          className="inline-flex items-center justify-center rounded-xl border-2 border-blue-700 text-blue-700 text-xl font-bold h-16 px-10 hover:bg-blue-50 transition-colors"
        >
          추천 일자리 보기
        </Link>
      </div>
    </div>
  );
}
