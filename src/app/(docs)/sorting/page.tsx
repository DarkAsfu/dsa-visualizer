'use client';

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { TOPIC_GROUPS } from "@/lib/topics";

export default function SortingHubPage() {
  const { T } = useLang();
  const group = TOPIC_GROUPS.find((g) => g.title === "4. Sorting");
  if (!group) return null;
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="sorting" />
      <div className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {group.topics.map((t) => (
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
              {t.ready ? T(STR.home.liveOf) : t.phase}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
