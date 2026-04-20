"use client";

import { useEffect, useState } from "react";

export function TopRail() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-foreground text-[#EDE6D8]" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="max-w-[1360px] mx-auto px-5 flex items-center gap-5 h-7 text-[11px] tracking-wide">
        <span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
            style={{ background: "#3ED07A", animation: "pulse-dot 2s infinite" }}
          />
          MARKETS OPEN · NY {time} EST
        </span>
        <a href="#" className="opacity-85 hover:opacity-100 hover:text-white transition">Premium</a>
        <a href="#" className="opacity-85 hover:opacity-100 hover:text-white transition">Newsletters</a>
        <a href="#" className="opacity-85 hover:opacity-100 hover:text-white transition">Events</a>
        <span className="flex-1" />
        <a href="#" className="opacity-85 hover:opacity-100 hover:text-white transition">Sign in</a>
        <a href="#" className="text-white font-semibold">Subscribe →</a>
      </div>
    </div>
  );
}
