"use client";

import Link from "next/link";
import { useLang } from "./lang-provider";
import { LanguageSwitcher } from "./lang-provider";
import { SearchModal } from "./search-modal";

export function Masthead() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  return (
    <div style={{ background: "var(--color-background)" }}>
      <div className="max-w-[1360px] mx-auto px-5">
        {/* Meta bar */}
        <div
          className="flex items-center justify-between h-[30px] border-b border-border"
          style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          <div>{dateStr} · VOL. IV · NO. 284</div>
          <div>
            <span>NORTH AMERICA EDITION</span>
            <span className="mx-2.5 opacity-50">·</span>
            <span>UPDATED 3× DAILY</span>
          </div>
        </div>

        {/* Brand */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-end py-5 gap-5">
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.02em", lineHeight: 1.5, paddingBottom: 8 }}>
            <strong className="block text-foreground font-semibold mb-0.5" style={{ letterSpacing: "0.12em", fontSize: 10, textTransform: "uppercase" }}>TODAY&apos;S READS</strong>
            Layoffs · BAFTA · Roblox AI tools · Switch 2 pricing
          </div>

          <Link href="/" className="text-center">
            <span
              className="font-editorial"
              style={{ fontWeight: 800, fontStyle: "italic", fontSize: 68, lineHeight: 0.9, letterSpacing: "-0.02em", color: "var(--color-foreground)" }}
            >
              Game<span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>Pulse</span>
            </span>
            <span
              className="block mt-1.5"
              style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 500, fontSize: 10, letterSpacing: "0.3em", color: "var(--color-muted)", textTransform: "uppercase" }}
            >
              Business Intelligence for the Games Industry
            </span>
          </Link>

          <div className="text-right" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)", letterSpacing: "0.02em", lineHeight: 1.5, paddingBottom: 8 }}>
            <strong className="block text-foreground font-semibold mb-0.5" style={{ letterSpacing: "0.12em", fontSize: 10, textTransform: "uppercase" }}>INDEX · GP50</strong>
            2,184.22 <span style={{ color: "var(--color-up)" }}>▲ +0.42%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { t } = useLang();

  return (
    <>
      <Masthead />
      <nav
        className="sticky top-0 z-50"
        style={{ borderTop: "3px solid var(--color-foreground)", borderBottom: "1px solid var(--color-foreground)", background: "var(--color-background)" }}
      >
        <div
          className="max-w-[1360px] mx-auto px-5 flex items-stretch h-[42px]"
          style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          {["Home", "M&A", "Earnings", "Funding", "Hardware", "Esports", "Mobile", "Markets"].map((item, i) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : item === "Markets" ? "/stocks/ntdoy" : "#"}
              className="inline-flex items-center px-3.5 border-r border-border text-foreground hover:bg-surface-alt transition relative"
              style={i === 0 ? { borderLeft: "1px solid var(--color-border)" } : undefined}
            >
              {item}
              {i === 0 && (
                <span className="absolute left-0 right-0 bottom-[-1px] h-[3px]" style={{ background: "var(--color-accent)" }} />
              )}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3.5 border-r border-border text-foreground hover:bg-surface-alt transition"
          >
            Dashboard
          </Link>
          <div className="flex-1 border-r border-border" />
          <div className="inline-flex items-center px-2">
            <SearchModal />
          </div>
          <div className="inline-flex items-center px-2">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </>
  );
}
