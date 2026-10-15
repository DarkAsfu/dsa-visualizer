'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { Transport, usePlayer } from "./usePlayer";
import { KOSA, KOSA_CODE, kosaraju, labelS } from "@/lib/structural";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const COMP_COLORS = ["#38bdf8", "#f59e0b", "#a78bfa", "#34d399", "#fb7185"];

export default function KosarajuVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => kosaraju(KOSA, lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];

  function nodeFill(id: number): string {
    const c = current.comp[id];
    if (c !== null && c !== undefined && current.phase === 2) {
      return COMP_COLORS[c % COMP_COLORS.length];
    }
    if (id === current.current && !done) return "#f59e0b";
    return "#a1a1aa";
  }
  const nodeSub = (id: number) => {
    const c = current.comp[id];
    return c === null || c === undefined ? null : `C${c + 1}`;
  };

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] ${current.phase === 1 ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 dark:border-zinc-800"}`}>
            {T(STR.common.pass1)}
          </span>
          <span className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] ${current.phase === 2 ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 dark:border-zinc-800"}`}>
            {T(STR.common.pass2)}
          </span>
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
          <div className="p-2">
            <AlgoGraph
              nodes={KOSA.nodes}
              edges={KOSA.edges}
              directed
              nodeFill={nodeFill}
              nodeSub={nodeSub}
            />
          </div>
          <div className="px-4 pb-3 font-mono text-[12px] text-zinc-500">
            finish order: {current.order.length === 0 ? "—" : current.order.map((x) => labelS(KOSA, x)).join(" → ")}
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
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {KOSA_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.sccsW), result.comps.length],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)} · {T(STR.outX.comps)} ({result.comps.length})
          </div>
          <div className="space-y-1.5 p-3 font-mono text-[12px]">
          {result.comps.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: COMP_COLORS[i % COMP_COLORS.length] }} />
              <span className="font-bold">C{i + 1}</span>
              <span className="text-zinc-500">{c.map((x) => labelS(KOSA, x)).join(", ")}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
