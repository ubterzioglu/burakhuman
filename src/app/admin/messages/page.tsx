import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { deleteMessage, markMessageArchived, markMessageRead } from "@/lib/admin-actions";
import { getMessages } from "@/lib/data";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

const filters = [
  { key: "", label: "Tumu" },
  { key: "new", label: "Yeni" },
  { key: "read", label: "Okundu" },
  { key: "archived", label: "Arsiv" },
];

export default async function AdminMessagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const active = params.status || "";
  const all = await getMessages();
  const messages = active ? all.filter((message) => message.status === active) : all;

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Mesajlar</h1>
        <div className="filter-bar">
          {filters.map((filter) => (
            <Link
              key={filter.key}
              href={filter.key ? `/admin/messages?status=${filter.key}` : "/admin/messages"}
              className={active === filter.key ? "active" : ""}
            >
              {filter.label}
            </Link>
          ))}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Gonderen</th>
              <th>Mesaj</th>
              <th>Durum</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.created_at ? new Date(message.created_at).toLocaleDateString("tr-TR") : "-"}</td>
                <td>
                  <strong>{message.name}</strong>
                  <br />
                  {message.email}
                  <br />
                  {message.telephone || ""}
                </td>
                <td>{message.message}</td>
                <td>
                  <span className={`status-pill status-${message.status === "new" ? "pending" : message.status === "read" ? "paid" : "cancelled"}`}>
                    {message.status}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <button className="button button-light" type="submit">
                      Okundu
                    </button>
                  </form>
                  <form action={markMessageArchived}>
                    <input type="hidden" name="id" value={message.id} />
                    <button className="button button-light" type="submit">
                      Arsivle
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={message.id} />
                    <button className="button button-warning" type="submit">
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
