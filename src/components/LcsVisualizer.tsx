'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { LCS_A, LCS_B, LCS_CODE, lcsTrace } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function clean(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
}

export default function LcsVisualizer() {
  const { lang, T } = useLang();
  const [a, setA] = useState(LCS_A);
  const [b, setB] = useState(LCS_B);
  const [inA, setInA] = useState(LCS_A);
  const [inB, setInB] = useState(LCS_B);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => lcsTrace(a, b, lang), [a, b, lang]);
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
    if (ca.length < 1 || cb.length < 1 || ca.length > 8 || cb.length > 8) {
      setError(lang === "bn" ? "দুটোতেই ১–৮টি A-Z অক্ষর দাও" : "Both need 1–8 A–Z letters");
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
              <input value={inA} onChange={(e) => setInA(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} maxLength={8} className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1 uppercase outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="string A" />
              <span className="text-zinc-400">vs</span>
              <input value={inB} onChange={(e) => setInB(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} maxLength={8} className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1 uppercase outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600" aria-label="string B" />
              <button
                onClick={apply}
                className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950"
              >
                {T(STR.common.set)}
              </button>
              {done && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold text-white">
                  LCS “{result.lcs || "—"}” · {result.length}
                </span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={LCS_CODE}
        line={current.codeLine}
        stats={[
          ["LCS", result.lcs || "—"],
          [lang === "bn" ? "দৈর্ঘ্য" : "length", result.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "মিল" : "match", "bg-emerald-500"],
          [lang === "bn" ? "পড়া" : "read", "bg-amber-400"],
          [lang === "bn" ? "পথ" : "path", "bg-sky-500/40"],
        ]}
      />
    </div>
  );
}
