import type { Metadata } from "next";
// @ts-ignore: CSS module import without type declarations
import "./globals.css";
import Navbar from "@/components/Navbar";
import AiChatWidget from "@/components/AiChatWidget";
import GlobalNotifications from "@/components/GlobalNotifications";

export const metadata: Metadata = {
  title: "بنة تونسية",
  description: "Marketplace culinaire tunisienne pour plats faits maison, formations et recettes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <GlobalNotifications />
        <AiChatWidget />
      </body>
    </html>
  );
}
