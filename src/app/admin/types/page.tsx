import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { deleteContentType, saveContentType } from "@/lib/admin-actions";
import { getContentTypes } from "@/lib/data";

type Props = {
  searchParams: Promise<{ edit?: string; error?: string }>;
};

const flags = [
  { name: "has_picture", label: "Gorsel (has_picture)" },
  { name: "has_categories", label: "Kategoriler (has_categories)" },
  { name: "has_tags", label: "Etiketler (has_tags)" },
  { name: "has_sub_images", label: "Alt gorseller (has_sub_images)" },
  { name: "has_sub_files", label: "Alt dosyalar (has_sub_files)" },
  { name: "is_protected", label: "Korumali (is_protected)" },
] as const;

export default async function AdminTypesPage({ searchParams }: Props) {
  const params = await searchParams;
  const types = await getContentTypes();
  const editing = types.find((type) => String(type.id) === params.edit);

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Icerik Tipleri</h1>
        <p>Her tip, icerik formunda hangi alanlarin gorunecegini ve alan etiketlerini belirler.</p>
        {params.error === "inuse" ? (
          <div className="admin-warning">Bu tipe bagli icerik veya kategori oldugu icin silinemez.</div>
        ) : null}
        <form className="admin-form" action={saveContentType}>
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <label className="wide">
            Tip adi
            <input className="input" name="name" defaultValue={editing?.name ?? ""} required />
          </label>
          <label>
            Baslik etiketi
            <input className="input" name="title_label" defaultValue={editing?.title_label ?? "Title"} />
          </label>
          <label>
            Ozet etiketi
            <input className="input" name="summary_label" defaultValue={editing?.summary_label ?? "Summary"} />
          </label>
          <label>
            Metin etiketi
            <input className="input" name="text_label" defaultValue={editing?.text_label ?? "Content"} />
          </label>
          {flags.map((flag) => (
            <label key={flag.name}>
              <span>{flag.label}</span>
              <input
                type="checkbox"
                name={flag.name}
                defaultChecked={Boolean(editing?.[flag.name as keyof typeof editing])}
              />
            </label>
          ))}
          <div className="wide">
            <button className="button" type="submit">
              {editing ? "Guncelle" : "Ekle"}
            </button>
            {editing ? (
              <Link href="/admin/types" style={{ marginLeft: 12 }}>
                Iptal
              </Link>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Alanlar</th>
              <th>Islem</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id}>
                <td>{type.id}</td>
                <td>{type.name}</td>
                <td>
                  {flags
                    .filter((flag) => Boolean(type[flag.name as keyof typeof type]))
                    .map((flag) => flag.name.replace("has_", "").replace("is_", ""))
                    .join(", ") || "-"}
                </td>
                <td>
                  <Link href={`/admin/types?edit=${type.id}`}>Duzenle</Link>
                  <form action={deleteContentType} style={{ display: "inline", marginLeft: 12 }}>
                    <input type="hidden" name="id" value={type.id} />
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
