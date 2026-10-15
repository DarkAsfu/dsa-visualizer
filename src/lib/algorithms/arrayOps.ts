import type { Lang } from "../dict";

export type ArrayOpId = "insert" | "delete" | "rotate" | "reverse";

export type ArrayStep = {
  array: number[];
  highlight?: number[];
  moving?: number;
  placed?: number;
  desc: string;
  codeLine: number;
};

export type ArrayOpResult = {
  steps: ArrayStep[];
  writes: number;
  final: number[];
};

function snap(array: number[], extra: Partial<ArrayStep> = {}): ArrayStep {
  return { array: [...array], desc: "", codeLine: 0, ...extra };
}

export function insertOp(input: number[], index: number, value: number, lang: Lang = "en"): ArrayOpResult {
  const bn = lang === "bn";
  const arr = [...input, 0];
  const n = input.length;
  const steps: ArrayStep[] = [
    snap(arr.slice(0, n), { highlight: [index], desc: bn ? `${value} বসাও ইনডেক্স ${index}-এ — আগে ডানে সরাও` : `Insert ${value} at index ${index} — shift right first`, codeLine: 0 }),
  ];
  let writes = 0;
  for (let i = n - 1; i >= index; i--) {
    arr[i + 1] = arr[i];
    writes++;
    steps.push(
      snap(arr, { highlight: [i, i + 1], moving: i + 1, desc: bn ? `a[${i}] (${arr[i + 1]}) সরাও → ${i + 1}` : `shift a[${i}] (${arr[i + 1]}) → position ${i + 1}`, codeLine: 2 })
    );
  }
  arr[index] = value;
  writes++;
  steps.push(
    snap(arr, { placed: index, desc: bn ? `${value} বসানো হলো ইনডেক্স ${index}-এ` : `place ${value} at index ${index}`, codeLine: 3 })
  );
  return { steps, writes, final: arr };
}

export function deleteOp(input: number[], index: number, lang: Lang = "en"): ArrayOpResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  const steps: ArrayStep[] = [
    snap(arr, { highlight: [index], desc: bn ? `a[${index}] (${arr[index]}) মুছো — বামে সরিয়ে ভরো` : `Delete a[${index}] (${arr[index]}) — shift left to fill`, codeLine: 0 }),
  ];
  let writes = 0;
  for (let i = index + 1; i < n; i++) {
    arr[i - 1] = arr[i];
    writes++;
    steps.push(
      snap(arr, { highlight: [i - 1, i], moving: i - 1, desc: bn ? `a[${i}] (${arr[i - 1]}) সরাও → ${i - 1}` : `shift a[${i}] (${arr[i - 1]}) → position ${i - 1}`, codeLine: 2 })
    );
  }
  const final = arr.slice(0, n - 1);
  steps.push(
    snap(final, { desc: bn ? `শেষ ঘর বাদ — সাইজ ${n} → ${n - 1}` : `drop last slot — size ${n} → ${n - 1}`, codeLine: 3 })
  );
  return { steps, writes, final };
}

export function rotateOp(input: number[], k: number, dir: "right" | "left", lang: Lang = "en"): ArrayOpResult {
  const bn = lang === "bn";
  const arr = [...input];
  const n = arr.length;
  const steps: ArrayStep[] = [
    snap(arr, { desc: bn ? `${dir === "right" ? "ডানে" : "বামে"} ${k} ঘোরাও (n=${n})` : `Rotate ${dir} by ${k} (n=${n})`, codeLine: 0 }),
  ];
  let writes = 0;
  const times = n === 0 ? 0 : ((k % n) + n) % n;
  for (let t = 0; t < times; t++) {
    if (dir === "right") {
      const last = arr[arr.length - 1];
      steps.push(
        snap(arr, { highlight: [arr.length - 1], moving: arr.length - 1, desc: bn ? `শেষ থেকে ${last} তোলো` : `pick up ${last} from the end`, codeLine: 2 })
      );
      arr.unshift(arr.pop()!);
      writes += n;
      steps.push(
        snap(arr, { placed: 0, desc: bn ? `${last} সামনে বসাও (${t + 1}/${times})` : `drop ${last} at front (${t + 1}/${times})`, codeLine: 2 })
      );
    } else {
      const first = arr[0];
      steps.push(
        snap(arr, { highlight: [0], moving: 0, desc: bn ? `সামনে থেকে ${first} তোলো` : `pick up ${first} from the front`, codeLine: 3 })
      );
      arr.push(arr.shift()!);
      writes += n;
      steps.push(
        snap(arr, { placed: arr.length - 1, desc: bn ? `${first} পেছনে বসাও (${t + 1}/${times})` : `drop ${first} at back (${t + 1}/${times})`, codeLine: 3 })
      );
    }
  }
  if (times === 0) {
    steps.push(snap(arr, { desc: bn ? `k % n == 0 — অ্যারে একই` : `k % n == 0 — array unchanged`, codeLine: 0 }));
  }
  return { steps, writes, final: arr };
}

export function reverseOp(input: number[], lang: Lang = "en"): ArrayOpResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: ArrayStep[] = [
    snap(arr, { highlight: [0, arr.length - 1], desc: bn ? `দুই পয়েন্টারে রিভার্স l=0, r=${arr.length - 1}` : `Reverse with two pointers l=0, r=${arr.length - 1}`, codeLine: 0 }),
  ];
  let writes = 0;
  let l = 0;
  let r = arr.length - 1;
  while (l < r) {
    steps.push(
      snap(arr, { highlight: [l, r], desc: bn ? `বদলাও a[${l}] (${arr[l]}) ↔ a[${r}] (${arr[r]})` : `swap a[${l}] (${arr[l]}) ↔ a[${r}] (${arr[r]})`, codeLine: 2 })
    );
    [arr[l], arr[r]] = [arr[r], arr[l]];
    writes += 2;
    steps.push(
      snap(arr, { highlight: [l, r], desc: bn ? `বদলানো শেষ — l=${l + 1}, r=${r - 1}` : `swapped — l=${l + 1}, r=${r - 1}`, codeLine: 2 })
    );
    l++;
    r--;
  }
  steps.push(snap(arr, { desc: bn ? `পয়েন্টার মিলেছে — রিভার্সড` : `pointers met — reversed`, codeLine: 2 }));
  return { steps, writes, final: arr };
}

export const ARRAY_OP_CODE: Record<ArrayOpId, string[]> = {
  insert: [
    "make room at idx",
    "for i from n-1 down to idx:",
    "  a[i+1] = a[i]",
    "a[idx] = value",
  ],
  delete: [
    "save a[idx]",
    "for i in idx+1..n-1:",
    "  a[i-1] = a[i]",
    "drop last slot",
  ],
  rotate: [
    "k = k % n",
    "repeat k times:",
    "  move last element to front",
    "  (left: move first to back)",
  ],
  reverse: ["l = 0, r = n-1", "while l < r:", "  swap a[l], a[r]; l++, r--"],
};
