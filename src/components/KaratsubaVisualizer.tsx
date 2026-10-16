'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { KAR_A, KAR_B, KAR_CODE, karatsubaTrace } from "@/lib/algorithms/divide";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function clean(s: string): string {
  return s.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "").slice(0, 6);
}

export default function KaratsubaVisualizer() {
  const { lang, T } = useLang();
  const [a, setA] = useState(KAR_A);
  const [b, setB] = useState(KAR_B);
  const [inA, setInA] = useState(KAR_A);
  const [inB, setInB] = useState(KAR_B);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => karatsubaTrace(a, b, lang), [a, b, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [a, b, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const log = steps.slice(0, stepIndex + 1);

  function apply() {
    const ca = clean(inA);
    const cb = clean(inB);
    if (ca.length < 1 || cb.length < 1) {
      setError(lang === "bn" ? "দুটোতেই ১–৬ অঙ্কের সংখ্যা দাও" : "Both need 1–6 digit numbers");
      return;
    }
    setError("");
    setInA(ca);
    setInB(cb);
    setA(ca);
    setB(cb);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="rounded-lg border border-zinc-200 p-3 font-mono dark:border-zinc-800">
              <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                {lang === "bn" ? "বর্তমান কল" : "current call"}
              </div>
              <div className="mt-1 text-[18px] font-bold tabular-nums">
                {current.expr} <span className="text-[13px] font-normal text-zinc-400">= ?</span>
              </div>
              <div className="mt-1 break-all text-[13px] tabular-nums text-zinc-500">{current.detail}</div>
            </div>
            <div className="mt-3 space-y-2 font-mono text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-emerald-600 dark:text-emerald-400">karatsuba · {result.kMults}</span>
                <div className="h-3 rounded bg-emerald-500" style={{ width: `${Math.max(6, (result.kMults / result.naiveMults) * 100)}%` }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-28 shrink-0 text-rose-500">naive · {result.naiveMults}</span>
                <div className="h-3 rounded bg-rose-400" style={{ width: "100%" }} />
              </div>
            </div>
            <p className="mt-1 font-mono text-[11px] text-zinc-400">
              {lang === "bn" ? "প্রতি লেভেলে ৩টি হাফ-গুণ (৪টির বদলে) — ছোট n-এ ওভারহেড থাকে, বড় n-এ জয়" : "3 half-multis per level instead of 4 — overhead at tiny n, wins at large n"}
            </p>
            <div className="mb-1 mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {lang === "bn" ? "কল লগ" : "call log"}
            </div>
            <ol className="nice-scroll max-h-44 space-y-1 overflow-y-auto font-mono text-[12px]">
              {log.map((s, i) => (
                <li key={i} className={`rounded px-2 py-1 ${i === stepIndex ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}>
                  <span className="mr-1 inline-block" style={{ width: `${s.depth * 12}px` }} />
                  <span className={`mr-2 inline-block h-2 w-2 rounded-full ${s.kind === "base" ? "bg-sky-500" : s.kind === "combine" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  {s.expr} <span className="opacity-60">— {s.detail}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              <input value={inA} onChange={(e) => setInA(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} maxLength={6} inputMode="numeric" className="w-24 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="number A" />
              <span className="text-zinc-400">×</span>
              <input value={inB} onChange={(e) => setInB(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} maxLength={6} inputMode="numeric" className="w-24 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="number B" />
              <button onClick={apply} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold tabular-nums text-white">= {result.product}</span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={KAR_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "গুণ" : "mults", `${result.kMults}/${result.naiveMults}`],
          [lang === "bn" ? "গুণফল" : "product", result.answer],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "ভাঙো" : "split", "bg-amber-400"],
          [lang === "bn" ? "বেস" : "base", "bg-sky-500"],
          [lang === "bn" ? "জোড়া" : "combine", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
