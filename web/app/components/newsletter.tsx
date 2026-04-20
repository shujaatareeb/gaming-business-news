"use client";

export function Newsletter() {
  return (
    <div className="border border-border p-5" style={{ background: "var(--color-surface-alt)" }}>
      <h2 className="font-editorial font-semibold italic text-lg leading-[1.22] tracking-tight m-0 mb-1">
        The Daily Brief
      </h2>
      <p className="text-xs mb-4" style={{ fontFamily: "var(--font-sans)", color: "var(--color-muted)" }}>
        Top gaming-business stories in your inbox every morning.
      </p>
      <form className="flex border border-foreground bg-white" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 border-0 outline-0 bg-transparent px-3 py-2 text-[13px] text-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        />
        <button
          type="submit"
          className="border-0 bg-foreground text-background px-3.5 font-bold hover:bg-accent transition-colors"
          style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          Go
        </button>
      </form>
      <div className="mt-2" style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: "var(--color-muted)" }}>
        2,400+ professionals · Free
      </div>
    </div>
  );
}

export function NewsletterBlock() {
  return (
    <section className="p-6 border-r border-border">
      <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>
        The Daily Brief
      </h3>
      <p className="font-editorial font-semibold italic text-[22px] leading-[1.22] tracking-tight m-0 mb-3.5">
        Top gaming-business stories in your inbox every morning — before the market opens.
      </p>
      <form className="flex border border-foreground bg-white" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 border-0 outline-0 bg-transparent px-3 py-2.5 text-[13px] text-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        />
        <button
          type="submit"
          className="border-0 bg-foreground text-background px-4 font-bold hover:bg-accent transition-colors"
          style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          Subscribe
        </button>
      </form>
      <div className="mt-2.5" style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--color-muted)" }}>
        Join 2,400+ industry professionals · Unsubscribe anytime
      </div>
    </section>
  );
}
