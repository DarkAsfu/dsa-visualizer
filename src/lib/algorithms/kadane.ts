import type { Lang } from "../dict";

export type KStep = {
  array: number[];
  curWin: [number, number] | null;
  bestWin: [number, number] | null;
  focus?: number[];
  cur: number;
  best: number;
  desc: string;
  codeLine: number;
};

export type KResult = {
  steps: KStep[];
  ops: number;
  best: number;
  bestWin: [number, number];
};

function snap(array: number[], extra: Partial<KStep> = {}): KStep {
  return {
    array: [...array],
    curWin: null,
    bestWin: null,
    cur: 0,
    best: 0,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function kadaneTrace(input: number[], lang: Lang = "en"): KResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  let cur = arr[0];
  let best = arr[0];
  let curStart = 0;
  let bestWin: [number, number] = [0, 0];
  let ops = 0;
  const steps: KStep[] = [
    snap(arr, {
      curWin: [0, 0],
      bestWin: [0, 0],
      focus: [0],
      cur,
      best,
      desc: bn
        ? `শুরু: cur = best = a[0] = ${arr[0]}`
        : `Start: cur = best = a[0] = ${arr[0]}`,
      codeLine: 0,
    }),
  ];
  for (let i = 1; i < n; i++) {
    ops++;
    const extend = cur + arr[i];
    if (arr[i] > extend) {
      cur = arr[i];
      curStart = i;
      steps.push(
        snap(arr, {
          curWin: [i, i],
          bestWin,
          focus: [i],
          cur,
          best,
          desc: bn
            ? `a[${i}]=${arr[i]} > ${extend} — নতুন করে শুরু`
            : `a[${i}]=${arr[i]} beats ${extend} — restart here`,
          codeLine: 2,
        })
      );
    } else {
      cur = extend;
      steps.push(
        snap(arr, {
          curWin: [curStart, i],
          bestWin,
          focus: [i],
          cur,
          best,
          desc: bn
            ? `বাড়াও: ${cur - arr[i]} + ${arr[i]} = ${cur}`
            : `extend: ${cur - arr[i]} + ${arr[i]} = ${cur}`,
          codeLine: 2,
        })
      );
    }
    if (cur > best) {
      best = cur;
      bestWin = [curStart, i];
      steps.push(
        snap(arr, {
          curWin: [curStart, i],
          bestWin,
          cur,
          best,
          desc: bn
            ? `নতুন সেরা ${best} [${curStart}..${i}]`
            : `new best ${best} [${curStart}..${i}]`,
          codeLine: 3,
        })
      );
    }
  }
  steps.push(
    snap(arr, {
      curWin: [curStart, n - 1],
      bestWin,
      cur,
      best,
      desc: bn
        ? `শেষ — সর্বোচ্চ যোগফল ${best} [${bestWin[0]}..${bestWin[1]}]`
        : `done — max sum ${best} [${bestWin[0]}..${bestWin[1]}]`,
      codeLine: 4,
    })
  );
  return { steps, ops, best, bestWin };
}

export const KADANE_CODE = [
  "cur = best = a[0]",
  "for i in 1..n-1:",
  "  cur = max(a[i], cur + a[i])",
  "  best = max(best, cur)",
  "done",
];

export function randomKArray(size: number): number[] {
  return Array.from({ length: size }, () => -9 + Math.floor(Math.random() * 19));
}
