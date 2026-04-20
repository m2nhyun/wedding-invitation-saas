import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getPrimaryInvitation } from "@/lib/mock-data";
import { hasSupabaseConfig } from "@/lib/supabase/server";

const editorSections = [
  {
    title: "기본 정보",
    fields: ["slug", "공개 상태", "신랑·신부 이름", "부모님 성함"],
  },
  {
    title: "예식 정보",
    fields: ["날짜", "시간", "장소", "홀", "주소", "지도 링크"],
  },
  {
    title: "문구",
    fields: ["초대 문구", "인용문", "스토리", "오시는 길 안내", "마무리 문구"],
  },
  {
    title: "미디어",
    fields: ["히어로", "인트로", "갤러리", "타임라인", "OG 이미지"],
  },
];

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const invitation = getPrimaryInvitation();
  const supabaseReady = hasSupabaseConfig();

  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-6 text-stone-950">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-stone-300 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-stone-500">Admin Dashboard</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              {invitation.couple.groom.name} & {invitation.couple.bride.name}
            </h1>
            <p className="mt-4 text-sm text-stone-600">
              `/w/{invitation.slug}` 페이지를 편집하기 위한 관리 콘솔입니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/w/${invitation.slug}`}
              className="inline-flex h-11 items-center border border-stone-300 bg-white px-4 text-sm"
            >
              공개 페이지
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="h-11 bg-stone-950 px-4 text-sm text-white">
                로그아웃
              </button>
            </form>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Publish</p>
            <p className="mt-3 font-serif text-3xl">{invitation.status === "published" ? "공개 중" : "작성 중"}</p>
          </article>
          <article className="bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Supabase</p>
            <p className="mt-3 font-serif text-3xl">{supabaseReady ? "연결 준비됨" : "env 필요"}</p>
          </article>
          <article className="bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Storage</p>
            <p className="mt-3 font-serif text-3xl">wedding-media</p>
          </article>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {editorSections.map((section) => (
            <article key={section.title} className="border border-stone-200 bg-[#fffdf9] p-6">
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {section.fields.map((field) => (
                  <span key={field} className="border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
                    {field}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="mt-6 h-11 w-full border border-dashed border-stone-300 text-sm text-stone-500"
              >
                편집 UI 연결 예정
              </button>
            </article>
          ))}
        </section>

        <section className="mt-8 bg-stone-950 p-6 text-white">
          <p className="font-serif text-2xl">다음 구현 순서</p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-stone-300">
            <li>Supabase 프로젝트 env를 Vercel과 로컬에 등록합니다.</li>
            <li>마이그레이션 SQL로 테이블과 Storage bucket을 생성합니다.</li>
            <li>mock 데이터를 seed로 넣고 `/w/[slug]`를 Supabase read로 전환합니다.</li>
            <li>이 dashboard 카드들을 실제 form editor로 바꿉니다.</li>
          </ol>
        </section>
      </section>
    </main>
  );
}
