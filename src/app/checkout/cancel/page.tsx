import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = { title: "Payment Cancelled" };

export default function CheckoutCancelPage() {
  return (
    <PublicShell>
      <section className="page-title">
        <div className="container">
          <h1>Payment cancelled</h1>
        </div>
      </section>
      <section className="content-section">
        <div className="container">
          <div className="pricing-info">
            <p>Your payment was cancelled and you have not been charged. You can try again anytime.</p>
            <div className="download-row">
              <Link className="button" href="/product1">
                Back to the e-book
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
