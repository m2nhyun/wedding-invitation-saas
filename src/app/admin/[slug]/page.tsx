import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { CreateInvitationForm } from "@/app/admin/[slug]/create-invitation-form";
import { InvitationEditor } from "@/app/admin/dashboard/invitation-editor";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getAdminInvitationBySlug } from "@/lib/invitations";
import { hasSupabaseConfig } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminInvitationPage({ params }: PageProps) {
  const { slug } = await params;

  if (!(await isAdminAuthenticated(slug))) {
    redirect("/admin");
  }

  const supabaseReady = hasSupabaseConfig();
  const invitation = await getAdminInvitationBySlug(slug);

  if (!invitation) {
    redirect("/admin");
  }

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

        <CreateInvitationForm sourceSlug={invitation.slug} canCreate={supabaseReady} />

        <InvitationEditor invitation={invitation} canSave={supabaseReady} />

        <section className="mt-8 bg-stone-950 p-6 text-white">
          <p className="font-serif text-2xl">다음 구현 순서</p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-stone-300">
            <li>생성된 초대장의 관리자 코드를 재발급하는 안전한 복구 플로우를 추가합니다.</li>
            <li>계좌번호 편집 UI를 별도 반복 form으로 분리합니다.</li>
            <li>갤러리 순서 변경과 삭제 기능을 붙입니다.</li>
            <li>저장 후 공개 페이지 미리보기를 더 빠르게 확인할 수 있게 합니다.</li>
          </ol>
        </section>
      </section>
    </main>
  );
}
