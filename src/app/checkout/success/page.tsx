import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = { title: "Payment Received" };

export default function CheckoutSuccessPage() {
  return (
    <PublicShell>
      <section className="page-title">
        <div className="container">
          <h1>Thank you</h1>
        </div>
      </section>
      <section className="content-section">
        <div className="container">
          <div className="pricing-success">
            <p>Your payment has been received and verified. Your e-book downloads are now available.</p>
            <div className="download-row">
              <Link className="button" href="/product1">
                Go to downloads
              </Link>
              <Link className="button button-light" href="/profile">
                View my orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
