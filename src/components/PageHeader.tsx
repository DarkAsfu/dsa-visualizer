'use client';

import TheoryTip from "./TheoryTip";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { PRACTICE, type Level } from "@/lib/practice";

const LEVEL_CLASS: Record<Level, string> = {
  Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Hard: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
};

export default function PageHeader({ slug }: { slug: string }) {
  const { T } = useLang();
  const p = STR.pages[slug];
  if (!p) return null;
  const pr = PRACTICE[slug];
  const levelLabel =
    pr?.level === "Easy"
      ? T(STR.common.lvlEasy)
      : pr?.level === "Medium"
        ? T(STR.common.lvlMedium)
        : T(STR.common.lvlHard);
  return (
    <>
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
        {T(p.overline)}
      </p>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-[26px] font-bold tracking-tight sm:text-3xl">
          {p.title}
        </h1>
        <TheoryTip slug={slug} />
        <span className="font-mono text-[12px] text-zinc-400">
          {T(p.meta)}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-[14px] leading-6 text-zinc-600 dark:text-zinc-400">
        {T(p.intro)}
      </p>
      {pr && (
        <div className="mt-3 flex max-w-2xl flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold ${LEVEL_CLASS[pr.level]}`}>
            {levelLabel}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            {T(STR.common.practiceH)}:
          </span>
          {pr.problems.map((name) => (
            <span
              key={name}
              className="rounded-md border border-zinc-200 px-2 py-0.5 text-[12px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
