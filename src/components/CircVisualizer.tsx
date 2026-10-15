'use client';

import { useState } from "react";
import { Transport, usePlayer } from "./usePlayer";
import { CIRC_CODE, circDequeue, circEnqueue, type CState } from "@/lib/stackQueue2";
import { STR } from "@/lib/dict";
import { useLang } from "@/lib/i18n";

const CAP = 6;

export default function CircVisualizer() {
  const { lang, T } = useLang();
  const [st, setSt] = useState<CState>({ buf: Array(CAP).fill(null), front: 0, rear: CAP - 1, count: 0 });
  const [val, setVal] = useState(10);
  const [opSteps, setOpSteps] = useState(() => circEnqueue({ buf: Array(CAP).fill(null), front: 0, rear: CAP - 1, count: 0 }, 10, lang).steps);
  const [speed, setSpeed] = useState(3);
  const { stepIndex, playing, setPlaying, stepFwd, stepBack, reset, done, last, progress } =
    usePlayer(opSteps.length, speed);

  const current = opSteps[Math.min(stepIndex, last)];
  const view = { buf: current.buf, front: current.front, rear: current.rear, count: current.count };

  const doEnq = () => {
    const r = circEnqueue(st, val, lang);
    setSt(r.state);
    setOpSteps(r.steps);
    reset();
  };
  const doDeq = () => {
    const r = circDequeue(st, lang);
    setSt(r.state);
    setOpSteps(r.steps);
    reset();
  };
  const doClear = () => {
    const fresh: CState = { buf: Array(CAP).fill(null), front: 0, rear: CAP - 1, count: 0 };
    setSt(fresh);
    setOpSteps([{
      buf: [...fresh.buf], front: 0, rear: CAP - 1, count: 0, hi: [],
      desc: lang === "bn" ? "সাফ — আবার শুরু" : "Cleared — fresh ring",
      codeLine: 3,
    }]);
    reset();
  };

  const full = st.count === CAP;
  const empty = st.count === 0;

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            type="number"
            value={val}
            min={0}
            max={99}
            onChange={(e) => setVal(Number(e.target.value))}
            aria-label="value"
            className="w-20 rounded-md border border-zinc-200 bg-transparent px-2.5 py-1.5 font-mono text-[12.5px] dark:border-zinc-800"
          />
          <button onClick={doEnq} className="rounded-md bg-zinc-950 px-3 py-1.5 font-mono text-[12.5px] text-white dark:bg-white dark:text-zinc-950">
            enqueue
          </button>
          <button onClick={doDeq} className="rounded-md border border-zinc-200 px-3 py-1.5 font-mono text-[12.5px] dark:border-zinc-800">
            dequeue
          </button>
          <button onClick={doClear} className="rounded-md px-2.5 py-1.5 font-mono text-[12.5px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {T(STR.common.clear)}
          </button>
          <span className={`ml-auto rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${full ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" : empty ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}>
            {full ? "FULL" : empty ? "EMPTY" : `${st.count}/${CAP}`}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-emerald-500" : done ? "bg-zinc-400" : "bg-amber-400"}`} />
            <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-zinc-600 dark:text-zinc-400">
              {current.desc}
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-zinc-500">
              {stepIndex + 1}/{opSteps.length}
            </span>
          </div>
          <div className="h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full bg-zinc-950 transition-all dark:bg-white" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-center gap-2 overflow-x-auto p-6">
            {view.buf.map((v, i) => {
              const isFront = !empty && i === view.front;
              const isRear = !empty && i === view.rear;
              const hot = current.hi.includes(i) && !done;
              return (
                <div key={i} className="flex shrink-0 flex-col items-center gap-1">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 font-mono text-[16px] font-bold tabular-nums transition ${
                      hot
                        ? "border-amber-400 bg-amber-400/15"
                        : v === null
                          ? "border-dashed border-zinc-300 dark:border-zinc-700"
                          : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {v ?? <span className="text-[11px] text-zinc-300">{i}</span>}
                  </div>
                  <div className="flex h-5 gap-1 font-mono text-[10px] font-bold">
                    {isFront && <span className="rounded bg-sky-500 px-1 text-white">F</span>}
                    {isRear && <span className="rounded bg-emerald-500 px-1 text-white">R</span>}
                  </div>
                </div>
              );
            })}
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
            {CIRC_CODE.map((line, i) => (
              <div key={i} className={`flex gap-2.5 rounded px-2 ${i === current.codeLine ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "text-zinc-600 dark:text-zinc-400"}`}>
                <span className="w-4 shrink-0 select-none text-right opacity-40">{i + 1}</span>
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-zinc-200 rounded-lg border border-zinc-200 font-mono dark:divide-zinc-800 dark:border-zinc-800">
          {[
            ["front", empty ? "—" : st.front],
            ["rear", empty ? "—" : st.rear],
            [T(STR.common.steps), opSteps.length],
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
