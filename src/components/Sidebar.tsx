'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { READY_COUNT, TOPIC_GROUPS, TOTAL_TOPICS } from "@/lib/topics";

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { T } = useLang();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOPIC_GROUPS;
    return TOPIC_GROUPS.map((g) => ({
      ...g,
      topics: g.topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q)
      ),
    })).filter((g) => g.topics.length > 0);
  }, [query]);

  return (
    <div className="px-3 py-4">
      <div className="rounded-lg border border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
            {T(STR.side.index)}
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[11px] tabular-nums dark:bg-zinc-800">
            {READY_COUNT}/{TOTAL_TOPICS}
          </span>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={T(STR.side.filterPh)}
          className="mt-2 w-full rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
        />
      </div>

      <div className="mt-3 space-y-4">
        {filtered.map((group) => {
          const ready = group.topics.filter((t) => t.ready).length;
          const isCollapsed = collapsed[group.title] ?? false;
          return (
            <section key={group.title}>
              <button
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [group.title]: !c[group.title] }))
                }
                className="flex w-full items-center gap-1.5 rounded-md px-1 py-1 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <span className="w-4 shrink-0 text-center font-mono text-[12px] text-zinc-400">
                  {isCollapsed ? "+" : "–"}
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold tracking-tight">
                  {STR.groups[group.title] ? T(STR.groups[group.title]) : group.title}
                </span>
                <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-zinc-400">
                  {ready}/{group.topics.length}
                </span>
              </button>
              {!isCollapsed && (
                <ul className="mt-0.5 space-y-px">
                  {group.topics.map((t) => {
                    const href = `/${t.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={t.slug}>
                        <Link
                          href={href}
                          onClick={onNavigate}
                          title={`${t.title} — ${t.desc}`}
                          className={`flex items-start gap-2.5 rounded-md px-2 py-[7px] transition ${
                            active
                              ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          }`}
                        >
                          <span
                            className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${
                              t.ready
                                ? "bg-emerald-500"
                                : "bg-zinc-300 dark:bg-zinc-700"
                            }`}
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-[13.5px] leading-[1.35] ${
                                active
                                  ? "font-semibold"
                                  : "text-zinc-700 dark:text-zinc-300"
                              }`}
                            >
                              {t.title}
                            </span>
                            <span
                              className={`mt-0.5 block font-mono text-[10.5px] ${
                                active
                                  ? "opacity-70"
                                  : "text-zinc-400"
                              }`}
                            >
                              {t.ready ? T(STR.home.liveOf) : t.phase} · /{t.slug}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="px-2 text-sm text-zinc-500">
          {T(STR.side.noMatch)} “{query}”.
        </p>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { T } = useLang();

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-[53px] z-40 border-b border-zinc-200 bg-white/95 px-4 py-2 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-zinc-200 px-3 py-1.5 font-mono text-[13px] dark:border-zinc-800"
          aria-label={T(STR.common.openTopicsLabel)}
        >
          {T(STR.common.openTopics)}
        </button>
      </div>

      {/* Desktop */}
      <aside className="nice-scroll sticky top-[53px] hidden h-[calc(100vh-53px)] w-80 flex-none overflow-y-auto border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-950">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="nice-scroll absolute left-0 top-0 h-full w-[320px] max-w-[88vw] overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="font-mono text-[12px] uppercase tracking-widest text-zinc-500">
                {T(STR.side.index)}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-zinc-200 px-2.5 py-1 font-mono text-[13px] dark:border-zinc-800"
                aria-label={T(STR.common.closeTopics)}
              >
                ×
              </button>
            </div>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
