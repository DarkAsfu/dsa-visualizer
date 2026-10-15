import type { Lang } from "./dict";

/* ================= circular queue ================= */

export type CStep = {
  buf: (number | null)[];
  front: number;
  rear: number;
  count: number;
  hi: number[];
  desc: string;
  codeLine: number;
};

export type CState = { buf: (number | null)[]; front: number; rear: number; count: number };

export const CIRC_CAP = 6;

export function circEnqueue(st: CState, v: number, lang: Lang = "en"): { steps: CStep[]; state: CState } {
  const bn = lang === "bn";
  const cap = st.buf.length;
  const steps: CStep[] = [];
  if (st.count === cap) {
    steps.push({
      buf: [...st.buf], front: st.front, rear: st.rear, count: st.count, hi: [],
      desc: bn ? "ভর্তি! rear ঘুরে front-এ ঠেকেছে" : "Full! rear wrapped into front",
      codeLine: 3,
    });
    return { steps, state: st };
  }
  const rear = (st.rear + 1) % cap;
  const buf = [...st.buf];
  buf[rear] = v;
  const first = st.count === 0;
  const state: CState = { buf, front: first ? rear : st.front, rear, count: st.count + 1 };
  steps.push({
    buf: [...st.buf], front: st.front, rear: st.rear, count: st.count, hi: [rear],
    desc: bn ? `rear = (${st.rear}+1) % ${cap} = ${rear}` : `rear = (${st.rear}+1) % ${cap} = ${rear}`,
    codeLine: 0,
  });
  steps.push({
    buf, front: state.front, rear, count: state.count, hi: [rear],
    desc: bn ? `${v} বসলো [${rear}]${first ? " · front-ও এখানে" : ""}` : `${v} lands at [${rear}]${first ? " · front too" : ""}`,
    codeLine: 1,
  });
  return { steps, state };
}

export function circDequeue(st: CState, lang: Lang = "en"): { steps: CStep[]; state: CState; out: number | null } {
  const bn = lang === "bn";
  const cap = st.buf.length;
  if (st.count === 0) {
    return {
      steps: [{
        buf: [...st.buf], front: st.front, rear: st.rear, count: 0, hi: [],
        desc: bn ? "খালি — নেওয়ার কিছু নেই" : "Empty — nothing to take",
        codeLine: 3,
      }],
      state: st,
      out: null,
    };
  }
  const out = st.buf[st.front]!;
  const buf = [...st.buf];
  buf[st.front] = null;
  const front = (st.front + 1) % cap;
  const last = st.count === 1;
  const state: CState = { buf, front: last ? st.rear : front, rear: st.rear, count: st.count - 1 };
  return {
    steps: [
      {
        buf: [...st.buf], front: st.front, rear: st.rear, count: st.count, hi: [st.front],
        desc: bn ? `front [${st.front}] থেকে ${out} নাও` : `Take ${out} from front [${st.front}]`,
        codeLine: 2,
      },
      {
        buf, front: state.front, rear: st.rear, count: state.count, hi: [],
        desc: bn ? `front = (${st.front}+1) % ${cap} = ${front}${last ? " · এখন খালি" : ""}` : `front = (${st.front}+1) % ${cap} = ${front}${last ? " · now empty" : ""}`,
        codeLine: 2,
      },
    ],
    state,
    out,
  };
}

export const CIRC_CODE = [
  "rear = (rear+1) % k",
  "buf[rear] = x",
  "x = buf[front]; front = (front+1) % k",
  "full / empty guard",
];

/* ================= monotonic stack + NGE ================= */

export type MStep = {
  stack: number[];
  i: number;
  popped: number[];
  ans: (number | null)[];
  hi: number[];
  desc: string;
  codeLine: number;
};

export function monoTrace(values: number[], lang: Lang = "en"): { steps: MStep[]; stack: number[] } {
  const bn = lang === "bn";
  const stack: number[] = [];
  const popped: number[] = [];
  const steps: MStep[] = [{
    stack: [], i: -1, popped: [], ans: values.map(() => null), hi: [],
    desc: bn ? "খালি স্ট্যাক থেকে শুরু" : "Start with an empty stack",
    codeLine: 0,
  }];
  values.forEach((x, i) => {
    while (stack.length > 0 && stack[stack.length - 1] > x) {
      const t = stack.pop()!;
      popped.push(t);
      steps.push({
        stack: [...stack], i, popped: [...popped], ans: values.map(() => null), hi: [],
        desc: bn ? `${t} > ${x} — ${t}-কে ফেলো` : `${t} > ${x} — pop ${t}`,
        codeLine: 1,
      });
    }
    stack.push(x);
    steps.push({
      stack: [...stack], i, popped: [...popped], ans: values.map(() => null), hi: [stack.length - 1],
      desc: bn ? `${x}-কে ঠেলো (স্ট্যাক বাড়ন্তই থাকলো)` : `Push ${x} (stack stays increasing)`,
      codeLine: 2,
    });
  });
  steps.push({
    stack: [...stack], i: values.length, popped: [...popped], ans: values.map(() => null), hi: [],
    desc: bn ? "স্ট্যাক বাড়ন্ত ✓" : "Stack is increasing ✓",
    codeLine: 3,
  });
  return { steps, stack };
}

export function ngeTrace(values: number[], lang: Lang = "en"): { steps: MStep[]; ans: number[] } {
  const bn = lang === "bn";
  const stack: number[] = [];
  const ans: (number | null)[] = values.map(() => null);
  const steps: MStep[] = [{
    stack: [], i: values.length, popped: [], ans: [...ans], hi: [],
    desc: bn ? "ডান থেকে বামে — স্ট্যাকে বড়রা অপেক্ষা করে" : "Right to left — bigger elements wait on the stack",
    codeLine: 0,
  }];
  for (let i = values.length - 1; i >= 0; i--) {
    const x = values[i];
    while (stack.length > 0 && stack[stack.length - 1] <= x) {
      const t = stack.pop()!;
      steps.push({
        stack: [...stack], i, popped: [], ans: [...ans], hi: [],
        desc: bn ? `${t} ≤ ${x} — ${t} কখনো উত্তর হবে না` : `${t} ≤ ${x} — ${t} can never be the answer`,
        codeLine: 1,
      });
    }
    ans[i] = stack.length === 0 ? -1 : stack[stack.length - 1];
    steps.push({
      stack: [...stack], i, popped: [], ans: [...ans], hi: [],
      desc: bn ? `NGE[${x}] = ${ans[i]}` : `NGE[${x}] = ${ans[i]}`,
      codeLine: 2,
    });
    stack.push(x);
    steps.push({
      stack: [...stack], i, popped: [], ans: [...ans], hi: [stack.length - 1],
      desc: bn ? `${x}-কে ঠেলো — বামের জন্য অপেক্ষা` : `Push ${x} — it waits for the left`,
      codeLine: 2,
    });
  }
  steps.push({
    stack: [...stack], i: -1, popped: [], ans: [...ans], hi: [],
    desc: bn ? "সব উত্তর তৈরি ✓" : "All answers ready ✓",
    codeLine: 3,
  });
  return { steps, ans: ans as number[] };
}

export const MONO_CODE = [
  "for x in values",
  "while top > x: pop",
  "push x",
  "increasing ✓",
];

export const NGE_CODE = [
  "scan right → left",
  "pop while top ≤ x",
  "answer = top ?? −1; push x",
  "done",
];

/* ================= infix → postfix ================= */

export type IStep = {
  out: string[];
  ops: string[];
  pos: number;
  hiOut: boolean;
  desc: string;
  codeLine: number;
};

const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };

export function tokenize(expr: string): string[] {
  const out: string[] = [];
  let num = "";
  for (const ch of expr.replace(/\s+/g, "")) {
    if (/[0-9]/.test(ch)) num += ch;
    else {
      if (num) { out.push(num); num = ""; }
      if ("+-*/^()".includes(ch)) out.push(ch);
    }
  }
  if (num) out.push(num);
  return out.slice(0, 14);
}

function applyOp(a: number, b: number, op: string): number {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? NaN : Math.trunc(a / b);
  return Math.pow(a, b);
}

export function infixTrace(expr: string, lang: Lang = "en"): { steps: IStep[]; postfix: string[]; value: number } {
  const bn = lang === "bn";
  const toks = tokenize(expr);
  const out: string[] = [];
  const ops: string[] = [];
  const steps: IStep[] = [{
    out: [], ops: [], pos: -1, hiOut: false,
    desc: bn ? `পড়ো: ${toks.join(" ")}` : `Read: ${toks.join(" ")}`,
    codeLine: 0,
  }];
  const snap = (pos: number, hiOut: boolean, desc: string, codeLine: number) => {
    steps.push({ out: [...out], ops: [...ops], pos, hiOut, desc, codeLine });
  };
  toks.forEach((t, i) => {
    if (/^[0-9]+$/.test(t)) {
      out.push(t);
      snap(i, true, bn ? `${t} সংখ্যা — সরাসরি বাইরে` : `${t} is a number — straight to output`, 1);
    } else if (t === "(") {
      ops.push(t);
      snap(i, false, bn ? "( — স্ট্যাকে রাখো" : "( — park on stack", 2);
    } else if (t === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        const o = ops.pop()!;
        out.push(o);
        snap(i, true, bn ? `) পেয়ে ${o}-কে নামাও` : `On ) — flush ${o}`, 3);
      }
      ops.pop();
      snap(i, false, bn ? "( বাদ দাও" : `Drop the (`, 3);
    } else {
      while (ops.length > 0 && ops[ops.length - 1] !== "(" && (PREC[ops[ops.length - 1]] ?? 0) >= (PREC[t] ?? 0)) {
        const o = ops.pop()!;
        out.push(o);
        snap(i, true, bn ? `${o}-এর প্রাধান্য ≥ ${t} — আগে নামাও` : `${o} binds ≥ ${t} — flush first`, 2);
      }
      ops.push(t);
      snap(i, false, bn ? `অপারেটর ${t} স্ট্যাকে` : `Operator ${t} on stack`, 2);
    }
  });
  while (ops.length > 0) {
    const o = ops.pop()!;
    out.push(o);
    snap(toks.length - 1, true, bn ? `শেষে ${o}-কে নামাও` : `Flush ${o} at the end`, 4);
  }
  // evaluate
  const st: number[] = [];
  for (const t of out) {
    if (/^[0-9]+$/.test(t)) st.push(Number(t));
    else {
      const b = st.pop() ?? NaN;
      const a = st.pop() ?? NaN;
      st.push(applyOp(a, b, t));
    }
  }
  const value = st[0] ?? NaN;
  snap(toks.length - 1, false, bn ? `মান = ${value} ✓` : `Value = ${value} ✓`, 4);
  return { steps, postfix: out, value };
}

export const INFIX_CODE = [
  "read tokens",
  "number → output",
  "operator → pop ≥ prec, push",
  ") → flush to (",
  "flush rest + evaluate",
];

/* ================= LRU cache ================= */

export type LStep = {
  order: number[];
  vals: Record<number, number>;
  cur: number | null;
  hit: boolean | null;
  hits: number;
  miss: number;
  desc: string;
  codeLine: number;
};

export function parseLRU(s: string): Array<{ op: "get" | "put"; k: number; v?: number }> {
  const out: Array<{ op: "get" | "put"; k: number; v?: number }> = [];
  for (const t of s.trim().split(/\s+/).slice(0, 12)) {
    const m = t.match(/^([gp])(\d+)(?::(\d+))?$/i);
    if (!m) continue;
    const k = Number(m[2]);
    if (!Number.isInteger(k) || k < 0 || k > 99) continue;
    if (m[1].toLowerCase() === "g") out.push({ op: "get", k });
    else out.push({ op: "put", k, v: m[3] === undefined ? k * 10 : Number(m[3]) });
  }
  return out;
}

export function lruTrace(cap: number, ops: Array<{ op: "get" | "put"; k: number; v?: number }>, lang: Lang = "en"): {
  steps: LStep[]; order: number[]; hits: number; miss: number;
} {
  const bn = lang === "bn";
  const order: number[] = [];
  const vals: Record<number, number> = {};
  let hits = 0;
  let miss = 0;
  const steps: LStep[] = [{
    order: [], vals: {}, cur: null, hit: null, hits: 0, miss: 0,
    desc: bn ? `ধারণক্ষমতা ${cap} — খালি ক্যাশ` : `Capacity ${cap} — empty cache`,
    codeLine: 0,
  }];
  const snap = (cur: number | null, hit: boolean | null, desc: string, codeLine: number) => {
    steps.push({ order: [...order], vals: { ...vals }, cur, hit, hits, miss, desc, codeLine });
  };
  for (const o of ops) {
    if (o.op === "get") {
      if (o.k in vals) {
        hits++;
        order.splice(order.indexOf(o.k), 1);
        order.unshift(o.k);
        snap(o.k, true, bn ? `get(${o.k}) = ${vals[o.k]} ✓ — সামনে আনো` : `get(${o.k}) = ${vals[o.k]} ✓ — move to front`, 1);
      } else {
        miss++;
        snap(o.k, false, bn ? `get(${o.k}) — নেই ✗` : `get(${o.k}) — miss ✗`, 1);
      }
    } else {
      const v = o.v ?? o.k * 10;
      if (o.k in vals) {
        vals[o.k] = v;
        order.splice(order.indexOf(o.k), 1);
        order.unshift(o.k);
        snap(o.k, true, bn ? `put(${o.k}) — মান বদলে সামনে` : `put(${o.k}) — update + front`, 2);
      } else {
        if (order.length === cap && cap > 0) {
          const ev = order.pop()!;
          delete vals[ev];
          snap(o.k, null, bn ? `${ev} সবচেয়ে পুরনো — বাদ` : `${ev} is stalest — evict`, 3);
        }
        if (cap > 0) {
          vals[o.k] = v;
          order.unshift(o.k);
        }
        snap(o.k, null, bn ? `put(${o.k}=${v})` : `put(${o.k}=${v})`, 2);
      }
    }
  }
  snap(null, null, bn ? `শেষ: হিট ${hits}, মিস ${miss}` : `Done: ${hits} hits, ${miss} misses`, 4);
  return { steps, order, hits, miss };
}

export const LRU_CODE = [
  "capacity + empty cache",
  "get: hit → front",
  "put: evict tail if full",
  "done",
];
