import type { Lang } from "../dict";

export type SWMode = "fixed" | "variable";

export type SWStep = {
  array: number[];
  win: [number, number] | null; // inclusive [l, r]
  focus?: number[];
  bestWin?: [number, number] | null;
  sum: number;
  best: number;
  desc: string;
  codeLine: number;
};

export type SWResult = {
  steps: SWStep[];
  ops: number;
  best: number;
  bestWin: [number, number] | null;
};

function snap(array: number[], extra: Partial<SWStep> = {}): SWStep {
  return {
    array: [...array],
    win: null,
    sum: 0,
    best: 0,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function fixedWindowOp(
  input: number[],
  k: number,
  lang: Lang = "en"
): SWResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  const kk = Math.max(1, Math.min(k, n));
  let sum = 0;
  for (let i = 0; i < kk; i++) sum += arr[i];
  let best = sum;
  let bestWin: [number, number] | null = [0, kk - 1];
  let ops = 0;
  const steps: SWStep[] = [
    snap(arr, {
      win: [0, kk - 1],
      sum,
      best,
      bestWin,
      desc: bn
        ? `প্রথম উইন্ডো [0..${kk - 1}] যোগফল = ${arr.slice(0, kk).join("+")} = ${sum}`
        : `first window [0..${kk - 1}] sums to ${arr.slice(0, kk).join("+")} = ${sum}`,
      codeLine: 1,
    }),
  ];
  for (let end = kk; end < n; end++) {
    const out = arr[end - kk];
    const inn = arr[end];
    sum = sum - out + inn;
    ops++;
    steps.push(
      snap(arr, {
        win: [end - kk + 1, end],
        focus: [end - kk, end],
        sum,
        best,
        bestWin,
        desc: bn
          ? `সরাও: −${out} +${inn} → ${sum}`
          : `slide: −${out} +${inn} → ${sum}`,
        codeLine: 2,
      })
    );
    if (sum > best) {
      best = sum;
      bestWin = [end - kk + 1, end];
      steps.push(
        snap(arr, {
          win: [end - kk + 1, end],
          sum,
          best,
          bestWin,
          desc: bn ? `নতুন সেরা ${best}` : `new best ${best}`,
          codeLine: 3,
        })
      );
    }
  }
  steps.push(
    snap(arr, {
      win: bestWin,
      sum,
      best,
      bestWin,
      desc: bn ? `শেষ — সর্বোচ্চ যোগফল ${best}` : `done — max sum ${best}`,
      codeLine: 4,
    })
  );
  return { steps, ops, best, bestWin };
}

export function variableWindowOp(
  input: number[],
  limit: number,
  lang: Lang = "en"
): SWResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SWStep[] = [
    snap(arr, {
      desc: bn
        ? `শুরু: যোগফল ≤ ${limit} রেখে সবচেয়ে লম্বা উইন্ডো`
        : `Start: longest window with sum ≤ ${limit}`,
      codeLine: 0,
    }),
  ];
  let ops = 0;
  let left = 0;
  let cur = 0;
  let best = 0;
  let bestWin: [number, number] | null = null;
  for (let right = 0; right < arr.length; right++) {
    cur += arr[right];
    ops++;
    steps.push(
      snap(arr, {
        win: [left, right],
        focus: [right],
        sum: cur,
        best,
        bestWin,
        desc: bn
          ? `বাড়াও: a[${right}]=${arr[right]} যোগ → ${cur}`
          : `expand: add a[${right}]=${arr[right]} → ${cur}`,
        codeLine: 1,
      })
    );
    while (cur > limit && left <= right) {
      ops++;
      steps.push(
        snap(arr, {
          win: [left, right],
          focus: [left],
          sum: cur,
          best,
          bestWin,
          desc: bn
            ? `${cur} > ${limit} — a[${left}]=${arr[left]} বাদ, left → ${left + 1}`
            : `${cur} > ${limit} — drop a[${left}]=${arr[left]}, left → ${left + 1}`,
          codeLine: 2,
        })
      );
      cur -= arr[left];
      left++;
    }
    const len = right - left + 1;
    if (cur <= limit && len > best) {
      best = len;
      bestWin = [left, right];
      steps.push(
        snap(arr, {
          win: [left, right],
          sum: cur,
          best,
          bestWin,
          desc: bn
            ? `নতুন সেরা দৈর্ঘ্য ${best} [${left}..${right}]`
            : `new best length ${best} [${left}..${right}]`,
          codeLine: 3,
        })
      );
    }
  }
  steps.push(
    snap(arr, {
      win: bestWin,
      sum: cur,
      best,
      bestWin,
      desc: bn ? `শেষ — সেরা দৈর্ঘ্য ${best}` : `done — best length ${best}`,
      codeLine: 4,
    })
  );
  return { steps, ops, best, bestWin };
}

export const SW_CODE: Record<SWMode, string[]> = {
  fixed: [
    "sum = a[0..k-1], best = sum",
    "for end in k..n-1:",
    "  sum += a[end] − a[end−k]",
    "  best = max(best, sum)",
    "done",
  ],
  variable: [
    "left = 0, sum = 0, best = 0",
    "for right: sum += a[right]",
    "while sum > K: sum −= a[left], left++",
    "best = max length with sum ≤ K",
    "done",
  ],
};

export function randomSWArray(size: number): number[] {
  return Array.from({ length: size }, () => 1 + Math.floor(Math.random() * 9));
}
