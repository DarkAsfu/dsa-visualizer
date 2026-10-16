'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { SPARSE_ARR, SPARSE_CODE, SPARSE_Q, sparseTrace } from "@/lib/advanced";
import { useLang } from "@/lib/i18n";

export default function SparseVisualizer() {
  const { lang } = useLang();
  const [ql, setQl] = useState(SPARSE_Q[0]);
  const [qr, setQr] = useState(SPARSE_Q[1]);
  const [speed, setSpeed] = useState(3);
  const arr = SPARSE_ARR;
  const n = arr.length;
  const left = Math.min(ql, qr);
  const right = Math.max(ql, qr);
  const result = useMemo(() => sparseTrace(arr, left, right, lang), [arr, left, right, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [ql, qr, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const rowH = current.st.map((_, k) => `2^${k}`);
  const colH = arr.map((_, i) => String(i));

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="border-b border-zinc-100 px-4 pt-3 dark:border-zinc-900">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
              array [{left}..{right}]
            </div>
            <div className="flex flex-wrap gap-1 pb-3">
              {arr.map((v, i) => {
                const inQ = i >= left && i <= right;
                return (
                  <div key={i} className="flex w-[52px] flex-col items-center">
                    <div className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-[15px] font-bold tabular-nums ${inQ ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300" : "border-zinc-300 dark:border-zinc-700"}`}>
                      {v}
                    </div>
                    <span className="mt-1 font-mono text-[10px] tabular-nums text-zinc-400">{i}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <DpTable mat={current.st} cell={current.cell} refs={current.refs} path={current.qBlocks} rowH={rowH} colH={colH} corner="k＼i" />
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-4 font-mono text-[12px] text-zinc-500">
              <label className="flex items-center gap-2">
                l <strong className="tabular-nums text-zinc-900 dark:text-white">{ql}</strong>
                <input type="range" min={0} max={n - 1} step={1} value={ql} onChange={(e) => setQl(Number(e.target.value))} className="w-24 accent-zinc-950 dark:accent-white" aria-label="left" />
              </label>
              <label className="flex items-center gap-2">
                r <strong className="tabular-nums text-zinc-900 dark:text-white">{qr}</strong>
                <input type="range" min={0} max={n - 1} step={1} value={qr} onChange={(e) => setQr(Number(e.target.value))} className="w-24 accent-zinc-950 dark:accent-white" aria-label="right" />
              </label>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold tabular-nums text-white">
                  min = {result.answer}
                </span>
              )}
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={SPARSE_CODE}
        line={current.codeLine}
        stats={[
          ["min", done ? result.answer : "…"],
          [`[${left}..${right}]`, `len ${right - left + 1}`],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "পড়া" : "read", "bg-amber-400"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
          [lang === "bn" ? "কোয়েরি" : "query", "bg-sky-500/40"],
        ]}
      />
    </div>
  );
}
