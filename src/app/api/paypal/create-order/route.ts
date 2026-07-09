import { NextResponse } from "next/server";
import { isPostgresConfigured, query } from "@/lib/db";
import { getProductBySlug } from "@/lib/data";
import { getCurrentMember } from "@/lib/member-auth";
import { createPaypalOrder, isPaypalConfigured } from "@/lib/paypal";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Order } from "@/lib/types";

const orderSelect =
  "id, guid, product_id, member_id, buyer_name, amount_cents, currency, status, admin_note, paypal_order_id, paypal_capture_id, created_at, updated_at";

export async function POST() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isPaypalConfigured()) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

  const product = await getProductBySlug("hcd-ebook");
  if (!product || !product.active) return NextResponse.json({ error: "Product unavailable" }, { status: 404 });

  const supabase = createSupabaseServiceClient();
  let order: Order | null = null;

  if (supabase) {
    const { data: pending } = await supabase
      .from("orders")
      .select(orderSelect)
      .eq("member_id", member.id)
      .eq("product_id", product.id)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();
    order = (pending as Order) ?? null;

    if (!order) {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          product_id: product.id,
          member_id: member.id,
          buyer_name: member.full_name,
          amount_cents: product.price_cents,
          currency: product.currency,
          status: "pending",
        })
        .select(orderSelect)
        .single();
      if (error) return NextResponse.json({ error: "Order could not be created." }, { status: 500 });
      order = data as Order;
    }
  } else if (isPostgresConfigured()) {
    const { rows: pending } = await query<Order>(
      `select ${orderSelect} from orders where member_id = $1 and product_id = $2 and status = 'pending' limit 1`,
      [member.id, product.id],
    );
    order = pending[0] ?? null;
    if (!order) {
      const { rows } = await query<Order>(
        `insert into orders (product_id, member_id, buyer_name, amount_cents, currency, status)
         values ($1, $2, $3, $4, $5, 'pending') returning ${orderSelect}`,
        [product.id, member.id, member.full_name, product.price_cents, product.currency],
      );
      order = rows[0] ?? null;
    }
  }

  if (!order) return NextResponse.json({ error: "Order could not be created." }, { status: 500 });

  try {
    const paypalOrder = await createPaypalOrder(order, product);
    if (supabase) {
      await supabase.from("orders").update({ paypal_order_id: paypalOrder.id, updated_at: new Date().toISOString() }).eq("id", order.id);
    } else if (isPostgresConfigured()) {
      await query("update orders set paypal_order_id = $1, updated_at = now() where id = $2", [paypalOrder.id, order.id]);
    }
    return NextResponse.json({ id: paypalOrder.id });
  } catch {
    return NextResponse.json({ error: "PayPal order could not be created." }, { status: 502 });
  }
}
