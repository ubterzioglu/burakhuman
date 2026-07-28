import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p>Copyright © HCD BURAK AKCAKANAT</p>
          <p>
            Coding by <a href="http://www.yazarge.com">YAZARGE</a>
          </p>
        </div>
        <div className="footer-newsletter">
          <strong>Stay in the loop</strong>
          <NewsletterForm />
          <div className="footer-partners">
            <p>
              <a
                href="https://lionerotik.com/urunler/fetis-urunleri"
                rel="dofollow"
              >
                Antalya Seks Shop
              </a>{" "}
              Lion Erotik
            </p>
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
              <a
                href="https://tekhurdametal.com/hurda-demir-fiyatlari/"
                rel="dofollow"
              >
                Demir Hurda Fiyatları
              </a>{" "}
              Tek Hurda Metal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
