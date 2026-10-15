'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { MONO_CODE, monoTrace } from "@/lib/stackQueue2";
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

export default function MonoVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(DEF.join(" "));
  const [applied, setApplied] = useState(DEF);

  const result = useMemo(() => monoTrace(applied, lang), [applied, lang]);
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
          <span className="ml-auto font-mono text-[11px] text-zinc-400">
            in: [{applied.join(", ")}]
          </span>
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
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">stack (top ↑)</div>
              <div className="flex min-h-40 flex-col-reverse items-stretch gap-1.5">
                {current.stack.length === 0 && (
                  <div className="rounded-md border border-dashed border-zinc-300 py-6 text-center font-mono text-[12px] text-zinc-400 dark:border-zinc-700">empty</div>
                )}
                {current.stack.map((v, i) => (
                  <div
                    key={i}
                    className={`rounded-md border px-3 py-1.5 text-center font-mono text-[14px] font-bold tabular-nums ${
                      i === current.stack.length - 1 && !done
                        ? "border-amber-400 bg-amber-400/15"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {v}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">popped (too big)</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {current.popped.length === 0 && <span className="font-mono text-[12px] text-zinc-300">—</span>}
                {current.popped.map((v, i) => (
                  <span key={i} className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[13px] font-bold tabular-nums text-rose-700 line-through dark:bg-rose-950 dark:text-rose-300">
                    {v}
                  </span>
                ))}
              </div>
              {current.i >= 0 && current.i < applied.length && (
                <div className="mt-4 rounded-md bg-amber-400/15 px-3 py-2 text-center font-mono text-[13px]">
                  incoming: <strong className="tabular-nums">{applied[current.i]}</strong>
                </div>
              )}
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
            {T(STR.outX.output)} · increasing stack
          </div>
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 font-mono text-[13px]">
            {result.stack.map((v, i) => (
              <span key={i} className="rounded bg-emerald-100 px-2 py-0.5 font-bold tabular-nums text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{v}</span>
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
            {MONO_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.stack.join(",") || "—"],
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
