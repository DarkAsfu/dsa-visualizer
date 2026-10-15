'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ANAGRAM_CODE,
  PALIN_CODE,
  anagramTrace,
  palindromeTrace,
} from "@/lib/palinAnagram";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

type Mode = "palin" | "ana";

export default function PalinAnagramVisualizer() {
  const [mode, setMode] = useState<Mode>("palin");
  const { lang, T } = useLang();
  const [s1, setS1] = useState("racecar");
  const [s2, setS2] = useState("silent");
  const [in1, setIn1] = useState("racecar");
  const [in2, setIn2] = useState("silent");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const trace = useMemo(() => {
    if (mode === "palin") {
      const r = palindromeTrace(s1, lang);
      return { steps: r.steps, verdict: r.verdict, code: PALIN_CODE };
    }
    const r = anagramTrace(s1, s2, lang);
    return { steps: r.steps, verdict: r.verdict, code: ANAGRAM_CODE };
  }, [mode, s1, s2, lang]);
  const steps = trace.steps as Array<{
    desc: string;
    codeLine: number;
  }>;
  const last = steps.length - 1;
  const current = steps[Math.min(stepIndex, last)] as (typeof trace.steps)[number];
  const done = stepIndex >= last;
  const delay = Math.max(80, 750 - speed * 140);

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length - 1) {
      const t = setTimeout(() => setPlaying(false), 0);
      return () => clearTimeout(t);
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((s) => Math.min(s + 1, steps.length - 1));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, stepIndex, steps.length, delay]);

  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
  }, []);

  const stepFwd = useCallback(() => setStepIndex((s) => Math.min(last, s + 1)), [last]);
  const stepBack = useCallback(() => setStepIndex((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
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

  function apply() {
    const a = in1.trim().toLowerCase();
    const b = in2.trim().toLowerCase();
    setS1(mode === "palin" ? a.slice(0, 20) || "racecar" : a.slice(0, 20));
    setS2(b.slice(0, 20));
    setPlaying(false);
    setStepIndex(0);
  }

  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);
  const verdictLabel =
    trace.verdict === null || trace.verdict === undefined
      ? "…"
      : trace.verdict
        ? T(STR.common.lgFound)
        : T(STR.common.absentW);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              ["palin", "Palindrome", "two ends"],
              ["ana", "Anagram", "counts"],
            ] as Array<[Mode, string, string]>
          ).map(([id, name, hint]) => (
            <button
              key={id}
              onClick={() => {
                setMode(id);
                setPlaying(false);
                setStepIndex(0);
              }}
              className={`flex shrink-0 items-baseline gap-2 rounded-md border px-3 py-1.5 text-[13.5px] transition ${
                mode === id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              <span className="font-medium">{name}</span>
              <span className={`font-mono text-[11px] ${mode === id ? "opacity-70" : "text-zinc-400"}`}>
                {hint}
              </span>
            </button>
          ))}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <input
              value={in1}
              onChange={(e) => setIn1(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder={mode === "palin" ? "racecar" : "listen"}
              className="min-w-0 w-32 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-48 dark:border-zinc-800 dark:focus:border-zinc-600"
            />
            {mode === "ana" && (
              <input
                value={in2}
                onChange={(e) => setIn2(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                placeholder="silent"
                className="min-w-0 w-32 flex-1 rounded-md border border-zinc-200 bg-transparent px-3 py-1.5 font-mono text-[13px] outline-none placeholder:text-zinc-400 focus:border-zinc-400 sm:max-w-48 dark:border-zinc-800 dark:focus:border-zinc-600"
              />
            )}
            <button
              onClick={apply}
              className="shrink-0 rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {T(STR.common.set)}
            </button>
          </div>
        </div>

        {/* stage panel */}
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

          <div className="space-y-4 p-4">
            {mode === "palin" ? (
              <PalinStage step={current as never} />
            ) : (
              <AnaStage step={current as never} s1={s1} s2={s2} />
            )}
            <p className="font-mono text-[13px]">
              <span className="text-zinc-500">{T(STR.common.result)} = </span>
              <strong className={trace.verdict ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}>
                {verdictLabel}
              </strong>
            </p>
          </div>

          {/* transport */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <button
              onClick={() => (done ? reset() : setPlaying((p) => !p))}
              className="rounded-md bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {playing ? T(STR.common.pause) : done ? T(STR.common.replay) : T(STR.common.play)}
            </button>
            <div className="flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
              <button onClick={stepBack} className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepBack)}>‹</button>
              <button onClick={stepFwd} className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800" aria-label={T(STR.common.stepFwd)}>›</button>
            </div>
            <button onClick={reset} className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              {T(STR.common.reset)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-zinc-950 dark:accent-white" />
            </label>
          </div>
        </div>
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.pseudocode)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {trace.code.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <dl className="grid grid-cols-2 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            [T(STR.common.result), verdictLabel],
            [T(STR.common.steps), steps.length],
          ].map(([k, v]) => (
            <div key={k} className="px-3 py-2.5 text-center">
              <dt className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">{k}</dt>
              <dd className="truncate text-[15px] font-semibold tabular-nums" title={String(v)}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function PalinStage({ step }: { step: { chars: string[]; l: number; r: number; mismatch: boolean; verdict: boolean | null } }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {step.chars.map((ch, i) => {
        const active = i === step.l || i === step.r;
        const decided = step.verdict !== null;
        return (
          <div
            key={i}
            className={`flex h-12 w-11 items-center justify-center rounded-md border font-mono text-[16px] font-bold transition ${
              step.mismatch && active
                ? "border-rose-500 bg-rose-500 text-white"
                : active
                  ? "border-amber-400 bg-amber-400 text-zinc-950"
                  : decided && step.verdict
                    ? "border-emerald-500/60"
                    : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {ch}
          </div>
        );
      })}
      {step.chars.length === 0 && (
        <p className="font-mono text-[12px] text-zinc-400">type a word above</p>
      )}
    </div>
  );
}

function AnaStage({
  step,
  s1,
  s2,
}: {
  step: { chars: string[]; ca: (number | null)[]; cb: (number | null)[]; focus: number; verdict: boolean | null };
  s1: string;
  s2: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[12.5px]">
        <span className="text-zinc-500">A = <strong className="text-zinc-900 dark:text-zinc-100">{s1 || "—"}</strong></span>
        <span className="text-zinc-500">B = <strong className="text-zinc-900 dark:text-zinc-100">{s2 || "—"}</strong></span>
      </div>
      <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left font-mono text-[12.5px]">
          <thead>
            <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wider text-zinc-400 dark:border-zinc-800">
              <th className="px-3 py-1.5 font-medium">ch</th>
              <th className="px-3 py-1.5 text-right font-medium">A</th>
              <th className="px-3 py-1.5 text-right font-medium">B</th>
              <th className="px-3 py-1.5 text-right font-medium">=</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {step.chars.map((ch, i) => {
              const match = step.ca[i] !== null && step.cb[i] !== null && step.ca[i] === step.cb[i];
              return (
                <tr key={ch} className={step.focus === i ? "bg-amber-100/60 dark:bg-amber-950/40" : ""}>
                  <td className="px-3 py-1 font-bold">{ch}</td>
                  <td className="px-3 py-1 text-right tabular-nums">{step.ca[i] ?? "·"}</td>
                  <td className="px-3 py-1 text-right tabular-nums">{step.cb[i] ?? "·"}</td>
                  <td className={`px-3 py-1 text-right ${step.ca[i] !== null ? (match ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500") : "text-zinc-400"}`}>
                    {step.ca[i] === null ? "·" : match ? "✓" : "✗"}
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
