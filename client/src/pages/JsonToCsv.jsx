import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Table,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/JsonToCsv.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "JSON to CSV Converter Online Free",
    seoDesc: "Convert JSON array or object data into CSV format online for free.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON to CSV",
    subtitle: "Convert JSON data into clean CSV format instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool converts JSON arrays or objects into CSV rows and columns.",
    input: "Input JSON",
    output: "Generated CSV",
    placeholder: `[{"name":"Ajay","skill":"React"},{"name":"Rahul","skill":"Node"}]`,
    outputPlaceholder: "CSV output will appear here...",
    convert: "Convert to CSV",
    copy: "Copy CSV",
    download: "Download CSV",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rows: "Rows",
    columns: "Columns",
    copied: "CSV copied successfully.",
    generated: "CSV generated successfully.",
    noText: "Please enter JSON first.",
    invalidJson: "Invalid JSON. Please enter an object or array.",
  },
  hi: {
    seoTitle: "JSON to CSV Converter Online Free",
    seoDesc: "JSON array या object data को CSV format में free online convert करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON to CSV",
    subtitle: "JSON data को clean CSV format में instantly convert करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool JSON arrays या objects को CSV rows और columns में convert करता है।",
    input: "Input JSON",
    output: "Generated CSV",
    placeholder: `[{"name":"Ajay","skill":"React"},{"name":"Rahul","skill":"Node"}]`,
    outputPlaceholder: "CSV output यहां दिखेगा...",
    convert: "CSV में Convert करें",
    copy: "CSV Copy करें",
    download: "CSV Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rows: "Rows",
    columns: "Columns",
    copied: "CSV successfully copy हो गया।",
    generated: "CSV successfully generate हो गया।",
    noText: "कृपया पहले JSON enter करें।",
    invalidJson: "Invalid JSON. कृपया object या array enter करें।",
  },
  hinglish: {
    seoTitle: "JSON to CSV Converter Online Free",
    seoDesc: "JSON array ya object data ko CSV format me free online convert karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON to CSV",
    subtitle: "JSON data ko clean CSV format me instantly convert karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye JSON arrays ya objects ko CSV rows aur columns me convert karta hai.",
    input: "Input JSON",
    output: "Generated CSV",
    placeholder: `[{"name":"Ajay","skill":"React"},{"name":"Rahul","skill":"Node"}]`,
    outputPlaceholder: "CSV output yaha show hoga...",
    convert: "Convert to CSV",
    copy: "Copy CSV",
    download: "Download CSV",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rows: "Rows",
    columns: "Columns",
    copied: "CSV successfully copy ho gaya.",
    generated: "CSV successfully generate ho gaya.",
    noText: "Please pehle JSON enter karo.",
    invalidJson: "Invalid JSON. Object ya array enter karo.",
  },
};

const flattenObject = (obj, prefix = "") => {
  let result = {};

  Object.keys(obj || {}).forEach((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result = { ...result, ...flattenObject(value, newKey) };
    } else {
      result[newKey] = Array.isArray(value) ? JSON.stringify(value) : value;
    }
  });

  return result;
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

  const stringValue =
    typeof value === "object" ? JSON.stringify(value) : String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const jsonToCsv = (jsonText) => {
  const parsed = JSON.parse(jsonText);
  const rows = Array.isArray(parsed) ? parsed : [parsed];

  if (!rows.length || rows.some((item) => typeof item !== "object" || item === null)) {
    throw new Error("Invalid JSON structure");
  }

  const flatRows = rows.map((row) => flattenObject(row));
  const headers = Array.from(
    new Set(flatRows.flatMap((row) => Object.keys(row)))
  );

  const csvRows = [
    headers.map(escapeCsvValue).join(","),
    ...flatRows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    ),
  ];

  return {
    csv: csvRows.join("\n"),
    rows: flatRows.length,
    columns: headers.length,
  };
};

export default function JsonToCsv() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [columnCount, setColumnCount] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      return jsonToCsv(inputText).csv;
    } catch {
      return outputText;
    }
  }, [inputText, outputText]);

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

  const convertJson = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = jsonToCsv(inputText);
      setOutputText(result.csv);
      setRowCount(result.rows);
      setColumnCount(result.columns);
      showToast("success", t.generated);
    } catch {
      setOutputText("");
      setRowCount(0);
      setColumnCount(0);
      showToast("error", t.invalidJson);
    }
  };

  const copyCsv = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadCsv = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_json_to_csv.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
    setRowCount(0);
    setColumnCount(0);
  };

  const resetTool = () => {
    clearTool();
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="json to csv, convert json to csv, json csv converter, online json to csv"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/json-to-csv" />
      </Helmet>

      <main className={`jsoncsv-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`jsoncsv-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="jsoncsv-hero">
          <div className="jsoncsv-badge">
            <Table />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="jsoncsv-info">
          <FileJson />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="jsoncsv-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>
          <div>
            <span>{t.rows}</span>
            <strong>{rowCount}</strong>
          </div>
          <div>
            <span>{t.columns}</span>
            <strong>{columnCount}</strong>
          </div>
        </section>

        <section className="jsoncsv-shell">
          <div className="jsoncsv-card">
            <div className="jsoncsv-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
                setRowCount(0);
                setColumnCount(0);
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="jsoncsv-actions">
              <button onClick={convertJson}>
                <Wand2 />
                {t.convert}
              </button>

              <button
                onClick={clearTool}
                disabled={!inputText && !outputText}
                className="danger"
              >
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="jsoncsv-card">
            <div className="jsoncsv-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="jsoncsv-actions">
              <button onClick={copyCsv} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadCsv} disabled={!currentOutput.trim()}>
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