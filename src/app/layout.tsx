import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import { AnnouncementBar } from "@/components/sites/raycon/announcement-bar";
import { CartDrawer } from "@/components/sites/raycon/cart-drawer";
import { FloatingChatWidget } from "@/components/sites/raycon/floating-chat-widget";
import { SiteFooter } from "@/components/sites/raycon/footer";
import { SiteHeader } from "@/components/sites/raycon/header";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RYVO, Your Everyday Tech – RYVO Audio Vietnam",
  description:
    "Thương hiệu âm thanh cá nhân RYVO. Tai nghe chống ồn Hybrid ANC, tai nghe truyền âm qua xương Bone Conduction, pin bền bỉ cả ngày dài.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/uei0psq.css" />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AnnouncementBar />
        <SiteHeader />
        {children}
        <SiteFooter />
        <CartDrawer />
        <FloatingChatWidget />
      </body>
    </html>
  );
}
