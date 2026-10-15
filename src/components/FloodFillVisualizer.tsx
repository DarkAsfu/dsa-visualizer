'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { FLOOD_CODE, floodFill } from "@/lib/structural";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const ROWS = 12;
const COLS = 16;
const START = 0;
type Brush = "wall" | "erase";

export default function FloodFillVisualizer() {
  const { lang, T } = useLang();
  const [walls, setWalls] = useState<Set<number>>(
    () => new Set([19, 20, 21, 35, 51, 67, 83, 99, 115, 131, 147, 100, 101, 117])
  );
  const [dragging, setDragging] = useState(false);
  const [brush, setBrush] = useState<Brush>("wall");
  const [speed, setSpeed] = useState(4);

  const result = useMemo(
    () => floodFill(ROWS, COLS, walls, START, lang),
    [walls, lang]
  );
  const steps = result.steps;
  const {
    stepIndex,
    playing,
    setPlaying,
    stepFwd,
    stepBack,
    reset: stopAndReset,
    done,
    progress,
  } = usePlayer(steps.length, speed, 220, 40, 15);

  useEffect(() => {
    function up() {
      setDragging(false);
    }
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const current = steps[Math.min(stepIndex, steps.length - 1)];

  function paint(i: number) {
    if (i === START) return;
    setWalls((w) => {
      const n = new Set(w);
      if (brush === "wall") n.add(i);
      else n.delete(i);
      return n;
    });
    stopAndReset();
  }

  const filledSet = useMemo(() => new Set(current.filled), [current]);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {(["wall", "erase"] as Brush[]).map((b) => (
            <button
              key={b}
              onClick={() => setBrush(b)}
              className={`rounded-md border px-3 py-1.5 text-[13px] transition ${
                brush === b
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              {b === "wall" ? T(STR.common.wallW) : T(STR.common.eraseW)}
            </button>
          ))}
          <button
            onClick={() => {
              setWalls(new Set());
              stopAndReset();
            }}
            className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {T(STR.common.clear)} {T(STR.common.wallsW)}
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
          {done && (
            <div className="flex items-center justify-center gap-2 border-b border-emerald-200 bg-emerald-50 px-4 py-2 font-mono text-[13px] dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="rounded bg-emerald-500 px-2 py-0.5 font-bold tabular-nums text-white">{result.count}</span>
              <span className="text-emerald-700 dark:text-emerald-300">{T(STR.outX.filled)} ✓</span>
            </div>
          )}
          <div className="select-none p-3 sm:p-4">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
              {Array.from({ length: ROWS * COLS }, (_, i) => (
                <div
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDragging(true);
                    paint(i);
                  }}
                  onMouseEnter={() => {
                    if (dragging) paint(i);
                  }}
                  className={`flex aspect-square items-center justify-center rounded-[3px] transition-colors duration-75 ${
                    i === START
                      ? "bg-emerald-600"
                      : walls.has(i)
                        ? "bg-zinc-700 dark:bg-zinc-300"
                        : filledSet.has(i)
                          ? "bg-sky-400 dark:bg-sky-600"
                          : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <Transport
              playing={playing} done={done}
              onPlay={() => { if (done) { stopAndReset(); setPlaying(true); } else { setPlaying((p) => !p); } }}
              onBack={stepBack} onFwd={stepFwd} onReset={stopAndReset} speed={speed} onSpeed={setSpeed}
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
            {FLOOD_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.visitedW), result.count],
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
