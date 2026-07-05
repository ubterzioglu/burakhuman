import { AdminShell } from "@/components/AdminShell";
import { markMessageRead } from "@/lib/admin-actions";
import { getMessages } from "@/lib/data";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Mesajlar</h1>
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
                <td>{message.status}</td>
                <td>
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <button className="button" type="submit">
                      Okundu
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
