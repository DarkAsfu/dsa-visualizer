'use client';

import { useEffect, useMemo, useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CodeRail, DpTable, StageBar } from "./DpShared";
import { COIN_AMOUNT, COIN_CODE, COIN_COINS, coinTrace } from "@/lib/algorithms/dp";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

export default function CoinChangeVisualizer() {
  const { lang, T } = useLang();
  const [coins, setCoins] = useState<number[]>(COIN_COINS);
  const [amount, setAmount] = useState(COIN_AMOUNT);
  const [coinInput, setCoinInput] = useState(COIN_COINS.join(", "));
  const [error, setError] = useState("");
  const [speed, setSpeed] = useState(3);
  const result = useMemo(() => coinTrace(coins, amount, lang), [coins, amount, lang]);
  const steps = result.steps;
  const { stepIndex, setStepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(steps.length, speed);

  useEffect(() => {
    setPlaying(false);
    setStepIndex(0);
  }, [coins, amount, lang, setPlaying, setStepIndex]);

  const current = steps[Math.min(stepIndex, last)];
  const colH = Array.from({ length: amount + 1 }, (_, i) => String(i));

  function handleCoins() {
    const nums = [...new Set(coinInput.split(/[, ]+/).map((s) => s.trim()).filter(Boolean).map(Number))].sort((x, y) => x - y);
    if (nums.length < 1 || nums.length > 4 || nums.some((x) => !Number.isInteger(x) || x < 1 || x > 9)) {
      setError(lang === "bn" ? "১–৪টি আলাদা কয়েন, প্রতিটি ১–৯" : "1–4 distinct coins, each 1–9");
      return;
    }
    setError("");
    setCoins(nums);
  }

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <StageBar desc={current.desc} index={stepIndex} total={steps.length} playing={playing} done={done} progress={progress} />
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 px-4 py-3 dark:border-zinc-900">
            {coins.map((c) => (
              <span key={c} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 font-mono text-[15px] font-bold tabular-nums text-amber-600 dark:text-amber-400">
                {c}
              </span>
            ))}
            <span className="self-center font-mono text-[11px] text-zinc-400">
              {lang === "bn" ? "কয়েন" : "coins"}
            </span>
          </div>
          <DpTable mat={current.mat} cell={current.cell} refs={current.refs} colH={colH} corner="dp" />
          <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[12px]">
              <input
                value={coinInput}
                onChange={(e) => setCoinInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCoins()}
                placeholder="1, 3, 4"
                className="w-32 rounded-md border border-zinc-200 bg-transparent px-2 py-1 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                aria-label="coins"
              />
              <button onClick={handleCoins} className="rounded-md border border-zinc-950 px-3 py-1 text-[13px] font-semibold hover:bg-zinc-950 hover:text-white dark:border-zinc-600 dark:hover:bg-white dark:hover:text-zinc-950">
                {T(STR.common.set)}
              </button>
              <span className="text-zinc-500">
                {lang === "bn" ? "টার্গেট" : "amount"} = <strong className="tabular-nums text-zinc-900 dark:text-white">{amount}</strong>
              </span>
              <input type="range" min={1} max={15} step={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-28 accent-zinc-950 dark:accent-white" aria-label="amount" />
              {done && result.minCoins !== null && (
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 font-bold text-white">
                  {result.combo.join(" + ")} = {amount}
                </span>
              )}
            </div>
            {error && <p className="font-mono text-[12px] text-rose-500">{error}</p>}
            <Transport playing={playing} done={done} onPlay={() => (done ? (reset(), setPlaying(true)) : setPlaying((p) => !p))} onBack={stepBack} onFwd={stepFwd} onReset={reset} speed={speed} onSpeed={setSpeed} />
          </div>
        </div>
      </div>

      <CodeRail
        code={COIN_CODE}
        line={current.codeLine}
        stats={[
          [lang === "bn" ? "সর্বনিম্ন" : "min", result.answer],
          [lang === "bn" ? "টার্গেট" : "amount", amount],
          [lang === "bn" ? "ধাপ" : "steps", steps.length],
        ]}
        legend={[
          [lang === "bn" ? "পড়া" : "read", "bg-amber-400"],
          [lang === "bn" ? "লেখা" : "written", "bg-emerald-500"],
        ]}
      />
    </div>
  );
}
