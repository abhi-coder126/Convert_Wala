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
import "../styles/WordCounter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Word Counter Online Free | Count Words and Characters",
    seoDesc:
      "Count words, characters, sentences, paragraphs, spaces and reading time online for free with Convert Wala Word Counter.",
    eyebrow: "Convert Wala Text Tool",
    title: "Word Counter",
    subtitle:
      "Paste or type your text and instantly count words, characters, sentences, paragraphs and reading time.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool analyzes your text and shows total words, characters, sentences, paragraphs, spaces and estimated reading time.",
    placeholder: "Type or paste your text here...",
    words: "Words",
    characters: "Characters",
    charactersNoSpace: "Characters Without Spaces",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    spaces: "Spaces",
    readingTime: "Reading Time",
    speakingTime: "Speaking Time",
    copy: "Copy Text",
    clear: "Clear",
    reset: "Reset",
    copied: "Text copied successfully.",
    noText: "Please enter text first.",
  },
  hi: {
    seoTitle: "Word Counter Online Free | Words और Characters Count करें",
    seoDesc:
      "Words, characters, sentences, paragraphs, spaces और reading time free online count करें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Word Counter",
    subtitle:
      "Text paste या type करें और words, characters, sentences, paragraphs और reading time तुरंत count करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool आपके text को analyze करता है और total words, characters, sentences, paragraphs, spaces और estimated reading time दिखाता है।",
    placeholder: "अपना text यहां type या paste करें...",
    words: "Words",
    characters: "Characters",
    charactersNoSpace: "Characters Without Spaces",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    spaces: "Spaces",
    readingTime: "Reading Time",
    speakingTime: "Speaking Time",
    copy: "Copy Text",
    clear: "Clear",
    reset: "Reset",
    copied: "Text successfully copy हो गया।",
    noText: "कृपया पहले text enter करें।",
  },
  hinglish: {
    seoTitle: "Word Counter Online Free | Count Words and Characters",
    seoDesc:
      "Words, characters, sentences, paragraphs, spaces aur reading time free online count karo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Word Counter",
    subtitle:
      "Text paste ya type karo aur words, characters, sentences, paragraphs aur reading time instantly count karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye text ko analyze karta hai aur total words, characters, sentences, paragraphs, spaces aur estimated reading time show karta hai.",
    placeholder: "Apna text yaha type ya paste karo...",
    words: "Words",
    characters: "Characters",
    charactersNoSpace: "Characters Without Spaces",
    sentences: "Sentences",
    paragraphs: "Paragraphs",
    spaces: "Spaces",
    readingTime: "Reading Time",
    speakingTime: "Speaking Time",
    copy: "Copy Text",
    clear: "Clear",
    reset: "Reset",
    copied: "Text successfully copy ho gaya.",
    noText: "Please pehle text enter karo.",
  },
};

const countStats = (text) => {
  const trimmed = text.trim();

  const words = trimmed ? trimmed.match(/\S+/g)?.length || 0 : 0;
  const characters = text.length;
  const charactersNoSpace = text.replace(/\s/g, "").length;
  const spaces = (text.match(/\s/g) || []).length;
  const sentences = trimmed
    ? trimmed.split(/[.!?]+/).filter((item) => item.trim().length > 0).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n+/).filter((item) => item.trim().length > 0).length
    : 0;

  const readingMinutes = words / 200;
  const speakingMinutes = words / 130;

  return {
    words,
    characters,
    charactersNoSpace,
    spaces,
    sentences,
    paragraphs,
    readingTime:
      words === 0
        ? "0 min"
        : readingMinutes < 1
        ? "< 1 min"
        : `${Math.ceil(readingMinutes)} min`,
    speakingTime:
      words === 0
        ? "0 min"
        : speakingMinutes < 1
        ? "< 1 min"
        : `${Math.ceil(speakingMinutes)} min`,
  };
};

export default function WordCounter() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [text, setText] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const stats = useMemo(() => countStats(text), [text]);

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

  const clearText = () => {
    setText("");
  };

  const statCards = [
    { label: t.words, value: stats.words },
    { label: t.characters, value: stats.characters },
    { label: t.charactersNoSpace, value: stats.charactersNoSpace },
    { label: t.sentences, value: stats.sentences },
    { label: t.paragraphs, value: stats.paragraphs },
    { label: t.spaces, value: stats.spaces },
    { label: t.readingTime, value: stats.readingTime },
    { label: t.speakingTime, value: stats.speakingTime },
  ];

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="word counter, character counter, text counter, sentence counter, paragraph counter, reading time calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/word-counter" />
      </Helmet>

      <main className={`word-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`word-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="word-hero">
          <div className="word-badge">
            <Type />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="word-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="word-shell">
          <div className="word-editor-card">
            <div className="word-card-head">
              <h3>{t.title}</h3>
              <span>{stats.words} words</span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
            />

            <div className="word-actions">
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

          <div className="word-stats-card">
            <div className="word-card-head">
              <h3>Text Stats</h3>
              <span>Live</span>
            </div>

            <div className="word-stats-grid">
              {statCards.map((item) => (
                <div className="word-stat-item" key={item.label}>
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