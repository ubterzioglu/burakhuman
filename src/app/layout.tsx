import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Human Consciousness Decoded",
    template: "%s | Human Consciousness Decoded",
  },
  description: "Human Consciousness Decoded by Burak Akcakanat.",
  icons: {
    icon: "/img/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
