'use client';

import { useMemo, useState } from "react";
import { BinaryTreeSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { BST_CODE, BST_DEFAULT, bstDeleteTrace, bstInsertTrace, bstSearchTrace, parseVals } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Op = "search" | "insert" | "delete";

export default function BSTVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(BST_DEFAULT.join(" "));
  const [key, setKey] = useState(60);
  const [op, setOp] = useState<Op>("search");
  const [applied, setApplied] = useState({ values: BST_DEFAULT, key: 60, op: "search" as Op });

  const result = useMemo(() => {
    const { values, key: k, op: o } = applied;
    if (o === "insert") return bstInsertTrace(values, k, lang);
    if (o === "delete") return bstDeleteTrace(values, k, lang);
    return bstSearchTrace(values, k, lang);
  }, [applied, lang]);
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const valOf = (id: number) => current.nodes.find((n) => n.id === id)?.val;
  const edgeHL = useMemo(() => {
    const m = new Map<string, string>();
    if (current.edge) {
      const [u, v] = current.edge;
      m.set(`${Math.min(u, v)}-${Math.max(u, v)}`, "#f59e0b");
    }
    return m;
  }, [current]);

  const final = steps[steps.length - 1];
  const inorder = useMemo(() => {
    const out: number[] = [];
    const byId = new Map(final.nodes.map((n) => [n.id, n]));
    const rec = (id: number) => {
      if (id === -1) return;
      const n = byId.get(id);
      if (!n) return;
      rec(n.left);
      out.push(n.val);
      rec(n.right);
    };
    rec(final.root);
    return out;
  }, [final]);

  const ok = "ok" in result ? result.ok : result.found;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["search", "insert", "delete"] as Op[]).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                op === o
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {o === "search" ? T(STR.treeX.searchW) : o === "insert" ? T(STR.treeX.insertW) : T(STR.treeX.deleteW)}
            </button>
          ))}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.values)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <input
            type="number"
            value={key}
            min={0}
            max={99}
            onChange={(e) => setKey(Number(e.target.value))}
            aria-label={T(STR.treeX.keyK)}
            className="w-20 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              setApplied({ values: parseVals(text), key, op });
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
          {current.edge && !done && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{valOf(current.edge[0])}</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {applied.key < (valOf(current.edge[0]) ?? 0) ? "←" : "→"}
              </span>
              <span className="rounded bg-zinc-400 px-2 py-0.5 font-bold text-white">{valOf(current.edge[1]) ?? "∅"}</span>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {(valOf(current.edge[0]) ?? 0) > applied.key ? T(STR.treeX.goL) : T(STR.treeX.goR)}
              </span>
            </div>
          )}
          {done && (
            <div className={`flex items-center justify-center gap-2 border-b px-4 py-2 font-mono text-[13px] font-bold ${ok ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"}`}>
              {op} {applied.key} {ok ? "✓" : "✗"}
            </div>
          )}
          <div className="overflow-x-auto p-2">
            <BinaryTreeSVG
              nodes={current.nodes}
              root={current.root}
              nodeFill={(id) => (id === current.current && !done ? "#f59e0b" : "#38bdf8")}
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
            {T(STR.outX.output)} · {T(STR.treeX.inorder)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {inorder.map((v, i) => (
              <span key={i} className={`rounded px-2 py-0.5 font-bold tabular-nums ${v === applied.key && ok ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                {v}
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
            {BST_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), ok ? "✓" : "✗"],
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
