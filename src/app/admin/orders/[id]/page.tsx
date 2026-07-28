import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { saveOrderNote, toggleOrderStatus } from "@/lib/member-actions";
import { getMemberById, getOrderById, getProductById } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
};

function formatPrice(cents: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${(cents / 100).toFixed(2)}`;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(Number(id));
  if (!order) notFound();

  const [member, product] = await Promise.all([getMemberById(order.member_id), getProductById(order.product_id)]);

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Siparis #HCD04{order.id}</h1>
        <p>
          <Link href="/admin/orders">← Siparislere don</Link>
        </p>
        <table className="table">
          <tbody>
            <tr>
              <th>Durum</th>
              <td>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
              </td>
            </tr>
            <tr>
              <th>Uye</th>
              <td>
                {order.buyer_name || member?.full_name || "-"} ({member?.email})
              </td>
            </tr>
            <tr>
              <th>Urun</th>
              <td>{product?.title || order.product_id}</td>
            </tr>
            <tr>
              <th>Tutar</th>
              <td>{formatPrice(order.amount_cents, order.currency)}</td>
            </tr>
            <tr>
              <th>GUID</th>
              <td>{order.guid}</td>
            </tr>
            <tr>
              <th>PayPal Order</th>
              <td>{order.paypal_order_id || "-"}</td>
            </tr>
            <tr>
              <th>PayPal Capture</th>
              <td>{order.paypal_capture_id || "-"}</td>
            </tr>
            <tr>
              <th>Tarih</th>
              <td>{order.created_at ? new Date(order.created_at).toLocaleString("tr-TR") : "-"}</td>
            </tr>
          </tbody>
        </table>

        {order.status === "paid" || order.status === "completed" ? (
          <form action={toggleOrderStatus} style={{ marginTop: 12 }}>
            <input type="hidden" name="id" value={order.id} />
            <button className="button" type="submit">
              {order.status === "completed" ? "Tamamlandi (geri al)" : "Siparisi tamamla"}
            </button>
          </form>
        ) : null}
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>Admin notu</h2>
        <p>Bu not, uyenin profil sayfasindaki siparis satirinda gorunur.</p>
        <form className="admin-form" action={saveOrderNote}>
          <input type="hidden" name="id" value={order.id} />
          <label className="wide">
            Not
            <textarea className="textarea" name="admin_note" defaultValue={order.admin_note ?? ""} />
          </label>
          <button className="button" type="submit">
            Kaydet
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
