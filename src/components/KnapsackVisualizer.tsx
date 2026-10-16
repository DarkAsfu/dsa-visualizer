'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { KNAP_CAP, KNAP_CODE, KNAP_ITEMS, knapsackTrace } from "@/lib/algorithms/dp";
import { useLang } from "@/lib/i18n";

export default function KnapsackVisualizer() {
  const { lang } = useLang();
  const [cap, setCap] = useState(KNAP_CAP);
  const [speed, setSpeed] = useState(3);
  const items = KNAP_ITEMS;
  const result = useMemo(() => knapsackTrace(items, cap, lang), [items, cap, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [cap, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const rowH = ["∅", ...items.map((it, i) => `#${i + 1} ${it.w}/${it.v}`)];
  const colH = Array.from({ length: cap + 1 }, (_, w) => String(w));

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} path={current.path} rowH={rowH} colH={colH} corner="i＼w" />
          <div className="flex flex-wrap gap-1.5 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            {items.map((it, i) => {
              const taken = done && result.taken.includes(i);
              return (
                <span key={i} className={`rounded-md border px-2.5 py-1 font-mono text-[12px] tabular-nums ${taken ? "border-emerald-500 bg-emerald-500 font-bold text-white" : "border-zinc-200 text-zinc-500 dark:border-zinc-800"}`}>
                  #{i + 1} w={it.w} v={it.v}{taken ? " ✓" : ""}
                </span>
              );
            })}
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              <span>{lang === "bn" ? "ধারণক্ষমতা" : "capacity"} = <strong className="tabular-nums text-zinc-900 dark:text-white">{cap}</strong></span>
              <input type="range" min={4} max={10} step={1} value={cap} onChange={(e) => setCap(Number(e.target.value))} className="w-32 accent-zinc-950 dark:accent-white" aria-label="capacity" />
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={KNAP_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "সেরা" : "best", result.maxVal],
          [lang === "bn" ? "নেওয়া" : "taken", result.taken.length === 0 ? "—" : result.taken.map((i) => `#${i + 1}`).join(" ")],
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
