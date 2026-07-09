import { AdminShell } from "@/components/AdminShell";
import { getAdminDashboardData } from "@/lib/data";

export const metadata = { title: "Durum Raporu" };

type Row = { baslik: string; detay: string };

const alabildiklerimiz: { grup: string; maddeler: Row[] }[] = [
  {
    grup: "CMS parity (tamamlandı)",
    maddeler: [
      { baslik: "İçerik tipi yönetimi", detay: "/admin/types CRUD + içerik formu seçili tipin has_* bayrak ve label'larına göre dinamik." },
      { baslik: "Etiketler (tags)", detay: "İçerik formunda tag girişi, blog detayında chip + metadata keywords." },
      { baslik: "Mailing list", detay: "Footer abonelik formu + /api/newsletter (dedup) + /admin/mailing liste, CSV export, sil." },
      { baslik: "Medya kütüphanesi", detay: "/admin/media global depo; görsel+dosya yükleme (whitelist), silme (Storage dahil), içerik ekranında galeri + kapak yapma." },
      { baslik: "Kategori & mesaj & sıralama", detay: "Kategori edit/sil, mesaj arşiv/sil + durum filtresi, içerik rank ↑/↓, SEO options → metadata/OG." },
    ],
  },
  {
    grup: "E-ticaret / üyelik (tamamlandı)",
    maddeler: [
      { baslik: "Üyelik", detay: "signup/login/logout/profile; members tablosu + scrypt hash + HMAC cookie; kayıt sonrası admin onayı." },
      { baslik: "Sipariş", detay: "orders/products tabloları, profilde sipariş geçmişi, hasCompletedOrder yetki kontrolü." },
      { baslik: "Banka hesapları", detay: "/admin/bank-accounts CRUD; product1'de havale talimatı." },
      { baslik: "Admin ticaret ekranları", detay: "/admin/members (onay/engelle), /admin/orders + /orders/[id] (durum toggle, admin notu, sil)." },
    ],
  },
  {
    grup: "Altyapı / kurulum (yapıldı)",
    maddeler: [
      { baslik: "Supabase şeması", detay: "16 tablo uygulandı (yeni: members, products, orders, product_assets, bank_accounts). Ürün seed edildi." },
      { baslik: "Storage bucket'ları", detay: "legacy-assets (public) + member-assets (private) oluşturuldu." },
      { baslik: "Env & doğrulama", detay: "MEMBER_SESSION_SECRET eklendi. typecheck + lint + build temiz; uçtan uca smoke test geçti." },
    ],
  },
];

const alamadiklarimiz: { durum: "gated" | "veri" | "karar"; baslik: string; detay: string }[] = [
  {
    durum: "gated",
    baslik: "PayPal canlı ödeme akışı",
    detay:
      "Kod tam (Orders v2 create + capture + webhook imza doğrulama). Ancak PAYPAL_CLIENT_ID/SECRET/WEBHOOK_ID ve NEXT_PUBLIC_PAYPAL_CLIENT_ID sağlanmadı; şu an UI otomatik olarak banka havale-only modunda.",
  },
  {
    durum: "veri",
    baslik: "Gerçek e-kitap dosyaları",
    detay:
      "epub/mobi/pdf + kapak elde yok. (Paylaşılan Google Drive linki kesildi.) Korumalı indirme, dosyalar admin panelinden member-assets private bucket'ına yüklenince çalışır.",
  },
  {
    durum: "veri",
    baslik: "Eski MySQL veri migration'ı",
    detay:
      "hcd_db dump'ı repoda yok; içerik/üye/sipariş verisi taşınmadı (yalnız şema + fallback). Eski parolalar plaintext olduğundan güvenli taşınamaz → üyeler yeniden kayıt / parola sıfırlama gerekir.",
  },
  {
    durum: "karar",
    baslik: "Eski analytics / social",
    detay: "options→metadata bağlandı; eski Google Analytics (UA) ve ShareThis birebir taşınmadı. GA4/tag-manager kararı bekliyor.",
  },
];

const kalanlar: Row[] = [
  { baslik: "E-kitap dosyalarını yükle", detay: "Admin > Banka Hesapları ekranındaki ürün bölümünden epub/mobi/pdf/cover yüklemesi." },
  { baslik: "PayPal env'lerini gir", detay: "Sandbox ile uçtan uca ödeme → capture → webhook → indirme testi." },
  { baslik: "Veri aktarımı", detay: "Eski MySQL içerik/kategori/dosya (ve gerekiyorsa üye) verisinin Supabase'e migration script'i." },
  { baslik: "Parola sıfırlama", detay: "Üye 'forgot password' akışı ve e-posta doğrulaması (opsiyonel)." },
  { baslik: "Güvenlik", detay: ".env.local'daki canlı service-role anahtarı repoda commit'li — rotate edilmesi ve geçmişten temizlenmesi önerilir." },
];

const durumEtiket: Record<string, { label: string; cls: string }> = {
  gated: { label: "Env gerekli", cls: "status-paid" },
  veri: { label: "Veri/dosya gerekli", cls: "status-pending" },
  karar: { label: "Karar bekliyor", cls: "status-cancelled" },
};

export default async function AdminRaporPage() {
  const { pages, categories, members, orders, messages } = await getAdminDashboardData();

  return (
    <AdminShell>
      <div className="admin-card">
        <h1>Durum Raporu — Ne alabildik / Ne alamadık / Ne kaldı</h1>
        <p>Legacy (lastref, ASP.NET + MySQL) → mevcut Next.js + Supabase fonksiyonel parity çalışmasının özeti.</p>
        <div className="admin-grid">
          <div className="metric"><span>İçerik</span><strong>{pages.length}</strong></div>
          <div className="metric"><span>Kategori</span><strong>{categories.length}</strong></div>
          <div className="metric"><span>Üye</span><strong>{members.length}</strong></div>
          <div className="metric"><span>Sipariş</span><strong>{orders.length}</strong></div>
          <div className="metric"><span>Mesaj</span><strong>{messages.length}</strong></div>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>✅ Ne alabildik (tamamlananlar)</h2>
        {alabildiklerimiz.map((grup) => (
          <div key={grup.grup} style={{ marginTop: 14 }}>
            <h3>{grup.grup}</h3>
            <table className="table">
              <tbody>
                {grup.maddeler.map((madde) => (
                  <tr key={madde.baslik}>
                    <td style={{ width: 220 }}>
                      <span className="status-pill status-completed">Tamam</span> {madde.baslik}
                    </td>
                    <td>{madde.detay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>⚠️ Ne alamadık / emin olamadık</h2>
        <table className="table">
          <tbody>
            {alamadiklarimiz.map((madde) => (
              <tr key={madde.baslik}>
                <td style={{ width: 220 }}>
                  <span className={`status-pill ${durumEtiket[madde.durum].cls}`}>{durumEtiket[madde.durum].label}</span>{" "}
                  {madde.baslik}
                </td>
                <td>{madde.detay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h2>⏳ Ne kaldı (sonraki adımlar)</h2>
        <table className="table">
          <tbody>
            {kalanlar.map((madde) => (
              <tr key={madde.baslik}>
                <td style={{ width: 220 }}>{madde.baslik}</td>
                <td>{madde.detay}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          Detaylı kalem-kalem durum için <a href="/admin/missing">Eksik Kalanlar</a> ekranına bakın. Statik HTML sürüm repo kökünde{" "}
          <code>rapor.html</code>.
        </p>
      </div>
    </AdminShell>
  );
}
