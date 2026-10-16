'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { EDIT_A, EDIT_B, EDIT_CODE, editTrace } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function clean(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "").slice(0, 7);
}

export default function EditDistanceVisualizer() {
  const { lang, T } = useLang();
  const [a, setA] = useState(EDIT_A);
  const [b, setB] = useState(EDIT_B);
  const [inA, setInA] = useState(EDIT_A);
  const [inB, setInB] = useState(EDIT_B);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => editTrace(a, b, lang), [a, b, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [a, b, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const rowH = ["∅", ...a.split("")];
  const colH = ["∅", ...b.split("")];

  function apply() {
    const ca = clean(inA);
    const cb = clean(inB);
    if (ca.length < 1 || cb.length < 1) {
      setError(lang === "bn" ? "দুটোতেই ১–৭টি a-z অক্ষর দাও" : "Both need 1–7 a–z letters");
      return;
    }
    setError("");
    setInA(ca);
    setInB(cb);
    setA(ca);
    setB(cb);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} path={current.path} rowH={rowH} colH={colH} corner="∅" />
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              <input value={inA} onChange={(e) => setInA(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} maxLength={7} className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="word A" />
              <span className="text-zinc-400">→</span>
              <input value={inB} onChange={(e) => setInB(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} maxLength={7} className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="word B" />
              <button onClick={apply} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold text-white">
                  {lang === "bn" ? "দূরত্ব" : "distance"} {result.dist}
                </span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={EDIT_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "দূরত্ব" : "dist", result.dist],
          [lang === "bn" ? "অপ" : "ops", result.script.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
          ["del/ins/sub", "bg-amber-400"],
          [lang === "bn" ? "পথ" : "path", "bg-sky-500/40"],
        ]}
      />
    </div>
  );
}
