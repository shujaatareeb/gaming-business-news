"use client";

import { useLang } from "./lang-provider";

export function Newsletter() {
  const { t } = useLang();

  return (
    <div className="border border-border rounded-lg bg-surface p-5">
      <h2 className="font-editorial text-lg font-bold mb-1">{t("newsletterTitle")}</h2>
      <p className="text-xs text-muted mb-4">{t("newsletterDesc")}</p>
      <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="you@email.com"
          className="w-full h-9 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:border-foreground transition placeholder:text-muted-light"
        />
        <button
          type="submit"
          className="w-full h-9 text-sm font-medium bg-foreground text-surface rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {t("subscribe")}
        </button>
      </form>
      <p className="text-[10px] text-muted-light mt-3">{t("newsletterSocial")}</p>
    </div>
  );
}
