'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  REC_CODE,
  REC_LIMITS,
  buildTrace,
  type CallNode,
  type RecFnId,
} from "@/lib/recursion";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const FNS: Array<{ id: RecFnId; name: string; expr: string }> = [
  { id: "fact", name: "Factorial", expr: "n!" },
  { id: "fib", name: "Fibonacci", expr: "fib(n)" },
];

const DX = 52;
const DY = 64;

export default function RecursionVisualizer() {
  const { lang, T } = useLang();
  const [fnId, setFnId] = useState<RecFnId>("fact");
  const lim = REC_LIMITS[fnId];
  const [n, setN] = useState(lim.def);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const trace = useMemo(() => buildTrace(fnId, n, lang), [fnId, n, lang]);
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

  function switchFn(id: RecFnId) {
    setFnId(id);
    setN(REC_LIMITS[id].def);
    setPlaying(false);
    setStepIndex(0);
  }

  // visited state up to current step
  const { entered, exited, byId } = useMemo(() => {
    const entered = new Set<number>();
    const exited = new Set<number>();
    const byId = new Map<number, CallNode>();
    (function index(nd: CallNode) {
      byId.set(nd.id, nd);
      nd.children.forEach(index);
    })(trace.root);
    for (let i = 0; i <= Math.min(stepIndex, last); i++) {
      const s = steps[i];
      if (s.type === "enter") entered.add(s.nodeId);
      else exited.add(s.nodeId);
    }
    return { entered, exited, byId };
  }, [trace, steps, stepIndex, last]);

  const stackNodes = current.stack
    .map((id) => byId.get(id))
    .filter((x): x is CallNode => !!x);
  const inStack = new Set(current.stack);
  const all: CallNode[] = [...byId.values()];

  const VB_W = 68 + Math.max(0, trace.leaves - 1) * DX + 24;
  const VB_H = 64 + trace.maxDepth * DY;
  const X = (nd: CallNode) => 34 + nd.x * DX;
  const Y = (nd: CallNode) => 30 + nd.depth * DY;
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        {/* fn tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {FNS.map((f) => (
            <button
              key={f.id}
              onClick={() => switchFn(f.id)}
              className={`flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-1.5 text-[13.5px] transition ${
                fnId === f.id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              <span className="font-medium">{f.name}</span>
              <span className={`font-mono text-[11px] ${fnId === f.id ? "opacity-70" : "text-zinc-400"}`}>
                {f.expr}
              </span>
            </button>
          ))}
          <label className="ml-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            n = {n}
            <input
              type="range"
              min={lim.min}
              max={lim.max}
              value={n}
              onChange={(e) => {
                setN(Number(e.target.value));
                setPlaying(false);
                setStepIndex(0);
              }}
              className="w-24 accent-zinc-950 dark:accent-white"
            />
          </label>
        </div>

        {/* tree panel */}
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
          <div className="overflow-x-auto p-3">
            <div className="mx-auto w-max max-w-none">
            <svg
              width={VB_W}
              height={VB_H}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              role="img"
              aria-label="Recursion call tree"
            >
              {all.flatMap((nd) =>
                nd.children.map((c) => {
                  const hot = inStack.has(nd.id) && inStack.has(c.id);
                  return (
                    <line
                      key={`${nd.id}-${c.id}`}
                      x1={X(nd)}
                      y1={Y(nd) + 15}
                      x2={X(c)}
                      y2={Y(c) - 15}
                      strokeWidth={hot ? 2.5 : 1.5}
                      className={hot ? "stroke-amber-400" : "stroke-zinc-300 dark:stroke-zinc-700"}
                    />
                  );
                })
              )}
              {all.map((nd) => {
                const isCurrent = nd.id === current.nodeId;
                const doneNd = exited.has(nd.id);
                const live = entered.has(nd.id) && !doneNd;
                return (
                  <g key={nd.id}>
                    <circle
                      cx={X(nd)}
                      cy={Y(nd)}
                      r={isCurrent ? 19 : 17}
                      className={
                        doneNd
                          ? "fill-emerald-500"
                          : live
                            ? "fill-amber-400"
                            : "fill-zinc-300 dark:fill-zinc-700"
                      }
                      strokeWidth={isCurrent ? 3 : 0}
                      stroke={isCurrent ? "#0ea5e9" : "none"}
                    />
                    <text
                      x={X(nd)}
                      y={Y(nd) + 3}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="700"
                      className={`font-mono ${doneNd || live ? "fill-white" : "fill-zinc-600 dark:fill-zinc-300"}`}
                    >
                      {nd.fn}({nd.arg})
                    </text>
                    {doneNd && nd.result !== null && (
                      <text
                        x={X(nd)}
                        y={Y(nd) + 30}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        className="fill-emerald-600 font-mono dark:fill-emerald-400"
                      >
                        ={nd.result}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
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
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.callstack)} {stackNodes.length > 0 && `· ${T(STR.common.depthW)} ${stackNodes.length}`}
          </div>
          {stackNodes.length === 0 ? (
            <p className="px-3 py-3 font-mono text-[12px] text-zinc-400">
              {T(STR.common.emptyStack)}
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100 p-1 dark:divide-zinc-900">
              {[...stackNodes].reverse().map((nd, i) => (
                <li
                  key={nd.id}
                  className={`flex items-center gap-2 rounded px-2 py-1.5 font-mono text-[12.5px] ${
                    i === 0 ? "bg-amber-100/60 dark:bg-amber-950/50" : ""
                  }`}
                >
                  <span className="text-[10px] text-zinc-400">
                    #{stackNodes.length - i}
                  </span>
                  <span className="font-semibold">
                    {nd.fn}({nd.arg})
                  </span>
                  <span className="ml-auto text-[11px] text-zinc-400">
                    {i === 0 ? T(STR.common.running) : T(STR.common.waiting)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.code)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {REC_CODE[fnId].map((line, i) => (
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
            [T(STR.common.calls), trace.calls],
            [T(STR.common.maxDepth), trace.maxDepth],
            [T(STR.common.steps), steps.length],
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
            [T(STR.common.lgOnStack), "bg-amber-400"],
            [T(STR.common.lgReturned), "bg-emerald-500"],
            [T(STR.common.lgWaiting), "bg-zinc-300 dark:bg-zinc-700"],
          ].map(([label, dot]) => (
            <span key={label} className="flex items-center gap-1.5 text-zinc-500">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
