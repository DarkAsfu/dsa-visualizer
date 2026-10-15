'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { ASTAR_CODE, H_TO_F, W_SAMPLE, astar, labelW } from "@/lib/weighted";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const GOAL = 5;

export default function AstarVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => astar(W_SAMPLE, 0, GOAL, H_TO_F, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const closedSet = useMemo(() => new Set(current.closed.map((c, i) => (c ? i : -1)).filter((i) => i >= 0)), [current]);
  const pathSet = useMemo(() => new Set(current.path ?? []), [current]);
  const openSet = useMemo(() => new Set(current.open.map((o) => o.id)), [current]);
  const finalPath = result.path ?? [];
  const edgeHL = useMemo(() => {
    const m = new Map<string, { color: string; width?: number }>();
    if (done) {
      for (let i = 1; i < finalPath.length; i++) {
        m.set(`${Math.min(finalPath[i - 1], finalPath[i])}-${Math.max(finalPath[i - 1], finalPath[i])}`, { color: "#10b981", width: 3 });
      }
    }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, lang]);

  function nodeFill(id: number): string {
    if (id === 0) return "#059669";
    if (id === GOAL) return "#e11d48";
    if (pathSet.has(id) && done) return "#10b981";
    if (id === current.current && !done) return "#f59e0b";
    if (openSet.has(id)) return "#fcd34d";
    if (closedSet.has(id)) return "#38bdf8";
    return "#a1a1aa";
  }
  const nodeSub = (id: number) => {
    const g = current.g[id];
    if (g === null || g === undefined) return null;
    return `g${g} h${H_TO_F[id] ?? "?"}`;
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
          {done && finalPath.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{T(STR.outX.pathTo)} {labelW(W_SAMPLE, GOAL)}:</span>
              {finalPath.map((id, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-emerald-500">→</span>}
                  <span className={`rounded px-2 py-0.5 font-bold ${i === 0 || i === finalPath.length - 1 ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"}`}>
                    {labelW(W_SAMPLE, id)}
                  </span>
                </span>
              ))}
              <span className="ml-1 tabular-nums text-emerald-700 dark:text-emerald-300">{T(STR.outX.cost)} {result.cost}</span>
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
          <div className="px-4 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">open:</span>
              {current.open.length === 0 && <span className="font-mono text-[12px] text-zinc-400">∅</span>}
              {current.open.map((o) => (
                <span key={o.id} className="rounded-md border border-zinc-200 px-2 py-0.5 font-mono text-[12px] font-bold dark:border-zinc-700">
                  {labelW(W_SAMPLE, o.id)}<span className="font-normal text-zinc-400"> f={o.f}</span>
                </span>
              ))}
            </div>
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
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {ASTAR_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            ["cost", result.cost === -1 ? "—" : result.cost],
            [T(STR.common.result), result.path ? result.path.map((x) => labelW(W_SAMPLE, x)).join("→") : "—"],
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
            [T(STR.common.lgOpen), "bg-amber-300"],
            [T(STR.common.lgClosed), "bg-sky-400"],
            [T(STR.common.lgPath), "bg-emerald-500"],
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
