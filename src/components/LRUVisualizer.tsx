'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { LRU_CODE, lruTrace, parseLRU } from "@/lib/stackQueue2";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const DEF_OPS = "p1 p2 g1 p3 g2 p4 g1 g3";
const DEF_CAP = 2;

export default function LRUVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(DEF_OPS);
  const [cap, setCap] = useState(DEF_CAP);
  const [applied, setApplied] = useState({ ops: DEF_OPS, cap: DEF_CAP });

  const ops = useMemo(() => parseLRU(applied.ops), [applied]);
  const result = useMemo(() => lruTrace(Math.max(1, applied.cap), ops, lang), [applied, ops, lang]);
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            type="number"
            value={cap}
            min={1}
            max={6}
            onChange={(e) => setCap(Number(e.target.value))}
            aria-label="capacity"
            className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder="p1 g1 p2 …"
            className="w-56 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              setApplied({ ops: text, cap });
              reset();
            }}
            className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] text-white dark:bg-white dark:text-zinc-950"
          >
            {T(STR.common.run)}
          </button>
          <span className="font-mono text-[11px] text-zinc-400">p = put · g = get</span>
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
          <div className="flex items-center gap-2 overflow-x-auto p-4">
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-zinc-400">MRU</span>
            {current.order.length === 0 && (
              <span className="rounded-md border border-dashed border-zinc-300 px-6 py-3 font-mono text-[12px] text-zinc-400 dark:border-zinc-700">empty</span>
            )}
            {current.order.map((k, i) => (
              <span key={k} className="flex shrink-0 items-center gap-2">
                {i > 0 && <span className="text-zinc-300">←</span>}
                <span className={`flex flex-col items-center rounded-lg border-2 px-3 py-1.5 font-mono tabular-nums transition ${
                  k === current.cur && !done
                    ? current.hit === false
                      ? "border-rose-500 bg-rose-500/10"
                      : "border-amber-400 bg-amber-400/10"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}>
                  <span className="text-[15px] font-bold">k{k}</span>
                  <span className="text-[12px] text-zinc-500">= {current.vals[k]}</span>
                </span>
              </span>
            ))}
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-zinc-400">LRU</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-200 px-4 py-2.5 font-mono text-[12px] dark:border-zinc-800">
            {ops.map((o, i) => (
              <span key={i} className="rounded bg-zinc-100 px-1.5 py-0.5 tabular-nums dark:bg-zinc-800">
                {o.op}{o.k}{o.op === "put" ? `:${o.v}` : ""}
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
            {T(STR.outX.output)} · MRU → LRU
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {result.order.map((k, i) => (
              <span key={k} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-zinc-300">←</span>}
                <span className="rounded bg-sky-100 px-2 py-0.5 font-bold tabular-nums text-sky-800 dark:bg-sky-950 dark:text-sky-300">k{k}</span>
              </span>
            ))}
            <span className="ml-2 text-[12px] text-zinc-500">
              {result.hits} hits · {result.miss} miss
            </span>
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {LRU_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            ["hits", current.hits],
            ["miss", current.miss],
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
