import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { getPageById, getPageImages } from "@/lib/data";
import { cleanHtml, imagePath } from "@/lib/sanitize";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const id = Number(slug.split("-")[0]);
  const page = Number.isFinite(id) ? await getPageById(id) : null;
  return {
    title: page?.title || "Content",
    description: page?.summary || undefined,
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const id = Number(slug.split("-")[0]);
  if (!Number.isFinite(id)) notFound();

  const page = await getPageById(id);
  if (!page) notFound();

  const images = await getPageImages(page.id);

  return (
    <PublicShell>
      <div className="breadcrumb-box" />
      <section className="page-title">
        <div className="container">
          <h1>{page.title}</h1>
        </div>
      </section>
      <section className="content-section">
        <div className="container">
          {page.val1 ? <div className="content-media" dangerouslySetInnerHTML={{ __html: cleanHtml(page.val1) }} /> : null}
          <div className="content-html" dangerouslySetInnerHTML={{ __html: cleanHtml(page.body || page.summary) }} />
          {images.length ? (
            <div className="gallery-grid">
              {images.map((image) => (
                <a key={image.id} href={imagePath(image.file_url, "orjinal")} target="_blank" rel="noopener noreferrer">
                  <Image src={imagePath(image.file_url, "orta")} alt={image.title || page.title} width={540} height={270} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
