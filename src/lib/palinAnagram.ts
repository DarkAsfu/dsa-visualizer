import type { Lang } from "./dict";

export type PalStep = {
  chars: string[];
  l: number;
  r: number;
  verdict: boolean | null;
  mismatch: boolean;
  desc: string;
  codeLine: number;
};

export type AnaStep = {
  chars: string[]; // distinct sorted chars
  ca: (number | null)[];
  cb: (number | null)[];
  focus: number;
  verdict: boolean | null;
  desc: string;
  codeLine: number;
};

function clean(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .split("")
    .slice(0, 20);
}

export function palindromeTrace(
  input: string,
  lang: Lang = "en"
): { steps: PalStep[]; verdict: boolean } {
  const bn = lang === "bn";
  const chars = clean(input);
  const steps: PalStep[] = [
    {
      chars,
      l: 0,
      r: chars.length - 1,
      verdict: null,
      mismatch: false,
      desc: bn ? `দুই প্রান্ত থেকে মিলাও: "${input}"` : `Match from both ends: "${input}"`,
      codeLine: 0,
    },
  ];
  let verdict = true;
  let l = 0;
  let r = chars.length - 1;
  while (l < r) {
    if (chars[l] === chars[r]) {
      steps.push({
        chars,
        l,
        r,
        verdict: null,
        mismatch: false,
        desc: bn
          ? `"${chars[l]}" == "${chars[r]}" — ভেতরে যাও`
          : `"${chars[l]}" == "${chars[r]}" — move inward`,
        codeLine: 1,
      });
      l++;
      r--;
    } else {
      verdict = false;
      steps.push({
        chars,
        l,
        r,
        verdict: false,
        mismatch: true,
        desc: bn
          ? `"${chars[l]}" ≠ "${chars[r]}" — প্যালিনড্রোম নয়`
          : `"${chars[l]}" ≠ "${chars[r]}" — not a palindrome`,
        codeLine: 2,
      });
      break;
    }
  }
  if (verdict) {
    steps.push({
      chars,
      l,
      r,
      verdict: true,
      mismatch: false,
      desc: bn ? "সব মিলেছে — প্যালিনড্রোম!" : "All matched — palindrome!",
      codeLine: 3,
    });
  }
  return { steps, verdict };
}

export function anagramTrace(
  sa: string,
  sb: string,
  lang: Lang = "en"
): { steps: AnaStep[]; verdict: boolean } {
  const bn = lang === "bn";
  const A = clean(sa);
  const B = clean(sb);
  const distinct = [...new Set([...A, ...B])].sort();
  const steps: AnaStep[] = [];
  let verdict = true;
  if (A.length !== B.length) {
    verdict = false;
    steps.push({
      chars: distinct,
      ca: distinct.map(() => null),
      cb: distinct.map(() => null),
      focus: -1,
      verdict: false,
      desc: bn
        ? `দৈর্ঘ্য আলাদা (${A.length} বনাম ${B.length}) — অ্যানাগ্রাম নয়`
        : `Different lengths (${A.length} vs ${B.length}) — not anagrams`,
      codeLine: 0,
    });
    return { steps, verdict };
  }
  steps.push({
    chars: distinct,
    ca: distinct.map(() => null),
    cb: distinct.map(() => null),
    focus: -1,
    verdict: null,
    desc: bn ? "প্রতিটা অক্ষর দুই স্ট্রিং-এ গুনো" : "Count every letter in both strings",
    codeLine: 1,
  });
  const ca: (number | null)[] = distinct.map(() => null);
  const cb: (number | null)[] = distinct.map(() => null);
  for (let i = 0; i < distinct.length; i++) {
    const ch = distinct[i];
    ca[i] = A.filter((c) => c === ch).length;
    cb[i] = B.filter((c) => c === ch).length;
    if (ca[i] !== cb[i]) verdict = false;
    steps.push({
      chars: distinct,
      ca: [...ca],
      cb: [...cb],
      focus: i,
      verdict: null,
      desc: bn
        ? `"${ch}": ${ca[i]} বনাম ${cb[i]}${ca[i] === cb[i] ? " — মিলেছে" : " — অমিল"}`
        : `"${ch}": ${ca[i]} vs ${cb[i]}${ca[i] === cb[i] ? " — match" : " — differ"}`,
      codeLine: 2,
    });
  }
  steps.push({
    chars: distinct,
    ca: [...ca],
    cb: [...cb],
    focus: -1,
    verdict,
    desc: bn
      ? verdict
        ? "সব গণনা মিলেছে — অ্যানাগ্রাম!"
        : "গণনা অমিল — অ্যানাগ্রাম নয়"
      : verdict
        ? "All counts match — anagrams!"
        : "Counts differ — not anagrams",
    codeLine: 3,
  });
  return { steps, verdict };
}

export const PALIN_CODE = [
  "l = 0, r = n-1",
  "while l < r: compare s[l], s[r]",
  "  mismatch → not palindrome",
  "met in middle → palindrome",
];

export const ANAGRAM_CODE = [
  "if lengths differ → false",
  "count each letter in both",
  "compare counts letter by letter",
  "all equal → anagrams",
];
