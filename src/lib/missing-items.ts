export type MissingItemStatus = "missing" | "partial" | "phase_two" | "modernized";

export type MissingItem = {
  id: string;
  title: string;
  area: string;
  priority: "low" | "normal" | "high";
  status: MissingItemStatus;
  oldSource: string;
  currentState: string;
  needed: string;
};

export const missingItems: MissingItem[] = [
  {
    id: "membership",
    title: "Public uye girisi, kayit, profil ve logout",
    area: "Uyelik",
    priority: "high",
    status: "modernized",
    oldSource: "signup.aspx, login.aspx, profile.aspx, logout.aspx, usersessions/uye",
    currentState:
      "Eklendi: /signup, /login, /logout, /profile. members tablosu + scrypt hash + HMAC imzali cookie. Kayit sonrasi admin onayi bekler. Header'da Login/Profile/Logout dinamik.",
    needed: "Opsiyonel: parola sifirlama akisi ve eski uye datasi migration'i (plaintext parolalar guvenli tasinamaz).",
  },
  {
    id: "orders",
    title: "Siparis gecmisi ve e-kitap yetki kontrolu",
    area: "Siparis",
    priority: "high",
    status: "modernized",
    oldSource: "profile.aspx.cs, product1.aspx.cs, siparis tablosu",
    currentState:
      "Eklendi: orders/products tablolari, /profile'da siparis gecmisi, hasCompletedOrder ile indirme yetkisi ve /download/[format] korumali endpoint.",
    needed: "Gercek e-kitap dosyalarinin admin'den private bucket'a yuklenmesi.",
  },
  {
    id: "paypal",
    title: "PayPal odeme, success/failed callback ve guvenli indirme",
    area: "Odeme",
    priority: "high",
    status: "modernized",
    oldSource: "App_Code/paypal.cs, success.aspx.cs, failed.aspx.cs, product1.aspx.cs",
    currentState:
      "Eklendi: PayPal Orders v2 (server-side create+capture+webhook imza dogrulama), /checkout/success + /checkout/cancel. Fiyat DB'den; return-url'e guvenilmiyor. Env yoksa banka havale-only gated.",
    needed: "PAYPAL_CLIENT_ID/SECRET/WEBHOOK_ID ve NEXT_PUBLIC_PAYPAL_CLIENT_ID env degerleri.",
  },
  {
    id: "media-library",
    title: "Tam medya/dosya yonetimi",
    area: "Admin CMS",
    priority: "normal",
    status: "modernized",
    oldSource: "Admin/medya.aspx, Admin/files.aspx, Admin/file.aspx, _kapakyap.aspx, sayfa.orjinalkayitpf",
    currentState:
      "Eklendi: /admin/media global kutuphane, gorsel+dosya yukleme (uzanti whitelist), silme (Storage'dan da), icerik ekraninda galeri + kapak yapma.",
    needed: "Istenirse drag-drop siralama ve Storage image transform politikasi.",
  },
  {
    id: "content-type-admin",
    title: "Icerik tipi yonetimi ve dinamik alan etiketleri",
    area: "Admin CMS",
    priority: "normal",
    status: "modernized",
    oldSource: "Admin/types.aspx, Admin/type.aspx",
    currentState:
      "Eklendi: /admin/types CRUD (label'lar + has_* bayraklari). Icerik formu secili tipin bayraklarina/label'larina gore dinamik.",
    needed: "-",
  },
  {
    id: "tags",
    title: "Etiket/tag girisi ve blog detayinda kullanimi",
    area: "Icerik",
    priority: "normal",
    status: "modernized",
    oldSource: "sayfa.etiketler, sayfa.etiketleriekle, etiket tablosu",
    currentState: "Eklendi: icerik formunda tag alani (has_tags tiplerinde), blog detayinda chip render ve metadata keywords.",
    needed: "-",
  },
  {
    id: "mailing-list",
    title: "Mailing list / bulten yonetimi",
    area: "Admin CMS",
    priority: "low",
    status: "modernized",
    oldSource: "Admin/maillist.aspx, mailing list akisi",
    currentState: "Eklendi: footer public abonelik formu + /api/newsletter (dedup), /admin/mailing liste + CSV export + sil.",
    needed: "Istenirse opt-in/onay maili.",
  },
  {
    id: "admin-users",
    title: "Admin hesap/profil yonetimi",
    area: "Admin",
    priority: "low",
    status: "modernized",
    oldSource: "Admin/hesap.aspx, Admin/hesaplar.aspx, Admin/profil.aspx, admin/adminsessions",
    currentState: "Eski coklu admin hesabinin yerine .env tabanli tek sifre girisi var.",
    needed: "Coklu admin istenecekse kullanici/rol modeli ve parola degistirme ekrani eklenmeli.",
  },
  {
    id: "order-admin",
    title: "Admin siparis ekrani ve siparis onay akisi",
    area: "Admin Siparis",
    priority: "normal",
    status: "modernized",
    oldSource: "Admin/siparisler.aspx, Admin/siparisdetay.aspx, _siparisonayla.aspx, _siparisKntrl.aspx",
    currentState:
      "Eklendi: /admin/orders liste (paid<->completed toggle, pending/cancelled sil), /admin/orders/[id] detay + admin notu. Ayrica /admin/members onay ve /admin/bank-accounts CRUD.",
    needed: "-",
  },
  {
    id: "seo-social",
    title: "Eski SEO/social scriptlerinin birebir karsiligi",
    area: "Public",
    priority: "low",
    status: "partial",
    oldSource: "sayfa.seo, MasterPage.master ShareThis, Google Analytics UA-63716117-1",
    currentState:
      "site_options (seo_title/seo_description/og_image) artik Next metadata + Open Graph'a bagli (/admin/settings'ten yonetilir). ShareThis hover ve eski GA scripti (UA) hala eklenmedi.",
    needed: "Guncel analytics/tag manager (GA4) karari ve OG image gorsel stratejisi.",
  },
  {
    id: "legacy-plugins",
    title: "Eski jQuery plugin davranislarinin tam birebirligi",
    area: "Frontend",
    priority: "low",
    status: "modernized",
    oldSource: "revolution slider, layerslider, fancybox, isotope, royalSlider, jPlayer, price regulator",
    currentState: "Gorunum React/CSS ile yeniden kuruldu; eski plugin seti birebir tasinmadi.",
    needed: "Birebir animasyon/galeri istenirse modern React karsiliklari secilip tek tek uygulanmali.",
  },
  {
    id: "data-migration",
    title: "Eski MySQL iceriklerinin tam veri migration'i",
    area: "Veri",
    priority: "high",
    status: "partial",
    oldSource: "pages, categories, files, options, messages, uye, siparis MySQL tablolari",
    currentState: "Supabase semasi ve fallback icerikler var; tam eski MySQL dump/CSV aktarimi bu repoda yok.",
    needed: "Eski MySQL export'u ile pages/categories/files/options/messages ve gerekiyorsa uye/siparis verilerinin Supabase'e aktarimi.",
  },
];

export const missingStatusLabels: Record<MissingItemStatus, string> = {
  missing: "Eksik",
  partial: "Kismi",
  phase_two: "Faz 2",
  modernized: "Modernize edildi",
};

export function missingItemsByStatus(status: MissingItemStatus) {
  return missingItems.filter((item) => item.status === status);
}
