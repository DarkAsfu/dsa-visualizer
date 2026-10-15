'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { BLOOM_CODE, BLOOM_K, BLOOM_M, bloomFPR, bloomHashes, bloomTrace, cleanWord, type BStep } from "@/lib/hashing";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Op = "add" | "ask";

export default function BloomVisualizer() {
  const { lang, T } = useLang();
  const [bits, setBits] = useState<boolean[]>(() => Array(BLOOM_M).fill(false));
  const [added, setAdded] = useState<string[]>([]);
  const [word, setWord] = useState("mango");
  const [op, setOp] = useState<Op>("add");
  const [opSteps, setOpSteps] = useState<BStep[]>(() => bloomTrace(Array(BLOOM_M).fill(false), "add", "mango", lang).steps);
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(opSteps.length, speed);

  const current = opSteps[Math.min(stepIndex, last)];
  const setCount = useMemo(() => bits.filter(Boolean).length, [bits]);
  const fpr = useMemo(() => bloomFPR(added.length), [added]);

  const run = (o: Op) => {
    const w = cleanWord(word) || "mango";
    const r = bloomTrace(bits, o, w, lang);
    if (o === "add") {
      setBits(r.bits);
      setAdded((a) => (a.includes(w) ? a : [...a, w]));
    }
    setOpSteps(r.steps);
    reset();
  };

  const preview = useMemo(() => bloomHashes(cleanWord(word) || "mango"), [word]);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["add", "ask"] as Op[]).map((o) => (
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
            value={word}
            onChange={(e) => setWord(e.target.value)}
            spellCheck={false}
            placeholder="word"
            className="w-32 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              const fresh = Array(BLOOM_M).fill(false);
              setBits(fresh);
              setAdded([]);
              setOpSteps([{
                bits: fresh, at: [], cur: "", verdict: null,
                desc: lang === "bn" ? "সাফ — খালি ফিল্টার" : "Cleared — empty filter",
                codeLine: 0,
              }]);
              reset();
            }}
            className="rounded-md px-2.5 py-1.5 font-mono text-[12.5px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {T(STR.common.clear)}
          </button>
          <span className="ml-auto font-mono text-[11px] tabular-nums text-zinc-400">
            {setCount}/{BLOOM_M} bits · {added.length} words
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
          <div className="p-4">
            <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-[repeat(16,minmax(0,1fr))]">
              {current.bits.map((on, i) => {
                const hot = current.at.includes(i);
                const willHit = !done && preview.includes(i);
                return (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded-md font-mono text-[10px] tabular-nums transition ${
                      hot
                        ? "bg-amber-400 font-bold text-zinc-950"
                        : on
                          ? "bg-emerald-500 font-bold text-white"
                          : willHit
                            ? "border border-dashed border-amber-400/60 text-zinc-300"
                            : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">added:</span>
              {added.length === 0 && <span className="font-mono text-[12px] text-zinc-300">—</span>}
              {added.map((w) => (
                <span key={w} className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[12px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {w}
                </span>
              ))}
            </div>
          </div>
          {done && current.verdict !== null && (
            <div className={`flex items-center justify-center gap-2 border-t px-4 py-2 font-mono text-[13px] font-bold ${current.verdict ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"}`}>
              “{current.cur}” {current.verdict ? (op === "add" ? "stored ✓" : "maybe present") : "absent ✓"}
            </div>
          )}
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
            {BLOOM_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            ["k", BLOOM_K],
            ["false +", `${(fpr * 100).toFixed(1)}%`],
            [T(STR.common.steps), opSteps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[11px] leading-5 text-zinc-400">
          m = {BLOOM_M} bits · never says “no” wrongly
        </p>
      </div>
    </div>
  );
}
