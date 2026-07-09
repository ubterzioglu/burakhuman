import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { deleteOrder, toggleOrderStatus } from "@/lib/member-actions";
import { getMembers, getOrders } from "@/lib/data";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

function formatPrice(cents: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${(cents / 100).toFixed(2)}`;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const [orders, members] = await Promise.all([getOrders(), getMembers()]);
  const memberById = new Map(members.map((member) => [member.id, member]));

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Siparisler ({orders.length})</h1>
        {params.error === "paid" ? (
          <div className="admin-warning">Odenmis/tamamlanmis siparis silinemez.</div>
        ) : null}
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Uye</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const member = memberById.get(order.member_id);
              return (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`}>#HCD04{order.id}</Link>
                  </td>
                  <td>
                    {order.buyer_name || member?.full_name || "-"}
                    <br />
                    <small>{member?.email}</small>
                  </td>
                  <td>{formatPrice(order.amount_cents, order.currency)}</td>
                  <td>
                    <span className={`status-pill status-${order.status}`}>{order.status}</span>
                  </td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleDateString("tr-TR") : "-"}</td>
                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {order.status === "paid" || order.status === "completed" ? (
                      <form action={toggleOrderStatus}>
                        <input type="hidden" name="id" value={order.id} />
                        <button className="button button-light" type="submit">
                          {order.status === "completed" ? "Tamamlandi (geri al)" : "Tamamla"}
                        </button>
                      </form>
                    ) : null}
                    {order.status === "pending" || order.status === "cancelled" ? (
                      <form action={deleteOrder}>
                        <input type="hidden" name="id" value={order.id} />
                        <button className="button button-warning" type="submit">
                          Sil
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
