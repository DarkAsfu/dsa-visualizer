export type GrowthFn = {
  id: string;
  label: string;
  bigO: string;
  color: string;
  explosive?: boolean;
  fn: (n: number) => number;
};

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) {
    r *= i;
    if (!Number.isFinite(r) || r > 1e300) return Infinity;
  }
  return r;
}

export const GROWTH_FNS: GrowthFn[] = [
  { id: "const", label: "Constant", bigO: "O(1)", color: "#a1a1aa", fn: () => 1 },
  { id: "log", label: "Logarithmic", bigO: "O(log n)", color: "#10b981", fn: (n) => Math.log2(n) },
  { id: "linear", label: "Linear", bigO: "O(n)", color: "#0ea5e9", fn: (n) => n },
  { id: "nlogn", label: "Linearithmic", bigO: "O(n log n)", color: "#f59e0b", fn: (n) => n * Math.log2(n) },
  { id: "quad", label: "Quadratic", bigO: "O(n²)", color: "#f97316", fn: (n) => n * n },
  { id: "exp", label: "Exponential", bigO: "O(2ⁿ)", color: "#f43f5e", explosive: true, fn: (n) => Math.pow(2, n) },
  { id: "fact", label: "Factorial", bigO: "O(n!)", color: "#8b5cf6", explosive: true, fn: factorial },
];

export function formatOps(v: number): string {
  if (!Number.isFinite(v)) return "∞";
  if (v >= 1e15) return v.toExponential(1).replace("e+", "×10^");
  if (v >= 10000) return v.toExponential(1).replace("e+", "×10^");
  if (Number.isInteger(v)) return v.toLocaleString("en-US");
  return v.toFixed(1);
}

// short axis labels: 1K / 10K / 1M / 1B — never clipped
export function formatAxis(v: number): string {
  if (!Number.isFinite(v)) return "∞";
  const trim = (x: number) => String(Math.round(x * 10) / 10);
  if (v >= 1e12) return `${trim(v / 1e12)}T`;
  if (v >= 1e9) return `${trim(v / 1e9)}B`;
  if (v >= 1e6) return `${trim(v / 1e6)}M`;
  if (v >= 1e3) return `${trim(v / 1e3)}K`;
  if (v >= 10) return String(Math.round(v));
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}
