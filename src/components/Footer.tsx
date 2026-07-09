import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p>Copyright © HCD BURAK AKCAKANAT</p>
          <p>
            <a
              href="https://ufuksoynakliyat.com.tr/tuzla-evden-eve-nakliyat"
              rel="dofollow"
            >
              Tuzla Evden Eve Nakliyat
            </a>{" "}
            Firması Ufuksoy Nakliyat A.Ş
          </p>
          <p>
            Coding by <a href="http://www.yazarge.com">YAZARGE</a>
          </p>
        </div>
        <div className="footer-newsletter">
          <strong>Stay in the loop</strong>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}
