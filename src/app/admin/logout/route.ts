import { redirect } from "next/navigation";
import { clearAdminSessionCookie } from "@/lib/supabase";

export async function GET() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
