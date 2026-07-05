import { NextResponse } from "next/server";
import { z } from "zod";
import { isPostgresConfigured, query } from "@/lib/db";
import { sendContactMail } from "@/lib/mail";
import { createSupabaseServiceClient } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(240),
  telephone: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
});

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const input = parsed.data;
  const supabase = createSupabaseServiceClient();

  if (supabase) {
    const { error } = await supabase.from("messages").insert({
      name: input.name,
      telephone: input.telephone || null,
      email: input.email,
      subject: "ILETISIM / TALEP FORMU",
      message: input.message,
      status: "new",
    });

    if (error) return NextResponse.json({ error: "Message could not be saved." }, { status: 500 });
  } else if (isPostgresConfigured()) {
    try {
      await query(
        `insert into messages (name, telephone, email, subject, message, status)
         values ($1, $2, $3, 'ILETISIM / TALEP FORMU', $4, 'new')`,
        [input.name, input.telephone || null, input.email, input.message],
      );
    } catch {
      return NextResponse.json({ error: "Message could not be saved." }, { status: 500 });
    }
  }

  await sendContactMail(input).catch(() => null);
  return NextResponse.json({ ok: true });
}
