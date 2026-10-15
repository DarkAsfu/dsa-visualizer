'use client';

import { useLang } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const next = lang === "en" ? "bn" : "en";
  return (
    <button
      onClick={() => setLang(next)}
      aria-label={lang === "en" ? "বাংলায় দেখো" : "Show in English"}
      title={lang === "en" ? "বাংলায় দেখো" : "Show in English"}
      className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 font-mono text-[12px] font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
    >
      {lang === "en" ? "বাং" : "EN"}
    </button>
  );
}
