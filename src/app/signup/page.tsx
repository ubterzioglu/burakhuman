import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { signupMember } from "@/lib/member-actions";
import { isMemberAuthConfigured } from "@/lib/member-auth";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<string, string> = {
  config: "Uyelik sistemi yapilandirilmamis (MEMBER_SESSION_SECRET eksik).",
  invalid: "Lutfen tum alanlari dogru doldurun (parola en az 8 karakter).",
  exists: "Bu e-posta ile zaten bir kayit var.",
};

export const metadata = { title: "Sign Up" };

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <PublicShell>
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Create account</h1>
          {!isMemberAuthConfigured() ? (
            <div className="auth-error">Membership is not configured yet.</div>
          ) : null}
          {params.error ? <div className="auth-error">{errors[params.error] || "Kayit tamamlanamadi."}</div> : null}
          <form action={signupMember}>
            <label>
              Full name
              <input name="full_name" required minLength={2} />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Country
              <input name="country" />
            </label>
            <label>
              Password (min 8 chars)
              <input name="password" type="password" required minLength={8} />
            </label>
            <button className="button" type="submit">
              Sign up
            </button>
          </form>
          <p style={{ marginTop: 16 }}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
          <p style={{ fontSize: 13, color: "#777" }}>New accounts require admin approval before first login.</p>
        </div>
      </div>
    </PublicShell>
  );
}
