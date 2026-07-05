import Link from "next/link";
import type { ReactNode } from "react";
import { isSupabaseConfigured, requireAdmin } from "@/lib/supabase";

const nav = [
  { href: "/admin", label: "Genel Bakis" },
  { href: "/admin/pages", label: "Icerikler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/messages", label: "Mesajlar" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  if (!isSupabaseConfigured()) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1>Supabase ayari gerekli</h1>
          <p>
            Admin paneli icin `.env` dosyasinda `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` ve
            `SUPABASE_SERVICE_ROLE_KEY` tanimlanmali.
          </p>
          <p>Public site fallback veriyle calisir; CMS islemleri Supabase baglantisi olmadan devre disidir.</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1>Yetki gerekli</h1>
          <p>Admin paneline erismek icin Supabase Auth ile giris yapin.</p>
          <Link className="button" href="/admin/login">
            Giris yap
          </Link>
        </div>
      </div>
    );
  }

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
      <main className="admin-main">{children}</main>
    </div>
  );
}
