'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { TOPO_CODE, topoSort } from "@/lib/structural";
import { DAG } from "@/lib/structural";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function TopoVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => topoSort(DAG, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const orderSet = useMemo(() => new Set(current.order), [current]);
  const queueSet = useMemo(() => new Set(current.queue), [current]);

  function nodeFill(id: number): string {
    if (id === current.current && !done) return "#f59e0b";
    if (orderSet.has(id)) return "#10b981";
    if (queueSet.has(id)) return "#fcd34d";
    return "#a1a1aa";
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
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
          {current.queue.length > 0 && !done && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">{T(STR.outX.queue)}:</span>
              {current.queue.map((id) => (
                <span key={id} className={`rounded px-2 py-0.5 font-bold ${id === current.current ? "bg-amber-400 text-zinc-950" : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"}`}>
                  {DAG.nodes[id].label}
                </span>
              ))}
              <span className="text-amber-600 dark:text-amber-400">→</span>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">{T(STR.dijkstraX.trav)}</span>
            </div>
          )}
          <div className="p-2">
            <AlgoGraph nodes={DAG.nodes} edges={DAG.edges} directed nodeFill={nodeFill} />
          </div>
          <div className="space-y-2 px-4 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">indeg:</span>
              {current.indeg.map((d, i) => (
                <span key={i} className={`rounded border px-1.5 py-0.5 font-mono text-[11px] tabular-nums ${d === 0 ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-800"}`}>
                  {DAG.nodes[i].label}:{d}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">order:</span>
              {current.order.length === 0 && <span className="font-mono text-[12px] text-zinc-400">∅</span>}
              {current.order.map((id) => (
                <span key={id} className="rounded-md bg-emerald-500 px-2 py-0.5 font-mono text-[12px] font-bold text-white">
                  {DAG.nodes[id].label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <Transport
              playing={playing} done={done}
              onPlay={() => { if (done) { reset(); setPlaying(true); } else { setPlaying((p) => !p); } }}
              onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed}
            />
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">{T(STR.common.spaceHint)}</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)} · {T(STR.outX.order)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {result.order.length === 0 && <span className="text-zinc-400">—</span>}
            {result.order.map((id, i) => (
              <span key={id} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-emerald-500">→</span>}
                <span className="flex items-center gap-1 rounded bg-emerald-500 px-2 py-0.5 font-bold text-white">
                  <span className="text-[10px] opacity-70">{i + 1}</span>
                  {DAG.nodes[id].label}
                </span>
              </span>
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
            {TOPO_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.order.map((x) => DAG.nodes[x].label).join("→") || "—"],
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
