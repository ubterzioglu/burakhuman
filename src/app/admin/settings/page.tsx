import { AdminShell } from "@/components/AdminShell";
import { saveOption } from "@/lib/admin-actions";
import { getSiteOptions } from "@/lib/data";

const knownKeys = [
  { name: "seo_title", hint: "Varsayilan site basligi ve OG basligi" },
  { name: "seo_description", hint: "Meta description / OG description" },
  { name: "seo_keywords", hint: "Virgulle ayrilmis anahtar kelimeler" },
  { name: "og_image", hint: "Open Graph gorsel URL'i" },
  { name: "og_locale", hint: "OG locale (or. en_US)" },
  { name: "site_url", hint: "Kanonik site URL'i (metadataBase)" },
  { name: "geo_region", hint: "geo.region (or. TR-34)" },
  { name: "geo_placename", hint: "geo.placename (or. Tuzla, Istanbul)" },
  { name: "geo_position", hint: "geo.position (lat;lon)" },
  { name: "geo_icbm", hint: "ICBM (lat, lon)" },
  { name: "geo_country", hint: "geo.country (or. TR)" },
  { name: "footer_note", hint: "Footer notu" },
  { name: "map", hint: "Harita koordinati / embed" },
];

export default async function AdminSettingsPage() {
  const options = await getSiteOptions();
  const extra = Object.entries(options).filter(([name]) => !knownKeys.some((key) => key.name === name));

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Ayarlar</h1>
        <p>SEO ve site geneli ayarlar. Deger kaydedildiginde metadata ve public alanlara yansir.</p>
        {knownKeys.map((key) => (
          <form key={key.name} className="admin-form" action={saveOption} style={{ marginBottom: 12 }}>
            <input type="hidden" name="name" value={key.name} />
            <label className="wide">
              {key.name} <small>({key.hint})</small>
              <input className="input" name="value" defaultValue={options[key.name] ?? ""} />
            </label>
            <button className="button" type="submit">
              Kaydet
            </button>
          </form>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>Ozel ayar ekle</h2>
        <form className="admin-form" action={saveOption}>
          <label>
            Ayar adi
            <input
              className="input"
              name="name"
              placeholder="ozel_ayar, site_url, geo_region, geo_placename..."
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
        {extra.length ? (
          <table className="table" style={{ marginTop: 14 }}>
            <thead>
              <tr>
                <th>Ad</th>
                <th>Deger</th>
              </tr>
            </thead>
            <tbody>
              {extra.map(([name, value]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </AdminShell>
  );
}
