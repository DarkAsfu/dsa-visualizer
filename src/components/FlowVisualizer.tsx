'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { FLOW_CODE, FLOW_PRESETS, flowTrace } from "@/lib/advanced";
import { useLang } from "@/lib/i18n";

const VW = 520;
const VH = 400;

export default function FlowVisualizer() {
  const { lang } = useLang();
  const [preset, setPreset] = useState(0);
  const [speed, setSpeed] = useState(3);
  const p = FLOW_PRESETS[preset];
  const result = useMemo(() => flowTrace(p, lang), [p, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [preset, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const pathSet = new Set<string>();
  if (current.path) {
    for (let k = 0; k + 1 < current.path.length; k++) pathSet.add(`${current.path[k]}-${current.path[k + 1]}`);
  }
  const paths = steps.filter((s) => s.path && s.codeLine === 2).length;

  const edgePos = (u: number, v: number) => {
    const [ax, ay] = p.pos[u];
    const [bx, by] = p.pos[v];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.max(1, Math.hypot(dx, dy));
    const r = 22;
    return {
      x1: ax + (dx / len) * 4,
      y1: ay + (dy / len) * 4,
      x2: bx - (dx / len) * (r + 5),
      y2: by - (dy / len) * (r + 5),
      mx: (ax + bx) / 2,
      my: (ay + by) / 2,
    };
  };

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="flow network">
              <defs>
                <marker id="fl-aw" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                  <path d="M0,0 L9,4.5 L0,9" fill="none" strokeWidth="1.6" className="stroke-zinc-400" />
                </marker>
                <marker id="fl-hl" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                  <path d="M0,0 L9,4.5 L0,9" fill="none" stroke="#10b981" strokeWidth="2" />
                </marker>
              </defs>
              {p.edges.map((e, i) => {
                const { x1, y1, x2, y2, mx, my } = edgePos(e.u, e.v);
                const f = current.flow[i];
                const onPath = pathSet.has(`${e.u}-${e.v}`);
                const sat = f >= e.c;
                return (
                  <g key={i}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={onPath ? "#10b981" : undefined}
                      strokeWidth={onPath ? 3.5 : 1.5}
                      className={onPath ? undefined : "stroke-zinc-300 dark:stroke-zinc-700"}
                      markerEnd={onPath ? "url(#fl-hl)" : "url(#fl-aw)"}
                    />
                    <g>
                      <rect x={mx - 20} y={my - 11} width="40" height="20" rx="10" className="fill-white stroke-zinc-200 dark:fill-zinc-950 dark:stroke-zinc-700" />
                      <text x={mx} y={my + 4} textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="monospace"
                        className={sat ? "fill-rose-500" : onPath ? "fill-emerald-600 dark:fill-emerald-400" : "fill-zinc-600 dark:fill-zinc-300"}>
                        {f}/{e.c}
                      </text>
                    </g>
                  </g>
                );
              })}
              {p.labels.map((lb, i) => {
                const [cx, cy] = p.pos[i];
                const inCut = current.cut[i];
                const onPath = current.path?.includes(i) ?? false;
                return (
                  <g key={lb}>
                    {inCut && <circle cx={cx} cy={cy} r={27} fill="none" className="stroke-sky-500" strokeWidth={2} strokeDasharray="4 3" />}
                    <circle cx={cx} cy={cy} r={21} fill={i === p.s ? "#0ea5e9" : i === p.t ? "#8b5cf6" : onPath ? "#10b981" : "#52525b"} />
                    <text x={cx} y={cy + 6} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="monospace">
                      {lb}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-1 text-center font-mono text-[11px] text-zinc-400">
              {lang === "bn" ? "প্রবাহ/ধারণ · সবুজ পথ · লাল পূর্ণ" : "flow/cap · green path · red saturated"}
              {done && (lang === "bn" ? ` · কাট {${result.cutS.map((i) => p.labels[i]).join(", ")}}` : ` · cut {${result.cutS.map((i) => p.labels[i]).join(", ")}}`)}
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {FLOW_PRESETS.map((fp, i) => (
                <button
                  key={fp.name}
                  onClick={() => setPreset(i)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {fp.name}
                </button>
              ))}
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-mono text-[12px] font-bold text-white">
                  max flow {result.maxFlow}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={FLOW_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "প্রবাহ" : "flow", current.maxFlow],
          [lang === "bn" ? "পথ" : "paths", paths],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "বাড়ানো পথ" : "augment", "bg-emerald-500"],
          [lang === "bn" ? "পূর্ণ" : "saturated", "bg-rose-500"],
          [lang === "bn" ? "কাট" : "cut", "bg-sky-500"],
        ]}
      />
    </div>
  );
}
