"use client";

import { useActionState } from "react";
import { saveInvitationAssets, saveInvitationDetails, type AdminSaveState } from "@/app/admin/actions";
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

function ImageUploadField({
  label,
  fileName,
  currentName,
  currentUrl,
}: {
  label: string;
  fileName: string;
  currentName: string;
  currentUrl: string;
}) {
  return (
    <div className="border border-stone-200 bg-white p-4">
      <input type="hidden" name={currentName} value={currentUrl} />
      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
        {currentUrl ? (
          <img src={currentUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">이미지 없음</div>
        )}
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <input
          name={fileName}
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm text-stone-600 file:mr-4 file:h-10 file:border-0 file:bg-stone-950 file:px-4 file:text-sm file:text-white"
        />
      </label>
    </div>
  );
}

export function InvitationEditor({ invitation, canSave }: Props) {
  const [detailsState, detailsFormAction, detailsIsPending] = useActionState(saveInvitationDetails, initialState);
  const [assetsState, assetsFormAction, assetsIsPending] = useActionState(saveInvitationAssets, initialState);
  const accountSlots = Array.from({ length: 6 }, (_, index) => invitation.accounts[index]);

  return (
    <div className="mt-8 space-y-8">
      <form action={detailsFormAction} className="space-y-6">
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

        <div className="border border-stone-200 bg-white p-4 shadow-lg">
          {detailsState.error ? <p className="mb-3 text-sm text-red-700">{detailsState.error}</p> : null}
          {detailsState.success ? <p className="mb-3 text-sm text-green-700">{detailsState.success}</p> : null}
          <button
            type="submit"
            disabled={!canSave || detailsIsPending}
            className="h-12 w-full bg-stone-950 text-sm font-medium tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {detailsIsPending ? "저장 중" : canSave ? "기본 정보 저장" : "Supabase env 필요"}
          </button>
        </div>
      </form>

      <form action={assetsFormAction} className="space-y-6">
        <input type="hidden" name="slug" value={invitation.slug} />
        <section className="border border-stone-200 bg-[#fffdf9] p-6">
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-stone-400">Media</p>
          <h2 className="mt-3 font-serif text-3xl">이미지 URL 관리</h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            업로드한 이미지는 Supabase Storage의 `wedding-media` bucket에 저장되고 공개 페이지에 즉시 반영됩니다.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ImageUploadField label="히어로 이미지" fileName="heroFile" currentName="heroCurrentUrl" currentUrl={invitation.images.hero} />
            <ImageUploadField label="인트로 이미지" fileName="introFile" currentName="introCurrentUrl" currentUrl={invitation.images.intro} />
            <ImageUploadField label="인용문 이미지" fileName="quoteFile" currentName="quoteCurrentUrl" currentUrl={invitation.images.quote} />
            <ImageUploadField label="예식 안내 이미지" fileName="calendarFile" currentName="calendarCurrentUrl" currentUrl={invitation.images.calendar} />
            <ImageUploadField label="마무리 이미지" fileName="closingFile" currentName="closingCurrentUrl" currentUrl={invitation.images.closing} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 8 }, (_, index) => (
              <ImageUploadField
                key={index}
                label={`갤러리 ${index + 1}`}
                fileName={`galleryFile${index + 1}`}
                currentName={`galleryCurrentUrl${index + 1}`}
                currentUrl={invitation.gallery[index]?.src ?? ""}
              />
            ))}
          </div>
        </section>

        <section className="border border-stone-200 bg-[#fffdf9] p-6">
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-stone-400">Accounts</p>
          <h2 className="mt-3 font-serif text-3xl">계좌 정보</h2>
          <div className="mt-6 space-y-5">
            {accountSlots.map((account, index) => (
              <div key={index} className="grid gap-3 border border-stone-200 bg-white p-4 md:grid-cols-[120px_1fr_1fr_1fr_1fr]">
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">구분</span>
                  <select
                    name={`accountSide${index + 1}`}
                    defaultValue={account?.side ?? ""}
                    className="mt-2 h-11 w-full border border-stone-300 bg-white px-3 text-sm outline-none"
                  >
                    <option value="">비움</option>
                    <option value="groom">신랑측</option>
                    <option value="bride">신부측</option>
                  </select>
                </label>
                <Field label="역할" name={`accountRole${index + 1}`} defaultValue={account?.role ?? ""} required={false} />
                <Field label="이름" name={`accountName${index + 1}`} defaultValue={account?.name ?? ""} required={false} />
                <Field label="은행" name={`accountBank${index + 1}`} defaultValue={account?.bank ?? ""} required={false} />
                <Field label="계좌번호" name={`accountNumber${index + 1}`} defaultValue={account?.number ?? ""} required={false} />
              </div>
            ))}
          </div>
        </section>

        <div className="sticky bottom-4 z-10 border border-stone-200 bg-white p-4 shadow-lg">
          {assetsState.error ? <p className="mb-3 text-sm text-red-700">{assetsState.error}</p> : null}
          {assetsState.success ? <p className="mb-3 text-sm text-green-700">{assetsState.success}</p> : null}
          <button
            type="submit"
            disabled={!canSave || assetsIsPending}
            className="h-12 w-full bg-stone-950 text-sm font-medium tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {assetsIsPending ? "저장 중" : canSave ? "이미지/계좌 저장" : "Supabase env 필요"}
          </button>
        </div>
      </form>
    </div>
  );
}
