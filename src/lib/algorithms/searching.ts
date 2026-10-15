import type { Lang } from "../dict";

export type SearchStep = {
  array: number[];
  check?: number;
  low?: number;
  high?: number;
  mid?: number;
  mid2?: number;
  found?: number;
  done: boolean;
  desc: string;
  codeLine: number;
};

export type SearchResult = {
  steps: SearchStep[];
  comparisons: number;
  foundIndex: number;
};

function snap(array: number[], extra: Partial<SearchStep> = {}): SearchStep {
  return { array: [...array], done: false, desc: "", codeLine: 0, ...extra };
}

export function linearSearch(input: number[], target: number, lang: Lang = "en"): SearchResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SearchStep[] = [snap(arr, { desc: bn ? `শুরু: ${target} খোঁজো` : `Start: scan for ${target}`, codeLine: 0 })];
  let comparisons = 0;
  let foundIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target) {
      foundIndex = i;
      steps.push(
        snap(arr, { check: i, found: i, done: true, desc: bn ? `a[${i}] == ${target} — পাওয়া গেছে` : `a[${i}] == ${target} — found`, codeLine: 1 })
      );
      break;
    }
    steps.push(
      snap(arr, { check: i, desc: bn ? `a[${i}] = ${arr[i]} ≠ ${target} — সামনে চলো` : `a[${i}] = ${arr[i]} ≠ ${target} — keep going`, codeLine: 1 })
    );
  }
  if (foundIndex === -1) {
    steps.push(snap(arr, { done: true, desc: bn ? `${target} নেই — return -1` : `${target} not in array — return -1`, codeLine: 2 }));
  }
  return { steps, comparisons, foundIndex };
}

export function binarySearch(input: number[], target: number, lang: Lang = "en"): SearchResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const steps: SearchStep[] = [
    snap(arr, { low: 0, high: arr.length - 1, desc: bn ? `শুরু: সাজানো অ্যারে, ${target} শিকার` : `Start: sorted array, hunt ${target}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let foundIndex = -1;
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    comparisons++;
    steps.push(
      snap(arr, { low: lo, high: hi, mid, check: mid, desc: `mid = ${mid}, a[mid] = ${arr[mid]}`, codeLine: 2 })
    );
    if (arr[mid] === target) {
      foundIndex = mid;
      steps.push(
        snap(arr, { low: lo, high: hi, mid, check: mid, found: mid, done: true, desc: bn ? `a[${mid}] == ${target} — পাওয়া গেছে` : `a[${mid}] == ${target} — found`, codeLine: 3 })
      );
      break;
    }
    if (arr[mid] < target) {
      steps.push(
        snap(arr, { low: lo, high: hi, mid, check: mid, desc: bn ? `${arr[mid]} < ${target} — বাম অর্ধেক বাদ` : `${arr[mid]} < ${target} — drop left half`, codeLine: 4 })
      );
      lo = mid + 1;
    } else {
      steps.push(
        snap(arr, { low: lo, high: hi, mid, check: mid, desc: bn ? `${arr[mid]} > ${target} — ডান অর্ধেক বাদ` : `${arr[mid]} > ${target} — drop right half`, codeLine: 4 })
      );
      hi = mid - 1;
    }
  }
  if (foundIndex === -1) {
    steps.push(
      snap(arr, { low: lo, high: hi, done: true, desc: bn ? `রেঞ্জ খালি — ${target} পাওয়া যায়নি` : `range empty — ${target} not found`, codeLine: 5 })
    );
  }
  return { steps, comparisons, foundIndex };
}

export const SEARCH_PSEUDOCODE: Record<string, string[]> = {
  linear: [
    "for i in 0..n-1:",
    "  if a[i] == target: return i",
    "return -1  # not found",
  ],
  binary: [
    "lo = 0, hi = n-1  (sorted!)",
    "while lo <= hi:",
    "  mid = (lo + hi) // 2",
    "  if a[mid] == t: return mid",
    "  if a[mid] < t: lo = mid+1 else hi = mid-1",
    "return -1  # not found",
  ],
  jump: [
    "block = √n, prev = 0",
    "jump while block-end < t",
    "linear scan inside block",
    "return index or -1",
  ],
  interpolation: [
    "lo = 0, hi = n-1  (sorted)",
    "pos = lo + (t−a[lo])·(hi−lo)/(a[hi]−a[lo])",
    "compare a[pos], narrow lo/hi",
    "return pos or -1",
  ],
  exponential: [
    "bound = 1",
    "double bound while a[bound] < t",
    "binary search in [bound/2, bound]",
    "return index or -1",
  ],
  ternary: [
    "lo = 0, hi = n-1  (sorted)",
    "m1 = lo+(hi−lo)/3, m2 = hi−(hi−lo)/3",
    "compare both, keep one third",
    "return index or -1",
  ],
};

export function randomSearchArray(size: number, sorted: boolean): number[] {
  const s = new Set<number>();
  while (s.size < size) s.add(1 + Math.floor(Math.random() * 99));
  const arr = [...s];
  return sorted ? arr.sort((x, y) => x - y) : arr;
}

export function jumpSearch(input: number[], target: number, lang: Lang = "en"): SearchResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const n = arr.length;
  const block = Math.max(1, Math.floor(Math.sqrt(n)));
  const steps: SearchStep[] = [
    snap(arr, { desc: bn ? `শুরু: ব্লক √${n} ≈ ${block}, ${target} খোঁজো` : `Start: block size √${n} ≈ ${block}, hunt ${target}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let foundIndex = -1;
  let prev = 0;
  let step = block;
  // phase 1: jump
  while (prev < n && arr[Math.min(step, n) - 1] < target) {
    comparisons++;
    const end = Math.min(step, n) - 1;
    steps.push(
      snap(arr, { low: prev, high: end, check: end, desc: bn ? `a[${end}] = ${arr[end]} < ${target} — সামনে লাফ` : `a[${end}] = ${arr[end]} < ${target} — jump ahead`, codeLine: 1 })
    );
    prev = step;
    step += block;
  }
  // phase 2: linear scan inside block
  const end = Math.min(step, n);
  for (let i = prev; i < end; i++) {
    comparisons++;
    if (arr[i] === target) {
      foundIndex = i;
      steps.push(
        snap(arr, { low: prev, high: end - 1, check: i, found: i, done: true, desc: bn ? `a[${i}] == ${target} — পাওয়া গেছে` : `a[${i}] == ${target} — found`, codeLine: 2 })
      );
      break;
    }
    steps.push(
      snap(arr, { low: prev, high: end - 1, check: i, desc: bn ? `স্ক্যান a[${i}] = ${arr[i]} ≠ ${target}` : `scan a[${i}] = ${arr[i]} ≠ ${target}`, codeLine: 2 })
    );
  }
  if (foundIndex === -1) {
    steps.push(snap(arr, { done: true, desc: bn ? `ব্লক শেষ — ${target} নেই` : `block exhausted — ${target} not found`, codeLine: 3 }));
  }
  return { steps, comparisons, foundIndex };
}

export function interpolationSearch(input: number[], target: number, lang: Lang = "en"): SearchResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const steps: SearchStep[] = [
    snap(arr, { low: 0, high: arr.length - 1, desc: bn ? `শুরু: মান-ব্যবধানে probe (${target})` : `Start: probe by value distribution for ${target}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let foundIndex = -1;
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[hi] === arr[lo]) {
      comparisons++;
      if (arr[lo] === target) {
        foundIndex = lo;
        steps.push(snap(arr, { low: lo, high: hi, check: lo, found: lo, done: true, desc: bn ? `সমতল রেঞ্জ, a[${lo}] == ${target}` : `flat range, a[${lo}] == ${target}`, codeLine: 2 }));
      }
      break;
    }
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    const p = Math.max(lo, Math.min(hi, pos));
    steps.push(
      snap(arr, { low: lo, high: hi, mid: p, check: p, desc: bn ? `মান-ব্যবধান থেকে probe pos = ${p}` : `probe pos = ${p} from value gap`, codeLine: 1 })
    );
    comparisons++;
    if (arr[p] === target) {
      foundIndex = p;
      steps.push(
        snap(arr, { low: lo, high: hi, mid: p, check: p, found: p, done: true, desc: bn ? `a[${p}] == ${target} — পাওয়া গেছে` : `a[${p}] == ${target} — found`, codeLine: 2 })
      );
      break;
    }
    if (arr[p] < target) {
      steps.push(
        snap(arr, { low: lo, high: hi, mid: p, check: p, desc: `${arr[p]} < ${target} — lo = ${p + 1}`, codeLine: 2 })
      );
      lo = p + 1;
    } else {
      steps.push(
        snap(arr, { low: lo, high: hi, mid: p, check: p, desc: `${arr[p]} > ${target} — hi = ${p - 1}`, codeLine: 2 })
      );
      hi = p - 1;
    }
  }
  if (foundIndex === -1) {
    steps.push(snap(arr, { low: lo, high: hi, done: true, desc: bn ? `probe রেঞ্জের বাইরে — ${target} নেই` : `probe out of range — ${target} not found`, codeLine: 3 }));
  }
  return { steps, comparisons, foundIndex };
}

export function exponentialSearch(input: number[], target: number, lang: Lang = "en"): SearchResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const n = arr.length;
  const steps: SearchStep[] = [
    snap(arr, { desc: bn ? `শুরু: দ্বিগুণ করে রেঞ্জ খুঁজো (${target})` : `Start: find range by doubling for ${target}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let foundIndex = -1;
  if (n > 0) {
    comparisons++;
    steps.push(snap(arr, { check: 0, desc: bn ? `দেখো a[0] = ${arr[0]}` : `check a[0] = ${arr[0]}`, codeLine: 1 }));
    if (arr[0] !== target) {
      let bound = 1;
      while (bound < n && arr[bound] < target) {
        comparisons++;
        steps.push(
          snap(arr, { low: 0, high: Math.min(bound, n - 1), check: bound, desc: bn ? `a[${bound}] = ${arr[bound]} < ${target} — দ্বিগুণ (${bound * 2})` : `a[${bound}] = ${arr[bound]} < ${target} — double to ${bound * 2}`, codeLine: 1 })
        );
        bound *= 2;
      }
      let lo = Math.floor(bound / 2);
      let hi = Math.min(bound, n - 1);
      steps.push(
        snap(arr, { low: lo, high: hi, desc: bn ? `রেঞ্জ আটকা [${lo}, ${hi}] — ভেতরে বাইনারি সার্চ` : `range locked [${lo}, ${hi}] — binary search inside`, codeLine: 2 })
      );
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        comparisons++;
        steps.push(
          snap(arr, { low: lo, high: hi, mid, check: mid, desc: `mid = ${mid}, a[mid] = ${arr[mid]}`, codeLine: 2 })
        );
        if (arr[mid] === target) {
          foundIndex = mid;
          steps.push(
            snap(arr, { low: lo, high: hi, mid, check: mid, found: mid, done: true, desc: bn ? `a[${mid}] == ${target} — পাওয়া গেছে` : `a[${mid}] == ${target} — found`, codeLine: 2 })
          );
          break;
        }
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
    } else {
      foundIndex = 0;
      steps.push(snap(arr, { check: 0, found: 0, done: true, desc: bn ? `a[0] == ${target} — পাওয়া গেছে` : `a[0] == ${target} — found`, codeLine: 1 }));
    }
  }
  if (foundIndex === -1) {
    steps.push(snap(arr, { done: true, desc: bn ? `${target} পাওয়া যায়নি` : `${target} not found`, codeLine: 3 }));
  }
  return { steps, comparisons, foundIndex };
}

export function ternarySearch(input: number[], target: number, lang: Lang = "en"): SearchResult {
  const bn = lang === "bn";
  const arr = [...input].sort((x, y) => x - y);
  const steps: SearchStep[] = [
    snap(arr, { low: 0, high: arr.length - 1, desc: bn ? `শুরু: তিন ভাগ করো (${target})` : `Start: split into thirds for ${target}`, codeLine: 0 }),
  ];
  let comparisons = 0;
  let foundIndex = -1;
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const m1 = lo + Math.floor((hi - lo) / 3);
    const m2 = hi - Math.floor((hi - lo) / 3);
    comparisons += 2;
    steps.push(
      snap(arr, { low: lo, high: hi, mid: m1, mid2: m2, check: m1, desc: `m1 = ${m1} (${arr[m1]}), m2 = ${m2} (${arr[m2]})`, codeLine: 1 })
    );
    if (arr[m1] === target) {
      foundIndex = m1;
      steps.push(
        snap(arr, { low: lo, high: hi, mid: m1, mid2: m2, check: m1, found: m1, done: true, desc: bn ? `a[${m1}] == ${target} — পাওয়া গেছে` : `a[${m1}] == ${target} — found`, codeLine: 2 })
      );
      break;
    }
    if (arr[m2] === target) {
      foundIndex = m2;
      steps.push(
        snap(arr, { low: lo, high: hi, mid: m1, mid2: m2, check: m2, found: m2, done: true, desc: bn ? `a[${m2}] == ${target} — পাওয়া গেছে` : `a[${m2}] == ${target} — found`, codeLine: 2 })
      );
      break;
    }
    if (target < arr[m1]) {
      steps.push(
        snap(arr, { low: lo, high: hi, mid: m1, mid2: m2, desc: bn ? `${target} < ${arr[m1]} — বাম তৃতীয়াংশ রাখো` : `${target} < ${arr[m1]} — keep left third`, codeLine: 2 })
      );
      hi = m1 - 1;
    } else if (target > arr[m2]) {
      steps.push(
        snap(arr, { low: lo, high: hi, mid: m1, mid2: m2, desc: bn ? `${target} > ${arr[m2]} — ডান তৃতীয়াংশ রাখো` : `${target} > ${arr[m2]} — keep right third`, codeLine: 2 })
      );
      lo = m2 + 1;
    } else {
      steps.push(
        snap(arr, { low: lo, high: hi, mid: m1, mid2: m2, desc: bn ? `মাঝে — মাঝের তৃতীয়াংশ রাখো [${m1 + 1}, ${m2 - 1}]` : `between — keep middle third [${m1 + 1}, ${m2 - 1}]`, codeLine: 2 })
      );
      lo = m1 + 1;
      hi = m2 - 1;
    }
  }
  if (foundIndex === -1) {
    steps.push(snap(arr, { low: lo, high: hi, done: true, desc: bn ? `রেঞ্জ খালি — ${target} পাওয়া যায়নি` : `range empty — ${target} not found`, codeLine: 3 }));
  }
  return { steps, comparisons, foundIndex };
}
