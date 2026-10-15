'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SORT_PSEUDOCODE, getSortResult } from "@/lib/algorithms/sorting";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const ALGOS = [
  { id: "bubble", name: "Bubble", complexity: "O(n²)", href: "/bubble-sort" },
  { id: "selection", name: "Selection", complexity: "O(n²)", href: "/selection-sort" },
  { id: "insertion", name: "Insertion", complexity: "O(n²)", href: "/insertion-sort" },
  { id: "merge", name: "Merge", complexity: "O(n log n)", href: "/merge-sort" },
  { id: "quick", name: "Quick", complexity: "O(n log n)", href: "/quick-sort" },
  { id: "heap", name: "Heap", complexity: "O(n log n)", href: "/heap-sort" },
  { id: "counting", name: "Counting", complexity: "O(n+k)", href: "/counting-sort" },
  { id: "radix", name: "Radix", complexity: "O(nk)", href: "/radix-sort" },
  { id: "bucket", name: "Bucket", complexity: "O(n+k)", href: "/bucket-sort" },
  { id: "shell", name: "Shell", complexity: "O(n log n)", href: "/shell-sort" },
];

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => 5 + Math.floor(Math.random() * 95));
}

const CHART_H = 300;

export default function SortingVisualizer({ initialAlgo = "bubble" }: { initialAlgo?: string }) {
  const [algoId] = useState(initialAlgo);
  const [array, setArray] = useState<number[]>(() => randomArray(20));
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const { lang, T } = useLang();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(() => getSortResult(algoId, array, lang), [algoId, array, lang]);
  const steps = result.steps;
  const last = steps.length - 1;
  const current = steps[Math.min(stepIndex, last)];
  const done = stepIndex >= last;

  const delay = Math.max(30, 600 - speed * 130);

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length - 1) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((s) => Math.min(s + 1, steps.length - 1));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, steps.length, delay]);

  const reset = useCallback((newArr?: number[]) => {
    setPlaying(false);
    if (newArr) setArray(newArr);
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(
    () => setStepIndex((s) => Math.min(last, s + 1)),
    [last]
  );
  const stepBack = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

  // keyboard: space = play/pause, arrows = step
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => (stepIndex >= last ? false : !p));
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
  }, [stepFwd, stepBack, stepIndex, last]);

  function handleCustom() {
    const parts = customInput
      .split(/[, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const nums = parts.map(Number);
    if (
      nums.length < 3 ||
      nums.length > 50 ||
      nums.some((n) => !Number.isFinite(n) || n < 1 || n > 200)
    ) {
      setError(`${T(STR.common.errNumbers)} (40, 10, 30, 20, 50)`);
      return;
    }
    setError("");
    reset(nums);
  }

  const maxVal = Math.max(...current.array, 1);
  const showValues = current.array.length <= 28;
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      {/* ---------- main column ---------- */}
      <div className="min-w-0 space-y-4">
        {/* algo tabs — separate routes */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {ALGOS.map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className={`flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-1.5 text-[13.5px] transition ${
                algoId === a.id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              <span className="font-medium">{a.name}</span>
              <span
                className={`font-mono text-[11px] ${
                  algoId === a.id ? "opacity-70" : "text-zinc-400"
                }`}
              >
                {a.complexity}
              </span>
            </Link>
          ))}
        </div>

        {/* chart panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          {/* status strip */}
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span
              className={`h-2 w-2 rounded-full ${
                playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"
              }`}
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.description || "—"}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{steps.length}
            </span>
          </div>
          {/* progress hairline */}
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-zinc-950 transition-all dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* bars */}
          <div className="relative px-4 pb-2 pt-5">
            {/* gridlines */}
            {[0.25, 0.5, 0.75].map((f) => (
              <div
                key={f}
                className="pointer-events-none absolute left-4 right-4 border-t border-dashed border-zinc-200 dark:border-zinc-800"
                style={{ bottom: `${8 + f * CHART_H}px` }}
              />
            ))}
            <div
              className="flex items-end gap-[3px]"
              style={{ height: CHART_H }}
            >
              {current.array.map((v, i) => {
                const isCompare = current.compare?.includes(i);
                const isSwap = current.swap?.includes(i);
                const isOverwrite = current.overwrite === i;
                const isSorted = current.sortedIndices.includes(i);
                let bg =
                  "bg-zinc-300 dark:bg-zinc-700";
                if (isSorted) bg = "bg-emerald-500";
                if (isCompare) bg = "bg-amber-400";
                if (isSwap || isOverwrite) bg = "bg-rose-500";
                const h = Math.max(4, (v / maxVal) * (CHART_H - 28));
                return (
                  <div
                    key={i}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    title={`a[${i}] = ${v}`}
                  >
                    {showValues && (
                      <span
                        className={`mb-1 font-mono text-[10px] tabular-nums leading-none ${
                          isCompare || isSwap || isOverwrite
                            ? "font-bold text-zinc-950 dark:text-white"
                            : "text-zinc-400"
                        }`}
                      >
                        {v}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t-[3px] transition-[height,background-color] duration-150 ${bg}`}
                      style={{ height: `${h}px` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-[3px] pt-1">
              {current.array.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 text-center font-mono text-[9px] tabular-nums leading-none text-zinc-400"
                >
                  {current.array.length <= 28 ? i : ""}
                </div>
              ))}
            </div>
          </div>

          {/* transport */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <button
              onClick={() => (done ? reset() : setPlaying((p) => !p))}
              className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {playing ? T(STR.common.pause) : done ? T(STR.common.replay) : T(STR.common.play)}
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={stepBack}
                className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={T(STR.common.stepBack)}
                title={`← : ${T(STR.common.stepBack)}`}
              >
                ‹
              </button>
              <button
                onClick={stepFwd}
                className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                aria-label={T(STR.common.stepFwd)}
                title={`→ : ${T(STR.common.stepFwd)}`}
              >
                ›
              </button>
            </div>
            <button
              onClick={() => reset()}
              className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {T(STR.common.reset)}
            </button>
            <button
              onClick={() => reset(randomArray(array.length))}
              className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {T(STR.common.shuffle)}
            </button>
            <span className="mx-1 hidden h-4 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 accent-zinc-950 dark:accent-white"
                title={T(STR.common.speed)}
              />
            </label>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {T(STR.common.size)} {array.length}
              <input
                type="range"
                min={5}
                max={40}
                value={array.length}
                onChange={(e) => reset(randomArray(Number(e.target.value)))}
                className="w-20 accent-zinc-950 dark:accent-white"
                title={T(STR.common.size)}
              />
            </label>
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>

        {/* custom input */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {T(STR.common.customInput)}
            </span>
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustom()}
              placeholder="40, 10, 30, 20, 50"
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
            <button
              onClick={handleCustom}
              className="shrink-0 rounded-md border border-zinc-950 px-4 py-1.5 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950"
            >
              {T(STR.common.visualize)}
            </button>
          </div>
          {error && (
            <p className="border-t border-zinc-200 px-3 py-2 font-mono text-[12px] text-rose-500 dark:border-zinc-800">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ---------- rail ---------- */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {SORT_PSEUDOCODE[algoId].map((line, i) => (
              <div
                key={i}
                className={`flex gap-2.5 rounded px-2 ${
                  i === current.codeLine
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <span className="w-4 shrink-0 select-none text-right opacity-40">
                  {i + 1}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.comparisons), result.comparisons],
            [T(STR.common.swapsWrites), result.swaps],
            [T(STR.common.totalSteps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                {k}
              </dt>
              <dd className="text-[15px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            [T(STR.common.lgCompare), "bg-amber-400"],
            [T(STR.common.lgSwap), "bg-rose-500"],
            [T(STR.common.lgSorted), "bg-emerald-500"],
            [T(STR.common.lgIdle), "bg-zinc-300 dark:bg-zinc-700"],
          ].map(([label, dot]) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-zinc-500"
            >
              <span className={`h-2 w-2 rounded-[2px] ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
