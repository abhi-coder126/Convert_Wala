import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Type,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import "../styles/CharacterCounter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Character Counter Online Free | Count Letters and Spaces",
    seoDesc:
      "Count characters, letters, spaces, numbers, symbols, words and lines online for free.",
    eyebrow: "Convert Wala Text Tool",
    title: "Character Counter",
    subtitle:
      "Paste your text and instantly count characters, letters, spaces, numbers, symbols and lines.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool focuses on character-level text analysis. It counts total characters, characters without spaces, letters, numbers, symbols, words and lines.",
    placeholder: "Type or paste your text here...",
    totalCharacters: "Total Characters",
    withoutSpaces: "Without Spaces",
    letters: "Letters",
    numbers: "Numbers",
    symbols: "Symbols",
    spaces: "Spaces",
    words: "Words",
    lines: "Lines",
    copy: "Copy Text",
    clear: "Clear",
    reset: "Reset",
    copied: "Text copied successfully.",
    noText: "Please enter text first.",
  },
  hi: {
    seoTitle: "Character Counter Online Free | Letters और Spaces Count करें",
    seoDesc:
      "Characters, letters, spaces, numbers, symbols, words और lines free online count करें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Character Counter",
    subtitle:
      "Text paste करें और characters, letters, spaces, numbers, symbols और lines तुरंत count करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool character-level text analysis करता है। Total characters, without spaces, letters, numbers, symbols, words और lines count करता है।",
    placeholder: "अपना text यहां type या paste करें...",
    totalCharacters: "Total Characters",
    withoutSpaces: "Without Spaces",
    letters: "Letters",
    numbers: "Numbers",
    symbols: "Symbols",
    spaces: "Spaces",
    words: "Words",
    lines: "Lines",
    copy: "Copy Text",
    clear: "Clear",
    reset: "Reset",
    copied: "Text successfully copy हो गया।",
    noText: "कृपया पहले text enter करें।",
  },
  hinglish: {
    seoTitle: "Character Counter Online Free | Count Letters and Spaces",
    seoDesc:
      "Characters, letters, spaces, numbers, symbols, words aur lines free online count karo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Character Counter",
    subtitle:
      "Text paste karo aur characters, letters, spaces, numbers, symbols aur lines instantly count karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye character-level text analysis karta hai. Total characters, without spaces, letters, numbers, symbols, words aur lines count karta hai.",
    placeholder: "Apna text yaha type ya paste karo...",
    totalCharacters: "Total Characters",
    withoutSpaces: "Without Spaces",
    letters: "Letters",
    numbers: "Numbers",
    symbols: "Symbols",
    spaces: "Spaces",
    words: "Words",
    lines: "Lines",
    copy: "Copy Text",
    clear: "Clear",
    reset: "Reset",
    copied: "Text successfully copy ho gaya.",
    noText: "Please pehle text enter karo.",
  },
};

const getStats = (text) => {
  const totalCharacters = text.length;
  const withoutSpaces = text.replace(/\s/g, "").length;
  const spaces = (text.match(/\s/g) || []).length;
  const letters = (text.match(/[A-Za-zÀ-ž]/g) || []).length;
  const numbers = (text.match(/[0-9]/g) || []).length;
  const words = text.trim() ? text.trim().match(/\S+/g)?.length || 0 : 0;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  const symbols = withoutSpaces - letters - numbers;

  return {
    totalCharacters,
    withoutSpaces,
    letters,
    numbers,
    symbols: Math.max(symbols, 0),
    spaces,
    words,
    lines,
  };
};

export default function CharacterCounter() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );
  const [text, setText] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const stats = useMemo(() => getStats(text), [text]);

  useEffect(() => {
    const syncSettings = () => {
      setLanguage(localStorage.getItem(STORAGE_LANGUAGE) || "en");
      setTheme(localStorage.getItem(STORAGE_THEME) || "light");
    };

    syncSettings();
    window.addEventListener(SETTINGS_EVENT, syncSettings);
    window.addEventListener("storage", syncSettings);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, syncSettings);
      window.removeEventListener("storage", syncSettings);
    };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const copyText = async () => {
    if (!text.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast("success", t.copied);
  };

  const clearText = () => setText("");

  const statCards = [
    { label: t.totalCharacters, value: stats.totalCharacters },
    { label: t.withoutSpaces, value: stats.withoutSpaces },
    { label: t.letters, value: stats.letters },
    { label: t.numbers, value: stats.numbers },
    { label: t.symbols, value: stats.symbols },
    { label: t.spaces, value: stats.spaces },
    { label: t.words, value: stats.words },
    { label: t.lines, value: stats.lines },
  ];

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="character counter, letter counter, space counter, symbol counter, text counter, count characters online"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/character-counter" />
      </Helmet>

      <main className={`char-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`char-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="char-hero">
          <div className="char-badge">
            <Type />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="char-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="char-shell">
          <div className="char-editor-card">
            <div className="char-card-head">
              <h3>{t.title}</h3>
              <span>{stats.totalCharacters} chars</span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
            />

            <div className="char-actions">
              <button onClick={copyText} disabled={!text.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={clearText} disabled={!text} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={clearText} disabled={!text}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="char-stats-card">
            <div className="char-card-head">
              <h3>Character Stats</h3>
              <span>Live</span>
            </div>

            <div className="char-stats-grid">
              {statCards.map((item) => (
                <div className="char-stat-item" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}