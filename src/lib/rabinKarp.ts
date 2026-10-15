import type { Lang } from "./dict";

export type RKStep = {
  text: string[];
  pat: string[];
  win: [number, number] | null;
  hashW: number | null;
  hashP: number;
  verify: number[]; // pattern indices verified so far this window
  mismatchAt: number | null; // text index of failed verify
  hit: boolean;
  done: boolean;
  desc: string;
  codeLine: number;
};

export type RKResult = {
  steps: RKStep[];
  foundAt: number;
  hashHits: number;
};

const BASE = 31;
const MOD = 101;

function h(ch: string): number {
  return ch.charCodeAt(0) - 96; // a=1..z=26
}

function hashOf(s: string[]): number {
  let v = 0;
  for (const ch of s) v = (v * BASE + h(ch)) % MOD;
  return v;
}

function snap(
  text: string[],
  pat: string[],
  hashP: number,
  extra: Partial<RKStep>
): RKStep {
  return {
    text,
    pat,
    win: null,
    hashW: null,
    hashP,
    verify: [],
    mismatchAt: null,
    hit: false,
    done: false,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function rabinKarpTrace(
  textRaw: string,
  patRaw: string,
  lang: Lang = "en"
): RKResult {
  const bn = lang === "bn";
  const text = textRaw.toLowerCase().replace(/[^a-z]/g, "").split("").slice(0, 24);
  const pat = patRaw.toLowerCase().replace(/[^a-z]/g, "").split("").slice(0, 8);
  const steps: RKStep[] = [];
  let foundAt = -1;
  let hashHits = 0;

  if (pat.length === 0 || text.length === 0 || pat.length > text.length) {
    steps.push(
      snap(text, pat, 0, {
        done: true,
        desc: bn ? "খালি/বড় প্যাটার্ন — খোঁজা অসম্ভব" : "Empty/oversized pattern — nothing to search",
        codeLine: 0,
      })
    );
    return { steps, foundAt, hashHits };
  }

  const hashP = hashOf(pat);
  const m = pat.length;
  steps.push(
    snap(text, pat, hashP, {
      desc: bn
        ? `প্যাটার্ন হ্যাশ = ${hashP} (mod ${MOD}) — উইন্ডো মিলাও`
        : `Pattern hash = ${hashP} (mod ${MOD}) — match windows against it`,
      codeLine: 1,
    })
  );

  let prev = "";
  for (let s = 0; s <= text.length - m; s++) {
    const win = text.slice(s, s + m);
    const hw = hashOf(win);
    steps.push(
      snap(text, pat, hashP, {
        win: [s, s + m - 1],
        hashW: hw,
        desc:
          s === 0
            ? bn
              ? `উইন্ডো [0..${m - 1}] হ্যাশ = ${hw}`
              : `Window [0..${m - 1}] hashes to ${hw}`
            : bn
              ? `রোল করো: ${prev} বাদ, ${text[s + m - 1]} যোগ → ${hw}`
              : `Roll: drop ${prev}, add ${text[s + m - 1]} → ${hw}`,
        codeLine: s === 0 ? 1 : 2,
      })
    );
    prev = text[s];
    if (hw !== hashP) {
      steps.push(
        snap(text, pat, hashP, {
          win: [s, s + m - 1],
          hashW: hw,
          desc: bn ? `${hw} ≠ ${hashP} — এগিয়ে যাও` : `${hw} ≠ ${hashP} — slide on`,
          codeLine: 3,
        })
      );
      continue;
    }
    hashHits++;
    // verify char by char
    let ok = true;
    for (let k = 0; k < m; k++) {
      if (win[k] !== pat[k]) {
        ok = false;
        steps.push(
          snap(text, pat, hashP, {
            win: [s, s + m - 1],
            hashW: hw,
            verify: Array.from({ length: k }, (_, q) => q),
            mismatchAt: s + k,
            desc: bn
              ? `হ্যাশ মিলেছে কিন্তু "${win[k]}" ≠ "${pat[k]}" — ভুয়া (spurious)`
              : `Hash hit but "${win[k]}" ≠ "${pat[k]}" — spurious`,
            codeLine: 4,
          })
        );
        break;
      }
    }
    if (ok) {
      foundAt = s;
      steps.push(
        snap(text, pat, hashP, {
          win: [s, s + m - 1],
          hashW: hw,
          verify: Array.from({ length: m }, (_, q) => q),
          hit: true,
          done: true,
          desc: bn ? `সব অক্ষর মিলেছে — ইনডেক্স ${s}-এ!` : `All chars match — found at ${s}!`,
          codeLine: 4,
        })
      );
      break;
    }
  }
  if (foundAt === -1) {
    steps.push(
      snap(text, pat, hashP, {
        done: true,
        desc: bn ? "সব উইন্ডো শেষ — প্যাটার্ন নেই" : "All windows checked — pattern absent",
        codeLine: 5,
      })
    );
  }
  return { steps, foundAt, hashHits };
}

export const RK_CODE = [
  "hashP = hash(pattern)",
  "hash first window",
  "roll: drop left, add right",
  "hash equal? skip window",
  "verify chars (hash can lie)",
  "done",
];
