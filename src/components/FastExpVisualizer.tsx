'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { FEXP_CODE, fastExpTrace } from "@/lib/math";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function FastExpVisualizer() {
  const { lang, T } = useLang();
  const [x, setX] = useState(3);
  const [n, setN] = useState(13);
  const [inX, setInX] = useState("3");
  const [inN, setInN] = useState("13");
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => fastExpTrace(x, n, lang), [x, n, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [x, n, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const bits = n.toString(2).split("");

  function apply() {
    const bx = Number(inX);
    const en = Number(inN);
    if (!Number.isInteger(bx) || !Number.isInteger(en) || bx < 2 || bx > 9 || en < 1 || en > 30) {
      setError(lang === "bn" ? "ভিত্তি ২–৯, ঘাত ১–৩০" : "Base 2–9, exponent 1–30");
      return;
    }
    setError("");
    setX(bx);
    setN(en);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="space-y-3 p-4 font-mono">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="rounded-lg border border-zinc-200 px-5 py-3 text-center dark:border-zinc-800">
                <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">res</div>
                <div className="text-[24px] font-bold tabular-nums">{current.res}</div>
              </div>
              <div className="rounded-lg border border-amber-400 px-5 py-3 text-center">
                <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">base</div>
                <div className="text-[24px] font-bold tabular-nums">{current.base}</div>
              </div>
              <div className="rounded-lg border border-zinc-200 px-5 py-3 text-center dark:border-zinc-800">
                <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">n</div>
                <div className="text-[24px] font-bold tabular-nums">{current.exp}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="mr-1 text-[11px] uppercase tracking-[0.12em] text-zinc-400">{n}=</span>
              {bits.map((b, i) => (
                <span key={i} className={`rounded px-1.5 py-0.5 text-[13px] font-bold tabular-nums ${b === "1" ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"}`}>
                  {b}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="w-24 shrink-0 text-emerald-600 dark:text-emerald-400">fast · {result.mults}</span>
              <div className="h-3 rounded bg-emerald-500" style={{ width: `${Math.max(5, (result.mults / Math.max(result.naive, 1)) * 100)}%` }} />
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="w-24 shrink-0 text-rose-500">naive · {result.naive}</span>
              <div className="h-3 rounded bg-rose-400" style={{ width: "100%" }} />
            </div>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              <input value={inX} onChange={(e) => setInX(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} inputMode="numeric" className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="base" />
              <span className="text-zinc-400">^</span>
              <input value={inN} onChange={(e) => setInN(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} inputMode="numeric" className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="exponent" />
              <button onClick={apply} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold tabular-nums text-white">
                  {x}^{n} = {result.value}
                </span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={FEXP_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "মান" : "value", result.value > 1e9 ? result.value.toExponential(2) : result.value],
          [lang === "bn" ? "গুণ" : "mults", `${result.mults}/${result.naive}`],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "বিট ১" : "bit 1", "bg-emerald-500"],
          ["base", "bg-amber-400"],
        ]}
      />
    </div>
  );
}
