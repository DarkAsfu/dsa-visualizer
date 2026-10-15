'use client';

import { useMemo, useState } from "react";
import { ArrayTreeSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { SEG_CODE, SEG_DEFAULT, parseVals, segTrace } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function segRange(n: number, p: number): [number, number] {
  let l = 0;
  let r = n - 1;
  const path: number[] = [];
  let x = p;
  while (x > 0) {
    path.unshift(x % 2 === 0 ? 1 : 0);
    x = Math.floor((x - 1) / 2);
  }
  for (const go of path) {
    const m = Math.floor((l + r) / 2);
    if (go === 0) r = m;
    else l = m + 1;
  }
  return [l, r];
}

export default function SegVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(SEG_DEFAULT.join(" "));
  const [ql, setQl] = useState(1);
  const [qr, setQr] = useState(4);
  const [applied, setApplied] = useState({ values: SEG_DEFAULT, ql: 1, qr: 4 });

  const result = useMemo(
    () => segTrace(applied.values, applied.ql, applied.qr, lang),
    [applied, lang]
  );
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const takeSet = useMemo(() => new Set(current.take), [current]);
  const skipSet = useMemo(() => new Set(current.skip), [current]);
  const n = current.n;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.values)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <span className="font-mono text-[12px] text-zinc-400">[</span>
          <input
            type="number"
            value={ql}
            min={0}
            max={applied.values.length - 1}
            onChange={(e) => setQl(Number(e.target.value))}
            aria-label="ql"
            className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <span className="font-mono text-[12px] text-zinc-400">,</span>
          <input
            type="number"
            value={qr}
            min={0}
            max={applied.values.length - 1}
            onChange={(e) => setQr(Number(e.target.value))}
            aria-label="qr"
            className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <span className="font-mono text-[12px] text-zinc-400">]</span>
          <button
            onClick={() => {
              const v = parseVals(text);
              const a = Math.max(0, Math.min(ql, qr, v.length - 1));
              const b = Math.max(0, Math.min(Math.max(ql, qr), v.length - 1));
              setApplied({ values: v.length > 0 ? v : [1], ql: a, qr: b });
              reset();
            }}
            className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] text-white dark:bg-white dark:text-zinc-950"
          >
            {T(STR.treeX.queryW)}
          </button>
        </div>
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
          <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 px-4 py-2.5 font-mono text-[13px] dark:border-zinc-800">
            {applied.values.map((v, i) => (
              <span key={i} className={`rounded px-2 py-0.5 font-bold tabular-nums ${i >= applied.ql && i <= applied.qr ? "bg-amber-400 text-zinc-950" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                {v}
                <span className="ml-1 text-[10px] font-normal opacity-60">{i}</span>
              </span>
            ))}
          </div>
          {done && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              {result.parts.map(([a, b], i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-emerald-500">+</span>}
                  <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold tabular-nums text-white">[{a},{b}]</span>
                </span>
              ))}
              <span className="ml-1 font-bold tabular-nums text-emerald-700 dark:text-emerald-300">= {result.sum} ✓</span>
            </div>
          )}
          <div className="overflow-x-auto p-2">
            <ArrayTreeSVG
              arr={current.tree}
              nodeFill={(i) => (i === current.current && !done ? "#f59e0b" : takeSet.has(i) ? "#10b981" : skipSet.has(i) ? "#52525b" : "#38bdf8")}
              nodeSub={(i) => {
                const [l, r] = segRange(n, i);
                return `[${l},${r}]`;
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <Transport
              playing={playing}
              done={done}
              onPlay={() => {
                if (done) {
                  reset();
                  setPlaying(true);
                } else {
                  setPlaying((p) => !p);
                }
              }}
              onBack={stepBack}
              onFwd={stepFwd}
              onReset={reset}
              speed={speed}
              onSpeed={setSpeed}
            />
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)} · {T(STR.treeX.segments)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {result.parts.map(([a, b], i) => (
              <span key={i} className="rounded bg-emerald-100 px-2 py-0.5 font-bold tabular-nums text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                [{a},{b}]
              </span>
            ))}
            <span className="font-bold tabular-nums">= {result.sum}</span>
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {SEG_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.treeX.sumW), result.sum],
            [T(STR.common.steps), steps.length],
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
