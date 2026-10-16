'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { ACT_CODE, ACT_PRESETS, activityTrace } from "@/lib/algorithms/greedy";
import { useLang } from "@/lib/i18n";

export default function ActivityVisualizer() {
  const { lang } = useLang();
  const [preset, setPreset] = useState(0);
  const [speed, setSpeed] = useState(3);
  const items = ACT_PRESETS[preset].items;
  const result = useMemo(() => activityTrace(items, lang), [items, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [preset, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const maxT = Math.max(...items.map((it) => it.f));
  const curOi = current.idx >= 0 ? current.order[current.idx] : -1;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="space-y-1.5 p-4">
            {current.order.map((oi) => {
              const it = items[oi];
              const isCur = oi === curOi;
              const isPicked = current.picked[oi];
              const left = (it.s / maxT) * 100;
              const width = Math.max(((it.f - it.s) / maxT) * 100, 3);
              return (
                <div key={oi} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 font-mono text-[11px] tabular-nums text-zinc-400">
                    #{oi + 1} [{it.s},{it.f}]
                  </span>
                  <div className="relative h-8 min-w-0 flex-1 rounded bg-zinc-100 dark:bg-zinc-900">
                    <div
                      className={`absolute top-1 h-6 rounded font-mono text-[11px] font-bold leading-6 transition-all ${
                        isPicked
                          ? "bg-emerald-500 text-white"
                          : isCur
                            ? "bg-amber-400 text-zinc-950"
                            : "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                      } ${!isPicked && !isCur ? "opacity-60" : ""}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <span className="px-1.5">{isPicked ? "✓" : `#${oi + 1}`}</span>
                    </div>
                    {current.lastF >= 0 && (
                      <div className="absolute top-0 h-8 w-px bg-sky-500" style={{ left: `${(current.lastF / maxT) * 100}%` }} title={`lastF=${current.lastF}`} />
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between font-mono text-[10px] tabular-nums text-zinc-400">
              <span>0</span>
              <span className="text-sky-500">│ lastF = {current.lastF < 0 ? "—" : current.lastF}</span>
              <span>{maxT}</span>
            </div>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {ACT_PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPreset(i)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {p.name} · {p.items.length}
                </button>
              ))}
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-mono text-[12px] font-bold text-white">
                  {lang === "bn" ? "বাছা" : "picked"} {result.count}: {result.pickedIdx.map((i) => `#${i + 1}`).join(" ")}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={ACT_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "বাছা" : "picked", result.count],
          ["n", items.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "দেখছি" : "current", "bg-amber-400"],
          [lang === "bn" ? "বাছা" : "picked", "bg-emerald-500"],
          ["lastF", "bg-sky-500"],
        ]}
      />
    </div>
  );
}
