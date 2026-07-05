import { AdminShell } from "@/components/AdminShell";
import { createRevisionComment, createRevisionRequest, updateRevisionRequest } from "@/lib/admin-actions";
import { getRevisionRequests } from "@/lib/data";

const priorities = [
  { value: "low", label: "Dusuk" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Yuksek" },
];

const statuses = [
  { value: "new", label: "Yeni" },
  { value: "in_progress", label: "Islemde" },
  { value: "done", label: "Tamamlandi" },
  { value: "rejected", label: "Reddedildi" },
];

export default async function AdminRevisionsPage() {
  const revisions = await getRevisionRequests();

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Revizyon Istekleri</h1>
        <form className="admin-form" action={createRevisionRequest}>
          <label>
            Baslik
            <input className="input" name="title" required />
          </label>
          <label>
            Sayfa URL
            <input className="input" name="page_url" placeholder="/i/1-about-hcd" />
          </label>
          <label>
            Oncelik
            <select className="select" name="priority" defaultValue="normal">
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
          <label className="wide">
            Revizyon istegi
            <textarea className="textarea" name="description" required />
          </label>
          <label className="wide">
            Admin notu
            <textarea className="textarea" name="admin_notes" />
          </label>
          <div className="wide">
            <button className="button" type="submit">
              Revizyon Ekle
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Revizyon</th>
              <th>Durum</th>
              <th>Not</th>
              <th>Kaydet</th>
            </tr>
          </thead>
          <tbody>
            {revisions.map((revision) => (
              <tr key={revision.id}>
                <td>{revision.created_at ? new Date(revision.created_at).toLocaleDateString("tr-TR") : "-"}</td>
                <td>
                  <strong>{revision.title}</strong>
                  {revision.page_url ? (
                    <>
                      <br />
                      <a href={revision.page_url} target="_blank" rel="noopener noreferrer">
                        {revision.page_url}
                      </a>
                    </>
                  ) : null}
                  <p>{revision.description}</p>
                  {revision.comments?.length ? (
                    <div className="revision-comments">
                      {revision.comments.map((comment) => (
                        <div key={comment.id} className="revision-comment">
                          <span>{comment.created_at ? new Date(comment.created_at).toLocaleString("tr-TR") : "-"}</span>
                          <p>{comment.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <form className="revision-comment-form" action={createRevisionComment}>
                    <input type="hidden" name="revision_id" value={revision.id} />
                    <textarea className="textarea" name="body" placeholder="Yorum ekle" required />
                    <button className="button" type="submit">
                      Yorum Ekle
                    </button>
                  </form>
                </td>
                <td>
                  <form className="revision-row-form" action={updateRevisionRequest} id={`revision-${revision.id}`}>
                    <input type="hidden" name="id" value={revision.id} />
                    <select className="select" name="priority" defaultValue={revision.priority}>
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                    <select className="select" name="status" defaultValue={revision.status}>
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </form>
                </td>
                <td>
                  <textarea
                    className="textarea revision-note"
                    name="admin_notes"
                    form={`revision-${revision.id}`}
                    defaultValue={revision.admin_notes ?? ""}
                  />
                </td>
                <td>
                  <button className="button" type="submit" form={`revision-${revision.id}`}>
                    Guncelle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
