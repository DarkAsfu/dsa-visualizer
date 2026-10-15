'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SQ_CODE,
  dequeueTrace,
  enqueueTrace,
  frontTrace,
  parenTrace,
  peekTrace,
  popTrace,
  pushTrace,
  type SQMode,
  type SQResult,
} from "@/lib/stackQueue";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function StackQueueVisualizer({ initialMode }: { initialMode: SQMode }) {
  const [mode, setMode] = useState<SQMode>(initialMode);
  const { lang, T } = useLang();
  const [stack, setStack] = useState<number[]>([4, 17, 9]);
  const [queue, setQueue] = useState<number[]>([4, 17, 9]);
  const [value, setValue] = useState("25");
  const [expr, setExpr] = useState("([]{})");
  const [trace, setTrace] = useState<SQResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps = useMemo(() => trace?.steps ?? [], [trace]);
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

  // commit finished stack/queue ops
  useEffect(() => {
    if (trace && stepIndex >= trace.steps.length - 1 && mode !== "paren") {
      const f = trace.finalItems as number[];
      const t = setTimeout(() => {
        if (mode === "stack") setStack(f);
        else setQueue(f);
      }, 0);
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

  const [error, setError] = useState("");

  function readValue(): number | null {
    const v = Number(value);
    if (!Number.isInteger(v) || v < 0 || v > 99) {
      setError(T(STR.common.errVal099));
      return null;
    }
    return v;
  }

  function run(fn: () => SQResult) {
    setError("");
    setTrace(fn());
    setStepIndex(0);
    setPlaying(false);
  }

  function doPush() {
    const v = readValue();
    if (v === null) return;
    if (stack.length >= 10) {
      setError(T(STR.common.errFull10));
      return;
    }
    run(() => pushTrace(stack, v, lang));
  }
  function doPop() {
    if (stack.length === 0) {
      setError(T(STR.common.errStackEmpty));
      return;
    }
    run(() => popTrace(stack, lang));
  }
  function doPeek() {
    if (stack.length === 0) {
      setError(T(STR.common.errStackEmpty));
      return;
    }
    run(() => peekTrace(stack, lang));
  }
  function doEnqueue() {
    const v = readValue();
    if (v === null) return;
    if (queue.length >= 10) {
      setError(T(STR.common.errFull10));
      return;
    }
    run(() => enqueueTrace(queue, v, lang));
  }
  function doDequeue() {
    if (queue.length === 0) {
      setError(T(STR.common.errQueueEmpty));
      return;
    }
    run(() => dequeueTrace(queue, lang));
  }
  function doFront() {
    if (queue.length === 0) {
      setError(T(STR.common.errQueueEmpty));
      return;
    }
    run(() => frontTrace(queue, lang));
  }
  function doCheck() {
    const s = expr.trim();
    if (s.length === 0 || s.length > 24 || /[^()[\]{}]/.test(s)) {
      setError(T(STR.common.errParen));
      return;
    }
    run(() => parenTrace(s, lang));
  }

  const shownItems: (number | string)[] = trace
    ? current.items
    : mode === "stack"
      ? stack
      : mode === "queue"
        ? queue
        : expr.split("");
  const hiSet = new Set(trace ? (current.hi ?? []) : []);
  const progress = !trace || last <= 0 ? 0 : Math.round((stepIndex / last) * 100);
  const parenDepth = useMemo(() => {
    let m = 0;
    for (const s of steps) m = Math.max(m, s.stackView?.length ?? 0);
    return m;
  }, [steps]);

  const statTop =
    mode === "stack"
      ? (shownItems.length > 0 ? shownItems[shownItems.length - 1] : "—")
      : mode === "queue"
        ? (shownItems.length > 0 ? shownItems[0] : "—")
        : (current?.verdict === undefined || current?.verdict === null
            ? "…"
            : current.verdict
              ? T(STR.common.balW)
              : T(STR.common.unbalW));

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["stack", T(STR.common.tabStack), "LIFO"],
              ["queue", T(STR.common.tabQueue), "FIFO"],
              ["paren", T(STR.common.tabParen), "()[]{}"],
            ] as Array<[SQMode, string, string]>
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
        </div>

        {/* op bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 p-3 font-mono text-[13px] dark:border-zinc-800">
          {mode === "paren" ? (
            <>
              <span className="shrink-0 text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                {T(STR.common.exprW)}
              </span>
              <input
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doCheck()}
                placeholder="([]{})"
                className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
              <button
                onClick={doCheck}
                className="shrink-0 rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                ▶ {T(STR.common.run)}
              </button>
            </>
          ) : (
            <>
              <label className="flex items-center gap-2 text-zinc-500">
                {T(STR.common.valueW)}
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                />
              </label>
              {(mode === "stack"
                ? [
                    [T(STR.common.opPush), doPush],
                    [T(STR.common.opPop), doPop],
                    [T(STR.common.opPeek), doPeek],
                  ] as Array<[string, () => void]>
                : [
                    [T(STR.common.opEnq), doEnqueue],
                    [T(STR.common.opDeq), doDequeue],
                    [T(STR.common.opFront), doFront],
                  ] as Array<[string, () => void]>
              ).map(([label, fn]) => (
                <button
                  key={label}
                  onClick={fn}
                  className="rounded-md border border-zinc-950 px-3.5 py-1.5 font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950"
                >
                  {label}
                </button>
              ))}
            </>
          )}
          {error && <span className="w-full font-mono text-[12px] text-rose-500">{error}</span>}
        </div>

        {/* stage panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : trace ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {trace ? current.desc : mode === "paren" ? T(STR.common.exprW) : `${T(STR.common.valueW)} → op`}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {trace ? `${stepIndex + 1}/${steps.length}` : `n=${shownItems.length}`}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex min-h-56 justify-center p-4 sm:p-6">
            {mode === "stack" && (
              <div className="flex w-full max-w-[220px] flex-col-reverse gap-1.5">
                {shownItems.length === 0 && (
                  <p className="py-6 text-center font-mono text-[13px] text-zinc-400">
                    {T(STR.common.errStackEmpty)}
                  </p>
                )}
                {[...shownItems].reverse().map((v, ri) => {
                  const i = shownItems.length - 1 - ri;
                  const isTop = ri === 0;
                  return (
                    <div key={`${i}-${v}`} className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-right font-mono text-[10px] text-zinc-400">
                        {isTop ? T(STR.common.topW) : ""}
                      </span>
                      <div
                        className={`flex flex-1 items-center justify-center rounded-md border py-2.5 font-mono text-[15px] font-bold tabular-nums transition ${
                          hiSet.has(i)
                            ? "border-amber-400 bg-amber-400 text-zinc-950"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {v}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {mode === "queue" && (
              <div className="w-full max-w-[560px]">
                {shownItems.length === 0 && (
                  <p className="py-6 text-center font-mono text-[13px] text-zinc-400">
                    {T(STR.common.errQueueEmpty)}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {shownItems.map((v, i) => (
                    <div key={`${i}-${v}`} className="flex w-[52px] flex-col items-center">
                      <div
                        className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${
                          hiSet.has(i)
                            ? "border-amber-400 bg-amber-400 text-zinc-950"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {v}
                      </div>
                      <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">
                        {i === 0 ? T(STR.common.frontW) : i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mode === "paren" && (
              <div className="w-full max-w-[560px] space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {shownItems.map((v, i) => (
                    <div
                      key={`${i}-${v}`}
                      className={`flex h-11 w-10 items-center justify-center rounded-md border font-mono text-[16px] font-bold transition ${
                        hiSet.has(i)
                          ? current.verdict === false
                            ? "border-rose-500 bg-rose-500 text-white"
                            : "border-amber-400 bg-amber-400 text-zinc-950"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {v}
                    </div>
                  ))}
                </div>
                <div className="flex min-h-9 flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                    stack:
                  </span>
                  {(current?.stackView ?? []).length === 0 && (
                    <span className="font-mono text-[12px] text-zinc-400">∅</span>
                  )}
                  {(current?.stackView ?? []).map((ch, i) => (
                    <span
                      key={i}
                      className="rounded border border-zinc-300 px-2 py-0.5 font-mono text-[13px] font-bold dark:border-zinc-700"
                    >
                      {ch}
                    </span>
                  ))}
                  {current?.verdict !== undefined && current?.verdict !== null && (
                    <span
                      className={`ml-2 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                        current.verdict
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {current.verdict ? T(STR.common.balW) : T(STR.common.unbalW)}
                    </span>
                  )}
                </div>
              </div>
            )}
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
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
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
            {SQ_CODE[mode].map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${trace && i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            mode === "paren" ? [T(STR.common.depthW), parenDepth] : [T(STR.common.sizeN), shownItems.length],
            [mode === "paren" ? T(STR.common.result) : mode === "stack" ? T(STR.common.topW) : T(STR.common.frontW), statTop],
            [T(STR.common.steps), trace ? steps.length : 0],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
