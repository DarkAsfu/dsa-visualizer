'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, StageBar } from "./DpShared";
import { WORD_CODE, WORD_PRESETS, wordTrace } from "@/lib/backtracking";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

function clean(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
}

export default function WordSearchVisualizer() {
  const { lang, T } = useLang();
  const [preset, setPreset] = useState(0);
  const [word, setWord] = useState(WORD_PRESETS[0].word);
  const [input, setInput] = useState(WORD_PRESETS[0].word);
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const board = WORD_PRESETS[preset].board;
  const result = useMemo(() => wordTrace(board, word, lang), [board, word, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [preset, word, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const rows = result.rows;
  const cols = result.cols;

  function applyPreset(i: number) {
    setPreset(i);
    setWord(WORD_PRESETS[i].word);
    setInput(WORD_PRESETS[i].word);
    setError("");
  }

  function applyWord() {
    const c = clean(input);
    if (c.length < 2) {
      setError(lang === "bn" ? "কমপক্ষে ২টি A-Z অক্ষর দাও" : "Need at least 2 A–Z letters");
      return;
    }
    setError("");
    setInput(c);
    setWord(c);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="p-4">
            <div className="mx-auto grid max-w-[320px] gap-1.5 font-mono" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
              {board.join("").split("").map((ch, i) => {
                const k = current.path.indexOf(i);
                const onPath = k >= 0;
                const isHead = k === current.path.length - 1 && current.path.length > 0;
                return (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded-md border text-[18px] font-bold transition ${
                      isHead
                        ? "border-amber-400 bg-amber-400 text-zinc-950"
                        : onPath
                          ? "border-sky-500 bg-sky-500/20 text-sky-700 dark:text-sky-300"
                          : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {ch}
                    {onPath && <sub className="ml-0.5 text-[9px] font-normal opacity-70">{k + 1}</sub>}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-center font-mono text-[13px]">
              {lang === "bn" ? "শব্দ" : "word"}: <strong className="tracking-[0.2em]">{word}</strong>
              {done && (
                <span className={`ml-2 rounded-md px-2 py-0.5 text-[12px] font-bold text-white ${result.found ? "bg-emerald-500" : "bg-rose-500"}`}>
                  {result.answer}
                </span>
              )}
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {WORD_PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(i)}
                  className={`rounded-md border px-3 py-1 font-mono text-[12px] ${p.word === word && i === preset ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950" : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-800"}`}
                >
                  {p.name}
                </button>
              ))}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyWord()}
                maxLength={8}
                spellCheck={false}
                placeholder="WORD"
                className="w-28 rounded-md border border-zinc-200 bg-transparent px-2 py-1 font-mono text-[12px] uppercase outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                aria-label="word"
              />
              <button onClick={applyWord} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
            </div>
            {error && <p className="mb-2 font-mono text-[12px] text-rose-500">{error}</p>}
            <div className="font-mono text-[11px] text-zinc-400">
              {rows}×{cols} board · {lang === "bn" ? "visited সেট, ৪-দিক" : "visited set, 4-dir"}
            </div>
            <div className="mt-2">
              <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
            </div>
          </div>
        </div>
      </div>

      <CodeRail
        code={WORD_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "ফল" : "result", result.found ? "✓" : done ? "✗" : "…"],
          [lang === "bn" ? "দৈর্ঘ্য" : "len", word.length],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "মাথা" : "head", "bg-amber-400"],
          [lang === "bn" ? "পথ" : "path", "bg-sky-500"],
        ]}
      />
    </div>
  );
}
