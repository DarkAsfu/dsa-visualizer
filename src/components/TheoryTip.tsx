'use client';

import { useState } from "react";
import { THEORY, THEORY_BN } from "@/lib/theory";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function TheoryTip({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const { lang, T } = useLang();
  const t = THEORY[slug];
  if (!t) return null;
  const bn = THEORY_BN[slug];
  const blurb = lang === "bn" && bn ? bn.blurb : t.blurb;
  const points = lang === "bn" && bn ? bn.points : t.points;

  return (
    <span
      className="relative inline-flex shrink-0 self-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`What is ${t.name}?`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 font-mono text-[12px] font-bold text-zinc-500 transition hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-0 top-full z-50 mt-2 block w-72 rounded-lg border border-zinc-200 bg-white p-3.5 text-left shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:w-80">
          <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
            {T(STR.common.theoryWord)} · {t.name}
          </span>
          <span className="mt-1 block text-[13.5px] font-medium leading-6">
            {blurb}
          </span>
          <ul className="mt-2 space-y-1.5">
            {points.map((p) => (
              <li
                key={p}
                className="flex gap-2 text-[12.5px] leading-5 text-zinc-600 dark:text-zinc-300"
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                {p}
              </li>
            ))}
          </ul>
        </span>
      )}
    </span>
  );
}
