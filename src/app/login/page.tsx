import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { loginMember } from "@/lib/member-actions";
import { isMemberAuthConfigured } from "@/lib/member-auth";

type Props = {
  searchParams: Promise<{ error?: string; registered?: string; next?: string }>;
};

export const metadata = { title: "Log In" };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <PublicShell>
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Log in</h1>
          {!isMemberAuthConfigured() ? <div className="auth-error">Membership is not configured yet.</div> : null}
          {params.registered ? (
            <div className="auth-note">Account created. It will be usable after admin approval.</div>
          ) : null}
          {params.error === "pending" ? (
            <div className="auth-error">Your account is not approved yet. Please wait for approval.</div>
          ) : null}
          {params.error === "1" ? <div className="auth-error">Email or password is incorrect.</div> : null}
          {params.error === "config" ? <div className="auth-error">Membership is not configured.</div> : null}
          <form action={loginMember}>
            <input type="hidden" name="next" value={params.next ?? ""} />
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Password
              <input name="password" type="password" required />
            </label>
            <button className="button" type="submit">
              Log in
            </button>
          </form>
          <p style={{ marginTop: 16 }}>
            No account yet? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
