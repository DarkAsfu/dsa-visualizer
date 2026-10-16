'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { RAT_CODE, RAT_PRESETS, ratTrace } from "@/lib/backtracking";
import { useLang } from "@/lib/i18n";

export default function RatMazeVisualizer() {
  const { lang } = useLang();
  const [preset, setPreset] = useState(0);
  const [speed, setSpeed] = useState(3);
  const grid = RAT_PRESETS[preset].grid;
  const result = useMemo(() => ratTrace(grid, lang), [grid, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [preset, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const { rows, cols } = result;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="mx-auto grid max-w-[360px] gap-1 font-mono" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
              {Array.from({ length: rows * cols }, (_, i) => {
                const r = Math.floor(i / cols);
                const c = i % cols;
                const wall = result.walls[i];
                const seen = current.visited[i];
                const isCur = current.r === r && current.c === c;
                const isStart = r === 0 && c === 0;
                const isEnd = r === rows - 1 && c === cols - 1;
                return (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded text-[13px] font-bold ${
                      wall
                        ? "bg-zinc-900 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-100"
                        : isCur
                          ? "bg-amber-400 text-zinc-950"
                          : seen
                            ? "bg-sky-500/25 text-sky-700 dark:text-sky-300"
                            : "bg-zinc-100 dark:bg-zinc-900"
                    }`}
                  >
                    {isStart ? "S" : isEnd ? "E" : ""}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-center font-mono text-[11px] text-zinc-400">
              {lang === "bn" ? "S শুরু · E গন্তব্য · কালো দেয়াল" : "S start · E goal · black walls"}
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {RAT_PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPreset(i)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {p.name} · {p.grid.length}×{p.grid[0].length}
                </button>
              ))}
              {done && (
                <span className={`rounded-md px-2.5 py-1 font-mono text-[12px] font-bold text-white ${result.paths > 0 ? "bg-emerald-500" : "bg-rose-500"}`}>
                  {lang === "bn" ? "পথ" : "paths"} {result.paths}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={RAT_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "পথ" : "paths", current.pathCount],
          [`${rows}×${cols}`, "DFS"],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "বর্তমান" : "current", "bg-amber-400"],
          [lang === "bn" ? "দেখা" : "visited", "bg-sky-500/40"],
        ]}
      />
    </div>
  );
}
