import { BlogGrid } from "@/components/BlogGrid";
import { PublicShell } from "@/components/PublicShell";
import { getBlogData } from "@/lib/data";

export const metadata = {
  title: "Blog",
};

export default async function BlogsPage() {
  const { blogs, categories } = await getBlogData();

  return (
    <PublicShell>
      <div className="breadcrumb-box" />
      <section className="page-title">
        <div className="container">
          <h1>Blog</h1>
        </div>
      </section>
      <BlogGrid blogs={blogs} categories={categories} />
    </PublicShell>
  );
}
