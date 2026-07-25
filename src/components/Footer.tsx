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
          <p className="partner-links">
            <span><a href="https://tekhurdametal.com/istanbul-hurdaci/" rel="dofollow">İstanbul Hurdacı</a> Firması Tek Hurda Metal A.Ş</span>{" · "}
            <span><a href="https://tekhurdametal.com/hurda-fiyatlari/" rel="dofollow">Hurda Fiyatları</a> Tek Hurda Metal</span>{" · "}
            <span><a href="https://tekhurdametal.com/hurda-demir-fiyatlari/" rel="dofollow">Demir Hurda Fiyatları</a> Tek Hurda Metal</span>{" · "}
            <span><a href="https://tekhurdametal.com/beylikduzu-hurdaci/" rel="dofollow">Beylikdüzü Hurdacı</a> Firması Tek Hurda Metal A.Ş</span>{" · "}
            <span><a href="https://lionerotik.com/urunler/fetis-urunleri" rel="dofollow">Antalya Sex Shop</a> Lion Erotik</span>{" · "}
            <span><a href="https://lionerotik.com/urunler/fetis-urunleri" rel="dofollow">Antalya Erotik Shop</a> Lion Erotik</span>{" · "}
            <span><a href="https://lionerotik.com/urunler/fetis-urunleri" rel="dofollow">Antalya Seks Shop</a> Lion Erotik</span>
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
