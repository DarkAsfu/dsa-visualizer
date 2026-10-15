'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { BF_CODE, W_BF, bellmanFord, fmtD, labelW } from "@/lib/weighted";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function BellmanFordVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => bellmanFord(W_BF, 0, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const edgeHL = useMemo(() => {
    const m = new Map<string, { color: string; width?: number }>();
    if (current.edge) {
      const [u, v] = current.edge;
      const neg = (current.w ?? 0) < 0;
      m.set(`${Math.min(u, v)}-${Math.max(u, v)}`, {
        color: neg ? "#f43f5e" : "#f59e0b",
        width: 3,
      });
    }
    return m;
  }, [current]);
  const updates = useMemo(() => steps.filter((s) => s.updated).length, [steps]);

  function nodeFill(id: number): string {
    if (current.edge && (current.edge[0] === id || current.edge[1] === id) && !done) return "#f59e0b";
    return "#a1a1aa";
  }
  const nodeSub = (id: number) => {
    const v = current.dist[id];
    return v === undefined || !Number.isFinite(v) ? "∞" : String(v);
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
          <div className="flex items-center gap-2 px-4 pt-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
              pass {current.pass}/{W_BF.nodes.length - 1}
            </span>
            {result.negCycle && done && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {T(STR.common.negCyc)}
              </span>
            )}
            {!result.negCycle && done && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                OK
              </span>
            )}
          </div>
          {current.edge && !done && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="rounded bg-zinc-950 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white dark:bg-white dark:text-zinc-950">
                {T(STR.outX.pass)} {current.pass}
              </span>
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{labelW(W_BF, current.edge[0])}</span>
              <span className="text-amber-600 dark:text-amber-400">—{current.w ?? "?"}→</span>
              <span className={`rounded px-2 py-0.5 font-bold text-white ${current.updated ? "bg-rose-500" : "bg-zinc-400"}`}>{labelW(W_BF, current.edge[1])}</span>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">{T(STR.dijkstraX.trav)}</span>
            </div>
          )}
          <div className="p-2">
            <AlgoGraph
              nodes={W_BF.nodes}
              edges={W_BF.edges}
              directed
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
              {T(STR.outX.output)} · dist E→{labelW(W_BF, 4)}
            </span>
            {done && (
              result.negCycle ? (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {T(STR.common.negCyc)}
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  OK
                </span>
              )
            )}
          </div>
          <div className="divide-y divide-zinc-100 font-mono text-[12.5px] dark:divide-zinc-800/60">
            {W_BF.nodes.map((nd) => (
              <div key={nd.id} className="flex items-center gap-3 px-3 py-1.5">
                <span className="w-6 shrink-0 rounded bg-zinc-100 text-center font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {nd.label}
                </span>
                <span className="shrink-0 font-bold tabular-nums">= {fmtD(result.dist[nd.id])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.dijkstraX.table)} · {T(STR.outX.pass)} {current.pass}
          </div>
          <table className="w-full font-mono text-[12.5px]">
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {W_BF.nodes.map((nd) => {
                const v = current.dist[nd.id];
                const hot = current.edge?.[1] === nd.id && !done;
                return (
                  <tr key={nd.id} className={hot ? "bg-amber-50 dark:bg-amber-950/20" : undefined}>
                    <td className="px-3 py-1.5 font-bold">{nd.label}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{v === undefined || !Number.isFinite(v) ? "∞" : v}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {BF_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.relaxW), updates],
            [T(STR.common.result), fmtD(result.dist[4])],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[11px] leading-5 text-zinc-400">
          dist: [{current.dist.map(fmtD).join(", ")}] · E→{labelW(W_BF, 4)}
        </p>
      </div>
    </div>
  );
}
