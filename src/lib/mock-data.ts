export type WeddingAccount = {
  side: "groom" | "bride";
  role: string;
  name: string;
  bank: string;
  number: string;
};

export type WeddingGalleryImage = {
  src: string;
  alt: string;
};

export type WeddingTimelineItem = {
  date: string;
  title: string;
  body: string;
  image: string;
};

export type WeddingInvitation = {
  slug: string;
  status: "draft" | "published";
  couple: {
    groom: {
      name: string;
      nameEn: string;
      father: string;
      mother: string;
    };
    bride: {
      name: string;
      nameEn: string;
      father: string;
      mother: string;
    };
  };
  wedding: {
    date: string;
    time: string;
    venue: string;
    hall: string;
    address: string;
    tel: string;
    mapLinks: {
      kakao: string;
      naver: string;
      tmap: string;
    };
  };
  copy: {
    introKicker: string;
    introTitle: string;
    invitation: string;
    quote: string;
    quoteBy: string;
    storyTitle: string;
    storyBody: string;
    locationGuide: string;
    accountIntro: string;
    closing: string;
  };
  images: {
    hero: string;
    intro: string;
    quote: string;
    calendar: string;
    closing: string;
  };
  profiles: {
    groom: string[];
    bride: string[];
  };
  gallery: WeddingGalleryImage[];
  timeline: WeddingTimelineItem[];
  accounts: WeddingAccount[];
};

export const invitations: WeddingInvitation[] = [
  {
    slug: "jjym0818",
    status: "published",
    couple: {
      groom: {
        name: "정준",
        nameEn: "JEONGJOON",
        father: "이갑재",
        mother: "이미옥",
      },
      bride: {
        name: "유민",
        nameEn: "YOOMIN",
        father: "박정현",
        mother: "손명주",
      },
    },
    wedding: {
      date: "2026-07-18",
      time: "17:20",
      venue: "더링크서울 트리뷰트 포트폴리오 호텔",
      hall: "3층 베일리홀",
      address: "서울 구로구 경인로 610",
      tel: "02-852-5000",
      mapLinks: {
        kakao: "https://place.map.kakao.com/869232764",
        naver: "https://naver.me/FqWtKQUF",
        tmap: "https://www.tmap.co.kr",
      },
    },
    copy: {
      introKicker: "Forever begins with a single step",
      introTitle: "저희 결혼합니다",
      invitation:
        "함께 있을 때 가장 나다워지는 사람,\n미소마저 닮아가는 사람을 만나\n푸르른 여름날 새로운 여정을 시작합니다.\n\n바쁘시더라도 편한 마음으로 오셔서\n저희의 첫걸음을 축복해주시면 감사하겠습니다.",
      quote:
        "매일 행복할 순 없지만,\n행복한 것들은 매일 있어.",
      quoteBy: "<곰돌이 푸> 중",
      storyTitle: "우리의 시간",
      storyBody:
        "서로 다른 계절을 지나온 두 사람이\n이제 같은 계절을 함께 걸어가려 합니다.",
      locationGuide:
        "신도림역 인근에 위치해 대중교통 이용이 편리합니다. 주차 공간은 예식 당일 혼잡할 수 있어 가능한 대중교통 이용을 권장드립니다.",
      accountIntro:
        "멀리서도 축하의 마음을 전하고 싶으신 분들을 위해 계좌번호를 안내드립니다. 보내주시는 마음은 소중히 간직하겠습니다.",
      closing:
        "귀한 걸음으로 함께해주시는 모든 분께\n진심으로 감사드립니다.",
    },
    images: {
      hero:
        "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=85",
      intro:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
      quote:
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85",
      calendar:
        "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1200&q=85",
      closing:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    },
    profiles: {
      groom: ["잘 들어주는 사람", "차분한 취향", "운동 러버", "기록을 좋아함"],
      bride: ["웃음이 많은 사람", "따뜻한 취향", "산책 러버", "디테일을 좋아함"],
    },
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 1",
      },
      {
        src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 2",
      },
      {
        src: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 3",
      },
      {
        src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 4",
      },
      {
        src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 5",
      },
      {
        src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 6",
      },
      {
        src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 7",
      },
      {
        src: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85",
        alt: "웨딩 갤러리 사진 8",
      },
    ],
    timeline: [
      {
        date: "2021.08.18",
        title: "첫 만남",
        body: "서툴지만 오래 기억에 남을 대화를 나누었습니다.",
        image:
          "https://images.unsplash.com/photo-1482575832494-771f74bf6857?auto=format&fit=crop&w=900&q=85",
      },
      {
        date: "2023.07.18",
        title: "함께한 계절",
        body: "평범한 하루들이 쌓여 가장 소중한 시간이 되었습니다.",
        image:
          "https://images.unsplash.com/photo-1509610696553-9243c1a6602c?auto=format&fit=crop&w=900&q=85",
      },
      {
        date: "2026.07.18",
        title: "Wedding Day",
        body: "저희의 시작을 따뜻하게 축하해주세요.",
        image:
          "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85",
      },
    ],
    accounts: [
      {
        side: "groom",
        role: "신랑",
        name: "이정준",
        bank: "토스뱅크",
        number: "1000-1534-6615",
      },
      {
        side: "groom",
        role: "아버지",
        name: "이갑재",
        bank: "국민은행",
        number: "476-05-0000-839",
      },
      {
        side: "bride",
        role: "신부",
        name: "박유민",
        bank: "국민은행",
        number: "591902-01-264514",
      },
      {
        side: "bride",
        role: "어머니",
        name: "손명주",
        bank: "우리은행",
        number: "808-191886-02-101",
      },
    ],
  },
];

export function getInvitationBySlug(slug: string) {
  return invitations.find((invitation) => invitation.slug === slug);
}

export function getPrimaryInvitation() {
  return invitations[0];
}
