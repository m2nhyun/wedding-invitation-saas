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
            <p className="admin-label">초대장 관리</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              {invitation.couple.groom.name} & {invitation.couple.bride.name}
            </h1>
            <p className="mt-4 text-sm text-stone-600">
              초대장에 표시될 정보를 관리합니다.
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
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">상태</p>
            <p className="mt-3 font-serif text-2xl md:text-3xl">{invitation.status === "published" ? "공개 중" : "작성 중"}</p>
          </article>
          <article className="admin-panel-muted rounded-[14px] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">예식일</p>
            <p className="mt-3 font-serif text-2xl md:text-3xl">{invitation.wedding.date}</p>
          </article>
          <article className="admin-panel-muted rounded-[14px] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">사진</p>
            <p className="mt-3 font-serif text-2xl md:text-3xl">{invitation.gallery.length}장</p>
          </article>
        </div>

        <InvitationEditor invitation={invitation} canSave={supabaseReady} />
      </section>
    </main>
  );
}
