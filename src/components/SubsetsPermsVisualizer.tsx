'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { SUBSETSP_CODE, permsTrace, subsetsTrace } from "@/lib/backtracking";
import { useLang } from "@/lib/i18n";

export default function SubsetsPermsVisualizer() {
  const { lang } = useLang();
  const [mode, setMode] = useState<"sub" | "perm">("sub");
  const [n, setN] = useState(3);
  const [speed, setSpeed] = useState(3);
  const nums = useMemo(() => Array.from({ length: n }, (_, i) => i + 1), [n]);
  const result = useMemo(
    () => (mode === "sub" ? subsetsTrace(nums, lang) : permsTrace(nums, lang)),
    [mode, nums, lang]
  );
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [mode, n, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const total = mode === "sub" ? 2 ** n : [0, 1, 2, 6, 24][n];

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
              {lang === "bn" ? "বর্তমান" : "current"} (depth {current.depth})
            </div>
            <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 font-mono dark:border-amber-900/50 dark:bg-amber-950/30">
              {current.cur.length === 0 ? (
                <span className="text-zinc-400">∅</span>
              ) : (
                current.cur.map((v, i) => (
                  <span key={i} className="rounded-md bg-amber-400 px-2.5 py-1 text-[14px] font-bold tabular-nums text-zinc-950">
                    {v}
                  </span>
                ))
              )}
            </div>
            <div className="mb-1 mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {lang === "bn" ? "সংগৃহীত" : "collected"} · {current.collected.length}/{total}
            </div>
            <div className="nice-scroll flex max-h-44 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-zinc-200 p-2.5 font-mono text-[12px] dark:border-zinc-800">
              {current.collected.length === 0 && <span className="text-zinc-400">…</span>}
              {current.collected.map((s, i) => (
                <span key={i} className="rounded border border-emerald-500/50 bg-emerald-500/10 px-1.5 py-0.5 tabular-nums text-emerald-700 dark:text-emerald-300">
                  [{s.join(", ") || "∅"}]
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {(["sub", "perm"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${m === mode ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {m === "sub" ? (lang === "bn" ? "সাবসেট" : "subsets") : (lang === "bn" ? "বিন্যাস" : "perms")}
                </button>
              ))}
              <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
                n = <strong className="tabular-nums text-zinc-900 dark:text-white">{n}</strong>
                <input type="range" min={2} max={4} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" aria-label="n" />
              </label>
            </div>
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={SUBSETSP_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "পাওয়া" : "found", `${current.collected.length}/${total}`],
          ["n", n],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "বর্তমান" : "current", "bg-amber-400"],
          [lang === "bn" ? "সম্পূর্ণ" : "complete", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
