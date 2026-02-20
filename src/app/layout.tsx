import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrganizationJsonLd, WebSiteJsonLd, WebApplicationJsonLd } from "@/components/seo/JsonLd";

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
  metadataBase: new URL('https://reuni.jp'),
  title: {
    default: "REUNI（リユニ） - 迷子ペット捜索・保護情報の共有プラットフォーム",
    template: "%s | REUNI（リユニ）",
  },
  description: "REUNI（リユニ）は迷子になったペットと飼い主の再会を支援する無料プラットフォーム。犬・猫の迷子届け、目撃・保護情報の投稿、地図での捜索エリア確認、飼い主への直接連絡が可能。迷子犬・迷子猫を見つけたら今すぐ投稿。",
  keywords: ["迷子ペット", "ペット 迷子", "迷子犬", "迷子猫", "犬 いなくなった", "猫 いなくなった", "ペット探し", "ペット捜索", "保護犬", "保護猫", "迷子犬 探し方", "迷子猫 探し方", "ペット 行方不明", "迷子ペット 掲示板", "迷子ペット 検索", "目撃情報", "保護動物", "REUNI", "リユニ", "迷子 届出", "ペット 見つけた", "殺処分ゼロ"],
  openGraph: {
    title: "REUNI（リユニ） - 迷子ペット捜索・保護情報の共有プラットフォーム",
    description: "迷子になった犬・猫の情報を登録・検索。目撃・保護情報の投稿、地図での捜索、飼い主への直接連絡が可能。すべて無料。",
    type: "website",
    siteName: "REUNI（リユニ）",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "REUNI（リユニ） - 迷子ペット捜索・保護情報の共有プラットフォーム",
    description: "迷子になった犬・猫の情報を登録・検索。目撃・保護情報の投稿、地図での捜索、飼い主への直接連絡が可能。すべて無料。",
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
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <WebApplicationJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
