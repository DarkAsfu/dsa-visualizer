'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PS_CODE,
  prefixTrace,
  randomPSArray,
} from "@/lib/algorithms/prefixSum";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function PrefixSumVisualizer() {
  const { lang, T } = useLang();
  const [array, setArray] = useState<number[]>(() => randomPSArray(8));
  const [lInput, setLInput] = useState("2");
  const [rInput, setRInput] = useState("5");
  const [lr, setLr] = useState<[number, number]>([2, 5]);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(
    () => prefixTrace(array, lr[0], lr[1], lang),
    [array, lr, lang]
  );
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
    if (arr) {
      setArray(arr);
      setLr([0, Math.min(2, arr.length - 1)]);
      setLInput("0");
      setRInput(String(Math.min(2, arr.length - 1)));
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

  function applyQuery() {
    const l = Number(lInput);
    const r = Number(rInput);
    const n = array.length;
    if (!Number.isInteger(l) || !Number.isInteger(r) || l < 0 || r >= n || l > r) {
      setError(`l, r: 0–${n - 1}, l ≤ r.`);
      return;
    }
    setError("");
    setLr([l, r]);
    setPlaying(false);
    setStepIndex(0);
  }

  function handleCustom() {
    const nums = customInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    if (nums.length < 3 || nums.length > 14 || nums.some((x) => !Number.isInteger(x) || x < -20 || x > 50)) {
      setError("3–14 integers, each −20–50.");
      return;
    }
    setError("");
    reset(nums);
  }

  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  function cellClass(
    kind: "a" | "p",
    i: number,
    v: number | null
  ): string {
    if (v === null) return "border-dashed border-zinc-300 text-zinc-300 dark:border-zinc-700 dark:text-zinc-700";
    const hi = kind === "a" ? current.hiA?.includes(i) : current.hiP?.includes(i);
    const inRange =
      kind === "a" && current.range !== null && current.range !== undefined && i >= current.range[0] && i <= current.range[1];
    if (inRange) return "border-emerald-500 bg-emerald-500 text-white";
    if (hi) return "border-amber-400 bg-amber-400 text-zinc-950";
    return "border-zinc-300 dark:border-zinc-700";
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            l =
            <input
              value={lInput}
              onChange={(e) => setLInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyQuery()}
              className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
          </label>
          <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            r =
            <input
              value={rInput}
              onChange={(e) => setRInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyQuery()}
              className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
          </label>
          <button
            onClick={applyQuery}
            className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {T(STR.common.queryW)}
          </button>
          {error && <span className="font-mono text-[12px] text-rose-500">{error}</span>}
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

          <div className="space-y-3 p-4">
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">a</div>
              <div className="flex flex-wrap gap-1.5">
                {current.array.map((v, i) => (
                  <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
                    <div className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${cellClass("a", i, v)}`} title={`a[${i}] = ${v}`}>
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">{i}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">P</div>
              <div className="flex flex-wrap gap-1.5">
                {current.pref.map((v, i) => (
                  <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
                    <div className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${cellClass("p", i, v)}`} title={`P[${i}]${v === null ? " (not built yet)" : ` = ${v}`}`}>
                      {v === null ? "·" : v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">{i}</span>
                  </div>
                ))}
              </div>
            </div>
            {current.answer !== null && (
              <p className="font-mono text-[13px]">
                <span className="text-zinc-500">{T(STR.common.result)} = </span>
                <strong className="tabular-nums text-emerald-600 dark:text-emerald-400">{current.answer}</strong>
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
            <button onClick={() => reset()} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
            </button>
            <button onClick={() => reset(randomPSArray(array.length))} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.shuffle)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
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
            placeholder="3, -2, 5, 1"
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
            {PS_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.answer],
            [T(STR.common.steps), steps.length],
            [T(STR.common.sizeN), array.length],
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
