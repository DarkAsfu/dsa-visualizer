'use client';

import { useMemo, useState } from "react";
import { ArrayTreeSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { HEAP_CODE, HEAP_DEFAULT, heapTrace, parseVals } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Op = "build" | "insert" | "extract";

export default function HeapVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(HEAP_DEFAULT.join(" "));
  const [key, setKey] = useState(85);
  const [op, setOp] = useState<Op>("build");
  const [applied, setApplied] = useState({ values: HEAP_DEFAULT, key: 85, op: "build" as Op });

  const result = useMemo(
    () => heapTrace(applied.values, applied.op, applied.key, lang),
    [applied, lang]
  );
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["build", "insert", "extract"] as Op[]).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                op === o
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {o === "build" ? T(STR.treeX.buildW) : o === "insert" ? T(STR.treeX.insertW) : T(STR.treeX.extractW)}
            </button>
          ))}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.values)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          {op === "insert" && (
            <input
              type="number"
              value={key}
              min={0}
              max={99}
              onChange={(e) => setKey(Number(e.target.value))}
              aria-label={T(STR.treeX.keyK)}
              className="w-20 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
            />
          )}
          <button
            onClick={() => {
              setApplied({ values: parseVals(text), key, op });
              reset();
            }}
            className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] text-white dark:bg-white dark:text-zinc-950"
          >
            {T(STR.common.run)}
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
          {done && (
            <div className="flex items-center justify-center gap-2 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              {result.out !== undefined ? `${T(STR.treeX.extracted)} ${result.out} ✓` : "Max-heap ✓"}
            </div>
          )}
          <div className="overflow-x-auto p-2">
            <ArrayTreeSVG
              arr={current.arr}
              nodeFill={(i) => (i === current.a || i === current.b ? "#f59e0b" : "#8b5cf6")}
              nodeSub={(i) => `[${i}]`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-200 px-4 py-2.5 font-mono text-[13px] dark:border-zinc-800">
            {current.arr.map((v, i) => (
              <span key={i} className={`rounded px-2 py-0.5 font-bold tabular-nums ${i === current.a || i === current.b ? "bg-amber-400 text-zinc-950" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                {v}
              </span>
            ))}
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
            {T(STR.outX.output)} · heap
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {result.arr.map((v, i) => (
              <span key={i} className="rounded bg-zinc-100 px-2 py-0.5 font-bold tabular-nums dark:bg-zinc-800">{v}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {HEAP_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.out !== undefined ? result.out : "✓"],
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
