'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { BIPART, BIPART_CODE, bipartite, labelS } from "@/lib/structural";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function BipartiteVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => bipartite(BIPART, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const groups = useMemo(() => {
    const g0: number[] = [];
    const g1: number[] = [];
    (result.color ?? []).forEach((c, i) => {
      if (c === 0) g0.push(i);
      else if (c === 1) g1.push(i);
    });
    return [g0, g1];
  }, [result]);
  const conflictEdge = useMemo(() => {
    if (!current.edge) return new Map<string, { color: string; width?: number }>();
    const [u, v] = current.edge;
    return new Map([[`${Math.min(u, v)}-${Math.max(u, v)}`, { color: current.conflict ? "#f43f5e" : "#f59e0b", width: 3 }]]);
  }, [current]);

  function nodeFill(id: number): string {
    const c = current.color[id];
    if (id === current.current && !done) return "#f59e0b";
    if (c === 0) return "#38bdf8";
    if (c === 1) return "#a78bfa";
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
          <div className="p-2">
            <AlgoGraph
              nodes={BIPART.nodes}
              edges={BIPART.edges}
              directed={false}
              nodeFill={nodeFill}
              nodeSub={(id) => {
                const c = current.color[id];
                return c === null || c === undefined ? null : `c${c}`;
              }}
              edgeHL={conflictEdge}
            />
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
        {!result.ok && done && (
          <div className="rounded-lg border border-rose-500 bg-rose-500/10 px-4 py-3 font-mono text-[13px] font-bold text-rose-600 dark:text-rose-400">
            {T(STR.common.bipNo)}
          </div>
        )}
        {result.ok && done && (
          <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-3 font-mono text-[13px] font-bold text-emerald-700 dark:text-emerald-300">
            {T(STR.common.bipYes)}
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {BIPART_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.ok ? T(STR.common.yesW) : T(STR.common.noW)],
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
            [T(STR.common.lgCol0), "bg-sky-400"],
            [T(STR.common.lgCol1), "bg-violet-400"],
            [T(STR.common.lgConflict), "bg-rose-500"],
          ].map(([label, dot]) => (
            <span key={label} className="flex items-center gap-1.5 text-zinc-500">
              <span className={`h-2 w-2 rounded-[2px] ${dot}`} />
              {label}
            </span>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)}
          </div>
          <div className="space-y-1.5 p-3 font-mono text-[12.5px]">
            {groups.map((g, i) => (
              <div key={i} className="flex flex-wrap items-center gap-1.5">
                <span className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${i === 0 ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300" : "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300"}`}>
                  {i === 0 ? T(STR.outX.group0) : T(STR.outX.group1)}
                </span>
                {g.length === 0 ? (
                  <span className="text-zinc-400">—</span>
                ) : (
                  g.map((id) => (
                    <span key={id} className="rounded bg-zinc-100 px-1.5 py-0.5 font-bold dark:bg-zinc-800">
                      {labelS(BIPART, id)}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
