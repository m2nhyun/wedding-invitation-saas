"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSession,
  hashAdminCode,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/admin-session";
import { createSupabaseAdminClient, hasSupabaseConfig } from "@/lib/supabase/server";

export type AdminLoginState = {
  error?: string;
};

export type AdminSaveState = {
  error?: string;
  success?: string;
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
  const adminCodeHash = hashAdminCode(adminCode);
  const supabase = createSupabaseAdminClient();
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("slug")
    .eq("admin_code_hash", adminCodeHash)
    .single<{ slug: string }>();

  if (error || !invitation) {
    return {
      error: "관리자 코드가 올바르지 않습니다.",
    };
  }

  await setAdminSession(invitation.slug);
  redirect(`/admin/${invitation.slug}`);
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
