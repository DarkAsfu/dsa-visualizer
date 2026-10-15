'use client';

import { useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { FW_CODE, W_FLOYD, floydWarshall, fmtD, labelW } from "@/lib/weighted";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function FloydVisualizer() {
  const { lang, T } = useLang();
  const [speed, setSpeed] = useState(3);
  const [fromS, setFromS] = useState(0);
  const [toT, setToT] = useState(3);
  const result = useMemo(() => floydWarshall(W_FLOYD, lang), [lang]);
  const route = useMemo(() => result.route(fromS, toT), [result, fromS, toT]);
  const steps = result.steps;
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  const current = steps[Math.min(stepIndex, last)];
  const labels = W_FLOYD.nodes.map((x) => x.label);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
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
          {current.k >= 0 && current.k < labels.length && (
            <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 font-mono text-[13px] dark:border-amber-900/50 dark:bg-amber-950/30">
              <span className="text-amber-600 dark:text-amber-400">k =</span>
              <span className="rounded bg-amber-400 px-2 py-0.5 font-bold text-zinc-950">{labels[current.k]}</span>
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {T(STR.common.fwVia)}
              </span>
            </div>
          )}
          <div className="overflow-x-auto p-4">
            <table className="mx-auto border-collapse font-mono text-[13px]">
              <thead>
                <tr>
                  <th className="w-10" />
                  {labels.map((l) => (
                    <th key={l} className={`w-14 py-1 text-center tabular-nums ${current.k >= 0 && labels[current.k] === l ? "text-amber-500" : "text-zinc-400"}`}>
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.mat.map((row, i) => (
                  <tr key={i}>
                    <th className={`w-10 text-center tabular-nums ${current.k >= 0 && labels[current.k] === labels[i] ? "text-amber-500" : "text-zinc-400"}`}>
                      {labels[i]}
                    </th>
                    {row.map((v, j) => {
                      const isCell = current.cell?.[0] === i && current.cell?.[1] === j;
                      const isVia = current.k === i || current.k === j;
                      return (
                        <td
                          key={j}
                          className={`w-14 border border-zinc-200 py-2 text-center tabular-nums dark:border-zinc-800 ${
                            isCell
                              ? "bg-emerald-500 font-bold text-white"
                              : isVia
                                ? "bg-amber-100 dark:bg-amber-950/50"
                                : ""
                          }`}
                        >
                          {fmtD(v)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 hidden text-center font-mono text-[11px] text-zinc-400">
              {T(STR.common.fwVia)} = {current.k < 0 ? "—" : labels[current.k] ?? current.k}
            </p>
          </div>
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
              {T(STR.outX.output)} · {T(STR.outX.pathTo)} {labels[toT]}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={fromS}
                onChange={(e) => setFromS(Number(e.target.value))}
                className="rounded-md border border-zinc-300 bg-white px-2 py-1 font-mono text-[13px] font-bold dark:border-zinc-700 dark:bg-zinc-900"
                aria-label="from"
              >
                {labels.map((l, i) => (
                  <option key={l} value={i}>{l}</option>
                ))}
              </select>
              <span className="font-mono text-zinc-400">→</span>
              <select
                value={toT}
                onChange={(e) => setToT(Number(e.target.value))}
                className="rounded-md border border-zinc-300 bg-white px-2 py-1 font-mono text-[13px] font-bold dark:border-zinc-700 dark:bg-zinc-900"
                aria-label="to"
              >
                {labels.map((l, i) => (
                  <option key={l} value={i}>{l}</option>
                ))}
              </select>
              <span className="font-mono text-[13px]">
                {route.length === 0 ? (
                  <span className="text-zinc-400">∞</span>
                ) : (
                  <>
                    {route.map((id, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-emerald-500"> → </span>}
                        <span className="font-bold">{labelW(W_FLOYD, id)}</span>
                      </span>
                    ))}
                    <span className="ml-2 font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      = {fmtD(result.mat[fromS][toT])}
                    </span>
                  </>
                )}
              </span>
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
      </div>
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {FW_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), `A→D = ${fmtD(result.mat[0][3])}`],
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
