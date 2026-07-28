import Image from "next/image";
import { AdminShell } from "@/components/AdminShell";
import { deleteFile, uploadMedia } from "@/lib/admin-actions";
import { getMediaLibrary } from "@/lib/data";
import { imagePath } from "@/lib/sanitize";

export default async function AdminMediaPage() {
  const media = await getMediaLibrary();
  const images = media.filter((item) => item.kind === "image");
  const files = media.filter((item) => item.kind === "file");

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Medya Kutuphanesi</h1>
        <p>Genel gorsel/dosya deposu (albume bagli olmayan medya). Icerik galerileri ilgili icerik ekraninda yonetilir.</p>
        <form className="form-grid" action={uploadMedia}>
          <input type="hidden" name="album_id" value={0} />
          <input type="hidden" name="kind" value="image" />
          <input className="input" type="file" name="file" accept="image/*" required />
          <button className="button" type="submit">
            Gorsel yukle
          </button>
        </form>
        <form className="form-grid" action={uploadMedia} style={{ marginTop: 10 }}>
          <input type="hidden" name="album_id" value={0} />
          <input type="hidden" name="kind" value="file" />
          <input className="input" type="file" name="file" required />
          <button className="button" type="submit">
            Dosya yukle
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>Gorseller ({images.length})</h2>
        {images.length ? (
          <div className="gallery-grid">
            {images.map((image) => (
              <div key={image.id}>
                <Image src={imagePath(image.file_url, "orta")} alt={image.title || ""} width={200} height={120} />
                <form action={deleteFile} style={{ marginTop: 6 }}>
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="return_to" value="/admin/media" />
                  <button className="button button-warning" type="submit">
                    Sil
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p>Henuz gorsel yok.</p>
        )}
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>Dosyalar ({files.length})</h2>
        <table className="table">
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  <a href={imagePath(file.file_url)} target="_blank" rel="noopener noreferrer">
                    {file.title || file.file_url}
                  </a>
                </td>
                <td>{file.extension}</td>
                <td>
                  <form action={deleteFile}>
                    <input type="hidden" name="id" value={file.id} />
                    <input type="hidden" name="return_to" value="/admin/media" />
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
