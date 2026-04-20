"use client";

import { useEffect, useRef } from "react";
import type { Stock } from "@/lib/mock-data";

export function TickerBar({ stocks }: { stocks: Stock[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const innerEl = innerRef.current;
    if (!scrollEl || !innerEl) return;

    const clone = innerEl.cloneNode(true) as HTMLDivElement;
    scrollEl.appendChild(clone);

    let pos = 0;
    let paused = false;
    let rafId: number;

    const step = () => {
      if (!paused) {
        pos -= 0.4;
        if (Math.abs(pos) >= innerEl.offsetWidth) pos = 0;
        scrollEl.style.transform = `translateX(${pos}px)`;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    scrollEl.addEventListener("mouseenter", pause);
    scrollEl.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(rafId);
      scrollEl.removeEventListener("mouseenter", pause);
      scrollEl.removeEventListener("mouseleave", resume);
      clone.remove();
    };
  }, []);

  const fmtChg = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
  const arrow = (n: number) => (n >= 0 ? "▲" : "▼");

  return (
    <div className="bg-foreground border-b border-black overflow-hidden relative" style={{ color: "#E9E2D3" }}>
      {/* Label */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3.5 text-white"
        style={{
          background: "var(--color-accent)",
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        LIVE · MARKETS
      </div>

      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform" style={{ paddingLeft: 100 }}>
        <div ref={innerRef} className="flex shrink-0" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {stocks.map((stock) => (
            <a
              key={stock.ticker}
              href={`/stocks/${stock.ticker.toLowerCase()}`}
              className="inline-flex items-baseline gap-2 py-2.5 hover:bg-white/5 transition"
              style={{ padding: "10px 18px", borderRight: "1px solid #2a241c" }}
            >
              <span className="text-white font-semibold tracking-wide">{stock.ticker}</span>
              <span style={{ color: "#D9CFB6", fontVariantNumeric: "tabular-nums" }}>${stock.price.toFixed(2)}</span>
              <span
                className={`text-[11px] ${stock.change >= 0 ? "text-[#5BD48C]" : "text-[#F06A7C]"}`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {arrow(stock.change)} {fmtChg(stock.changePercent)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
