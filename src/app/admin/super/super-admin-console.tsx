"use client";

import { useActionState } from "react";
import {
  createInvitationAsSuperAdmin,
  resetInvitationAdminCode,
  type SuperAdminResetCodeState,
  type SuperAdminCreateInvitationState,
  type SuperAdminStatusState,
  updateInvitationStatus,
} from "@/app/admin/actions";
import type { AdminAuditLogSummary } from "@/app/admin/super/page";

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
  auditLogs: AdminAuditLogSummary[];
  invitations: InvitationSummary[];
};

const initialState: SuperAdminResetCodeState = {};
const initialStatusState: SuperAdminStatusState = {};
const initialCreateState: SuperAdminCreateInvitationState = {};

const actionLabels: Record<string, string> = {
  "admin_code.reset": "관리자 코드 재발급",
  "invitation.created": "초대장 생성",
  "invitation.status_updated": "공개 상태 변경",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

function getLogDetail(log: AdminAuditLogSummary) {
  if (log.action === "invitation.created" && typeof log.metadata.sourceSlug === "string") {
    return `템플릿 ${log.metadata.sourceSlug}`;
  }

  if (log.action === "invitation.status_updated" && typeof log.metadata.status === "string") {
    return log.metadata.status === "published" ? "공개로 변경" : "비공개로 변경";
  }

  return "";
}

export function SuperAdminConsole({ auditLogs, invitations }: Props) {
  const [resetState, resetFormAction, resetIsPending] = useActionState(resetInvitationAdminCode, initialState);
  const [statusState, statusFormAction, statusIsPending] = useActionState(updateInvitationStatus, initialStatusState);
  const [createState, createFormAction, createIsPending] = useActionState(
    createInvitationAsSuperAdmin,
    initialCreateState,
  );

  return (
    <div className="mt-8 space-y-8">
      <section className="admin-panel rounded-[18px] p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="admin-label">초대장 생성</p>
            <h2 className="mt-3 font-serif text-3xl">새 초대장 만들기</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              기존 초대장의 구성과 디자인을 바탕으로 새 초대장을 만듭니다.
            </p>
          </div>
        </div>

        <form action={createFormAction} className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr_1fr_1fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">기준 초대장</span>
            <select
              name="sourceSlug"
              required
              className="admin-input mt-2 h-11 w-full px-3 text-sm"
            >
              {invitations.map((invitation) => (
                <option key={invitation.slug} value={invitation.slug}>
                  {invitation.slug}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">영문 주소</span>
            <input
              name="newSlug"
              placeholder="ex. sample-wedding"
              required
              minLength={3}
              pattern="[A-Za-z0-9-]+"
              className="admin-input mt-2 h-11 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">신랑 이름</span>
            <input
              name="newGroomName"
              required
              className="admin-input mt-2 h-11 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">신부 이름</span>
            <input
              name="newBrideName"
              required
              className="admin-input mt-2 h-11 w-full px-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">예식 날짜</span>
            <input
              name="newWeddingDate"
              type="date"
              required
              className="admin-input mt-2 h-11 w-full px-3 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={createIsPending || invitations.length === 0}
            className="admin-button-primary h-11 px-5 text-sm font-medium tracking-[0.14em] disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {createIsPending ? "생성 중" : "생성"}
          </button>
        </form>

        {createState.error ? <p className="mt-4 text-sm text-red-700">{createState.error}</p> : null}
        {createState.success && createState.slug && createState.adminCode ? (
          <div className="mt-5 rounded-[14px] border border-green-200 bg-green-50/80 p-4 text-sm leading-7 text-green-950">
            <p className="font-medium">{createState.success}</p>
            <p>
              공개 페이지: <span className="font-mono">/w/{createState.slug}</span>
            </p>
            <p>
              관리자 페이지: <span className="font-mono">/admin/{createState.slug}</span>
            </p>
            <p>
              관리자 코드: <span className="font-mono font-semibold">{createState.adminCode}</span>
            </p>
            <p className="mt-2 text-green-800">관리자 코드는 다시 확인할 수 없으니 안전하게 보관해주세요.</p>
          </div>
        ) : null}
      </section>

      <section className="admin-panel rounded-[18px] p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">초대장 목록</p>
          <h2 className="mt-3 font-serif text-3xl">초대장 목록</h2>
        </div>
        <p className="text-sm text-stone-500">총 {invitations.length}개</p>
      </div>

      {resetState.error ? <p className="mt-5 text-sm text-red-700">{resetState.error}</p> : null}
      {statusState.error ? <p className="mt-5 text-sm text-red-700">{statusState.error}</p> : null}
      {statusState.success && statusState.slug ? (
        <div className="mt-5 rounded-[14px] border border-blue-200 bg-blue-50/80 p-4 text-sm leading-7 text-blue-950">
          <p className="font-medium">{statusState.success}</p>
          <p>
            대상: <span className="font-mono">/w/{statusState.slug}</span>
          </p>
        </div>
      ) : null}
      {resetState.success && resetState.slug && resetState.adminCode ? (
        <div className="mt-5 rounded-[14px] border border-green-200 bg-green-50/80 p-4 text-sm leading-7 text-green-950">
          <p className="font-medium">{resetState.success}</p>
          <p>
            대상: <span className="font-mono">/admin/{resetState.slug}</span>
          </p>
          <p>
            새 관리자 코드: <span className="font-mono font-semibold">{resetState.adminCode}</span>
          </p>
          <p className="mt-2 text-green-800">관리자 코드는 다시 확인할 수 없으니 안전하게 보관해주세요.</p>
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs uppercase tracking-[0.18em] text-stone-400">
              <th className="py-3 pr-4 font-medium">주소</th>
              <th className="py-3 pr-4 font-medium">이름</th>
              <th className="py-3 pr-4 font-medium">예식일</th>
              <th className="py-3 pr-4 font-medium">상태</th>
              <th className="py-3 pr-4 font-medium">공개 설정</th>
              <th className="py-3 pr-4 font-medium">바로가기</th>
              <th className="py-3 text-right font-medium">관리자 코드</th>
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
                  <span className="admin-status-pill">
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
                      className="admin-button-secondary h-10 px-3 text-xs disabled:cursor-not-allowed disabled:text-stone-400"
                    >
                      {invitation.status === "published" ? "비공개 전환" : "공개 전환"}
                    </button>
                  </form>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex gap-2">
                    <a className="admin-button-secondary px-3 py-2 text-xs" href={`/w/${invitation.slug}`}>
                      공개
                    </a>
                    <a className="admin-button-secondary px-3 py-2 text-xs" href={`/admin/${invitation.slug}`}>
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
                      className="admin-button-primary h-10 px-4 text-xs font-medium tracking-[0.12em] disabled:bg-stone-400"
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

      <section className="admin-panel rounded-[18px] p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="admin-label">변경 기록</p>
            <h2 className="mt-3 font-serif text-3xl">최근 운영 로그</h2>
          </div>
          <p className="text-sm text-stone-500">최근 {auditLogs.length}건</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-[0.18em] text-stone-400">
                <th className="py-3 pr-4 font-medium">시간</th>
                <th className="py-3 pr-4 font-medium">변경 내용</th>
                <th className="py-3 pr-4 font-medium">초대장</th>
                <th className="py-3 pr-4 font-medium">상세</th>
                <th className="py-3 font-medium">처리자</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-stone-200">
                    <td className="py-4 pr-4 text-xs text-stone-500">{formatDateTime(log.created_at)}</td>
                    <td className="py-4 pr-4">{actionLabels[log.action] ?? log.action}</td>
                    <td className="py-4 pr-4 font-mono text-xs">{log.invitation_slug ?? "-"}</td>
                    <td className="py-4 pr-4 text-stone-600">{getLogDetail(log) || "-"}</td>
                    <td className="py-4 font-mono text-xs text-stone-500">{log.actor}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-stone-200">
                  <td colSpan={5} className="py-6 text-center text-sm text-stone-500">
                    아직 기록된 운영 로그가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
