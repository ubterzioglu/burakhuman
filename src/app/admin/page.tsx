import { AdminShell } from "@/components/AdminShell";
import { getAdminDashboardData, TYPE_BLOG, TYPE_PAGE, TYPE_SLIDER } from "@/lib/data";
import { missingItems } from "@/lib/missing-items";

export default async function AdminPage() {
  const { pages, categories, messages, revisions } = await getAdminDashboardData();
  const openRevisions = revisions.filter((revision) => !["done", "rejected"].includes(revision.status));
  const highPriorityMissing = missingItems.filter((item) => item.priority === "high");

  return (
    <AdminShell>
      <div className="admin-grid">
        <div className="metric">
          <span>Icerik</span>
          <strong>{pages.length}</strong>
        </div>
        <div className="metric">
          <span>Blog</span>
          <strong>{pages.filter((page) => page.type_id === TYPE_BLOG).length}</strong>
        </div>
        <div className="metric">
          <span>Kategori</span>
          <strong>{categories.length}</strong>
        </div>
        <div className="metric">
          <span>Yeni Mesaj</span>
          <strong>{messages.filter((message) => message.status === "new").length}</strong>
        </div>
        <div className="metric">
          <span>Acik Revizyon</span>
          <strong>{openRevisions.length}</strong>
        </div>
        <div className="metric">
          <span>Toplam Revizyon</span>
          <strong>{revisions.length}</strong>
        </div>
        <div className="metric">
          <span>Eksik Kalan</span>
          <strong>{missingItems.length}</strong>
        </div>
        <div className="metric">
          <span>Yuksek Oncelik Eksik</span>
          <strong>{highPriorityMissing.length}</strong>
        </div>
      </div>
      <div className="admin-card">
        <h1>HCD CMS</h1>
        <p>
          Eski WebForms panelindeki temel alanlar Next.js ve Supabase uzerinde yeniden kuruldu. Tipler: page={TYPE_PAGE},
          blog={TYPE_BLOG}, slider={TYPE_SLIDER}.
        </p>
      </div>
    </AdminShell>
  );
}
