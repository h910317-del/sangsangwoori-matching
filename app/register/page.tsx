import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "시니어 프로필 등록 — 상상우리",
};

export default function RegisterPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">시니어 프로필 등록</h1>
      <p className="text-xl text-gray-500 mb-10">
        아래 정보를 입력하시면 일자리를 자동으로 추천해 드립니다.
      </p>
      <RegisterForm />
    </div>
  );
}
