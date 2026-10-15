import type { SortResult, SortStep } from "../types";
import type { Lang } from "../dict";

function snapshot(
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

export function bubbleSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  steps.push(
    snapshot(arr, [], { description: bn ? "বাবল সর্ট শুরু" : "Starting Bubble Sort", codeLine: 0 })
  );

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      steps.push(
        snapshot(arr, [], {
          compare: [j, j + 1],
          description: bn ? `${arr[j]} ও ${arr[j + 1]} তুলনা` : `Compare ${arr[j]} and ${arr[j + 1]}`,
          codeLine: 2,
        })
      );
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        steps.push(
          snapshot(arr, [], {
            swap: [j, j + 1],
            description: bn ? `${arr[j + 1]} ও ${arr[j]} অদলবদল` : `Swap ${arr[j + 1]} and ${arr[j]}`,
            codeLine: 3,
          })
        );
      }
    }
    const sortedTail = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
    steps.push(
      snapshot(arr, sortedTail, {
        description: bn ? `${n - 1 - i} নম্বর স্থান সাজানো` : `Position ${n - 1 - i} is sorted`,
        codeLine: 1,
      })
    );
  }
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 5,
    })
  );
  return { steps, comparisons, swaps };
}

export function selectionSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];

  steps.push(
    snapshot(arr, [], { description: bn ? "সিলেকশন সর্ট শুরু" : "Starting Selection Sort", codeLine: 0 })
  );

  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    steps.push(
      snapshot(arr, sorted, {
        compare: [i, i],
        description: bn ? `ইনডেক্স ${i} থেকে ক্ষুদ্রতম খুঁজো` : `Find minimum from index ${i}`,
        codeLine: 1,
      })
    );
    for (let j = i + 1; j < arr.length; j++) {
      comparisons++;
      steps.push(
        snapshot(arr, sorted, {
          compare: [minIdx, j],
          description: bn ? `বর্তমান min ${arr[minIdx]} বনাম ${arr[j]}` : `Compare current min ${arr[minIdx]} with ${arr[j]}`,
          codeLine: 2,
        })
      );
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(
          snapshot(arr, sorted, {
            compare: [minIdx, minIdx],
            description: bn ? `নতুন minimum: ইনডেক্স ${minIdx}-এ ${arr[minIdx]}` : `New minimum: ${arr[minIdx]} at index ${minIdx}`,
            codeLine: 3,
          })
        );
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      steps.push(
        snapshot(arr, sorted, {
          swap: [i, minIdx],
          description: bn ? `${arr[minIdx]} এর সাথে ${arr[i]} বদলাও` : `Swap ${arr[minIdx]} with ${arr[i]}`,
          codeLine: 4,
        })
      );
    }
    sorted.push(i);
    steps.push(
      snapshot(arr, sorted, {
        description: bn ? `ইনডেক্স ${i} সাজানো (${arr[i]})` : `Index ${i} sorted (${arr[i]})`,
        codeLine: 4,
      })
    );
  }
  return { steps, comparisons, swaps };
}

export function insertionSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push(
    snapshot(arr, [0], {
      description: bn ? "ইনসার্শন সর্ট শুরু, প্রথমটা সাজানো" : "Starting Insertion Sort, first element sorted",
      codeLine: 0,
    })
  );

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push(
      snapshot(arr, Array.from({ length: i }, (_, k) => k), {
        compare: [i, i],
        description: bn ? `key ${key} নাও (ইনডেক্স ${i})` : `Pick key ${key} at index ${i}`,
        codeLine: 1,
      })
    );
    while (j >= 0) {
      comparisons++;
      steps.push(
        snapshot(arr, [], {
          compare: [j, j + 1],
          description: bn ? `${arr[j]} বনাম key ${key}` : `Compare ${arr[j]} with key ${key}`,
          codeLine: 2,
        })
      );
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        swaps++;
        steps.push(
          snapshot(arr, [], {
            overwrite: j + 1,
            description: bn ? `${arr[j]} ডানে সরাও` : `Shift ${arr[j]} to the right`,
            codeLine: 3,
          })
        );
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    steps.push(
      snapshot(arr, Array.from({ length: i + 1 }, (_, k) => k), {
        overwrite: j + 1,
        description: bn ? `${key} বসাও ইনডেক্স ${j + 1}-এ` : `Insert ${key} at index ${j + 1}`,
        codeLine: 4,
      })
    );
  }
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 5,
    })
  );
  return { steps, comparisons, swaps };
}

export function mergeSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push(
    snapshot(arr, [], { description: bn ? "মার্জ সর্ট শুরু" : "Starting Merge Sort", codeLine: 0 })
  );

  function merge(l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0;
    let j = 0;
    let k = l;
    steps.push(
      snapshot(arr, [], {
        description: bn ? `[${l}..${m}] ও [${m + 1}..${r}] জোড়া দাও` : `Merging [${l}..${m}] and [${m + 1}..${r}]`,
        codeLine: 1,
      })
    );
    while (i < left.length && j < right.length) {
      comparisons++;
      steps.push(
        snapshot(arr, [], {
          compare: [l + i, m + 1 + j],
          description: bn ? `${left[i]} ও ${right[j]} তুলনা` : `Compare ${left[i]} and ${right[j]}`,
          codeLine: 2,
        })
      );
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      swaps++;
      steps.push(
        snapshot(arr, [], {
          overwrite: k,
          description: bn ? `${arr[k]} বসাও ইনডেক্স ${k}-এ` : `Place ${arr[k]} at index ${k}`,
          codeLine: 3,
        })
      );
      k++;
    }
    while (i < left.length) {
      arr[k] = left[i];
      steps.push(
        snapshot(arr, [], {
          overwrite: k,
          description: bn ? `বাকি ${left[i]} কপি করো ইনডেক্স ${k}-এ` : `Copy remaining ${left[i]} to index ${k}`,
          codeLine: 4,
        })
      );
      i++;
      k++;
    }
    while (j < right.length) {
      arr[k] = right[j];
      steps.push(
        snapshot(arr, [], {
          overwrite: k,
          description: bn ? `বাকি ${right[j]} কপি করো ইনডেক্স ${k}-এ` : `Copy remaining ${right[j]} to index ${k}`,
          codeLine: 4,
        })
      );
      j++;
      k++;
    }
  }

  function sort(l: number, r: number) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }

  sort(0, arr.length - 1);
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 5,
    })
  );
  return { steps, comparisons, swaps };
}

export function quickSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push(
    snapshot(arr, [], { description: bn ? "কুইক সর্ট শুরু" : "Starting Quick Sort", codeLine: 0 })
  );

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    steps.push(
      snapshot(arr, [], {
        compare: [high, high],
        description: bn ? `Pivot = ${pivot} (ইনডেক্স ${high})` : `Pivot = ${pivot} at index ${high}`,
        codeLine: 1,
      })
    );
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push(
        snapshot(arr, [], {
          compare: [j, high],
          description: bn ? `${arr[j]} বনাম pivot ${pivot}` : `Compare ${arr[j]} with pivot ${pivot}`,
          codeLine: 2,
        })
      );
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        steps.push(
          snapshot(arr, [], {
            swap: [i, j],
            description: bn ? `${arr[j]} ও ${arr[i]} অদলবদল` : `Swap ${arr[j]} and ${arr[i]}`,
            codeLine: 3,
          })
        );
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    steps.push(
      snapshot(arr, [i + 1], {
        swap: [i + 1, high],
        description: bn ? `pivot ${pivot} বসাও ইনডেক্স ${i + 1}-এ` : `Place pivot ${pivot} at index ${i + 1}`,
        codeLine: 4,
      })
    );
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      steps.push(
        snapshot(arr, [low], {
          description: bn ? `একক ${arr[low]} সাজানো` : `Single element ${arr[low]} sorted`,
          codeLine: 5,
        })
      );
    }
  }

  sort(0, arr.length - 1);
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 6,
    })
  );
  return { steps, comparisons, swaps };
}

export function heapSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;
  const sorted: number[] = [];
  steps.push(
    snapshot(arr, [], {
      description: bn ? "ম্যাক্স-হিপ বানাও" : "Build a max-heap",
      codeLine: 0,
    })
  );

  function siftDown(i0: number, size: number) {
    let i = i0;
    for (;;) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < size) {
        comparisons++;
        steps.push(
          snapshot(arr, [...sorted], {
            compare: [i, l],
            description: bn
              ? `${arr[i]} বনাম বাম ${arr[l]}`
              : `${arr[i]} vs left child ${arr[l]}`,
            codeLine: 2,
          })
        );
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < size) {
        comparisons++;
        steps.push(
          snapshot(arr, [...sorted], {
            compare: [largest, r],
            description: bn ? `বনাম ডান ${arr[r]}` : `vs right child ${arr[r]}`,
            codeLine: 2,
          })
        );
        if (arr[r] > arr[largest]) largest = r;
      }
      if (largest === i) break;
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      swaps++;
      steps.push(
        snapshot(arr, [...sorted], {
          swap: [i, largest],
          description: bn
            ? `${arr[largest]} ও ${arr[i]} বদলাও`
            : `Swap ${arr[largest]} and ${arr[i]}`,
          codeLine: 2,
        })
      );
      i = largest;
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push(
      snapshot(arr, [], {
        description: bn ? `heapify নোড ${i}` : `Heapify node ${i}`,
        codeLine: 0,
      })
    );
    siftDown(i, n);
  }
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    swaps++;
    sorted.push(end);
    steps.push(
      snapshot(arr, [...sorted], {
        swap: [0, end],
        description: bn
          ? `রুট ${arr[end]} চূড়ান্ত @${end}`
          : `Root ${arr[end]} final @${end}`,
        codeLine: 1,
      })
    );
    siftDown(0, end);
  }
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 4,
    })
  );
  return { steps, comparisons, swaps };
}

export function countingSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let swaps = 0;
  const comparisons = 0;
  const max = Math.max(...arr);
  const count = Array(max + 1).fill(0);
  const snapCount = () =>
    count
      .map((c, v) => (c > 0 ? `${v}×${c}` : ""))
      .filter(Boolean)
      .join(" ");
  steps.push(
    snapshot(arr, [], {
      description: bn ? `গণনা শুরু (0..${max})` : `Count frequencies (0..${max})`,
      codeLine: 0,
    })
  );
  arr.forEach((x, i) => {
    count[x]++;
    steps.push(
      snapshot(arr, [], {
        compare: [i, i],
        description: `count[${x}] = ${count[x]}  {${snapCount()}}`,
        codeLine: 0,
      })
    );
  });
  let idx = 0;
  for (let v = 0; v <= max; v++) {
    while (count[v] > 0) {
      arr[idx] = v;
      swaps++;
      count[v]--;
      steps.push(
        snapshot(arr, [], {
          overwrite: idx,
          description: bn ? `${v} বসাও @${idx}` : `Write ${v} at ${idx}`,
          codeLine: 2,
        })
      );
      idx++;
    }
  }
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 3,
    })
  );
  return { steps, comparisons, swaps };
}

export function radixSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let swaps = 0;
  const comparisons = 0;
  const max = Math.max(...arr);
  steps.push(
    snapshot(arr, [], {
      description: bn ? "LSD র‍্যাডিক্স সর্ট" : "LSD radix sort",
      codeLine: 0,
    })
  );
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const count = Array(10).fill(0);
    arr.forEach((x) => count[Math.floor(x / exp) % 10]++);
    steps.push(
      snapshot(arr, [], {
        description: bn
          ? `অঙ্ক ${exp}-এর ঘর: গণনা`
          : `Digit place ${exp}: count digits`,
        codeLine: 1,
      })
    );
    const pos = Array(10).fill(0);
    for (let d = 1; d < 10; d++) pos[d] = pos[d - 1] + count[d - 1];
    const cur = [...pos];
    const out = Array(arr.length).fill(0);
    arr.forEach((x, i) => {
      const d = Math.floor(x / exp) % 10;
      out[cur[d]] = x;
      swaps++;
      cur[d]++;
      steps.push(
        snapshot(arr, [], {
          compare: [i, i],
          description: bn ? `${x} → অঙ্ক ${d}` : `${x} → digit ${d}`,
          codeLine: 1,
        })
      );
    });
    for (let i = 0; i < arr.length; i++) {
      arr[i] = out[i];
      steps.push(
        snapshot(arr, [], {
          overwrite: i,
          description: bn
            ? `${out[i]} বসাও @${i} (ঘর ${exp})`
            : `Write ${out[i]} at ${i} (place ${exp})`,
          codeLine: 2,
        })
      );
    }
  }
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 3,
    })
  );
  return { steps, comparisons, swaps };
}

export function bucketSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];
  let swaps = 0;
  const comparisons = 0;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const buckets: number[][] = Array.from({ length: n }, () => []);
  steps.push(
    snapshot(arr, [], {
      description: bn ? `${n}টা বালতি বানাও` : `Make ${n} buckets`,
      codeLine: 0,
    })
  );
  arr.forEach((x, i) => {
    const b =
      max === min
        ? 0
        : Math.min(n - 1, Math.floor(((x - min) / (max - min + 1)) * n));
    buckets[b].push(x);
    steps.push(
      snapshot(arr, [], {
        compare: [i, i],
        description: bn
          ? `${x} → বালতি ${b} [${buckets[b].join(",")}]`
          : `${x} → bucket ${b} [${buckets[b].join(",")}]`,
        codeLine: 0,
      })
    );
  });
  buckets.forEach((bk, b) => {
    bk.sort((x, y) => x - y);
    steps.push(
      snapshot(arr, [], {
        description: bn
          ? `বালতি ${b} সাজাও → [${bk.join(",")}]`
          : `Sort bucket ${b} → [${bk.join(",")}]`,
        codeLine: 1,
      })
    );
  });
  let idx = 0;
  buckets.forEach((bk, b) => {
    bk.forEach((x) => {
      arr[idx] = x;
      swaps++;
      steps.push(
        snapshot(arr, [], {
          overwrite: idx,
          description: bn
            ? `বালতি ${b} থেকে ${x} @${idx}`
            : `${x} from bucket ${b} @${idx}`,
          codeLine: 2,
        })
      );
      idx++;
    });
  });
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 3,
    })
  );
  return { steps, comparisons, swaps };
}

export function shellSort(input: number[], lang: Lang = "en"): SortResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;
  steps.push(
    snapshot(arr, [], {
      description: bn ? "শেল সর্ট: gap কমাও" : "Shell sort: shrink the gap",
      codeLine: 0,
    })
  );
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(
      snapshot(arr, [], {
        description: bn
          ? `gap = ${gap} — দূরত্বের insertion`
          : `gap = ${gap} — gapped insertion`,
        codeLine: 1,
      })
    );
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      comparisons++;
      steps.push(
        snapshot(arr, [], {
          compare: [i, i],
          description: bn
            ? `key ${temp} @${i}, gap ${gap}`
            : `key ${temp} at ${i}, gap ${gap}`,
          codeLine: 1,
        })
      );
      while (j >= gap && arr[j - gap] > temp) {
        comparisons++;
        arr[j] = arr[j - gap];
        swaps++;
        steps.push(
          snapshot(arr, [], {
            overwrite: j,
            description: bn
              ? `${arr[j]} সরাও → ${j}`
              : `Shift ${arr[j]} → ${j}`,
            codeLine: 2,
          })
        );
        j -= gap;
      }
      arr[j] = temp;
      steps.push(
        snapshot(arr, [], {
          overwrite: j,
          description: bn ? `${temp} বসাও @${j}` : `Place ${temp} at ${j}`,
          codeLine: 2,
        })
      );
    }
  }
  steps.push(
    snapshot(arr, arr.map((_, i) => i), {
      description: bn ? "অ্যারে সাজানো!" : "Array sorted!",
      codeLine: 3,
    })
  );
  return { steps, comparisons, swaps };
}

export const SORT_PSEUDOCODE: Record<string, string[]> = {
  bubble: [
    "for i in 0..n-1:",
    "  for j in 0..n-1-i:",
    "    if a[j] > a[j+1]:",
    "      swap a[j], a[j+1]",
    "  mark position n-1-i sorted",
    "done — array sorted",
  ],
  selection: [
    "for i in 0..n-1:",
    "  min = i; for j in i+1..n-1:",
    "    if a[j] < a[min]:",
    "      min = j",
    "  swap a[i], a[min]; mark i sorted",
  ],
  insertion: [
    "mark a[0] sorted",
    "for i in 1..n-1: key = a[i]",
    "  while j>=0 and a[j] > key:",
    "    shift a[j] right; j--",
    "  insert key at j+1",
    "done — array sorted",
  ],
  merge: [
    "divide array mid = (l+r)/2",
    "sort left, sort right",
    "  compare left[i], right[j]",
    "  place smaller at k",
    "  copy remaining elements",
    "done — array sorted",
  ],
  quick: [
    "choose pivot = a[high]",
    "pivot = a[high]",
    "  for j: if a[j] < pivot:",
    "    swap a[i], a[j]; i++",
    "  place pivot at i+1",
    "single element → sorted",
    "done — array sorted",
  ],
  heap: [
    "build max-heap (heapify)",
    "swap root ↔ last, shrink",
    "  sift down new root",
    "repeat — suffix sorted",
    "done — array sorted",
  ],
  counting: [
    "count frequencies of each value",
    "for v in 0..k: repeat count[v] times",
    "  write v into array",
    "done — array sorted",
  ],
  radix: [
    "for digit exp = 1, 10, …:",
    "  counting sort by digit",
    "  write back stable",
    "done — array sorted",
  ],
  bucket: [
    "scatter into n buckets",
    "sort each bucket",
    "gather bucket by bucket",
    "done — array sorted",
  ],
  shell: [
    "gap = n/2, /2 … 1",
    "gapped insertion per gap",
    "gap 1 = plain insertion",
    "done — array sorted",
  ],
};

export function getSortResult(
  id: string,
  arr: number[],
  lang: Lang = "en"
): SortResult {
  switch (id) {
    case "bubble":
      return bubbleSort(arr, lang);
    case "selection":
      return selectionSort(arr, lang);
    case "insertion":
      return insertionSort(arr, lang);
    case "merge":
      return mergeSort(arr, lang);
    case "quick":
      return quickSort(arr, lang);
    case "heap":
      return heapSort(arr, lang);
    case "counting":
      return countingSort(arr, lang);
    case "radix":
      return radixSort(arr, lang);
    case "bucket":
      return bucketSort(arr, lang);
    case "shell":
      return shellSort(arr, lang);
    default:
      return bubbleSort(arr, lang);
  }
}
