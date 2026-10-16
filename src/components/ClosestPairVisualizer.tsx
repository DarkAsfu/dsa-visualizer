'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { CP_CODE, CP_PRESETS, closestPairTrace, randomPoints, type Pt } from "@/lib/algorithms/divide";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const W = 340;
const PAD = 26;
const MAXC = 30;

const X = (x: number) => PAD + (x / MAXC) * (W - PAD * 2);
const Y = (y: number) => W - PAD - (y / MAXC) * (W - PAD * 2);

export default function ClosestPairVisualizer() {
  const { lang, T } = useLang();
  const [preset, setPreset] = useState(0);
  const [pts, setPts] = useState<Pt[]>(CP_PRESETS[0].pts);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => closestPairTrace(pts, lang), [pts, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [pts, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];

  function pickPreset(i: number) {
    setPreset(i);
    setPts(CP_PRESETS[i].pts);
  }

  function shuffle() {
    setPreset(-1);
    setPts(randomPoints(8));
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <svg viewBox={`0 0 ${W} ${W}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label="points">
              {current.midX !== null && current.delta !== Infinity && (
                <rect
                  x={X(current.midX - current.delta)}
                  width={X(current.midX + current.delta) - X(current.midX - current.delta)}
                  y={PAD / 2}
                  height={W - PAD}
                  className="fill-amber-400/15"
                />
              )}
              {current.midX !== null && (
                <line x1={X(current.midX)} y1={PAD / 2} x2={X(current.midX)} y2={W - PAD / 2} strokeDasharray="5 4" className="stroke-sky-500" strokeWidth={1.5} />
              )}
              {current.pair && (
                <line
                  x1={X(pts[current.pair[0]].x)} y1={Y(pts[current.pair[0]].y)}
                  x2={X(pts[current.pair[1]].x)} y2={Y(pts[current.pair[1]].y)}
                  className="stroke-emerald-500" strokeWidth={2.5}
                />
              )}
              {pts.map((p, i) => {
                const isHl = current.hl.includes(i);
                const isPair = current.pair?.includes(i) ?? false;
                const dim = current.strip.some(Boolean) && !current.strip[i] && !isPair;
                return (
                  <g key={i}>
                    <circle
                      cx={X(p.x)} cy={Y(p.y)} r={isPair || isHl ? 8 : 6}
                      className={isPair ? "fill-emerald-500" : isHl ? "fill-amber-400" : dim ? "fill-zinc-300 dark:fill-zinc-700" : "fill-zinc-500"}
                    />
                    <text x={X(p.x)} y={Y(p.y) - 11} textAnchor="middle" className="fill-zinc-500 font-mono" fontSize={10}>
                      P{i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-1 text-center font-mono text-[11px] text-zinc-400">
              δ = {current.delta === Infinity ? "—" : current.delta.toFixed(2)}
              {current.midX !== null ? ` · mid x=${current.midX.toFixed(1)}` : ""}
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {CP_PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => pickPreset(i)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {p.name}
                </button>
              ))}
              <button onClick={shuffle} className="rounded-md px-2.5 py-1 font-mono text-[12px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
                {T(STR.common.shuffle)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-mono text-[12px] font-bold text-white">
                  {result.answer}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={CP_CODE}
        line={current.codeLine}
        stats={[
          ["δ", result.answer.split("=")[1]?.trim() ?? "—"],
          ["n", pts.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "দেখছি" : "checked", "bg-amber-400"],
          [lang === "bn" ? "সেরা" : "best", "bg-emerald-500"],
          ["strip", "bg-amber-400/40"],
        ]}
      />
    </div>
  );
}
