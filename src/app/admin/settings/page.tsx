import { AdminShell } from "@/components/AdminShell";
import { saveOption } from "@/lib/admin-actions";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Ayarlar</h1>
        <form className="admin-form" action={saveOption}>
          <label>
            Ayar adi
            <input
              className="input"
              name="name"
              placeholder="seo_title, seo_description, site_url, geo_region, geo_placename, geo_position"
              required
            />
          </label>
          <label>
            Deger
            <input className="input" name="value" required />
          </label>
          <div className="wide">
            <button className="button" type="submit">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
