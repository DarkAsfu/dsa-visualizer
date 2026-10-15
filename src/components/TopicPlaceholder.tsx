'use client';

import Link from "next/link";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import type { Topic } from "@/lib/topics";

export default function TopicPlaceholder({ topic }: { topic: Topic }) {
  const { T } = useLang();
  const P = STR.placeholder;
  return (
    <main className="w-full min-w-0 px-4 py-10 lg:px-10">
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
        {topic.phase}
      </p>
      <h1 className="mt-1.5 text-3xl font-bold tracking-tight">
        {topic.title}
      </h1>
      <p className="mt-2 max-w-xl text-[15px] text-zinc-600 dark:text-zinc-400">
        {topic.desc}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 font-mono text-[12px] text-zinc-500 dark:border-zinc-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        {T(P.badge)}
      </div>

      <h2 className="mt-8 font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
        {T(P.whatH)}
      </h2>
      <div className="mt-3 grid max-w-2xl gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-800">
        {P.items.map((item) => (
          <div key={item.en} className="bg-white p-4 dark:bg-zinc-950">
            <p className="text-[13px] text-zinc-600 dark:text-zinc-300">{T(item)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Link
          href="/sorting"
          className="rounded-md bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {T(P.cta1)}
        </Link>
        <Link
          href="/"
          className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          {T(P.cta2)}
        </Link>
      </div>
    </main>
  );
}
