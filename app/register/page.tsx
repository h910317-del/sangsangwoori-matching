import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "시니어 프로필 등록 — 상상우리",
};

export default function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">시니어 일자리 신청하기</h1>
      <p className="text-xl text-gray-500 mb-10">
        아래 정보를 입력하시면 담당자가 맞는 일자리를 찾아 드립니다.
      </p>
      <RegisterForm />
    </div>
  );
}
