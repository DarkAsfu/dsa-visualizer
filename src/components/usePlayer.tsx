'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

/** Shared playback: steps, transport state, keyboard. */
export function usePlayer(total: number, speed: number, baseDelay = 750, factor = 140, floor = 80) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const last = Math.max(total - 1, 0);
  const done = total > 0 && stepIndex >= last;
  const delay = Math.max(floor, baseDelay - speed * factor);

  useEffect(() => {
    if (!playing || total === 0) return;
    if (stepIndex >= last) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((s) => Math.min(s + 1, last));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, total, last, delay]);

  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(() => setStepIndex((s) => Math.min(last, s + 1)), [last]);
  const stepBack = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => (stepIndex >= last ? false : !p));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepFwd();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepFwd, stepBack, stepIndex, last]);

  const progress = last <= 0 ? 100 : Math.round((stepIndex / last) * 100);
  return { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress };
}

export function Transport({
  playing,
  done,
  onPlay,
  onBack,
  onFwd,
  onReset,
  speed,
  onSpeed,
  backDisabled,
  playDisabled,
}: {
  playing: boolean;
  done: boolean;
  onPlay: () => void;
  onBack: () => void;
  onFwd: () => void;
  onReset: () => void;
  speed: number;
  onSpeed: (v: number) => void;
  backDisabled?: boolean;
  playDisabled?: boolean;
}) {
  const { T } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
      <button
        onClick={onPlay}
        disabled={playDisabled}
        className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {playing ? T(STR.common.pause) : done ? T(STR.common.replay) : T(STR.common.play)}
      </button>
      <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
        <button onClick={onBack} disabled={backDisabled} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
        <button onClick={onFwd} disabled={backDisabled} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
      </div>
      <button onClick={onReset} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
        {T(STR.common.reset)}
      </button>
      <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
        {speed}×
        <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => onSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
      </label>
    </div>
  );
}
