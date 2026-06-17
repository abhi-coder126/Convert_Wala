import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Code2,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/TextToHTML.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Text to HTML Converter Online Free",
    seoDesc: "Convert plain text into clean HTML paragraphs, line breaks and lists online for free.",
    eyebrow: "Convert Wala Text Tool",
    title: "Text to HTML",
    subtitle: "Convert plain text into clean HTML code instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool converts your normal text into HTML with paragraphs, breaks and clean formatting.",
    input: "Input Text",
    output: "Generated HTML",
    placeholder: "Enter plain text here...",
    outputPlaceholder: "<p>Your HTML will appear here...</p>",
    mode: "Output Mode",
    preserveBreaks: "Preserve Line Breaks",
    escapeHtml: "Escape HTML",
    convert: "Convert to HTML",
    copy: "Copy HTML",
    download: "Download HTML",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "HTML copied successfully.",
    generated: "HTML generated successfully.",
    noText: "Please enter text first.",
  },
  hi: {
    seoTitle: "Text to HTML Converter Online Free",
    seoDesc: "Plain text को clean HTML paragraphs, line breaks और lists में free online convert करें।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Text to HTML",
    subtitle: "Plain text को clean HTML code में instantly convert करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool normal text को paragraphs, breaks और clean formatting वाले HTML में convert करता है।",
    input: "Input Text",
    output: "Generated HTML",
    placeholder: "Plain text यहां enter करें...",
    outputPlaceholder: "<p>Your HTML will appear here...</p>",
    mode: "Output Mode",
    preserveBreaks: "Line Breaks Preserve करें",
    escapeHtml: "HTML Escape करें",
    convert: "HTML में Convert करें",
    copy: "HTML Copy करें",
    download: "HTML Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "HTML successfully copy हो गया।",
    generated: "HTML successfully generate हो गया।",
    noText: "कृपया पहले text enter करें।",
  },
  hinglish: {
    seoTitle: "Text to HTML Converter Online Free",
    seoDesc: "Plain text ko clean HTML paragraphs, line breaks aur lists me free online convert karo.",
    eyebrow: "Convert Wala Text Tool",
    title: "Text to HTML",
    subtitle: "Plain text ko clean HTML code me instantly convert karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye normal text ko paragraphs, breaks aur clean formatting wale HTML me convert karta hai.",
    input: "Input Text",
    output: "Generated HTML",
    placeholder: "Plain text yaha enter karo...",
    outputPlaceholder: "<p>Your HTML will appear here...</p>",
    mode: "Output Mode",
    preserveBreaks: "Preserve Line Breaks",
    escapeHtml: "Escape HTML",
    convert: "Convert to HTML",
    copy: "Copy HTML",
    download: "Download HTML",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "HTML successfully copy ho gaya.",
    generated: "HTML successfully generate ho gaya.",
    noText: "Please pehle text enter karo.",
  },
};

const escapeHtmlText = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const textToHtml = (text, options) => {
  const { mode, preserveBreaks, escapeHtml } = options;
  const safeText = escapeHtml ? escapeHtmlText(text) : text;

  if (mode === "br") {
    return safeText.replace(/\r\n|\r|\n/g, "<br />");
  }

  if (mode === "list") {
    return `<ul>\n${safeText
      .split(/\r\n|\r|\n/)
      .filter((line) => line.trim())
      .map((line) => `  <li>${line.trim()}</li>`)
      .join("\n")}\n</ul>`;
  }

  return safeText
    .split(/\n\s*\n/)
    .filter((para) => para.trim())
    .map((para) => {
      const content = preserveBreaks
        ? para.trim().replace(/\r\n|\r|\n/g, "<br />")
        : para.trim().replace(/\s+/g, " ");
      return `<p>${content}</p>`;
    })
    .join("\n");
};

const countWords = (text) =>
  text.trim() ? text.trim().match(/\S+/g)?.length || 0 : 0;

export default function TextToHTML() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("paragraph");
  const [preserveBreaks, setPreserveBreaks] = useState(true);
  const [escapeHtml, setEscapeHtml] = useState(true);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";
    return textToHtml(inputText, { mode, preserveBreaks, escapeHtml });
  }, [inputText, mode, preserveBreaks, escapeHtml]);

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

  const convertText = () => {
    if (!inputText.trim()) return showToast("error", t.noText);
    setOutputText(livePreview);
    showToast("success", t.generated);
  };

  const copyHtml = async () => {
    if (!currentOutput.trim()) return showToast("error", t.noText);
    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

const downloadHtml = () => {
  if (!currentOutput.trim()) {
    showToast("error", t.noText);
    return;
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Generated HTML</title>
</head>
<body>

${currentOutput}

</body>
</html>`;

  const blob = new Blob([fullHtml], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Convert Wala_text_to_html.html";

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
    setMode("paragraph");
    setPreserveBreaks(true);
    setEscapeHtml(true);
  };

  const lineCount = inputText.trim()
    ? inputText.split(/\r\n|\r|\n/).filter((line) => line.trim()).length
    : 0;

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="text to html, html converter, text html generator, paragraph to html, free html converter"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/text-to-html" />
      </Helmet>

      <main className={`html-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`html-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="html-hero">
          <div className="html-badge">
            <Code2 />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="html-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="html-stats">
          <div><span>{t.chars}</span><strong>{inputText.length}</strong></div>
          <div><span>{t.words}</span><strong>{countWords(inputText)}</strong></div>
          <div><span>{t.lines}</span><strong>{lineCount}</strong></div>
        </section>

        <section className="html-options">
          <div className="html-control">
            <label>{t.mode}</label>
            <select value={mode} onChange={(e) => { setMode(e.target.value); setOutputText(""); }}>
              <option value="paragraph">Paragraphs &lt;p&gt;</option>
              <option value="br">Line Breaks &lt;br /&gt;</option>
              <option value="list">List &lt;ul&gt;</option>
            </select>
          </div>

          <label>
            <input type="checkbox" checked={preserveBreaks} onChange={(e) => { setPreserveBreaks(e.target.checked); setOutputText(""); }} />
            <span>{t.preserveBreaks}</span>
          </label>

          <label>
            <input type="checkbox" checked={escapeHtml} onChange={(e) => { setEscapeHtml(e.target.checked); setOutputText(""); }} />
            <span>{t.escapeHtml}</span>
          </label>
        </section>

        <section className="html-shell">
          <div className="html-card">
            <div className="html-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea value={inputText} onChange={(e) => { setInputText(e.target.value); setOutputText(""); }} placeholder={t.placeholder} />

            <div className="html-actions">
              <button onClick={convertText}><Wand2 />{t.convert}</button>
              <button onClick={clearTool} disabled={!inputText && !outputText} className="danger"><Trash2 />{t.clear}</button>
              <button onClick={resetTool}><RotateCcw />{t.reset}</button>
            </div>
          </div>

          <div className="html-card">
            <div className="html-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea value={currentOutput} onChange={(e) => setOutputText(e.target.value)} placeholder={t.outputPlaceholder} />

            <div className="html-actions">
              <button onClick={copyHtml} disabled={!currentOutput.trim()}><Copy />{t.copy}</button>
              <button onClick={downloadHtml} disabled={!currentOutput.trim()}><Download />{t.download}</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}