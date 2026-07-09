import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { deleteCategory, saveCategory } from "@/lib/admin-actions";
import { getCategories, getContentTypes } from "@/lib/data";

type Props = {
  searchParams: Promise<{ edit?: string; error?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const [categories, types] = await Promise.all([getCategories(), getContentTypes()]);
  const editing = categories.find((category) => String(category.id) === params.edit);

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Kategoriler</h1>
        {params.error === "inuse" ? (
          <div className="admin-warning">Bu kategoriye bagli icerik oldugu icin silinemez.</div>
        ) : null}
        <form className="admin-form" action={saveCategory}>
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <label>
            Tip
            <select className="select" name="type_id" defaultValue={editing?.type_id ?? 2}>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sira
            <input className="input" type="number" name="rank" defaultValue={editing?.rank ?? 0} />
          </label>
          <label className="wide">
            Kategori adi
            <input className="input" name="name" defaultValue={editing?.name ?? ""} required />
          </label>
          <button className="button" type="submit">
            {editing ? "Guncelle" : "Ekle"}
          </button>
          {editing ? (
            <Link href="/admin/categories" style={{ marginLeft: 12 }}>
              Iptal
            </Link>
          ) : null}
        </form>
      </div>
      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Tip</th>
              <th>Sira</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{types.find((type) => type.id === category.type_id)?.name || category.type_id}</td>
                <td>{category.rank}</td>
                <td>
                  <Link href={`/admin/categories?edit=${category.id}`}>Duzenle</Link>
                  <form action={deleteCategory} style={{ display: "inline", marginLeft: 12 }}>
                    <input type="hidden" name="id" value={category.id} />
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
