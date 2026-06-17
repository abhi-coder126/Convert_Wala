import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Braces,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  RotateCcw,
  Wand2,
  Minimize2,
} from "lucide-react";
import "../styles/JsonFormatter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "JSON Formatter Online Free | JSON Beautifier & Validator",
    seoDesc: "Format, beautify, minify and validate JSON online for free.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON Formatter",
    subtitle: "Format, beautify, validate and minify JSON instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool formats messy JSON into readable code and also checks JSON errors.",
    input: "Input JSON",
    output: "Formatted JSON",
    placeholder: `{"name":"Abhishek","skill":"React"}`,
    outputPlaceholder: "Formatted JSON will appear here...",
    indent: "Indent Size",
    format: "Format JSON",
    minify: "Minify",
    copy: "Copy JSON",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "JSON copied successfully.",
    generated: "JSON formatted successfully.",
    minified: "JSON minified successfully.",
    noText: "Please enter JSON first.",
    invalidJson: "Invalid JSON. Please check your syntax.",
  },
  hi: {
    seoTitle: "JSON Formatter Online Free | JSON Beautifier & Validator",
    seoDesc: "JSON को free online format, beautify, minify और validate करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON Formatter",
    subtitle: "JSON को instantly format, beautify, validate और minify करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool messy JSON को readable code में format करता है और JSON errors भी check करता है।",
    input: "Input JSON",
    output: "Formatted JSON",
    placeholder: `{"name":"Abhishek","skill":"React"}`,
    outputPlaceholder: "Formatted JSON यहां दिखेगा...",
    indent: "Indent Size",
    format: "JSON Format करें",
    minify: "Minify",
    copy: "JSON Copy करें",
    download: "JSON Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "JSON successfully copy हो गया।",
    generated: "JSON successfully format हो गया।",
    minified: "JSON successfully minify हो गया।",
    noText: "कृपया पहले JSON enter करें।",
    invalidJson: "Invalid JSON. कृपया syntax check करें।",
  },
  hinglish: {
    seoTitle: "JSON Formatter Online Free | JSON Beautifier & Validator",
    seoDesc: "JSON ko free online format, beautify, minify aur validate karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON Formatter",
    subtitle: "JSON ko instantly format, beautify, validate aur minify karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye messy JSON ko readable code me format karta hai aur JSON errors bhi check karta hai.",
    input: "Input JSON",
    output: "Formatted JSON",
    placeholder: `{"name":"Abhishek","skill":"React"}`,
    outputPlaceholder: "Formatted JSON yaha show hoga...",
    indent: "Indent Size",
    format: "Format JSON",
    minify: "Minify",
    copy: "Copy JSON",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "JSON successfully copy ho gaya.",
    generated: "JSON successfully format ho gaya.",
    minified: "JSON successfully minify ho gaya.",
    noText: "Please pehle JSON enter karo.",
    invalidJson: "Invalid JSON. Syntax check karo.",
  },
};

const countLines = (text) =>
  text.trim() ? text.split(/\r\n|\r|\n/).length : 0;

export default function JsonFormatter() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [jsonStatus, setJsonStatus] = useState("empty");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

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

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      const parsed = JSON.parse(inputText);
      return JSON.stringify(parsed, null, Number(indentSize));
    } catch {
      return outputText;
    }
  }, [inputText, indentSize, outputText]);

  const currentOutput = outputText || livePreview;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const formatJson = () => {
    if (!inputText.trim()) {
      setJsonStatus("empty");
      showToast("error", t.noText);
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, Number(indentSize));

      setOutputText(formatted);
      setJsonStatus("valid");
      showToast("success", t.generated);
    } catch {
      setOutputText("");
      setJsonStatus("invalid");
      showToast("error", t.invalidJson);
    }
  };

  const minifyJson = () => {
    if (!inputText.trim()) {
      setJsonStatus("empty");
      showToast("error", t.noText);
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const minified = JSON.stringify(parsed);

      setOutputText(minified);
      setJsonStatus("valid");
      showToast("success", t.minified);
    } catch {
      setOutputText("");
      setJsonStatus("invalid");
      showToast("error", t.invalidJson);
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
    link.download = "Convert Wala_formatted_json.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
    setJsonStatus("empty");
  };

  const resetTool = () => {
    setInputText("");
    setOutputText("");
    setIndentSize(2);
    setJsonStatus("empty");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="json formatter, json validator, json beautifier, json minifier, format json online"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/json-formatter" />
      </Helmet>

      <main className={`json-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`json-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="json-hero">
          <div className="json-badge">
            <Braces />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="json-info">
          <FileJson />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="json-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>

          <div>
            <span>{t.lines}</span>
            <strong>{countLines(inputText)}</strong>
          </div>

          <div>
            <span>{t.status}</span>
            <strong
              className={
                jsonStatus === "valid"
                  ? "json-valid"
                  : jsonStatus === "invalid"
                  ? "json-invalid"
                  : ""
              }
            >
              {jsonStatus === "valid"
                ? t.valid
                : jsonStatus === "invalid"
                ? t.invalid
                : "-"}
            </strong>
          </div>
        </section>

        <section className="json-options">
          <div className="json-control">
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

        <section className="json-shell">
          <div className="json-card">
            <div className="json-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
                setJsonStatus("empty");
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="json-actions">
              <button onClick={formatJson}>
                <Wand2 />
                {t.format}
              </button>

              <button onClick={minifyJson}>
                <Minimize2 />
                {t.minify}
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

          <div className="json-card">
            <div className="json-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="json-actions">
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