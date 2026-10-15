'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SEARCH_PSEUDOCODE,
  binarySearch,
  exponentialSearch,
  interpolationSearch,
  jumpSearch,
  linearSearch,
  randomSearchArray,
  ternarySearch,
} from "@/lib/algorithms/searching";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export type SearchAlgo =
  | "linear"
  | "binary"
  | "jump"
  | "interpolation"
  | "exponential"
  | "ternary";

const ALGOS: Array<{ id: SearchAlgo; name: string; complexity: string }> = [
  { id: "linear", name: "Linear", complexity: "O(n)" },
  { id: "binary", name: "Binary", complexity: "O(log n)" },
  { id: "jump", name: "Jump", complexity: "O(√n)" },
  { id: "interpolation", name: "Interp.", complexity: "O(log log n)" },
  { id: "exponential", name: "Expon.", complexity: "O(log n)" },
  { id: "ternary", name: "Ternary", complexity: "O(log₃ n)" },
];

function SearchVisualizer({ initialAlgo }: { initialAlgo: SearchAlgo }) {
  const [algoId, setAlgoId] = useState<SearchAlgo>(initialAlgo);
  const { lang, T } = useLang();
  const sorted = algoId === "binary";
  const [array, setArray] = useState<number[]>(() =>
    randomSearchArray(14, initialAlgo === "binary")
  );
  const [target, setTarget] = useState(42);
  const [targetInput, setTargetInput] = useState("42");
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(() => {
    switch (algoId) {
      case "linear":
        return linearSearch(array, target, lang);
      case "jump":
        return jumpSearch(array, target, lang);
      case "interpolation":
        return interpolationSearch(array, target, lang);
      case "exponential":
        return exponentialSearch(array, target, lang);
      case "ternary":
        return ternarySearch(array, target, lang);
      default:
        return binarySearch(array, target, lang);
    }
  }, [algoId, array, target, lang]);
  const steps = result.steps;
  const last = steps.length - 1;
  const current = steps[Math.min(stepIndex, last)];
  const done = stepIndex >= last;
  const delay = Math.max(80, 750 - speed * 140);

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

  const reset = useCallback((arr?: number[], t?: number) => {
    setPlaying(false);
    if (arr) setArray(arr);
    if (t !== undefined) {
      setTarget(t);
      setTargetInput(String(t));
    }
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(
    () => setStepIndex((s) => Math.min(last, s + 1)),
    [last]
  );
  const stepBack = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

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

  function switchAlgo(id: SearchAlgo) {
    setAlgoId(id);
    reset(randomSearchArray(array.length, id === "binary"));
  }

  function applyTarget() {
    const t = Number(targetInput);
    if (!Number.isInteger(t) || t < 1 || t > 99) {
      setError(T(STR.common.errTarget));
      return;
    }
    setError("");
    reset(undefined, t);
  }

  function handleCustom() {
    const nums = customInput
      .split(/[, ]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);
    const uniq = [...new Set(nums)];
    if (
      uniq.length < 3 ||
      uniq.length > 30 ||
      uniq.some((x) => !Number.isInteger(x) || x < 1 || x > 99)
    ) {
      setError(`${T(STR.common.errArray)} (12, 45, 7, 30)`);
      return;
    }
    setError("");
    reset(sorted ? [...uniq].sort((x, y) => x - y) : uniq);
  }

  const inRange = (i: number) => {
    if (algoId === "linear") return true;
    if (current.low === undefined || current.high === undefined) return true;
    return i >= current.low && i <= current.high;
  };
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {ALGOS.map((a) => (
            <button
              key={a.id}
              onClick={() => switchAlgo(a.id)}
              className={`flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-1.5 text-[13.5px] transition ${
                algoId === a.id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              <span className="font-medium">{a.name}</span>
              <span className={`font-mono text-[11px] ${algoId === a.id ? "opacity-70" : "text-zinc-400"}`}>
                {a.complexity}
              </span>
            </button>
          ))}
          {sorted && (
            <span className="self-center font-mono text-[11.5px] text-zinc-400">
              {T(STR.common.autoSort)}
            </span>
          )}
        </div>

        {/* cells panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span
              className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`}
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.desc}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{steps.length}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-zinc-950 transition-all dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-[13px]">
              <span className="text-zinc-500">{T(STR.common.target)}</span>
              <span className="rounded-md bg-zinc-950 px-2.5 py-1 font-bold tabular-nums text-white dark:bg-white dark:text-zinc-950">
                {target}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.array.map((v, i) => {
                const isCheck = current.check === i;
                const isFound = current.found === i;
                const isMid = current.mid === i || current.mid2 === i;
                const live = inRange(i);
                return (
                  <div key={i} className="flex w-[52px] flex-col items-center">
                    <div
                      className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${
                        isFound
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isCheck
                            ? "border-amber-400 bg-amber-400 text-zinc-950"
                            : isMid
                              ? "border-sky-500 bg-sky-500/20 text-sky-700 dark:text-sky-300"
                              : !live
                                ? "border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                                : "border-zinc-300 dark:border-zinc-700"
                      }`}
                      title={`a[${i}] = ${v}`}
                    >
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">
                      {i}
                      {algoId !== "linear" && current.low === i && " L"}
                      {algoId !== "linear" && current.high === i && " H"}
                      {current.mid === i && (current.mid2 !== undefined ? " M1" : " M")}
                      {current.mid2 === i && " M2"}
                    </span>
                  </div>
                );
              })}
            </div>
            {algoId !== "linear" && (
              <p className="mt-3 font-mono text-[11px] text-zinc-400">
                {T(STR.common.legendNote)}
              </p>
            )}
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
              <button onClick={stepBack} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
              <button onClick={stepFwd} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
            </div>
            <button
              onClick={() => reset(randomSearchArray(array.length, sorted))}
              className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {T(STR.common.shuffle)}
            </button>
            <button onClick={() => reset()} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              n={array.length}
              <input type="range" min={5} max={24} value={array.length} onChange={(e) => reset(randomSearchArray(Number(e.target.value), sorted))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
          </div>
        </div>

        {/* inputs */}
        <div className="grid gap-3 rounded-lg border border-zinc-200 p-3 sm:grid-cols-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">{T(STR.common.target)}</span>
            <input
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyTarget()}
              placeholder="42"
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
            <button onClick={applyTarget} className="shrink-0 rounded-md border border-zinc-950 px-3 py-1.5 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
              {T(STR.common.find)}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">{T(STR.common.array)}</span>
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustom()}
              placeholder="12, 45, 7, 30"
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
            <button onClick={handleCustom} className="shrink-0 rounded-md border border-zinc-950 px-3 py-1.5 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
              {T(STR.common.set)}
            </button>
          </div>
          {error && <p className="font-mono text-[12px] text-rose-500 sm:col-span-2">{error}</p>}
        </div>
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {SEARCH_PSEUDOCODE[algoId].map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.comparisons), result.comparisons],
            [T(STR.common.result), result.foundIndex === -1 ? "−1" : `a[${result.foundIndex}]`],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="text-[15px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            [T(STR.common.lgChecking), "bg-amber-400"],
            [T(STR.common.lgFound), "bg-emerald-500"],
            [T(STR.common.lgElim), "bg-zinc-300 dark:bg-zinc-700"],
          ].map(([label, dot]) => (
            <span key={label} className="flex items-center gap-1.5 text-zinc-500">
              <span className={`h-2 w-2 rounded-[2px] ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchVisualizer;
