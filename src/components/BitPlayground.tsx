'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BIT_CODE,
  BIT_OPS,
  computeBitSteps,
  expectedResult,
  isPowerOfTwo,
  lowestSetBit,
  popcount,
  toBits,
  toHex,
  type BitOpId,
} from "@/lib/bitwise";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const clampByte = (v: number) =>
  Number.isFinite(v) ? Math.max(0, Math.min(255, Math.floor(v))) : 0;

function BitRow({
  label,
  bits,
  accent,
  focusIdx,
  revealed,
  onToggle,
  dimUnrevealed,
}: {
  label: string;
  bits: number[];
  accent: string;
  focusIdx: number | null;
  revealed?: boolean[];
  onToggle?: (idx: number) => void;
  dimUnrevealed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 shrink-0 font-mono text-[12px] font-bold text-zinc-500">
        {label}
      </span>
      <div className="grid flex-1 grid-cols-8 gap-1">
        {bits.map((bit, idx) => {
          const isFocus = focusIdx === idx;
          const hidden = dimUnrevealed && revealed && !revealed[idx];
          return (
            <button
              key={idx}
              disabled={!onToggle}
              onClick={() => onToggle?.(idx)}
              title={onToggle ? `flip bit ${7 - idx}` : undefined}
              className={`flex aspect-square items-center justify-center rounded-md border font-mono text-[13px] font-bold tabular-nums transition sm:text-[15px] ${
                isFocus
                  ? "border-amber-400 outline outline-2 outline-amber-400"
                  : "border-zinc-200 dark:border-zinc-800"
              } ${
                hidden
                  ? "bg-zinc-50 text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700"
                  : `${accent}`
              } ${onToggle ? "cursor-pointer hover:border-zinc-500" : ""}`}
            >
              {hidden ? "·" : bit}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BitPlayground() {
  const { lang, T } = useLang();
  const [opId, setOpId] = useState<BitOpId>("AND");
  const op = BIT_OPS.find((o) => o.id === opId) ?? BIT_OPS[0];
  const [a, setA] = useState(43);
  const [b, setB] = useState(25);
  const [k, setK] = useState(2);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps = useMemo(
    () => computeBitSteps(a, b, opId, k, lang),
    [a, b, opId, k, lang]
  );
  const last = steps.length - 1;
  const current = steps[Math.min(stepIndex, last)];
  const done = stepIndex >= last;
  const delay = Math.max(80, 750 - speed * 140);
  const final = expectedResult(a, b, opId, k);

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

  const stepFwd = useCallback(
    () => setStepIndex((s) => Math.min(last, s + 1)),
    [last]
  );
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

  function setOp(id: BitOpId) {
    setOpId(id);
    setPlaying(false);
    setStepIndex(0);
  }

  function flip(setter: (v: number) => void, v: number, idx: number) {
    setter(v ^ (1 << (7 - idx)));
    setPlaying(false);
    setStepIndex(0);
  }

  const focusIdx = current.pos === -1 ? null : 7 - current.pos;
  const aBits = toBits(a);
  const bBits = toBits(b);
  const rBits = toBits(current.result);
  const progress = last === 0 ? 100 : Math.round((stepIndex / last) * 100);

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        {/* op tabs */}
        <div className="flex flex-wrap gap-1.5">
          {BIT_OPS.map((o) => (
            <button
              key={o.id}
              onClick={() => setOp(o.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[13px] transition ${
                opId === o.id
                  ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
              }`}
            >
              {o.symbol} <span className="ml-1 opacity-60">{o.name}</span>
            </button>
          ))}
        </div>

        {/* bits panel */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span
              className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`}
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.desc}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{steps.length}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-zinc-950 transition-all dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3 p-4">
            <BitRow
              label="A"
              bits={aBits}
              accent="bg-sky-500/15 text-sky-700 dark:text-sky-300"
              focusIdx={focusIdx}
              onToggle={(i) => flip(setA, a, i)}
            />
            {op.needsB && (
              <BitRow
                label="B"
                bits={bBits}
                accent="bg-violet-500/15 text-violet-700 dark:text-violet-300"
                focusIdx={focusIdx}
                onToggle={(i) => flip(setB, b, i)}
              />
            )}
            <BitRow
              label="R"
              bits={rBits}
              accent="bg-emerald-500/20 font-bold text-emerald-700 dark:text-emerald-300"
              focusIdx={focusIdx}
              revealed={current.revealed}
              dimUnrevealed
            />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-mono text-[12.5px]">
              <label className="flex items-center gap-2 text-zinc-500">
                A =
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={a}
                  onChange={(e) => {
                    setA(clampByte(Number(e.target.value)));
                    setPlaying(false);
                    setStepIndex(0);
                  }}
                  className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                />
                <span className="text-zinc-400">{toHex(a)}</span>
              </label>
              {op.needsB && (
                <label className="flex items-center gap-2 text-zinc-500">
                  B =
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={b}
                    onChange={(e) => {
                      setB(clampByte(Number(e.target.value)));
                      setPlaying(false);
                      setStepIndex(0);
                    }}
                    className="w-16 rounded-md border border-zinc-200 bg-transparent px-2 py-1 tabular-nums outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                  />
                  <span className="text-zinc-400">{toHex(b)}</span>
                </label>
              )}
              {op.needsK && (
                <label className="flex items-center gap-2 text-zinc-500">
                  k = {k}
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={k}
                    onChange={(e) => {
                      setK(Number(e.target.value));
                      setPlaying(false);
                      setStepIndex(0);
                    }}
                    className="w-20 accent-zinc-950 dark:accent-white"
                  />
                </label>
              )}
              <span className="ml-auto font-semibold tabular-nums">
                R = {done ? final : current.result}{" "}
                <span className="font-normal text-zinc-400">
                  {toHex(done ? final : current.result)}
                </span>
              </span>
            </div>
            <p className="font-mono text-[11px] text-zinc-400">
              {T(STR.common.tipBits)}
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
              <button
                onClick={stepBack}
                className="px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={T(STR.common.stepBack)}
              >
                ‹
              </button>
              <button
                onClick={stepFwd}
                className="border-l border-zinc-200 px-3 py-1.5 font-mono text-[13px] hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                aria-label={T(STR.common.stepFwd)}
              >
                ›
              </button>
            </div>
            <button
              onClick={reset}
              className="rounded-md px-2.5 py-1.5 font-mono text-[13px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {T(STR.common.reset)}
            </button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-zinc-500">
              {speed}×
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 accent-zinc-950 dark:accent-white"
              />
            </label>
            <span className="ml-auto hidden font-mono text-[11px] text-zinc-400 xl:block">
              {T(STR.common.spaceHint)}
            </span>
          </div>
        </div>
      </div>

      {/* rail */}
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.code)}
          </div>
          <pre className="overflow-x-auto p-2 font-mono text-[12.5px] leading-6">
            {BIT_CODE[opId].map((line, i) => (
              <div
                key={i}
                className={`flex gap-2.5 rounded px-2 ${
                  i === current.codeLine
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <span className="w-4 shrink-0 select-none text-right opacity-40">
                  {i + 1}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
            {T(STR.common.tricks)} · A={a}
          </div>
          <ul className="divide-y divide-zinc-100 font-mono text-[12.5px] dark:divide-zinc-900">
            <li className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-zinc-500">{T(STR.common.pow2)}</span>
              <span className="font-semibold">
                {isPowerOfTwo(a) ? T(STR.common.yesW) : T(STR.common.noW)}
                <span className="ml-2 font-normal text-zinc-400">
                  a&(a−1)={a & (a - 1)}
                </span>
              </span>
            </li>
            <li className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-zinc-500">{T(STR.common.setBits)}</span>
              <span className="font-semibold tabular-nums">{popcount(a)}</span>
            </li>
            <li className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-zinc-500">{T(STR.common.lowBit)}</span>
              <span className="font-semibold tabular-nums">
                {a === 0 ? "—" : lowestSetBit(a)}
                <span className="ml-2 font-normal text-zinc-400">a&−a</span>
              </span>
            </li>
            <li className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-zinc-500">{T(STR.common.clearLowBit)}</span>
              <span className="font-semibold tabular-nums">
                {a & (a - 1)}
                <span className="ml-2 font-normal text-zinc-400">a&(a−1)</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
