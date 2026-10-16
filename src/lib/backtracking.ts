import type { Lang } from "./dict";

export type BStepKind =
  | "start"
  | "place"
  | "conflict"
  | "remove"
  | "solution";

export type BStep = {
  kind: BStepKind;
  board: number[]; // col index per row, -1 = empty
  cell?: [number, number];
  attackers?: Array<[number, number]>;
  solutions: number;
  desc: string;
  codeLine: number;
};

export type BTrace = {
  n: number;
  steps: BStep[];
  attempts: number;
  backtracks: number;
  solutions: number;
  boards: number[][];
};

export const BACKTRACK_CODE = [
  "solve(row):",
  "  if row == n: record solution",
  "  for col in 0..n-1:",
  "    if safe(row, col): place queen",
  "      solve(row+1)",
  "      remove queen  # backtrack",
];

function attackersOf(board: number[], row: number, col: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let r = 0; r < row; r++) {
    const c = board[r];
    if (c === -1) continue;
    if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
      out.push([r, c]);
    }
  }
  return out;
}

export function buildQueensTrace(n: number, lang: Lang = "en"): BTrace {
  const bn = lang === "bn";
  const board = Array<number>(n).fill(-1);
  const steps: BStep[] = [];
  const boards: number[][] = [];
  let attempts = 0;
  let backtracks = 0;
  let solutions = 0;

  steps.push({
    kind: "start",
    board: [...board],
    solutions: 0,
    desc: bn ? `শুরু: ${n} কুইন, প্রতি সারিতে একটা` : `Start: place ${n} queens, one per row`,
    codeLine: 0,
  });

  function dfs(row: number) {
    if (row === n) {
      solutions++;
      boards.push([...board]);
      steps.push({
        kind: "solution",
        board: [...board],
        solutions,
        desc: bn ? `সমাধান #${solutions} মিলেছে` : `Solution #${solutions} found`,
        codeLine: 1,
      });
      return;
    }
    for (let c = 0; c < n; c++) {
      attempts++;
      const atk = attackersOf(board, row, c);
      if (atk.length === 0) {
        board[row] = c;
        steps.push({
          kind: "place",
          board: [...board],
          cell: [row, c],
          solutions,
          desc: bn ? `কুইন বসাও (${row}, ${c})` : `Place queen at (${row}, ${c})`,
          codeLine: 3,
        });
        // recurse into next row
        steps.push({
          kind: "place",
          board: [...board],
          cell: [row, c],
          solutions,
          desc: bn ? `পরের সারি সমাধান করো (row ${row + 1})` : `Recurse: solve(row ${row + 1})`,
          codeLine: 4,
        });
        dfs(row + 1);
        board[row] = -1;
        backtracks++;
        steps.push({
          kind: "remove",
          board: [...board],
          cell: [row, c],
          solutions,
          desc: bn ? `ব্যাকট্র্যাক: (${row}, ${c}) সরাও, পরের কলাম` : `Backtrack: remove (${row}, ${c}), try next column`,
          codeLine: 5,
        });
      } else {
        steps.push({
          kind: "conflict",
          board: [...board],
          cell: [row, c],
          attackers: atk,
          solutions,
          desc: bn ? `(${row}, ${c}) ${atk.length} কুইনের আক্রমণে — বাদ` : `(${row}, ${c}) attacked by ${atk.length} queen${atk.length > 1 ? "s" : ""} — skip`,
          codeLine: 3,
        });
      }
    }
  }

  dfs(0);
  return { n, steps, attempts, backtracks, solutions, boards };
}

// ---------------------------------------------------------------------------
// Sudoku — MRV backtracking, step-capped
// ---------------------------------------------------------------------------

export const SUDOKU_CODE = [
  "pick emptiest-constrained cell",
  "try each candidate digit",
  "  place → recurse",
  "  dead end → erase (backtrack)",
  "board full = solved",
];

export type SudokuStep = {
  board: number[];
  cell: number; // -1 = none
  kind: "place" | "erase" | "done" | "stuck";
  digit: number;
  desc: string;
  codeLine: number;
};

export type SudokuResult = {
  steps: SudokuStep[];
  givens: boolean[];
  solved: boolean;
  truncated: boolean;
  answer: string;
};

// Classic easy puzzle (Norvig) + a sparser variant of the same solution.
export const SUDOKU_PRESETS: { name: string; puzzle: string }[] = [
  {
    name: "Easy",
    puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  },
  {
    name: "Sparse",
    puzzle: "034678900672095348098342567859761420426800791713924856961537284287419635345286170",
  },
  {
    name: "Medium",
    puzzle: "003020600900305001001806400008102900700000008006708200002609500800203009005010300",
  },
];

function sudokuCands(board: number[], i: number): number[] {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const used = new Set<number>();
  for (let k = 0; k < 9; k++) {
    if (board[r * 9 + k] !== 0) used.add(board[r * 9 + k]);
    if (board[k * 9 + c] !== 0) used.add(board[k * 9 + c]);
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let dr = 0; dr < 3; dr++)
    for (let dc = 0; dc < 3; dc++) {
      const v = board[(br + dr) * 9 + bc + dc];
      if (v !== 0) used.add(v);
    }
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !used.has(d));
}

export function sudokuTrace(puzzle: string, lang: Lang = "en", cap = 500): SudokuResult {
  const bn = lang === "bn";
  const board = puzzle.split("").map(Number);
  const givens = board.map((v) => v !== 0);
  const steps: SudokuStep[] = [];
  let solved = false;
  let truncated = false;
  const snap = (cell: number, kind: SudokuStep["kind"], digit: number, desc: string, codeLine: number): SudokuStep => ({
    board: [...board],
    cell,
    kind,
    digit,
    desc,
    codeLine,
  });

  function dfs(): boolean {
    if (steps.length > cap) {
      truncated = true;
      return true; // stop expanding, keep what we have
    }
    // MRV: empty cell with fewest candidates
    let pick = -1;
    let opts: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (board[i] !== 0) continue;
      const c = sudokuCands(board, i);
      if (c.length === 0) return false;
      if (pick === -1 || c.length < opts.length) {
        pick = i;
        opts = c;
        if (c.length === 1) break;
      }
    }
    if (pick === -1) {
      solved = true;
      return true;
    }
    for (const d of opts) {
      board[pick] = d;
      steps.push(snap(pick, "place", d, bn ? `(${Math.floor(pick / 9) + 1},${(pick % 9) + 1}) = ${d} বসাও` : `place ${d} at (${Math.floor(pick / 9) + 1},${(pick % 9) + 1})`, 2));
      if (dfs()) return true;
      if (truncated) return true;
      board[pick] = 0;
      steps.push(snap(pick, "erase", d, bn ? `${d} মুছো — dead end, ব্যাকট্র্যাক` : `erase ${d} — dead end, backtrack`, 3));
    }
    return false;
  }

  dfs();
  if (solved) {
    steps.push(snap(-1, "done", 0, bn ? "শেষ — বোর্ড পূর্ণ ✓" : "done — board complete ✓", 4));
  } else if (!truncated) {
    steps.push(snap(-1, "stuck", 0, bn ? "অমীমাংসিত — সমাধান নেই" : "unsolvable — no solution", 4));
  }
  return { steps, givens, solved, truncated, answer: solved ? (bn ? "সমাধান ✓" : "solved ✓") : bn ? "অসম্পূর্ণ" : "incomplete" };
}

// ---------------------------------------------------------------------------
// Rat in a maze — DFS, all paths (capped)
// ---------------------------------------------------------------------------

export const RAT_CODE = [
  "DFS from (0,0)",
  "try D → R → U → L",
  "  free + unseen → step in",
  "  dead end → step back",
  "reach end = one path",
];

export type RatStep = {
  r: number;
  c: number;
  visited: boolean[];
  pathCount: number;
  found: boolean;
  desc: string;
  codeLine: number;
};

export type RatResult = {
  steps: RatStep[];
  rows: number;
  cols: number;
  walls: boolean[];
  paths: number;
  answer: string;
};

export const RAT_PRESETS: { name: string; grid: string[] }[] = [
  {
    name: "Classic",
    grid: ["00000", "01110", "00010", "11000", "00010"],
  },
  {
    name: "Open",
    grid: ["0000", "0000", "0000", "0000"],
  },
  {
    name: "Tricky",
    grid: ["000000", "011100", "000100", "110100", "000000", "011110"],
  },
];

export function ratTrace(grid: string[], lang: Lang = "en", cap = 400, maxPaths = 3): RatResult {
  const bn = lang === "bn";
  const rows = grid.length;
  const cols = grid[0].length;
  const walls = grid.join("").split("").map((ch) => ch === "1");
  const visited = Array(rows * cols).fill(false);
  const steps: RatStep[] = [];
  let paths = 0;
  const DIRS = [[1, 0, "D"], [0, 1, "R"], [-1, 0, "U"], [0, -1, "L"]] as const;
  const snap = (r: number, c: number, found: boolean, desc: string, codeLine: number): RatStep => ({
    r,
    c,
    visited: [...visited],
    pathCount: paths,
    found,
    desc,
    codeLine,
  });

  function dfs(r: number, c: number): boolean {
    if (steps.length > cap || paths >= maxPaths) return true;
    if (r === rows - 1 && c === cols - 1) {
      paths++;
      steps.push(snap(r, c, true, bn ? `গন্তব্য! পথ #${paths} ✓` : `reached! path #${paths} ✓`, 4));
      return paths >= maxPaths || steps.length > cap;
    }
    for (const [dr, dc, nm] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      const ni = nr * cols + nc;
      if (walls[ni] || visited[ni]) continue;
      visited[ni] = true;
      steps.push(snap(nr, nc, false, bn ? `${nm} যাও (${nr},${nc})` : `go ${nm} to (${nr},${nc})`, 2));
      const stop = dfs(nr, nc);
      visited[ni] = false;
      if (stop) return true;
      if (!(nr === rows - 1 && nc === cols - 1)) {
        steps.push(snap(r, c, false, bn ? `ফেরো (${r},${c}) — dead end` : `back to (${r},${c}) — dead end`, 3));
      }
      if (steps.length > cap) return true;
    }
    return false;
  }

  if (!walls[0]) {
    visited[0] = true;
    steps.push(snap(0, 0, false, bn ? "শুরু (0,0)" : "start (0,0)", 0));
    dfs(0, 0);
  }
  steps.push(snap(rows - 1, cols - 1, paths > 0, bn ? `শেষ — প্রথম ${paths}টি পথ` : `done — first ${paths} path${paths === 1 ? "" : "s"}`, 4));
  return { steps, rows, cols, walls, paths, answer: String(paths) };
}

// ---------------------------------------------------------------------------
// Subsets & permutations — binary choice / fix-position
// ---------------------------------------------------------------------------

export const SUBSETSP_CODE = [
  "subsets: take it or skip it",
  "leaf (i == n) = one subset",
  "perms: fix position i",
  "try each remaining value",
  "recurse i+1, then unfix",
];

export type SubPermStep = {
  cur: number[];
  depth: number;
  collected: number[][];
  desc: string;
  codeLine: number;
};

export type SubPermResult = {
  steps: SubPermStep[];
  collected: number[][];
  answer: string;
};

export function subsetsTrace(nums: number[], lang: Lang = "en"): SubPermResult {
  const bn = lang === "bn";
  const steps: SubPermStep[] = [];
  const collected: number[][] = [];
  const snap = (cur: number[], depth: number, desc: string, codeLine: number): SubPermStep => ({
    cur: [...cur],
    depth,
    collected: collected.map((s) => [...s]),
    desc,
    codeLine,
  });
  function dfs(i: number, cur: number[]) {
    if (i === nums.length) {
      collected.push([...cur]);
      steps.push(snap(cur, i, bn ? `সাবসেট {${cur.join(", ") || "∅"}} ✓ (#${collected.length})` : `subset {${cur.join(", ") || "∅"}} ✓ (#${collected.length})`, 1));
      return;
    }
    steps.push(snap(cur, i, bn ? `${nums[i]} বাদ দাও` : `skip ${nums[i]}`, 0));
    dfs(i + 1, cur);
    cur.push(nums[i]);
    steps.push(snap(cur, i, bn ? `${nums[i]} নাও` : `take ${nums[i]}`, 0));
    dfs(i + 1, cur);
    cur.pop();
  }
  dfs(0, []);
  return { steps, collected, answer: `${collected.length} subsets` };
}

export function permsTrace(nums: number[], lang: Lang = "en"): SubPermResult {
  const bn = lang === "bn";
  const steps: SubPermStep[] = [];
  const collected: number[][] = [];
  const arr = [...nums];
  const snap = (depth: number, desc: string, codeLine: number): SubPermStep => ({
    cur: [...arr],
    depth,
    collected: collected.map((s) => [...s]),
    desc,
    codeLine,
  });
  function dfs(i: number) {
    if (i === arr.length) {
      collected.push([...arr]);
      steps.push(snap(i, bn ? `বিন্যাস [${arr.join(", ")}] ✓ (#${collected.length})` : `perm [${arr.join(", ")}] ✓ (#${collected.length})`, 3));
      return;
    }
    for (let j = i; j < arr.length; j++) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push(snap(i, bn ? `ঘর ${i}-এ ${arr[i]} বসাও` : `fix ${arr[i]} at ${i}`, 3));
      dfs(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    steps.push(snap(i, bn ? `ঘর ${i} মুক্ত করো (unfix)` : `unfix ${i}`, 4));
  }
  dfs(0);
  return { steps, collected, answer: `${collected.length} perms` };
}

// ---------------------------------------------------------------------------
// Word search — grid DFS with visited set
// ---------------------------------------------------------------------------

export const WORD_CODE = [
  "start at each 1st letter",
  "match? step to 4 neighbors",
  "  mismatch/seen → backtrack",
  "all letters matched = found",
  "no start works = absent",
];

export type WordStep = {
  path: number[]; // cell indices
  found: boolean;
  desc: string;
  codeLine: number;
};

export type WordResult = {
  steps: WordStep[];
  rows: number;
  cols: number;
  found: boolean;
  answer: string;
};

export const WORD_PRESETS: { name: string; board: string[]; word: string }[] = [
  { name: "ABCCED", board: ["ABCE", "SFCS", "ADEE"], word: "ABCCED" },
  { name: "SEE", board: ["ABCE", "SFCS", "ADEE"], word: "SEE" },
  { name: "ABCB", board: ["ABCE", "SFCS", "ADEE"], word: "ABCB" },
];

export function wordTrace(board: string[], word: string, lang: Lang = "en", cap = 300): WordResult {
  const bn = lang === "bn";
  const rows = board.length;
  const cols = board[0].length;
  const cells = board.join("").split("");
  const seen = Array(rows * cols).fill(false);
  const steps: WordStep[] = [];
  let found = false;
  const at = (r: number, c: number) => cells[r * cols + c];
  const snap = (path: number[], desc: string, codeLine: number): WordStep => ({
    path: [...path],
    found,
    desc,
    codeLine,
  });

  function dfs(r: number, c: number, k: number, path: number[]): boolean {
    if (steps.length > cap) return true;
    if (k === word.length) {
      found = true;
      steps.push(snap(path, bn ? `"${word}" মিলেছে ✓` : `"${word}" found ✓`, 3));
      return true;
    }
    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      const ni = nr * cols + nc;
      if (seen[ni] || at(nr, nc) !== word[k]) continue;
      seen[ni] = true;
      path.push(ni);
      steps.push(snap(path, bn ? `'${word[k]}' মিল (${nr},${nc})` : `match '${word[k]}' at (${nr},${nc})`, 1));
      if (dfs(nr, nc, k + 1, path)) return true;
      seen[ni] = false;
      path.pop();
      steps.push(snap(path, bn ? `ফেরো — '${word[k]}' এগোলো না` : `back — '${word[k]}' led nowhere`, 2));
      if (steps.length > cap) return true;
    }
    return false;
  }

  for (let r = 0; r < rows && !found; r++) {
    for (let c = 0; c < cols && !found; c++) {
      if (at(r, c) !== word[0]) continue;
      const i = r * cols + c;
      seen[i] = true;
      steps.push(snap([i], bn ? `শুরু (${r},${c}) — '${word[0]}'` : `start (${r},${c}) — '${word[0]}'`, 0));
      if (dfs(r, c, 1, [i])) break;
      seen[i] = false;
      if (steps.length > cap) break;
    }
  }
  if (!found && steps.length <= cap) {
    steps.push(snap([], bn ? `"${word}" নেই ✗` : `"${word}" absent ✗`, 4));
  }
  return { steps, rows, cols, found, answer: found ? (bn ? "পাওয়া গেছে ✓" : "found ✓") : bn ? "নেই ✗" : "absent ✗" };
}
