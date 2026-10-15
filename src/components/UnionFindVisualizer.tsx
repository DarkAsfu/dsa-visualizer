'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { UF_CODE, unionFindDemo } from "@/lib/structural";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const L = (i: number) => String.fromCharCode(65 + i);

export default function UnionFindVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => unionFindDemo(lang), [lang]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const sets = useMemo(() => {
    const root = (x: number) => {
      let r = x;
      const seen = new Set<number>();
      while (current.parent[r] !== r && !seen.has(r)) { seen.add(r); r = current.parent[r]; }
      return r;
    };
    const m = new Map<number, number[]>();
    for (let i = 0; i < 6; i++) {
      const r = root(i);
      if (!m.has(r)) m.set(r, []);
      m.get(r)!.push(i);
    }
    return [...m.values()];
  }, [current]);
  const focusSet = useMemo(() => new Set(current.focus ?? []), [current]);
  const pathSet = useMemo(() => new Set(current.path ?? []), [current]);

  // forest layout: roots spread, children below (simple layered by depth)
  const depthOf = useMemo(() => {
    const d = new Map<number, number>();
    for (let i = 0; i < 6; i++) {
      let x = i;
      let dd = 0;
      const seen = new Set<number>();
      while (current.parent[x] !== x && !seen.has(x)) {
        seen.add(x);
        x = current.parent[x];
        dd++;
        if (dd > 8) break;
      }
      d.set(i, dd);
    }
    return d;
  }, [current]);

  const W = 640;
  const H = 240;
  const X = (i: number) => 70 + i * 100;
  const Y = (dep: number) => 60 + dep * 70;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              <strong className="text-zinc-900 dark:text-zinc-100">{current.op}</strong>
              {" · "}
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
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto min-h-48 w-full" role="img" aria-label="Disjoint sets forest">
              {Array.from({ length: 6 }, (_, i) => {
                const p = current.parent[i];
                if (p === i) return null;
                const d1 = depthOf.get(i) ?? 0;
                const d2 = depthOf.get(p) ?? 0;
                const hot = pathSet.has(i);
                return (
                  <line
                    key={i}
                    x1={X(i)}
                    y1={Y(d1) - 18}
                    x2={X(p)}
                    y2={Y(d2) + 18}
                    stroke={hot ? "#f59e0b" : undefined}
                    strokeWidth={hot ? 2.5 : 1.5}
                    className={hot ? undefined : "stroke-zinc-300 dark:stroke-zinc-700"}
                  />
                );
              })}
              {Array.from({ length: 6 }, (_, i) => {
                const d = depthOf.get(i) ?? 0;
                const isRoot = current.parent[i] === i;
                return (
                  <g key={i}>
                    <circle
                      cx={X(i)}
                      cy={Y(d)}
                      r={focusSet.has(i) ? 21 : 18}
                      fill={pathSet.has(i) ? "#f59e0b" : isRoot ? "#10b981" : "#38bdf8"}
                    />
                    <text x={X(i)} y={Y(d) + 6} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="monospace">
                      {L(i)}
                    </text>
                    <text x={X(i)} y={Y(d) + 36} textAnchor="middle" fontSize="10" className="fill-zinc-400 font-mono">
                      r{current.rank[i]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="px-4 pb-3 font-mono text-[12px] text-zinc-500">
            parent: [{current.parent.join(", ")}] · rank: [{current.rank.join(", ")}]
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
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)} · {T(STR.common.setsW)} ({sets.length})
          </div>
          <div className="space-y-1.5 px-3 py-2.5 font-mono text-[12.5px]">
            {sets.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-zinc-400 tabular-nums">{i + 1}.</span>
                {s.map((id) => (
                  <span key={id} className="rounded bg-sky-100 px-2 py-0.5 font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {L(id)}
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
            {UF_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.setsW), new Set(current.parent.map((_, i) => {
              let r = i;
              const seen = new Set<number>();
              while (current.parent[r] !== r && !seen.has(r)) { seen.add(r); r = current.parent[r]; }
              return r;
            })).size],
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
            [T(STR.common.lgRoot), "bg-emerald-500"],
            [T(STR.common.lgChild), "bg-sky-400"],
            [T(STR.common.lgFindPath), "bg-amber-400"],
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
