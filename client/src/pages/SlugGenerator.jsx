import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link2,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/SlugGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Slug Generator Online Free | SEO URL Slug Maker",
    seoDesc:
      "Generate SEO-friendly URL slugs online for free. Convert titles and text into clean lowercase slugs for blogs, pages and websites.",
    eyebrow: "Convert Wala Text Tool",
    title: "Slug Generator",
    subtitle:
      "Convert titles, blog names and text into clean SEO-friendly URL slugs instantly.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool converts your text into a clean URL slug by removing special characters, spaces and unnecessary symbols.",
    input: "Input Text",
    output: "Generated Slug",
    placeholder: "Enter title or text here...",
    outputPlaceholder: "your-generated-slug",
    separator: "Separator",
    lowercase: "Lowercase",
    removeNumbers: "Remove Numbers",
    bulkMode: "Bulk Mode",
    generate: "Generate Slug",
    copy: "Copy Slug",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    slugs: "Slugs",
    copied: "Slug copied successfully.",
    generated: "Slug generated successfully.",
    noText: "Please enter text first.",
  },
  hi: {
    seoTitle: "Slug Generator Online Free | SEO URL Slug Maker",
    seoDesc:
      "SEO-friendly URL slugs free online generate करें। Titles और text को clean lowercase slugs में convert करें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Slug Generator",
    subtitle:
      "Titles, blog names और text को clean SEO-friendly URL slugs में instantly convert करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool आपके text को clean URL slug में convert करता है और special characters, spaces व unnecessary symbols remove करता है।",
    input: "Input Text",
    output: "Generated Slug",
    placeholder: "Title या text यहां enter करें...",
    outputPlaceholder: "your-generated-slug",
    separator: "Separator",
    lowercase: "Lowercase",
    removeNumbers: "Numbers Remove करें",
    bulkMode: "Bulk Mode",
    generate: "Slug Generate करें",
    copy: "Slug Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    slugs: "Slugs",
    copied: "Slug successfully copy हो गया।",
    generated: "Slug successfully generate हो गया।",
    noText: "कृपया पहले text enter करें।",
  },
  hinglish: {
    seoTitle: "Slug Generator Online Free | SEO URL Slug Maker",
    seoDesc:
      "SEO-friendly URL slugs free online generate karo. Titles aur text ko clean lowercase slugs me convert karo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Slug Generator",
    subtitle:
      "Titles, blog names aur text ko clean SEO-friendly URL slugs me instantly convert karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye text ko clean URL slug me convert karta hai aur special characters, spaces aur unnecessary symbols remove karta hai.",
    input: "Input Text",
    output: "Generated Slug",
    placeholder: "Title ya text yaha enter karo...",
    outputPlaceholder: "your-generated-slug",
    separator: "Separator",
    lowercase: "Lowercase",
    removeNumbers: "Remove Numbers",
    bulkMode: "Bulk Mode",
    generate: "Generate Slug",
    copy: "Copy Slug",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    slugs: "Slugs",
    copied: "Slug successfully copy ho gaya.",
    generated: "Slug successfully generate ho gaya.",
    noText: "Please pehle text enter karo.",
  },
};

const slugify = (text, options) => {
  const { separator, lowercase, removeNumbers } = options;

  let value = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[@]/g, " at ")
    .replace(/[%]/g, " percent ");

  if (removeNumbers) {
    value = value.replace(/[0-9]/g, "");
  }

  value = value
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, separator)
    .replace(new RegExp(`\\${separator}+`, "g"), separator)
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, "g"), "");

  return lowercase ? value.toLowerCase() : value;
};

const countWords = (text) => (text.trim() ? text.trim().match(/\S+/g)?.length || 0 : 0);

export default function SlugGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    if (bulkMode) {
      return inputText
        .split(/\r\n|\r|\n/)
        .filter((line) => line.trim())
        .map((line) => slugify(line, { separator, lowercase, removeNumbers }))
        .join("\n");
    }

    return slugify(inputText, { separator, lowercase, removeNumbers });
  }, [inputText, separator, lowercase, removeNumbers, bulkMode]);

  const currentOutput = outputText || livePreview;

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

  const generateSlug = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    setOutputText(livePreview);
    showToast("success", t.generated);
  };

  const copySlug = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_slugs.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
  };

  const resetTool = () => {
    setInputText("");
    setOutputText("");
    setSeparator("-");
    setLowercase(true);
    setRemoveNumbers(false);
    setBulkMode(false);
  };

  const slugCount = currentOutput.trim()
    ? currentOutput.split(/\r\n|\r|\n/).filter((line) => line.trim()).length
    : 0;

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="slug generator, url slug generator, seo slug, slugify text, blog slug generator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/slug-generator" />
      </Helmet>

      <main className={`slug-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`slug-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="slug-hero">
          <div className="slug-badge">
            <Link2 />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="slug-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="slug-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>
          <div>
            <span>{t.words}</span>
            <strong>{countWords(inputText)}</strong>
          </div>
          <div>
            <span>{t.slugs}</span>
            <strong>{slugCount}</strong>
          </div>
        </section>

        <section className="slug-options">
          <div className="slug-control">
            <label>{t.separator}</label>
            <select
              value={separator}
              onChange={(e) => {
                setSeparator(e.target.value);
                setOutputText("");
              }}
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
            </select>
          </div>

          <label>
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => {
                setLowercase(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.lowercase}</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={removeNumbers}
              onChange={(e) => {
                setRemoveNumbers(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.removeNumbers}</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={bulkMode}
              onChange={(e) => {
                setBulkMode(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.bulkMode}</span>
          </label>
        </section>

        <section className="slug-shell">
          <div className="slug-card">
            <div className="slug-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
              }}
              placeholder={t.placeholder}
            />

            <div className="slug-actions">
              <button onClick={generateSlug}>
                <Wand2 />
                {t.generate}
              </button>

              <button onClick={clearTool} disabled={!inputText && !outputText} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="slug-card">
            <div className="slug-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
            />

            <div className="slug-actions">
              <button onClick={copySlug} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadTxt} disabled={!currentOutput.trim()}>
                <Download />
                {t.download}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}