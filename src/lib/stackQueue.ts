import type { Lang } from "./dict";

export type SQMode = "stack" | "queue" | "paren";

export type SQStep = {
  items: (number | string)[];
  hi?: number[];
  stackView?: string[];
  pos?: number;
  verdict?: boolean | null;
  desc: string;
  codeLine: number;
};

export type SQResult = {
  steps: SQStep[];
  finalItems: (number | string)[];
};

function snap(items: (number | string)[], extra: Partial<SQStep> = {}): SQStep {
  return { items: [...items], desc: "", codeLine: 0, ...extra };
}

export function pushTrace(stack: number[], v: number, lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  const next = [...stack, v];
  return {
    steps: [
      snap(stack, {
        desc: bn ? `push(${v}) — উপরে জায়গা নাও` : `push(${v}) — make room on top`,
        codeLine: 0,
      }),
      snap(next, {
        hi: [next.length - 1],
        desc: bn ? `${v} বসলো top=${next.length - 1}-এ` : `${v} lands on top=${next.length - 1}`,
        codeLine: 1,
      }),
    ],
    finalItems: next,
  };
}

export function popTrace(stack: number[], lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  const top = stack[stack.length - 1];
  const next = stack.slice(0, -1);
  return {
    steps: [
      snap(stack, {
        hi: [stack.length - 1],
        desc: bn ? `pop() — top ${top} ধরো` : `pop() — grab top ${top}`,
        codeLine: 2,
      }),
      snap(next, {
        desc: bn ? `${top} বেরিয়ে গেল, ফেরত ${top}` : `${top} lifted off, returns ${top}`,
        codeLine: 2,
      }),
    ],
    finalItems: next,
  };
}

export function peekTrace(stack: number[], lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  const top = stack[stack.length - 1];
  return {
    steps: [
      snap(stack, {
        hi: [stack.length - 1],
        desc: bn ? `peek() = ${top} — সরানো হয় না` : `peek() = ${top} — nothing moves`,
        codeLine: 3,
      }),
    ],
    finalItems: [...stack],
  };
}

export function enqueueTrace(queue: number[], v: number, lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  const next = [...queue, v];
  return {
    steps: [
      snap(queue, {
        desc: bn ? `enqueue(${v}) — লাইনের শেষে দাঁড়াও` : `enqueue(${v}) — join the back of the line`,
        codeLine: 0,
      }),
      snap(next, {
        hi: [next.length - 1],
        desc: bn ? `${v} rear=${next.length - 1}-এ দাঁড়ালো` : `${v} joins at rear=${next.length - 1}`,
        codeLine: 1,
      }),
    ],
    finalItems: next,
  };
}

export function dequeueTrace(queue: number[], lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  const front = queue[0];
  const next = queue.slice(1);
  return {
    steps: [
      snap(queue, {
        hi: [0],
        desc: bn ? `dequeue() — সামনের ${front} বেরোও` : `dequeue() — front ${front} steps out`,
        codeLine: 2,
      }),
      snap(next, {
        desc: bn ? `বাকিরা এগিয়ে এলো, ফেরত ${front}` : `line moves up, returns ${front}`,
        codeLine: 2,
      }),
    ],
    finalItems: next,
  };
}

export function frontTrace(queue: number[], lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  return {
    steps: [
      snap(queue, {
        hi: [0],
        desc: bn ? `front() = ${queue[0]} — লাইন নড়ে না` : `front() = ${queue[0]} — line stays put`,
        codeLine: 3,
      }),
    ],
    finalItems: [...queue],
  };
}

const OPEN: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

export function parenTrace(input: string, lang: Lang = "en"): SQResult {
  const bn = lang === "bn";
  const chars = input.split("").slice(0, 24);
  const steps: SQStep[] = [
    snap(chars, {
      stackView: [],
      pos: -1,
      desc: bn ? `স্ক্যান করো "${input}" — খোলা ব্র্যাকেট push, বন্ধ হলে মিলাও` : `Scan "${input}" — push opens, match closes`,
      codeLine: 0,
    }),
  ];
  const st: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === "(" || ch === "[" || ch === "{") {
      st.push(ch);
      steps.push(
        snap(chars, {
          hi: [i],
          pos: i,
          stackView: [...st],
          desc: bn ? `"${ch}" খোলা — push` : `open "${ch}" — push`,
          codeLine: 1,
        })
      );
    } else if (ch === ")" || ch === "]" || ch === "}") {
      const top = st[st.length - 1];
      if (top === OPEN[ch]) {
        st.pop();
        steps.push(
          snap(chars, {
            hi: [i],
            pos: i,
            stackView: [...st],
            desc: bn ? `"${ch}" মিলেছে "${top}"-এর সাথে — pop` : `"${ch}" matches "${top}" — pop`,
            codeLine: 2,
          })
        );
      } else {
        steps.push(
          snap(chars, {
            hi: [i],
            pos: i,
            stackView: [...st],
            verdict: false,
            desc: bn
              ? `"${ch}" অমিল (top: ${top ?? "খালি"}) — ভারসাম্যহীন`
              : `"${ch}" mismatches (top: ${top ?? "empty"}) — unbalanced`,
            codeLine: 2,
          })
        );
        return { steps, finalItems: chars };
      }
    } else {
      steps.push(
        snap(chars, {
          hi: [i],
          pos: i,
          stackView: [...st],
          desc: bn ? `"${ch}" ব্র্যাকেট নয় — এড়িয়ে যাও` : `"${ch}" not a bracket — skip`,
          codeLine: 0,
        })
      );
    }
  }
  const ok = st.length === 0;
  steps.push(
    snap(chars, {
      stackView: [...st],
      pos: chars.length,
      verdict: ok,
      desc: bn
        ? ok
          ? "স্ট্যাক খালি — ভারসাম্যপূর্ণ"
          : `${st.length}টা খোলা বাকি — ভারসাম্যহীন`
        : ok
          ? "stack empty — balanced"
          : `${st.length} unclosed — unbalanced`,
      codeLine: 3,
    })
  );
  return { steps, finalItems: chars };
}

export const SQ_CODE: Record<string, string[]> = {
  stack: [
    "push(x): make room on top",
    "  a[top] = x",
    "pop(): return a[top--]",
    "peek(): return a[top]",
  ],
  queue: [
    "enqueue(x): join the back",
    "  a[rear] = x",
    "dequeue(): return a[front++]",
    "front(): return a[front]",
  ],
  paren: [
    "for ch in s:",
    "  if open: push",
    "  if close: must match pop",
    "empty stack = balanced",
  ],
};
