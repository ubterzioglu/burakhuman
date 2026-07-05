import { AdminShell } from "@/components/AdminShell";
import { saveCategory } from "@/lib/admin-actions";
import { getCategories, getContentTypes } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const [categories, types] = await Promise.all([getCategories(), getContentTypes()]);

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Kategoriler</h1>
        <form className="admin-form" action={saveCategory}>
          <label>
            Tip
            <select className="select" name="type_id" defaultValue={2}>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sira
            <input className="input" type="number" name="rank" defaultValue={0} />
          </label>
          <label className="wide">
            Kategori adi
            <input className="input" name="name" required />
          </label>
          <button className="button" type="submit">
            Ekle
          </button>
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
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{types.find((type) => type.id === category.type_id)?.name || category.type_id}</td>
                <td>{category.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
