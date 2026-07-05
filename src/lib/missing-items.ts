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
    status: "phase_two",
    oldSource: "signup.aspx, login.aspx, profile.aspx, logout.aspx, usersessions/uye",
    currentState: "Yeni sitede public uye girisi yok; header'daki Sign In / Sign Up ve profil menusu kaldirildi.",
    needed: "Supabase/Auth veya ozel uye modeli, profil sayfasi, session akisi ve eski uye datasi migration'i.",
  },
  {
    id: "orders",
    title: "Siparis gecmisi ve e-kitap yetki kontrolu",
    area: "Siparis",
    priority: "high",
    status: "phase_two",
    oldSource: "profile.aspx.cs, product1.aspx.cs, siparis tablosu",
    currentState: "Product sayfasi Amazon/harici linklere yonlendiriyor; satin alma gecmisi ve indirme kilidi yok.",
    needed: "siparis tablosu, uye-siparis iliskisi, indirme yetkisi ve profil icinde order history.",
  },
  {
    id: "paypal",
    title: "PayPal odeme, success/failed callback ve guvenli indirme",
    area: "Odeme",
    priority: "high",
    status: "phase_two",
    oldSource: "App_Code/paypal.cs, success.aspx.cs, failed.aspx.cs, product1.aspx.cs",
    currentState: "Odeme modernize edilmedi; ilk surum harici satis linkleriyle calisiyor.",
    needed: "Server-side odeme dogrulama, callback guvenligi, siparis durumu guncelleme ve protected download endpoint'i.",
  },
  {
    id: "media-library",
    title: "Tam medya/dosya yonetimi",
    area: "Admin CMS",
    priority: "normal",
    status: "partial",
    oldSource: "Admin/medya.aspx, Admin/files.aspx, Admin/file.aspx, _kapakyap.aspx, sayfa.orjinalkayitpf",
    currentState: "Icerik duzenleme ekraninda alt gorsel yukleme var; tam medya kutuphanesi, dosya turleri, siralama ve silme yok.",
    needed: "Medya listesi, dosya yukleme, gorsel/dosya ayrimi, silme, siralama, kapak secme ve resize/storage politikasi.",
  },
  {
    id: "content-type-admin",
    title: "Icerik tipi yonetimi ve dinamik alan etiketleri",
    area: "Admin CMS",
    priority: "normal",
    status: "partial",
    oldSource: "Admin/types.aspx, Admin/type.aspx",
    currentState: "content_types semasi var ve seed ediliyor; admin panelinde tip CRUD ekrani yok.",
    needed: "Tip ekleme/duzenleme, alan label'lari, has_picture/has_tags/has_sub_files gibi kontrollerin UI'a baglanmasi.",
  },
  {
    id: "tags",
    title: "Etiket/tag girisi ve blog detayinda kullanimi",
    area: "Icerik",
    priority: "normal",
    status: "partial",
    oldSource: "sayfa.etiketler, sayfa.etiketleriekle, etiket tablosu",
    currentState: "tags tablosu semada var; admin formunda tag alani ve public render yok.",
    needed: "Icerik formuna tag girisi, listeleme, blog detayinda/meta alanlarda kullanma.",
  },
  {
    id: "mailing-list",
    title: "Mailing list / bulten yonetimi",
    area: "Admin CMS",
    priority: "low",
    status: "partial",
    oldSource: "Admin/maillist.aspx, mailing list akisi",
    currentState: "mailing_list tablosu var; public abonelik formu ve admin liste ekrani yok.",
    needed: "Abonelik formu, admin listeleme/export, duplicate kontrolu ve opt-in metni.",
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
    status: "phase_two",
    oldSource: "Admin/siparisler.aspx, Admin/siparisdetay.aspx, _siparisonayla.aspx, _siparisKntrl.aspx",
    currentState: "Yeni panelde siparis bolumu yok; odeme/uye modulu olmadigi icin bagimli durumda.",
    needed: "Odeme modulu geldikten sonra siparis listeleme, detay, durum guncelleme ve manuel onay.",
  },
  {
    id: "seo-social",
    title: "Eski SEO/social scriptlerinin birebir karsiligi",
    area: "Public",
    priority: "low",
    status: "partial",
    oldSource: "sayfa.seo, MasterPage.master ShareThis, Google Analytics UA-63716117-1",
    currentState: "Next metadata temel title/description/favicon veriyor; ShareThis hover ve eski GA scripti eklenmedi.",
    needed: "Guncel analytics/tag manager karari, OG image stratejisi, site_options degerlerinin metadata'ya baglanmasi.",
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
