import type { Lang } from "./dict";

// ---------- doubly / circular ----------
export type DLStep = {
  vals: number[];
  head: number | null;
  tail: number | null;
  circular: boolean;
  hi?: number[];
  desc: string;
  codeLine: number;
};

export type DLResult = {
  steps: DLStep[];
  finalVals: number[];
};

function dlSnap(
  vals: number[],
  circular: boolean,
  extra: Partial<DLStep> = {}
): DLStep {
  return {
    vals: [...vals],
    head: vals.length > 0 ? 0 : null,
    tail: vals.length > 0 ? vals.length - 1 : null,
    circular,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function dlInsert(
  vals: number[],
  index: number,
  v: number,
  circular: boolean,
  lang: Lang = "en"
): DLResult {
  const bn = lang === "bn";
  const n = vals.length;
  const arr = [...vals, -1]; // scratch slot at the end
  const steps: DLStep[] = [
    dlSnap([...vals], circular, {
      hi: index < n ? [index] : [],
      desc: bn
        ? `${v} বসাও ${index}-এ — একটা একটা করে সরাও`
        : `Insert ${v} at ${index} — shift one by one`,
      codeLine: 0,
    }),
  ];
  for (let i = n - 1; i >= index; i--) {
    arr[i + 1] = arr[i];
    steps.push(
      dlSnap(arr, circular, {
        hi: [i, i + 1],
        desc: bn
          ? `a[${i}] (${arr[i + 1]}) সরলো → ${i + 1}`
          : `a[${i}] (${arr[i + 1]}) slides → ${i + 1}`,
        codeLine: 0,
      })
    );
  }
  arr[index] = v;
  steps.push(
    dlSnap(arr, circular, {
      hi: [index],
      desc: bn
        ? `${v} বসলো — prev/next দুটোই জোড়া${circular ? " (গোল)" : ""}`
        : `${v} placed — prev & next wired${circular ? " (circular)" : ""}`,
      codeLine: 1,
    })
  );
  return { steps, finalVals: arr };
}

export function dlDelete(
  vals: number[],
  index: number,
  circular: boolean,
  lang: Lang = "en"
): DLResult {
  const bn = lang === "bn";
  const n = vals.length;
  const arr = [...vals];
  const steps: DLStep[] = [
    dlSnap(arr, circular, {
      hi: [index],
      desc: bn
        ? `a[${index}] (${arr[index]}) বাদ — বামেরগুলো টানো`
        : `Drop a[${index}] (${arr[index]}) — pull left one by one`,
      codeLine: 2,
    }),
  ];
  for (let i = index + 1; i < n; i++) {
    arr[i - 1] = arr[i];
    steps.push(
      dlSnap(arr, circular, {
        hi: [i - 1, i],
        desc: bn
          ? `a[${i}] (${arr[i - 1]}) টানলো → ${i - 1}`
          : `a[${i}] (${arr[i - 1]}) pulls → ${i - 1}`,
        codeLine: 2,
      })
    );
  }
  arr[n - 1] = -1; // freed slot
  steps.push(
    dlSnap(arr, circular, {
      hi: [n - 1],
      desc: bn ? "শেষ ঘর খালি — মুছে গেছে" : "Last slot freed — deleted",
      codeLine: 2,
    })
  );
  const final = arr.slice(0, n - 1);
  return { steps, finalVals: final };
}

export const DL_CODE = [
  "insert: neighbors point both ways",
  "  node.prev/next wired",
  "delete: neighbors join each other",
  "circular: tail.next = head",
];

// ---------- merge two sorted ----------
export type MStep = {
  a: number[];
  b: number[];
  ai: number;
  bi: number;
  result: number[];
  take?: "a" | "b";
  desc: string;
  codeLine: number;
};

export type MResult = {
  steps: MStep[];
  merged: number[];
  comparisons: number;
};

export function mergeTrace(aIn: number[], bIn: number[], lang: Lang = "en"): MResult {
  const bn = lang === "bn";
  const a = [...aIn].sort((x, y) => x - y);
  const b = [...bIn].sort((x, y) => x - y);
  const result: number[] = [];
  const steps: MStep[] = [
    {
      a,
      b,
      ai: 0,
      bi: 0,
      result: [],
      desc: bn ? "দুই সাজানো লিস্ট — ছোট মাথা নাও" : "Two sorted lists — take the smaller head",
      codeLine: 0,
    },
  ];
  let comparisons = 0;
  let ai = 0;
  let bi = 0;
  while (ai < a.length && bi < b.length) {
    comparisons++;
    if (a[ai] <= b[bi]) {
      result.push(a[ai]);
      steps.push({
        a,
        b,
        ai,
        bi,
        result: [...result],
        take: "a",
        desc: bn ? `${a[ai]} ≤ ${b[bi]} — A থেকে নাও` : `${a[ai]} ≤ ${b[bi]} — take from A`,
        codeLine: 1,
      });
      ai++;
    } else {
      result.push(b[bi]);
      steps.push({
        a,
        b,
        ai,
        bi,
        result: [...result],
        take: "b",
        desc: bn ? `${b[bi]} < ${a[ai]} — B থেকে নাও` : `${b[bi]} < ${a[ai]} — take from B`,
        codeLine: 1,
      });
      bi++;
    }
  }
  while (ai < a.length) {
    result.push(a[ai]);
    steps.push({
      a,
      b,
      ai,
      bi,
      result: [...result],
      take: "a",
      desc: bn ? `B শেষ — A-এর বাকি ঢালো (${a[ai]})` : `B exhausted — drain A (${a[ai]})`,
      codeLine: 2,
    });
    ai++;
  }
  while (bi < b.length) {
    result.push(b[bi]);
    steps.push({
      a,
      b,
      ai,
      bi,
      result: [...result],
      take: "b",
      desc: bn ? `A শেষ — B-এর বাকি ঢালো (${b[bi]})` : `A exhausted — drain B (${b[bi]})`,
      codeLine: 2,
    });
    bi++;
  }
  steps.push({
    a,
    b,
    ai: a.length,
    bi: b.length,
    result: [...result],
    desc: bn ? `জোড়া সম্পূর্ণ: [${result.join(", ")}]` : `Merged: [${result.join(", ")}]`,
    codeLine: 3,
  });
  return { steps, merged: result, comparisons };
}

export const MERGE_CODE = [
  "dummy head, tail follows",
  "take smaller of a[ai], b[bi]",
  "drain whichever remains",
  "done — one sorted list",
];

// ---------- middle & nth from end ----------
export type MNMode = "middle" | "nth";

export type MNStep = {
  array: number[];
  slow: number;
  fast: number;
  lead?: number;
  found?: number;
  removed?: boolean;
  desc: string;
  codeLine: number;
};

export type MNResult = {
  steps: MNStep[];
  answer: number;
  final: number[];
};

export function middleTrace(input: number[], lang: Lang = "en"): MNResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: MNStep[] = [
    {
      array: arr,
      slow: 0,
      fast: 0,
      desc: bn ? "slow = fast = head — fast দ্বিগুণ দৌড়ায়" : "slow = fast = head — fast runs double",
      codeLine: 0,
    },
  ];
  let slow = 0;
  let fast = 0;
  while (fast < arr.length - 1 && fast + 1 < arr.length) {
    slow++;
    fast += 2;
    if (fast >= arr.length) fast = arr.length - 1;
    steps.push({
      array: arr,
      slow,
      fast: Math.min(fast, arr.length - 1),
      desc: bn
        ? `slow → ${slow}, fast → ${Math.min(fast, arr.length - 1)}`
        : `slow → ${slow}, fast → ${Math.min(fast, arr.length - 1)}`,
      codeLine: 1,
    });
    if (fast >= arr.length - 1) break;
  }
  steps.push({
    array: arr,
    slow,
    fast: arr.length - 1,
    found: slow,
    desc: bn
      ? `fast শেষে — মাঝখান a[${slow}] = ${arr[slow]}`
      : `fast reached the end — middle is a[${slow}] = ${arr[slow]}`,
    codeLine: 2,
  });
  return { steps, answer: slow, final: arr };
}

export function nthTrace(input: number[], n: number, lang: Lang = "en"): MNResult {
  const bn = lang === "bn";
  const arr = [...input];
  const steps: MNStep[] = [
    {
      array: arr,
      slow: 0,
      fast: 0,
      lead: 0,
      desc: bn
        ? `lead ${n} ঘর এগিয়ে যাবে, তারপর দুজন একসাথে`
        : `Lead runs ${n} ahead, then both walk together`,
      codeLine: 0,
    },
  ];
  let lead = 0;
  for (let k = 0; k < n && lead < arr.length; k++) {
    lead++;
    steps.push({
      array: arr,
      slow: 0,
      fast: lead,
      lead,
      desc: bn ? `lead → ${lead} (${k + 1}/${n})` : `lead → ${lead} (${k + 1}/${n})`,
      codeLine: 1,
    });
  }
  let slow = 0;
  while (lead < arr.length) {
    lead++;
    slow++;
    steps.push({
      array: arr,
      slow,
      fast: Math.min(lead, arr.length - 1),
      lead: Math.min(lead, arr.length - 1),
      desc: bn ? `দুজনেই এগোও: slow=${slow}` : `Both advance: slow=${slow}`,
      codeLine: 2,
    });
  }
  const target = slow;
  const removed = arr[target];
  const final = arr.filter((_, i) => i !== target);
  steps.push({
    array: arr,
    slow: target,
    fast: arr.length - 1,
    lead: arr.length - 1,
    found: target,
    desc: bn
      ? `শেষ থেকে ${n}তম: a[${target}] = ${removed}`
      : `Nth(${n}) from end: a[${target}] = ${removed}`,
    codeLine: 3,
  });
  steps.push({
    array: final,
    slow: -1,
    fast: -1,
    removed: true,
    desc: bn ? `${removed} বাদ — লিস্ট জোড়া লাগলো` : `${removed} removed — list rejoined`,
    codeLine: 3,
  });
  return { steps, answer: target, final };
}

export const MN_CODE: Record<MNMode, string[]> = {
  middle: [
    "slow = fast = head",
    "slow += 1, fast += 2",
    "fast at end → slow is middle",
  ],
  nth: [
    "lead runs n ahead first",
    "then slow + lead walk together",
    "lead at end → slow is target",
    "bypass it",
  ],
};

export function randomLL2(n: number): number[] {
  const s = new Set<number>();
  while (s.size < n) s.add(1 + Math.floor(Math.random() * 29));
  return [...s].sort((a, b) => a - b);
}
