import Link from "next/link";
import Image from "next/image";
import { AdminShell } from "@/components/AdminShell";
import { PageForm } from "./PageForm";
import { deleteFile, deletePage, reorderPage, setPageCover, uploadMedia } from "@/lib/admin-actions";
import { getCategories, getContentTypes, getPageFiles, getPages, getPageTags } from "@/lib/data";
import { imagePath } from "@/lib/sanitize";

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
  const [editingTags, editingImages, editingFiles] = editing
    ? await Promise.all([getPageTags(editing.id), getPageFiles(editing.id, "image"), getPageFiles(editing.id, "file")])
    : [[], [], []];

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Icerikler</h1>
        <PageForm types={types} categories={categories} editing={editing} tags={editingTags} />
      </div>

      {editing ? (
        <div className="admin-card" style={{ marginTop: 18 }}>
          <h2>Alt gorsel ve dosyalar</h2>
          <form className="form-grid" action={uploadMedia}>
            <input type="hidden" name="album_id" value={editing.id} />
            <input type="hidden" name="kind" value="image" />
            <input className="input" type="file" name="file" accept="image/*" required />
            <button className="button" type="submit">
              Gorsel yukle
            </button>
          </form>
          <form className="form-grid" action={uploadMedia} style={{ marginTop: 10 }}>
            <input type="hidden" name="album_id" value={editing.id} />
            <input type="hidden" name="kind" value="file" />
            <input className="input" type="file" name="file" required />
            <button className="button" type="submit">
              Dosya yukle
            </button>
          </form>

          {editingImages.length ? (
            <div className="gallery-grid" style={{ marginTop: 14 }}>
              {editingImages.map((image) => (
                <div key={image.id}>
                  <Image src={imagePath(image.file_url, "orta")} alt={image.title || ""} width={200} height={120} />
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <form action={setPageCover}>
                      <input type="hidden" name="page_id" value={editing.id} />
                      <input type="hidden" name="file_url" value={image.file_url} />
                      <button className="button button-light" type="submit">
                        Kapak yap
                      </button>
                    </form>
                    <form action={deleteFile}>
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="return_to" value={`/admin/pages?edit=${editing.id}`} />
                      <button className="button button-warning" type="submit">
                        Sil
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {editingFiles.length ? (
            <table className="table" style={{ marginTop: 14 }}>
              <tbody>
                {editingFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.title || file.file_url}</td>
                    <td>{file.extension}</td>
                    <td>
                      <form action={deleteFile}>
                        <input type="hidden" name="id" value={file.id} />
                        <input type="hidden" name="return_to" value={`/admin/pages?edit=${editing.id}`} />
                        <button className="button button-warning" type="submit">
                          Sil
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      ) : null}

      <div className="admin-card" style={{ marginTop: 18 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Baslik</th>
              <th>Tip</th>
              <th>Sira</th>
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
                <td>
                  <span style={{ marginRight: 6 }}>{page.rank}</span>
                  <form action={reorderPage} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={page.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button className="button button-light" type="submit">
                      ↑
                    </button>
                  </form>
                  <form action={reorderPage} style={{ display: "inline", marginLeft: 4 }}>
                    <input type="hidden" name="id" value={page.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button className="button button-light" type="submit">
                      ↓
                    </button>
                  </form>
                </td>
                <td>{page.published ? "Evet" : "Hayir"}</td>
                <td>
                  <Link href={`/admin/pages?edit=${page.id}`}>Duzenle</Link>
                  <form action={deletePage} style={{ display: "inline", marginLeft: 12 }}>
                    <input type="hidden" name="id" value={page.id} />
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
