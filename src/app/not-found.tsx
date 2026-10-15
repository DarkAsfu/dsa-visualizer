'use client';

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useLang();
  const bn = lang === "bn";

  return (
    <main className="flex min-h-[calc(100vh-53px)] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg text-center">
        <svg viewBox="0 0 400 150" className="mx-auto h-auto w-72" role="img" aria-label="Lost path">
          <line x1="40" y1="75" x2="120" y2="30" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="2" strokeDasharray="6 5" />
          <line x1="40" y1="75" x2="120" y2="120" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="2" strokeDasharray="6 5" />
          <line x1="120" y1="30" x2="210" y2="75" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="2" strokeDasharray="6 5" />
          <line x1="210" y1="75" x2="250" y2="75" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6 5" />
          <line x1="250" y1="75" x2="252" y2="75" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="75" r="16" fill="#38bdf8" />
          <text x="40" y="81" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">A</text>
          <circle cx="120" cy="30" r="16" fill="#38bdf8" />
          <text x="120" y="36" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">B</text>
          <circle cx="120" cy="120" r="16" fill="#38bdf8" />
          <text x="120" y="126" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">C</text>
          <circle cx="210" cy="75" r="16" fill="#38bdf8" />
          <text x="210" y="81" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">D</text>
          <circle cx="285" cy="75" r="20" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 4" />
          <text x="285" y="82" textAnchor="middle" fontSize="16" fontWeight="800" fill="#f43f5e" fontFamily="monospace">?</text>
        </svg>

        <p className="mt-6 font-mono text-[90px] font-black leading-none tracking-tighter text-zinc-950 dark:text-white">
          404
        </p>
        <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.2em] text-zinc-400">
          {bn ? "পথটা কোথাও যায় না" : "this path leads nowhere"}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-[14px] leading-6 text-zinc-600 dark:text-zinc-400">
          {bn
            ? "যে টপিক খুঁজছো সেটা হয় নেই, নয়তো ঠিকানা ভুল। নিচ থেকে ঘুরে এসো।"
            : "The topic you're looking for doesn't exist — or the URL is off. Hop back and keep exploring."}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/"
            className="rounded-md bg-zinc-950 px-5 py-2.5 font-mono text-[13px] font-bold text-white transition hover:opacity-85 dark:bg-white dark:text-zinc-950"
          >
            {bn ? "← হোম" : "← Home"}
          </Link>
          <Link
            href="/sorting"
            className="rounded-md border border-zinc-300 px-5 py-2.5 font-mono text-[13px] text-zinc-700 transition hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
          >
            {bn ? "সর্টিং দেখো →" : "Sorting visualizer →"}
          </Link>
        </div>

        <p className="mt-8 font-mono text-[11px] text-zinc-400">
          {bn ? "টিপ: বাম পাশের সূচিতে সব টপিক আছে" : "tip: every topic lives in the index on the left"}
        </p>
      </div>
    </main>
  );
}
