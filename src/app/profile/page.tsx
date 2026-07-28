import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { getOrdersForMember } from "@/lib/data";
import { getCurrentMember } from "@/lib/member-auth";

export const metadata = { title: "Profile" };

function formatPrice(cents: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${(cents / 100).toFixed(2)}`;
}

const downloadFormats = [
  { kind: "epub", label: "EPUB" },
  { kind: "mobi", label: "MOBI (Kindle)" },
  { kind: "pdf", label: "PDF" },
] as const;

export default async function ProfilePage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login?next=/profile");

  const orders = await getOrdersForMember(member.id);

  return (
    <PublicShell>
      <section className="page-title">
        <div className="container">
          <h1>My Account</h1>
        </div>
      </section>
      <section className="content-section">
        <div className="container">
          <p>
            <strong>{member.full_name}</strong>
            <br />
            {member.email}
            {member.country ? (
              <>
                <br />
                {member.country}
              </>
            ) : null}
          </p>

          <h2 style={{ marginTop: 28 }}>Orders</h2>
          {orders.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Downloads</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#HCD04{order.id}</td>
                    <td>{order.created_at ? new Date(order.created_at).toLocaleDateString("en-GB") : "-"}</td>
                    <td>{formatPrice(order.amount_cents, order.currency)}</td>
                    <td>
                      <span className={`status-pill status-${order.status}`}>{order.status}</span>
                    </td>
                    <td>
                      {order.status === "completed" ? (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {downloadFormats.map((format) => (
                            <a key={format.kind} className="button button-light" href={`/download/${format.kind}`}>
                              {format.label}
                            </a>
                          ))}
                        </div>
                      ) : order.admin_note ? (
                        order.admin_note
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              No orders yet. <Link href="/product1">Get the e-book</Link>.
            </p>
          )}

          <p style={{ marginTop: 24 }}>
            <a className="button button-warning" href="/logout">
              Log out
            </a>
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
