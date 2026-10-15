'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { HT_CODE, HT_SIZE, cleanWord, htDeleteTrace, htInsertTrace, htSearchTrace, type HTStep } from "@/lib/hashing";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Op = "insert" | "search" | "delete";
const EMPTY: string[][] = Array.from({ length: HT_SIZE }, () => []);

export default function HashTableVisualizer() {
  const { lang, T } = useLang();
  const [buckets, setBuckets] = useState<string[][]>(() => EMPTY.map(() => []));
  const [key, setKey] = useState("mango");
  const [op, setOp] = useState<Op>("insert");
  const [opSteps, setOpSteps] = useState<HTStep[]>(() => htInsertTrace(EMPTY.map(() => []), "mango", lang).steps);
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(opSteps.length, speed);

  const current = opSteps[Math.min(stepIndex, last)];
  const count = useMemo(() => buckets.flat().length, [buckets]);
  const maxChain = useMemo(() => Math.max(0, ...buckets.map((b) => b.length)), [buckets]);

  const run = (o: Op) => {
    const w = cleanWord(key) || "mango";
    const r = o === "insert" ? htInsertTrace(buckets, w, lang) : o === "search" ? htSearchTrace(buckets, w, lang) : htDeleteTrace(buckets, w, lang);
    if ("buckets" in r) setBuckets(r.buckets);
    setOpSteps(r.steps);
    reset();
  };

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["insert", "search", "delete"] as Op[]).map((o) => (
            <button
              key={o}
              onClick={() => {
                setOp(o);
                run(o);
              }}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                op === o
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {o}
            </button>
          ))}
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            spellCheck={false}
            placeholder="key"
            className="w-32 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <span className="ml-auto font-mono text-[11px] tabular-nums text-zinc-400">
            n={count} · longest chain {maxChain}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.desc}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{opSteps.length}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>
          <div className="space-y-1.5 p-4">
            {current.buckets.map((chain, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-md px-2 py-1 ${i === current.at ? "bg-amber-400/15" : ""}`}>
                <span className={`w-8 shrink-0 rounded text-center font-mono text-[12px] font-bold tabular-nums ${i === current.at ? "bg-amber-400 text-zinc-950" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"}`}>
                  {i}
                </span>
                {chain.length === 0 && <span className="font-mono text-[12px] text-zinc-300">∅</span>}
                {chain.map((k, j) => (
                  <span key={j} className="flex items-center gap-2">
                    {j > 0 && <span className="font-mono text-zinc-300">→</span>}
                    <span className={`rounded-md border px-2 py-0.5 font-mono text-[13px] font-bold ${
                      k === current.hiKey
                        ? current.found === false
                          ? "border-rose-500 bg-rose-500/10"
                          : "border-emerald-500 bg-emerald-500/10"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}>
                      {k}
                    </span>
                  </span>
                ))}
                {chain.length > 1 && (
                  <span className="ml-auto font-mono text-[10px] uppercase text-rose-500">collision ×{chain.length}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <Transport
              playing={playing}
              done={done}
              onPlay={() => {
                if (done) {
                  reset();
                  setPlaying(true);
                } else {
                  setPlaying((p) => !p);
                }
              }}
              onBack={stepBack}
              onFwd={stepFwd}
              onReset={reset}
              speed={speed}
              onSpeed={setSpeed}
            />
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {HT_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            ["keys", count],
            ["chains", buckets.filter((b) => b.length > 1).length],
            [T(STR.common.steps), opSteps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[11px] leading-5 text-zinc-400">
          h = Σ char codes · m = {HT_SIZE} · chaining
        </p>
      </div>
    </div>
  );
}
