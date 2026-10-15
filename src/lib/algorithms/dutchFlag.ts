import type { Lang } from "../dict";
import type { SortResult, SortStep } from "../types";

function snap(
  array: number[],
  sortedIndices: number[],
  extra: Partial<SortStep> = {}
): SortStep {
  return {
    array: [...array],
    sortedIndices: [...sortedIndices],
    description: "",
    codeLine: 0,
    ...extra,
  };
}

export function dutchFlagTrace(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];
  let swaps = 0;
  let comparisons = 0;
  let low = 0;
  let mid = 0;
  let high = n - 1;

  const zones = () => [
    ...Array.from({ length: low }, (_, k) => k),
    ...Array.from({ length: n - 1 - high }, (_, k) => high + 1 + k),
  ];

  steps.push(
    snap(arr, [], {
      compare: [0, 0],
      description: bn
        ? `শুরু: low=0, mid=0, high=${n - 1}`
        : `Start: low=0, mid=0, high=${n - 1}`,
      codeLine: 0,
    })
  );

  while (mid <= high) {
    comparisons++;
    const v = arr[mid];
    if (v === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      swaps++;
      steps.push(
        snap(arr, zones(), {
          swap: [low, mid],
          description: bn
            ? `a[${mid}]=0 — low=${low}-এর সাথে বদলাও`
            : `a[${mid}]=0 — swap with low=${low}`,
          codeLine: 2,
        })
      );
      low++;
      mid++;
    } else if (v === 1) {
      steps.push(
        snap(arr, zones(), {
          compare: [mid, mid],
          description: bn
            ? `a[${mid}]=1 — জায়গাতেই ঠিক, mid → ${mid + 1}`
            : `a[${mid}]=1 — already home, mid → ${mid + 1}`,
          codeLine: 3,
        })
      );
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      swaps++;
      steps.push(
        snap(arr, zones(), {
          swap: [mid, high],
          description: bn
            ? `a[${mid}]=2 — high=${high}-এর সাথে বদলাও`
            : `a[${mid}]=2 — swap with high=${high}`,
          codeLine: 4,
        })
      );
      high--;
    }
  }
  steps.push(
    snap(arr, arr.map((_, i) => i), {
      description: bn ? "সাজানো — 0, 1, 2 আলাদা!" : "Grouped — 0s, then 1s, then 2s!",
      codeLine: 5,
    })
  );
  return { steps, comparisons, swaps };
}

export const DUTCH_CODE = [
  "low = 0, mid = 0, high = n-1",
  "while mid <= high:",
  "  if a[mid] == 0: swap a[low], a[mid]; low++, mid++",
  "  elif a[mid] == 1: mid++",
  "  else: swap a[mid], a[high]; high--",
  "done — 0s, 1s, 2s grouped",
];

export function randomFlagArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 3));
}
