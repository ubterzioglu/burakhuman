import { NextResponse } from "next/server";
import { z } from "zod";
import { isPostgresConfigured, query } from "@/lib/db";
import { createSupabaseServiceClient } from "@/lib/supabase";

const newsletterSchema = z.object({
  email: z.string().trim().email().max(240),
});

export async function POST(request: Request) {
  const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const supabase = createSupabaseServiceClient();

  if (supabase) {
    const { error } = await supabase.from("mailing_list").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
    if (error) return NextResponse.json({ error: "Subscription could not be saved." }, { status: 500 });
  } else if (isPostgresConfigured()) {
    try {
      await query("insert into mailing_list (email) values ($1) on conflict (email) do nothing", [email]);
    } catch {
      return NextResponse.json({ error: "Subscription could not be saved." }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Newsletter is not configured." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
