import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isPostgresConfigured, query } from "@/lib/db";
import { getOrderByGuid } from "@/lib/data";
import { isPaypalConfigured, verifyWebhookSignature } from "@/lib/paypal";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!isPaypalConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const rawBody = await request.text();
  const verified = await verifyWebhookSignature(request.headers, rawBody).catch(() => false);
  if (!verified) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  let event: { event_type?: string; resource?: { custom_id?: string; id?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const guid = event.resource?.custom_id;
  const captureId = event.resource?.id ?? null;
  if (!guid) return NextResponse.json({ ok: true, ignored: true });

  const order = await getOrderByGuid(guid);
  // Idempotent: only advance pending/paid -> completed; never downgrade a completed order.
  if (!order || order.status === "completed" || order.status === "cancelled") {
    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseServiceClient();
  if (supabase) {
    await supabase
      .from("orders")
      .update({ status: "completed", paypal_capture_id: captureId, updated_at: new Date().toISOString() })
      .eq("id", order.id);
  } else if (isPostgresConfigured()) {
    await query("update orders set status = 'completed', paypal_capture_id = $1, updated_at = now() where id = $2", [
      captureId,
      order.id,
    ]);
  }
  revalidatePath("/profile");
  revalidatePath("/product1");
  return NextResponse.json({ ok: true });
}
