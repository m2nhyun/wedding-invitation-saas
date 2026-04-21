"use client";

import { useActionState } from "react";
import { loginSuperAdmin, type SuperAdminLoginState } from "@/app/admin/actions";

const initialState: SuperAdminLoginState = {};

export function SuperAdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginSuperAdmin, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">이메일</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="admin-input mt-2 h-12 w-full px-4 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">비밀번호</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input mt-2 h-12 w-full px-4 text-sm"
        />
      </label>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="admin-button-primary h-12 w-full text-sm font-medium tracking-[0.16em] disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "확인 중" : "슈퍼 관리자 로그인"}
      </button>
    </form>
  );
}
