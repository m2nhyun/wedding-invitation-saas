"use server";

import { randomBytes, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSession,
  getAdminCodeHashCandidates,
  hashAdminCode,
  isAdminAuthenticated,
  isSuperAdminAuthenticated,
  setAdminSession,
  setSuperAdminSession,
} from "@/lib/admin-session";
import { getOptionalEnv } from "@/lib/env";
import { createSupabaseAdminClient, hasSupabaseConfig } from "@/lib/supabase/server";

export type AdminLoginState = {
  error?: string;
};

export type AdminSaveState = {
  error?: string;
  success?: string;
};

export type AdminCreateInvitationState = {
  error?: string;
  success?: string;
  slug?: string;
  adminCode?: string;
};

export type SuperAdminLoginState = {
  error?: string;
};

export type SuperAdminResetCodeState = {
  error?: string;
  success?: string;
  slug?: string;
  adminCode?: string;
};

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!hasSupabaseConfig()) {
    return {
      error: "Supabase 환경변수가 없어 로그인할 수 없습니다.",
    };
  }

  const adminCode = String(formData.get("password") ?? "").trim();
  const adminCodeHashes = getAdminCodeHashCandidates(adminCode);
  const supabase = createSupabaseAdminClient();
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("slug")
    .in("admin_code_hash", adminCodeHashes)
    .single<{ slug: string }>();

  if (error || !invitation) {
    return {
      error: "관리자 코드가 올바르지 않습니다.",
    };
  }

  await setAdminSession(invitation.slug);
  redirect(`/admin/${invitation.slug}`);
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export async function loginSuperAdmin(
  _previousState: SuperAdminLoginState,
  formData: FormData,
): Promise<SuperAdminLoginState> {
  const expectedEmail = getOptionalEnv("SUPER_ADMIN_EMAIL");
  const expectedPassword = getOptionalEnv("SUPER_ADMIN_PASSWORD");

  if (!expectedEmail || !expectedPassword) {
    return {
      error: "슈퍼 관리자 환경변수가 설정되지 않았습니다.",
    };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!safeEqual(email, expectedEmail.trim().toLowerCase()) || !safeEqual(password, expectedPassword)) {
    return {
      error: "이메일 또는 비밀번호가 올바르지 않습니다.",
    };
  }

  await setSuperAdminSession();
  redirect("/admin/super");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

function getRequiredFormValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function createAdminCode(slug: string) {
  return `${slug}-${randomBytes(4).toString("hex")}`;
}

async function requireAdminForMutation(slug: string) {
  if (!(await isAdminAuthenticated(slug))) {
    return {
      error: "관리자 로그인이 필요합니다.",
    };
  }

  return null;
}

export async function saveInvitationDetails(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  const slug = getRequiredFormValue(formData, "slug");
  const authError = await requireAdminForMutation(slug);
  if (authError) {
    return authError;
  }

  if (!hasSupabaseConfig()) {
    return {
      error: "Supabase 환경변수가 없어 저장할 수 없습니다.",
    };
  }

  const payload = {
    status: getRequiredFormValue(formData, "status"),
    groom_name: getRequiredFormValue(formData, "groomName"),
    groom_name_en: getRequiredFormValue(formData, "groomNameEn"),
    groom_father: getRequiredFormValue(formData, "groomFather"),
    groom_mother: getRequiredFormValue(formData, "groomMother"),
    bride_name: getRequiredFormValue(formData, "brideName"),
    bride_name_en: getRequiredFormValue(formData, "brideNameEn"),
    bride_father: getRequiredFormValue(formData, "brideFather"),
    bride_mother: getRequiredFormValue(formData, "brideMother"),
    wedding_date: getRequiredFormValue(formData, "weddingDate"),
    wedding_time: getRequiredFormValue(formData, "weddingTime"),
    venue: getRequiredFormValue(formData, "venue"),
    hall: getRequiredFormValue(formData, "hall"),
    address: getRequiredFormValue(formData, "address"),
    tel: getRequiredFormValue(formData, "tel"),
    kakao_map_url: getRequiredFormValue(formData, "kakaoMapUrl"),
    naver_map_url: getRequiredFormValue(formData, "naverMapUrl"),
    tmap_url: getRequiredFormValue(formData, "tmapUrl"),
    copy: {
      introKicker: getRequiredFormValue(formData, "introKicker"),
      introTitle: getRequiredFormValue(formData, "introTitle"),
      invitation: getRequiredFormValue(formData, "invitation"),
      quote: getRequiredFormValue(formData, "quote"),
      quoteBy: getRequiredFormValue(formData, "quoteBy"),
      storyTitle: getRequiredFormValue(formData, "storyTitle"),
      storyBody: getRequiredFormValue(formData, "storyBody"),
      locationGuide: getRequiredFormValue(formData, "locationGuide"),
      accountIntro: getRequiredFormValue(formData, "accountIntro"),
      closing: getRequiredFormValue(formData, "closing"),
    },
    updated_at: new Date().toISOString(),
  };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("invitations").update(payload).eq("slug", slug);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/w/${slug}`);
  revalidatePath(`/admin/${slug}`);

  return {
    success: "저장되었습니다.",
  };
}

export async function createInvitation(
  _previousState: AdminCreateInvitationState,
  formData: FormData,
): Promise<AdminCreateInvitationState> {
  const sourceSlug = getRequiredFormValue(formData, "sourceSlug");
  const authError = await requireAdminForMutation(sourceSlug);
  if (authError) {
    return authError;
  }

  if (!hasSupabaseConfig()) {
    return {
      error: "Supabase 환경변수가 없어 생성할 수 없습니다.",
    };
  }

  const slug = normalizeSlug(getRequiredFormValue(formData, "newSlug"));
  if (slug.length < 3) {
    return {
      error: "slug는 영문/숫자/하이픈으로 3자 이상이어야 합니다.",
    };
  }

  const adminCode = createAdminCode(slug);
  const adminCodeHash = hashAdminCode(adminCode);
  const groomName = getRequiredFormValue(formData, "newGroomName");
  const brideName = getRequiredFormValue(formData, "newBrideName");
  const weddingDate = getRequiredFormValue(formData, "newWeddingDate");

  const supabase = createSupabaseAdminClient();
  const { data: source, error: sourceError } = await supabase
    .from("invitations")
    .select(
      `
        *,
        invitation_media(type, public_url, storage_path, alt, sort_order),
        invitation_accounts(side, role, name, bank, number, sort_order),
        invitation_timeline_items(date_label, title, body, image_url, sort_order)
      `,
    )
    .eq("slug", sourceSlug)
    .single();

  if (sourceError || !source) {
    return {
      error: sourceError?.message ?? "원본 초대장을 찾을 수 없습니다.",
    };
  }

  const { data: created, error: insertError } = await supabase
    .from("invitations")
    .insert({
      slug,
      status: "draft",
      admin_code_hash: adminCodeHash,
      groom_name: groomName,
      groom_name_en: groomName,
      groom_father: source.groom_father ?? "",
      groom_mother: source.groom_mother ?? "",
      bride_name: brideName,
      bride_name_en: brideName,
      bride_father: source.bride_father ?? "",
      bride_mother: source.bride_mother ?? "",
      wedding_date: weddingDate,
      wedding_time: source.wedding_time ?? "12:00",
      venue: source.venue ?? "예식장명을 입력해주세요",
      hall: source.hall ?? "",
      address: source.address ?? "",
      tel: source.tel ?? "",
      kakao_map_url: source.kakao_map_url ?? "#",
      naver_map_url: source.naver_map_url ?? "#",
      tmap_url: source.tmap_url ?? "#",
      copy: source.copy,
      profiles: source.profiles,
    })
    .select("id")
    .single<{ id: string }>();

  if (insertError || !created) {
    return {
      error: insertError?.message ?? "초대장을 생성하지 못했습니다.",
    };
  }

  const mediaRows = (source.invitation_media ?? []).map(
    (media: {
      type: string;
      public_url: string;
      storage_path: string;
      alt: string | null;
      sort_order: number;
    }) => ({
      invitation_id: created.id,
      type: media.type,
      public_url: media.public_url,
      storage_path: media.storage_path,
      alt: media.alt,
      sort_order: media.sort_order,
    }),
  );

  if (mediaRows.length > 0) {
    const { error } = await supabase.from("invitation_media").insert(mediaRows);
    if (error) {
      return {
        error: error.message,
      };
    }
  }

  const accountRows = (source.invitation_accounts ?? []).map(
    (account: {
      side: "groom" | "bride";
      role: string;
      name: string;
      bank: string;
      number: string;
      sort_order: number;
    }) => ({
      invitation_id: created.id,
      side: account.side,
      role: account.role,
      name: account.name,
      bank: account.bank,
      number: account.number,
      sort_order: account.sort_order,
    }),
  );

  if (accountRows.length > 0) {
    const { error } = await supabase.from("invitation_accounts").insert(accountRows);
    if (error) {
      return {
        error: error.message,
      };
    }
  }

  const timelineRows = (source.invitation_timeline_items ?? []).map(
    (item: {
      date_label: string | null;
      title: string;
      body: string | null;
      image_url: string | null;
      sort_order: number;
    }) => ({
      invitation_id: created.id,
      date_label: item.date_label,
      title: item.title,
      body: item.body,
      image_url: item.image_url,
      sort_order: item.sort_order,
    }),
  );

  if (timelineRows.length > 0) {
    const { error } = await supabase.from("invitation_timeline_items").insert(timelineRows);
    if (error) {
      return {
        error: error.message,
      };
    }
  }

  revalidatePath(`/admin/${sourceSlug}`);

  return {
    success: "새 초대장이 생성되었습니다. 관리자 코드는 지금만 표시됩니다.",
    slug,
    adminCode,
  };
}

export async function resetInvitationAdminCode(
  _previousState: SuperAdminResetCodeState,
  formData: FormData,
): Promise<SuperAdminResetCodeState> {
  if (!(await isSuperAdminAuthenticated())) {
    return {
      error: "슈퍼 관리자 로그인이 필요합니다.",
    };
  }

  if (!hasSupabaseConfig()) {
    return {
      error: "Supabase 환경변수가 없어 재발급할 수 없습니다.",
    };
  }

  const slug = getRequiredFormValue(formData, "slug");
  const adminCode = createAdminCode(slug);
  const adminCodeHash = hashAdminCode(adminCode);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invitations")
    .update({
      admin_code_hash: adminCodeHash,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select("slug")
    .single<{ slug: string }>();

  if (error || !data) {
    return {
      error: error?.message ?? "초대장을 찾을 수 없습니다.",
    };
  }

  revalidatePath("/admin/super");
  revalidatePath(`/admin/${slug}`);

  return {
    success: "관리자 코드가 재발급되었습니다.",
    slug,
    adminCode,
  };
}

function getOptionalFormValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function saveInvitationAssets(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  const slug = getRequiredFormValue(formData, "slug");
  const authError = await requireAdminForMutation(slug);
  if (authError) {
    return authError;
  }

  if (!hasSupabaseConfig()) {
    return {
      error: "Supabase 환경변수가 없어 저장할 수 없습니다.",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .single<{ id: string }>();

  if (invitationError || !invitation) {
    return {
      error: invitationError?.message ?? "초대장을 찾을 수 없습니다.",
    };
  }

  const mediaInputs: Array<{
    type: string;
    fileKey: string;
    currentKey: string;
    alt: string;
    sortOrder: number;
  }> = [
    { type: "hero", fileKey: "heroFile", currentKey: "heroCurrentUrl", alt: "히어로 이미지", sortOrder: 0 },
    { type: "intro", fileKey: "introFile", currentKey: "introCurrentUrl", alt: "인트로 이미지", sortOrder: 0 },
    { type: "quote", fileKey: "quoteFile", currentKey: "quoteCurrentUrl", alt: "인용문 이미지", sortOrder: 0 },
    {
      type: "calendar",
      fileKey: "calendarFile",
      currentKey: "calendarCurrentUrl",
      alt: "예식 안내 이미지",
      sortOrder: 0,
    },
    {
      type: "closing",
      fileKey: "closingFile",
      currentKey: "closingCurrentUrl",
      alt: "마무리 이미지",
      sortOrder: 0,
    },
    ...Array.from({ length: 8 }, (_, index) => ({
      type: "gallery",
      fileKey: `galleryFile${index + 1}`,
      currentKey: `galleryCurrentUrl${index + 1}`,
      alt: `웨딩 갤러리 사진 ${index + 1}`,
      sortOrder: index + 1,
    })),
  ];

  const mediaRows = (
    await Promise.all(
      mediaInputs.map(async ({ type, fileKey, currentKey, alt, sortOrder }) => {
        const file = formData.get(fileKey);
        const currentUrl = getOptionalFormValue(formData, currentKey);
        let publicUrl = currentUrl;
        let storagePath = currentUrl?.startsWith("http") ? `external/${type}-${sortOrder}.jpg` : currentUrl;

        if (file instanceof File && file.size > 0) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
          storagePath = `invitations/${invitation.id}/${type}/${Date.now()}-${sortOrder}-${safeName}`;
          const { error: uploadError } = await supabase.storage
            .from("wedding-media")
            .upload(storagePath, file, {
              upsert: true,
              contentType: file.type || "application/octet-stream",
            });

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          publicUrl = supabase.storage.from("wedding-media").getPublicUrl(storagePath).data.publicUrl;
        }

        if (!publicUrl || !storagePath) {
          return undefined;
        }

        return {
          invitation_id: invitation.id,
          type,
          public_url: publicUrl,
          storage_path: storagePath,
          alt,
          sort_order: sortOrder,
        };
      }),
    )
  ).filter((row) => Boolean(row));

  const accountRows = Array.from({ length: 6 }, (_, index) => {
    const slot = index + 1;
    const side = getOptionalFormValue(formData, `accountSide${slot}`);
    const role = getOptionalFormValue(formData, `accountRole${slot}`);
    const name = getOptionalFormValue(formData, `accountName${slot}`);
    const bank = getOptionalFormValue(formData, `accountBank${slot}`);
    const number = getOptionalFormValue(formData, `accountNumber${slot}`);

    if (!side || !role || !name || !bank || !number) {
      return undefined;
    }

    return {
      invitation_id: invitation.id,
      side,
      role,
      name,
      bank,
      number,
      sort_order: slot,
    };
  }).filter((row) => Boolean(row));

  const { error: mediaDeleteError } = await supabase
    .from("invitation_media")
    .delete()
    .eq("invitation_id", invitation.id);

  if (mediaDeleteError) {
    return {
      error: mediaDeleteError.message,
    };
  }

  if (mediaRows.length > 0) {
    const { error: mediaInsertError } = await supabase.from("invitation_media").insert(mediaRows);

    if (mediaInsertError) {
      return {
        error: mediaInsertError.message,
      };
    }
  }

  const { error: accountsDeleteError } = await supabase
    .from("invitation_accounts")
    .delete()
    .eq("invitation_id", invitation.id);

  if (accountsDeleteError) {
    return {
      error: accountsDeleteError.message,
    };
  }

  if (accountRows.length > 0) {
    const { error: accountsInsertError } = await supabase.from("invitation_accounts").insert(accountRows);

    if (accountsInsertError) {
      return {
        error: accountsInsertError.message,
      };
    }
  }

  revalidatePath(`/w/${slug}`);
  revalidatePath(`/admin/${slug}`);

  return {
    success: "이미지와 계좌 정보가 저장되었습니다.",
  };
}
