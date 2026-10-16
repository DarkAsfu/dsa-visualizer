'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { SIEVE_CODE, sieveTrace } from "@/lib/math";
import { useLang } from "@/lib/i18n";

export default function SieveVisualizer() {
  const { lang } = useLang();
  const [n, setN] = useState(30);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => sieveTrace(n, lang), [n, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [n, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const struckSet = new Set(current.struck);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: n - 1 }, (_, k) => k + 2).map((v) => {
                const alive = current.alive[v];
                const justStruck = struckSet.has(v);
                const isP = v === current.p;
                return (
                  <div
                    key={v}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border font-mono text-[14px] font-bold tabular-nums transition ${
                      isP
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : justStruck
                          ? "border-rose-400 bg-rose-500/20 text-rose-600 line-through dark:text-rose-400"
                          : alive
                            ? "border-zinc-300 dark:border-zinc-700"
                            : "border-zinc-200 text-zinc-300 line-through dark:border-zinc-800 dark:text-zinc-700"
                    }`}
                  >
                    {v}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[12px]">
              <span className="text-zinc-400">{lang === "bn" ? "মৌলিক:" : "primes:"}</span>
              {current.primes.map((p) => (
                <span key={p} className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              <span>n = <strong className="tabular-nums text-zinc-900 dark:text-white">{n}</strong></span>
              <input type="range" min={10} max={60} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-36 accent-zinc-950 dark:accent-white" aria-label="n" />
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={SIEVE_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "মৌলিক" : "primes", result.primes.length],
          ["n", n],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "মৌলিক" : "prime", "bg-emerald-500"],
          [lang === "bn" ? "কাটা" : "struck", "bg-rose-500"],
        ]}
      />
    </div>
  );
}
