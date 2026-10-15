import type { Lang } from "./dict";

export type KMPStep = {
  text: string[];
  pat: string[];
  lps: (number | null)[];
  shift: number; // text index where pattern starts
  ti: number; // text pointer (-1 if n/a)
  pj: number; // pattern pointer (-1 if n/a)
  phase: "lps" | "search";
  ok: boolean | null; // compare result at (ti,pj)
  fallback: [number, number] | null; // j: from -> to
  foundAt: number | null;
  done: boolean;
  desc: string;
  codeLine: number;
};

export type KMPResult = {
  steps: KMPStep[];
  foundAt: number;
  comparisons: number;
};

function computeLPS(pat: string[]): number[] {
  const lps = Array(pat.length).fill(0);
  let len = 0;
  let i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  return lps;
}

function snap(
  text: string[],
  pat: string[],
  lps: (number | null)[],
  extra: Partial<KMPStep>
): KMPStep {
  return {
    text,
    pat,
    lps: [...lps],
    shift: 0,
    ti: -1,
    pj: -1,
    phase: "search",
    ok: null,
    fallback: null,
    foundAt: null,
    done: false,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

export function kmpTrace(textRaw: string, patRaw: string, lang: Lang = "en"): KMPResult {
  const bn = lang === "bn";
  const text = textRaw.toLowerCase().replace(/[^a-z]/g, "").split("").slice(0, 24);
  const pat = patRaw.toLowerCase().replace(/[^a-z]/g, "").split("").slice(0, 8);
  const steps: KMPStep[] = [];
  let comparisons = 0;
  let foundAt = -1;

  if (pat.length === 0 || text.length === 0) {
    steps.push(
      snap(text, pat, [], {
        done: true,
        desc: bn ? "খালি টেক্সট/প্যাটার্ন" : "Empty text/pattern",
        codeLine: 0,
      })
    );
    return { steps, foundAt, comparisons };
  }

  // ---- phase 1: LPS table ----
  const lpsFull = computeLPS(pat);
  const lpsShown: (number | null)[] = Array(pat.length).fill(null);
  lpsShown[0] = 0;
  steps.push(
    snap(text, pat, lpsShown, {
      phase: "lps",
      desc: bn ? "LPS টেবিল বানাও: lps[0] = 0" : "Build LPS table: lps[0] = 0",
      codeLine: 1,
    })
  );
  {
    let len = 0;
    let i = 1;
    while (i < pat.length) {
      comparisons++;
      if (pat[i] === pat[len]) {
        len++;
        lpsShown[i] = len;
        steps.push(
          snap(text, pat, lpsShown, {
            phase: "lps",
            ti: len - 1,
            pj: i,
            ok: true,
            desc: bn
              ? `pat[${i}]="${pat[i]}" মিলেছে — lps[${i}] = ${len}`
              : `pat[${i}]="${pat[i]}" matches — lps[${i}] = ${len}`,
            codeLine: 1,
          })
        );
        i++;
      } else if (len > 0) {
        const from = len;
        len = lpsFull[len - 1];
        steps.push(
          snap(text, pat, lpsShown, {
            phase: "lps",
            ti: len,
            pj: i,
            ok: false,
            fallback: [from, len],
            desc: bn
              ? `অমিল — len ফিরে যাও ${from} → ${len}`
              : `Mismatch — fall len back ${from} → ${len}`,
            codeLine: 2,
          })
        );
      } else {
        lpsShown[i] = 0;
        steps.push(
          snap(text, pat, lpsShown, {
            phase: "lps",
            ti: 0,
            pj: i,
            ok: false,
            desc: bn ? `অমিল, len=0 — lps[${i}] = 0` : `Mismatch, len=0 — lps[${i}] = 0`,
            codeLine: 2,
          })
        );
        i++;
      }
    }
  }

  // ---- phase 2: search ----
  const lpsDone = lpsFull.map((v) => v as number | null);
  let i = 0;
  let j = 0;
  steps.push(
    snap(text, pat, lpsDone, {
      phase: "search",
      shift: 0,
      ti: 0,
      pj: 0,
      desc: bn ? "খোঁজা শুরু — text[0] বনাম pat[0]" : "Search begins — text[0] vs pat[0]",
      codeLine: 3,
    })
  );
  while (i < text.length) {
    if (j < pat.length && text[i] === pat[j]) {
      comparisons++;
      steps.push(
        snap(text, pat, lpsDone, {
          phase: "search",
          shift: i - j,
          ti: i,
          pj: j,
          ok: true,
          desc: bn
            ? `"${text[i]}" মিলেছে — এগিয়ে যাও`
            : `"${text[i]}" matches — advance both`,
          codeLine: 4,
        })
      );
      i++;
      j++;
      if (j === pat.length) {
        foundAt = i - j;
        steps.push(
          snap(text, pat, lpsDone, {
            phase: "search",
            shift: foundAt,
            ti: i - 1,
            pj: j - 1,
            ok: true,
            foundAt,
            done: true,
            desc: bn ? `মিলেছে ইনডেক্স ${foundAt}-এ!` : `Match at index ${foundAt}!`,
            codeLine: 4,
          })
        );
        break;
      }
    } else if (j > 0) {
      const from = j;
      j = lpsFull[j - 1];
      steps.push(
        snap(text, pat, lpsDone, {
          phase: "search",
          shift: i - j,
          ti: i,
          pj: j,
          ok: false,
          fallback: [from, j],
          desc: bn
            ? `"${text[i]}" অমিল — j ফিরে যাও ${from} → ${j}, text থামে`
            : `"${text[i]}" mismatches — j falls back ${from} → ${j}, text stays`,
          codeLine: 5,
        })
      );
    } else {
      comparisons++;
      steps.push(
        snap(text, pat, lpsDone, {
          phase: "search",
          shift: i,
          ti: i,
          pj: 0,
          ok: false,
          desc: bn
            ? `"${text[i]}" অমিল, j=0 — text এগিয়ে যাও`
            : `"${text[i]}" mismatches, j=0 — move text on`,
          codeLine: 5,
        })
      );
      i++;
    }
  }
  if (foundAt === -1) {
    steps.push(
      snap(text, pat, lpsDone, {
        phase: "search",
        done: true,
        desc: bn ? "টেক্সট শেষ — প্যাটার্ন নেই" : "Text exhausted — pattern absent",
        codeLine: 5,
      })
    );
  }
  return { steps, foundAt, comparisons };
}

export const KMP_CODE = [
  "build LPS table for pattern",
  "  match → len++, lps[i] = len",
  "  mismatch → len = lps[len-1]",
  "search: compare text[i], pat[j]",
  "  match → i++, j++ (j==m: found)",
  "  mismatch → j = lps[j-1], text stays",
];
