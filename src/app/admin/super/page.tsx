import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { SuperAdminConsole } from "@/app/admin/super/super-admin-console";
import { SuperAdminLoginForm } from "@/app/admin/super/super-admin-login-form";
import { isSuperAdminAuthenticated } from "@/lib/admin-session";
import { createSupabaseAdminClient, hasSupabaseConfig } from "@/lib/supabase/server";

type InvitationSummary = {
  slug: string;
  status: "draft" | "published";
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  created_at: string;
  updated_at: string;
};

async function getInvitationSummaries() {
  if (!hasSupabaseConfig()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("slug, status, groom_name, bride_name, wedding_date, created_at, updated_at")
    .order("created_at", { ascending: false })
    .returns<InvitationSummary[]>();

  if (error || !data) {
    return [];
  }

  return data;
}

export default async function SuperAdminPage() {
  const isAuthenticated = await isSuperAdminAuthenticated();
  const invitations = isAuthenticated ? await getInvitationSummaries() : [];

  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-6 text-stone-950">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-stone-300 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-stone-500">Super Admin</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">운영 관리자</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              초대장 목록 확인, 관리자 코드 재발급, 운영 상태 점검을 위한 내부 콘솔입니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="inline-flex h-11 items-center border border-stone-300 bg-white px-4 text-sm">
              초대장 로그인
            </Link>
            {isAuthenticated ? (
              <form action={logoutAdmin}>
                <button type="submit" className="h-11 bg-stone-950 px-4 text-sm text-white">
                  로그아웃
                </button>
              </form>
            ) : null}
          </div>
        </header>

        {isAuthenticated ? (
          <SuperAdminConsole invitations={invitations} />
        ) : (
          <section className="mt-8 max-w-lg border border-stone-200 bg-[#fffdf9] p-6">
            <h2 className="font-serif text-3xl">슈퍼 관리자 로그인</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Vercel 환경변수에 설정된 이메일과 비밀번호로만 접근할 수 있습니다.
            </p>
            <SuperAdminLoginForm />
          </section>
        )}
      </section>
    </main>
  );
}
