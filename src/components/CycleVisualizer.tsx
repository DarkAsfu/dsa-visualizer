'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { CYCLE_CODE, CYCLE_D, dirCycle, labelS } from "@/lib/structural";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const GRAY = "#f59e0b";
const BLACK = "#38bdf8";

export default function CycleVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => dirCycle(CYCLE_D, 0, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const stackSet = useMemo(() => new Set(current.stack), [current]);
  const cycSet = useMemo(() => new Set(current.cyclePath ?? []), [current]);
  const edgeHL = useMemo(() => {
    const m = new Map<string, { color: string; width?: number }>();
    if (current.edge) {
      const [u, v] = current.edge;
      m.set(`${Math.min(u, v)}-${Math.max(u, v)}`, {
        color: current.kind === "back" ? "#f43f5e" : "#f59e0b",
        width: 3,
      });
    }
    return m;
  }, [current]);

  function nodeFill(id: number): string {
    if (cycSet.has(id) && current.verdict) return "#f43f5e";
    if (id === current.current && !done) return GRAY;
    const c = current.color[id];
    if (c === 1) return GRAY;
    if (c === 2) return BLACK;
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
          {current.edge && !done && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{labelS(CYCLE_D, current.edge[0])}</span>
              <span className="text-amber-600 dark:text-amber-400">→</span>
              <span className={`rounded px-2 py-0.5 font-bold text-white ${current.kind === "back" ? "bg-rose-500" : "bg-zinc-400"}`}>{labelS(CYCLE_D, current.edge[1])}</span>
              {current.kind === "back" && (
                <span className="rounded bg-rose-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  {T(STR.common.lgBack)}
                </span>
              )}
            </div>
          )}
          <div className="p-2">
            <AlgoGraph
              nodes={CYCLE_D.nodes}
              edges={CYCLE_D.edges}
              directed
              nodeFill={nodeFill}
              nodeSub={(id) => (stackSet.has(id) ? "stack" : null)}
              edgeHL={edgeHL}
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
        {current.verdict !== undefined && (
          <div className={`overflow-hidden rounded-lg border font-mono ${current.verdict ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400" : "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>
            <div className="border-b border-current/20 px-4 py-1.5 text-[11px] uppercase tracking-[0.12em] opacity-70">
              {T(STR.outX.output)}
            </div>
            <div className="px-4 py-2.5 text-[13px] font-bold">
              {current.verdict
                ? `cycle: ${current.cyclePath?.map((x) => labelS(CYCLE_D, x)).join(" → ")}`
                : "acyclic ✓"}
            </div>
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {CYCLE_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.hasCycle ? T(STR.common.cycYes) : T(STR.common.cycNo)],
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
            [T(STR.common.lgGray), "bg-amber-400"],
            [T(STR.common.lgBlack), "bg-sky-400"],
            [T(STR.common.lgBack), "bg-rose-500"],
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
