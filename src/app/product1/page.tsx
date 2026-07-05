import Image from "next/image";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "HCD E-Book",
};

export default function ProductPage() {
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
            <p>
              Your e-book is going to be 190-200 pages depending on your format. First release purchasing is handled through external
              store links; protected downloads and PayPal member flow are planned for phase two.
            </p>
            <div className="download-row">
              <a className="button" href="http://www.amazon.com/dp/B00YJP1ODE" target="_blank" rel="noopener noreferrer">
                Buy Kindle
              </a>
              <a className="button" href="https://amzn.com/6058456630" target="_blank" rel="noopener noreferrer">
                Buy Paperback
              </a>
              <a className="button button-warning" href="/Dosyalar/books/book1.jpg" target="_blank" rel="noopener noreferrer">
                View Cover
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
