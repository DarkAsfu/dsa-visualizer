'use client';

import { useMemo, useState } from "react";
import { GROWTH_FNS, formatAxis, formatOps } from "@/lib/complexity";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const W = 680;
const H = 210;
const PAD = { l: 64, r: 56, t: 14, b: 30 };

function niceLinearTicks(max: number): Array<{ f: number; label: string }> {
  if (max <= 0) return [{ f: 0, label: "0" }];
  const raw = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : 2) * mag;
  const out: Array<{ f: number; label: string }> = [];
  for (let v = 0; v <= max + 1e-9; v += step) {
    out.push({ f: v / max, label: formatAxis(v) });
  }
  return out;
}

export default function ComplexityChart() {
  const { T } = useLang();
  const [nMax, setNMax] = useState(5);
  const [logScale, setLogScale] = useState(true);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(GROWTH_FNS.map((f) => [f.id, true]))
  );

  const fns = useMemo(() => GROWTH_FNS.filter((f) => enabled[f.id]), [enabled]);

  function toggle(id: string) {
    setEnabled((e) => ({ ...e, [id]: !e[id] }));
  }

  const x = (n: number) =>
    PAD.l + ((n - 1) / Math.max(1, nMax - 1)) * (W - PAD.l - PAD.r);

  const rawMax = useMemo(() => {
    let m = 0;
    for (const f of fns) {
      const v = f.fn(nMax);
      if (Number.isFinite(v)) m = Math.max(m, v);
    }
    return m;
  }, [fns, nMax]);

  // linear mode: explosive curves clip at the top instead of flattening the rest
  const yMaxLinear = useMemo(() => {
    const calm = fns.filter((f) => !f.explosive);
    const pool = calm.length > 0 ? calm : fns;
    let m = 0;
    for (const f of pool) {
      const v = f.fn(nMax);
      if (Number.isFinite(v)) m = Math.max(m, v);
    }
    return Math.max(m, 1);
  }, [fns, nMax]);

  const yMax = logScale ? Math.log10(rawMax + 1) : yMaxLinear;

  function y(v: number): number {
    const t = logScale ? Math.log10(Math.min(v, 1e300) + 1) / Math.max(yMax, 1e-9) : Math.min(v, yMaxLinear) / yMaxLinear;
    return H - PAD.b - Math.max(0, Math.min(1, t)) * (H - PAD.t - PAD.b);
  }

  // integer sampling: stepwise fns (n!) stay clean, no staircase artifacts
  const paths = fns.map((f) => {
    let d = "";
    for (let n = 1; n <= nMax; n++) {
      const px = x(n).toFixed(1);
      const py = y(f.fn(n)).toFixed(1);
      d += (n === 1 ? "M" : "L") + px + " " + py;
    }
    return { id: f.id, color: f.color, d };
  });

  const xTicks = useMemo(() => {
    if (nMax <= 12) return Array.from({ length: nMax }, (_, i) => i + 1);
    const s = new Set<number>();
    for (let i = 0; i < 5; i++) s.add(Math.round(1 + (i / 4) * (nMax - 1)));
    return [...s].sort((a, b) => a - b);
  }, [nMax]);

  const yTicks = useMemo(() => {
    if (logScale) {
      // classic log axis: 1-2-5 per decade (1, 2, 5, 10, 20, 50, 100…)
      const top = Math.max(yMax, 1e-9);
      const decades = Math.floor(yMax);
      let vals: number[] = [];
      for (let k = 0; k <= decades; k++) {
        for (const m of [1, 2, 5]) {
          const v = m * Math.pow(10, k);
          if (Math.log10(v + 1) <= yMax + 1e-9) vals.push(v);
        }
      }
      if (vals.length > 14) {
        // giant range: thin back to sparse powers of 10
        const step = Math.max(1, Math.ceil((decades + 1) / 6));
        vals = [];
        for (let k = 0; k <= decades; k += step) vals.push(Math.pow(10, k));
      }
      return vals.map((v) => {
        const exp = Math.round(Math.log10(v));
        const isPow10 = Math.abs(v - Math.pow(10, exp)) < 1e-9 * v;
        const label =
          v >= 1e15
            ? isPow10
              ? `10^${exp}`
              : `${Math.round(v / Math.pow(10, exp))}×10^${exp}`
            : formatAxis(v);
        return { f: Math.log10(v + 1) / top, label };
      });
    }
    return niceLinearTicks(yMaxLinear);
  }, [logScale, yMax, yMaxLinear]);

  // end-of-curve labels, nudged apart so they never overlap
  const endLabels = useMemo(() => {
    const top = PAD.t + 10;
    const bottom = H - PAD.b - 2;
    const ls = fns.map((f) => {
      const v = f.fn(nMax);
      const t = logScale
        ? Math.log10(Math.min(v, 1e300) + 1) / Math.max(yMax, 1e-9)
        : Math.min(v, yMaxLinear) / Math.max(yMaxLinear, 1e-9);
      const yy = H - PAD.b - Math.max(0, Math.min(1, t)) * (H - PAD.t - PAD.b);
      return {
        id: f.id,
        bigO: f.bigO,
        color: f.color,
        y: Math.max(top, Math.min(bottom, yy)),
      };
    });
    ls.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ls.length; i++) {
      if (ls[i].y - ls[i - 1].y < 13) ls[i].y = ls[i - 1].y + 13;
    }
    const over = ls.length > 0 ? ls[ls.length - 1].y - bottom : 0;
    if (over > 0) ls.forEach((l) => (l.y -= over));
    return ls;
  }, [fns, nMax, logScale, yMax, yMaxLinear]);

  return (
    <div className="space-y-4">
      {/* toggles */}
      <div className="flex flex-wrap gap-1.5">
        {GROWTH_FNS.map((f) => {
          const on = enabled[f.id];
          return (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[12.5px] transition ${
                on
                  ? "border-zinc-300 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  : "border-zinc-200 text-zinc-400 opacity-60 hover:opacity-100 dark:border-zinc-800"
              }`}
            >
              <span
                className="h-2 w-2 rounded-[2px]"
                style={{ background: f.color }}
              />
              {f.bigO}
            </button>
          );
        })}
        <span className="mx-1 hidden h-6 w-px self-center bg-zinc-200 sm:block dark:bg-zinc-800" />
        <div className="flex overflow-hidden rounded-md border border-zinc-200 font-mono text-[12.5px] dark:border-zinc-800">
          <button
            onClick={() => setLogScale(false)}
            className={`px-3 py-1.5 ${!logScale ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}
          >
            Linear
          </button>
          <button
            onClick={() => setLogScale(true)}
            className={`border-l border-zinc-200 px-3 py-1.5 dark:border-zinc-800 ${logScale ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-500"}`}
          >
            Log
          </button>
        </div>
      </div>

      {/* chart panel */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
            {T(STR.common.chartH)} {logScale ? T(STR.common.logAxis) : ""}
          </span>
          <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
            n = {nMax}
            <input
              type="range"
              min={5}
              max={100}
              value={nMax}
              onChange={(e) => setNMax(Number(e.target.value))}
              className="w-28 accent-zinc-950 sm:w-40 dark:accent-white"
            />
          </label>
        </div>
        <div className="px-2 py-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Big-O growth comparison chart"
          >
            {yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={PAD.l}
                  x2={W - PAD.r}
                  y1={H - PAD.b - t.f * (H - PAD.t - PAD.b)}
                  y2={H - PAD.b - t.f * (H - PAD.t - PAD.b)}
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                  strokeDasharray={i === 0 ? "" : "3 4"}
                />
                <text
                  x={PAD.l - 8}
                  y={H - PAD.b - t.f * (H - PAD.t - PAD.b) + 4}
                  textAnchor="end"
                  className="fill-zinc-400 font-mono"
                  fontSize="10"
                >
                  {t.label}
                </text>
              </g>
            ))}
            {xTicks.map((n) => (
              <text
                key={n}
                x={x(n)}
                y={H - 10}
                textAnchor="middle"
                className="fill-zinc-400 font-mono"
                fontSize="10"
              >
                n={n}
              </text>
            ))}
            {paths.map((p) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            {endLabels.map((l) => (
              <text
                key={l.id}
                x={W - 4}
                y={l.y + 3.5}
                textAnchor="end"
                fontSize="10.5"
                fontWeight="600"
                fill={l.color}
                strokeWidth="3"
                className="stroke-white font-mono dark:stroke-zinc-950"
                style={{ paintOrder: "stroke" }}
              >
                {l.bigO}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* values table */}
      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-zinc-200 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-400 dark:border-zinc-800">
              <th className="px-4 py-2 font-medium">{T(STR.complexity.thC)}</th>
              <th className="px-4 py-2 font-medium">{T(STR.complexity.thName)}</th>
              <th className="px-4 py-2 text-right font-medium">{T(STR.complexity.opsAt)}n={nMax}</th>
              <th className="hidden px-4 py-2 text-right font-medium sm:table-cell">{T(STR.complexity.vsN)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {GROWTH_FNS.filter((f) => enabled[f.id]).map((f) => {
              const v = f.fn(nMax);
              const ratio = v / Math.max(nMax, 1);
              return (
                <tr key={f.id}>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold">
                      <span
                        className="h-2 w-2 rounded-[2px]"
                        style={{ background: f.color }}
                      />
                      {f.bigO}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">{f.label}</td>
                  <td className="px-4 py-2 text-right font-mono tabular-nums">
                    {formatOps(v)}
                  </td>
                  <td className="hidden px-4 py-2 text-right font-mono tabular-nums text-zinc-500 sm:table-cell">
                    {formatOps(ratio)}×
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
