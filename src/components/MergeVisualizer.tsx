'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MERGE_CODE,
  mergeTrace,
  type MResult,
} from "@/lib/linkedList2";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";
import { randomLL } from "@/lib/linkedList";

function Cells({
  vals,
  marker,
  taken,
  label,
}: {
  vals: number[];
  marker: number;
  taken: boolean[];
  label: string;
}) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {vals.map((v, i) => (
          <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
            <div
              className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${
                marker === i
                  ? "border-amber-400 bg-amber-400 text-zinc-950"
                  : taken[i]
                    ? "border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                    : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {v}
            </div>
            <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MergeVisualizer() {
  const { lang, T } = useLang();
  const [a, setA] = useState<number[]>(() => randomLL(5));
  const [b, setB] = useState<number[]>(() => randomLL(4));
  const [inA, setInA] = useState("");
  const [inB, setInB] = useState("");
  const [error, setError] = useState("");
  const [trace, setTrace] = useState<MResult | null>(null);
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

  function parse(raw: string): number[] | null {
    const nums = raw.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    const uniq = [...new Set(nums)];
    if (uniq.length < 1 || uniq.length > 8 || uniq.some((x) => !Number.isInteger(x) || x < 0 || x > 99)) {
      return null;
    }
    return uniq.sort((x, y) => x - y);
  }

  function apply() {
    const pa = inA.trim() === "" ? null : parse(inA);
    const pb = inB.trim() === "" ? null : parse(inB);
    if ((inA.trim() !== "" && pa === null) || (inB.trim() !== "" && pb === null)) {
      setError(T(STR.common.errArr2));
      return;
    }
    const na = pa ?? a;
    const nb = pb ?? b;
    setError("");
    setA(na);
    setB(nb);
    setTrace(mergeTrace(na, nb, lang));
    setStepIndex(0);
    setPlaying(false);
  }

  function shuffle() {
    const na = randomLL(3 + Math.floor(Math.random() * 4));
    const nb = randomLL(3 + Math.floor(Math.random() * 4));
    setA(na);
    setB(nb);
    setTrace(null);
    setStepIndex(0);
    setPlaying(false);
  }

  const progress = !trace || last <= 0 ? 0 : Math.round((stepIndex / last) * 100);
  const takenA = current ? current.a.map((_, i) => i < current.ai) : a.map(() => false);
  const takenB = current ? current.b.map((_, i) => i < current.bi) : b.map(() => false);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="grid gap-3 rounded-lg border border-zinc-200 p-3 sm:grid-cols-[1fr_1fr_auto] dark:border-zinc-800">
          <label className="flex items-center gap-2 font-mono text-[13px] text-zinc-500">
            A
            <input
              value={inA}
              onChange={(e) => setInA(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="1, 4, 7"
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
          </label>
          <label className="flex items-center gap-2 font-mono text-[13px] text-zinc-500">
            B
            <input
              value={inB}
              onChange={(e) => setInB(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="2, 5, 9"
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={apply}
              className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              ▶ {T(STR.common.run)}
            </button>
            <button
              onClick={shuffle}
              className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {T(STR.common.shuffle)}
            </button>
          </div>
          {error && <p className="font-mono text-[12px] text-rose-500 sm:col-span-3">{error}</p>}
        </div>

        {/* stage panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : trace ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {trace ? current.desc : "—"}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {trace ? `${stepIndex + 1}/${steps.length}` : `a:${a.length} b:${b.length}`}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-4 p-4">
            <Cells vals={trace ? current.a : a} marker={trace ? current.ai : -1} taken={trace ? takenA : a.map(() => false)} label="A" />
            <Cells vals={trace ? current.b : b} marker={trace ? current.bi : -1} taken={trace ? takenB : b.map(() => false)} label="B" />
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                {T(STR.common.result)}
              </div>
              {trace && current.result.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {current.result.map((v, i) => (
                    <div
                      key={`${i}-${v}`}
                      className={`flex h-12 w-[52px] items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums ${
                        i === current.result.length - 1 && !done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-emerald-500/50"
                      }`}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-[12px] text-zinc-400">∅</p>
              )}
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
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {MERGE_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${trace && i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.comparisons), trace ? trace.comparisons : 0],
            [T(STR.common.result), trace ? current.result.length : 0],
            [T(STR.common.steps), trace ? steps.length : 0],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="text-[15px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
