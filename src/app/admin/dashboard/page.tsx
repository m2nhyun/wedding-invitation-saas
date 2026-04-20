import { redirect } from "next/navigation";
import { getAdminSessionSlug } from "@/lib/admin-session";

export default async function LegacyAdminDashboardPage() {
  const slug = await getAdminSessionSlug();
  redirect(slug ? `/admin/${slug}` : "/admin");
}
