'use client';

import { useMemo, useState } from "react";
import { BinaryTreeSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { BST_DEFAULT, DIA_CODE, VIEWS_CODE, diameterTrace, parseVals, viewsTrace, type ViewKind } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Mode = "diameter" | "views";
const VIEW_TABS: ViewKind[] = ["top", "bottom", "left", "right"];

export default function DiameterVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(BST_DEFAULT.join(" "));
  const [mode, setMode] = useState<Mode>("diameter");
  const [view, setView] = useState<ViewKind>("top");
  const [applied, setApplied] = useState({ values: BST_DEFAULT, mode: "diameter" as Mode });

  const dia = useMemo(
    () => (applied.mode === "diameter" ? diameterTrace(applied.values, lang) : null),
    [applied, lang]
  );
  const vw = useMemo(
    () => (applied.mode === "views" ? viewsTrace(applied.values, lang) : null),
    [applied, lang]
  );
  const result = (dia ?? vw)!;
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const pathSet = useMemo(() => new Set(dia?.path ?? []), [dia]);
  const visitedSet = useMemo(() => new Set(current.order), [current]);
  const valOf = (id: number) => current.nodes.find((n) => n.id === id)?.val;
  const code = applied.mode === "diameter" ? DIA_CODE : VIEWS_CODE;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["diameter", "views"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                mode === m
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {m}
            </button>
          ))}
          {mode === "views" && VIEW_TABS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md border px-2.5 py-1.5 font-mono text-[12px] transition ${
                view === v
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-zinc-200 text-zinc-500 dark:border-zinc-800"
              }`}
            >
              {v}
            </button>
          ))}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.values)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              setApplied({ values: parseVals(text), mode });
              reset();
            }}
            className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] text-white dark:bg-white dark:text-zinc-950"
          >
            {T(STR.common.run)}
          </button>
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
          {done && dia && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-emerald-600 dark:text-emerald-400">diameter = {dia.length}</span>
              {dia.path.map((id, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-emerald-500">→</span>}
                  <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold tabular-nums text-white">{valOf(id)}</span>
                </span>
              ))}
              <span className="font-bold text-emerald-700 dark:text-emerald-300">✓</span>
            </div>
          )}
          {done && vw && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{view}:</span>
              {vw.views[view].map((v, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-emerald-500">→</span>}
                  <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold tabular-nums text-white">{v}</span>
                </span>
              ))}
            </div>
          )}
          <div className="overflow-x-auto p-2">
            <BinaryTreeSVG
              nodes={current.nodes}
              root={current.root}
              nodeFill={(id) => {
                if (dia && done && pathSet.has(id)) return "#10b981";
                if (id === current.current) return "#f59e0b";
                if (visitedSet.has(id)) return "#38bdf8";
                return "#a1a1aa";
              }}
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
            {T(STR.outX.output)}
          </div>
          <div className="space-y-1.5 p-3 font-mono text-[12.5px]">
            {dia && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold">diameter {dia.length}:</span>
                {dia.path.map((id, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-zinc-300">→</span>}
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-bold tabular-nums dark:bg-zinc-800">{valOf(id)}</span>
                  </span>
                ))}
              </div>
            )}
            {vw && VIEW_TABS.map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-1.5">
                <span className={`w-16 rounded px-1.5 py-0.5 text-[11px] font-bold uppercase ${v === view ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"}`}>
                  {v}
                </span>
                {vw.views[v].map((x, i) => (
                  <span key={i} className="tabular-nums">{x}{i < vw.views[v].length - 1 ? "," : ""}</span>
                ))}
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
            {code.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), dia ? dia.length : "4 ✓"],
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
