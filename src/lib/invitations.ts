import type { WeddingAccount, WeddingGalleryImage, WeddingInvitation, WeddingTimelineItem } from "@/lib/mock-data";
import { getInvitationBySlug as getMockInvitationBySlug, getPrimaryInvitation, invitations } from "@/lib/mock-data";
import { createSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase/server";

export type InvitationRow = {
  id: string;
  slug: string;
  admin_code_hash?: string | null;
  status: WeddingInvitation["status"];
  groom_name: string;
  groom_name_en: string | null;
  groom_father: string | null;
  groom_mother: string | null;
  bride_name: string;
  bride_name_en: string | null;
  bride_father: string | null;
  bride_mother: string | null;
  wedding_date: string;
  wedding_time: string;
  venue: string;
  hall: string | null;
  address: string | null;
  tel: string | null;
  kakao_map_url: string | null;
  naver_map_url: string | null;
  tmap_url: string | null;
  copy: WeddingInvitation["copy"];
  profiles: WeddingInvitation["profiles"];
  invitation_media: Array<{
    type: string;
    public_url: string;
    alt: string | null;
    sort_order: number;
  }>;
  invitation_accounts: Array<{
    side: WeddingAccount["side"];
    role: string;
    name: string;
    bank: string;
    number: string;
    sort_order: number;
  }>;
  invitation_timeline_items: Array<{
    date_label: string | null;
    title: string;
    body: string | null;
    image_url: string | null;
    sort_order: number;
  }>;
};

const fallbackImages = getPrimaryInvitation().images;

function getMediaUrl(media: InvitationRow["invitation_media"], type: string, fallback: string) {
  return (
    media
      .filter((item) => item.type === type)
      .sort((a, b) => a.sort_order - b.sort_order)[0]?.public_url ?? fallback
  );
}

export function mapInvitationRow(row: InvitationRow): WeddingInvitation {
  const media = row.invitation_media ?? [];
  const gallery: WeddingGalleryImage[] = media
    .filter((item) => item.type === "gallery")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item, index) => ({
      src: item.public_url,
      alt: item.alt ?? `웨딩 갤러리 사진 ${index + 1}`,
    }));

  const timeline: WeddingTimelineItem[] = (row.invitation_timeline_items ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      date: item.date_label ?? "",
      title: item.title,
      body: item.body ?? "",
      image: item.image_url ?? fallbackImages.intro,
    }));

  return {
    slug: row.slug,
    status: row.status,
    couple: {
      groom: {
        name: row.groom_name,
        nameEn: row.groom_name_en ?? row.groom_name,
        father: row.groom_father ?? "",
        mother: row.groom_mother ?? "",
      },
      bride: {
        name: row.bride_name,
        nameEn: row.bride_name_en ?? row.bride_name,
        father: row.bride_father ?? "",
        mother: row.bride_mother ?? "",
      },
    },
    wedding: {
      date: row.wedding_date,
      time: row.wedding_time.slice(0, 5),
      venue: row.venue,
      hall: row.hall ?? "",
      address: row.address ?? "",
      tel: row.tel ?? "",
      mapLinks: {
        kakao: row.kakao_map_url ?? "#",
        naver: row.naver_map_url ?? "#",
        tmap: row.tmap_url ?? "#",
      },
    },
    copy: row.copy,
    images: {
      hero: getMediaUrl(media, "hero", fallbackImages.hero),
      intro: getMediaUrl(media, "intro", fallbackImages.intro),
      quote: getMediaUrl(media, "quote", fallbackImages.quote),
      calendar: getMediaUrl(media, "calendar", fallbackImages.calendar),
      closing: getMediaUrl(media, "closing", fallbackImages.closing),
    },
    profiles: row.profiles,
    gallery: gallery.length > 0 ? gallery : getPrimaryInvitation().gallery,
    timeline: timeline.length > 0 ? timeline : getPrimaryInvitation().timeline,
    accounts: (row.invitation_accounts ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((account) => ({
        side: account.side,
        role: account.role,
        name: account.name,
        bank: account.bank,
        number: account.number,
      })),
  };
}

export function getStaticInvitationParams() {
  return invitations.map((invitation) => ({
    slug: invitation.slug,
  }));
}

export async function getInvitationBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return getMockInvitationBySlug(slug);
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("invitations")
    .select(
      `
        *,
        invitation_media(type, public_url, alt, sort_order),
        invitation_accounts(side, role, name, bank, number, sort_order),
        invitation_timeline_items(date_label, title, body, image_url, sort_order)
      `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single<InvitationRow>();

  if (error || !data) {
    return undefined;
  }

  return mapInvitationRow(data);
}

export async function getAdminInvitationBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return getMockInvitationBySlug(slug);
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("invitations")
    .select(
      `
        *,
        invitation_media(type, public_url, alt, sort_order),
        invitation_accounts(side, role, name, bank, number, sort_order),
        invitation_timeline_items(date_label, title, body, image_url, sort_order)
      `,
    )
    .eq("slug", slug)
    .single<InvitationRow>();

  if (error || !data) {
    return undefined;
  }

  return mapInvitationRow(data);
}
