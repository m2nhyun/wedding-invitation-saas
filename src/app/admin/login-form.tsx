"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "@/app/admin/actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="mt-10 space-y-4">
      <label className="block text-sm font-medium" htmlFor="admin-password">
        관리자 코드
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        placeholder="초대장별 관리자 코드"
        className="admin-input h-12 w-full px-4 text-sm"
        aria-invalid={Boolean(state.error)}
      />
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="admin-button-primary h-12 w-full text-sm font-medium tracking-[0.16em] disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "확인 중" : "로그인"}
      </button>
    </form>
  );
}
