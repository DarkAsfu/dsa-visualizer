'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TP_CODE,
  containerOp,
  defaultTarget,
  pairSumOp,
  randomTPArray,
  removeDupOp,
  type TPMode,
} from "@/lib/algorithms/twoPointers";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const MODES: Array<{ id: TPMode; name: string; hint: string }> = [
  { id: "pair-sum", name: "Pair Sum", hint: "opposite ends" },
  { id: "container", name: "Container", hint: "max area" },
  { id: "remove-dup", name: "Remove Dups", hint: "slow + fast" },
];

export default function TwoPointersVisualizer() {
  const [mode, setMode] = useState<TPMode>("pair-sum");
  const { lang, T } = useLang();
  const [array, setArray] = useState<number[]>(() => randomTPArray("pair-sum", 10));
  const [target, setTarget] = useState(() => defaultTarget(randomTPArray("pair-sum", 10)));
  const [targetInput, setTargetInput] = useState(String(target));
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(() => {
    if (mode === "pair-sum") return pairSumOp(array, target, lang);
    if (mode === "container") return containerOp(array, lang);
    return removeDupOp(array, lang);
  }, [mode, array, target, lang]);
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

  function switchMode(m: TPMode) {
    const arr = randomTPArray(m, array.length);
    setMode(m);
    reset(arr, m === "pair-sum" ? defaultTarget(arr) : undefined);
  }

  function shuffle() {
    const arr = randomTPArray(mode, array.length);
    reset(arr, mode === "pair-sum" ? defaultTarget(arr) : undefined);
  }

  function applyTarget() {
    const t = Number(targetInput);
    if (!Number.isInteger(t) || t < 2 || t > 198) {
      setError(T(STR.common.errTarget198));
      return;
    }
    setError("");
    reset(undefined, t);
  }

  function handleCustom() {
    const nums = customInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    if (nums.length < 3 || nums.length > 24 || nums.some((x) => !Number.isInteger(x) || x < 1 || x > 99)) {
      setError(`${T(STR.common.errArrTP)} (3, 1, 4, 1, 5)`);
      return;
    }
    setError("");
    const arr = mode === "pair-sum" ? [...new Set(nums)].sort((x, y) => x - y) : mode === "remove-dup" ? [...nums].sort((x, y) => x - y) : nums.map((x) => Math.max(1, Math.min(30, x)));
    reset(arr, mode === "pair-sum" ? defaultTarget(arr) : undefined);
  }

  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);
  const maxH = Math.max(...current.array, 1);

  function cellClass(i: number): string {
    if (current.foundPair?.includes(i)) return "border-emerald-500 bg-emerald-500 text-white";
    if (current.check?.includes(i)) return "border-amber-400 bg-amber-400 text-zinc-950";
    if (current.l === i || current.r === i || current.slow === i || current.fast === i)
      return "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300";
    if (current.compactUntil !== undefined && i <= current.compactUntil)
      return "border-emerald-500/60 text-zinc-900 dark:text-zinc-100";
    return "border-zinc-300 dark:border-zinc-700";
  }

  function marker(i: number): string {
    const m: string[] = [];
    if (current.l === i) m.push(mode === "remove-dup" ? "" : "L");
    if (current.r === i) m.push("R");
    if (current.slow === i) m.push("S");
    if (current.fast === i) m.push("F");
    return m.filter(Boolean).join(" ");
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
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
              <span className="font-medium">{m.name}</span>
              <span className={`font-mono text-[11px] ${mode === m.id ? "opacity-70" : "text-zinc-400"}`}>
                {m.hint}
              </span>
            </button>
          ))}
        </div>

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
            {mode === "pair-sum" && (
              <div className="mb-3 flex items-center gap-2 font-mono text-[13px]">
                <span className="text-zinc-500">{T(STR.common.target)}</span>
                <span className="rounded-md bg-zinc-950 px-2.5 py-1 font-bold tabular-nums text-white dark:bg-white dark:text-zinc-950">
                  {target}
                </span>
                {current.sum !== undefined && (
                  <span className="tabular-nums text-zinc-500">{T(STR.common.sumW)} = {current.sum}</span>
                )}
              </div>
            )}
            {mode === "container" && current.maxArea !== undefined && (
              <div className="mb-3 flex items-center gap-4 font-mono text-[13px]">
                <span className="text-zinc-500">
                  {T(STR.common.areaW)} <strong className="tabular-nums text-zinc-900 dark:text-zinc-100">{current.area ?? "—"}</strong>
                </span>
                <span className="text-zinc-500">
                  {T(STR.common.bestW)} <strong className="tabular-nums text-emerald-600 dark:text-emerald-400">{current.maxArea}</strong>
                </span>
              </div>
            )}

            {mode === "container" ? (
              <div className="flex h-56 items-end gap-1">
                {current.array.map((v, i) => {
                  const active = current.l === i || current.r === i;
                  const inPair = current.check?.includes(i);
                  return (
                    <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end" title={`h[${i}] = ${v}`}>
                      <div
                        className={`w-full rounded-t-[3px] transition-all duration-150 ${
                          inPair ? "bg-amber-400" : active ? "bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                        }`}
                        style={{ height: `${Math.max(8, (v / maxH) * 200)}px` }}
                      />
                      <span className="mt-1 font-mono text-[9px] tabular-nums text-zinc-400">
                        {current.l === i ? "L" : current.r === i ? "R" : i}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {current.array.map((v, i) => (
                  <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
                    <div
                      className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${cellClass(i)}`}
                      title={`a[${i}] = ${v}`}
                    >
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">
                      {i}{marker(i) ? ` ${marker(i)}` : ""}
                    </span>
                  </div>
                ))}
              </div>
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
            <button onClick={() => reset()} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
            </button>
            <button onClick={shuffle} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.shuffle)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              n={array.length}
              <input
                type="range" min={4} max={20} value={array.length}
                onChange={(e) => {
                  const arr = randomTPArray(mode, Number(e.target.value));
                  reset(arr, mode === "pair-sum" ? defaultTarget(arr) : undefined);
                }}
                className="w-20 accent-zinc-950 dark:accent-white"
              />
            </label>
          </div>
        </div>

        {/* inputs */}
        <div className="grid gap-3 rounded-lg border border-zinc-200 p-3 sm:grid-cols-2 dark:border-zinc-800">
          {mode === "pair-sum" && (
            <div className="flex items-center gap-2">
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">{T(STR.common.target)}</span>
              <input
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyTarget()}
                placeholder="e.g. 50"
                className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
              <button onClick={applyTarget} className="shrink-0 rounded-md border border-zinc-950 px-3 py-1.5 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.find)}
              </button>
            </div>
          )}
          <div className={`flex items-center gap-2 ${mode === "pair-sum" ? "" : "sm:col-span-2"}`}>
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">{T(STR.common.array)}</span>
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustom()}
              placeholder="3, 1, 4, 1, 5"
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
            {TP_CODE[mode].map((line, i) => (
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
            [T(STR.common.result), result.verdict],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            [T(STR.common.lgPointers), "bg-sky-500"],
            [T(STR.common.lgChecking), "bg-amber-400"],
            [T(STR.common.lgKept), "bg-emerald-500"],
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
