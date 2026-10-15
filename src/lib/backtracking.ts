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
