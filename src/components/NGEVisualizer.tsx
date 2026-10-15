'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { NGE_CODE, ngeTrace } from "@/lib/stackQueue2";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const DEF = [5, 3, 8, 2, 7, 4];

function parseNums(s: string): number[] {
  const out: number[] = [];
  for (const t of s.split(/[^0-9-]+/)) {
    if (t === "" || t === "-") continue;
    const v = Number(t);
    if (Number.isInteger(v) && v >= 0 && v <= 99) out.push(v);
  }
  return out.slice(0, 10);
}

export default function NGEVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(DEF.join(" "));
  const [applied, setApplied] = useState(DEF);

  const result = useMemo(() => ngeTrace(applied, lang), [applied, lang]);
  const steps = result.steps;
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
            placeholder="values"
            className="w-48 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button
            onClick={() => {
              const v = parseNums(text);
              setApplied(v.length > 0 ? v : DEF);
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
          <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_150px]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-[13px]">
                <tbody>
                  <tr>
                    <th className="w-12 py-1 pr-2 text-right text-[11px] font-normal uppercase tracking-wider text-zinc-400">a</th>
                    {applied.map((v, i) => (
                      <td key={i} className={`w-12 border border-zinc-200 py-2 text-center font-bold tabular-nums dark:border-zinc-800 ${i === current.i && !done ? "bg-amber-400/25" : ""}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="w-12 py-1 pr-2 text-right text-[11px] font-normal uppercase tracking-wider text-zinc-400">nge</th>
                    {applied.map((_, i) => {
                      const a = current.ans[i];
                      return (
                        <td key={i} className={`w-12 border border-zinc-200 py-2 text-center font-bold tabular-nums dark:border-zinc-800 ${a === null || a === undefined ? "text-zinc-300" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"}`}>
                          {a === null || a === undefined ? "?" : a}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 font-mono text-[11px] text-zinc-400">scanning right → left · i={current.i}</p>
            </div>
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">stack</div>
              <div className="flex min-h-32 flex-col-reverse items-stretch gap-1">
                {current.stack.length === 0 && (
                  <div className="rounded-md border border-dashed border-zinc-300 py-4 text-center font-mono text-[12px] text-zinc-400 dark:border-zinc-700">empty</div>
                )}
                {current.stack.map((v, i) => (
                  <div key={i} className="rounded-md border border-zinc-200 px-2 py-1 text-center font-mono text-[13px] font-bold tabular-nums dark:border-zinc-800">
                    {v}
                  </div>
                ))}
              </div>
            </div>
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
            {T(STR.outX.output)} · NGE
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            [{result.ans.map((v, i) => (
              <span key={i}>
                {i > 0 && <span className="text-zinc-300">, </span>}
                <span className="font-bold tabular-nums">{v}</span>
              </span>
            ))}]
          </div>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {NGE_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.steps), steps.length],
            ["O(n)", "each pushed once"],
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
