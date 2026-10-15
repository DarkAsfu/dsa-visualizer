'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LL_CODE,
  llCycle,
  llDelete,
  llInsert,
  llReverse,
  randomLL,
  type LLMode,
  type LLResult,
} from "@/lib/linkedList";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const SLOT = 84;
const NW = 56;
const NH = 40;
const X0 = 24;
const YC = 44;

function xPos(i: number): number {
  return X0 + i * SLOT;
}

const LABEL_STYLE: Record<string, string> = {
  prev: "bg-sky-500",
  curr: "bg-amber-400 text-zinc-950",
  next: "bg-zinc-400",
  S: "bg-sky-500",
  F: "bg-rose-500",
  MEET: "bg-emerald-500",
  "S·F": "bg-amber-400 text-zinc-950",
};

function ChainSVG({
  vals,
  next,
  head,
  hi,
  labels,
}: {
  vals: number[];
  next: (number | null)[];
  head: number | null;
  hi: Set<number>;
  labels: Record<number, string>;
}) {
  const W = X0 * 2 + Math.max(vals.length, 1) * SLOT;
  const H = 110;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Linked list"
    >
      <defs>
        <marker id="ll-z" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="none" strokeWidth="1.5" className="stroke-zinc-400" />
        </marker>
        <marker id="ll-r" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
        </marker>
        <marker id="ll-s" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
        </marker>
      </defs>
      {vals.map((_, i) => {
        const j = next[i];
        if (j === null || j === undefined || j < 0 || j >= vals.length) return null;
        const x1 = xPos(i) + NW;
        const x2 = xPos(j);
        const backward = j < i;
        const jump = !backward && j > i + 1;
        if (!backward && !jump) {
          return (
            <line
              key={`${i}-${j}`}
              x1={x1}
              y1={YC}
              x2={x2 - 2}
              y2={YC}
              strokeWidth="1.5"
              className="stroke-zinc-400"
              markerEnd="url(#ll-z)"
            />
          );
        }
        const dir = backward ? 1 : -1;
        const mx = (x1 + x2) / 2;
        const my = YC + dir * 34;
        return (
          <path
            key={`${i}-${j}`}
            d={`M${x1},${YC} Q${mx},${my} ${x2 - 2},${YC}`}
            fill="none"
            strokeWidth="1.5"
            stroke={backward ? "#f43f5e" : "#0ea5e9"}
            markerEnd={backward ? "url(#ll-r)" : "url(#ll-s)"}
          />
        );
      })}
      {vals.map((v, i) => (
        <g key={i}>
          <rect
            x={xPos(i)}
            y={YC - NH / 2}
            width={NW}
            height={NH}
            rx="8"
            className={
              v === -1
                ? "fill-transparent stroke-zinc-300 dark:stroke-zinc-700"
                : hi.has(i)
                  ? "fill-amber-400 stroke-amber-400"
                  : "fill-white stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700"
            }
            strokeWidth={hi.has(i) ? 0 : 1.5}
            strokeDasharray={v === -1 ? "4 3" : undefined}
          />
          <text
            x={xPos(i) + NW / 2}
            y={YC + 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            className={`font-mono ${hi.has(i) ? "fill-zinc-950" : "fill-zinc-900 dark:fill-zinc-100"}`}
          >
            {v === -1 ? "" : v}
          </text>
          {next[i] === null && (
            <text x={xPos(i) + NW / 2} y={YC + NH / 2 + 14} textAnchor="middle" fontSize="10" className="fill-zinc-400 font-mono">
              ∅
            </text>
          )}
          {head === i && (
            <text x={xPos(i) + NW / 2} y={YC - NH / 2 - 8} textAnchor="middle" fontSize="10" className="fill-zinc-400 font-mono">
              head
            </text>
          )}
          {labels[i] && (
            <g>
              <rect
                x={xPos(i) + NW / 2 - 20}
                y={YC + NH / 2 + 18}
                width="40"
                height="16"
                rx="8"
                className={LABEL_STYLE[labels[i]] ?? "bg-amber-400"}
              />
              <text
                x={xPos(i) + NW / 2}
                y={YC + NH / 2 + 30}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                className="fill-white font-mono"
              >
                {labels[i]}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

export default function LinkedListVisualizer({ initialMode }: { initialMode: LLMode }) {
  const [mode, setMode] = useState<LLMode>(initialMode);
  const { lang, T } = useLang();
  const [vals, setVals] = useState<number[]>(() => randomLL(5));
  const [nextC, setNextC] = useState<(number | null)[]>(() =>
    Array.from({ length: 5 }, (_, i) => (i + 1 < 5 ? i + 1 : null))
  );
  const [value, setValue] = useState("25");
  const [idx, setIdx] = useState("2");
  const [customInput, setCustomInput] = useState("");
  const [cycleAt, setCycleAt] = useState("-1");
  const [error, setError] = useState("");
  const [trace, setTrace] = useState<LLResult | null>(null);
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
    if (trace && stepIndex >= trace.steps.length - 1 && mode !== "cycle") {
      const f = trace;
      const t = setTimeout(() => {
        setVals(f.finalVals);
        setNextC(f.finalNext);
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

  function run(r: LLResult) {
    setError("");
    setTrace(r);
    setStepIndex(0);
    setPlaying(false);
  }

  function readVal(): number | null {
    const v = Number(value);
    if (!Number.isInteger(v) || v < 0 || v > 99) {
      setError(T(STR.common.errVal099));
      return null;
    }
    return v;
  }

  function doAppend() {
    const v = readVal();
    if (v === null) return;
    if (vals.length >= 8) {
      setError(T(STR.common.errFull10));
      return;
    }
    run(llInsert(vals, vals.length, v, lang));
  }
  function doPrepend() {
    const v = readVal();
    if (v === null) return;
    if (vals.length >= 8) {
      setError(T(STR.common.errFull10));
      return;
    }
    run(llInsert(vals, 0, v, lang));
  }
  function doInsert() {
    const v = readVal();
    if (v === null) return;
    const i = Number(idx);
    if (!Number.isInteger(i) || i < 0 || i > vals.length || vals.length >= 8) {
      setError(T(STR.common.errIdx));
      return;
    }
    run(llInsert(vals, i, v, lang));
  }
  function doDelete() {
    const i = Number(idx);
    if (!Number.isInteger(i) || i < 0 || i >= vals.length) {
      setError(vals.length === 0 ? T(STR.common.errEmpty) : T(STR.common.errIdx));
      return;
    }
    run(llDelete(vals, i, lang));
  }
  function doReverse() {
    if (vals.length < 1) {
      setError(T(STR.common.errEmpty));
      return;
    }
    run(llReverse(vals, lang));
  }
  function doDetect() {
    const c = Number(cycleAt);
    if (!Number.isInteger(c) || c < -1 || c >= vals.length) {
      setError(T(STR.common.errIdx));
      return;
    }
    run(llCycle(vals, c, lang));
  }
  function handleCustom() {
    const nums = customInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    const uniq = [...new Set(nums)];
    if (uniq.length < 1 || uniq.length > 8 || uniq.some((x) => !Number.isInteger(x) || x < 0 || x > 99)) {
      setError(T(STR.common.errArr2));
      return;
    }
    setError("");
    setVals(uniq);
    setNextC(Array.from({ length: uniq.length }, (_, i) => (i + 1 < uniq.length ? i + 1 : null)));
    resetView();
  }

  const shownVals = trace ? current.vals : vals;
  const shownNext = trace ? current.next : nextC;
  const shownHead = trace ? current.head : vals.length > 0 ? 0 : null;
  const hiSet = new Set(trace ? (current.hi ?? []) : []);
  const labels = trace ? (current.labels ?? {}) : {};
  const progress = !trace || last <= 0 ? 0 : Math.round((stepIndex / last) * 100);

  const statThird =
    mode === "cycle"
      ? !trace || current.verdict === undefined || current.verdict === null
        ? "…"
        : current.verdict
          ? T(STR.common.lgFound)
          : T(STR.common.absentW)
      : shownHead === null
        ? "∅"
        : `idx ${shownHead}`;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["singly", "Singly", "insert · delete"],
              ["reverse", "Reverse", "flip links"],
              ["cycle", "Cycle", "tortoise · hare"],
            ] as Array<[LLMode, string, string]>
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
          {mode === "cycle" ? (
            <>
              <label className="flex items-center gap-2 text-zinc-500">
                {T(STR.common.cycAt)}
                <input
                  value={cycleAt}
                  onChange={(e) => setCycleAt(e.target.value)}
                  className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                />
              </label>
              <button
                onClick={doDetect}
                className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                ▶ {T(STR.common.opDetect)}
              </button>
            </>
          ) : mode === "reverse" ? (
            <button
              onClick={doReverse}
              className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              ▶ {T(STR.common.opReverse)}
            </button>
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
              <label className="flex items-center gap-2 text-zinc-500">
                {T(STR.common.indexW)}
                <input
                  value={idx}
                  onChange={(e) => setIdx(e.target.value)}
                  className="w-14 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                />
              </label>
              {(
                [
                  [T(STR.common.opAppend), doAppend],
                  [T(STR.common.opPrepend), doPrepend],
                  [T(STR.common.opInsert), doInsert],
                  [T(STR.common.opDelete), doDelete],
                ] as Array<[string, () => void]>
              ).map(([label, fn]) => (
                <button
                  key={label}
                  onClick={fn}
                  className="rounded-md border border-zinc-950 px-3 py-1.5 font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950"
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
              {trace ? current.desc : mode === "cycle" ? `${T(STR.common.cycAt)}: −1 = none` : `${T(STR.common.valueW)} → op`}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {trace ? `${stepIndex + 1}/${steps.length}` : `n=${shownVals.length}`}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>

          <div className="overflow-x-auto p-4">
            {shownVals.length === 0 ? (
              <p className="py-6 text-center font-mono text-[13px] text-zinc-400">
                {T(STR.common.errEmpty)}
              </p>
            ) : (
              <ChainSVG vals={shownVals} next={shownNext} head={shownHead} hi={hiSet} labels={labels} />
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
          </div>
        </div>

        {/* custom list */}
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">list</span>
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustom()}
            placeholder="3, 1, 4"
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
            {LL_CODE[mode].map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${trace && i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.sizeN), shownVals.length],
            [mode === "cycle" ? T(STR.common.result) : T(STR.common.headW), statThird],
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
