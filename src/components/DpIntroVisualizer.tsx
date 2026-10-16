'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { DP_INTRO_CODE, dpIntroTrace } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function DpIntroVisualizer() {
  const { lang, T } = useLang();
  const [n, setN] = useState(7);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => dpIntroTrace(n, lang), [n, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [n, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const cols = Array.from({ length: n + 1 }, (_, i) => String(i));
  const log = steps.slice(0, stepIndex + 1);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} colH={cols} corner="memo" />
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {lang === "bn" ? "কল লগ" : "call log"}
            </div>
            <ol className="nice-scroll max-h-44 space-y-1 overflow-y-auto font-mono text-[12px]">
              {log.map((s, i) => (
                <li key={i} className={`rounded px-2 py-1 ${i === stepIndex ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}>
                  <span className="mr-2 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  {s.desc}
                </li>
              ))}
            </ol>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              <span>n = <strong className="tabular-nums text-zinc-900 dark:text-white">{n}</strong></span>
              <input type="range" min={3} max={12} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-32 accent-zinc-950 dark:accent-white" aria-label="n" />
              <span className="tabular-nums">fib({n}) = {result.answer}</span>
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={DP_INTRO_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "কল" : "calls", result.calls],
          [lang === "bn" ? "হিট" : "hits", result.hits],
          ["naive", result.naive],
        ]}
        legend={[
          [T(STR.common.lgChecking), "bg-amber-400"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
