'use client';

import type { DPCell, DPRef } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

/** Top status bar: step description + counter + progress. */
export function StageBar({
  desc,
  index,
  total,
  playing,
  done,
  progress,
}: {
  desc: string;
  index: number;
  total: number;
  playing: boolean;
  done: boolean;
  progress: number;
}) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`} />
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
          {desc}
        </span>
        <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
          {index + 1}/{total}
        </span>
      </div>
      <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
        <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}

function inRefs(refs: DPRef[] | undefined, r: number, c: number): boolean {
  return refs?.some(([rr, cc]) => rr === r && cc === c) ?? false;
}

/** Generic DP matrix with optional row/col headers and highlights. */
export function DpTable({
  mat,
  cell,
  refs,
  path,
  rowH,
  colH,
  fmt,
  corner = "",
}: {
  mat: DPCell[][];
  cell?: DPRef;
  refs?: DPRef[];
  path?: DPRef[];
  rowH?: string[];
  colH?: string[];
  fmt?: (v: DPCell) => string;
  corner?: string;
}) {
  const show = (v: DPCell): string => {
    if (fmt) return fmt(v);
    if (v === null) return "·";
    if (typeof v === "boolean") return v ? "T" : "–";
    if (typeof v === "number" && !Number.isFinite(v)) return "∞";
    return String(v);
  };
  return (
    <div className="overflow-x-auto p-4">
      <table className="mx-auto border-collapse font-mono text-[13px]">
        {colH && (
          <thead>
            <tr>
              <th className="min-w-10 px-1 font-mono text-[11px] text-zinc-400">{corner}</th>
              {colH.map((h, j) => (
                <th key={j} className="min-w-10 px-1 py-1 text-center text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {mat.map((row, i) => (
            <tr key={i}>
              {rowH && (
                <th className="min-w-10 px-1 text-center text-zinc-400">{rowH[i]}</th>
              )}
              {row.map((v, j) => {
                const isCell = cell?.[0] === i && cell?.[1] === j;
                const isRef = !isCell && inRefs(refs, i, j);
                const isPath = !isCell && inRefs(path, i, j);
                return (
                  <td
                    key={j}
                    className={`min-w-10 border border-zinc-200 px-2 py-2 text-center tabular-nums dark:border-zinc-800 ${
                      isCell
                        ? "bg-emerald-500 font-bold text-white"
                        : isPath
                          ? "bg-sky-500/20 font-bold text-sky-700 dark:text-sky-300"
                          : isRef
                            ? "bg-amber-100 font-semibold dark:bg-amber-950/60"
                            : typeof v === "boolean" && v
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {show(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Right rail: pseudocode + stat grid + legend. */
export function CodeRail({
  code,
  line,
  stats,
  legend,
}: {
  code: string[];
  line: number;
  stats: Array<[string, string | number]>;
  legend?: Array<[string, string]>;
}) {
  const { T } = useLang();
  return (
    <div className="min-w-0 space-y-4">
      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
          {T(STR.common.pseudocode)}
        </div>
        <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
          {code.map((l, i) => (
            <div key={i} className={`flex gap-2.5 rounded px-2 ${i === line ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
              <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
              <span className="whitespace-pre">{l}</span>
            </div>
          ))}
        </pre>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
        {stats.map(([k, v]) => (
          <div key={k} className="px-3 py-2.5 text-center">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
            <dd className="truncate text-[14px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
          </div>
        ))}
      </dl>

      {legend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 font-mono text-[11px] dark:border-zinc-800">
          {legend.map(([label, dot]) => (
            <span key={label} className="flex items-center gap-1.5 text-zinc-500">
              <span className={`h-2 w-2 rounded-[2px] ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
