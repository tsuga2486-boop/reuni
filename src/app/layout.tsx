import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8751d",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  title: {
    default: "REUNI（リユニ） - 迷子・殺処分ゼロを目指して",
    template: "%s | REUNI（リユニ）",
  },
  description: "大切な家族との再会を支援する。迷子ペットと飼い主を繋ぐプラットフォーム「REUNI（リユニ）」",
  keywords: ["迷子ペット", "ペット探し", "保護動物", "REUNI", "リユニ", "再会", "迷子犬", "迷子猫"],
  openGraph: {
    title: "REUNI（リユニ） - 迷子・殺処分ゼロを目指して",
    description: "大切な家族との再会を支援する。迷子ペットと飼い主を繋ぐプラットフォーム「REUNI（リユニ）」",
    type: "website",
    siteName: "REUNI（リユニ）",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "REUNI（リユニ） - 迷子・殺処分ゼロを目指して",
    description: "大切な家族との再会を支援する。迷子ペットと飼い主を繋ぐプラットフォーム「REUNI（リユニ）」",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <link rel="dns-prefetch" href="https://bhayounoqblcxrokrykl.supabase.co" />
        <link rel="preconnect" href="https://bhayounoqblcxrokrykl.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
