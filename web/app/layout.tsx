import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { stocks } from "@/lib/mock-data";
import { TickerBar } from "./components/ticker-bar";
import { OrganizationSchema } from "./components/json-ld";
import { LangProvider } from "./components/lang-provider";
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
    default: "GamePulse - Gaming Industry Business Intelligence",
    template: "%s",
  },
  description:
    "The gaming industry's business moves, distilled. Coverage of acquisitions, earnings, funding, and market shifts updated three times daily.",
  metadataBase: new URL("https://gamepulse.news"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "GamePulse - Gaming Industry Business Intelligence",
    description: "The gaming industry's business moves, distilled. Coverage of acquisitions, earnings, funding, and market shifts.",
    url: "https://gamepulse.news",
    siteName: "GamePulse",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GamePulse",
    description: "Gaming industry business intelligence. Updated three times daily.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <OrganizationSchema />
        <LangProvider>
          <TickerBar stocks={stocks} />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
