'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const N = 8;

type Snap = { arr: number[]; a: number; b: number; done: number };

function bubbleTrace(arr: number[]): Snap[] {
  const a = [...arr];
  const out: Snap[] = [{ arr: [...a], a: -1, b: -1, done: 0 }];
  for (let end = a.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      out.push({ arr: [...a], a: i, b: i + 1, done: a.length - 1 - end });
      if (a[i] > a[i + 1]) {
        const t = a[i];
        a[i] = a[i + 1];
        a[i + 1] = t;
        out.push({ arr: [...a], a: i, b: i + 1, done: a.length - 1 - end });
      }
    }
  }
  out.push({ arr: [...a], a: -1, b: -1, done: a.length });
  return out;
}

function ordered(): number[] {
  return Array.from({ length: N }, (_, i) => i + 1);
}

function shuffled(): number[] {
  const a = ordered();
  // deterministic LCG so prerender + first paint match; real shuffle happens on mount/click
  let s = 123456789;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function liveShuffled(): number[] {
  const a = ordered();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HeroPlayground() {
  const router = useRouter();
  const [trace, setTrace] = useState<Snap[]>(() => bubbleTrace(shuffled()));
  const [idx, setIdx] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % trace.length), 120 / speed);
    return () => clearInterval(id);
  }, [trace, speed]);

  const snap = trace[Math.min(idx, trace.length - 1)];
  const max = N;
  const sortedCount = snap.done;

  const reshuffle = useCallback(() => {
    setTrace(bubbleTrace(liveShuffled()));
    setIdx(0);
  }, []);

  const progress = useMemo(() => Math.round((idx / Math.max(1, trace.length - 1)) * 100), [idx, trace.length]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.3)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <span className="relative flex h-2 w-2">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          live · bubble sort
        </span>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-zinc-400">
          {progress}%
        </span>
      </div>
      <button
        onClick={reshuffle}
        title="Shuffle & replay"
        className="flex h-48 w-full cursor-pointer items-end justify-center gap-2 px-5 pb-3 pt-4"
      >
        {snap.arr.map((v, i) => {
          const isCmp = i === snap.a || i === snap.b;
          const isDone = i >= snap.arr.length - sortedCount;
          return (
            <span
              key={i}
              style={{ height: `${(v / max) * 100}%` }}
              className={`w-full rounded-md transition-all duration-150 ${
                isCmp ? "bg-amber-400" : isDone ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            />
          );
        })}
      </button>
      <div className="flex items-center gap-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <button
          onClick={reshuffle}
          className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12px] font-bold text-white transition hover:opacity-85 dark:bg-white dark:text-zinc-950"
        >
          ↻ shuffle
        </button>
        {[0.5, 1, 2].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded-md px-2 py-1.5 font-mono text-[12px] tabular-nums transition ${
              speed === s
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {s}x
          </button>
        ))}
        <button
          onClick={() => router.push("/sorting-race")}
          className="ml-auto shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-[12px] text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          race 12 →
        </button>
      </div>
    </div>
  );
}
