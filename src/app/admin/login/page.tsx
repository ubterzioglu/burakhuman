import Link from "next/link";
import { login } from "@/lib/admin-actions";
import { isAdminAuthConfigured } from "@/lib/supabase";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="login-wrap">
      <form className="login-card form-grid" action={login}>
        <h1>Admin Girisi</h1>
        {!isAdminAuthConfigured() || params.error === "config" ? (
          <p className="status-error">ADMIN_PASSWORD ve ADMIN_SESSION_SECRET tanimli degil.</p>
        ) : null}
        {params.error === "1" ? <p className="status-error">Sifre hatali.</p> : null}
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
