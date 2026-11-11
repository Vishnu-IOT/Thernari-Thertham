import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { strings } from "./strings.js";

/* Malayalam is the default language. A visitor's own choice is remembered. */
export const DEFAULT_LANG = "ml";
export const LANGS = ["ml", "en", "ta"];
const STORE_KEY = "thenari-lang";

const readSaved = () => {
  try {
    const v = window.localStorage.getItem(STORE_KEY);
    return LANGS.includes(v) ? v : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

const lookup = (dict, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);

/* Fills {placeholders}. Plain values give a string; React nodes (links, <b>) give nodes. */
function fill(tpl, vars) {
  if (!vars) return tpl;
  const parts = tpl.split(/\{(\w+)\}/g);
  const out = parts.map((p, i) => (i % 2 ? (vars[p] ?? "") : p));
  if (out.every((x) => typeof x === "string" || typeof x === "number")) return out.join("");
  return out.map((x, i) => <Fragment key={i}>{x}</Fragment>);
}

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, tx: (k) => k });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readSaved);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORE_KEY, next);
    } catch {
      /* storage unavailable: the choice just lasts for this visit */
    }
  }, []);

  const value = useMemo(() => {
    const tx = (key, vars) => {
      const s = lookup(strings[lang], key) ?? lookup(strings.en, key);
      return typeof s === "string" ? fill(s, vars) : key;
    };
    return { lang, setLang, tx };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
