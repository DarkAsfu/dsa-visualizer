'use client';

import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const ORDER = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)", "O(n!)"];
const VKEY = ["excellent", "excellent", "good", "good", "fair", "bad", "horrible"];

function verdictClass(v: string): string {
  return v === "excellent"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
    : v === "good"
      ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
      : v === "fair"
        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
}

export function ComplexityExtras() {
  const { T } = useLang();
  const C = STR.complexity;
  return (
    <>
      <h2 className="mt-10 font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
        {T(C.cheatH)}
      </h2>
      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-zinc-200 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-400 dark:border-zinc-800">
              <th className="px-4 py-2 font-medium">{T(C.thC)}</th>
              <th className="px-4 py-2 font-medium">{T(C.thEx)}</th>
              <th className="px-4 py-2 text-right font-medium">{T(C.thV)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {ORDER.map((c, i) => (
              <tr key={c}>
                <td className="px-4 py-2 font-mono text-[12.5px] font-semibold">
                  {c}
                </td>
                <td className="px-4 py-2 text-zinc-500">{T(C.examples[i])}</td>
                <td className="px-4 py-2 text-right">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${verdictClass(VKEY[i])}`}>
                    {T(C.verdicts[VKEY[i]])}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {C.cards.map((card) => (
          <div key={card.t.en} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-[14px] font-semibold">{T(card.t)}</div>
            <p className="mt-1 text-[13px] leading-6 text-zinc-500">{T(card.d)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function CardGrid({ cards }: { cards: Array<{ t: { en: string; bn: string }; d: { en: string; bn: string } }> }) {
  const { T } = useLang();
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.t.en} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="text-[14px] font-semibold">{T(card.t)}</div>
          <p className="mt-1 text-[13px] leading-6 text-zinc-500">{T(card.d)}</p>
        </div>
      ))}
    </div>
  );
}

export function RecursionExtras() {
  return <CardGrid cards={STR.recursion.cards} />;
}

export function BacktrackExtras() {
  return <CardGrid cards={STR.backtrack.cards} />;
}

export function BitExtras() {
  return <CardGrid cards={STR.bit.cards} />;
}
