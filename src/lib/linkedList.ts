import type { Lang } from "./dict";

export type LLMode = "singly" | "reverse" | "cycle";

export type LLStep = {
  vals: number[];
  next: (number | null)[];
  head: number | null;
  hi?: number[];
  labels?: Record<number, string>;
  verdict?: boolean | null;
  desc: string;
  codeLine: number;
};

export type LLResult = {
  steps: LLStep[];
  finalVals: number[];
  finalNext: (number | null)[];
  verdict?: boolean;
};

function snap(
  vals: number[],
  next: (number | null)[],
  head: number | null,
  extra: Partial<LLStep> = {}
): LLStep {
  return {
    vals: [...vals],
    next: [...next],
    head,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

function chainNext(n: number): (number | null)[] {
  return Array.from({ length: n }, (_, i) => (i + 1 < n ? i + 1 : null));
}

// ---------- singly ops (array-backed: links always i -> i+1) ----------
export function llInsert(
  vals: number[],
  index: number,
  v: number,
  lang: Lang = "en"
): LLResult {
  const bn = lang === "bn";
  const n = vals.length;
  const arr = [...vals, -1]; // scratch slot at the end
  const steps: LLStep[] = [
    snap([...vals], chainNext(n), n > 0 ? 0 : null, {
      hi: index < n ? [index] : [],
      desc: bn
        ? `${v} বসাও ইনডেক্স ${index}-এ — ডানেরগুলো একটা একটা করে সরাও`
        : `Insert ${v} at ${index} — shift right one by one`,
      codeLine: 0,
    }),
  ];
  for (let i = n - 1; i >= index; i--) {
    arr[i + 1] = arr[i];
    steps.push(
      snap(arr, chainNext(n + 1), 0, {
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
    snap(arr, chainNext(n + 1), 0, {
      hi: [index],
      desc: bn ? `${v} বসলো — লিংক জোড়া লাগলো` : `${v} placed — links rewired`,
      codeLine: 1,
    })
  );
  return { steps, finalVals: arr, finalNext: chainNext(n + 1) };
}

export function llDelete(vals: number[], index: number, lang: Lang = "en"): LLResult {
  const bn = lang === "bn";
  const n = vals.length;
  const arr = [...vals];
  const steps: LLStep[] = [
    snap(arr, chainNext(n), 0, {
      hi: [index],
      desc: bn
        ? `a[${index}] (${arr[index]}) বাদ — বামেরগুলো একটা একটা করে টানো`
        : `Drop a[${index}] (${arr[index]}) — pull left one by one`,
      codeLine: 2,
    }),
  ];
  for (let i = index + 1; i < n; i++) {
    arr[i - 1] = arr[i];
    steps.push(
      snap(arr, chainNext(n), 0, {
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
    snap(arr, chainNext(n), n > 1 ? 0 : null, {
      hi: [n - 1],
      desc: bn ? "শেষ ঘর খালি — মুছে গেছে" : "Last slot freed — deleted",
      codeLine: 3,
    })
  );
  const final = arr.slice(0, n - 1);
  return { steps, finalVals: final, finalNext: chainNext(n - 1) };
}

// ---------- reverse (pointer flips on fixed slots) ----------
export function llReverse(input: number[], lang: Lang = "en"): LLResult {
  const bn = lang === "bn";
  const vals = [...input];
  const n = vals.length;
  const next: (number | null)[] = chainNext(n);
  const steps: LLStep[] = [
    snap(vals, next, n > 0 ? 0 : null, {
      labels: n > 0 ? { 0: "curr" } : {},
      desc: bn ? "prev = null, curr = head" : "prev = null, curr = head",
      codeLine: 0,
    }),
  ];
  let prev: number | null = null;
  let curr: number | null = n > 0 ? 0 : null;
  while (curr !== null) {
    const nxt: number | null = next[curr];
    next[curr] = prev;
    const labels: Record<number, string> = { [curr]: "curr" };
    if (prev !== null) labels[prev] = "prev";
    if (nxt !== null) labels[nxt] = "next";
    steps.push(
      snap(vals, next, curr, {
        hi: [curr],
        labels,
        desc: bn
          ? `লিংক উল্টাও: ${curr} → ${prev === null ? "null" : prev}`
          : `Flip link: ${curr} → ${prev === null ? "null" : prev}`,
        codeLine: 1,
      })
    );
    prev = curr;
    curr = nxt;
    if (curr !== null) {
      const labels2: Record<number, string> = { [curr]: "curr" };
      if (prev !== null) labels2[prev] = "prev";
      steps.push(
        snap(vals, next, prev, {
          labels: labels2,
          desc: bn ? `এগিয়ে যাও: prev=${prev}, curr=${curr}` : `Advance: prev=${prev}, curr=${curr}`,
          codeLine: 2,
        })
      );
    }
  }
  steps.push(
    snap(vals, next, prev, {
      desc: bn ? `head = ${prev} — রিভার্সড!` : `head = ${prev} — reversed!`,
      codeLine: 3,
    })
  );
  return { steps, finalVals: vals, finalNext: next };
}

// ---------- Floyd cycle detection ----------
export function llCycle(
  vals: number[],
  cycleAt: number,
  lang: Lang = "en"
): LLResult {
  const bn = lang === "bn";
  const n = vals.length;
  const next: (number | null)[] = chainNext(n);
  if (cycleAt >= 0 && cycleAt < n && n > 0) next[n - 1] = cycleAt;
  const hasCycle = cycleAt >= 0 && cycleAt < n && n > 0;
  const steps: LLStep[] = [
    snap(vals, next, n > 0 ? 0 : null, {
      labels: n > 0 ? { 0: "S·F" } : {},
      desc: bn
        ? hasCycle
          ? `slow = fast = head — tail → ${cycleAt} এ বাঁধা`
          : "slow = fast = head — সাইকেল নেই"
        : hasCycle
          ? `slow = fast = head — tail wired to ${cycleAt}`
          : "slow = fast = head — no cycle wired",
      codeLine: 0,
    }),
  ];
  if (n === 0) {
    steps.push(
      snap(vals, next, null, {
        verdict: false,
        desc: bn ? "খালি লিস্ট — সাইকেল নেই" : "Empty list — no cycle",
        codeLine: 3,
      })
    );
    return { steps, finalVals: vals, finalNext: next, verdict: false };
  }
  let slow = 0;
  let fast = 0;
  let guard = 0;
  for (;;) {
    if (fast === null || next[fast] === null) {
      steps.push(
        snap(vals, next, 0, {
          hi: [slow, fast],
          labels: { [slow]: "S", [fast]: "F" },
          verdict: false,
          desc: bn ? "fast null-এ পৌঁছেছে — সাইকেল নেই" : "fast hit null — no cycle",
          codeLine: 3,
        })
      );
      return { steps, finalVals: vals, finalNext: next, verdict: false };
    }
    slow = next[slow] as number;
    fast = next[next[fast] as number] as number;
    guard++;
    if (slow === fast) {
      steps.push(
        snap(vals, next, 0, {
          hi: [slow],
          labels: { [slow]: "MEET" },
          verdict: true,
          desc: bn ? `${slow}-এ দেখা — সাইকেল আছে!` : `Met at ${slow} — cycle!`,
          codeLine: 2,
        })
      );
      return { steps, finalVals: vals, finalNext: next, verdict: true };
    }
    steps.push(
      snap(vals, next, 0, {
        hi: [slow, fast],
        labels: { [slow]: "S", [fast]: "F" },
        desc: bn
          ? `slow → ${slow}, fast → ${fast}`
          : `slow → ${slow}, fast → ${fast}`,
        codeLine: 1,
      })
    );
    if (guard > 3 * n + 5) break;
  }
  return { steps, finalVals: vals, finalNext: next, verdict: false };
}

export const LL_CODE: Record<string, string[]> = {
  singly: [
    "insert: shift right, wire links",
    "  new node points where old did",
    "delete: bypass the node",
    "GC reclaims it",
  ],
  reverse: [
    "prev = null, curr = head",
    "nxt = curr.next; curr.next = prev",
    "prev, curr advance",
    "head = prev",
  ],
  cycle: [
    "slow = fast = head",
    "slow += 1, fast += 2",
    "meet → cycle",
    "fast hits null → acyclic",
  ],
};

export function randomLL(n: number): number[] {
  const s = new Set<number>();
  while (s.size < n) s.add(1 + Math.floor(Math.random() * 29));
  return [...s];
}
