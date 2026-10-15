import type { Lang } from "../dict";

export type TPMode = "pair-sum" | "container" | "remove-dup";

export type TPStep = {
  array: number[];
  l?: number;
  r?: number;
  slow?: number;
  fast?: number;
  check?: number[];
  foundPair?: [number, number];
  compactUntil?: number;
  sum?: number;
  area?: number;
  maxArea?: number;
  desc: string;
  codeLine: number;
};

export type TPResult = {
  steps: TPStep[];
  comparisons: number;
  verdict: string;
};

function snap(array: number[], extra: Partial<TPStep> = {}): TPStep {
  return { array: [...array], desc: "", codeLine: 0, ...extra };
}

export function pairSumOp(input: number[], target: number, lang: Lang = "en"): TPResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const steps: TPStep[] = [
    snap(arr, { l: 0, r: arr.length - 1, desc: bn ? `যোগফল ${target} — দুই সংখ্যা খুঁজো` : `Find two numbers summing to ${target}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let verdict = "not found";
  let l = 0;
  let r = arr.length - 1;
  while (l < r) {
    const sum = arr[l] + arr[r];
    comparisons++;
    steps.push(
      snap(arr, { l, r, check: [l, r], sum, desc: `a[${l}] + a[${r}] = ${arr[l]} + ${arr[r]} = ${sum}`, codeLine: 1 })
    );
    if (sum === target) {
      verdict = `a[${l}] + a[${r}]`;
      steps.push(
        snap(arr, { l, r, foundPair: [l, r], sum, desc: bn ? `${sum} == ${target} — জোড়া মিলেছে` : `${sum} == ${target} — pair found`, codeLine: 2 })
      );
      break;
    }
    if (sum < target) {
      steps.push(snap(arr, { l, r, sum, desc: bn ? `${sum} < ${target} — বড় লাগবে, l → ${l + 1}` : `${sum} < ${target} — need bigger, l → ${l + 1}`, codeLine: 3 }));
      l++;
    } else {
      steps.push(snap(arr, { l, r, sum, desc: bn ? `${sum} > ${target} — ছোট লাগবে, r → ${r - 1}` : `${sum} > ${target} — need smaller, r → ${r - 1}`, codeLine: 3 }));
      r--;
    }
  }
  const last = steps[steps.length - 1];
  if (!last.foundPair) {
    steps.push(snap(arr, { desc: bn ? `পয়েন্টার পার — ${target} জোড়া নেই` : `pointers crossed — no pair sums to ${target}`, codeLine: 4 }));
  }
  return { steps, comparisons, verdict };
}

export function containerOp(input: number[], lang: Lang = "en"): TPResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: TPStep[] = [
    snap(arr, { l: 0, r: arr.length - 1, maxArea: 0, desc: bn ? `লাইনের মাঝে সর্বোচ্চ পানি — l=0, r=${arr.length - 1}` : `Max water between lines — l=0, r=${arr.length - 1}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let maxArea = 0;
  let l = 0;
  let r = arr.length - 1;
  while (l < r) {
    comparisons++;
    const area = Math.min(arr[l], arr[r]) * (r - l);
    const isBest = area > maxArea;
    if (isBest) maxArea = area;
    steps.push(
      snap(arr, {
        l, r, check: [l, r], area, maxArea,
        desc: bn ? `প্রস্থ ${r - l} × উচ্চতা ${Math.min(arr[l], arr[r])} = ${area}${isBest ? " — নতুন সেরা" : ""}` : `width ${r - l} × height ${Math.min(arr[l], arr[r])} = ${area}${isBest ? " — new best" : ""}`,
        codeLine: 1,
      })
    );
    if (arr[l] < arr[r]) {
      steps.push(snap(arr, { l, r, area, maxArea, desc: bn ? `বাম (${arr[l]}) খাটো — l → ${l + 1} সরাও` : `left (${arr[l]}) is shorter — move l → ${l + 1}`, codeLine: 2 }));
      l++;
    } else {
      steps.push(snap(arr, { l, r, area, maxArea, desc: bn ? `ডান (${arr[r]}) খাটো — r → ${r - 1} সরাও` : `right (${arr[r]}) is shorter — move r → ${r - 1}`, codeLine: 2 }));
      r--;
    }
  }
  steps.push(snap(arr, { maxArea, desc: bn ? `শেষ — সর্বোচ্চ area = ${maxArea}` : `done — max area = ${maxArea}`, codeLine: 3 }));
  return { steps, comparisons, verdict: String(maxArea) };
}

export function removeDupOp(input: number[], lang: Lang = "en"): TPResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const steps: TPStep[] = [
    snap(arr, { slow: 0, fast: 1, desc: bn ? `slow = frontier, fast = স্ক্যানার` : `slow = unique frontier, fast = scanner`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let slow = 0;
  for (let fast = 1; fast < arr.length; fast++) {
    comparisons++;
    steps.push(
      snap(arr, { slow, fast, check: [fast], desc: `a[${fast}] = ${arr[fast]} vs a[${slow}] = ${arr[slow]}`, codeLine: 1 })
    );
    if (arr[fast] !== arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
      steps.push(
        snap(arr, { slow, fast, check: [slow], desc: bn ? `নতুন মান — ${slow}-এ ${arr[fast]} লেখো` : `new value — write ${arr[fast]} at ${slow}`, codeLine: 2 })
      );
    }
  }
  steps.push(
    snap(arr, { slow, compactUntil: slow, desc: bn ? `শেষ — ${slow + 1}টি unique` : `done — ${slow + 1} unique, prefix [0..${slow}] compact`, codeLine: 3 })
  );
  return { steps, comparisons, verdict: `len ${slow + 1}` };
}

export const TP_CODE: Record<TPMode, string[]> = {
  "pair-sum": [
    "l = 0, r = n-1  (sorted)",
    "while l < r: sum = a[l] + a[r]",
    "  if sum == t: found",
    "  sum < t ? l++ : r--",
    "crossed → not found",
  ],
  container: [
    "l = 0, r = n-1, best = 0",
    "area = min(a[l],a[r]) × (r−l); best = max",
    "move the shorter side inward",
    "done — best is the answer",
  ],
  "remove-dup": [
    "slow = 0  (sorted array)",
    "for fast in 1..n-1: compare a[fast] vs a[slow]",
    "  if new value: slow++, a[slow] = a[fast]",
    "done — unique prefix is [0..slow]",
  ],
};

function uniqSorted(size: number): number[] {
  const s = new Set<number>();
  while (s.size < size) s.add(1 + Math.floor(Math.random() * 99));
  return [...s].sort((x, y) => x - y);
}

export function randomTPArray(mode: TPMode, size: number): number[] {
  if (mode === "container") {
    return Array.from({ length: size }, () => 2 + Math.floor(Math.random() * 19));
  }
  if (mode === "remove-dup") {
    const base = uniqSorted(Math.max(2, Math.ceil(size / 2)));
    const out = [...base];
    while (out.length < size) out.push(base[Math.floor(Math.random() * base.length)]);
    return out.sort((x, y) => x - y);
  }
  return uniqSorted(size);
}

export function defaultTarget(arr: number[]): number {
  if (arr.length < 2) return 0;
  return arr[0] + arr[arr.length - 1];
}
