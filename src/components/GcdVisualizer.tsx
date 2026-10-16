'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { GCD_CODE, gcdTrace } from "@/lib/math";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function GcdVisualizer() {
  const { lang, T } = useLang();
  const [a, setA] = useState(48);
  const [b, setB] = useState(18);
  const [inA, setInA] = useState("48");
  const [inB, setInB] = useState("18");
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => gcdTrace(a, b, lang), [a, b, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [a, b, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];

  function apply() {
    const x = Number(inA);
    const y = Number(inB);
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x > 999 || y > 999 || (x === 0 && y === 0)) {
      setError(lang === "bn" ? "দুটোই ০–৯৯৯ পূর্ণসংখ্যা (দুটো ০ নয়)" : "Both 0–999 integers (not both 0)");
      return;
    }
    setError("");
    setA(x);
    setB(y);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
              <div className="rounded-lg border border-zinc-200 px-5 py-3 text-center dark:border-zinc-800">
                <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">a</div>
                <div className="text-[26px] font-bold tabular-nums">{current.a}</div>
              </div>
              <span className="text-xl text-zinc-300">mod</span>
              <div className="rounded-lg border border-zinc-200 px-5 py-3 text-center dark:border-zinc-800">
                <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">b</div>
                <div className="text-[26px] font-bold tabular-nums">{current.b}</div>
              </div>
              <span className="text-xl text-zinc-300">=</span>
              <div className={`rounded-lg border px-5 py-3 text-center ${current.r === 0 ? "border-emerald-500 bg-emerald-500 text-white" : "border-amber-400"}`}>
                <div className="text-[11px] uppercase tracking-[0.12em] opacity-70">r</div>
                <div className="text-[26px] font-bold tabular-nums">{current.r === null ? "—" : current.r}</div>
              </div>
            </div>
            <div className="nice-scroll mt-3 max-h-32 space-y-1 overflow-y-auto font-mono text-[12px]">
              {steps.slice(0, stepIndex + 1).map((s, i) => (
                <div key={i} className={`rounded px-2 py-1 ${i === stepIndex ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}>
                  <span className="mr-2 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  {s.desc}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              <input value={inA} onChange={(e) => setInA(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} inputMode="numeric" className="w-20 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="a" />
              <input value={inB} onChange={(e) => setInB(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} inputMode="numeric" className="w-20 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="b" />
              <button onClick={apply} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold tabular-nums text-white">
                  gcd {result.gcd} · lcm {result.lcm}
                </span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={GCD_CODE}
        line={current.codeLine}
        stats={[
          ["gcd", result.gcd],
          ["lcm", result.lcm],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "ভাগশেষ" : "remainder", "bg-amber-400"],
          [lang === "bn" ? "উত্তর" : "answer", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
