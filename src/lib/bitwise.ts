import type { Lang } from "./dict";

export type BitOpId = "AND" | "OR" | "XOR" | "NOT" | "SHL" | "SHR";

export const BIT_OPS: Array<{
  id: BitOpId;
  symbol: string;
  name: string;
  needsB: boolean;
  needsK: boolean;
}> = [
  { id: "AND", symbol: "&", name: "AND", needsB: true, needsK: false },
  { id: "OR", symbol: "|", name: "OR", needsB: true, needsK: false },
  { id: "XOR", symbol: "^", name: "XOR", needsB: true, needsK: false },
  { id: "NOT", symbol: "~", name: "NOT", needsB: false, needsK: false },
  { id: "SHL", symbol: "<<", name: "Shift left", needsB: false, needsK: true },
  { id: "SHR", symbol: ">>", name: "Shift right", needsB: false, needsK: true },
];

export type BitStep = {
  pos: number; // bit position being resolved (7..0, MSB first)
  aBit: number;
  bBit: number | null;
  rBit: number;
  revealed: boolean[]; // per position, MSB→LSB resolved so far
  result: number; // partial result value
  desc: string;
  codeLine: number;
};

export function toBits(v: number): number[] {
  const out: number[] = [];
  for (let i = 7; i >= 0; i--) out.push((v >> i) & 1);
  return out;
}

export function toHex(v: number): string {
  return "0x" + v.toString(16).toUpperCase().padStart(2, "0");
}

export function popcount(v: number): number {
  let c = 0;
  let x = v;
  while (x > 0) {
    c += x & 1;
    x >>= 1;
  }
  return c;
}

export function isPowerOfTwo(v: number): boolean {
  return v > 0 && (v & (v - 1)) === 0;
}

export function lowestSetBit(v: number): number {
  return v & -v;
}

export function computeBitSteps(
  a: number,
  b: number,
  op: BitOpId,
  k: number,
  lang: Lang = "en"
): BitStep[] {
  const bn = lang === "bn";
  const A = toBits(a);
  const B = toBits(b);
  const steps: BitStep[] = [];
  const revealed = Array(8).fill(false);
  const rBits = Array(8).fill(0);

  steps.push({
    pos: -1,
    aBit: -1,
    bBit: null,
    rBit: -1,
    revealed: [...revealed],
    result: 0,
    desc: bn
      ? op === "NOT"
        ? `শুরু: ${a}-এর সব বিট উল্টাও`
        : op === "SHL" || op === "SHR"
          ? `শুরু: ${a}-কে ${op === "SHL" ? "বামে" : "ডানে"} ${k} সরাও`
          : `শুরু: ${a} ${BIT_OPS.find((o) => o.id === op)?.symbol} ${b}, এক বিট করে`
      : op === "NOT"
        ? `Start: flip every bit of ${a}`
        : op === "SHL" || op === "SHR"
          ? `Start: shift ${a} ${op === "SHL" ? "left" : "right"} by ${k}`
          : `Start: ${a} ${BIT_OPS.find((o) => o.id === op)?.symbol} ${b}, bit by bit`,
    codeLine: 0,
  });

  const at = (idx: number) => 7 - idx; // array index → bit position

  for (let idx = 0; idx < 8; idx++) {
    const pos = at(idx);
    let rBit = 0;
    let desc = "";
    if (op === "AND" || op === "OR" || op === "XOR") {
      const ab = A[idx];
      const bb = B[idx];
      rBit =
        op === "AND" ? ab & bb : op === "OR" ? ab | bb : ab ^ bb;
      const sym = op === "AND" ? "AND" : op === "OR" ? "OR" : "XOR";
      desc = bn ? `বিট ${pos}: ${ab} ${sym} ${bb} = ${rBit}` : `bit ${pos}: ${ab} ${sym} ${bb} = ${rBit}`;
    } else if (op === "NOT") {
      rBit = A[idx] ^ 1;
      desc = bn ? `বিট ${pos}: NOT ${A[idx]} = ${rBit}` : `bit ${pos}: NOT ${A[idx]} = ${rBit}`;
    } else if (op === "SHL") {
      const src = pos + k;
      if (src <= 7) {
        const sb = (a >> src) & 1;
        rBit = sb;
        desc = bn ? `বিট ${src} (${sb}) বামে গিয়ে ${pos}-এ` : `bit ${src} (${sb}) slides left into ${pos}`;
      } else {
        rBit = 0;
        desc = bn ? `স্থান ${pos}: পড়ে গেল → 0` : `position ${pos}: shifted out → 0`;
      }
    } else {
      const src = pos - k;
      if (src >= 0) {
        const sb = (a >> src) & 1;
        rBit = sb;
        desc = bn ? `বিট ${src} (${sb}) ডানে গিয়ে ${pos}-এ` : `bit ${src} (${sb}) slides right into ${pos}`;
      } else {
        rBit = 0;
        desc = bn ? `স্থান ${pos}: বাম থেকে 0` : `position ${pos}: 0 fills in from the left`;
      }
    }
    rBits[idx] = rBit;
    revealed[idx] = true;
    let result = 0;
    for (let j = 0; j < 8; j++) {
      if (revealed[j]) result |= rBits[j] << (7 - j);
    }
    steps.push({
      pos,
      aBit: A[idx],
      bBit: op === "NOT" || op === "SHL" || op === "SHR" ? null : B[idx],
      rBit,
      revealed: [...revealed],
      result,
      desc,
      codeLine: op === "SHL" || op === "SHR" ? 1 : 2,
    });
  }
  return steps;
}

export function expectedResult(a: number, b: number, op: BitOpId, k: number): number {
  switch (op) {
    case "AND":
      return a & b;
    case "OR":
      return a | b;
    case "XOR":
      return a ^ b;
    case "NOT":
      return (~a) & 0xff;
    case "SHL":
      return (a << k) & 0xff;
    case "SHR":
      return a >> k;
  }
}

export const BIT_CODE: Record<BitOpId, string[]> = {
  AND: ["r = a & b", "for bit i from 7 → 0:", "  r[i] = a[i] AND b[i]"],
  OR: ["r = a | b", "for bit i from 7 → 0:", "  r[i] = a[i] OR b[i]"],
  XOR: ["r = a ^ b", "for bit i from 7 → 0:", "  r[i] = a[i] XOR b[i]"],
  NOT: ["r = ~a  (8-bit)", "for bit i from 7 → 0:", "  r[i] = NOT a[i]"],
  SHL: ["r = a << k", "bits slide left, 0 fills right", "overflow drops off the left"],
  SHR: ["r = a >> k", "bits slide right, 0 fills left", "shifted-out bits are lost"],
};
