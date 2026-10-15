'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KMP_CODE, kmpTrace } from "@/lib/kmp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function KMPVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState("ababcabcab");
  const [pat, setPat] = useState("abcab");
  const [textIn, setTextIn] = useState("ababcabcab");
  const [patIn, setPatIn] = useState("abcab");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(() => kmpTrace(text, pat, lang), [text, pat, lang]);
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

  const reset = useCallback(() => {
    setPlaying(false);
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

  function apply() {
    setText(textIn.trim().toLowerCase() || "ababcabcab");
    setPat(patIn.trim().toLowerCase() || "abcab");
    setPlaying(false);
    setStepIndex(0);
  }

  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);
  const pad = Array(Math.max(0, current.shift)).fill(null);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[12px] text-zinc-500 sm:max-w-64">
            {T(STR.common.textW)}
            <input
              value={textIn}
              onChange={(e) => setTextIn(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
          </label>
          <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            {T(STR.common.patW)}
            <input
              value={patIn}
              onChange={(e) => setPatIn(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="w-28 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
          </label>
          <button
            onClick={apply}
            className="shrink-0 rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {T(STR.common.set)}
          </button>
          <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${current.phase === "lps" ? "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300" : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"}`}>
            {T(STR.common.phaseW)}: {current.phase}
          </span>
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

          <div className="space-y-3 overflow-x-auto p-4">
            {/* LPS row */}
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">LPS</div>
              <div className="flex gap-1">
                {current.pat.map((ch, j) => (
                  <div key={j} className="flex w-9 flex-col items-center">
                    <div className="flex h-8 w-full items-center justify-center rounded border border-zinc-200 font-mono text-[12px] dark:border-zinc-800">
                      {ch}
                    </div>
                    <div className={`mt-0.5 flex h-6 w-full items-center justify-center rounded font-mono text-[11px] font-bold tabular-nums ${current.lps[j] === null ? "text-zinc-300 dark:text-zinc-700" : "bg-violet-500/15 text-violet-700 dark:text-violet-300"}`}>
                      {current.lps[j] ?? "·"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* text row */}
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">{T(STR.common.textW)}</div>
              <div className="flex gap-1">
                {current.text.map((ch, i) => {
                  const hot = i === current.ti;
                  const good = hot && current.ok === true;
                  const bad = hot && current.ok === false;
                  return (
                    <div
                      key={i}
                      className={`flex h-10 w-9 items-center justify-center rounded-md border font-mono text-[15px] font-bold transition ${
                        good
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : bad
                            ? "border-rose-500 bg-rose-500 text-white"
                            : hot
                              ? "border-amber-400 bg-amber-400 text-zinc-950"
                              : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* pattern row, offset by shift */}
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">{T(STR.common.patW)}</div>
              <div className="flex gap-1">
                {pad.map((_, i) => (
                  <div key={`p${i}`} className="h-10 w-9 shrink-0" />
                ))}
                {current.pat.map((ch, j) => {
                  const hot = j === current.pj;
                  const good = hot && current.ok === true;
                  const bad = hot && current.ok === false;
                  return (
                    <div
                      key={j}
                      className={`flex h-10 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-[15px] font-bold transition ${
                        good
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : bad
                            ? "border-rose-500 bg-rose-500 text-white"
                            : hot
                              ? "border-amber-400 bg-amber-400 text-zinc-950"
                              : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            </div>
            {current.fallback && (
              <p className="font-mono text-[12px] text-violet-600 dark:text-violet-400">
                fallback j: {current.fallback[0]} → {current.fallback[1]} (text stays)
              </p>
            )}
            {current.foundAt !== null && current.foundAt !== undefined && (
              <p className="font-mono text-[13px]">
                <span className="text-zinc-500">{T(STR.common.result)} = </span>
                <strong className="text-emerald-600 dark:text-emerald-400">index {current.foundAt}</strong>
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
            <button onClick={reset} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
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
            {KMP_CODE.map((line, i) => (
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
            [T(STR.common.result), result.foundAt === -1 ? T(STR.common.absentW) : `idx ${result.foundAt}`],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            [T(STR.common.lgChecking), "bg-amber-400"],
            [T(STR.common.lgFound), "bg-emerald-500"],
            ["fallback", "bg-violet-500"],
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
