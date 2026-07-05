import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { deletePage, savePage, uploadPageImage } from "@/lib/admin-actions";
import { getCategories, getContentTypes, getPages } from "@/lib/data";

type Props = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function AdminPagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const [pages, categories, types] = await Promise.all([
    getPages({ publishedOnly: false }),
    getCategories(),
    getContentTypes(),
  ]);
  const editing = pages.find((page) => String(page.id) === params.edit);

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Icerikler</h1>
        <form className="admin-form" action={savePage}>
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <label>
            Tip
            <select className="select" name="type_id" defaultValue={editing?.type_id ?? 1}>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Kategori
            <select className="select" name="category_id" defaultValue={editing?.category_id ?? ""}>
              <option value="">Yok</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Dil
            <input className="input" name="lang" defaultValue={editing?.lang ?? "en"} />
          </label>
          <label>
            Sira
            <input className="input" type="number" name="rank" defaultValue={editing?.rank ?? 0} />
          </label>
          <label className="wide">
            Baslik
            <input className="input" name="title" defaultValue={editing?.title ?? ""} required />
          </label>
          <label className="wide">
            Ozet
            <textarea className="textarea" name="summary" defaultValue={editing?.summary ?? ""} />
          </label>
          <label className="wide">
            Icerik HTML
            <textarea className="textarea" name="body" defaultValue={editing?.body ?? ""} />
          </label>
          <label>
            Gorsel URL/dosya adi
            <input className="input" name="picture_url" defaultValue={editing?.picture_url ?? ""} />
          </label>
          <label>
            Val1
            <input className="input" name="val1" defaultValue={editing?.val1 ?? ""} />
          </label>
          <label>
            Val2
            <input className="input" name="val2" defaultValue={editing?.val2 ?? ""} />
          </label>
          <label>
            Val3
            <input className="input" name="val3" defaultValue={editing?.val3 ?? ""} />
          </label>
          <label>
            <span>Yayinda</span>
            <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} />
          </label>
          <div className="wide">
            <button className="button" type="submit">
              {editing ? "Guncelle" : "Ekle"}
            </button>
          </div>
        </form>
      </div>

      {editing ? (
        <div className="admin-card" style={{ marginTop: 18 }}>
          <h2>Alt gorsel yukle</h2>
          <form className="form-grid" action={uploadPageImage}>
            <input type="hidden" name="page_id" value={editing.id} />
            <input className="input" type="file" name="file" accept="image/*" required />
            <button className="button" type="submit">
              Yukle
            </button>
          </form>
        </div>
      ) : null}

      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Baslik</th>
              <th>Tip</th>
              <th>Yayin</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.id}</td>
                <td>{page.title}</td>
                <td>{types.find((type) => type.id === page.type_id)?.name || page.type_id}</td>
                <td>{page.published ? "Evet" : "Hayir"}</td>
                <td>
                  <Link href={`/admin/pages?edit=${page.id}`}>Duzenle</Link>
                  <form action={deletePage} style={{ display: "inline", marginLeft: 12 }}>
                    <input type="hidden" name="id" value={page.id} />
                    <button className="button" type="submit">
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
