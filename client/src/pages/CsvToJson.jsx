import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileJson,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Table,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/CsvToJson.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "CSV to JSON Converter Online Free",
    seoDesc: "Convert CSV data into clean JSON array format online for free.",
    eyebrow: "Convert Wala Developer Tool",
    title: "CSV to JSON",
    subtitle: "Convert CSV rows into clean JSON format instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool converts CSV data into JSON array objects using the first row as keys.",
    input: "Input CSV",
    output: "Generated JSON",
    placeholder: "name,skill\nAjay,React\nRahul,Node",
    outputPlaceholder: "JSON output will appear here...",
    indent: "Indent Size",
    convert: "Convert to JSON",
    copy: "Copy JSON",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rows: "Rows",
    columns: "Columns",
    copied: "JSON copied successfully.",
    generated: "JSON generated successfully.",
    noText: "Please enter CSV first.",
    invalidCsv: "Invalid CSV. Please check your data.",
  },
  hi: {
    seoTitle: "CSV to JSON Converter Online Free",
    seoDesc: "CSV data को clean JSON array format में free online convert करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "CSV to JSON",
    subtitle: "CSV rows को clean JSON format में instantly convert करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool CSV data को JSON array objects में convert करता है और first row को keys मानता है।",
    input: "Input CSV",
    output: "Generated JSON",
    placeholder: "name,skill\nAjay,React\nRahul,Node",
    outputPlaceholder: "JSON output यहां दिखेगा...",
    indent: "Indent Size",
    convert: "JSON में Convert करें",
    copy: "JSON Copy करें",
    download: "JSON Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rows: "Rows",
    columns: "Columns",
    copied: "JSON successfully copy हो गया।",
    generated: "JSON successfully generate हो गया।",
    noText: "कृपया पहले CSV enter करें।",
    invalidCsv: "Invalid CSV. कृपया data check करें।",
  },
  hinglish: {
    seoTitle: "CSV to JSON Converter Online Free",
    seoDesc: "CSV data ko clean JSON array format me free online convert karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "CSV to JSON",
    subtitle: "CSV rows ko clean JSON format me instantly convert karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye CSV data ko JSON array objects me convert karta hai aur first row ko keys maanta hai.",
    input: "Input CSV",
    output: "Generated JSON",
    placeholder: "name,skill\nAjay,React\nRahul,Node",
    outputPlaceholder: "JSON output yaha show hoga...",
    indent: "Indent Size",
    convert: "Convert to JSON",
    copy: "Copy JSON",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rows: "Rows",
    columns: "Columns",
    copied: "JSON successfully copy ho gaya.",
    generated: "JSON successfully generate ho gaya.",
    noText: "Please pehle CSV enter karo.",
    invalidCsv: "Invalid CSV. Data check karo.",
  },
};

const parseCsvLine = (line) => {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const csvToJson = (csvText, indentSize) => {
  const lines = csvText
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must have headers and at least one row.");
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());

  if (!headers.length || headers.some((header) => !header)) {
    throw new Error("CSV headers are invalid.");
  }

  const data = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);

    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] ?? "";
      return obj;
    }, {});
  });

  return {
    json: JSON.stringify(data, null, Number(indentSize)),
    rows: data.length,
    columns: headers.length,
  };
};

export default function CsvToJson() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [rowCount, setRowCount] = useState(0);
  const [columnCount, setColumnCount] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      return csvToJson(inputText, indentSize).json;
    } catch {
      return outputText;
    }
  }, [inputText, indentSize, outputText]);

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

  const convertCsv = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = csvToJson(inputText, indentSize);
      setOutputText(result.json);
      setRowCount(result.rows);
      setColumnCount(result.columns);
      showToast("success", t.generated);
    } catch {
      setOutputText("");
      setRowCount(0);
      setColumnCount(0);
      showToast("error", t.invalidCsv);
    }
  };

  const copyJson = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadJson = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_csv_to_json.json";
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
    setInputText("");
    setOutputText("");
    setIndentSize(2);
    setRowCount(0);
    setColumnCount(0);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="csv to json, convert csv to json, csv json converter, online csv to json"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/csv-to-json" />
      </Helmet>

      <main className={`csvjson-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`csvjson-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="csvjson-hero">
          <div className="csvjson-badge">
            <FileJson />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="csvjson-info">
          <Table />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="csvjson-stats">
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

        <section className="csvjson-options">
          <div className="csvjson-control">
            <label>{t.indent}</label>
            <select
              value={indentSize}
              onChange={(e) => {
                setIndentSize(e.target.value);
                setOutputText("");
              }}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="8">8 Spaces</option>
            </select>
          </div>
        </section>

        <section className="csvjson-shell">
          <div className="csvjson-card">
            <div className="csvjson-card-head">
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

            <div className="csvjson-actions">
              <button onClick={convertCsv}>
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

          <div className="csvjson-card">
            <div className="csvjson-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="csvjson-actions">
              <button onClick={copyJson} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadJson} disabled={!currentOutput.trim()}>
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