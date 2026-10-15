'use client';

import Link from "next/link";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { READY_COUNT, TOTAL_TOPICS } from "@/lib/topics";

export default function Navbar() {
  const { T } = useLang();
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav className="flex w-full items-center justify-between gap-4 px-4 py-2.5 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 font-mono text-sm font-bold text-white dark:bg-white dark:text-zinc-950">
            ∴
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            DSA Visualizer
          </span>
          <span className="hidden rounded-full border border-zinc-200 px-2 py-0.5 font-mono text-[11px] text-zinc-500 sm:inline dark:border-zinc-800">
            {READY_COUNT}/{TOTAL_TOPICS}
          </span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="hidden rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 sm:block dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {T(STR.nav.home)}
          </Link>
          <Link
            href="/sorting"
            className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {T(STR.nav.sorting)}
          </Link>
          <Link
            href="/complexity"
            className="rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {T(STR.nav.topics)}
          </Link>
          <Link
            href="/bfs"
            className="hidden rounded-md px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 sm:block dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {T(STR.nav.graphs)}
          </Link>
          <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <LangToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
