'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { INFIX_CODE, infixTrace, tokenize } from "@/lib/stackQueue2";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const DEF = "3+4*2/(1-5)^2";

export default function InfixVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(DEF);
  const [applied, setApplied] = useState(DEF);

  const result = useMemo(() => infixTrace(applied, lang), [applied, lang]);
  const steps = result.steps;
  const toks = useMemo(() => tokenize(applied), [applied]);
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder="3+4*2"
            className="w-48 font-mono rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 text-[13px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              setApplied(text || DEF);
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
          <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 px-4 py-2.5 font-mono text-[14px] dark:border-zinc-800">
            {toks.map((t, i) => (
              <span key={i} className={`rounded px-1.5 py-0.5 font-bold ${i === current.pos ? "bg-amber-400 text-zinc-950" : i < current.pos || (done && i <= current.pos) ? "text-zinc-400" : ""}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">output</div>
              <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-md border border-zinc-200 p-2 font-mono text-[13px] dark:border-zinc-800">
                {current.out.length === 0 && <span className="text-zinc-300">—</span>}
                {current.out.map((t, i) => (
                  <span key={i} className={`rounded px-1.5 py-0.5 font-bold ${i === current.out.length - 1 && current.hiOut ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">operator stack</div>
              <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-md border border-zinc-200 p-2 font-mono text-[13px] dark:border-zinc-800">
                {current.ops.length === 0 && <span className="text-zinc-300">—</span>}
                {current.ops.map((t, i) => (
                  <span key={i} className="rounded bg-violet-100 px-1.5 py-0.5 font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {done && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="text-emerald-700 dark:text-emerald-300">{result.postfix.join(" ")}</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-200">= {Number.isNaN(result.value) ? "÷0?" : result.value} ✓</span>
            </div>
          )}
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
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {INFIX_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), Number.isNaN(result.value) ? "—" : result.value],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[11px] leading-5 text-zinc-400">
          prec: ^ &gt; * / &gt; + −
        </p>
      </div>
    </div>
  );
}
