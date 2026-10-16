'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { MERGE_CODE, MERGE_PRESETS, mergeTrace, randomIntervals, type Interval } from "@/lib/algorithms/greedy";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function parseIntervals(s: string): Interval[] | null {
  const pairs = s.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
  if (pairs.length < 2 || pairs.length > 8) return null;
  const out: Interval[] = [];
  for (const p of pairs) {
    const m = p.match(/^(-?\d+)\s*[-–]\s*(-?\d+)$/);
    if (!m) return null;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b > 20 || a > b) return null;
    out.push([a, b]);
  }
  return out;
}

function Bar({ s, e, maxV, cls, label }: { s: number; e: number; maxV: number; cls: string; label: string }) {
  const left = (s / (maxV + 1)) * 100;
  const width = Math.max(((e - s + 0.6) / (maxV + 1)) * 100, 4);
  return (
    <div className="relative h-7 min-w-0 flex-1 rounded bg-zinc-100 dark:bg-zinc-900">
      <div className={`absolute top-1 h-5 rounded font-mono text-[11px] font-bold leading-5 ${cls}`} style={{ left: `${left}%`, width: `${width}%` }}>
        <span className="px-1.5">{label}</span>
      </div>
    </div>
  );
}

export default function MergeIntervalsVisualizer() {
  const { lang, T } = useLang();
  const [intervals, setIntervals] = useState<Interval[]>(MERGE_PRESETS[0]);
  const [text, setText] = useState("1-3, 2-6, 8-10, 9-12, 15-18");
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => mergeTrace(intervals, lang), [intervals, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [intervals, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const maxV = Math.max(...intervals.map(([, e]) => e), 1);
  const curOi = current.idx >= 0 ? current.order[current.idx] : -1;

  function apply() {
    const v = parseIntervals(text);
    if (!v) {
      setError(lang === "bn" ? "ধরন: 1-3, 2-6 (২–৮টি, ০–২০, শুরু ≤ শেষ)" : "Format: 1-3, 2-6 (2–8 pairs, 0–20, start ≤ end)");
      return;
    }
    setError("");
    setIntervals(v);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="space-y-1.5 p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
              {lang === "bn" ? "সাজানো ইনপুট" : "sorted input"}
            </div>
            {current.order.map((oi, k) => {
              const [s, e] = intervals[oi];
              const isCur = oi === curOi;
              const isDone = k < current.idx || (done && k <= current.idx);
              return (
                <div key={oi} className="flex items-center gap-2">
                  <span className="w-16 shrink-0 font-mono text-[11px] tabular-nums text-zinc-400">[{s},{e}]</span>
                  <Bar s={s} e={e} maxV={maxV} label={isCur ? "◀" : ""} cls={isCur ? "bg-amber-400 text-zinc-950" : isDone ? "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"} />
                </div>
              );
            })}
            <div className="pt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
              {lang === "bn" ? "মার্জড আউটপুট" : "merged output"}
            </div>
            {current.out.map(([s, e], i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-16 shrink-0 font-mono text-[11px] tabular-nums text-emerald-600 dark:text-emerald-400">[{s},{e}]</span>
                <Bar s={s} e={e} maxV={maxV} label="✓" cls="bg-emerald-500 text-white" />
              </div>
            ))}
            {current.cur && !done && (
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 font-mono text-[11px] tabular-nums text-sky-600 dark:text-sky-400">cur</span>
                <Bar s={current.cur[0]} e={current.cur[1]} maxV={maxV} label="cur" cls="bg-sky-500/70 text-white" />
              </div>
            )}
            {current.out.length === 0 && !current.cur && (
              <p className="font-mono text-[12px] text-zinc-400">…</p>
            )}
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                spellCheck={false}
                className="w-64 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                aria-label="intervals"
              />
              <button onClick={apply} className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] font-semibold text-white dark:bg-white dark:text-zinc-950">
                {T(STR.common.run)}
              </button>
              <button
                onClick={() => {
                  const v = randomIntervals(5);
                  setText(v.map(([a, b]) => `${a}-${b}`).join(", "));
                  setError("");
                  setIntervals(v);
                }}
                className="rounded-md px-2.5 py-1.5 font-mono text-[12.5px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                {T(STR.common.shuffle)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-mono text-[12px] font-bold text-white">
                  {result.answer}
                </span>
              )}
            </div>
            {error && <p className="mb-2 font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={MERGE_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "মার্জড" : "merged", result.merged.length],
          ["n", intervals.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "দেখছি" : "current", "bg-amber-400"],
          ["cur", "bg-sky-500"],
          [lang === "bn" ? "আউটপুট" : "output", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
