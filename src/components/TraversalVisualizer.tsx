'use client';

import { useMemo, useState } from "react";
import { BinaryTreeSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { BST_DEFAULT, TRAV_CODE, parseVals, traverseTrace, type TravOrder } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const ORDERS: TravOrder[] = ["inorder", "preorder", "postorder", "level"];

export default function TraversalVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(BST_DEFAULT.join(" "));
  const [order, setOrder] = useState<TravOrder>("inorder");
  const [applied, setApplied] = useState({ values: BST_DEFAULT, order: "inorder" as TravOrder });

  const result = useMemo(() => traverseTrace(applied.values, applied.order, lang), [applied, lang]);
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const visitedSet = useMemo(() => new Set(current.order), [current]);
  const edgeHL = useMemo(() => {
    const m = new Map<string, string>();
    if (current.edge) {
      const [u, v] = current.edge;
      m.set(`${Math.min(u, v)}-${Math.max(u, v)}`, "#f59e0b");
    }
    return m;
  }, [current]);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {ORDERS.map((o) => (
            <button
              key={o}
              onClick={() => setOrder(o)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                order === o
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {o}
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
              setApplied({ values: parseVals(text), order });
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
          <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 px-4 py-2.5 font-mono text-[13px] dark:border-zinc-800">
            <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">{T(STR.treeX.visitW)}:</span>
            {current.order.length === 0 && <span className="text-zinc-300">···</span>}
            {current.order.map((id, i) => {
              const v = current.nodes.find((n) => n.id === id)?.val;
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-emerald-500">→</span>}
                  <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold tabular-nums text-white">{v}</span>
                </span>
              );
            })}
          </div>
          <div className="overflow-x-auto p-2">
            <BinaryTreeSVG
              nodes={current.nodes}
              root={current.root}
              nodeFill={(id) => (id === current.current ? "#f59e0b" : visitedSet.has(id) ? "#10b981" : "#a1a1aa")}
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
            {T(STR.outX.output)} · {applied.order}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {result.visit.map((v, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-emerald-500">→</span>}
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-bold tabular-nums dark:bg-zinc-800">{v}</span>
              </span>
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
            {TRAV_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.treeX.visitW), `${current.order.length}/${current.nodes.length}`],
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
