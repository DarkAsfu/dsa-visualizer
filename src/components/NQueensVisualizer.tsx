'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BACKTRACK_CODE,
  buildQueensTrace,
} from "@/lib/backtracking";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function NQueensVisualizer() {
  const { lang, T } = useLang();
  const [n, setN] = useState(4);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const trace = useMemo(() => buildQueensTrace(n, lang), [n, lang]);
  const steps = trace.steps;
  const last = steps.length - 1;
  const current = steps[Math.min(stepIndex, last)];
  const done = stepIndex >= last;
  const delay = Math.max(60, 700 - speed * 140);

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length - 1) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      const nx = Math.min(stepIndex + 1, steps.length - 1);
      setStepIndex(nx);
      // stop on solutions so the user can admire the board
      if (steps[nx]?.kind === "solution") setPlaying(false);
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, steps, steps.length, delay]);

  const reset = useCallback(() => {
    setPlaying(false);
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

  const atkSet = new Set(
    (current.attackers ?? []).map(([r, c]) => `${r},${c}`)
  );
  const focus = current.cell ? `${current.cell[0]},${current.cell[1]}` : null;
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-zinc-950 bg-zinc-950 px-3 py-1.5 text-[13.5px] font-medium text-white dark:border-white dark:bg-white dark:text-zinc-950">
            N-Queens
          </span>
          <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            n = {n}
            <input
              type="range"
              min={4}
              max={6}
              value={n}
              onChange={(e) => {
                setN(Number(e.target.value));
                setPlaying(false);
                setStepIndex(0);
              }}
              className="w-24 accent-zinc-950 dark:accent-white"
            />
          </label>
          <span className="font-mono text-[12px] text-zinc-400">
            {trace.solutions} {T(STR.common.solutions)}
          </span>
        </div>

        {/* board panel */}
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

          <div className="flex justify-center p-4 sm:p-6">
            <div
              className="grid w-full max-w-[480px] overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-700"
              style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: n * n }, (_, i) => {
                const r = Math.floor(i / n);
                const c = i % n;
                const key = `${r},${c}`;
                const hasQueen = current.board[r] === c;
                const isFocus = focus === key;
                const isAttacker = atkSet.has(key);
                const dark2 = (r + c) % 2 === 1;
                return (
                  <div
                    key={key}
                    className={`flex aspect-square items-center justify-center text-[clamp(1.2rem,5vw,2rem)] transition-colors ${
                      dark2
                        ? "bg-zinc-200 dark:bg-zinc-800"
                        : "bg-white dark:bg-zinc-900"
                    } ${
                      current.kind === "conflict" && isFocus
                        ? "bg-rose-500/40 dark:bg-rose-500/30"
                        : ""
                    } ${
                      current.kind === "solution" && hasQueen
                        ? "bg-emerald-500/25"
                        : ""
                    } ${
                      isFocus &&
                      (current.kind === "place" ||
                        current.kind === "remove")
                        ? "outline outline-2 -outline-offset-2 outline-amber-400"
                        : ""
                    }`}
                    title={`(${r}, ${c})${hasQueen ? " ♛" : ""}`}
                  >
                    {hasQueen && (
                      <span
                        className={`leading-none ${
                          isAttacker
                            ? "rounded-sm text-rose-600 outline outline-2 outline-rose-500 dark:text-rose-400"
                            : "text-zinc-950 dark:text-white"
                        }`}
                      >
                        ♛
                      </span>
                    )}
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
              {playing
                ? T(STR.common.pause)
                : done
                  ? T(STR.common.replay)
                  : current.kind === "solution"
                    ? T(STR.common.cont)
                    : T(STR.common.play)}
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={stepBack}
                className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={T(STR.common.stepBack)}
              >
                ‹
              </button>
              <button
                onClick={stepFwd}
                className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                aria-label={T(STR.common.stepFwd)}
              >
                ›
              </button>
            </div>
            <button
              onClick={reset}
              className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {T(STR.common.reset)}
            </button>
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
              />
            </label>
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>

        {/* solutions gallery */}
        {trace.boards.length > 0 && (
          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="px-1 pb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {T(STR.common.foundSol)} ({trace.boards.length})
            </div>
            <div className="flex flex-wrap gap-3">
              {trace.boards.map((b, bi) => (
                <div
                  key={bi}
                  className="grid overflow-hidden rounded border border-zinc-200 dark:border-zinc-700"
                  style={{
                    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                    width: 72,
                  }}
                  title={`Solution #${bi + 1}`}
                >
                  {Array.from({ length: n * n }, (_, i) => {
                    const r = Math.floor(i / n);
                    const cc = i % n;
                    return (
                      <div
                        key={i}
                        className={`flex aspect-square items-center justify-center text-[9px] ${
                          (r + cc) % 2 === 1
                            ? "bg-zinc-200 dark:bg-zinc-800"
                            : "bg-white dark:bg-zinc-900"
                        } ${b[r] === cc ? "text-zinc-950 dark:text-white" : "text-transparent"}`}
                      >
                        ♛
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.code)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {BACKTRACK_CODE.map((line, i) => (
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
            [T(STR.common.tries), trace.attempts],
            [T(STR.common.backtracks), trace.backtracks],
            [T(STR.common.solutions), trace.solutions],
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
            [T(STR.common.lgTrying), "bg-amber-400"],
            [T(STR.common.lgAttacked), "bg-rose-500"],
            [T(STR.common.lgSolution), "bg-emerald-500"],
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
