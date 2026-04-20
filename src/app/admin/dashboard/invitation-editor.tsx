"use client";

import { useActionState } from "react";
import { saveInvitationDetails, type AdminSaveState } from "@/app/admin/actions";
import type { WeddingInvitation } from "@/lib/mock-data";

type Props = {
  invitation: WeddingInvitation;
  canSave: boolean;
};

const initialState: AdminSaveState = {};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-stone-950"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required
        className="mt-2 w-full resize-y border border-stone-300 bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-stone-950"
      />
    </label>
  );
}

export function InvitationEditor({ invitation, canSave }: Props) {
  const [state, formAction, isPending] = useActionState(saveInvitationDetails, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="slug" value={invitation.slug} />

      <section className="border border-stone-200 bg-[#fffdf9] p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.25em] text-stone-400">Editor</p>
            <h2 className="mt-3 font-serif text-3xl">초대장 정보 편집</h2>
          </div>
          <label className="block min-w-40">
            <span className="text-sm font-medium text-stone-700">공개 상태</span>
            <select
              name="status"
              defaultValue={invitation.status}
              className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none"
            >
              <option value="published">공개</option>
              <option value="draft">비공개</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="신랑 이름" name="groomName" defaultValue={invitation.couple.groom.name} />
          <Field label="신랑 영문 이름" name="groomNameEn" defaultValue={invitation.couple.groom.nameEn} />
          <Field label="신랑 아버지" name="groomFather" defaultValue={invitation.couple.groom.father} />
          <Field label="신랑 어머니" name="groomMother" defaultValue={invitation.couple.groom.mother} />
          <Field label="신부 이름" name="brideName" defaultValue={invitation.couple.bride.name} />
          <Field label="신부 영문 이름" name="brideNameEn" defaultValue={invitation.couple.bride.nameEn} />
          <Field label="신부 아버지" name="brideFather" defaultValue={invitation.couple.bride.father} />
          <Field label="신부 어머니" name="brideMother" defaultValue={invitation.couple.bride.mother} />
        </div>
      </section>

      <section className="border border-stone-200 bg-[#fffdf9] p-6">
        <h2 className="font-serif text-3xl">예식 정보</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="예식 날짜" name="weddingDate" type="date" defaultValue={invitation.wedding.date} />
          <Field label="예식 시간" name="weddingTime" type="time" defaultValue={invitation.wedding.time} />
          <Field label="예식장" name="venue" defaultValue={invitation.wedding.venue} />
          <Field label="홀" name="hall" defaultValue={invitation.wedding.hall} />
          <Field label="주소" name="address" defaultValue={invitation.wedding.address} />
          <Field label="전화번호" name="tel" defaultValue={invitation.wedding.tel} />
          <Field label="카카오맵 URL" name="kakaoMapUrl" defaultValue={invitation.wedding.mapLinks.kakao} />
          <Field label="네이버지도 URL" name="naverMapUrl" defaultValue={invitation.wedding.mapLinks.naver} />
          <Field label="티맵 URL" name="tmapUrl" defaultValue={invitation.wedding.mapLinks.tmap} />
        </div>
      </section>

      <section className="border border-stone-200 bg-[#fffdf9] p-6">
        <h2 className="font-serif text-3xl">문구</h2>
        <div className="mt-6 grid gap-4">
          <Field label="히어로 상단 문구" name="introKicker" defaultValue={invitation.copy.introKicker} />
          <Field label="초대 제목" name="introTitle" defaultValue={invitation.copy.introTitle} />
          <TextArea label="초대 문구" name="invitation" defaultValue={invitation.copy.invitation} rows={7} />
          <TextArea label="인용문" name="quote" defaultValue={invitation.copy.quote} rows={3} />
          <Field label="인용 출처" name="quoteBy" defaultValue={invitation.copy.quoteBy} />
          <Field label="스토리 제목" name="storyTitle" defaultValue={invitation.copy.storyTitle} />
          <TextArea label="스토리 문구" name="storyBody" defaultValue={invitation.copy.storyBody} rows={3} />
          <TextArea label="오시는 길 안내" name="locationGuide" defaultValue={invitation.copy.locationGuide} rows={4} />
          <TextArea label="계좌 안내 문구" name="accountIntro" defaultValue={invitation.copy.accountIntro} rows={4} />
          <TextArea label="마무리 문구" name="closing" defaultValue={invitation.copy.closing} rows={3} />
        </div>
      </section>

      <div className="sticky bottom-4 z-10 border border-stone-200 bg-white p-4 shadow-lg">
        {state.error ? <p className="mb-3 text-sm text-red-700">{state.error}</p> : null}
        {state.success ? <p className="mb-3 text-sm text-green-700">{state.success}</p> : null}
        <button
          type="submit"
          disabled={!canSave || isPending}
          className="h-12 w-full bg-stone-950 text-sm font-medium tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {isPending ? "저장 중" : canSave ? "변경사항 저장" : "Supabase env 필요"}
        </button>
      </div>
    </form>
  );
}
