"use client";

import { useActionState } from "react";
import { createInvitation, type AdminCreateInvitationState } from "@/app/admin/actions";

type Props = {
  sourceSlug: string;
  canCreate: boolean;
};

const initialState: AdminCreateInvitationState = {};

export function CreateInvitationForm({ sourceSlug, canCreate }: Props) {
  const [state, formAction, isPending] = useActionState(createInvitation, initialState);

  return (
    <section className="mt-8 border border-stone-200 bg-[#fffdf9] p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-stone-400">Create</p>
          <h2 className="mt-3 font-serif text-3xl">새 초대장 생성</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            현재 초대장의 사진, 문구, 계좌 형식을 복제해서 새로운 초대장을 만듭니다. 생성된 초대장은 비공개 상태로 시작합니다.
          </p>
        </div>
        <span className="inline-flex h-9 items-center border border-stone-300 bg-white px-3 text-xs uppercase tracking-[0.2em] text-stone-500">
          Template: {sourceSlug}
        </span>
      </div>

      <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-end">
        <input type="hidden" name="sourceSlug" value={sourceSlug} />
        <label className="block">
          <span className="text-sm font-medium text-stone-700">공개 URL slug</span>
          <input
            name="newSlug"
            placeholder="ex. minhyun-yumin"
            required
            minLength={3}
            pattern="[A-Za-z0-9-]+"
            className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-950"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">신랑 이름</span>
          <input
            name="newGroomName"
            required
            className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-950"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">신부 이름</span>
          <input
            name="newBrideName"
            required
            className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-950"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">예식 날짜</span>
          <input
            name="newWeddingDate"
            type="date"
            required
            className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-950"
          />
        </label>
        <button
          type="submit"
          disabled={!canCreate || isPending}
          className="h-11 bg-stone-950 px-5 text-sm font-medium tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {isPending ? "생성 중" : canCreate ? "생성" : "env 필요"}
        </button>
      </form>

      {state.error ? <p className="mt-4 text-sm text-red-700">{state.error}</p> : null}
      {state.success && state.slug && state.adminCode ? (
        <div className="mt-5 border border-green-200 bg-green-50 p-4 text-sm leading-7 text-green-950">
          <p className="font-medium">{state.success}</p>
          <p className="mt-2">
            공개 페이지: <span className="font-mono">/w/{state.slug}</span>
          </p>
          <p>
            관리자 페이지: <span className="font-mono">/admin/{state.slug}</span>
          </p>
          <p>
            관리자 코드: <span className="font-mono font-semibold">{state.adminCode}</span>
          </p>
          <p className="mt-2 text-green-800">
            이 코드는 다시 조회할 수 없으니 별도로 보관해주세요. 새 초대장을 관리하려면 로그아웃 후 이 코드로 다시 로그인합니다.
          </p>
        </div>
      ) : null}
    </section>
  );
}
