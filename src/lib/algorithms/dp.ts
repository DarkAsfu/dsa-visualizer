import type { Lang } from "../dict";

// Shared step model for all DP table traces.
// Each step carries a full matrix snapshot (tables stay small by design),
// the just-written cell, the cells read to compute it, and an optional
// reconstruction path. Mirrors the style of kadaneTrace / floydWarshall.

export type DPCell = number | boolean | null;
export type DPRef = [number, number];

export type DPStep = {
  mat: DPCell[][];
  cell?: DPRef;
  refs?: DPRef[];
  path?: DPRef[];
  desc: string;
  codeLine: number;
};

function snap(mat: DPCell[][]): DPCell[][] {
  return mat.map((r) => [...r]);
}

function fib(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return a;
}

function naiveFibCalls(n: number): number {
  return 2 * fib(n + 1) - 1;
}

// ---------------------------------------------------------------------------
// 1. DP Intro — top-down memoization of fib(n)
// ---------------------------------------------------------------------------

export const DP_INTRO_CODE = [
  "f(n):",
  "  if n ≤ 1: return n",
  "  if memo[n]: return it  # hit",
  "  memo[n] = f(n−1) + f(n−2)",
  "  return memo[n]",
];

export type DpIntroResult = {
  steps: DPStep[];
  calls: number;
  hits: number;
  naive: number;
  answer: number;
};

export function dpIntroTrace(n: number, lang: Lang = "en"): DpIntroResult {
  const bn = lang === "bn";
  const memo: (number | null)[] = Array(n + 1).fill(null);
  const steps: DPStep[] = [];
  let calls = 0;
  let hits = 0;
  const mat = (): DPCell[][] => [[...memo]];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: mat(), cell, refs, desc, codeLine });

  push(undefined, undefined, bn ? `f(${n}) ডাকো — memo খালি` : `call f(${n}) — memo empty`, 0);

  function f(k: number): number {
    calls++;
    if (k <= 1) {
      push([0, k], undefined, bn ? `f(${k}) = ${k} — বেস কেস, হিসাব নেই` : `f(${k}) = ${k} — base case, no work`, 1);
      return k;
    }
    if (memo[k] !== null) {
      hits++;
      push([0, k], undefined, bn ? `f(${k}) memo hit → ${memo[k]} (আবার হিসাব নয়)` : `f(${k}) memo hit → ${memo[k]} (no recompute)`, 2);
      return memo[k] as number;
    }
    push([0, k], undefined, bn ? `f(${k}) miss — ভাঙো f(${k - 1}) + f(${k - 2})` : `f(${k}) miss — split into f(${k - 1}) + f(${k - 2})`, 2);
    const a = f(k - 1);
    const b = f(k - 2);
    memo[k] = a + b;
    push([0, k], [[0, k - 1], [0, k - 2]], bn ? `memo[${k}] = ${a} + ${b} = ${memo[k]} — তুলে রাখো` : `memo[${k}] = ${a} + ${b} = ${memo[k]} — stored`, 3);
    return memo[k] as number;
  }

  const answer = f(n);
  steps.push({
    mat: mat(),
    desc: bn
      ? `শেষ — ${calls} কল, ${hits} hit। naive হলে লাগত ${naiveFibCalls(n)} কল`
      : `done — ${calls} calls, ${hits} hits. naive would need ${naiveFibCalls(n)} calls`,
    codeLine: 4,
  });
  return { steps, calls, hits, naive: naiveFibCalls(n), answer };
}

// ---------------------------------------------------------------------------
// 2. Fibonacci DP — bottom-up tabulation
// ---------------------------------------------------------------------------

export const FIB_CODE = [
  "dp[0] = 0, dp[1] = 1",
  "for i in 2..n:",
  "  dp[i] = dp[i−1] + dp[i−2]",
  "answer = dp[n]",
  "O(n) time · O(n) space",
];

export type FibResult = {
  steps: DPStep[];
  ops: number;
  naive: number;
  answer: number;
};

export function fibTabTrace(n: number, lang: Lang = "en"): FibResult {
  const bn = lang === "bn";
  const dp: (number | null)[] = Array(n + 1).fill(null);
  const steps: DPStep[] = [];
  const mat = (): DPCell[][] => [[...dp]];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: mat(), cell, refs, desc, codeLine });

  dp[0] = 0;
  push([0, 0], undefined, bn ? "dp[0] = 0 — বেস" : "dp[0] = 0 — base", 0);
  if (n >= 1) {
    dp[1] = 1;
    push([0, 1], undefined, bn ? "dp[1] = 1 — বেস" : "dp[1] = 1 — base", 0);
  }
  for (let i = 2; i <= n; i++) {
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
    push(
      [0, i],
      [[0, i - 1], [0, i - 2]],
      bn ? `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}` : `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      2
    );
  }
  const answer = (dp[n] as number) ?? 0;
  push(
    undefined,
    undefined,
    bn ? `শেষ — উত্তর dp[${n}] = ${answer} (${n - 1} যোগ)` : `done — answer dp[${n}] = ${answer} (${n - 1} adds)`,
    3
  );
  return { steps, ops: Math.max(n - 1, 0), naive: naiveFibCalls(n), answer };
}

// ---------------------------------------------------------------------------
// 3. 0/1 Knapsack
// ---------------------------------------------------------------------------

export const KNAP_CODE = [
  "dp[i][w] = best with first i items",
  "for each item i, each cap w:",
  "  skip = dp[i−1][w]",
  "  take = dp[i−1][w−wi] + vi",
  "  dp[i][w] = max(skip, take)",
];

export type KnapItem = { w: number; v: number };

export type KnapResult = {
  steps: DPStep[];
  maxVal: number;
  taken: number[];
  answer: string;
};

export const KNAP_ITEMS: KnapItem[] = [
  { w: 2, v: 3 },
  { w: 3, v: 4 },
  { w: 4, v: 5 },
  { w: 5, v: 6 },
];
export const KNAP_CAP = 8;

export function knapsackTrace(items: KnapItem[], cap: number, lang: Lang = "en"): KnapResult {
  const bn = lang === "bn";
  const m = items.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(cap + 1).fill(0));
  const steps: DPStep[] = [];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: snap(dp), cell, refs, desc, codeLine });

  push(undefined, undefined, bn ? `শুরু — ${m} জিনিস, ধারণক্ষমতা ${cap}` : `start — ${m} items, capacity ${cap}`, 0);
  for (let i = 1; i <= m; i++) {
    const { w: wi, v: vi } = items[i - 1];
    for (let w = 0; w <= cap; w++) {
      const skip = dp[i - 1][w];
      if (w < wi) {
        dp[i][w] = skip;
        push([i, w], [[i - 1, w]], bn ? `জিনিস ${i} (w=${wi}) ঢোকে না — skip ${skip}` : `item ${i} (w=${wi}) won't fit — skip ${skip}`, 2);
      } else {
        const take = dp[i - 1][w - wi] + vi;
        dp[i][w] = Math.max(skip, take);
        const took = take >= skip;
        push(
          [i, w],
          took ? [[i - 1, w], [i - 1, w - wi]] : [[i - 1, w]],
          bn
            ? `skip ${skip} বনাম take ${take} → ${dp[i][w]}${took ? " (নাও ✓)" : " (বাদ)"}`
            : `skip ${skip} vs take ${take} → ${dp[i][w]}${took ? " (take ✓)" : " (skip)"}`,
          took ? 3 : 2
        );
      }
    }
  }
  // reconstruct
  const taken: number[] = [];
  const path: DPRef[] = [];
  let w = cap;
  for (let i = m; i >= 1; i--) {
    path.push([i, w]);
    if (dp[i][w] !== dp[i - 1][w]) {
      taken.push(i - 1);
      w -= items[i - 1].w;
    }
  }
  path.push([0, w]);
  taken.reverse();
  const maxVal = dp[m][cap];
  const list = taken.length === 0 ? "—" : taken.map((i) => `#${i + 1}(w=${items[i].w},v=${items[i].v})`).join(" + ");
  steps.push({
    mat: snap(dp),
    path,
    desc: bn ? `শেষ — সেরা মান ${maxVal}: ${list}` : `done — best value ${maxVal}: ${list || "nothing fits"}`,
    codeLine: 4,
  });
  return { steps, maxVal, taken, answer: String(maxVal) };
}

// ---------------------------------------------------------------------------
// 4. LCS
// ---------------------------------------------------------------------------

export const LCS_CODE = [
  "if A[i]==B[j]: dp = diag + 1",
  "else: dp = max(top, left)",
  "fill row by row",
  "walk back from the corner",
  "answer = collected matches",
];

export type LcsResult = {
  steps: DPStep[];
  length: number;
  lcs: string;
  answer: string;
};

export const LCS_A = "AGGTAB";
export const LCS_B = "GXTXAYB";

export function lcsTrace(a: string, b: string, lang: Lang = "en"): LcsResult {
  const bn = lang === "bn";
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const steps: DPStep[] = [];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: snap(dp), cell, refs, desc, codeLine });

  push(undefined, undefined, bn ? `"${a}" বনাম "${b}" — টেবিল ভরো` : `"${a}" vs "${b}" — fill the table`, 2);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        push([i, j], [[i - 1, j - 1]], bn ? `মিল '${a[i - 1]}' — কর্ণ + 1 = ${dp[i][j]}` : `match '${a[i - 1]}' — diagonal + 1 = ${dp[i][j]}`, 0);
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        push([i, j], [[i - 1, j], [i, j - 1]], bn ? `'${a[i - 1]}'≠'${b[j - 1]}' — max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}` : `'${a[i - 1]}'≠'${b[j - 1]}' — max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`, 1);
      }
    }
  }
  // backtrack
  let i = m;
  let j = n;
  const chars: string[] = [];
  const path: DPRef[] = [[i, j]];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      chars.push(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
    path.push([i, j]);
  }
  chars.reverse();
  const lcs = chars.join("");
  steps.push({
    mat: snap(dp),
    path,
    desc: bn ? `শেষ — LCS "${lcs || "—"}" (দৈর্ঘ্য ${dp[m][n]})` : `done — LCS "${lcs || "—"}" (length ${dp[m][n]})`,
    codeLine: 4,
  });
  return { steps, length: dp[m][n], lcs, answer: lcs || `length ${dp[m][n]}` };
}

// ---------------------------------------------------------------------------
// 5. LIS — O(n²)
// ---------------------------------------------------------------------------

export const LIS_CODE = [
  "dp[i] = 1",
  "for j < i, if a[j] < a[i]:",
  "  dp[i] = max(dp[i], dp[j]+1)",
  "answer = max(dp)",
  "O(n²) time",
];

export type LisResult = {
  steps: DPStep[];
  length: number;
  answer: string;
};

export const LIS_ARR = [3, 1, 4, 1, 5, 9, 2, 6];

export function randomLisArray(n = 8): number[] {
  return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 20));
}

export function lisTrace(arr: number[], lang: Lang = "en"): LisResult {
  const bn = lang === "bn";
  const n = arr.length;
  const dp: (number | null)[] = Array(n).fill(null);
  const steps: DPStep[] = [];
  const mat = (): DPCell[][] => [[...dp]];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: mat(), cell, refs, desc, codeLine });

  push(undefined, undefined, bn ? `শুরু — প্রতিটা dp[i] = 1 (একা দৈর্ঘ্য)` : `start — every dp[i] = 1 (alone)`, 0);
  for (let i = 0; i < n; i++) {
    dp[i] = 1;
    let best = -1;
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && (dp[j] as number) + 1 > (dp[i] as number)) {
        dp[i] = (dp[j] as number) + 1;
        best = j;
      }
    }
    push(
      [0, i],
      best >= 0 ? [[0, best]] : undefined,
      bn
        ? best >= 0
          ? `dp[${i}] = dp[${best}]+1 = ${dp[i]} (a[${best}]=${arr[best]} < ${arr[i]})`
          : `dp[${i}] = 1 — বামে ছোট কেউ নেই`
        : best >= 0
          ? `dp[${i}] = dp[${best}]+1 = ${dp[i]} (a[${best}]=${arr[best]} < ${arr[i]})`
          : `dp[${i}] = 1 — nothing smaller left`,
      2
    );
  }
  const length = Math.max(...(dp as number[]));
  push(undefined, undefined, bn ? `শেষ — LIS দৈর্ঘ্য ${length}` : `done — LIS length ${length}`, 3);
  return { steps, length, answer: String(length) };
}

// ---------------------------------------------------------------------------
// 6. Edit distance
// ---------------------------------------------------------------------------

export const EDIT_CODE = [
  "same? cost 0 : cost 1",
  "del=top+1 ins=left+1 sub=diag+cost",
  "dp = min(del, ins, sub)",
  "fill row by row",
  "answer = dp[m][n]",
];

export type EditResult = {
  steps: DPStep[];
  dist: number;
  script: string[];
  answer: string;
};

export const EDIT_A = "kitten";
export const EDIT_B = "sitting";

export function editTrace(a: string, b: string, lang: Lang = "en"): EditResult {
  const bn = lang === "bn";
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  const steps: DPStep[] = [];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: snap(dp), cell, refs, desc, codeLine });

  push(undefined, undefined, bn ? `বেস ভরা — খালি থেকে বানাতে i/j খরচ` : `bases filled — building from empty costs i/j`, 3);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const del = dp[i - 1][j] + 1;
      const ins = dp[i][j - 1] + 1;
      const sub = dp[i - 1][j - 1] + cost;
      dp[i][j] = Math.min(del, ins, sub);
      const op = dp[i][j] === sub ? (cost === 0 ? "keep" : "sub") : dp[i][j] === del ? "del" : "ins";
      push(
        [i, j],
        [[i - 1, j], [i, j - 1], [i - 1, j - 1]],
        bn
          ? cost === 0
            ? `'${a[i - 1]}' মিল — diag ${sub}`
            : `'${a[i - 1]}'→'${b[j - 1]}': del ${del}, ins ${ins}, sub ${sub} → ${dp[i][j]} (${op})`
          : cost === 0
            ? `'${a[i - 1]}' matches — diag ${sub}`
            : `'${a[i - 1]}'→'${b[j - 1]}': del ${del}, ins ${ins}, sub ${sub} → ${dp[i][j]} (${op})`,
        2
      );
    }
  }
  // backtrack one alignment
  let i = m;
  let j = n;
  const script: string[] = [];
  const path: DPRef[] = [[i, j]];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      script.push(`keep '${a[i - 1]}'`);
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      script.push(`sub '${a[i - 1]}'→'${b[j - 1]}'`);
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      script.push(`del '${a[i - 1]}'`);
      i--;
    } else {
      script.push(`ins '${b[j - 1]}'`);
      j--;
    }
    path.push([i, j]);
  }
  script.reverse();
  steps.push({
    mat: snap(dp),
    path,
    desc: bn ? `শেষ — দূরত্ব ${dp[m][n]}: ${script.join(", ") || "—"}` : `done — distance ${dp[m][n]}: ${script.join(", ") || "—"}`,
    codeLine: 4,
  });
  return { steps, dist: dp[m][n], script, answer: String(dp[m][n]) };
}

// ---------------------------------------------------------------------------
// 7. Coin change (min coins)
// ---------------------------------------------------------------------------

export const COIN_CODE = [
  "dp[0] = 0, rest = ∞",
  "for amt in 1..amount:",
  "  try each coin c ≤ amt",
  "  dp[amt] = 1 + min(dp[amt−c])",
  "answer = dp[amount]",
];

export type CoinResult = {
  steps: DPStep[];
  minCoins: number | null;
  combo: number[];
  answer: string;
};

export const COIN_COINS = [1, 3, 4];
export const COIN_AMOUNT = 10;

export function coinTrace(coins: number[], amount: number, lang: Lang = "en"): CoinResult {
  const bn = lang === "bn";
  const INF = Number.POSITIVE_INFINITY;
  const dp: number[] = Array(amount + 1).fill(INF);
  dp[0] = 0;
  const steps: DPStep[] = [];
  const mat = (): DPCell[][] => [[...dp.map((v) => (v === INF ? null : v))]];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: mat(), cell, refs, desc, codeLine });

  push([0, 0], undefined, bn ? `dp[0] = 0 — শূন্য বানাতে ০ কয়েন` : `dp[0] = 0 — zero costs nothing`, 0);
  for (let amt = 1; amt <= amount; amt++) {
    let best = INF;
    let bestC = -1;
    const used: DPRef[] = [];
    for (const c of coins) {
      if (c <= amt && dp[amt - c] !== INF) {
        used.push([0, amt - c]);
        if (dp[amt - c] + 1 < best) {
          best = dp[amt - c] + 1;
          bestC = c;
        }
      }
    }
    dp[amt] = best;
    push(
      [0, amt],
      used.length > 0 ? used : undefined,
      best === INF
        ? bn
          ? `${amt} বানানো যায় না — ∞`
          : `${amt} unreachable — ∞`
        : bn
          ? `dp[${amt}] = 1 + dp[${amt - bestC}] = ${best} (কয়েন ${bestC})`
          : `dp[${amt}] = 1 + dp[${amt - bestC}] = ${best} (coin ${bestC})`,
      3
    );
  }
  const combo: number[] = [];
  if (dp[amount] !== INF) {
    let amt = amount;
    while (amt > 0) {
      const c = coins.find((cc) => cc <= amt && dp[amt - cc] === dp[amt] - 1);
      if (c === undefined) break;
      combo.push(c);
      amt -= c;
    }
  }
  const minCoins = dp[amount] === INF ? null : dp[amount];
  steps.push({
    mat: mat(),
    desc:
      minCoins === null
        ? bn
          ? `শেষ — ${amount} বানানো অসম্ভব`
          : `done — ${amount} is impossible`
        : bn
          ? `শেষ — ${amount} = ${combo.join(" + ")} (${minCoins} কয়েন)`
          : `done — ${amount} = ${combo.join(" + ")} (${minCoins} coins)`,
    codeLine: 4,
  });
  return { steps, minCoins, combo, answer: minCoins === null ? "∞" : String(minCoins) };
}

// ---------------------------------------------------------------------------
// 8. Subset sum
// ---------------------------------------------------------------------------

export const SUBSET_CODE = [
  "dp[i][s] = reachable?",
  "skip: dp[i−1][s]",
  "take: dp[i−1][s−x]",
  "dp = skip OR take",
  "answer = dp[m][target]",
];

export type SubsetResult = {
  steps: DPStep[];
  possible: boolean;
  example: number[];
  answer: string;
};

export const SUBSET_NUMS = [3, 2, 7, 1];
export const SUBSET_TARGET = 6;

export function subsetTrace(nums: number[], target: number, lang: Lang = "en"): SubsetResult {
  const bn = lang === "bn";
  const m = nums.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => Array(target + 1).fill(false));
  dp[0][0] = true;
  const steps: DPStep[] = [];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: snap(dp), cell, refs, desc, codeLine });

  push([0, 0], undefined, bn ? "dp[0][0] = T — খালি সেটে ০ সম্ভব" : "dp[0][0] = T — empty set makes 0", 0);
  for (let i = 1; i <= m; i++) {
    const x = nums[i - 1];
    for (let s = 0; s <= target; s++) {
      const skip = dp[i - 1][s];
      const take = s >= x && dp[i - 1][s - x];
      dp[i][s] = skip || take;
      const refs: DPRef[] = [[i - 1, s]];
      if (s >= x) refs.push([i - 1, s - x]);
      push(
        [i, s],
        refs,
        bn
          ? take && !skip
            ? `${x} নিয়ে ${s} ✓ (take)`
            : skip
              ? `${s} আগেই ছিল ✓ (skip)`
              : `${s} অসম্ভব — ✗`
          : take && !skip
            ? `take ${x} → ${s} ✓`
            : skip
              ? `${s} already ✓ (skip)`
              : `${s} unreachable ✗`,
        take ? 2 : 1
      );
    }
  }
  const possible = dp[m][target];
  const example: number[] = [];
  const path: DPRef[] = [];
  if (possible) {
    let s = target;
    for (let i = m; i >= 1; i--) {
      path.push([i, s]);
      if (!dp[i - 1][s]) {
        example.push(nums[i - 1]);
        s -= nums[i - 1];
      }
    }
    path.push([0, s]);
    example.reverse();
  }
  steps.push({
    mat: snap(dp),
    path: possible ? path : undefined,
    desc: possible
      ? bn
        ? `শেষ — ${target} সম্ভব: ${example.join(" + ")}`
        : `done — ${target} reachable: ${example.join(" + ")}`
      : bn
        ? `শেষ — ${target} অসম্ভব`
        : `done — ${target} unreachable`,
    codeLine: 4,
  });
  return { steps, possible, example, answer: possible ? (bn ? "হ্যাঁ ✓" : "Yes ✓") : bn ? "না ✗" : "No ✗" };
}

// ---------------------------------------------------------------------------
// 9. Grid paths (unique paths)
// ---------------------------------------------------------------------------

export const GRID_CODE = [
  "dp[0][0] = 1",
  "first row/col = 1",
  "dp = top + left",
  "fill row by row",
  "answer = dp[R−1][C−1]",
];

export type GridResult = {
  steps: DPStep[];
  count: number;
  answer: string;
};

export const GRID_R = 4;
export const GRID_C = 4;

export function gridTrace(rows: number, cols: number, lang: Lang = "en"): GridResult {
  const bn = lang === "bn";
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  const steps: DPStep[] = [];
  const push = (cell: DPRef | undefined, refs: DPRef[] | undefined, desc: string, codeLine: number) =>
    steps.push({ mat: snap(dp), cell, refs, desc, codeLine });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c === 0) {
        dp[r][c] = 1;
        push([r, c], undefined, bn ? "শুরু (0,0) = 1" : "start (0,0) = 1", 0);
      } else if (r === 0 || c === 0) {
        dp[r][c] = 1;
        push([r, c], r === 0 ? [[r, c - 1]] : [[r - 1, c]], bn ? `কিনারা — একটাই পথ = 1` : `edge — only one way = 1`, 1);
      } else {
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        push(
          [r, c],
          [[r - 1, c], [r, c - 1]],
          bn ? `উপর ${dp[r - 1][c]} + বাম ${dp[r][c - 1]} = ${dp[r][c]}` : `top ${dp[r - 1][c]} + left ${dp[r][c - 1]} = ${dp[r][c]}`,
          2
        );
      }
    }
  }
  const count = dp[rows - 1][cols - 1];
  steps.push({
    mat: snap(dp),
    desc: bn ? `শেষ — মোট পথ ${count}` : `done — total paths ${count}`,
    codeLine: 4,
  });
  return { steps, count, answer: String(count) };
}
