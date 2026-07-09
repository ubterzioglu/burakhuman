import { AdminShell } from "@/components/AdminShell";
import { setMemberStatus } from "@/lib/member-actions";
import { getMembers } from "@/lib/data";

export default async function AdminMembersPage() {
  const members = await getMembers();

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Uyeler ({members.length})</h1>
        <p>Kayitli public uyeler. Yeni kayitlar giris yapabilmek icin onay bekler.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Ulke</th>
              <th>Durum</th>
              <th>Kayit</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.full_name}</td>
                <td>{member.email}</td>
                <td>{member.country || "-"}</td>
                <td>
                  <span className={`status-pill status-${member.status === "active" ? "completed" : member.status === "blocked" ? "cancelled" : "pending"}`}>
                    {member.status}
                  </span>
                </td>
                <td>{member.created_at ? new Date(member.created_at).toLocaleDateString("tr-TR") : "-"}</td>
                <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {member.status !== "active" ? (
                    <form action={setMemberStatus}>
                      <input type="hidden" name="id" value={member.id} />
                      <input type="hidden" name="status" value="active" />
                      <button className="button button-light" type="submit">
                        Onayla
                      </button>
                    </form>
                  ) : (
                    <form action={setMemberStatus}>
                      <input type="hidden" name="id" value={member.id} />
                      <input type="hidden" name="status" value="pending" />
                      <button className="button button-light" type="submit">
                        Onayi kaldir
                      </button>
                    </form>
                  )}
                  {member.status !== "blocked" ? (
                    <form action={setMemberStatus}>
                      <input type="hidden" name="id" value={member.id} />
                      <input type="hidden" name="status" value="blocked" />
                      <button className="button button-warning" type="submit">
                        Engelle
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
