import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Type,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/CaseConverter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Case Converter Online Free | Change Text Case",
    seoDesc:
      "Convert text case online for free. Change text to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case and kebab-case.",
    eyebrow: "Convert Wala Text Tool",
    title: "Case Converter",
    subtitle:
      "Paste your text and convert it into uppercase, lowercase, title case, sentence case, camelCase and more.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool converts your text into different case formats such as UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case and kebab-case.",
    inputPlaceholder: "Type or paste your text here...",
    outputPlaceholder: "Converted text will appear here...",
    input: "Input Text",
    output: "Output Text",
    uppercase: "UPPERCASE",
    lowercase: "lowercase",
    titleCase: "Title Case",
    sentenceCase: "Sentence case",
    capitalizedCase: "Capitalized Case",
    alternatingCase: "aLtErNaTiNg cAsE",
    inverseCase: "Inverse Case",
    camelCase: "camelCase",
    pascalCase: "PascalCase",
    snakeCase: "snake_case",
    kebabCase: "kebab-case",
    copyOutput: "Copy Output",
    copyInput: "Copy Input",
    clear: "Clear",
    reset: "Reset",
    copied: "Text copied successfully.",
    noText: "Please enter text first.",
  },
  hi: {
    seoTitle: "Case Converter Online Free | Text Case बदलें",
    seoDesc:
      "Text case free online convert करें। Uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case और kebab-case में बदलें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Case Converter",
    subtitle:
      "Text paste करें और उसे uppercase, lowercase, title case, sentence case, camelCase और अन्य formats में convert करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool आपके text को UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case और kebab-case जैसे formats में convert करता है।",
    inputPlaceholder: "अपना text यहां type या paste करें...",
    outputPlaceholder: "Converted text यहां दिखाई देगा...",
    input: "Input Text",
    output: "Output Text",
    uppercase: "UPPERCASE",
    lowercase: "lowercase",
    titleCase: "Title Case",
    sentenceCase: "Sentence case",
    capitalizedCase: "Capitalized Case",
    alternatingCase: "aLtErNaTiNg cAsE",
    inverseCase: "Inverse Case",
    camelCase: "camelCase",
    pascalCase: "PascalCase",
    snakeCase: "snake_case",
    kebabCase: "kebab-case",
    copyOutput: "Copy Output",
    copyInput: "Copy Input",
    clear: "Clear",
    reset: "Reset",
    copied: "Text successfully copy हो गया।",
    noText: "कृपया पहले text enter करें।",
  },
  hinglish: {
    seoTitle: "Case Converter Online Free | Change Text Case",
    seoDesc:
      "Text case free online convert karo. Uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case aur kebab-case me badlo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Case Converter",
    subtitle:
      "Text paste karo aur usko uppercase, lowercase, title case, sentence case, camelCase aur more formats me convert karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye text ko UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case aur kebab-case jaise formats me convert karta hai.",
    inputPlaceholder: "Apna text yaha type ya paste karo...",
    outputPlaceholder: "Converted text yaha show hoga...",
    input: "Input Text",
    output: "Output Text",
    uppercase: "UPPERCASE",
    lowercase: "lowercase",
    titleCase: "Title Case",
    sentenceCase: "Sentence case",
    capitalizedCase: "Capitalized Case",
    alternatingCase: "aLtErNaTiNg cAsE",
    inverseCase: "Inverse Case",
    camelCase: "camelCase",
    pascalCase: "PascalCase",
    snakeCase: "snake_case",
    kebabCase: "kebab-case",
    copyOutput: "Copy Output",
    copyInput: "Copy Input",
    clear: "Clear",
    reset: "Reset",
    copied: "Text successfully copy ho gaya.",
    noText: "Please pehle text enter karo.",
  },
};

const toTitleCase = (text) =>
  text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const toSentenceCase = (text) =>
  text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());

const toCapitalizedCase = (text) =>
  text.replace(/\b\w/g, (char) => char.toUpperCase());

const toAlternatingCase = (text) =>
  text
    .split("")
    .map((char, index) =>
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");

const toInverseCase = (text) =>
  text
    .split("")
    .map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
    )
    .join("");

const wordsOnly = (text) =>
  text
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean);

const toCamelCase = (text) => {
  const words = wordsOnly(text).map((word) => word.toLowerCase());

  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

const toPascalCase = (text) =>
  wordsOnly(text)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");

const toSnakeCase = (text) =>
  wordsOnly(text)
    .map((word) => word.toLowerCase())
    .join("_");

const toKebabCase = (text) =>
  wordsOnly(text)
    .map((word) => word.toLowerCase())
    .join("-");

export default function CaseConverter() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeCase, setActiveCase] = useState("uppercase");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const caseOptions = [
    { key: "uppercase", label: t.uppercase, fn: (text) => text.toUpperCase() },
    { key: "lowercase", label: t.lowercase, fn: (text) => text.toLowerCase() },
    { key: "titleCase", label: t.titleCase, fn: toTitleCase },
    { key: "sentenceCase", label: t.sentenceCase, fn: toSentenceCase },
    { key: "capitalizedCase", label: t.capitalizedCase, fn: toCapitalizedCase },
    { key: "alternatingCase", label: t.alternatingCase, fn: toAlternatingCase },
    { key: "inverseCase", label: t.inverseCase, fn: toInverseCase },
    { key: "camelCase", label: t.camelCase, fn: toCamelCase },
    { key: "pascalCase", label: t.pascalCase, fn: toPascalCase },
    { key: "snakeCase", label: t.snakeCase, fn: toSnakeCase },
    { key: "kebabCase", label: t.kebabCase, fn: toKebabCase },
  ];

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

  const convertText = (caseKey) => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    const selected = caseOptions.find((item) => item.key === caseKey);
    if (!selected) return;

    setActiveCase(caseKey);
    setOutputText(selected.fn(inputText));
  };

  const copyText = async (value) => {
    if (!value.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(value);
    showToast("success", t.copied);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
    setActiveCase("uppercase");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="case converter, uppercase converter, lowercase converter, title case converter, sentence case, camel case, snake case, kebab case"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/case-converter" />
      </Helmet>

      <main className={`case-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`case-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="case-hero">
          <div className="case-badge">
            <Type />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="case-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="case-shell">
          <div className="case-editor-card">
            <div className="case-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
            />

            <div className="case-options">
              {caseOptions.map((item) => (
                <button
                  key={item.key}
                  className={activeCase === item.key ? "active" : ""}
                  onClick={() => convertText(item.key)}
                >
                  <Wand2 />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="case-actions">
              <button onClick={() => copyText(inputText)} disabled={!inputText.trim()}>
                <Copy />
                {t.copyInput}
              </button>

              <button onClick={clearTool} disabled={!inputText && !outputText} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={clearTool} disabled={!inputText && !outputText}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="case-output-card">
            <div className="case-card-head">
              <h3>{t.output}</h3>
              <span>{outputText.length} chars</span>
            </div>

            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
            />

            <div className="case-actions">
              <button onClick={() => copyText(outputText)} disabled={!outputText.trim()}>
                <Copy />
                {t.copyOutput}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}