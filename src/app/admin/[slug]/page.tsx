import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
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
    <main className="admin-shell px-5 py-6">
      <section className="mx-auto max-w-6xl">
        <header className="admin-panel rounded-[18px] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="admin-label">Admin Dashboard</p>
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
              className="admin-button-secondary h-11 px-4 text-sm"
            >
              공개 페이지
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="admin-button-primary h-11 px-4 text-sm">
                로그아웃
              </button>
            </form>
          </div>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="admin-panel-muted rounded-[14px] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Publish</p>
            <p className="mt-3 font-serif text-2xl md:text-3xl">{invitation.status === "published" ? "공개 중" : "작성 중"}</p>
          </article>
          <article className="admin-panel-muted rounded-[14px] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Supabase</p>
            <p className="mt-3 font-serif text-2xl md:text-3xl">{supabaseReady ? "연결 준비됨" : "env 필요"}</p>
          </article>
          <article className="admin-panel-muted rounded-[14px] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Storage</p>
            <p className="mt-3 font-mono text-xl md:text-2xl">wedding-media</p>
          </article>
        </div>

        <InvitationEditor invitation={invitation} canSave={supabaseReady} />

        <section className="admin-panel mt-8 rounded-[18px] p-6">
          <p className="font-serif text-2xl">다음 구현 순서</p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-stone-600">
            <li>생성된 초대장의 관리자 코드를 재발급하는 안전한 복구 플로우를 추가합니다.</li>
            <li>계좌번호 편집 UI를 별도 반복 form으로 분리합니다.</li>
            <li>타임라인 섹션의 문구와 이미지를 admin에서 편집할 수 있게 합니다.</li>
            <li>공개 페이지의 세부 모션과 섹션 간 여백을 레퍼런스 수준으로 다듬습니다.</li>
          </ol>
        </section>
      </section>
    </main>
  );
}
