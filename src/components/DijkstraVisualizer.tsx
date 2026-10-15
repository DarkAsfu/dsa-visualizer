'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { DIJKSTRA_CODE, W_SAMPLE, dijkstra, fmtD, labelW } from "@/lib/weighted";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function edgeWeight(u: number, v: number): number | undefined {
  const key = `${Math.min(u, v)}-${Math.max(u, v)}`;
  return W_SAMPLE.edges.find((e) => `${Math.min(e.u, e.v)}-${Math.max(e.u, e.v)}` === key)?.w;
}

export default function DijkstraVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const [target, setTarget] = useState(5);
  const result = useMemo(() => dijkstra(W_SAMPLE, 0, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  // reset when lang changes
  const current = steps[Math.min(stepIndex, last)];
  const visitedSet = useMemo(() => new Set(current.visited), [current]);
  const path = useMemo(() => result.paths[target] ?? [], [result, target]);
  const pathEdges = useMemo(() => {
    const s = new Set<string>();
    for (let i = 1; i < path.length; i++) {
      s.add(`${Math.min(path[i - 1], path[i])}-${Math.max(path[i], path[i - 1])}`);
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, lang]);
  const pathSet = useMemo(() => new Set(path), [path]);

  const edgeHL = useMemo(() => {
    const m = new Map<string, { color: string; width?: number }>();
    if (current.edge && !done) {
      const [u, v] = current.edge;
      m.set(`${Math.min(u, v)}-${Math.max(u, v)}`, { color: "#f59e0b", width: 3 });
    } else if (done) {
      for (const k of pathEdges) m.set(k, { color: "#10b981", width: 3 });
    }
    return m;
  }, [current, done, pathEdges]);

  function nodeFill(id: number): string {
    if (done && pathSet.has(id)) return "#10b981";
    if (id === current.current && !done) return "#f59e0b";
    if (visitedSet.has(id)) return "#10b981";
    if (current.updated === id) return "#f43f5e";
    return "#a1a1aa";
  }
  const nodeSub = (id: number) => {
    const v = current.dist[id];
    return v === undefined || !Number.isFinite(v) ? "∞" : String(v);
  };

  const travW = current.edge && !done ? edgeWeight(current.edge[0], current.edge[1]) : undefined;

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
              <span className="text-amber-600 dark:text-amber-400">—{travW ?? "?"}→</span>
              <span className="rounded bg-rose-500 px-2 py-0.5 font-bold text-white">{labelW(W_SAMPLE, current.edge[1])}</span>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">{T(STR.dijkstraX.trav)}</span>
            </div>
          )}
          {done && path.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              {path.map((id, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-emerald-500">→</span>}
                  <span className={`rounded px-2 py-0.5 font-bold ${i === 0 || i === path.length - 1 ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"}`}>
                    {labelW(W_SAMPLE, id)}
                  </span>
                </span>
              ))}
              <span className="ml-1 tabular-nums text-emerald-700 dark:text-emerald-300">= {fmtD(result.dist[target])}</span>
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
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.dijkstraX.paths)} {labelW(W_SAMPLE, 0)}
          </div>
          <div className="divide-y divide-zinc-100 font-mono text-[12.5px] dark:divide-zinc-800/60">
            {W_SAMPLE.nodes.map((nd) => {
              const p = result.paths[nd.id] ?? [];
              const active = nd.id === target;
              return (
                <button
                  key={nd.id}
                  onClick={() => setTarget(nd.id)}
                  className={`flex w-full items-center gap-3 px-3 py-1.5 text-left transition-colors ${active ? "bg-emerald-50 dark:bg-emerald-950/30" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"}`}
                >
                  <span className={`w-6 shrink-0 rounded text-center font-bold ${active ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                    {nd.label}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-zinc-600 dark:text-zinc-400">
                    {p.length === 0 ? "∞" : p.map((id) => labelW(W_SAMPLE, id)).join(" → ")}
                  </span>
                  <span className="shrink-0 font-bold tabular-nums">= {fmtD(result.dist[nd.id])}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.dijkstraX.table)}
          </div>
          <table className="w-full font-mono text-[12.5px]">
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {W_SAMPLE.nodes.map((nd) => {
                const v = current.dist[nd.id];
                const fin = visitedSet.has(nd.id);
                return (
                  <tr key={nd.id} className={nd.id === current.current && !done ? "bg-amber-50 dark:bg-amber-950/20" : undefined}>
                    <td className="px-3 py-1.5 font-bold">{nd.label}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{v === undefined || !Number.isFinite(v) ? "∞" : v}</td>
                    <td className={`px-3 py-1.5 text-right text-[11px] ${fin ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                      {fin ? T(STR.dijkstraX.finalS) : T(STR.dijkstraX.tent)}
                    </td>
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
            {DIJKSTRA_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.visitedW), `${current.visited.length}/${W_SAMPLE.nodes.length}`],
            [T(STR.common.result), fmtD(result.dist[5])],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            [T(STR.common.lgChecking), "bg-amber-400"],
            [T(STR.common.lgRelaxed), "bg-rose-500"],
            [T(STR.common.lgFound), "bg-emerald-500"],
          ].map(([label, dot]) => (
            <span key={label} className="flex items-center gap-1.5 text-zinc-500">
              <span className={`h-2 w-2 rounded-[2px] ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
