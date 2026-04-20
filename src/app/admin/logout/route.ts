import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/admin-session";

export async function GET() {
  await clearAdminSession();
  redirect("/admin");
}
