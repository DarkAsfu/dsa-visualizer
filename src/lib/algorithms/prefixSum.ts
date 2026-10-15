import type { Lang } from "../dict";

export type PSStep = {
  array: number[];
  pref: (number | null)[];
  hiA?: number[];
  hiP?: number[];
  range?: [number, number] | null;
  query?: [number, number];
  answer: number | null;
  desc: string;
  codeLine: number;
};

export type PSResult = {
  steps: PSStep[];
  pref: number[];
  answer: number;
};

function snap(
  array: number[],
  pref: (number | null)[],
  extra: Partial<PSStep> = {}
): PSStep {
  return {
    array: [...array],
    pref: [...pref],
    answer: null,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function prefixTrace(
  input: number[],
  l: number,
  r: number,
  lang: Lang = "en"
): PSResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  const P: (number | null)[] = Array(n + 1).fill(null);
  P[0] = 0;
  const steps: PSStep[] = [
    snap(arr, P, {
      hiP: [0],
      desc: bn ? "P[0] = 0 — খালি prefix" : "P[0] = 0 — empty prefix",
      codeLine: 0,
    }),
  ];
  for (let i = 0; i < n; i++) {
    P[i + 1] = (P[i] ?? 0) + arr[i];
    steps.push(
      snap(arr, P, {
        hiA: [i],
        hiP: [i, i + 1],
        desc: bn
          ? `P[${i + 1}] = P[${i}] + a[${i}] = ${P[i]} + ${arr[i]} = ${P[i + 1]}`
          : `P[${i + 1}] = P[${i}] + a[${i}] = ${P[i]} + ${arr[i]} = ${P[i + 1]}`,
        codeLine: 2,
      })
    );
  }
  const lo = Math.max(0, Math.min(l, n - 1));
  const hi = Math.max(lo, Math.min(r, n - 1));
  const ans = (P[hi + 1] ?? 0) - (P[lo] ?? 0);
  steps.push(
    snap(arr, P, {
      range: [lo, hi],
      hiP: [lo, hi + 1],
      query: [lo, hi],
      answer: ans,
      desc: bn
        ? `যোগফল[${lo}..${hi}] = P[${hi + 1}] − P[${lo}] = ${P[hi + 1]} − ${P[lo]} = ${ans}`
        : `sum[${lo}..${hi}] = P[${hi + 1}] − P[${lo}] = ${P[hi + 1]} − ${P[lo]} = ${ans}`,
      codeLine: 3,
    })
  );
  return { steps, pref: P as number[], answer: ans };
}

export const PS_CODE = [
  "P[0] = 0",
  "for i in 0..n-1:",
  "  P[i+1] = P[i] + a[i]",
  "query(l,r) = P[r+1] − P[l]",
];

export function randomPSArray(size: number): number[] {
  return Array.from({ length: size }, () => -5 + Math.floor(Math.random() * 15));
}
