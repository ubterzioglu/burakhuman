import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { isAdminAuthConfigured, isSupabaseServiceConfigured, requireAdmin } from "@/lib/supabase";

const nav = [
  { href: "/admin", label: "Genel Bakis" },
  { href: "/admin/pages", label: "Icerikler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/revisions", label: "Revizyonlar" },
  { href: "/admin/missing", label: "Eksik Kalanlar" },
  { href: "/admin/messages", label: "Mesajlar" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export async function AdminShell({ children }: { children: ReactNode }) {
  if (!isAdminAuthConfigured()) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1>Admin ayari gerekli</h1>
          <p>Admin paneli icin `.env.local` veya deploy ortaminda `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` tanimlanmali.</p>
        </div>
      </div>
    );
  }

  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          HCD Admin
        </Link>
        <nav className="admin-nav">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/admin/logout">Cikis</Link>
          <Link href="/">Siteyi Gor</Link>
        </nav>
      </aside>
      <main className="admin-main">
        {!isSupabaseServiceConfigured() ? (
          <div className="admin-card admin-warning">
            Supabase service env ayarlari eksik. Panel acilir, ancak veritabanina yazan islemler calismaz.
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
