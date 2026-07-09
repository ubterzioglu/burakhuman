import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { BuyButton } from "./BuyButton";
import { getBankAccounts, getProductBySlug, hasCompletedOrder } from "@/lib/data";
import { getCurrentMember } from "@/lib/member-auth";

export const metadata = {
  title: "HCD E-Book",
};

const downloadFormats = [
  { kind: "epub", label: "Download EPUB" },
  { kind: "mobi", label: "Download MOBI (Kindle)" },
  { kind: "pdf", label: "Download PDF" },
] as const;

function formatPrice(cents: number, currency: string) {
  return `${currency === "USD" ? "$" : ""}${(cents / 100).toFixed(2)}`;
}

export default async function ProductPage() {
  const [member, product] = await Promise.all([getCurrentMember(), getProductBySlug("hcd-ebook")]);
  const owned = member && product ? await hasCompletedOrder(member.id, product.id) : false;
  const bankAccounts = member && product && !owned ? await getBankAccounts() : [];
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const price = product ? formatPrice(product.price_cents, product.currency) : "$9.99";

  return (
    <PublicShell>
      <div className="breadcrumb-box" />
      <section className="page-title">
        <div className="container">
          <h1>HCD E-BOOK FORMATS</h1>
          <p className="lead">Epub, Kindle or Pdf</p>
        </div>
      </section>
      <section className="content-section">
        <div className="container product-grid">
          <Image className="product-cover" src="/Dosyalar/books/product1.jpg" alt="HCD E-Book" width={420} height={620} />
          <div>
            <p className="lead">
              <strong>
                You are about to buy the first version of HCD Human Consciousness Decoded. Please contribute with your feedback after
                reading.
              </strong>
            </p>
            <p>Your e-book is 190-200 pages depending on your format. Price: {price}.</p>

            {!member ? (
              <div className="pricing-info">
                <p>Please log in to purchase and download the e-book.</p>
                <div className="download-row">
                  <Link className="button" href="/login?next=/product1">
                    Log in to buy
                  </Link>
                  <Link className="button button-light" href="/signup">
                    Create account
                  </Link>
                </div>
              </div>
            ) : owned ? (
              <div className="pricing-success">
                <p>Thank you — your purchase is complete. Download your files:</p>
                <div className="download-row">
                  {downloadFormats.map((format) => (
                    <a key={format.kind} className="button" href={`/download/${format.kind}`}>
                      {format.label}
                    </a>
                  ))}
                  <a className="button button-light" href={`/download/${"cover"}`}>
                    Cover
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {product ? <BuyButton paypalClientId={paypalClientId} price={price} /> : null}
                {bankAccounts.length ? (
                  <div className="pricing-info" style={{ marginTop: 18 }}>
                    <strong>Prefer bank transfer?</strong>
                    <p>Transfer {price} to one of the accounts below and email us the receipt; access is granted after confirmation.</p>
                    <ul>
                      {bankAccounts.map((account) => (
                        <li key={account.id}>
                          {account.bank_name} — {account.account_name}
                          {account.iban ? ` — IBAN: ${account.iban}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            <div className="download-row" style={{ marginTop: 20 }}>
              <a className="button button-light" href="http://www.amazon.com/dp/B00YJP1ODE" target="_blank" rel="noopener noreferrer">
                Also on Kindle
              </a>
              <a className="button button-light" href="https://amzn.com/6058456630" target="_blank" rel="noopener noreferrer">
                Paperback (Amazon)
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
