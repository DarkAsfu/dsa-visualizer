'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SW_CODE,
  fixedWindowOp,
  randomSWArray,
  variableWindowOp,
  type SWMode,
} from "@/lib/algorithms/slidingWindow";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const MODES: Array<{ id: SWMode; hint: string }> = [
  { id: "fixed", hint: "max sum of k" },
  { id: "variable", hint: "longest ≤ K" },
];

export default function SlidingWindowVisualizer() {
  const [mode, setMode] = useState<SWMode>("fixed");
  const { lang, T } = useLang();
  const [array, setArray] = useState<number[]>(() => randomSWArray(10));
  const [k, setK] = useState(3);
  const [kInput, setKInput] = useState("3");
  const [limit, setLimit] = useState(15);
  const [limitInput, setLimitInput] = useState("15");
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(() => {
    if (mode === "fixed") return fixedWindowOp(array, k, lang);
    return variableWindowOp(array, limit, lang);
  }, [mode, array, k, limit, lang]);
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

  const reset = useCallback((arr?: number[]) => {
    setPlaying(false);
    if (arr) setArray(arr);
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(() => setStepIndex((s) => Math.min(last, s + 1)), [last]);
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

  function switchMode(m: SWMode) {
    setMode(m);
    reset();
  }

  function applyK() {
    const v = Number(kInput);
    if (!Number.isInteger(v) || v < 1 || v > array.length) {
      setError(`k: 1–${array.length}.`);
      return;
    }
    setError("");
    setK(v);
    setPlaying(false);
    setStepIndex(0);
  }

  function applyLimit() {
    const v = Number(limitInput);
    if (!Number.isInteger(v) || v < 1 || v > 200) {
      setError("K: 1–200.");
      return;
    }
    setError("");
    setLimit(v);
    setPlaying(false);
    setStepIndex(0);
  }

  function handleCustom() {
    const nums = customInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    if (nums.length < 3 || nums.length > 20 || nums.some((x) => !Number.isInteger(x) || x < 0 || x > 20)) {
      setError("3–20 integers, each 0–20.");
      return;
    }
    setError("");
    reset(nums);
  }

  const inWin = (i: number) =>
    current.win !== null && i >= current.win[0] && i <= current.win[1];
  const bw = current.bestWin;
  const inBest =
    bw !== null &&
    bw !== undefined &&
    (done ||
      (current.win !== null &&
        current.win[0] === bw[0] &&
        current.win[1] === bw[1]));
  const isBestCell = (i: number) =>
    inBest && bw !== null && bw !== undefined && i >= bw[0] && i <= bw[1];
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-1.5 text-[13.5px] transition ${
                mode === m.id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              <span className="font-medium">{m.id === "fixed" ? T(STR.common.swFixed) : T(STR.common.swVar)}</span>
              <span className={`font-mono text-[11px] ${mode === m.id ? "opacity-70" : "text-zinc-400"}`}>
                {m.hint}
              </span>
            </button>
          ))}
          {mode === "fixed" ? (
            <label className="ml-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              k =
              <input
                value={kInput}
                onChange={(e) => setKInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyK()}
                className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
              <button
                onClick={applyK}
                className="rounded-md border border-zinc-300 px-2.5 py-1 text-[12px] font-semibold hover:border-zinc-500 dark:border-zinc-700"
              >
                {T(STR.common.set)}
              </button>
            </label>
          ) : (
            <label className="ml-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              K ≤
              <input
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyLimit()}
                className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
              <button
                onClick={applyLimit}
                className="rounded-md border border-zinc-300 px-2.5 py-1 text-[12px] font-semibold hover:border-zinc-500 dark:border-zinc-700"
              >
                {T(STR.common.set)}
              </button>
            </label>
          )}
        </div>
        {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}

        {/* stage panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.desc}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{steps.length}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-center gap-4 font-mono text-[13px]">
              <span className="text-zinc-500">
                {T(STR.common.sumW)} <strong className="tabular-nums text-zinc-900 dark:text-zinc-100">{current.sum}</strong>
              </span>
              <span className="text-zinc-500">
                {T(STR.common.bestW)} <strong className="tabular-nums text-emerald-600 dark:text-emerald-400">{current.best}</strong>
              </span>
              {mode === "fixed" && (
                <span className="text-zinc-400">k = {Math.min(k, array.length)}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.array.map((v, i) => {
                const focus = current.focus?.includes(i);
                const win = inWin(i);
                const best = isBestCell(i);
                return (
                  <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
                    <div
                      className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${
                        best
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : focus
                            ? "border-amber-400 bg-amber-400 text-zinc-950"
                            : win
                              ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300"
                              : "border-zinc-300 dark:border-zinc-700"
                      }`}
                      title={`a[${i}] = ${v}`}
                    >
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">{i}</span>
                  </div>
                );
              })}
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
              <button onClick={stepBack} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
              <button onClick={stepFwd} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
            </div>
            <button onClick={() => reset()} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
            </button>
            <button onClick={() => reset(randomSWArray(array.length))} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.shuffle)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              n={array.length}
              <input type="range" min={4} max={20} value={array.length} onChange={(e) => reset(randomSWArray(Number(e.target.value)))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
          </div>
        </div>

        {/* custom array */}
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">{T(STR.common.array)}</span>
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustom()}
            placeholder="2, 8, 4, 1, 7"
            className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
          />
          <button onClick={handleCustom} className="shrink-0 rounded-md border border-zinc-950 px-3 py-1.5 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
            {T(STR.common.set)}
          </button>
        </div>
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {SW_CODE[mode].map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.bestW), result.best],
            [T(STR.common.opsW), result.ops],
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
            [T(STR.common.lgWindow), "bg-sky-500"],
            [T(STR.common.lgChecking), "bg-amber-400"],
            [T(STR.common.lgBest), "bg-emerald-500"],
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
