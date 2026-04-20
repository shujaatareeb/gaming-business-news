"use client";

import Link from "next/link";
import { useLang } from "./lang-provider";
import { LanguageSwitcher } from "./lang-provider";
import { SearchModal } from "./search-modal";

export function Header() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 bg-surface">
      <nav className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="font-editorial text-2xl font-bold tracking-tight text-foreground">
              GAMEPULSE
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-[13px] font-medium text-muted">
            {["M&A", "Earnings", "Funding", "Hardware", "Esports"].map((cat) => (
              <button key={cat} className="hover:text-foreground transition">
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <SearchModal />
            <LanguageSwitcher />
            <Link
              href="/dashboard"
              className="text-[13px] text-muted hover:text-foreground transition"
            >
              {t("dashboard")}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
