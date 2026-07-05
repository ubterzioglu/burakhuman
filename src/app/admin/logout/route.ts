import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
