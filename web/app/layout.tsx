import type { Metadata } from "next";
import { Inter, Newsreader, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { stocks } from "@/lib/mock-data";
import { OrganizationSchema } from "./components/json-ld";
import { LangProvider } from "./components/lang-provider";
import { TopRail } from "./components/top-rail";
import { TickerBar } from "./components/ticker-bar";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });
const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "GamePulse — Gaming Business Intelligence", template: "%s" },
  description: "The gaming industry's business moves, distilled. Coverage of acquisitions, earnings, funding, and market shifts updated three times daily.",
  metadataBase: new URL("https://gamepulse.news"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "GamePulse — Gaming Business Intelligence",
    description: "The gaming industry's business moves, distilled.",
    url: "https://gamepulse.news",
    siteName: "GamePulse",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "GamePulse", description: "Gaming industry business intelligence." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <OrganizationSchema />
        <LangProvider>
          <TopRail />
          <TickerBar stocks={stocks} />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
