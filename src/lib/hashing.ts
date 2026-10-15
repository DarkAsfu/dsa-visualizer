import type { Lang } from "./dict";

/* ================= shared hashes ================= */

export function djb2(s: string, seed = 5381): number {
  let h = seed >>> 0;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h;
}

export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function poly31(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

export function charSum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h += s.charCodeAt(i);
  return h >>> 0;
}

export const HASH_FNS: Array<{ id: string; name: string; fn: (s: string) => number }> = [
  { id: "sum", name: "char sum", fn: charSum },
  { id: "poly", name: "poly-31", fn: poly31 },
  { id: "djb2", name: "djb2", fn: (s) => djb2(s) },
  { id: "fnv", name: "FNV-1a", fn: fnv1a },
];

export function cleanWord(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
}

/* ================= hash table (chaining) ================= */

export const HT_SIZE = 8;

export function htHash(key: string): { sum: number; bucket: number } {
  const sum = charSum(key);
  return { sum, bucket: sum % HT_SIZE };
}

export type HTStep = {
  buckets: string[][];
  at: number;
  hiKey: string | null;
  found: boolean | null;
  desc: string;
  codeLine: number;
};

function htSnap(buckets: string[][], at: number, hiKey: string | null, found: boolean | null, desc: string, codeLine: number): HTStep {
  return { buckets: buckets.map((b) => [...b]), at, hiKey, found, desc, codeLine };
}

export function htInsertTrace(buckets: string[][], key: string, lang: Lang = "en"): { steps: HTStep[]; buckets: string[][] } {
  const bn = lang === "bn";
  const { sum, bucket } = htHash(key);
  const next = buckets.map((b) => [...b]);
  const steps: HTStep[] = [
    htSnap(buckets, -1, key, null, bn ? `h(“${key}”) বের করো` : `Hash “${key}”`, 0),
    htSnap(buckets, bucket, key, null, bn ? `অক্ষর-যোগ = ${sum} → ${sum} % ${HT_SIZE} = [${bucket}]` : `char-sum = ${sum} → ${sum} % ${HT_SIZE} = [${bucket}]`, 1),
  ];
  if (next[bucket].includes(key)) {
    steps.push(htSnap(next, bucket, key, false, bn ? `“${key}” আগেই আছে` : `“${key}” already there`, 3));
    return { steps, buckets: next };
  }
  if (next[bucket].length > 0) {
    steps.push(htSnap(next, bucket, key, null, bn ? `[${bucket}]-এ সংঘর্ষ! চেইনে ঝোলাও` : `Collision at [${bucket}]! Chain it`, 2));
  }
  next[bucket].push(key);
  steps.push(htSnap(next, bucket, key, true, bn ? `[${bucket}]-এ “${key}” বসলো ✓` : `“${key}” lands in [${bucket}] ✓`, 2));
  return { steps, buckets: next };
}

export function htSearchTrace(buckets: string[][], key: string, lang: Lang = "en"): { steps: HTStep[]; found: boolean } {
  const bn = lang === "bn";
  const { sum, bucket } = htHash(key);
  const steps: HTStep[] = [
    htSnap(buckets, -1, key, null, bn ? `h(“${key}”) বের করো` : `Hash “${key}”`, 0),
    htSnap(buckets, bucket, key, null, bn ? `${sum} % ${HT_SIZE} = [${bucket}] — চেইন ঘাঁটো` : `${sum} % ${HT_SIZE} = [${bucket}] — walk the chain`, 1),
  ];
  const found = buckets[bucket].includes(key);
  steps.push(htSnap(
    buckets, bucket, key, found,
    found ? (bn ? `“${key}” মিলেছে ✓` : `“${key}” found ✓`) : (bn ? `“${key}” নেই ✗` : `“${key}” absent ✗`),
    3
  ));
  return { steps, found };
}

export function htDeleteTrace(buckets: string[][], key: string, lang: Lang = "en"): { steps: HTStep[]; buckets: string[][] } {
  const bn = lang === "bn";
  const { sum, bucket } = htHash(key);
  const next = buckets.map((b) => [...b]);
  const steps: HTStep[] = [
    htSnap(buckets, -1, key, null, bn ? `h(“${key}”) বের করো` : `Hash “${key}”`, 0),
    htSnap(buckets, bucket, key, null, bn ? `${sum} % ${HT_SIZE} = [${bucket}]` : `${sum} % ${HT_SIZE} = [${bucket}]`, 1),
  ];
  const i = next[bucket].indexOf(key);
  if (i === -1) {
    steps.push(htSnap(next, bucket, key, false, bn ? `“${key}” নেই — কিছুই না` : `“${key}” absent — nothing`, 3));
    return { steps, buckets: next };
  }
  next[bucket].splice(i, 1);
  steps.push(htSnap(next, bucket, key, true, bn ? `চেইন থেকে “${key}” কাটো ✓` : `Unlink “${key}” ✓`, 2));
  return { steps, buckets: next };
}

export const HT_CODE = [
  "h = hash(key)",
  "bucket = h % m",
  "chain: append / unlink",
  "verdict",
];

/* ================= hash functions compare ================= */

export type HFRow = { id: string; name: string; hash: number; bucket: number; maxChain: number };

export function hfAnalyze(word: string, size: number, samples: string[]): HFRow[] {
  return HASH_FNS.map(({ id, name, fn }) => {
    const hash = fn(word);
    const chains = new Map<number, number>();
    for (const w of samples) {
      const b = fn(w) % size;
      chains.set(b, (chains.get(b) ?? 0) + 1);
    }
    return { id, name, hash, bucket: hash % size, maxChain: Math.max(0, ...chains.values()) };
  });
}

export const SAMPLE_WORDS = ["apple", "mango", "grape", "peach", "lemon", "melon", "berry", "cherry", "papaya", "olive", "onion", "carrot", "potato", "tomato", "pepper", "beans", "honey", "sugar", "bread", "pasta"];

/* ================= bloom filter ================= */

export const BLOOM_M = 32;
export const BLOOM_K = 3;

export function bloomHashes(word: string): number[] {
  const out: number[] = [];
  for (let s = 0; s < BLOOM_K; s++) out.push(djb2(word, 5381 + s * 101) % BLOOM_M);
  return out;
}

export type BStep = {
  bits: boolean[];
  at: number[];
  cur: string;
  verdict: boolean | null;
  desc: string;
  codeLine: number;
};

export function bloomTrace(bits: boolean[], op: "add" | "ask", word: string, lang: Lang = "en"): {
  steps: BStep[]; bits: boolean[]; present: boolean;
} {
  const bn = lang === "bn";
  const w = cleanWord(word);
  const hs = bloomHashes(w);
  const steps: BStep[] = [{
    bits: [...bits], at: [], cur: w, verdict: null,
    desc: bn ? `“${w}” → ${hs.join(", ")}` : `“${w}” → bits ${hs.join(", ")}`,
    codeLine: 0,
  }];
  if (op === "add") {
    const next = [...bits];
    for (const h of hs) {
      next[h] = true;
      steps.push({
        bits: [...next], at: [h], cur: w, verdict: null,
        desc: bn ? `bit[${h}] = 1` : `bit[${h}] = 1`,
        codeLine: 1,
      });
    }
    steps.push({ bits: [...next], at: hs, cur: w, verdict: true, desc: bn ? "যোগ হয়েছে ✓" : "Added ✓", codeLine: 3 });
    return { steps, bits: next, present: true };
  }
  for (const h of hs) {
    const on = bits[h];
    steps.push({
      bits: [...bits], at: [h], cur: w, verdict: null,
      desc: on
        ? (bn ? `bit[${h}] = 1 …` : `bit[${h}] = 1 …`)
        : (bn ? `bit[${h}] = 0 — নিশ্চিত নেই ✗` : `bit[${h}] = 0 — definitely absent ✗`),
      codeLine: 2,
    });
    if (!on) {
      steps.push({ bits: [...bits], at: hs, cur: w, verdict: false, desc: bn ? "নেই ✓ (ভুল-নেতি অসম্ভব)" : "Absent ✓ (no false negatives)", codeLine: 3 });
      return { steps, bits, present: false };
    }
  }
  steps.push({
    bits: [...bits], at: hs, cur: w, verdict: true,
    desc: bn ? "সব 1 — হয়তো আছে (ভুল-পজিটিভ সম্ভব)" : "All 1s — maybe present (false positives possible)",
    codeLine: 3,
  });
  return { steps, bits, present: true };
}

export function bloomFPR(inserted: number): number {
  const m = BLOOM_M;
  const k = BLOOM_K;
  return Math.pow(1 - Math.exp((-k * inserted) / m), k);
}

export const BLOOM_CODE = [
  "k hashes → positions",
  "add: set bits",
  "ask: all set?",
  "verdict",
];
