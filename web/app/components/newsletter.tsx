"use client";

export function Newsletter() {
  return (
    <div className="border border-border rounded-lg bg-surface p-5">
      <h2 className="font-editorial text-lg font-bold mb-1">
        Get the briefing.
      </h2>
      <p className="text-xs text-muted mb-4">
        Top gaming business stories in your inbox every morning. Free.
      </p>
      <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="you@email.com"
          className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-foreground transition placeholder:text-muted-light"
        />
        <button
          type="submit"
          className="w-full h-9 text-sm font-medium bg-foreground text-surface rounded-lg hover:bg-foreground/90 transition"
        >
          Subscribe
        </button>
      </form>
      <p className="text-[10px] text-muted-light mt-3">
        Join 2,400+ gaming industry professionals
      </p>
    </div>
  );
}
