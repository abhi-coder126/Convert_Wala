import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ShieldCheck,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  RotateCcw,
  Wand2,
  CircleX,
} from "lucide-react";
import "../styles/JsonValidator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "JSON Validator Online Free | Validate JSON Syntax",
    seoDesc: "Validate JSON online for free. Check JSON syntax errors and verify valid JSON instantly.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON Validator",
    subtitle: "Validate JSON syntax and find errors instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool checks whether your JSON is valid or invalid and shows syntax error details.",
    input: "Input JSON",
    result: "Validation Result",
    placeholder: `{"name":"Ajay","skills":["React","JavaScript"]}`,
    resultPlaceholder: "Validation result will appear here...",
    validate: "Validate JSON",
    sample: "Sample JSON",
    copy: "Copy Result",
    download: "Download Report",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    empty: "Empty",
    copied: "Result copied successfully.",
    validMsg: "Your JSON is valid.",
    invalidMsg: "Your JSON is invalid.",
    noText: "Please enter JSON first.",
    sampleLoaded: "Sample JSON loaded successfully.",
  },
  hi: {
    seoTitle: "JSON Validator Online Free | Validate JSON Syntax",
    seoDesc: "JSON को free online validate करें। JSON syntax errors check करें और valid JSON verify करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON Validator",
    subtitle: "JSON syntax validate करें और errors instantly find करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool check करता है कि आपका JSON valid है या invalid और syntax error details दिखाता है।",
    input: "Input JSON",
    result: "Validation Result",
    placeholder: `{"name":"Ajay","skills":["React","JavaScript"]}`,
    resultPlaceholder: "Validation result यहां दिखेगा...",
    validate: "JSON Validate करें",
    sample: "Sample JSON",
    copy: "Result Copy करें",
    download: "Report Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    empty: "Empty",
    copied: "Result successfully copy हो गया।",
    validMsg: "आपका JSON valid है।",
    invalidMsg: "आपका JSON invalid है।",
    noText: "कृपया पहले JSON enter करें।",
    sampleLoaded: "Sample JSON successfully load हो गया।",
  },
  hinglish: {
    seoTitle: "JSON Validator Online Free | Validate JSON Syntax",
    seoDesc: "JSON ko free online validate karo. JSON syntax errors check karo aur valid JSON verify karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JSON Validator",
    subtitle: "JSON syntax validate karo aur errors instantly find karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye check karta hai ki JSON valid hai ya invalid aur syntax error details show karta hai.",
    input: "Input JSON",
    result: "Validation Result",
    placeholder: `{"name":"Ajay","skills":["React","JavaScript"]}`,
    resultPlaceholder: "Validation result yaha show hoga...",
    validate: "Validate JSON",
    sample: "Sample JSON",
    copy: "Copy Result",
    download: "Download Report",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    empty: "Empty",
    copied: "Result successfully copy ho gaya.",
    validMsg: "Tumhara JSON valid hai.",
    invalidMsg: "Tumhara JSON invalid hai.",
    noText: "Please pehle JSON enter karo.",
    sampleLoaded: "Sample JSON successfully load ho gaya.",
  },
};

const sampleJson = `{
  "name": "Ajay Kumar",
  "role": "React Developer",
  "skills": ["React", "JavaScript", "CSS"],
  "active": true
}`;

const countLines = (text) => (text.trim() ? text.split(/\r\n|\r|\n/).length : 0);

const getErrorPosition = (message) => {
  const match = message.match(/position (\d+)/i);
  return match ? Number(match[1]) : null;
};

const getLineColumn = (text, position) => {
  if (position === null) return null;

  const beforeError = text.slice(0, position);
  const lines = beforeError.split(/\r\n|\r|\n/);

  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
};

export default function JsonValidator() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [status, setStatus] = useState("empty");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const liveStatus = useMemo(() => {
    if (!inputText.trim()) return "empty";

    try {
      JSON.parse(inputText);
      return "valid";
    } catch {
      return "invalid";
    }
  }, [inputText]);

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

  const validateJson = () => {
    if (!inputText.trim()) {
      setStatus("empty");
      setResultText("");
      showToast("error", t.noText);
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      const keys =
        parsed && typeof parsed === "object" && !Array.isArray(parsed)
          ? Object.keys(parsed).length
          : Array.isArray(parsed)
          ? parsed.length
          : 1;

      const message = `✅ ${t.validMsg}

Status: ${t.valid}
Type: ${Array.isArray(parsed) ? "Array" : typeof parsed}
Items / Keys: ${keys}
Characters: ${inputText.length}
Lines: ${countLines(inputText)}`;

      setStatus("valid");
      setResultText(message);
      showToast("success", t.validMsg);
    } catch (error) {
      const position = getErrorPosition(error.message);
      const location = getLineColumn(inputText, position);

      const message = `❌ ${t.invalidMsg}

Status: ${t.invalid}
Error: ${error.message}${
        location
          ? `\nLine: ${location.line}\nColumn: ${location.column}`
          : ""
      }
Characters: ${inputText.length}
Lines: ${countLines(inputText)}`;

      setStatus("invalid");
      setResultText(message);
      showToast("error", t.invalidMsg);
    }
  };

  const copyResult = async () => {
    if (!resultText.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(resultText);
    showToast("success", t.copied);
  };

  const downloadReport = () => {
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
    link.download = "Convert Wala_json_validation_report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputText(sampleJson);
    setResultText("");
    setStatus("empty");
    showToast("success", t.sampleLoaded);
  };

  const clearTool = () => {
    setInputText("");
    setResultText("");
    setStatus("empty");
  };

  const resetTool = () => {
    setInputText("");
    setResultText("");
    setStatus("empty");
  };

  const visibleStatus = status === "empty" ? liveStatus : status;

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="json validator, validate json, json syntax checker, json error checker, online json validator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/json-validator" />
      </Helmet>

      <main className={`validator-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`validator-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="validator-hero">
          <div className="validator-badge">
            <ShieldCheck />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="validator-info">
          <FileJson />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="validator-stats">
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
                visibleStatus === "valid"
                  ? "validator-valid"
                  : visibleStatus === "invalid"
                  ? "validator-invalid"
                  : ""
              }
            >
              {visibleStatus === "valid"
                ? t.valid
                : visibleStatus === "invalid"
                ? t.invalid
                : t.empty}
            </strong>
          </div>
        </section>

        <section className="validator-shell">
          <div className="validator-card">
            <div className="validator-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setResultText("");
                setStatus("empty");
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="validator-actions">
              <button onClick={validateJson}>
                <Wand2 />
                {t.validate}
              </button>

              <button onClick={loadSample}>
                <FileJson />
                {t.sample}
              </button>

              <button
                onClick={clearTool}
                disabled={!inputText && !resultText}
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

          <div className="validator-card">
            <div className="validator-card-head">
              <h3>{t.result}</h3>
              <span
                className={
                  visibleStatus === "valid"
                    ? "validator-head-valid"
                    : visibleStatus === "invalid"
                    ? "validator-head-invalid"
                    : ""
                }
              >
                {visibleStatus === "valid"
                  ? t.valid
                  : visibleStatus === "invalid"
                  ? t.invalid
                  : t.empty}
              </span>
            </div>

            <textarea
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              placeholder={t.resultPlaceholder}
              spellCheck="false"
            />

            <div className="validator-actions">
              <button onClick={copyResult} disabled={!resultText.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadReport} disabled={!resultText.trim()}>
                <Download />
                {t.download}
              </button>

              <button disabled={!resultText.trim()} className="danger">
                <CircleX />
                {visibleStatus === "invalid" ? t.invalid : t.valid}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}