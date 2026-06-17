import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Regex,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/RegexTester.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Regex Tester Online Free | Regular Expression Tester",
    seoDesc: "Test regular expressions online for free. Check regex matches with flags and live results.",
    eyebrow: "Convert Wala Developer Tool",
    title: "Regex Tester",
    subtitle: "Test regular expressions and find matches instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool tests your regex pattern against text and shows all matching results.",
    pattern: "Regex Pattern",
    input: "Test Text",
    output: "Match Results",
    patternPlaceholder: "\\b\\w+@\\w+\\.\\w+\\b",
    textPlaceholder: "Enter text to test your regex...",
    outputPlaceholder: "Matches will appear here...",
    flags: "Regex Flags",
    test: "Test Regex",
    sample: "Sample",
    copy: "Copy Result",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    matches: "Matches",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "Result copied successfully.",
    tested: "Regex tested successfully.",
    sampleLoaded: "Sample loaded successfully.",
    noPattern: "Please enter regex pattern first.",
    invalidRegex: "Invalid regex pattern.",
  },
  hi: {
    seoTitle: "Regex Tester Online Free | Regular Expression Tester",
    seoDesc: "Regular expressions को free online test करें। Regex matches flags और live results के साथ check करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "Regex Tester",
    subtitle: "Regular expressions test करें और matches instantly find करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool आपके regex pattern को text पर test करता है और सभी matching results दिखाता है।",
    pattern: "Regex Pattern",
    input: "Test Text",
    output: "Match Results",
    patternPlaceholder: "\\b\\w+@\\w+\\.\\w+\\b",
    textPlaceholder: "Regex test करने के लिए text enter करें...",
    outputPlaceholder: "Matches यहां दिखेंगे...",
    flags: "Regex Flags",
    test: "Regex Test करें",
    sample: "Sample",
    copy: "Result Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    matches: "Matches",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "Result successfully copy हो गया।",
    tested: "Regex successfully test हो गया।",
    sampleLoaded: "Sample successfully load हो गया।",
    noPattern: "कृपया पहले regex pattern enter करें।",
    invalidRegex: "Invalid regex pattern.",
  },
  hinglish: {
    seoTitle: "Regex Tester Online Free | Regular Expression Tester",
    seoDesc: "Regular expressions ko free online test karo. Regex matches flags aur live results ke saath check karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "Regex Tester",
    subtitle: "Regular expressions test karo aur matches instantly find karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye regex pattern ko text par test karta hai aur sabhi matching results show karta hai.",
    pattern: "Regex Pattern",
    input: "Test Text",
    output: "Match Results",
    patternPlaceholder: "\\b\\w+@\\w+\\.\\w+\\b",
    textPlaceholder: "Regex test karne ke liye text enter karo...",
    outputPlaceholder: "Matches yaha show honge...",
    flags: "Regex Flags",
    test: "Test Regex",
    sample: "Sample",
    copy: "Copy Result",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    matches: "Matches",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "Result successfully copy ho gaya.",
    tested: "Regex successfully test ho gaya.",
    sampleLoaded: "Sample successfully load ho gaya.",
    noPattern: "Please pehle regex pattern enter karo.",
    invalidRegex: "Invalid regex pattern.",
  },
};

const samplePattern = "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b";
const sampleText = `Contact us at hello@convertwala.com or support@example.com.
Invalid email: test@wrong
Another valid email: ajay.kumar@gmail.com`;

const getFlags = ({ global, ignoreCase, multiline }) => {
  let flags = "";
  if (global) flags += "g";
  if (ignoreCase) flags += "i";
  if (multiline) flags += "m";
  return flags;
};

const runRegexTest = (pattern, text, flags) => {
  const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      match: match[0],
      index: match.index,
      groups: match.slice(1),
    });

    if (match[0] === "") regex.lastIndex++;
  }

  return matches;
};

const formatMatches = (matches) => {
  if (!matches.length) return "No matches found.";

  return matches
    .map((item, index) => {
      const groups = item.groups.length
        ? `\nGroups: ${item.groups.map((g, i) => `$${i + 1}: ${g}`).join(", ")}`
        : "";

      return `Match ${index + 1}
Value: ${item.match}
Index: ${item.index}${groups}`;
    })
    .join("\n\n");
};

export default function RegexTester() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [pattern, setPattern] = useState("");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [regexStatus, setRegexStatus] = useState("empty");
  const [globalFlag, setGlobalFlag] = useState(true);
  const [ignoreCaseFlag, setIgnoreCaseFlag] = useState(false);
  const [multilineFlag, setMultilineFlag] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const activeFlags = useMemo(
    () =>
      getFlags({
        global: globalFlag,
        ignoreCase: ignoreCaseFlag,
        multiline: multilineFlag,
      }),
    [globalFlag, ignoreCaseFlag, multilineFlag]
  );

  const livePreview = useMemo(() => {
    if (!pattern.trim() || !inputText.trim()) return "";

    try {
      const matches = runRegexTest(pattern, inputText, activeFlags);
      return formatMatches(matches);
    } catch {
      return outputText;
    }
  }, [pattern, inputText, activeFlags, outputText]);

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

  const testRegex = () => {
    if (!pattern.trim()) {
      setRegexStatus("empty");
      showToast("error", t.noPattern);
      return;
    }

    try {
      const matches = runRegexTest(pattern, inputText, activeFlags);
      setOutputText(formatMatches(matches));
      setMatchCount(matches.length);
      setRegexStatus("valid");
      showToast("success", t.tested);
    } catch {
      setOutputText("");
      setMatchCount(0);
      setRegexStatus("invalid");
      showToast("error", t.invalidRegex);
    }
  };

  const loadSample = () => {
    setPattern(samplePattern);
    setInputText(sampleText);
    setOutputText("");
    setMatchCount(0);
    setRegexStatus("empty");
    setGlobalFlag(true);
    setIgnoreCaseFlag(false);
    setMultilineFlag(false);
    showToast("success", t.sampleLoaded);
  };

  const copyResult = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noPattern);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noPattern);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_regex_result.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setPattern("");
    setInputText("");
    setOutputText("");
    setMatchCount(0);
    setRegexStatus("empty");
  };

  const resetTool = () => {
    clearTool();
    setGlobalFlag(true);
    setIgnoreCaseFlag(false);
    setMultilineFlag(false);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="regex tester, regular expression tester, regex checker, regex match tester, online regex tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/regex-tester" />
      </Helmet>

      <main className={`regex-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`regex-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="regex-hero">
          <div className="regex-badge">
            <Regex />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="regex-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="regex-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>

          <div>
            <span>{t.matches}</span>
            <strong>{matchCount}</strong>
          </div>

          <div>
            <span>{t.status}</span>
            <strong
              className={
                regexStatus === "valid"
                  ? "regex-valid"
                  : regexStatus === "invalid"
                  ? "regex-invalid"
                  : ""
              }
            >
              {regexStatus === "valid"
                ? t.valid
                : regexStatus === "invalid"
                ? t.invalid
                : "-"}
            </strong>
          </div>
        </section>

        <section className="regex-options">
          <div className="regex-control">
            <label>{t.pattern}</label>
            <input
              value={pattern}
              onChange={(e) => {
                setPattern(e.target.value);
                setOutputText("");
                setRegexStatus("empty");
                setMatchCount(0);
              }}
              placeholder={t.patternPlaceholder}
              spellCheck="false"
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={globalFlag}
              onChange={(e) => {
                setGlobalFlag(e.target.checked);
                setOutputText("");
              }}
            />
            <span>Global / g</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={ignoreCaseFlag}
              onChange={(e) => {
                setIgnoreCaseFlag(e.target.checked);
                setOutputText("");
              }}
            />
            <span>Ignore Case / i</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={multilineFlag}
              onChange={(e) => {
                setMultilineFlag(e.target.checked);
                setOutputText("");
              }}
            />
            <span>Multiline / m</span>
          </label>
        </section>

        <section className="regex-shell">
          <div className="regex-card">
            <div className="regex-card-head">
              <h3>{t.input}</h3>
              <span>/{activeFlags}</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
                setMatchCount(0);
              }}
              placeholder={t.textPlaceholder}
              spellCheck="false"
            />

            <div className="regex-actions">
              <button onClick={testRegex}>
                <Wand2 />
                {t.test}
              </button>

              <button onClick={loadSample}>
                <FileText />
                {t.sample}
              </button>

              <button
                onClick={clearTool}
                disabled={!pattern && !inputText && !outputText}
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

          <div className="regex-card">
            <div className="regex-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="regex-actions">
              <button onClick={copyResult} disabled={!currentOutput.trim()}>
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