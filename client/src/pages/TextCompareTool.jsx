import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  GitCompare,
  Trash2,
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import "../styles/TextCompareTool.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Text Compare Tool Online Free | Compare Text Differences",
    seoDesc:
      "Compare two texts online for free. Highlight added, removed, changed and same lines with a clean text diff checker.",
    eyebrow: "Convert Wala Text Tool",
    title: "Text Compare Tool",
    subtitle:
      "Paste two versions of text and instantly compare added, removed, changed and same lines.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool compares two text blocks line by line and highlights what was added, removed, changed or unchanged.",
    original: "Original Text",
    modified: "Modified Text",
    result: "Compare Result",
    originalPlaceholder: "Paste original text here...",
    modifiedPlaceholder: "Paste modified text here...",
    compare: "Compare Text",
    copy: "Copy Result",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    uploadOriginal: "Upload Original",
    uploadModified: "Upload Modified",
    same: "Same Lines",
    added: "Added Lines",
    removed: "Removed Lines",
    changed: "Changed Lines",
    noText: "Please enter both texts first.",
    copied: "Result copied successfully.",
    compared: "Text compared successfully.",
    fileError: "Please upload a valid TXT file.",
  },
  hi: {
    seoTitle: "Text Compare Tool Online Free | Text Differences Compare करें",
    seoDesc:
      "दो texts free online compare करें। Added, removed, changed और same lines highlight करें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Text Compare Tool",
    subtitle:
      "Text के दो versions paste करें और added, removed, changed और same lines instantly compare करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool दो text blocks को line by line compare करता है और added, removed, changed या unchanged lines highlight करता है।",
    original: "Original Text",
    modified: "Modified Text",
    result: "Compare Result",
    originalPlaceholder: "Original text यहां paste करें...",
    modifiedPlaceholder: "Modified text यहां paste करें...",
    compare: "Text Compare करें",
    copy: "Result Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    uploadOriginal: "Original Upload",
    uploadModified: "Modified Upload",
    same: "Same Lines",
    added: "Added Lines",
    removed: "Removed Lines",
    changed: "Changed Lines",
    noText: "कृपया दोनों text पहले enter करें।",
    copied: "Result successfully copy हो गया।",
    compared: "Text successfully compare हो गया।",
    fileError: "कृपया valid TXT file upload करें।",
  },
  hinglish: {
    seoTitle: "Text Compare Tool Online Free | Compare Text Differences",
    seoDesc:
      "Do texts free online compare karo. Added, removed, changed aur same lines highlight karo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Text Compare Tool",
    subtitle:
      "Text ke two versions paste karo aur added, removed, changed aur same lines instantly compare karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye two text blocks ko line by line compare karta hai aur added, removed, changed ya unchanged lines highlight karta hai.",
    original: "Original Text",
    modified: "Modified Text",
    result: "Compare Result",
    originalPlaceholder: "Original text yaha paste karo...",
    modifiedPlaceholder: "Modified text yaha paste karo...",
    compare: "Compare Text",
    copy: "Copy Result",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    uploadOriginal: "Upload Original",
    uploadModified: "Upload Modified",
    same: "Same Lines",
    added: "Added Lines",
    removed: "Removed Lines",
    changed: "Changed Lines",
    noText: "Please dono text pehle enter karo.",
    copied: "Result successfully copy ho gaya.",
    compared: "Text successfully compare ho gaya.",
    fileError: "Please valid TXT file upload karo.",
  },
};

const normalizeLine = (line, ignoreCase, trimSpaces) => {
  let value = trimSpaces ? line.trim() : line;
  if (ignoreCase) value = value.toLowerCase();
  return value;
};

const compareTexts = ({ original, modified, ignoreCase, trimSpaces }) => {
  const leftLines = original.split(/\r\n|\r|\n/);
  const rightLines = modified.split(/\r\n|\r|\n/);
  const maxLength = Math.max(leftLines.length, rightLines.length);

  const rows = [];
  const stats = {
    same: 0,
    added: 0,
    removed: 0,
    changed: 0,
  };

  for (let index = 0; index < maxLength; index += 1) {
    const leftExists = index < leftLines.length;
    const rightExists = index < rightLines.length;

    const left = leftExists ? leftLines[index] : "";
    const right = rightExists ? rightLines[index] : "";

    if (!leftExists && rightExists) {
      rows.push({ type: "added", line: index + 1, left: "", right });
      stats.added += 1;
      continue;
    }

    if (leftExists && !rightExists) {
      rows.push({ type: "removed", line: index + 1, left, right: "" });
      stats.removed += 1;
      continue;
    }

    const normalizedLeft = normalizeLine(left, ignoreCase, trimSpaces);
    const normalizedRight = normalizeLine(right, ignoreCase, trimSpaces);

    if (normalizedLeft === normalizedRight) {
      rows.push({ type: "same", line: index + 1, left, right });
      stats.same += 1;
    } else {
      rows.push({ type: "changed", line: index + 1, left, right });
      stats.changed += 1;
    }
  }

  return { rows, stats };
};

export default function TextCompareTool() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimSpaces, setTrimSpaces] = useState(true);
  const [resultRows, setResultRows] = useState([]);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const liveResult = useMemo(
    () =>
      compareTexts({
        original: originalText,
        modified: modifiedText,
        ignoreCase,
        trimSpaces,
      }),
    [originalText, modifiedText, ignoreCase, trimSpaces]
  );

  const stats = resultRows.length
    ? resultRows.reduce(
        (acc, row) => {
          acc[row.type] += 1;
          return acc;
        },
        { same: 0, added: 0, removed: 0, changed: 0 }
      )
    : liveResult.stats;

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

  const compareNow = () => {
    if (!originalText.trim() || !modifiedText.trim()) {
      showToast("error", t.noText);
      return;
    }

    const result = compareTexts({
      original: originalText,
      modified: modifiedText,
      ignoreCase,
      trimSpaces,
    });

    setResultRows(result.rows);
    showToast("success", t.compared);
  };

  const resultText = useMemo(() => {
    const rows = resultRows.length ? resultRows : liveResult.rows;

    return rows
      .map((row) => {
        if (row.type === "same") return `  ${row.left}`;
        if (row.type === "added") return `+ ${row.right}`;
        if (row.type === "removed") return `- ${row.left}`;
        return `~ OLD: ${row.left}\n~ NEW: ${row.right}`;
      })
      .join("\n");
  }, [resultRows, liveResult.rows]);

  const copyResult = async () => {
    if (!resultText.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(resultText);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!resultText.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([resultText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_text_compare_result.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const handleTxtUpload = (e, target) => {
    const file = e.target.files?.[0];

    if (!file || !file.name.toLowerCase().endsWith(".txt")) {
      showToast("error", t.fileError);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (target === "original") setOriginalText(String(reader.result || ""));
      if (target === "modified") setModifiedText(String(reader.result || ""));
      setResultRows([]);
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const clearTool = () => {
    setOriginalText("");
    setModifiedText("");
    setResultRows([]);
  };

  const statCards = [
    { label: t.same, value: stats.same, type: "same" },
    { label: t.added, value: stats.added, type: "added" },
    { label: t.removed, value: stats.removed, type: "removed" },
    { label: t.changed, value: stats.changed, type: "changed" },
  ];

  const displayRows = resultRows.length ? resultRows : liveResult.rows;

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="text compare, diff checker, compare text online, text difference checker, text diff tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/text-compare" />
      </Helmet>

      <main className={`compare-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`compare-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="compare-hero">
          <div className="compare-badge">
            <GitCompare />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="compare-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="compare-stats">
          {statCards.map((item) => (
            <div className={`compare-stat ${item.type}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="compare-options">
          <label>
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => {
                setIgnoreCase(e.target.checked);
                setResultRows([]);
              }}
            />
            <span>Ignore Case</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={trimSpaces}
              onChange={(e) => {
                setTrimSpaces(e.target.checked);
                setResultRows([]);
              }}
            />
            <span>Trim Spaces</span>
          </label>
        </section>

        <section className="compare-shell">
          <div className="compare-card">
            <div className="compare-card-head">
              <h3>{t.original}</h3>
              <span>{originalText.length} chars</span>
            </div>

            <textarea
              value={originalText}
              onChange={(e) => {
                setOriginalText(e.target.value);
                setResultRows([]);
              }}
              placeholder={t.originalPlaceholder}
            />

            <div className="compare-actions">
              <label className="compare-upload-btn">
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={(e) => handleTxtUpload(e, "original")}
                />
                <UploadCloud />
                {t.uploadOriginal}
              </label>
            </div>
          </div>

          <div className="compare-card">
            <div className="compare-card-head">
              <h3>{t.modified}</h3>
              <span>{modifiedText.length} chars</span>
            </div>

            <textarea
              value={modifiedText}
              onChange={(e) => {
                setModifiedText(e.target.value);
                setResultRows([]);
              }}
              placeholder={t.modifiedPlaceholder}
            />

            <div className="compare-actions">
              <label className="compare-upload-btn">
                <input
                  type="file"
                  accept=".txt,text/plain"
                  onChange={(e) => handleTxtUpload(e, "modified")}
                />
                <UploadCloud />
                {t.uploadModified}
              </label>
            </div>
          </div>
        </section>

        <section className="compare-main-actions">
          <button onClick={compareNow}>
            <GitCompare />
            {t.compare}
          </button>

          <button onClick={copyResult} disabled={!originalText && !modifiedText}>
            <Copy />
            {t.copy}
          </button>

          <button onClick={downloadTxt} disabled={!originalText && !modifiedText}>
            <Download />
            {t.download}
          </button>

          <button
            onClick={clearTool}
            disabled={!originalText && !modifiedText}
            className="danger"
          >
            <Trash2 />
            {t.clear}
          </button>

          <button onClick={clearTool} disabled={!originalText && !modifiedText}>
            <RotateCcw />
            {t.reset}
          </button>
        </section>

        <section className="compare-result-card">
          <div className="compare-card-head">
            <h3>{t.result}</h3>
            <span>{displayRows.length} lines</span>
          </div>

          <div className="compare-result-list">
            {displayRows.length && (originalText || modifiedText) ? (
              displayRows.map((row, index) => (
                <div className={`compare-result-row ${row.type}`} key={index}>
                  <span className="compare-line-no">{row.line}</span>

                  <div>
                    {row.type === "changed" ? (
                      <>
                        <p>
                          <b>OLD:</b> {row.left || " "}
                        </p>
                        <p>
                          <b>NEW:</b> {row.right || " "}
                        </p>
                      </>
                    ) : (
                      <p>{row.type === "added" ? row.right : row.left || " "}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="compare-empty">
                <GitCompare />
                <p>{t.noText}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}