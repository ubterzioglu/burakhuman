import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isPostgresConfigured, query } from "@/lib/db";
import { getProductById } from "@/lib/data";
import { getCurrentMember } from "@/lib/member-auth";
import { capturePaypalOrder, isPaypalConfigured } from "@/lib/paypal";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";

const orderSelect =
  "id, guid, product_id, member_id, buyer_name, amount_cents, currency, status, admin_note, paypal_order_id, paypal_capture_id, created_at, updated_at";

export async function POST(request: Request) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isPaypalConfigured()) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { paypalOrderId?: string } | null;
  const paypalOrderId = body?.paypalOrderId;
  if (!paypalOrderId) return NextResponse.json({ error: "Missing PayPal order id" }, { status: 400 });

  const supabase = createSupabaseServiceClient();
  let order: Order | null = null;
  if (supabase) {
    const { data } = await supabase.from("orders").select(orderSelect).eq("paypal_order_id", paypalOrderId).maybeSingle();
    order = (data as Order) ?? null;
  } else if (isPostgresConfigured()) {
    const { rows } = await query<Order>(`select ${orderSelect} from orders where paypal_order_id = $1 limit 1`, [paypalOrderId]);
    order = rows[0] ?? null;
  }

  if (!order || order.member_id !== member.id) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "completed") return NextResponse.json({ ok: true, status: "completed" });

  const product = await getProductById(order.product_id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  try {
    const result = await capturePaypalOrder(paypalOrderId);
    const amountMatches =
      result.value === (product.price_cents / 100).toFixed(2) && result.currency === product.currency;
    if (result.status !== "COMPLETED" || !amountMatches) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    if (supabase) {
      await supabase
        .from("orders")
        .update({ status: "completed", paypal_capture_id: result.captureId, updated_at: new Date().toISOString() })
        .eq("id", order.id);
    } else if (isPostgresConfigured()) {
      await query("update orders set status = 'completed', paypal_capture_id = $1, updated_at = now() where id = $2", [
        result.captureId,
        order.id,
      ]);
    }
    revalidatePath("/product1");
    revalidatePath("/profile");
    return NextResponse.json({ ok: true, status: "completed" });
  } catch {
    return NextResponse.json({ error: "Capture failed" }, { status: 502 });
  }
}

