"use client";

import { useActionState } from "react";
import {
  resetInvitationAdminCode,
  type SuperAdminResetCodeState,
  type SuperAdminStatusState,
  updateInvitationStatus,
} from "@/app/admin/actions";

type InvitationSummary = {
  slug: string;
  status: "draft" | "published";
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  created_at: string;
  updated_at: string;
};

type Props = {
  invitations: InvitationSummary[];
};

const initialState: SuperAdminResetCodeState = {};
const initialStatusState: SuperAdminStatusState = {};

export function SuperAdminConsole({ invitations }: Props) {
  const [resetState, resetFormAction, resetIsPending] = useActionState(resetInvitationAdminCode, initialState);
  const [statusState, statusFormAction, statusIsPending] = useActionState(updateInvitationStatus, initialStatusState);

  return (
    <section className="mt-8 border border-stone-200 bg-[#fffdf9] p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-stone-400">Invitations</p>
          <h2 className="mt-3 font-serif text-3xl">초대장 운영 목록</h2>
        </div>
        <p className="text-sm text-stone-500">총 {invitations.length}개</p>
      </div>

      {resetState.error ? <p className="mt-5 text-sm text-red-700">{resetState.error}</p> : null}
      {statusState.error ? <p className="mt-5 text-sm text-red-700">{statusState.error}</p> : null}
      {statusState.success && statusState.slug ? (
        <div className="mt-5 border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-950">
          <p className="font-medium">{statusState.success}</p>
          <p>
            대상: <span className="font-mono">/w/{statusState.slug}</span>
          </p>
        </div>
      ) : null}
      {resetState.success && resetState.slug && resetState.adminCode ? (
        <div className="mt-5 border border-green-200 bg-green-50 p-4 text-sm leading-7 text-green-950">
          <p className="font-medium">{resetState.success}</p>
          <p>
            대상: <span className="font-mono">/admin/{resetState.slug}</span>
          </p>
          <p>
            새 관리자 코드: <span className="font-mono font-semibold">{resetState.adminCode}</span>
          </p>
          <p className="mt-2 text-green-800">이 코드는 지금만 표시됩니다. 해당 초대장 담당자에게 안전하게 전달해주세요.</p>
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs uppercase tracking-[0.18em] text-stone-400">
              <th className="py-3 pr-4 font-medium">Slug</th>
              <th className="py-3 pr-4 font-medium">Couple</th>
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Publish</th>
              <th className="py-3 pr-4 font-medium">Links</th>
              <th className="py-3 text-right font-medium">Admin Code</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr key={invitation.slug} className="border-b border-stone-200">
                <td className="py-4 pr-4 font-mono text-xs">{invitation.slug}</td>
                <td className="py-4 pr-4">
                  {invitation.groom_name} & {invitation.bride_name}
                </td>
                <td className="py-4 pr-4">{invitation.wedding_date}</td>
                <td className="py-4 pr-4">
                  <span className="border border-stone-200 bg-white px-2 py-1 text-xs">
                    {invitation.status === "published" ? "공개" : "비공개"}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <form action={statusFormAction}>
                    <input type="hidden" name="slug" value={invitation.slug} />
                    <input
                      type="hidden"
                      name="status"
                      value={invitation.status === "published" ? "draft" : "published"}
                    />
                    <button
                      type="submit"
                      disabled={statusIsPending}
                      className="h-10 border border-stone-300 bg-white px-3 text-xs disabled:cursor-not-allowed disabled:text-stone-400"
                    >
                      {invitation.status === "published" ? "비공개 전환" : "공개 전환"}
                    </button>
                  </form>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex gap-2">
                    <a className="border border-stone-300 bg-white px-3 py-2 text-xs" href={`/w/${invitation.slug}`}>
                      공개
                    </a>
                    <a className="border border-stone-300 bg-white px-3 py-2 text-xs" href={`/admin/${invitation.slug}`}>
                      관리
                    </a>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <form action={resetFormAction}>
                    <input type="hidden" name="slug" value={invitation.slug} />
                    <button
                      type="submit"
                      disabled={resetIsPending}
                      className="h-10 bg-stone-950 px-4 text-xs font-medium tracking-[0.12em] text-white disabled:bg-stone-400"
                    >
                      재발급
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
