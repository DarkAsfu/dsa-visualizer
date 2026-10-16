'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { FRAC_CODE, FRAC_PRESETS, fracKnapsackTrace } from "@/lib/algorithms/greedy";
import { useLang } from "@/lib/i18n";

export default function FracKnapsackVisualizer() {
  const { lang } = useLang();
  const [preset, setPreset] = useState(0);
  const [cap, setCap] = useState(FRAC_PRESETS[0].cap);
  const [speed, setSpeed] = useState(3);
  const items = FRAC_PRESETS[preset].items;
  const capEff = preset === 0 ? cap : FRAC_PRESETS[preset].cap;
  const result = useMemo(() => fracKnapsackTrace(items, capEff, lang), [items, capEff, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [preset, capEff, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const curOi = current.idx >= 0 ? current.order[current.idx] : -1;
  const fillPct = Math.min(100, ((capEff - current.capLeft) / capEff) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="space-y-2.5 p-4">
            {current.order.map((oi) => {
              const it = items[oi];
              const f = current.frac[oi];
              const isCur = oi === curOi;
              return (
                <div key={oi} className={`rounded-lg border p-2.5 ${isCur ? "border-amber-400" : "border-zinc-200 dark:border-zinc-800"}`}>
                  <div className="flex items-center justify-between font-mono text-[12px]">
                    <span className="font-bold">
                      #{oi + 1} <span className="font-normal tabular-nums text-zinc-500">w={it.w} v={it.v} d={(it.v / it.w).toFixed(1)}</span>
                    </span>
                    <span className={`tabular-nums ${f > 0 ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                      {f === 0 ? "—" : f === 1 ? `+${it.v} ✓` : `${Math.round(f * 100)}% +${(f * it.v).toFixed(1)}`}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                    <div className={`h-full transition-all ${f === 1 ? "bg-emerald-500" : f > 0 ? "bg-amber-400" : ""}`} style={{ width: `${f * 100}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="rounded-lg border border-zinc-200 p-2.5 font-mono text-[12px] dark:border-zinc-800">
              <div className="flex justify-between text-zinc-500">
                <span>{lang === "bn" ? "থলে" : "bag"} {capEff - current.capLeft}/{capEff}</span>
                <span className="font-bold tabular-nums text-zinc-900 dark:text-white">
                  {lang === "bn" ? "মান" : "value"} {Math.round(current.value * 10) / 10}
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                <div className="h-full bg-sky-500 transition-all" style={{ width: `${fillPct}%` }} />
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {FRAC_PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => { setPreset(i); setCap(p.cap); }}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {p.name}
                </button>
              ))}
              {preset === 0 && (
                <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
                  cap <strong className="tabular-nums text-zinc-900 dark:text-white">{cap}</strong>
                  <input type="range" min={10} max={60} step={5} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="w-24 accent-zinc-950 dark:accent-white" aria-label="capacity" />
                </label>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={FRAC_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "মান" : "value", result.value],
          ["cap", capEff],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "দেখছি" : "current", "bg-amber-400"],
          [lang === "bn" ? "পুরো" : "full", "bg-emerald-500"],
          [lang === "bn" ? "ভগ্নাংশ" : "fraction", "bg-amber-400"],
        ]}
      />
    </div>
  );
}
