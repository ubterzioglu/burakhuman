import { AdminShell } from "@/components/AdminShell";
import { deleteMailingEntry } from "@/lib/admin-actions";
import { getMailingList } from "@/lib/data";

export default async function AdminMailingPage() {
  const list = await getMailingList();
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(
    ["email,created_at", ...list.map((row) => `${row.email},${row.created_at ?? ""}`)].join("\n"),
  )}`;

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Mail Listesi ({list.length})</h1>
        <p>Bulten abonelikleri. Public sitedeki footer formundan toplanir.</p>
        {list.length ? (
          <a className="button button-light" href={csvHref} download="mailing-list.csv">
            CSV indir
          </a>
        ) : null}
      </div>
      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>E-posta</th>
              <th>Tarih</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.id}>
                <td>{row.email}</td>
                <td>{row.created_at ? new Date(row.created_at).toLocaleDateString("tr-TR") : "-"}</td>
                <td>
                  <form action={deleteMailingEntry}>
                    <input type="hidden" name="id" value={row.id} />
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
