'use client';

import { useMemo, useState } from "react";
import { TrieSVG } from "./TreeSVG";
import { Transport, usePlayer } from "./usePlayer";
import { TRIE_CODE, TRIE_DEFAULT, trieTrace } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Op = "insert" | "search";

function parseWords(s: string): string[] {
  const out: string[] = [];
  for (const w of s.toLowerCase().split(/[^a-z]+/)) {
    const t = w.slice(0, 8);
    if (t && !out.includes(t)) out.push(t);
  }
  return out.slice(0, 8);
}

export default function TrieVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(TRIE_DEFAULT.join(" "));
  const [word, setWord] = useState("care");
  const [op, setOp] = useState<Op>("search");
  const [applied, setApplied] = useState({ words: TRIE_DEFAULT, word: "care", op: "search" as Op });

  const result = useMemo(
    () => trieTrace(applied.words, applied.op, applied.word, lang),
    [applied, lang]
  );
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const finalWords = useMemo(() => {
    const set = new Set(applied.words);
    if (applied.op === "insert" && result.ok) set.add(applied.word.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8));
    return [...set];
  }, [applied, result.ok]);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["search", "insert"] as Op[]).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                op === o
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {o === "search" ? T(STR.treeX.searchW) : T(STR.treeX.insertW)}
            </button>
          ))}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.words)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.word)}
            aria-label={T(STR.treeX.word)}
            className="w-28 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              setApplied({ words: parseWords(text), word, op });
              reset();
            }}
            className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] text-white dark:bg-white dark:text-zinc-950"
          >
            {T(STR.common.run)}
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.desc}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{steps.length}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-1 border-b border-zinc-200 px-4 py-2.5 font-mono text-[15px] font-bold dark:border-zinc-800">
            {applied.word.split("").map((ch, i) => (
              <span key={i} className={`rounded px-1.5 py-0.5 ${i < current.matched.length ? "bg-amber-400 text-zinc-950" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"}`}>
                {ch}
              </span>
            ))}
            {done && (
              <span className={`ml-2 text-[13px] ${result.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                {result.ok ? "✓" : "✗"}
              </span>
            )}
          </div>
          <div className="overflow-x-auto p-2">
            <TrieSVG nodes={current.nodes} edges={current.edges} current={current.current} />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <Transport
              playing={playing}
              done={done}
              onPlay={() => {
                if (done) {
                  reset();
                  setPlaying(true);
                } else {
                  setPlaying((p) => !p);
                }
              }}
              onBack={stepBack}
              onFwd={stepFwd}
              onReset={reset}
              speed={speed}
              onSpeed={setSpeed}
            />
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.outX.output)} · {T(STR.treeX.words)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {finalWords.map((w) => (
              <span key={w} className={`rounded px-2 py-0.5 font-bold ${done && w === applied.word.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8) && result.ok ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {TRIE_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.ok ? "✓" : "✗"],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
