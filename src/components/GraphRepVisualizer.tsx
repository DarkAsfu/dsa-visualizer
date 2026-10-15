'use client';

import { useMemo, useState } from "react";
import AlgoGraph from "./AlgoGraph";
import { GRAPH_PRESETS } from "@/lib/algorithms/graph";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function GraphRepVisualizer() {
  const { T } = useLang();
  const [sel, setSel] = useState<number | null>(null);
  const [directed, setDirected] = useState(false);
  const g = GRAPH_PRESETS[0];
  const n = g.nodes.length;

  const mat = useMemo(() => {
    const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (const [u, v] of g.edges) {
      m[u][v] = 1;
      if (!directed) m[v][u] = 1;
    }
    return m;
  }, [g.edges, n, directed]);

  const adj = useMemo(() => {
    const m = new Map<number, number[]>();
    for (const x of g.nodes) m.set(x.id, []);
    for (const [u, v] of g.edges) {
      m.get(u)?.push(v);
      if (!directed) m.get(v)?.push(u);
    }
    return m;
  }, [g, directed]);

  const edgeCount = directed ? g.edges.length : g.edges.length;
  const maxEdges = directed ? n * (n - 1) : (n * (n - 1)) / 2;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          <div className="flex overflow-hidden rounded-md border border-zinc-200 font-mono text-[12.5px] dark:border-zinc-800">
            <button
              onClick={() => setDirected(false)}
              className={`px-3 py-1.5 ${!directed ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}
            >
              undirected
            </button>
            <button
              onClick={() => setDirected(true)}
              className={`border-l border-zinc-200 px-3 py-1.5 dark:border-zinc-800 ${directed ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}
            >
              directed
            </button>
          </div>
          <span className="self-center font-mono text-[12px] text-zinc-400">
            {g.nodes.length} vertices · {edgeCount} edges · density {((edgeCount / maxEdges) * 100).toFixed(0)}%
          </span>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.repMH)}
          </div>
          <div className="overflow-x-auto p-4">
            <table className="mx-auto border-collapse font-mono text-[13px]">
              <thead>
                <tr>
                  <th className="w-10" />
                  {g.nodes.map((x) => (
                    <th
                      key={x.id}
                      onClick={() => setSel(sel === x.id ? null : x.id)}
                      className={`w-11 cursor-pointer py-1 text-center tabular-nums ${sel === x.id ? "text-amber-500" : "text-zinc-400"}`}
                    >
                      {x.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.nodes.map((r) => (
                  <tr key={r.id}>
                    <th
                      onClick={() => setSel(sel === r.id ? null : r.id)}
                      className={`w-10 cursor-pointer text-center tabular-nums ${sel === r.id ? "text-amber-500" : "text-zinc-400"}`}
                    >
                      {r.label}
                    </th>
                    {g.nodes.map((c) => {
                      const hot = sel !== null && (sel === r.id || sel === c.id);
                      return (
                        <td
                          key={c.id}
                          onClick={() => setSel(sel === r.id ? null : r.id)}
                          className={`w-11 cursor-pointer border border-zinc-200 py-2 text-center tabular-nums dark:border-zinc-800 ${
                            mat[r.id][c.id] === 1
                              ? hot
                                ? "bg-amber-400 font-bold text-zinc-950"
                                : "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                              : hot
                                ? "bg-zinc-100 dark:bg-zinc-800"
                                : ""
                          }`}
                        >
                          {mat[r.id][c.id]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.repLH)}
          </div>
          <div className="grid gap-1 p-4 font-mono text-[13px] sm:grid-cols-2">
            {g.nodes.map((x) => (
              <button
                key={x.id}
                onClick={() => setSel(sel === x.id ? null : x.id)}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-left transition ${
                  sel === x.id
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"
                }`}
              >
                <span className="font-bold">{x.label} →</span>
                <span className="tabular-nums text-zinc-500">
                  [{(adj.get(x.id) ?? []).map((v) => g.nodes[v].label).join(", ") || "—"}]
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.picW)}
          </div>
          <div className="p-2">
            <AlgoGraph
              nodes={g.nodes.map((x) => ({ ...x, x: x.x * 0.94, y: x.y * 0.94 }))}
              edges={g.edges.map(([u, v]) => ({ u, v, w: 1 }))}
              directed={directed}
              nodeFill={(id) => (sel === id ? "#f59e0b" : "#a1a1aa")}
              onNodeClick={(id) => setSel(sel === id ? null : id)}
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)}
          </div>
          <div className="p-3 font-mono text-[12.5px]">
            {sel === null ? (
              <span className="text-zinc-400">◦ ◦ ◦</span>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">
                  {g.nodes[sel].label}
                </span>
                <span className="text-zinc-400">→</span>
                {((adj.get(sel) ?? []).length === 0) && <span className="text-zinc-400">—</span>}
                {(adj.get(sel) ?? []).map((v) => (
                  <span key={v} className="rounded bg-zinc-100 px-1.5 py-0.5 font-bold dark:bg-zinc-800">
                    {g.nodes[v].label}
                  </span>
                ))}
                <span className="ml-1 tabular-nums text-zinc-400">
                  · deg {(adj.get(sel) ?? []).length}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 text-[13px] leading-6 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">Matrix</strong> {T(STR.common.repM)}
          </p>
          <p className="mt-2">
            <strong className="text-zinc-900 dark:text-zinc-100">List</strong> {T(STR.common.repL)}
          </p>
          <p className="mt-2 font-mono text-[12px] text-zinc-400">
            {T(STR.common.spaceHint)}
          </p>
        </div>
      </div>
    </div>
  );
}
