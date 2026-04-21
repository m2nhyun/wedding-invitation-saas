import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login-form";
import { getAdminSessionSlug } from "@/lib/admin-session";

const adminModules = [
  {
    title: "초대장 정보",
    description: "신랑·신부, 예식 일시, 장소, 부모님 성함을 관리합니다.",
    status: "운영 중",
  },
  {
    title: "문구 편집",
    description: "초대 문구, 인용문, 스토리, 안내 문구를 섹션별로 수정합니다.",
    status: "운영 중",
  },
  {
    title: "사진 업로드",
    description: "히어로, 갤러리, 타임라인, OG 이미지를 Supabase Storage에 올립니다.",
    status: "운영 중",
  },
  {
    title: "동적 페이지",
    description: "slug를 기준으로 여러 청첩장 페이지를 생성하고 공개 상태를 제어합니다.",
    status: "기반 반영",
  },
];

export default async function AdminPage() {
  const sessionSlug = await getAdminSessionSlug();
  if (sessionSlug) {
    redirect(`/admin/${sessionSlug}`);
  }

  return (
    <main className="admin-shell px-5 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[420px_1fr]">
        <div className="admin-panel flex flex-col justify-between rounded-[18px] p-8">
          <div>
            <p className="admin-label">Wedding Admin</p>
            <h1 className="mt-6 font-serif text-3xl leading-tight md:text-5xl">
              초대장을
              <br />
              운영하는 공간
            </h1>
            <p className="mt-7 text-sm leading-8 text-stone-600">
              초대장별 관리자 코드를 입력하면 해당 초대장의 관리 화면으로 이동합니다. 코드는 URL과
              분리되어 저장되며, 세션은 httpOnly 쿠키로 관리됩니다.
            </p>
          </div>

          <AdminLoginForm />
        </div>

        <div className="admin-panel rounded-[18px] p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="admin-label">SaaS Structure</p>
              <h2 className="mt-4 font-serif text-2xl leading-tight md:text-4xl">확장 가능한 관리 구조</h2>
            </div>
            <Link
              href="/w/jjym0818"
              className="admin-button-secondary hidden h-11 px-4 text-sm md:inline-flex"
            >
              샘플 보기
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {adminModules.map((module) => (
              <article key={module.title} className="admin-panel-muted rounded-[14px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-2xl">{module.title}</h3>
                  <span className="admin-status-pill">
                    {module.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-600">{module.description}</p>
              </article>
            ))}
          </div>

          <div className="admin-panel-muted mt-8 rounded-[14px] p-5">
            <p className="text-sm font-medium">운영 안내</p>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              일반 관리자는 초대장별 관리자 코드로 자기 초대장만 편집합니다. 새 초대장 생성과 관리자 코드 재발급은
              슈퍼 관리자 콘솔에서만 처리합니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
