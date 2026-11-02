import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { BRAND, INDEXABLE, SITE_URL } from "@/lib/site";
import "@/styles/site.css";
import "@/styles/admin.css";

// Self-hosted by Next at build time: no request reaches Google from the visitor's browser.
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pommeau filtrant",
  applicationName: BRAND,
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
