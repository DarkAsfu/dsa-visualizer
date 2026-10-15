'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MN_CODE,
  middleTrace,
  nthTrace,
  type MNMode,
  type MNResult,
} from "@/lib/linkedList2";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { randomLL } from "@/lib/linkedList";

export default function MiddleNthVisualizer() {
  const [mode, setMode] = useState<MNMode>("middle");
  const { lang, T } = useLang();
  const [vals, setVals] = useState<number[]>(() => randomLL(7));
  const [nStr, setNStr] = useState("2");
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [trace, setTrace] = useState<MNResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps = trace?.steps ?? [];
  const last = steps.length - 1;
  const current = steps[Math.min(Math.max(stepIndex, 0), Math.max(last, 0))];
  const done = !!trace && stepIndex >= last;
  const delay = Math.max(80, 750 - speed * 140);

  useEffect(() => {
    if (!playing || !trace) return;
    if (stepIndex >= trace.steps.length - 1) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((s) => Math.min(s + 1, trace.steps.length - 1));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, trace, delay]);

  useEffect(() => {
    if (trace && stepIndex >= trace.steps.length - 1 && mode === "nth") {
      const f = trace.final;
      const t = setTimeout(() => setVals(f), 0);
      return () => clearTimeout(t);
    }
  }, [trace, stepIndex, mode]);

  const resetView = useCallback(() => {
    setPlaying(false);
    setTrace(null);
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(() => {
    if (!trace) return;
    setStepIndex((s) => Math.min(trace.steps.length - 1, s + 1));
  }, [trace]);
  const stepBack = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (!trace) return;
        setPlaying((p) => (stepIndex >= trace.steps.length - 1 ? false : !p));
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
  }, [stepFwd, stepBack, stepIndex, trace]);

  function run() {
    setError("");
    if (mode === "middle") {
      if (vals.length < 1) {
        setError(T(STR.common.errEmpty));
        return;
      }
      setTrace(middleTrace(vals, lang));
    } else {
      const n = Number(nStr);
      if (!Number.isInteger(n) || n < 1 || n > vals.length) {
        setError(`n: 1–${vals.length}.`);
        return;
      }
      setTrace(nthTrace(vals, n, lang));
    }
    setStepIndex(0);
    setPlaying(false);
  }

  function handleCustom() {
    const nums = customInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    const uniq = [...new Set(nums)];
    if (uniq.length < 1 || uniq.length > 10 || uniq.some((x) => !Number.isInteger(x) || x < 0 || x > 99)) {
      setError(T(STR.common.errArr2));
      return;
    }
    setError("");
    setVals(uniq);
    resetView();
  }

  const shown = trace ? current.array : vals;
  const slow = trace ? current.slow : -1;
  const fast = trace ? current.fast : -1;
  const found = trace ? (current.found ?? -1) : -1;
  const progress = !trace || last <= 0 ? 0 : Math.round((stepIndex / last) * 100);

  function marker(i: number): string {
    const m: string[] = [];
    if (mode === "nth" && trace && current.lead === i && current.lead !== current.slow) m.push("L");
    if (slow === i) m.push("S");
    if (fast === i && fast !== slow) m.push("F");
    return m.join(" ");
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              ["middle", T(STR.common.tabMiddle), "2× runner"],
              ["nth", T(STR.common.tabNth), "lead gap"],
            ] as Array<[MNMode, string, string]>
          ).map(([id, name, hint]) => (
            <button
              key={id}
              onClick={() => {
                setMode(id);
                resetView();
                setError("");
              }}
              className={`flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-1.5 text-[13.5px] transition ${
                mode === id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className={`font-mono text-[11px] ${mode === id ? "opacity-70" : "text-zinc-400"}`}>
                {hint}
              </span>
            </button>
          ))}
          {mode === "nth" && (
            <label className="ml-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              n =
              <input
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
                className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
            </label>
          )}
          <button
            onClick={run}
            className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            ▶ {T(STR.common.run)}
          </button>
          {error && <span className="w-full font-mono text-[12px] text-rose-500">{error}</span>}
        </div>

        {/* stage panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : trace ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {trace ? current.desc : "—"}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {trace ? `${stepIndex + 1}/${steps.length}` : `n=${shown.length}`}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>

          <div className="p-4">
            <div className="flex flex-wrap gap-1.5">
              {shown.map((v, i) => {
                const isFound = found === i;
                const isSlow = slow === i;
                const isFast = fast === i && fast !== slow;
                return (
                  <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
                    <div
                      className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${
                        isFound
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isFast
                            ? "border-rose-500 bg-rose-500 text-white"
                            : isSlow
                              ? "border-sky-500 bg-sky-500 text-white"
                              : "border-zinc-300 dark:border-zinc-700"
                      }`}
                      title={`a[${i}] = ${v}`}
                    >
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">
                      {i}{marker(i) ? ` ${marker(i)}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* transport */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <button
              onClick={() => {
                if (!trace) return;
                if (done) {
                  setStepIndex(0);
                  setPlaying(true);
                } else setPlaying((p) => !p);
              }}
              disabled={!trace}
              className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {playing ? T(STR.common.pause) : done ? T(STR.common.replay) : T(STR.common.play)}
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
              <button onClick={stepBack} disabled={!trace} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
              <button onClick={stepFwd} disabled={!trace} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
            </div>
            <button onClick={resetView} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.clear)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
          </div>
        </div>

        {/* custom list */}
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">list</span>
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
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {MN_CODE[mode].map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${trace && i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.sizeN), shown.length],
            [T(STR.common.result), trace ? (mode === "middle" ? `a[${trace.answer}]` : `idx ${trace.answer}`) : "…"],
            [T(STR.common.steps), trace ? steps.length : 0],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            ["S", "bg-sky-500"],
            ["F", "bg-rose-500"],
            [T(STR.common.lgFound), "bg-emerald-500"],
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
