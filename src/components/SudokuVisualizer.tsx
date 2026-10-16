'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { SUDOKU_CODE, SUDOKU_PRESETS, sudokuTrace } from "@/lib/backtracking";
import { useLang } from "@/lib/i18n";

export default function SudokuVisualizer() {
  const { lang } = useLang();
  const [preset, setPreset] = useState(0);
  const [speed, setSpeed] = useState(3);
  const puzzle = SUDOKU_PRESETS[preset].puzzle;
  const result = useMemo(() => sudokuTrace(puzzle, lang), [puzzle, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [preset, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="mx-auto grid max-w-[380px] grid-cols-9 overflow-hidden rounded-md border-2 border-zinc-900 font-mono dark:border-zinc-100">
              {current.board.map((v, i) => {
                const r = Math.floor(i / 9);
                const c = i % 9;
                const given = result.givens[i];
                const isCur = i === current.cell;
                return (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center text-[13px] tabular-nums sm:text-[15px] ${
                      c % 3 === 2 && c !== 8 ? "border-r-2 border-r-zinc-900 dark:border-r-zinc-100" : "border-r border-r-zinc-200 dark:border-r-zinc-800"
                    } ${r % 3 === 2 && r !== 8 ? "border-b-2 border-b-zinc-900 dark:border-b-zinc-100" : "border-b border-b-zinc-200 dark:border-b-zinc-800"} ${
                      isCur
                        ? current.kind === "erase"
                          ? "bg-rose-500 font-bold text-white"
                          : "bg-emerald-500 font-bold text-white"
                        : given
                          ? "font-bold"
                          : v !== 0
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-zinc-300"
                    }`}
                  >
                    {v === 0 ? "·" : v}
                  </div>
                );
              })}
            </div>
            {result.truncated && (
              <p className="mt-2 text-center font-mono text-[11px] text-amber-600 dark:text-amber-400">
                {lang === "bn" ? "দীর্ঘ সমাধান — প্রথম ৫০০ ধাপ দেখানো" : "long solve — showing first 500 steps"}
              </p>
            )}
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {SUDOKU_PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPreset(i)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {p.name}
                </button>
              ))}
              {done && result.solved && (
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
        code={SUDOKU_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "অবস্থা" : "status", result.answer],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
          ["9×9", "MRV"],
        ]}
        legend={[
          [lang === "bn" ? "বসানো" : "placed", "bg-emerald-500"],
          [lang === "bn" ? "মোছা" : "erased", "bg-rose-500"],
        ]}
      />
    </div>
  );
}
