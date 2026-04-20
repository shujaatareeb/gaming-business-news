"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 py-11 text-[#D9CFB6]" style={{ background: "var(--color-foreground)", fontFamily: "var(--font-sans)" }}>
      <div className="max-w-[1360px] mx-auto px-5">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-7">
          <div>
            <div className="font-editorial italic font-extrabold text-[28px] text-white mb-1.5">
              Game<span style={{ color: "var(--color-accent)" }}>Pulse</span>
            </div>
            <p className="text-xs leading-relaxed max-w-[30ch]" style={{ color: "#9C917F" }}>
              AI-powered business intelligence for the global games industry. Updated three times daily from 80+ sources.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.18em] uppercase text-white mb-3">Coverage</h5>
            <ul className="list-none p-0 m-0 text-[12.5px] leading-[2]">
              <li><a href="#" className="hover:text-white transition">M&amp;A</a></li>
              <li><a href="#" className="hover:text-white transition">Earnings</a></li>
              <li><a href="#" className="hover:text-white transition">Funding</a></li>
              <li><a href="#" className="hover:text-white transition">Hardware</a></li>
              <li><a href="#" className="hover:text-white transition">Esports</a></li>
              <li><a href="#" className="hover:text-white transition">Mobile</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.18em] uppercase text-white mb-3">Markets</h5>
            <ul className="list-none p-0 m-0 text-[12.5px] leading-[2]">
              <li><Link href="/stocks/ntdoy" className="hover:text-white transition">Nintendo · NTDOY</Link></li>
              <li><Link href="/stocks/sony" className="hover:text-white transition">Sony · SONY</Link></li>
              <li><Link href="/stocks/msft" className="hover:text-white transition">Microsoft · MSFT</Link></li>
              <li><Link href="/stocks/ea" className="hover:text-white transition">EA · EA</Link></li>
              <li><Link href="/stocks/rblx" className="hover:text-white transition">Roblox · RBLX</Link></li>
              <li><a href="#" className="hover:text-white transition">GP-50 Index</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.18em] uppercase text-white mb-3">More</h5>
            <ul className="list-none p-0 m-0 text-[12.5px] leading-[2]">
              <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><a href="#" className="hover:text-white transition">Newsletters</a></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><a href="#" className="hover:text-white transition">API</a></li>
              <li><a href="#" className="hover:text-white transition">RSS</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center mt-8 pt-4 text-[11px] tracking-wide" style={{ borderTop: "1px solid #2b241c", color: "#9C917F" }}>
          <div>&copy; 2026 GamePulse Intelligence, Inc.</div>
          <div className="flex gap-3.5">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
            <a href="#" className="hover:text-white transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
