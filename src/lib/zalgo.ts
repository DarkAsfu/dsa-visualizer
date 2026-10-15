import type { Lang } from "./dict";

export type ZStep = {
  chars: string[];
  z: (number | null)[];
  l: number;
  r: number;
  i: number;
  focus?: number[];
  box: [number, number] | null; // current Z-box
  desc: string;
  codeLine: number;
};

export type ZResult = {
  steps: ZStep[];
  z: number[];
};

function snap(chars: string[], z: (number | null)[], extra: Partial<ZStep>): ZStep {
  return {
    chars,
    z: [...z],
    l: 0,
    r: 0,
    i: -1,
    box: null,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function zTrace(input: string, lang: Lang = "en"): ZResult {
  const bn = lang === "bn";
  const chars = input.toLowerCase().replace(/[^a-z]/g, "").split("").slice(0, 16);
  const n = chars.length;
  const z: (number | null)[] = Array(n).fill(null);
  const steps: ZStep[] = [];
  if (n === 0) {
    steps.push(snap(chars, z, { desc: bn ? "খালি স্ট্রিং" : "Empty string", codeLine: 0 }));
    return { steps, z: [] };
  }
  z[0] = n;
  steps.push(
    snap(chars, z, {
      i: 0,
      desc: bn ? `Z[0] = ${n} সবসময় (পুরো স্ট্রিং)` : `Z[0] = ${n} always (whole string)`,
      codeLine: 0,
    })
  );
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i > r) {
      // naive compare
      let len = 0;
      while (i + len < n && chars[len] === chars[i + len]) {
        len++;
      }
      z[i] = len;
      if (len > 0) {
        l = i;
        r = i + len - 1;
      }
      steps.push(
        snap(chars, z, {
          l,
          r,
          i,
          focus: Array.from({ length: len }, (_, k) => i + k),
          box: len > 0 ? [l, r] : null,
          desc: bn
            ? `বক্সের বাইরে — সরাসরি মিলাও: Z[${i}] = ${len}`
            : `Outside any box — compare directly: Z[${i}] = ${len}`,
          codeLine: 1,
        })
      );
    } else {
      const k = i - l;
      const remaining = r - i + 1;
      if ((z[k] ?? 0) < remaining) {
        z[i] = z[k];
        steps.push(
          snap(chars, z, {
            l,
            r,
            i,
            focus: [i],
            box: [l, r],
            desc: bn
              ? `বক্সের ভেতরে: Z[${i}] = Z[${k}] = ${z[k]} (কপি)`
              : `Inside box: Z[${i}] = Z[${k}] = ${z[k]} (copy)`,
            codeLine: 2,
          })
        );
      } else {
        let len = remaining;
        while (i + len < n && chars[len] === chars[i + len]) {
          len++;
        }
        z[i] = len;
        l = i;
        r = i + len - 1;
        steps.push(
          snap(chars, z, {
            l,
            r,
            i,
            focus: Array.from({ length: len }, (_, k2) => i + k2),
            box: [l, r],
            desc: bn
              ? `প্রান্ত ছুঁয়েছে — বাড়াও: Z[${i}] = ${len}, বক্স [${l}..${r}]`
              : `Touched the edge — extend: Z[${i}] = ${len}, box [${l}..${r}]`,
            codeLine: 3,
          })
        );
      }
    }
  }
  steps.push(
    snap(chars, z, {
      l,
      r,
      i: n,
      desc: bn ? "শেষ — Z-অ্যারে সম্পূর্ণ" : "Done — Z-array complete",
      codeLine: 4,
    })
  );
  return { steps, z: z as number[] };
}

export const Z_CODE = [
  "Z[0] = n always",
  "i outside box → compare directly",
  "i inside, Z[k] fits → copy it",
  "i inside, hits edge → extend box",
  "done",
];
