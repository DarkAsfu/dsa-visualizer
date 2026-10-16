'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { SUBSET_CODE, SUBSET_NUMS, SUBSET_TARGET, subsetTrace } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function SubsetSumVisualizer() {
  const { lang, T } = useLang();
  const [nums, setNums] = useState<number[]>(SUBSET_NUMS);
  const [target, setTarget] = useState(SUBSET_TARGET);
  const [numInput, setNumInput] = useState(SUBSET_NUMS.join(", "));
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => subsetTrace(nums, target, lang), [nums, target, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [nums, target, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const rowH = ["∅", ...nums.map(String)];
  const colH = Array.from({ length: target + 1 }, (_, s) => String(s));

  function handleNums() {
    const list = numInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number);
    if (list.length < 2 || list.length > 5 || list.some((x) => !Number.isInteger(x) || x < 1 || x > 9)) {
      setError(lang === "bn" ? "২–৫টি পূর্ণসংখ্যা, প্রতিটি ১–৯" : "2–5 integers, each 1–9");
      return;
    }
    setError("");
    setNums(list);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} path={current.path} rowH={rowH} colH={colH} corner="n＼s" fmt={(v) => (v === null ? "·" : v ? "T" : "–")} />
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              <input
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNums()}
                placeholder="3, 2, 7, 1"
                className="w-36 rounded-md border border-zinc-200 bg-transparent px-2 py-1 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                aria-label="numbers"
              />
              <button onClick={handleNums} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              <span className="text-zinc-500">
                {lang === "bn" ? "টার্গেট" : "target"} = <strong className="tabular-nums text-zinc-900 dark:text-white">{target}</strong>
              </span>
              <input type="range" min={1} max={12} step={1} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-28 accent-zinc-950 dark:accent-white" aria-label="target" />
              {done && (
                <span className={`rounded-md px-2.5 py-1 font-bold text-white ${result.possible ? "bg-emerald-500" : "bg-rose-500"}`}>
                  {result.answer}{result.possible ? ` · ${result.example.join(" + ")}` : ""}
                </span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={SUBSET_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "সম্ভব?" : "possible", result.possible ? "✓" : "✗"],
          [lang === "bn" ? "টার্গেট" : "target", target],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "পড়া" : "read", "bg-amber-400"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
          [lang === "bn" ? "পথ" : "path", "bg-sky-500/40"],
        ]}
      />
    </div>
  );
}
