import { redirect } from "next/navigation";
import { getPrimaryInvitation } from "@/lib/mock-data";

export default function Home() {
  redirect(`/w/${getPrimaryInvitation().slug}`);
}
