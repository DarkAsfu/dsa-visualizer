'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GRAPH_CODE,
  GRAPH_PRESETS,
  bfsTrace,
  dfsTrace,
  type GraphAlgo,
} from "@/lib/algorithms/graph";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const NR = 20;

export default function GraphVisualizer({ initialAlgo }: { initialAlgo: GraphAlgo }) {
  const [algo, setAlgo] = useState<GraphAlgo>(initialAlgo);
  const { lang, T } = useLang();
  const [preset, setPreset] = useState(0);
  const [extraEdges, setExtraEdges] = useState<Array<[number, number]>>([]);
  const [start, setStart] = useState(0);
  const [editing, setEditing] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const graph = useMemo(() => {
    const p = GRAPH_PRESETS[preset];
    const seen = new Set(p.edges.map(([u, v]) => `${Math.min(u, v)}-${Math.max(u, v)}`));
    const edges = [...p.edges];
    for (const [u, v] of extraEdges) {
      const k = `${Math.min(u, v)}-${Math.max(u, v)}`;
      if (u !== v && !seen.has(k)) {
        seen.add(k);
        edges.push([u, v]);
      }
    }
    return { ...p, edges };
  }, [preset, extraEdges]);

  const safeStart = graph.nodes.some((n) => n.id === start) ? start : graph.nodes[0].id;

  const result = useMemo(() => {
    const fn = algo === "bfs" ? bfsTrace : dfsTrace;
    return fn(graph, safeStart, lang);
  }, [algo, graph, safeStart, lang]);
  const steps = result.steps;
  const last = steps.length - 1;
  const current = steps[Math.min(stepIndex, last)];
  const done = stepIndex >= last;
  const delay = Math.max(120, 800 - speed * 140);

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length - 1) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((s) => Math.min(s + 1, steps.length - 1));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, steps.length, delay]);

  const stopAndReset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(() => setStepIndex((s) => Math.min(last, s + 1)), [last]);
  const stepBack = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

  function playPress() {
    if (done) {
      setStepIndex(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => (stepIndex >= last ? false : !p));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepFwd();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepFwd, stepBack, stepIndex, last]);

  function onNodeClick(id: number) {
    if (!editing) return;
    if (sel === null) {
      setSel(id);
    } else if (sel === id) {
      setSel(null);
    } else {
      const a = Math.min(sel, id);
      const b = Math.max(sel, id);
      setExtraEdges((es) => {
        const k = `${a}-${b}`;
        const has = es.some(([u, v]) => `${Math.min(u, v)}-${Math.max(u, v)}` === k);
        const base = GRAPH_PRESETS[preset].edges.some(
          ([u, v]) => Math.min(u, v) === a && Math.max(u, v) === b
        );
        if (has) return es.filter(([u, v]) => `${Math.min(u, v)}-${Math.max(u, v)}` !== k);
        if (base) {
          // mark base edge for removal via extra list is complex — skip removal of base edges
          setSel(null);
          return es;
        }
        return [...es, [a, b]];
      });
      setSel(null);
    }
    stopAndReset();
  }

  const visitedSet = useMemo(() => new Set(current.visited), [current]);
  const containerSet = useMemo(() => new Set(current.container), [current]);
  const orderIdx = useMemo(() => {
    const m = new Map<number, number>();
    current.order.forEach((label, k) => {
      const n = graph.nodes.find((x) => x.label === label);
      if (n && !m.has(n.id)) m.set(n.id, k + 1);
    });
    return m;
  }, [current, graph]);
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);
  const byId = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);

  function nodeFill(id: number): string {
    if (id === current.current && !done) return "#f59e0b";
    if (id === safeStart) return "#059669";
    if (visitedSet.has(id)) return "#38bdf8";
    if (containerSet.has(id)) return "#fcd34d";
    return "#e4e4e7";
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["bfs", "dfs"] as GraphAlgo[]).map((id) => (
            <button
              key={id}
              onClick={() => {
                setAlgo(id);
                stopAndReset();
              }}
              className={`rounded-md border px-3 py-1.5 font-mono text-[13.5px] uppercase transition ${
                algo === id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              {id}
            </button>
          ))}
          <span className="mx-1 hidden h-6 w-px self-center bg-zinc-200 sm:block dark:bg-zinc-800" />
          {GRAPH_PRESETS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => {
                setPreset(i);
                setExtraEdges([]);
                setSel(null);
                setStart(GRAPH_PRESETS[i].nodes[0].id);
                stopAndReset();
              }}
              className={`rounded-md border px-3 py-1.5 text-[13px] transition ${
                preset === i && extraEdges.length === 0
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => {
              setEditing((e) => !e);
              setSel(null);
            }}
            className={`rounded-md border px-3 py-1.5 text-[13px] font-semibold transition ${
              editing
                ? "border-amber-400 bg-amber-400 text-zinc-950"
                : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-700"
            }`}
          >
            {editing ? "✓ " : ""}{T(STR.common.editEdges)}
          </button>
          <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            start
            <select
              value={safeStart}
              onChange={(e) => {
                setStart(Number(e.target.value));
                stopAndReset();
              }}
              className="rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 outline-none dark:border-zinc-800"
            >
              {graph.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {editing && (
          <p className="font-mono text-[12px] text-amber-600 dark:text-amber-400">
            {T(STR.common.editHint)}
          </p>
        )}

        {/* graph panel */}
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

          <div className="overflow-x-auto p-2">
            <svg viewBox="0 0 680 400" className="h-auto min-h-60 w-full" role="img" aria-label="Graph">
              {graph.edges.map(([u, v]) => {
                const a = byId.get(u);
                const b = byId.get(v);
                if (!a || !b) return null;
                const seen =
                  visitedSet.has(u) && visitedSet.has(v);
                return (
                  <line
                    key={`${u}-${v}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeWidth={seen ? 2.5 : 1.5}
                    className={seen ? "stroke-zinc-500 dark:stroke-zinc-400" : "stroke-zinc-300 dark:stroke-zinc-700"}
                  />
                );
              })}
              {graph.nodes.map((n) => {
                const discovered = visitedSet.has(n.id) || containerSet.has(n.id);
                const isCurrent = n.id === current.current && !done;
                const order = orderIdx.get(n.id);
                return (
                  <g
                    key={n.id}
                    onClick={() => onNodeClick(n.id)}
                    className={editing ? "cursor-pointer" : ""}
                  >
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isCurrent ? NR + 3 : NR}
                      fill={nodeFill(n.id)}
                      stroke={sel === n.id ? "#f59e0b" : isCurrent ? "#fff" : "none"}
                      strokeWidth={3}
                    />
                    <text
                      x={n.x}
                      y={n.y + 6}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="800"
                      fill={discovered || isCurrent || n.id === safeStart ? "#fff" : "#52525b"}
                      fontFamily="monospace"
                    >
                      {n.label}
                    </text>
                    {order !== undefined && (
                      <g>
                        <circle cx={n.x + 16} cy={n.y - 16} r="9" className="fill-zinc-950 dark:fill-white" />
                        <text
                          x={n.x + 16}
                          y={n.y - 13}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          className="fill-white dark:fill-zinc-950"
                          fontFamily="monospace"
                        >
                          {order}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* state arrays: visited[] · res[] · queue */}
          <div className="grid gap-2 border-t border-zinc-200 px-4 py-3 sm:grid-cols-3 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-1">
              <span className="w-full shrink-0 font-mono text-[11px] text-zinc-500">
                visited[]=
              </span>
              {graph.nodes.map((n) => (
                <span
                  key={n.id}
                  title={n.label}
                  className={`flex h-7 w-7 items-center justify-center rounded border font-mono text-[11px] font-bold ${
                    visitedSet.has(n.id)
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                      : "border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700"
                  }`}
                >
                  {visitedSet.has(n.id) ? "T" : ""}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="w-full shrink-0 font-mono text-[11px] text-zinc-500">
                res[]=
              </span>
              {Array.from({ length: graph.nodes.length }, (_, k) => {
                const label = current.order[k];
                return (
                  <span
                    key={k}
                    className={`flex h-7 w-7 items-center justify-center rounded border font-mono text-[11px] font-bold ${
                      label !== undefined
                        ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {label ?? ""}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap items-start gap-1">
              <span className="w-full shrink-0 pt-1 font-mono text-[11px] text-zinc-500">
                {algo === "bfs" ? "queue:" : "stack:"}
              </span>
              {algo === "bfs" ? (
                Array.from({ length: Math.max(graph.nodes.length, 1) }, (_, k) => {
                  const id = current.container[k];
                  const label = id !== undefined ? (byId.get(id)?.label ?? id) : undefined;
                  const isFront = k === 0 && label !== undefined;
                  return (
                    <span key={k} className="flex flex-col items-center gap-0.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded border font-mono text-[11px] font-bold ${
                          label !== undefined
                            ? "border-amber-400 bg-amber-400/20 text-amber-700 dark:text-amber-300"
                            : "border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        {label ?? ""}
                      </span>
                      <span className={`font-mono text-[8px] leading-none ${isFront ? "text-amber-600 dark:text-amber-400" : "text-transparent"}`}>
                        ↑{isFront ? T(STR.common.frontW) : ""}
                      </span>
                    </span>
                  );
                })
              ) : (
                <span className="flex flex-col-reverse items-center gap-1">
                  {Array.from({ length: Math.max(graph.nodes.length, 1) }, (_, k) => {
                    const id = current.container[k];
                    const label = id !== undefined ? (byId.get(id)?.label ?? id) : undefined;
                    const isTop = label !== undefined && k === current.container.length - 1;
                    return (
                      <span key={k} className="flex items-center gap-1">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded border font-mono text-[11px] font-bold ${
                            label !== undefined
                              ? "border-amber-400 bg-amber-400/20 text-amber-700 dark:text-amber-300"
                              : "border-zinc-200 dark:border-zinc-800"
                          } ${isTop ? "outline outline-2 outline-amber-500" : ""}`}
                        >
                          {label ?? ""}
                        </span>
                        <span className={`font-mono text-[8px] ${isTop ? "text-amber-600 dark:text-amber-400" : "text-transparent"}`}>
                          {isTop ? "← top" : ""}
                        </span>
                      </span>
                    );
                  })}
                </span>
              )}
            </div>
          </div>

          {/* transport */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <button
              onClick={playPress}
              className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {playing ? T(STR.common.pause) : done ? T(STR.common.replay) : T(STR.common.play)}
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
              <button onClick={stepBack} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
              <button onClick={stepFwd} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
            </div>
            <button onClick={stopAndReset} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {GRAPH_CODE[algo].map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.visitedW), result.visitedCount],
            [T(STR.common.result), current.order.length],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="text-[15px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {[
            [T(STR.common.lgChecking), "bg-amber-400"],
            [T(STR.common.lgVisited), "bg-sky-400"],
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
