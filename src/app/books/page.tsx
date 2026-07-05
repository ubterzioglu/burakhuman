import { BookCards } from "@/components/BookCards";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "Books",
};

export default function BooksPage() {
  return (
    <PublicShell>
      <div className="breadcrumb-box" />
      <BookCards />
    </PublicShell>
  );
}
