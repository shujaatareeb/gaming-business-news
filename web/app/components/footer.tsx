"use client";

import Link from "next/link";
import { useLang } from "./lang-provider";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-border mt-12 bg-surface">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-editorial text-xl font-bold tracking-tight">GAMEPULSE</span>
            <p className="text-xs text-muted leading-relaxed mt-3">{t("footerTagline")}</p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">{t("coverage")}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {["M&A", "Earnings", "Funding", "Hardware", "Esports"].map((cat) => (
                <li key={cat}><a href="#" className="hover:text-foreground transition">{cat}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">{t("markets")}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/stocks/ntdoy" className="hover:text-foreground transition">Nintendo</Link></li>
              <li><Link href="/stocks/sony" className="hover:text-foreground transition">Sony</Link></li>
              <li><Link href="/stocks/msft" className="hover:text-foreground transition">Microsoft</Link></li>
              <li><Link href="/stocks/ea" className="hover:text-foreground transition">Electronic Arts</Link></li>
              <li><Link href="/stocks/rblx" className="hover:text-foreground transition">Roblox</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">{t("more")}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li><Link href="/dashboard" className="hover:text-foreground transition">{t("dashboard")}</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition">{t("about")}</Link></li>
              <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">X / Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition">{t("rssFeed")}</a></li>
              <li><a href="#" className="hover:text-foreground transition">{t("contact")}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-light">
          <span>&copy; {new Date().getFullYear()} GamePulse. {t("allRightsReserved")}</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition">{t("privacyPolicy")}</a>
            <a href="#" className="hover:text-foreground transition">{t("termsOfService")}</a>
            <a href="#" className="hover:text-foreground transition">{t("cookieSettings")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
