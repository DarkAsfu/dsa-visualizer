'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { HUFF_CODE, HUFF_TEXT, huffmanTrace } from "@/lib/algorithms/greedy";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function clean(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 12);
}

export default function HuffmanVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(HUFF_TEXT);
  const [input, setInput] = useState(HUFF_TEXT);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => huffmanTrace(text, lang), [text, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [text, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const maxF = Math.max(...current.forest.map((f) => f.freq), 1);

  function apply() {
    const c = clean(input);
    if (c.length < 2 || new Set(c).size < 2) {
      setError(lang === "bn" ? "কমপক্ষে ২টি আলাদা A-Z অক্ষর দাও" : "Need at least 2 distinct A–Z letters");
      return;
    }
    setError("");
    setInput(c);
    setText(c);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {lang === "bn" ? "ফরেস্ট (min-heap)" : "forest (min-heap)"}
            </div>
            <div className="flex flex-wrap items-end gap-2">
              {current.forest.map((f) => {
                const isNew = f.id === current.newId;
                const isMerged = current.merged?.includes(f.id) ?? false;
                const h = 28 + Math.round((f.freq / maxF) * 64);
                return (
                  <div key={f.id} className="flex w-14 flex-col items-center">
                    <div
                      className={`flex w-full items-center justify-center rounded-md border font-mono text-[13px] font-bold tabular-nums transition ${
                        isNew
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : isMerged
                            ? "border-amber-400 bg-amber-400 text-zinc-950"
                            : "border-zinc-300 dark:border-zinc-700"
                      }`}
                      style={{ height: `${h}px` }}
                      title={`${f.label} × ${f.freq}`}
                    >
                      {f.freq}
                    </div>
                    <span className="mt-1 font-mono text-[11px] text-zinc-500">{f.label}</span>
                  </div>
                );
              })}
            </div>
            {done && (
              <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full font-mono text-[13px]">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-[11px] uppercase tracking-[0.1em] text-zinc-400 dark:border-zinc-800">
                      <th className="px-3 py-1.5 font-medium">{lang === "bn" ? "অক্ষর" : "char"}</th>
                      <th className="px-3 py-1.5 font-medium">×</th>
                      <th className="px-3 py-1.5 font-medium">code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                    {result.codes.map((r) => (
                      <tr key={r.ch}>
                        <td className="px-3 py-1.5 font-bold">{r.ch}</td>
                        <td className="px-3 py-1.5 tabular-nums text-zinc-500">{r.freq}</td>
                        <td className="px-3 py-1.5 font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{r.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="break-all border-t border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-[12px] tabular-nums dark:border-zinc-800 dark:bg-zinc-900">
                  {result.encoded}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                maxLength={12}
                spellCheck={false}
                placeholder={HUFF_TEXT}
                className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] uppercase outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
              <button onClick={apply} className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] font-semibold text-white dark:bg-white dark:text-zinc-950">
                {T(STR.common.run)}
              </button>
            </div>
            {error && <p className="mb-2 font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={HUFF_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "গড়" : "avg", result.answer],
          ["−8bit", `${result.savedPct}%`],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "জোড়া" : "merged", "bg-amber-400"],
          [lang === "bn" ? "নতুন" : "new", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
