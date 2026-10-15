'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { PRIM_CODE, W_SAMPLE, labelW, prim } from "@/lib/weighted";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function mstWeight(u: number, v: number): number | undefined {
  const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
  return W_SAMPLE.edges.find((e) => `${Math.min(e.u, e.v)}-${Math.max(e.u, e.v)}` === key)?.w;
}

export default function PrimVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => prim(W_SAMPLE, 0, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const inSet = useMemo(() => new Set(current.inTree.map((b, i) => (b ? i : -1)).filter((i) => i >= 0)), [current]);
  const mstSet = useMemo(() => {
    const s = new Set<string>();
    for (const [u, v] of current.mst) s.add(`${Math.min(u, v)}-${Math.max(u, v)}`);
    return s;
  }, [current]);
  const edgeHL = useMemo(() => {
    const m = new Map<string, { color: string; width?: number }>();
    if (current.edge) {
      const [u, v] = current.edge;
      m.set(`${Math.min(u, v)}-${Math.max(u, v)}`, { color: "#f59e0b", width: 3 });
    }
    for (const k of mstSet) m.set(k, { color: "#10b981", width: 3 });
    return m;
  }, [current, mstSet]);

  function nodeFill(id: number): string {
    if (id === current.current && !done) return "#f59e0b";
    if (inSet.has(id)) return "#10b981";
    return "#a1a1aa";
  }
  const nodeSub = (id: number) => {
    const v = current.key[id];
    if (inSet.has(id)) return "✓";
    return v === null || v === undefined ? "∞" : String(v);
  };

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
          {current.edge && !done && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{labelW(W_SAMPLE, current.edge[0])}</span>
              <span className="text-amber-600 dark:text-amber-400">—{mstWeight(current.edge[0], current.edge[1]) ?? "?"}→</span>
              <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold text-white">{labelW(W_SAMPLE, current.edge[1])}</span>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">{T(STR.dijkstraX.trav)}</span>
            </div>
          )}
          <div className="p-2">
            <AlgoGraph
              nodes={W_SAMPLE.nodes}
              edges={W_SAMPLE.edges}
              directed={false}
              nodeFill={nodeFill}
              nodeSub={nodeSub}
              edgeHL={edgeHL}
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
          <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {T(STR.outX.output)} · MST
            </span>
            <span className="font-mono text-[12px] font-bold tabular-nums">
              {T(STR.outX.total)} {current.total}
            </span>
          </div>
          <div className="divide-y divide-zinc-100 font-mono text-[12.5px] dark:divide-zinc-800/60">
            {current.mst.length === 0 && (
              <div className="px-3 py-1.5 text-zinc-400">—</div>
            )}
            {current.mst.map(([u, v], i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-1.5">
                <span className="w-6 shrink-0 rounded bg-emerald-100 text-center font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {labelW(W_SAMPLE, u)} – {labelW(W_SAMPLE, v)}
                </span>
                <span className="shrink-0 tabular-nums">+{mstWeight(u, v)}</span>
              </div>
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
            {PRIM_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.mstEdges), `${current.mst.length}/${W_SAMPLE.nodes.length - 1}`],
            [T(STR.common.costW), current.total],
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
