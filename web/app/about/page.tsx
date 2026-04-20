import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { WebPageSchema, BreadcrumbSchema } from "@/app/components/json-ld";

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description: "GamePulse is an AI-powered gaming industry business intelligence platform. Learn about our editorial methodology, data sources, and mission.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <WebPageSchema title="About GamePulse" description="Editorial mission, methodology, and data sources." url="/about" />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "About", url: "/about" }]} />

      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="font-editorial text-2xl font-bold tracking-tight text-foreground">GAMEPULSE</span>
          </Link>
          <Link href="/" className="text-[13px] text-muted hover:text-foreground transition">Back to news</Link>
        </div>
      </header>

      <main className="max-w-[700px] mx-auto px-5 py-12">
        <h1 className="font-editorial text-3xl font-bold mb-2">About GamePulse</h1>
        <p className="text-sm text-muted mb-10">Our mission, methodology, and editorial standards.</p>

        <div className="space-y-8 text-[15px] leading-[1.8] text-foreground/85">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Mission</h2>
            <p>
              GamePulse covers the business side of the gaming industry: acquisitions, earnings, funding rounds,
              layoffs, hardware launches, and regulatory developments. We distill complex industry moves into
              clear, concise analysis — updated three times daily.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">How We Work</h2>
            <p className="mb-4">
              Our pipeline monitors RSS feeds from established gaming industry publications including
              GamesIndustry.biz, Game Developer, Kotaku, and others. We filter for business-relevant stories
              using keyword analysis, then produce editorial analysis and commentary.
            </p>
            <p>
              All original reporting belongs to the cited source publications. GamePulse provides synthesis,
              analysis, and commentary. We always link to and credit the original source.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Data Sources</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted">
              <li><strong className="text-foreground">News:</strong> GamesIndustry.biz, Game Developer, Kotaku, VGC, IGN, MobileGamer.biz</li>
              <li><strong className="text-foreground">Stock Data:</strong> Public market data for 12 gaming companies (illustrative, not real-time)</li>
              <li><strong className="text-foreground">Social:</strong> Commentary published to X/Twitter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Editorial Standards</h2>
            <p className="mb-4">
              We prioritize accuracy, attribution, and business relevance. Every story includes a source
              citation linking to the original reporting. We do not publish rumors without attribution.
            </p>
            <p>
              Stock data displayed on GamePulse is for illustrative purposes and should not be considered
              financial advice. Always consult a financial advisor before making investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Contact</h2>
            <p>
              For corrections, feedback, or press inquiries, reach us at{" "}
              <a href="mailto:hello@gamepulse.news" className="text-accent hover:underline">hello@gamepulse.news</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
