'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { PASCAL_CODE, pascalTrace } from "@/lib/math";
import { useLang } from "@/lib/i18n";

export default function PascalVisualizer() {
  const { lang } = useLang();
  const [n, setN] = useState(7);
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => pascalTrace(n, lang), [n, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [n, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const inRefs = (r: number, c: number) => current.refs.some(([rr, cc]) => rr === r && cc === c);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="space-y-1 overflow-x-auto p-4">
            {current.rows.map((row, r) => (
              <div key={r} className="flex justify-center gap-1">
                {row.map((v, c) => {
                  const isCell = current.cell?.[0] === r && current.cell?.[1] === c;
                  const isRef = !isCell && inRefs(r, c);
                  return (
                    <div
                      key={c}
                      className={`flex min-w-9 items-center justify-center rounded-md border px-1.5 py-1.5 font-mono text-[13px] font-bold tabular-nums transition ${
                        isCell
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isRef
                            ? "border-amber-400 bg-amber-100 dark:bg-amber-950/60"
                            : "border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      {v}
                    </div>
                  );
                })}
              </div>
            ))}
            {current.rows.length === 0 && <p className="text-center font-mono text-[12px] text-zinc-400">…</p>}
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              <span>{lang === "bn" ? "সারি" : "rows"} = <strong className="tabular-nums text-zinc-900 dark:text-white">{n}</strong></span>
              <input type="range" min={1} max={9} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-32 accent-zinc-950 dark:accent-white" aria-label="rows" />
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={PASCAL_CODE}
        line={current.codeLine}
        stats={[
          [`C(${n - 1},·)`, done ? result.answer.split(" ").slice(0, 3).join(" ") + "…" : "…"],
          [lang === "bn" ? "সারি" : "rows", n],
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
