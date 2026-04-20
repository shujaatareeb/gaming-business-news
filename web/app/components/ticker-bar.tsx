"use client";

import { useEffect, useRef } from "react";
import type { Stock } from "@/lib/mock-data";

const stockUrl = (ticker: string) => `/stocks/${ticker.toLowerCase()}`;

export function TickerBar({ stocks }: { stocks: Stock[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const innerEl = innerRef.current;
    if (!scrollEl || !innerEl) return;

    // Clone the content for seamless looping
    const clone = innerEl.cloneNode(true) as HTMLDivElement;
    scrollEl.appendChild(clone);

    let pos = 0;
    let paused = false;
    let rafId: number;

    const step = () => {
      if (!paused) {
        pos -= 0.5;
        if (Math.abs(pos) >= innerEl.offsetWidth) {
          pos = 0;
        }
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

  return (
    <div className="bg-foreground text-surface overflow-hidden border-b border-foreground/80">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform">
        <div ref={innerRef} className="flex shrink-0">
          {stocks.map((stock) => (
            <a
              key={stock.ticker}
              href={stockUrl(stock.ticker)}
              className="inline-flex items-center gap-2 px-5 py-2 text-[12px] shrink-0 hover:bg-white/10 transition"
            >
              <span className="font-bold">{stock.ticker}</span>
              <span className="tabular-nums opacity-80">${stock.price.toFixed(2)}</span>
              <span
                className={`font-semibold tabular-nums ${
                  stock.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
