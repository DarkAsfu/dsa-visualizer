'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { FENWICK_CODE, FENWICK_DEFAULT, fenwickTrace, parseVals } from "@/lib/tree";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Op = "update" | "query";

export default function FenwickVisualizer() {
  const { lang, T } = useLang();
  const [text, setText] = useState(FENWICK_DEFAULT.join(" "));
  const [idx, setIdx] = useState(2);
  const [delta, setDelta] = useState(3);
  const [op, setOp] = useState<Op>("query");
  const [applied, setApplied] = useState({ values: FENWICK_DEFAULT, idx: 2, delta: 3, op: "query" as Op });

  const result = useMemo(
    () => fenwickTrace(applied.values, applied.op, Math.min(applied.idx, applied.values.length - 1), applied.delta, lang),
    [applied, lang]
  );
  const steps = result.steps;
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const touchedSet = useMemo(() => new Set(current.touched), [current]);
  const n = applied.values.length;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["query", "update"] as Op[]).map((o) => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                op === o
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {o === "query" ? T(STR.treeX.queryW) : T(STR.common.set)}
            </button>
          ))}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            placeholder={T(STR.treeX.values)}
            className="w-44 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <input
            type="number"
            value={idx}
            min={0}
            max={11}
            onChange={(e) => setIdx(Number(e.target.value))}
            aria-label="index"
            className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          {op === "update" && (
            <input
              type="number"
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              aria-label="delta"
              className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
            />
          )}
          <button
            onClick={() => {
              const v = parseVals(text);
              setApplied({ values: v.length > 0 ? v : [1], idx, delta, op });
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
          <div className="space-y-3 p-4">
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">a</div>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[13px]">
                {applied.values.map((v, i) => (
                  <span key={i} className="flex flex-col items-center">
                    <span className={`rounded px-2 py-0.5 font-bold tabular-nums ${i === Math.min(applied.idx, n - 1) ? "bg-amber-400 text-zinc-950" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                      {v}
                    </span>
                    <span className="mt-0.5 text-[10px] text-zinc-400">{i}</span>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">bit</div>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[13px]">
                {current.bit.map((v, j) => {
                  if (j === 0) return null;
                  return (
                    <span key={j} className="flex flex-col items-center">
                      <span className={`rounded px-2 py-0.5 font-bold tabular-nums ${j === current.cur ? "bg-amber-400 text-zinc-950" : touchedSet.has(j) ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                        {v}
                      </span>
                      <span className="mt-0.5 text-[10px] text-zinc-400">{j}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          {done && (
            <div className="flex items-center justify-center gap-2 border-t border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              {applied.op === "query" ? `${T(STR.treeX.sumW)} = ${result.out}` : `+${result.out}`} ✓
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
            {FENWICK_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), result.out],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="font-mono text-[11px] leading-5 text-zinc-400">
          lowbit = i &amp; −i · jump lengths 1, 2, 4…
        </p>
      </div>
    </div>
  );
}
