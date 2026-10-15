'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { KRUSKAL_CODE, W_SAMPLE, key2, kruskal, labelW } from "@/lib/weighted";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function rootOf(parent: number[], x: number): number {
  let r = x;
  while (parent[r] !== r) r = parent[r];
  return r;
}

const COMP_COLORS = ["#38bdf8", "#f59e0b", "#a78bfa", "#34d399", "#fb7185", "#facc15"];

export default function KruskalVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => kruskal(W_SAMPLE, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const validEdge = current.edge[0] >= 0 && !done;
  const verdicts = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const s of steps.slice(0, stepIndex + 1)) {
      if (s.edge[0] >= 0) m.set(key2(s.edge[0], s.edge[1]), s.take);
    }
    return m;
  }, [steps, stepIndex]);
  const compOf = useMemo(() => {
    const roots = new Map<number, number>();
    let c = 0;
    const out = new Map<number, number>();
    for (let i = 0; i < W_SAMPLE.nodes.length; i++) {
      const r = rootOf(current.parent, i);
      if (!roots.has(r)) roots.set(r, c++);
      out.set(i, roots.get(r)!);
    }
    return out;
  }, [current]);
  const mstSet = useMemo(() => {
    const s = new Set<string>();
    for (const [u, v] of current.mst) s.add(key2(u, v));
    return s;
  }, [current]);

  function nodeFill(id: number): string {
    if (current.edge[0] === id || current.edge[1] === id) {
      return current.take ? "#10b981" : "#f43f5e";
    }
    return COMP_COLORS[(compOf.get(id) ?? 0) % COMP_COLORS.length];
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
          {validEdge && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{labelW(W_SAMPLE, current.edge[0])}</span>
              <span className="text-amber-600 dark:text-amber-400">—{current.w}→</span>
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{labelW(W_SAMPLE, current.edge[1])}</span>
              <span className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${current.take ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                {current.take ? T(STR.outX.take) : T(STR.outX.skip)}
              </span>
            </div>
          )}
          <div className="p-2">
            <AlgoGraph
              nodes={W_SAMPLE.nodes}
              edges={W_SAMPLE.edges}
              directed={false}
              nodeFill={nodeFill}
              nodeSub={(id) => `r${rootOf(current.parent, id)}`}
              edgeHL={
                new Map(
                  [...mstSet].map((k) => [k, { color: "#10b981", width: 3 }] as [string, { color: string; width?: number }])
                )
              }
            />
          </div>
          <div className="px-4 pb-3 font-mono text-[11px] text-zinc-400">
            parent: [{current.parent.join(", ")}] · rank: [{current.rank.join(", ")}]
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
            {result.sorted.map((e, i) => {
              const v = verdicts.get(key2(e.u, e.v));
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-1.5">
                  <span className="w-6 shrink-0 text-zinc-400 tabular-nums">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {labelW(W_SAMPLE, e.u)} – {labelW(W_SAMPLE, e.v)}
                    <span className="text-zinc-400"> · {e.w}</span>
                  </span>
                  {v === undefined ? (
                    <span className="shrink-0 text-[11px] text-zinc-300">···</span>
                  ) : v ? (
                    <span className="shrink-0 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{T(STR.outX.take)}</span>
                  ) : (
                    <span className="shrink-0 text-[11px] font-bold text-rose-500">{T(STR.outX.skip)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {KRUSKAL_CODE.map((line, i) => (
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
