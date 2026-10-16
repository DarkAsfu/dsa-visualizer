'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { LIS_ARR, LIS_CODE, lisTrace, randomLisArray } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function LisVisualizer() {
  const { lang, T } = useLang();
  const [array, setArray] = useState<number[]>(LIS_ARR);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => lisTrace(array, lang), [array, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [array, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const cols = array.map((_, i) => String(i));

  function handleCustom() {
    const nums = customInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    if (nums.length < 3 || nums.length > 10 || nums.some((x) => !Number.isInteger(x) || x < 1 || x > 30)) {
      setError(lang === "bn" ? "৩–১০টি পূর্ণসংখ্যা, প্রতিটি ১–৩০" : "3–10 integers, each 1–30");
      return;
    }
    setError("");
    setArray(nums);
  }

  function shuffle() {
    setPlaying(false);
    setStepIndex(0);
    setArray(randomLisArray(array.length));
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="border-b border-zinc-100 px-4 pt-3 dark:border-zinc-900">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
              {lang === "bn" ? "অ্যারে" : "array"}
            </div>
            <div className="flex flex-wrap gap-1.5 pb-3">
              {array.map((v, i) => {
                const focus = current.cell?.[1] === i;
                const ref = current.refs?.some(([, c]) => c === i) ?? false;
                return (
                  <div key={i} className="flex w-[52px] flex-col items-center">
                    <div className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums transition ${focus ? "border-amber-400 bg-amber-400 text-zinc-950" : ref ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300" : "border-zinc-300 dark:border-zinc-700"}`}>
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">{i}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} colH={cols} corner="dp" />
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2">
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustom()}
                placeholder="3, 1, 4, 1, 5, 9, 2, 6"
                className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
              <button onClick={handleCustom} className="shrink-0 rounded-md border border-zinc-950 px-3 py-1.5 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              <button onClick={shuffle} className="shrink-0 rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
                {T(STR.common.shuffle)}
              </button>
            </div>
            {error && <p className="mb-2 font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={LIS_CODE}
        line={current.codeLine}
        stats={[
          ["LIS", result.length],
          ["n", array.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "দেখছি" : "current", "bg-amber-400"],
          [lang === "bn" ? "সেরা j" : "best j", "bg-sky-500"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
