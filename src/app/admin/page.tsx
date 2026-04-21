import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login-form";
import { getAdminSessionSlug } from "@/lib/admin-session";

const adminModules = [
  {
    title: "기본 정보",
    description: "이름, 예식 일시, 장소 정보를 수정합니다.",
  },
  {
    title: "초대 문구",
    description: "초대글과 안내 문구를 수정합니다.",
  },
  {
    title: "사진 관리",
    description: "대표 사진과 갤러리 사진을 업로드합니다.",
  },
  {
    title: "계좌 정보",
    description: "마음 전하실 곳에 표시될 계좌 정보를 수정합니다.",
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
            <p className="admin-label">초대장 관리</p>
            <h1 className="mt-6 font-serif text-3xl leading-tight md:text-5xl">
              초대장을
              <br />
              운영하는 공간
            </h1>
            <p className="mt-7 text-sm leading-8 text-stone-600">
              전달받은 관리자 코드를 입력하면 초대장 편집 화면으로 이동합니다.
            </p>
          </div>

          <AdminLoginForm />
        </div>

        <div className="admin-panel rounded-[18px] p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="admin-label">관리 항목</p>
              <h2 className="mt-4 font-serif text-2xl leading-tight md:text-4xl">관리할 수 있는 항목</h2>
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
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-600">{module.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
