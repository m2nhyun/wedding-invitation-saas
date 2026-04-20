insert into public.invitations (
  slug,
  status,
  groom_name,
  groom_name_en,
  groom_father,
  groom_mother,
  bride_name,
  bride_name_en,
  bride_father,
  bride_mother,
  wedding_date,
  wedding_time,
  venue,
  hall,
  address,
  tel,
  kakao_map_url,
  naver_map_url,
  tmap_url,
  copy,
  profiles
) values (
  'jjym0818',
  'published',
  '정준',
  'JEONGJOON',
  '이갑재',
  '이미옥',
  '유민',
  'YOOMIN',
  '박정현',
  '손명주',
  '2026-07-18',
  '17:20',
  '더링크서울 트리뷰트 포트폴리오 호텔',
  '3층 베일리홀',
  '서울 구로구 경인로 610',
  '02-852-5000',
  'https://place.map.kakao.com/869232764',
  'https://naver.me/FqWtKQUF',
  'https://www.tmap.co.kr',
  '{
    "introKicker": "Forever begins with a single step",
    "introTitle": "저희 결혼합니다",
    "invitation": "함께 있을 때 가장 나다워지는 사람,\n미소마저 닮아가는 사람을 만나\n푸르른 여름날 새로운 여정을 시작합니다.\n\n바쁘시더라도 편한 마음으로 오셔서\n저희의 첫걸음을 축복해주시면 감사하겠습니다.",
    "quote": "매일 행복할 순 없지만,\n행복한 것들은 매일 있어.",
    "quoteBy": "<곰돌이 푸> 중",
    "storyTitle": "우리의 시간",
    "storyBody": "서로 다른 계절을 지나온 두 사람이\n이제 같은 계절을 함께 걸어가려 합니다.",
    "locationGuide": "신도림역 인근에 위치해 대중교통 이용이 편리합니다. 주차 공간은 예식 당일 혼잡할 수 있어 가능한 대중교통 이용을 권장드립니다.",
    "accountIntro": "멀리서도 축하의 마음을 전하고 싶으신 분들을 위해 계좌번호를 안내드립니다. 보내주시는 마음은 소중히 간직하겠습니다.",
    "closing": "귀한 걸음으로 함께해주시는 모든 분께\n진심으로 감사드립니다."
  }'::jsonb,
  '{
    "groom": ["잘 들어주는 사람", "차분한 취향", "운동 러버", "기록을 좋아함"],
    "bride": ["웃음이 많은 사람", "따뜻한 취향", "산책 러버", "디테일을 좋아함"]
  }'::jsonb
) on conflict (slug) do update set
  status = excluded.status,
  groom_name = excluded.groom_name,
  groom_name_en = excluded.groom_name_en,
  groom_father = excluded.groom_father,
  groom_mother = excluded.groom_mother,
  bride_name = excluded.bride_name,
  bride_name_en = excluded.bride_name_en,
  bride_father = excluded.bride_father,
  bride_mother = excluded.bride_mother,
  wedding_date = excluded.wedding_date,
  wedding_time = excluded.wedding_time,
  venue = excluded.venue,
  hall = excluded.hall,
  address = excluded.address,
  tel = excluded.tel,
  kakao_map_url = excluded.kakao_map_url,
  naver_map_url = excluded.naver_map_url,
  tmap_url = excluded.tmap_url,
  copy = excluded.copy,
  profiles = excluded.profiles,
  updated_at = now();

with selected_invitation as (
  select id from public.invitations where slug = 'jjym0818'
)
insert into public.invitation_media (invitation_id, type, public_url, storage_path, alt, sort_order)
select id, type, public_url, storage_path, alt, sort_order
from selected_invitation,
(values
  ('hero', 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=85', 'external/hero.jpg', '정준 유민 웨딩 사진', 0),
  ('intro', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'external/intro.jpg', '두 사람의 분위기 사진', 0),
  ('quote', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85', 'external/quote.jpg', '인용문 배경 사진', 0),
  ('calendar', 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1200&q=85', 'external/calendar.jpg', '예식 장소 분위기 사진', 0),
  ('closing', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85', 'external/closing.jpg', '마무리 사진', 0),
  ('gallery', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=85', 'external/gallery-001.jpg', '웨딩 갤러리 사진 1', 1),
  ('gallery', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85', 'external/gallery-002.jpg', '웨딩 갤러리 사진 2', 2),
  ('gallery', 'https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?auto=format&fit=crop&w=900&q=85', 'external/gallery-003.jpg', '웨딩 갤러리 사진 3', 3),
  ('gallery', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85', 'external/gallery-004.jpg', '웨딩 갤러리 사진 4', 4),
  ('gallery', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85', 'external/gallery-005.jpg', '웨딩 갤러리 사진 5', 5),
  ('gallery', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85', 'external/gallery-006.jpg', '웨딩 갤러리 사진 6', 6),
  ('gallery', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85', 'external/gallery-007.jpg', '웨딩 갤러리 사진 7', 7),
  ('gallery', 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=900&q=85', 'external/gallery-008.jpg', '웨딩 갤러리 사진 8', 8)
) as media(type, public_url, storage_path, alt, sort_order)
on conflict do nothing;

with selected_invitation as (
  select id from public.invitations where slug = 'jjym0818'
)
insert into public.invitation_accounts (invitation_id, side, role, name, bank, number, sort_order)
select id, side, role, name, bank, number, sort_order
from selected_invitation,
(values
  ('groom', '신랑', '이정준', '토스뱅크', '1000-1534-6615', 1),
  ('groom', '아버지', '이갑재', '국민은행', '476-05-0000-839', 2),
  ('bride', '신부', '박유민', '국민은행', '591902-01-264514', 1),
  ('bride', '어머니', '손명주', '우리은행', '808-191886-02-101', 2)
) as accounts(side, role, name, bank, number, sort_order)
on conflict do nothing;

with selected_invitation as (
  select id from public.invitations where slug = 'jjym0818'
)
insert into public.invitation_timeline_items (invitation_id, date_label, title, body, image_url, sort_order)
select id, date_label, title, body, image_url, sort_order
from selected_invitation,
(values
  ('2021.08.18', '첫 만남', '서툴지만 오래 기억에 남을 대화를 나누었습니다.', 'https://images.unsplash.com/photo-1482575832494-771f74bf6857?auto=format&fit=crop&w=900&q=85', 1),
  ('2023.07.18', '함께한 계절', '평범한 하루들이 쌓여 가장 소중한 시간이 되었습니다.', 'https://images.unsplash.com/photo-1509610696553-9243c1a6602c?auto=format&fit=crop&w=900&q=85', 2),
  ('2026.07.18', 'Wedding Day', '저희의 시작을 따뜻하게 축하해주세요.', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85', 3)
) as timeline(date_label, title, body, image_url, sort_order)
on conflict do nothing;
