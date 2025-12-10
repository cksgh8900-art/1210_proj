import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkLocalization } from "@/lib/clerk-localization";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Trip - 한국 관광지 정보 서비스",
    template: "%s | My Trip",
  },
  description: "전국의 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스입니다.",
  keywords: [
    "한국 관광지",
    "여행 정보",
    "관광지 검색",
    "한국 여행",
    "관광지 지도",
    "여행 계획",
    "한국관광공사",
    "관광지 정보",
  ],
  authors: [{ name: "My Trip Team" }],
  creator: "My Trip",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "My Trip - 한국 관광지 정보 서비스",
    description: "전국의 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스입니다.",
    siteName: "My Trip",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Trip - 한국 관광지 정보 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description: "전국의 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스입니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="ko" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SyncUserProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
            </SyncUserProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
