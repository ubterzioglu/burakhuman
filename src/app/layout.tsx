import type { Metadata } from "next";
import { getSiteOptions } from "@/lib/data";
import "./globals.css";

function parseUrl(input: string) {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const options = await getSiteOptions();
  const siteTitle = options.seo_title?.trim() || "Human Consciousness Decoded";
  const siteDescription = options.seo_description?.trim() || "Human Consciousness Decoded by Burak Akcakanat.";
  const siteUrl = options.site_url?.trim() || "https://humanconsciousnessdecoded.com";
  const metadataBase = parseUrl(siteUrl) || undefined;
  const ogImage = options.og_image?.trim() || "/img/logo.png";
  const keywordSource = options.seo_keywords?.trim() || "human consciousness decoded, burak akcakanat, consciousness, book";
  const keywords = keywordSource
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    metadataBase,
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    applicationName: siteTitle,
    authors: [{ name: "Burak Akcakanat" }],
    creator: "Burak Akcakanat",
    publisher: "Burak Akcakanat",
    keywords,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: siteTitle,
      title: siteTitle,
      description: siteDescription,
      locale: options.og_locale?.trim() || "en_US",
      images: [
        {
          url: ogImage,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [ogImage],
    },
    icons: {
      icon: "/img/favicon.ico",
    },
    other: {
      "geo.region": options.geo_region?.trim() || "TR-34",
      "geo.placename": options.geo_placename?.trim() || "Tuzla, Istanbul",
      "geo.position": options.geo_position?.trim() || "40.8153;29.3005",
      ICBM: options.geo_icbm?.trim() || "40.8153, 29.3005",
      "geo.country": options.geo_country?.trim() || "TR",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
