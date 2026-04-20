import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login-form";
import { isAdminAuthenticated } from "@/lib/admin-session";

const adminModules = [
  {
    title: "초대장 정보",
    description: "신랑·신부, 예식 일시, 장소, 부모님 성함을 관리합니다.",
    status: "설계 완료",
  },
  {
    title: "문구 편집",
    description: "초대 문구, 인용문, 스토리, 안내 문구를 섹션별로 수정합니다.",
    status: "다음 작업",
  },
  {
    title: "사진 업로드",
    description: "히어로, 갤러리, 타임라인, OG 이미지를 Supabase Storage에 올립니다.",
    status: "다음 작업",
  },
  {
    title: "동적 페이지",
    description: "slug를 기준으로 여러 청첩장 페이지를 생성하고 공개 상태를 제어합니다.",
    status: "기반 반영",
  },
];

export default async function AdminPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-stone-950 px-5 py-8 text-white">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[420px_1fr]">
        <div className="flex flex-col justify-between bg-[#f4efe7] p-8 text-stone-950">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-stone-500">Wedding Admin</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              초대장을
              <br />
              운영하는 공간
            </h1>
            <p className="mt-7 text-sm leading-8 text-stone-600">
              지금은 관리자 진입 화면의 1차 골격입니다. 다음 단계에서 환경변수 기반 비밀번호와
              httpOnly 쿠키 세션을 연결합니다.
            </p>
          </div>

          <AdminLoginForm />
        </div>

        <div className="bg-[#fffdf9] p-8 text-stone-950">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-serif text-sm uppercase tracking-[0.3em] text-stone-400">SaaS Structure</p>
              <h2 className="mt-4 font-serif text-2xl leading-tight md:text-4xl">확장 가능한 관리 구조</h2>
            </div>
            <Link
              href="/w/jjym0818"
              className="hidden border border-stone-300 px-4 py-3 text-sm text-stone-700 transition hover:border-stone-950 md:block"
            >
              샘플 보기
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {adminModules.map((module) => (
              <article key={module.title} className="border border-stone-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-2xl">{module.title}</h3>
                  <span className="border border-stone-200 px-2 py-1 text-[11px] text-stone-500">
                    {module.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-600">{module.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 border border-dashed border-stone-300 bg-[#f4efe7] p-5">
            <p className="text-sm font-medium">다음 연결 예정</p>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              Supabase 테이블, Storage bucket, admin session, invitation editor를 순서대로 붙입니다.
              화면 구조는 먼저 확정하고, 데이터 저장소는 이후 mock 데이터에서 Supabase로 교체합니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
