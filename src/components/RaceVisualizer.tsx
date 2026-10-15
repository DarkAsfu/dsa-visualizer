'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSortResult } from "@/lib/algorithms/sorting";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const RACERS = [
  { id: "bubble", name: "Bubble" },
  { id: "selection", name: "Selection" },
  { id: "insertion", name: "Insertion" },
  { id: "shell", name: "Shell" },
  { id: "merge", name: "Merge" },
  { id: "quick", name: "Quick" },
  { id: "heap", name: "Heap" },
  { id: "counting", name: "Counting" },
  { id: "radix", name: "Radix" },
  { id: "bucket", name: "Bucket" },
];

function randomArray(size: number): number[] {
  const s = new Set<number>();
  while (s.size < size) s.add(5 + Math.floor(Math.random() * 90));
  return [...s];
}

export default function RaceVisualizer() {
  const { lang, T } = useLang();
  const [array, setArray] = useState<number[]>(() => randomArray(14));
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const traces = useMemo(
    () => RACERS.map((r) => ({ ...r, res: getSortResult(r.id, array, lang) })),
    [array, lang]
  );
  const maxLen = Math.max(...traces.map((t) => t.res.steps.length));
  const done = tick >= maxLen - 1;
  const delay = Math.max(40, 400 - speed * 70);

  useEffect(() => {
    if (!playing) return;
    if (tick >= maxLen - 1) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setTick((s) => Math.min(s + 1, maxLen - 1));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, tick, maxLen, delay]);

  const reset = useCallback((arr?: number[]) => {
    setPlaying(false);
    if (arr) setArray(arr);
    setTick(0);
  }, []);

  const stepFwd = useCallback(() => setTick((s) => Math.min(maxLen - 1, s + 1)), [maxLen]);
  const stepBack = useCallback(() => setTick((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => (tick >= maxLen - 1 ? false : !p));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepFwd();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepFwd, stepBack, tick, maxLen]);

  const finished = traces
    .filter((t) => t.res.steps.length - 1 <= tick)
    .sort((a, b) => a.res.steps.length - b.res.steps.length);
  const rankOf = new Map(finished.map((t, i) => [t.id, i + 1]));
  const leader =
    finished.length > 0
      ? finished[0].name
      : [...traces].sort(
          (a, b) =>
            Math.min(tick, b.res.steps.length - 1) / (b.res.steps.length - 1) -
            (Math.min(tick, a.res.steps.length - 1) / (a.res.steps.length - 1))
        )[0].name;
  const maxVal = Math.max(...array, 1);
  const progress = maxLen <= 1 ? 100 : Math.round((tick / (maxLen - 1)) * 100);

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => (done ? reset() : setPlaying((p) => !p))}
          className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {playing ? T(STR.common.pause) : done ? T(STR.common.replay) : T(STR.common.play)}
        </button>
        <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
          <button onClick={stepBack} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
          <button onClick={stepFwd} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
        </div>
        <button onClick={() => reset()} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
          {T(STR.common.reset)}
        </button>
        <button onClick={() => reset(randomArray(array.length))} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
          {T(STR.common.shuffle)}
        </button>
        <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
          {speed}×
          <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
        </label>
        <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
          n={array.length}
          <input type="range" min={8} max={20} value={array.length} onChange={(e) => reset(randomArray(Number(e.target.value)))} className="w-20 accent-zinc-950 dark:accent-white" />
        </label>
        <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {T(STR.common.bestW)}: {leader}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
          <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
        </div>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {traces.map((t) => {
            const step = t.res.steps[Math.min(tick, t.res.steps.length - 1)];
            const isDone = t.res.steps.length - 1 <= tick;
            const rank = rankOf.get(t.id);
            return (
              <li key={t.id} className="flex items-center gap-3 px-4 py-2">
                <span className="w-20 shrink-0 truncate text-[13px] font-semibold">
                  {t.name}
                </span>
                <div className="flex h-12 min-w-0 flex-1 items-end gap-[2px]">
                  {step.array.map((v, i) => {
                    let bg = "bg-zinc-300 dark:bg-zinc-700";
                    if (step.sortedIndices.includes(i)) bg = "bg-emerald-500";
                    if (step.compare?.includes(i)) bg = "bg-amber-400";
                    if (step.swap?.includes(i)) bg = "bg-rose-500";
                    return (
                      <div
                        key={i}
                        className={`min-w-0 flex-1 rounded-t-[2px] ${bg}`}
                        style={{ height: `${Math.max(4, (v / maxVal) * 44)}px` }}
                      />
                    );
                  })}
                </div>
                <span className="hidden w-24 shrink-0 truncate font-mono text-[11px] text-zinc-400 sm:block" title={step.description}>
                  {isDone ? "✓" : step.description}
                </span>
                <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-zinc-500">
                  {t.res.comparisons}c
                </span>
                <span className={`w-10 shrink-0 text-right font-mono text-[12px] font-bold ${rank ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                  {rank ? `#${rank}` : `${Math.round((Math.min(tick, t.res.steps.length - 1) / (t.res.steps.length - 1)) * 100)}%`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="font-mono text-[11px] text-zinc-400">{T(STR.common.spaceHint)}</p>
    </div>
  );
}
