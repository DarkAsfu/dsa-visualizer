'use client';

import Link from "next/link";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { TOPIC_GROUPS } from "@/lib/topics";

const GROUPS = ["5. Linked Lists", "6. Stack & Queue", "7. Hashing", "8. Trees"];

export default function DataStructuresPage() {
  const { T } = useLang();
  const D = STR.dsIndex;
  const groups = TOPIC_GROUPS.filter((g) => GROUPS.includes(g.title));
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
        {T(D.overline)}
      </p>
      <h1 className="mt-1.5 text-[26px] font-bold tracking-tight sm:text-3xl">
        {D.title}
      </h1>
      <p className="mt-1 max-w-xl text-[14px] text-zinc-600 dark:text-zinc-400">
        {T(D.intro)}
      </p>

      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-zinc-500">
              {STR.groups[g.title] ? T(STR.groups[g.title]) : g.title}
            </h2>
            <div className="mt-2 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
              {g.topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="group flex items-baseline gap-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full ${
                      t.ready ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-[15px] font-semibold group-hover:underline">
                      {t.title}
                    </span>
                    <span className="block truncate text-[13px] text-zinc-500">
                      {t.desc}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-zinc-400">
                    {t.ready ? T(D.live) : t.phase}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
