'use client';

import { useMemo, useState } from "react";
import { HASH_FNS, SAMPLE_WORDS, cleanWord, hfAnalyze } from "@/lib/hashing";

const SIZE = 16;

export default function HashFnVisualizer() {
  const [word, setWord] = useState("mango");

  const w = cleanWord(word) || "mango";
  const rows = useMemo(() => hfAnalyze(w, SIZE, SAMPLE_WORDS), [w]);
  const codes = useMemo(() => [...w].map((c) => c.charCodeAt(0)), [w]);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            spellCheck={false}
            placeholder="word"
            className="w-40 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[13px] dark:border-zinc-800"
          />
          <span className="font-mono text-[12px] text-zinc-400">
            [{codes.join(" + ")}] = {codes.reduce((a, b) => a + b, 0)}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            hash(“{w}”) · bucket = h % {SIZE}
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {rows.map((r) => (
              <div key={r.id} className="px-3 py-2.5">
                <div className="flex items-baseline gap-3 font-mono">
                  <span className="w-20 shrink-0 text-[12.5px] font-bold">{r.name}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] tabular-nums text-zinc-500" title={String(r.hash)}>
                    {r.hash}
                  </span>
                  <span className="shrink-0 rounded bg-amber-400 px-2 py-0.5 text-[13px] font-bold tabular-nums text-zinc-950">
                    [{r.bucket}]
                  </span>
                </div>
                <div className="mt-1.5 flex h-1.5 gap-[2px]">
                  {Array.from({ length: SIZE }, (_, b) => {
                    const n = SAMPLE_WORDS.filter((s) => HASH_FNS.find((f) => f.id === r.id)!.fn(s) % SIZE === b).length;
                    return (
                      <span
                        key={b}
                        style={{ height: "100%", opacity: 0.25 + (n / 5) * 0.75 }}
                        className={`w-full rounded-sm ${b === r.bucket ? "bg-amber-400" : n > 1 ? "bg-rose-400" : "bg-emerald-500"}`}
                        title={`bucket ${b}: ${n}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="border-t border-zinc-200 px-3 py-2 font-mono text-[11px] text-zinc-400 dark:border-zinc-800">
            20 sample words → {SIZE} buckets · red = crowded · longest chain decides worst case
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            longest chain (20 words)
          </div>
          <div className="space-y-2 p-3">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center gap-3 font-mono text-[12.5px]">
                <span className="w-20 shrink-0 font-bold">{r.name}</span>
                <div className="flex h-4 flex-1 gap-[3px]">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className={`w-full rounded-sm ${i < r.maxChain ? (r.maxChain > 3 ? "bg-rose-500" : "bg-emerald-500") : "bg-zinc-100 dark:bg-zinc-800"}`} />
                  ))}
                </div>
                <span className="w-6 text-right font-bold tabular-nums">{r.maxChain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="rounded-lg border border-zinc-200 p-4 text-[13px] leading-6 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          <p><strong className="text-zinc-900 dark:text-zinc-100">Good hash</strong> = fast + spreads evenly. char-sum is fast but weak (“ad” = “da”).</p>
          <p className="mt-2"><strong className="text-zinc-900 dark:text-zinc-100">djb2 / FNV-1a</strong> mix every byte — tiny input change, totally different output.</p>
          <p className="mt-2 font-mono text-[12px] text-zinc-400">change one letter — watch buckets jump</p>
        </div>
      </div>
    </div>
  );
}
