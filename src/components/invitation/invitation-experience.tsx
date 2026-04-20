"use client";

import { useEffect, useMemo, useState } from "react";
import type { WeddingInvitation } from "@/lib/mock-data";

type Props = {
  invitation: WeddingInvitation;
};

function formatWeddingDate(invitation: WeddingInvitation) {
  const date = new Date(`${invitation.wedding.date}T${invitation.wedding.time}:00`);
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const time = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return {
    date,
    full: `${formatter.format(date)} ${time}`,
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear(),
  };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function IconCopy() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 15V6.8C5 5.8 5.8 5 6.8 5H15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <rect x="4" y="5.5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function InvitationExperience({ invitation }: Props) {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(6);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const weddingDate = useMemo(() => formatWeddingDate(invitation), [invitation]);

  useEffect(() => {
    function tick() {
      const diff = weddingDate.date.getTime() - Date.now();
      const safeDiff = Math.max(diff, 0);
      setRemaining({
        days: Math.floor(safeDiff / 86400000),
        hours: Math.floor((safeDiff % 86400000) / 3600000),
        minutes: Math.floor((safeDiff % 3600000) / 60000),
        seconds: Math.floor((safeDiff % 60000) / 1000),
      });
    }

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [weddingDate.date]);

  useEffect(() => {
    document.body.style.overflow = curtainOpen ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [curtainOpen]);

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function openGoogleCalendar() {
    const start = weddingDate.date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(weddingDate.date.getTime() + 2 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const title = encodeURIComponent(
      `${invitation.couple.groom.name} ${invitation.couple.bride.name} 결혼식`,
    );
    const location = encodeURIComponent(`${invitation.wedding.venue} ${invitation.wedding.address}`);
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const daysInMonth = getDaysInMonth(weddingDate.year, weddingDate.month);
  const firstWeekday = new Date(weddingDate.year, weddingDate.month - 1, 1).getDay();
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, (_, index) => ({ key: `empty-${index}`, day: null })),
    ...Array.from({ length: daysInMonth }, (_, index) => ({ key: `day-${index + 1}`, day: index + 1 })),
  ];

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-stone-900">
      {!curtainOpen ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4efe7] px-8 text-center">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="relative flex max-w-sm flex-col items-center">
            <p className="mb-5 font-serif text-sm tracking-[0.32em] text-stone-500">
              {invitation.couple.groom.nameEn} & {invitation.couple.bride.nameEn}
            </p>
            <h1 className="font-serif text-5xl leading-tight text-stone-950">
              Wedding
              <br />
              Invitation
            </h1>
            <p className="mt-7 whitespace-pre-line text-sm leading-7 text-stone-600">
              {weddingDate.full}
              {"\n"}
              {invitation.wedding.venue}
            </p>
            <button
              type="button"
              onClick={() => setCurtainOpen(true)}
              className="mt-10 h-12 min-w-44 border border-stone-900/20 bg-stone-950 px-7 text-sm font-medium tracking-[0.18em] text-white shadow-sm transition hover:bg-stone-800"
            >
              초대장 열기
            </button>
          </div>
        </section>
      ) : null}

      <article className="mx-auto min-h-screen max-w-[520px] bg-[#fffdf9] shadow-[0_0_60px_rgba(74,54,35,0.12)]">
        <section className="relative min-h-[100svh] overflow-hidden">
          <img
            src={invitation.images.hero}
            alt={`${invitation.couple.groom.name} ${invitation.couple.bride.name} 웨딩 사진`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/0 to-black/65" />
          <div className="relative flex min-h-[100svh] flex-col justify-between px-7 py-9 text-white">
            <p className="font-serif text-xs tracking-[0.32em] opacity-90">
              {invitation.copy.introKicker}
            </p>
            <div className="text-center">
              <p className="mb-5 flex flex-col items-center font-serif text-5xl leading-none">
                <span>{invitation.couple.groom.nameEn}</span>
                <span className="my-2 text-3xl italic opacity-70">&</span>
                <span>{invitation.couple.bride.nameEn}</span>
              </p>
              <p className="text-sm leading-7 tracking-[0.12em]">{weddingDate.full}</p>
              <p className="mt-1 text-sm tracking-[0.08em] opacity-85">
                {invitation.wedding.venue} {invitation.wedding.hall}
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 text-center">
          <p className="mb-4 font-serif text-sm uppercase tracking-[0.28em] text-stone-400">Invitation</p>
          <h2 className="font-serif text-3xl text-stone-950">{invitation.copy.introTitle}</h2>
          <p className="mx-auto mt-9 whitespace-pre-line text-[15px] leading-9 text-stone-600">
            {invitation.copy.invitation}
          </p>
          <div className="mx-auto my-10 h-px w-10 bg-stone-300" />
          <div className="space-y-3 text-sm leading-7 text-stone-600">
            <p>
              {invitation.couple.groom.father} · {invitation.couple.groom.mother}
              <span className="mx-2 text-stone-400">의 아들</span>
              <strong className="font-medium text-stone-900">{invitation.couple.groom.name}</strong>
            </p>
            <p>
              {invitation.couple.bride.father} · {invitation.couple.bride.mother}
              <span className="mx-2 text-stone-400">의 딸</span>
              <strong className="font-medium text-stone-900">{invitation.couple.bride.name}</strong>
            </p>
          </div>
        </section>

        <section className="bg-[#eee4d6] px-8 py-16">
          <div className="overflow-hidden rounded-sm">
            <img src={invitation.images.intro} alt="두 사람의 분위기 사진" className="h-[420px] w-full object-cover" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-stone-300/70 pr-4">
              <p className="font-serif text-lg">신랑 {invitation.couple.groom.name}</p>
              <ul className="mt-5 space-y-2 text-sm text-stone-600">
                {invitation.profiles.groom.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="pl-4">
              <p className="font-serif text-lg">신부 {invitation.couple.bride.name}</p>
              <ul className="mt-5 space-y-2 text-sm text-stone-600">
                {invitation.profiles.bride.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-8 py-20 text-center">
          <img src={invitation.images.quote} alt="인용문 배경 사진" className="h-72 w-full object-cover" />
          <blockquote className="mt-10 whitespace-pre-line font-serif text-2xl leading-relaxed text-stone-900">
            {invitation.copy.quote}
          </blockquote>
          <p className="mt-5 text-sm text-stone-500">{invitation.copy.quoteBy}</p>
        </section>

        <section className="bg-[#f3ede4] px-7 py-18">
          <div className="text-center">
            <p className="font-serif text-sm uppercase tracking-[0.28em] text-stone-400">Wedding Day</p>
            <h2 className="mt-4 font-serif text-3xl">예식 안내</h2>
            <p className="mt-6 text-sm leading-7 text-stone-600">
              {weddingDate.full}
              <br />
              {invitation.wedding.venue} {invitation.wedding.hall}
            </p>
          </div>

          <div className="mt-10 bg-[#fffdf9] p-5 shadow-sm">
            <div className="mb-5 flex items-end justify-between">
              <p className="font-serif text-3xl">{weddingDate.month}월</p>
              <button
                type="button"
                onClick={openGoogleCalendar}
                className="inline-flex h-10 items-center gap-2 border border-stone-300 px-3 text-xs font-medium text-stone-700"
              >
                <IconCalendar />
                일정 추가
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-stone-400">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <span key={day} className="py-2">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
              {calendarCells.map((cell) => (
                <span
                  key={cell.key}
                  className={
                    cell.day === weddingDate.day
                      ? "mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-xs font-medium text-white"
                      : "flex h-10 items-center justify-center text-stone-600"
                  }
                >
                  {cell.day === weddingDate.day ? `${cell.day}` : cell.day}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-3 text-center">
            {[
              ["Days", remaining.days],
              ["Hours", remaining.hours],
              ["Min", remaining.minutes],
              ["Sec", remaining.seconds],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#fffdf9] py-4 shadow-sm">
                <p className="font-serif text-2xl text-stone-950">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-7 py-20">
          <div className="text-center">
            <p className="font-serif text-sm uppercase tracking-[0.28em] text-stone-400">Gallery</p>
            <h2 className="mt-4 font-serif text-3xl">우리의 순간들</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-2">
            {invitation.gallery.slice(0, visibleGalleryCount).map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(index)}
                className="group aspect-square overflow-hidden bg-stone-100"
                aria-label={`${index + 1}번째 갤러리 사진 크게 보기`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
          {visibleGalleryCount < invitation.gallery.length ? (
            <button
              type="button"
              onClick={() => setVisibleGalleryCount(invitation.gallery.length)}
              className="mx-auto mt-8 block h-11 min-w-32 border border-stone-300 px-6 text-sm text-stone-700"
            >
              더 보기
            </button>
          ) : null}
        </section>

        <section className="bg-[#eee4d6] px-8 py-20">
          <div className="text-center">
            <p className="font-serif text-sm uppercase tracking-[0.28em] text-stone-500">Our Time</p>
            <h2 className="mt-4 font-serif text-3xl">{invitation.copy.storyTitle}</h2>
            <p className="mt-6 whitespace-pre-line text-sm leading-8 text-stone-600">{invitation.copy.storyBody}</p>
          </div>
          <div className="mt-10 space-y-7">
            {invitation.timeline.map((item) => (
              <div key={item.date} className="grid grid-cols-[112px_1fr] gap-5">
                <img src={item.image} alt={item.title} className="h-36 w-28 object-cover" />
                <div className="flex flex-col justify-center">
                  <p className="text-xs tracking-[0.18em] text-stone-500">{item.date}</p>
                  <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-8 py-20">
          <div className="text-center">
            <p className="font-serif text-sm uppercase tracking-[0.28em] text-stone-400">Location</p>
            <h2 className="mt-4 font-serif text-3xl">오시는 길</h2>
            <p className="mt-7 font-medium">{invitation.wedding.venue}</p>
            <p className="mt-1 text-sm text-stone-500">
              {invitation.wedding.hall} · {invitation.wedding.address}
            </p>
          </div>
          <div className="mt-9 bg-[#f2eee7] p-5">
            <img src={invitation.images.calendar} alt="예식 장소 분위기 사진" className="h-56 w-full object-cover" />
            <p className="mt-5 text-sm leading-7 text-stone-600">{invitation.copy.locationGuide}</p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ["카카오맵", invitation.wedding.mapLinks.kakao],
              ["네이버지도", invitation.wedding.mapLinks.naver],
              ["티맵", invitation.wedding.mapLinks.tmap],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-1 border border-stone-300 text-xs text-stone-700"
              >
                <IconMap />
                {label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => copyText("주소", invitation.wedding.address)}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 bg-stone-950 text-sm text-white"
          >
            <IconCopy />
            주소 복사
          </button>
        </section>

        <section className="bg-[#f3ede4] px-8 py-20">
          <div className="text-center">
            <p className="font-serif text-sm uppercase tracking-[0.28em] text-stone-400">Account</p>
            <h2 className="mt-4 font-serif text-3xl">마음 전하실 곳</h2>
            <p className="mt-7 text-sm leading-8 text-stone-600">{invitation.copy.accountIntro}</p>
          </div>
          <div className="mt-10 space-y-8">
            {(["groom", "bride"] as const).map((side) => (
              <div key={side}>
                <p className="mb-3 font-serif text-xl">{side === "groom" ? "신랑 측" : "신부 측"}</p>
                <div className="space-y-2">
                  {invitation.accounts
                    .filter((account) => account.side === side)
                    .map((account) => (
                      <div key={`${account.role}-${account.number}`} className="bg-[#fffdf9] p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-stone-950">{account.role} {account.name}</p>
                            <p className="mt-1 text-sm text-stone-500">
                              {account.bank} {account.number}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              copyText(account.role, `${account.bank} ${account.number} ${account.name}`)
                            }
                            className="inline-flex h-9 items-center gap-1 border border-stone-300 px-3 text-xs text-stone-700"
                          >
                            <IconCopy />
                            복사
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative px-8 py-20 text-center text-white">
          <img src={invitation.images.closing} alt="마무리 사진" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative">
            <p className="whitespace-pre-line font-serif text-2xl leading-relaxed">{invitation.copy.closing}</p>
            <p className="mt-8 text-sm tracking-[0.18em]">
              {invitation.couple.groom.nameEn} & {invitation.couple.bride.nameEn}
            </p>
          </div>
        </section>
      </article>

      {activeImage !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-5">
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute right-4 top-4 h-11 w-11 text-3xl leading-none text-white/80"
            aria-label="사진 닫기"
          >
            ×
          </button>
          <img
            src={invitation.gallery[activeImage].src}
            alt={invitation.gallery[activeImage].alt}
            className="max-h-[86svh] max-w-full object-contain"
          />
        </div>
      ) : null}

      {copied ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-stone-950 px-5 py-3 text-sm text-white shadow-lg">
          {copied} 복사 완료
        </div>
      ) : null}
    </main>
  );
}
