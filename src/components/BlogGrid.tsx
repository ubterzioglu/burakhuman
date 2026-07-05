import Image from "next/image";
import Link from "next/link";
import type { Category, PageRecord } from "@/lib/types";
import { imagePath, slugify } from "@/lib/sanitize";

export function BlogGrid({ blogs, categories, dark = false }: { blogs: PageRecord[]; categories: Category[]; dark?: boolean }) {
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return (
    <section className={dark ? "portfolio-band portfolio-band-dark" : "portfolio-band"}>
      <div className="container">
        <div className="filter-bar">
          <span>All Categories</span>
          {categories.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </div>
        <div className="blog-grid">
          {blogs.map((blog) => (
            <Link key={blog.id} className="work-card" href={`/i/${blog.id}-${slugify(blog.title)}`}>
              <Image src={imagePath(blog.picture_url, "orta")} alt={blog.title} width={540} height={394} />
              <span className="work-overlay" />
              <span className="work-category">{blog.category_id ? categoryById.get(blog.category_id)?.name : "HCD"}</span>
              <strong>{blog.title}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
