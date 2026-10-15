'use client';

import { useMemo, useState } from "react";
import { BinaryTreeSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { BST_DEFAULT, LCA_CODE, lcaTrace, parseVals } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function LCAVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(BST_DEFAULT.join(" "));
  const [a, setA] = useState(20);
  const [b, setB] = useState(60);
  const [applied, setApplied] = useState({ values: BST_DEFAULT, a: 20, b: 60 });

  const result = useMemo(() => lcaTrace(applied.values, applied.a, applied.b, lang), [applied, lang]);
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const pathASet = useMemo(() => new Set(result.pathA), [result]);
  const pathBSet = useMemo(() => new Set(result.pathB), [result]);
  const valOf = (id: number) => current.nodes.find((n) => n.id === id)?.val;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.values)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <input
            type="number"
            value={a}
            min={0}
            max={99}
            onChange={(e) => setA(Number(e.target.value))}
            aria-label="a"
            className="w-20 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <input
            type="number"
            value={b}
            min={0}
            max={99}
            onChange={(e) => setB(Number(e.target.value))}
            aria-label="b"
            className="w-20 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              setApplied({ values: parseVals(text), a, b });
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
          {done && result.ok && (
            <div className="flex items-center justify-center gap-2 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-emerald-600 dark:text-emerald-400">LCA({applied.a}, {applied.b}) =</span>
              <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold text-white">{valOf(result.lca)}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">✓</span>
            </div>
          )}
          <div className="overflow-x-auto p-2">
            <BinaryTreeSVG
              nodes={current.nodes}
              root={current.root}
              nodeFill={(id) => {
                if (result.ok && id === result.lca && done) return "#10b981";
                if (id === current.current) return "#f59e0b";
                if (pathASet.has(id) && pathBSet.has(id)) return "#a78bfa";
                if (pathASet.has(id)) return "#38bdf8";
                if (pathBSet.has(id)) return "#fb7185";
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
            {T(STR.outX.output)} · paths
          </div>
          <div className="space-y-1.5 p-3 font-mono text-[12.5px]">
            {[
              [applied.a, result.pathA, "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"],
              [applied.b, result.pathB, "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"],
            ].map(([key, path, cls]) => (
              <div key={key as number} className="flex flex-wrap items-center gap-1.5">
                <span className={`rounded px-2 py-0.5 font-bold ${cls}`}>{key as number}</span>
                {(path as number[]).map((id, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-zinc-300">→</span>}
                    <span className={`rounded px-1.5 py-0.5 font-bold tabular-nums ${result.ok && id === result.lca ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                      {valOf(id)}
                    </span>
                  </span>
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
            {LCA_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.ok ? valOf(result.lca) : "✗"],
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
