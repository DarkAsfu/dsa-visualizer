'use client';

import Link from "next/link";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { ALL_TOPICS, READY_COUNT, TOTAL_TOPICS } from "@/lib/topics";

const MVP_HREFS = [
  "/sorting",
  "/binary-search",
  "/stack",
  "/singly-linked-list",
  "/bst",
  "/bfs",
];

const MVP_TITLES = ["Sorting", "Searching", "Stack / Queue", "Linked List", "BST", "BFS / DFS"];

const MVP_READY = MVP_HREFS.map((h) => ALL_TOPICS[h.slice(1)]?.ready ?? false);

export default function Home() {
  const { T } = useLang();
  const H = STR.home;
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 lg:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-zinc-500">
        {T(H.overline)}
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        {T(H.titleA)}
        <br />
        {T(H.titleB)}
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
        {T(H.subA)}
        {TOTAL_TOPICS}
        {T(H.subB)}
        {READY_COUNT}
        {T(H.subC)}
      </p>
      <div className="mt-7 flex flex-wrap gap-2.5">
        <Link
          href="/sorting"
          className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {T(H.cta1)}
        </Link>
        <Link
          href="/data-structures"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          {T(H.cta2)}
        </Link>
      </div>

      <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-baseline justify-between py-4">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
            {T(H.mvpH)}
          </h2>
          <span className="font-mono text-[12px] text-zinc-400">
            {MVP_READY.filter(Boolean).length}/{MVP_HREFS.length} {T(H.liveOf)}
          </span>
        </div>
        <div>
          {MVP_HREFS.map((href, i) => {
            const ready = MVP_READY[i];
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-baseline gap-4 border-t border-zinc-200 py-4 transition-colors hover:bg-zinc-50 sm:gap-6 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
              >
                <span className="w-8 shrink-0 font-mono text-[12px] text-zinc-400">
                  0{i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[16px] font-semibold tracking-tight group-hover:underline">
                      {MVP_TITLES[i]}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] ${
                        ready
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {ready ? T(H.liveOf) : T(H.soon)}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[13.5px] text-zinc-500">
                    {T(H.rows[i].desc)}
                  </span>
                </span>
                <span className="hidden shrink-0 font-mono text-[11.5px] text-zinc-400 sm:block">
                  {T(H.rows[i].meta)}
                </span>
                <span className="shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <h2 className="mt-14 font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
        {T(H.roadH)}
      </h2>
      <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-800">
        {H.phases.map((p) => (
          <div key={p.name.en} className="bg-white p-4 dark:bg-zinc-950">
            <div className="flex items-center gap-2 font-mono text-[12px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              {T(p.name)}
            </div>
            <p className="mt-2 text-[13px] leading-6 text-zinc-500">{T(p.items)}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[12px] text-zinc-400">
        ↳ {T(STR.common.firstIter)}
      </p>

      <div className="mt-14 grid gap-8 border-t border-zinc-200 pt-8 sm:grid-cols-3 dark:border-zinc-800">
        {H.how.map((s, i) => (
          <div key={s.t.en}>
            <div className="font-mono text-[12px] text-zinc-400">0{i + 1}</div>
            <div className="mt-1 text-[15px] font-semibold">{T(s.t)}</div>
            <p className="mt-1 text-[13.5px] text-zinc-500">{T(s.d)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
