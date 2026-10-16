'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { GRID_C, GRID_CODE, GRID_R, gridTrace } from "@/lib/algorithms/dp";
import { useLang } from "@/lib/i18n";

export default function GridPathsVisualizer() {
  const { lang } = useLang();
  const [rows, setRows] = useState(GRID_R);
  const [cols, setCols] = useState(GRID_C);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => gridTrace(rows, cols, lang), [rows, cols, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [rows, cols, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} />
          <p className="px-4 pb-1 font-mono text-[11px] text-zinc-400">
            {lang === "bn" ? "শুধু ডান / নিচ চলা যায় — প্রতিটা ঘর = উপর + বাম" : "move only right / down — each cell = top + left"}
          </p>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-4 font-mono text-[12px] text-zinc-500">
              <label className="flex items-center gap-2">
                {lang === "bn" ? "সারি" : "rows"} <strong className="tabular-nums text-zinc-900 dark:text-white">{rows}</strong>
                <input type="range" min={1} max={6} step={1} value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-24 accent-zinc-950 dark:accent-white" aria-label="rows" />
              </label>
              <label className="flex items-center gap-2">
                {lang === "bn" ? "কলাম" : "cols"} <strong className="tabular-nums text-zinc-900 dark:text-white">{cols}</strong>
                <input type="range" min={1} max={6} step={1} value={cols} onChange={(e) => setCols(Number(e.target.value))} className="w-24 accent-zinc-950 dark:accent-white" aria-label="cols" />
              </label>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold text-white">
                  {lang === "bn" ? "মোট পথ" : "paths"} {result.count}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={GRID_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "পথ" : "paths", result.count],
          [lang === "bn" ? "গ্রিড" : "grid", `${rows}×${cols}`],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "পড়া" : "read", "bg-amber-400"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
