import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileMinus,
  Trash2,
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import "../styles/RemoveDuplicateLines.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Remove Duplicate Lines Online Free | Unique Lines Tool",
    seoDesc:
      "Remove duplicate lines from text online for free. Clean keyword lists, email lists, logs and text data instantly.",
    eyebrow: "Convert Wala Text Tool",
    title: "Remove Duplicate Lines",
    subtitle:
      "Paste text, remove duplicate lines and keep only clean unique lines instantly.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool removes duplicate lines from your text. Useful for keyword lists, emails, tags, logs, CSV lines and text cleanup.",
    input: "Input Text",
    output: "Unique Lines Output",
    inputPlaceholder: "Paste your lines here...",
    outputPlaceholder: "Clean unique lines will appear here...",
    remove: "Remove Duplicates",
    copy: "Copy Result",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    upload: "Upload TXT",
    caseSensitive: "Case Sensitive",
    ignoreEmpty: "Ignore Empty Lines",
    trimSpaces: "Trim Spaces",
    sortAZ: "Sort A-Z",
    totalLines: "Total Lines",
    uniqueLines: "Unique Lines",
    duplicateLines: "Duplicate Lines",
    removedLines: "Removed Lines",
    copied: "Result copied successfully.",
    noText: "Please enter text first.",
    cleaned: "Duplicate lines removed successfully.",
    fileError: "Please upload a valid TXT file.",
  },
  hi: {
    seoTitle: "Remove Duplicate Lines Online Free | Unique Lines Tool",
    seoDesc:
      "Text से duplicate lines free online remove करें। Keyword lists, email lists, logs और text data साफ करें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Remove Duplicate Lines",
    subtitle:
      "Text paste करें, duplicate lines remove करें और clean unique lines रखें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool आपके text से duplicate lines remove करता है। Keyword lists, emails, tags, logs और text cleanup के लिए useful है।",
    input: "Input Text",
    output: "Unique Lines Output",
    inputPlaceholder: "अपनी lines यहां paste करें...",
    outputPlaceholder: "Clean unique lines यहां दिखेंगी...",
    remove: "Duplicates Remove करें",
    copy: "Result Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    upload: "TXT Upload",
    caseSensitive: "Case Sensitive",
    ignoreEmpty: "Empty Lines Ignore करें",
    trimSpaces: "Spaces Trim करें",
    sortAZ: "Sort A-Z",
    totalLines: "Total Lines",
    uniqueLines: "Unique Lines",
    duplicateLines: "Duplicate Lines",
    removedLines: "Removed Lines",
    copied: "Result successfully copy हो गया।",
    noText: "कृपया पहले text enter करें।",
    cleaned: "Duplicate lines successfully remove हो गई।",
    fileError: "कृपया valid TXT file upload करें।",
  },
  hinglish: {
    seoTitle: "Remove Duplicate Lines Online Free | Unique Lines Tool",
    seoDesc:
      "Text se duplicate lines free online remove karo. Keyword lists, email lists, logs aur text data clean karo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Remove Duplicate Lines",
    subtitle:
      "Text paste karo, duplicate lines remove karo aur clean unique lines rakho.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye text me se duplicate lines remove karta hai. Keyword lists, emails, tags, logs aur text cleanup ke liye useful hai.",
    input: "Input Text",
    output: "Unique Lines Output",
    inputPlaceholder: "Apni lines yaha paste karo...",
    outputPlaceholder: "Clean unique lines yaha show hongi...",
    remove: "Remove Duplicates",
    copy: "Copy Result",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    upload: "Upload TXT",
    caseSensitive: "Case Sensitive",
    ignoreEmpty: "Ignore Empty Lines",
    trimSpaces: "Trim Spaces",
    sortAZ: "Sort A-Z",
    totalLines: "Total Lines",
    uniqueLines: "Unique Lines",
    duplicateLines: "Duplicate Lines",
    removedLines: "Removed Lines",
    copied: "Result successfully copy ho gaya.",
    noText: "Please pehle text enter karo.",
    cleaned: "Duplicate lines successfully remove ho gayi.",
    fileError: "Please valid TXT file upload karo.",
  },
};

const processLines = ({
  text,
  caseSensitive,
  ignoreEmpty,
  trimSpaces,
  sortAZ,
}) => {
  let lines = text.split(/\r\n|\r|\n/);

  if (trimSpaces) {
    lines = lines.map((line) => line.trim());
  }

  if (ignoreEmpty) {
    lines = lines.filter((line) => line.length > 0);
  }

  const seen = new Set();
  const unique = [];
  let duplicates = 0;

  lines.forEach((line) => {
    const compareValue = caseSensitive ? line : line.toLowerCase();

    if (seen.has(compareValue)) {
      duplicates += 1;
    } else {
      seen.add(compareValue);
      unique.push(line);
    }
  });

  if (sortAZ) {
    unique.sort((a, b) => a.localeCompare(b));
  }

  return {
    output: unique.join("\n"),
    stats: {
      totalLines: lines.length,
      uniqueLines: unique.length,
      duplicateLines: duplicates,
      removedLines: lines.length - unique.length,
    },
  };
};

export default function RemoveDuplicateLines() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [ignoreEmpty, setIgnoreEmpty] = useState(true);
  const [trimSpaces, setTrimSpaces] = useState(true);
  const [sortAZ, setSortAZ] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const liveStats = useMemo(() => {
    const result = processLines({
      text: inputText,
      caseSensitive,
      ignoreEmpty,
      trimSpaces,
      sortAZ,
    });

    return result.stats;
  }, [inputText, caseSensitive, ignoreEmpty, trimSpaces, sortAZ]);

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

  const removeDuplicates = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    const result = processLines({
      text: inputText,
      caseSensitive,
      ignoreEmpty,
      trimSpaces,
      sortAZ,
    });

    setOutputText(result.output);
    showToast("success", t.cleaned);
  };

  const copyResult = async () => {
    if (!outputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(outputText);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!outputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([outputText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_unique_lines.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleTxtUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.name.toLowerCase().endsWith(".txt")) {
      showToast("error", t.fileError);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setInputText(String(reader.result || ""));
      setOutputText("");
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
  };

  const statCards = [
    { label: t.totalLines, value: liveStats.totalLines },
    { label: t.uniqueLines, value: liveStats.uniqueLines },
    { label: t.duplicateLines, value: liveStats.duplicateLines },
    { label: t.removedLines, value: liveStats.removedLines },
  ];

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="remove duplicate lines, duplicate line remover, unique lines, text cleaner, remove duplicates online"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/remove-duplicate-lines"
        />
      </Helmet>

      <main className={`duplicate-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`duplicate-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="duplicate-hero">
          <div className="duplicate-badge">
            <FileMinus />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="duplicate-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="duplicate-stats">
          {statCards.map((item) => (
            <div className="duplicate-stat" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="duplicate-options">
          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => {
                setCaseSensitive(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.caseSensitive}</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={ignoreEmpty}
              onChange={(e) => {
                setIgnoreEmpty(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.ignoreEmpty}</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={trimSpaces}
              onChange={(e) => {
                setTrimSpaces(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.trimSpaces}</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={sortAZ}
              onChange={(e) => {
                setSortAZ(e.target.checked);
                setOutputText("");
              }}
            />
            <span>{t.sortAZ}</span>
          </label>
        </section>

        <section className="duplicate-shell">
          <div className="duplicate-card">
            <div className="duplicate-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
              }}
              placeholder={t.inputPlaceholder}
            />

            <div className="duplicate-actions">
              <label className="duplicate-upload-btn">
                <input type="file" accept=".txt,text/plain" onChange={handleTxtUpload} />
                <UploadCloud />
                {t.upload}
              </label>

              <button onClick={removeDuplicates}>
                <FileMinus />
                {t.remove}
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

          <div className="duplicate-card">
            <div className="duplicate-card-head">
              <h3>{t.output}</h3>
              <span>{outputText.length} chars</span>
            </div>

            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
            />

            <div className="duplicate-actions">
              <button onClick={copyResult} disabled={!outputText.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadTxt} disabled={!outputText.trim()}>
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