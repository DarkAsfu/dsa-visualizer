'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang, Text } from "./dict";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

function readStored(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const s = window.localStorage.getItem("dsa-lang");
    return s === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    try {
      window.localStorage.setItem("dsa-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang: setLangState }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  const T = (t: Text): string => t[ctx.lang];
  return { lang: ctx.lang, setLang: ctx.setLang, T };
}
