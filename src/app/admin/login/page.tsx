import Link from "next/link";
import { login } from "@/lib/admin-actions";
import { isSupabaseConfigured } from "@/lib/supabase";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="login-wrap">
      <form className="login-card form-grid" action={login}>
        <h1>Admin Girisi</h1>
        {!isSupabaseConfigured() ? <p className="status-error">Supabase env ayarlari eksik.</p> : null}
        {params.error ? <p className="status-error">E-posta veya sifre hatali.</p> : null}
        <label>
          E-posta
          <input className="input" type="email" name="email" required />
        </label>
        <label>
          Sifre
          <input className="input" type="password" name="password" required />
        </label>
        <button className="button" type="submit">
          Giris yap
        </button>
        <Link href="/">Siteye don</Link>
      </form>
    </div>
  );
}
