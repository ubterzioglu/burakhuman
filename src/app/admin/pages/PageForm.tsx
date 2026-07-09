"use client";

import { useState } from "react";
import { savePage } from "@/lib/admin-actions";
import type { Category, ContentType, PageRecord } from "@/lib/types";

type Props = {
  types: ContentType[];
  categories: Category[];
  editing?: PageRecord;
  tags: string[];
};

export function PageForm({ types, categories, editing, tags }: Props) {
  const [typeId, setTypeId] = useState<number>(editing?.type_id ?? types[0]?.id ?? 1);
  const activeType = types.find((type) => type.id === typeId);
  const typeCategories = categories.filter((category) => category.type_id === typeId);

  return (
    <form className="admin-form" action={savePage}>
      <input type="hidden" name="id" value={editing?.id ?? ""} />
      <label>
        Tip
        <select className="select" name="type_id" value={typeId} onChange={(event) => setTypeId(Number(event.target.value))}>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </label>

      {activeType?.has_categories ? (
        <label>
          Kategori
          <select className="select" name="category_id" defaultValue={editing?.category_id ?? ""}>
            <option value="">Yok</option>
            {typeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <input type="hidden" name="category_id" value="" />
      )}

      <label>
        Dil
        <input className="input" name="lang" defaultValue={editing?.lang ?? "en"} />
      </label>
      <label>
        Sira
        <input className="input" type="number" name="rank" defaultValue={editing?.rank ?? 0} />
      </label>
      <label className="wide">
        {activeType?.title_label || "Baslik"}
        <input className="input" name="title" defaultValue={editing?.title ?? ""} required />
      </label>
      <label className="wide">
        {activeType?.summary_label || "Ozet"}
        <textarea className="textarea" name="summary" defaultValue={editing?.summary ?? ""} />
      </label>
      {activeType?.text_label !== "" ? (
        <label className="wide">
          {activeType?.text_label || "Icerik HTML"}
          <textarea className="textarea" name="body" defaultValue={editing?.body ?? ""} />
        </label>
      ) : null}

      {activeType?.has_tags ? (
        <label className="wide">
          Etiketler (virgulle ayirin)
          <input className="input" name="tags" defaultValue={tags.join(", ")} placeholder="ornek, etiket, konusu" />
        </label>
      ) : null}

      {activeType?.has_picture ? (
        <label>
          Gorsel URL/dosya adi
          <input className="input" name="picture_url" defaultValue={editing?.picture_url ?? ""} />
        </label>
      ) : (
        <input type="hidden" name="picture_url" value={editing?.picture_url ?? ""} />
      )}

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
  );
}
