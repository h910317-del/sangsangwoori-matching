import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="bg-blue-700 text-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          상상우리
        </Link>
        <nav className="flex gap-6 text-lg font-medium">
          <Link href="/register" className="hover:underline underline-offset-4">
            프로필 등록
          </Link>
          <Link href="/recommendations" className="hover:underline underline-offset-4">
            추천 일자리
          </Link>
          <Link href="/admin" className="hover:underline underline-offset-4">
            담당자 대시보드
          </Link>
        </nav>
      </div>
    </header>
  );
}
