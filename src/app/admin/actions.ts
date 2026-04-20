"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, setAdminSession, verifyAdminPassword } from "@/lib/admin-session";

export type AdminLoginState = {
  error?: string;
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
