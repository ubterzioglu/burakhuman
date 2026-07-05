import { AdminShell } from "@/components/AdminShell";
import { getAdminDashboardData, TYPE_BLOG, TYPE_PAGE, TYPE_SLIDER } from "@/lib/data";

export default async function AdminPage() {
  const { pages, categories, messages } = await getAdminDashboardData();

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
