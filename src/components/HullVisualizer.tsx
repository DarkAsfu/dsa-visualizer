'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { HULL_CODE, HULL_PRESETS, hullTrace, randomHullPoints } from "@/lib/advanced";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const W = 340;
const PAD = 28;
const MAXC = 10;

const X = (x: number) => PAD + (x / MAXC) * (W - PAD * 2);
const Y = (y: number) => W - PAD - (y / MAXC) * (W - PAD * 2);

export default function HullVisualizer() {
  const { lang, T } = useLang();
  const [preset, setPreset] = useState(0);
  const [pts, setPts] = useState(HULL_PRESETS[0]);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => hullTrace(pts, lang), [pts, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [pts, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const stackSet = new Set(current.stack);
  const hullPts = current.stack.map((i) => `${X(pts[i].x)},${Y(pts[i].y)}`).join(" ");

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label="points and hull">
              {current.stack.length >= 2 && (
                <polygon points={hullPts} fill="none" className="stroke-emerald-500" strokeWidth={2} strokeLinejoin="round" />
              )}
              {pts.map((p, i) => {
                const inStack = stackSet.has(i);
                const isCur = i === current.cur;
                const isPopped = current.popped.includes(i);
                return (
                  <g key={i}>
                    <circle
                      cx={X(p.x)} cy={Y(p.y)} r={isCur ? 8 : 6}
                      className={isCur ? "fill-amber-400" : isPopped ? "fill-rose-400" : inStack ? "fill-emerald-500" : "fill-zinc-400"}
                    />
                    <text x={X(p.x)} y={Y(p.y) - 11} textAnchor="middle" className="fill-zinc-500 font-mono" fontSize={10}>
                      P{i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-1 text-center font-mono text-[11px] text-zinc-400">
              stack [{current.stack.map((i) => `P${i + 1}`).join(" ") || "—"}]
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {HULL_PRESETS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPreset(i); setPts(HULL_PRESETS[i]); }}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  set {i + 1}
                </button>
              ))}
              <button onClick={() => { setPreset(-1); setPts(randomHullPoints()); }} className="rounded-md px-2.5 py-1 font-mono text-[12px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
                {T(STR.common.shuffle)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-mono text-[12px] font-bold text-white">
                  hull {result.answer}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={HULL_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "হাল" : "hull", result.hull.length],
          ["n", pts.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "দেখছি" : "current", "bg-amber-400"],
          [lang === "bn" ? "স্ট্যাক" : "stack", "bg-emerald-500"],
          [lang === "bn" ? "বাদ" : "popped", "bg-rose-400"],
        ]}
      />
    </div>
  );
}
