import Image from "next/image";
import Link from "next/link";
import { BlogGrid } from "@/components/BlogGrid";
import { BookCards } from "@/components/BookCards";
import { PublicShell } from "@/components/PublicShell";
import { getHomeData } from "@/lib/data";
import { cleanHtml, imagePath } from "@/lib/sanitize";

export default async function HomePage() {
  const { sliders, about, blogs, categories } = await getHomeData();
  const hero = sliders[0];

  return (
    <PublicShell>
      <section className="hero-slider">
        <div className="hero-slide">
          <Image src={imagePath(hero?.picture_url ?? "slide.png", "img")} alt="" width={1920} height={720} priority />
          <div className="container">
            <div className="hero-copy">
              <h1>{hero?.val1 || hero?.title || "Human Consciousness Decoded"}</h1>
              <p>{hero?.val2 || "A renewed home for the HCD book and consciousness project."}</p>
              {hero?.val3 ? (
                <Link className="button" href={hero.val3}>
                  Read more
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="container intro-grid">
          <div>
            <div className="title-box">
              <h1>{about?.title || "Human Consciousness Decoded"}</h1>
            </div>
            <div className="lead" dangerouslySetInnerHTML={{ __html: cleanHtml(about?.summary || about?.body) }} />
          </div>
          <Image className="intro-image" src={imagePath(about?.picture_url ?? "books2.jpg", "img")} alt="" width={700} height={460} />
        </div>
      </section>

      <BlogGrid blogs={blogs} categories={categories} dark />
      <BookCards />
    </PublicShell>
  );
}
