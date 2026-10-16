'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { FIB_CODE, fibTabTrace } from "@/lib/algorithms/dp";
import { useLang } from "@/lib/i18n";

export default function FibonacciVisualizer() {
  const { lang } = useLang();
  const [n, setN] = useState(8);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => fibTabTrace(n, lang), [n, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [n, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const cols = Array.from({ length: n + 1 }, (_, i) => String(i));
  const wNaive = 100;
  const wDp = Math.max(4, Math.round((Math.log10(result.ops + 1) / Math.log10(result.naive + 1)) * 100));

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} colH={cols} corner="dp" />
          <div className="space-y-2 border-t border-zinc-200 px-4 py-3 font-mono text-[12px] dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-rose-500">naive · {result.naive}</span>
              <div className="h-3 rounded bg-rose-400" style={{ width: `${wNaive}%` }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-emerald-600 dark:text-emerald-400">dp · {result.ops}</span>
              <div className="h-3 rounded bg-emerald-500" style={{ width: `${wDp}%` }} />
            </div>
            <p className="text-[11px] text-zinc-400">
              {lang === "bn" ? "বার-দৈর্ঘ্য log স্কেলে — naive সূচকীয়, DP রৈখিক" : "bar lengths log-scaled — naive is exponential, DP is linear"}
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              <span>n = <strong className="tabular-nums text-zinc-900 dark:text-white">{n}</strong></span>
              <input type="range" min={2} max={15} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-32 accent-zinc-950 dark:accent-white" aria-label="n" />
              <span className="tabular-nums">fib({n}) = {result.answer}</span>
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={FIB_CODE}
        line={current.codeLine}
        stats={[
          [`fib(${n})`, result.answer],
          [lang === "bn" ? "যোগ" : "adds", result.ops],
          ["naive", result.naive],
        ]}
        legend={[
          [lang === "bn" ? "পড়া" : "read", "bg-amber-400"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
