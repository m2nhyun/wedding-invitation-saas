"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearAdminSession, setAdminSession, verifyAdminPassword } from "@/lib/admin-session";
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
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    return {
      error: "비밀번호가 올바르지 않습니다.",
    };
  }

  await setAdminSession();
  redirect("/admin/dashboard");
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

export async function saveInvitationDetails(
  _previousState: AdminSaveState,
  formData: FormData,
): Promise<AdminSaveState> {
  if (!hasSupabaseConfig()) {
    return {
      error: "Supabase 환경변수가 없어 저장할 수 없습니다.",
    };
  }

  const slug = getRequiredFormValue(formData, "slug");

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
  revalidatePath("/admin/dashboard");

  return {
    success: "저장되었습니다.",
  };
}
