"use client";

import { useLang } from "./lang-provider";
import type { LangCode } from "@/lib/i18n";
import { t as translate } from "@/lib/i18n";

type TranslationKey = Parameters<typeof translate>[1];

export function SectionLabel({ labelKey }: { labelKey: TranslationKey }) {
  const { lang } = useLang();
  const text = translate(lang, labelKey);

  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">{text}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function SectionLabelInline({ labelKey }: { labelKey: TranslationKey }) {
  const { lang } = useLang();
  return <>{translate(lang, labelKey)}</>;
}
