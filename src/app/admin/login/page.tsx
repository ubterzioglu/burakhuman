import Link from "next/link";
import { login } from "@/lib/admin-actions";
import { isAdminAuthConfigured } from "@/lib/supabase";

type Props = {
  searchParams: Promise<{ error?: string; return?: string }>;
};

export const metadata = { title: "Admin Girisi" };

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const notConfigured = !isAdminAuthConfigured() || params.error === "config";

  return (
    <div className="admin-auth">
      <aside className="admin-auth-brand">
        <div className="admin-auth-brand-inner">
          <span className="admin-auth-logo">HCD</span>
          <h2>Yonetim Paneli</h2>
          <p>Human Consciousness Decoded — icerik, uye ve siparis yonetimi tek panelde.</p>
          <ul>
            <li>Icerik, blog, kategori ve medya yonetimi</li>
            <li>Uye, siparis ve odeme takibi</li>
            <li>Tek girisle tum bolumlere erisim</li>
          </ul>
        </div>
        <span className="admin-auth-brand-foot">© HCD · Burak Akcakanat</span>
      </aside>

      <main className="admin-auth-panel">
        <form className="admin-auth-card" action={login}>
          <span className="admin-auth-badge">Guvenli giris</span>
          <h1>Tekrar hos geldin</h1>
          <p className="admin-auth-sub">Devam etmek icin yonetici parolani gir.</p>

          <input type="hidden" name="return" value={params.return ?? ""} />

          {notConfigured ? (
            <p className="admin-auth-error">ADMIN_PASSWORD ve ADMIN_SESSION_SECRET tanimli degil.</p>
          ) : null}
          {params.error === "1" ? <p className="admin-auth-error">Parola hatali, tekrar dene.</p> : null}

          <label className="admin-auth-field">
            <span>Parola</span>
            <input type="password" name="password" required autoFocus placeholder="••••••••" disabled={notConfigured} />
          </label>

          <button className="admin-auth-submit" type="submit" disabled={notConfigured}>
            Giris yap
          </button>

          <Link className="admin-auth-back" href="/">
            ← Siteye don
          </Link>
        </form>
      </main>
    </div>
  );
}
