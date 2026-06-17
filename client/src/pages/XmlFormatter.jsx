import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  CodeXml,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileCode2,
  RotateCcw,
  Wand2,
  Minimize2,
} from "lucide-react";
import "../styles/XmlFormatter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "XML Formatter Online Free | XML Beautifier",
    seoDesc: "Format, beautify, validate and minify XML online for free.",
    eyebrow: "Convert Wala Developer Tool",
    title: "XML Formatter",
    subtitle: "Format, beautify, validate and minify XML instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool converts messy XML into clean readable format and checks XML syntax errors.",
    input: "Input XML",
    output: "Formatted XML",
    placeholder: `<user><name>Ajay</name><skill>React</skill></user>`,
    outputPlaceholder: "Formatted XML will appear here...",
    indent: "Indent Size",
    format: "Format XML",
    minify: "Minify",
    copy: "Copy XML",
    download: "Download XML",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "XML copied successfully.",
    generated: "XML formatted successfully.",
    minified: "XML minified successfully.",
    noText: "Please enter XML first.",
    invalidXml: "Invalid XML. Please check your syntax.",
  },
  hi: {
    seoTitle: "XML Formatter Online Free | XML Beautifier",
    seoDesc: "XML को free online format, beautify, validate और minify करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "XML Formatter",
    subtitle: "XML को instantly format, beautify, validate और minify करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool messy XML को clean readable format में convert करता है और XML syntax errors check करता है।",
    input: "Input XML",
    output: "Formatted XML",
    placeholder: `<user><name>Ajay</name><skill>React</skill></user>`,
    outputPlaceholder: "Formatted XML यहां दिखेगा...",
    indent: "Indent Size",
    format: "XML Format करें",
    minify: "Minify",
    copy: "XML Copy करें",
    download: "XML Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "XML successfully copy हो गया।",
    generated: "XML successfully format हो गया।",
    minified: "XML successfully minify हो गया।",
    noText: "कृपया पहले XML enter करें।",
    invalidXml: "Invalid XML. कृपया syntax check करें।",
  },
  hinglish: {
    seoTitle: "XML Formatter Online Free | XML Beautifier",
    seoDesc: "XML ko free online format, beautify, validate aur minify karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "XML Formatter",
    subtitle: "XML ko instantly format, beautify, validate aur minify karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye messy XML ko clean readable format me convert karta hai aur XML syntax errors check karta hai.",
    input: "Input XML",
    output: "Formatted XML",
    placeholder: `<user><name>Ajay</name><skill>React</skill></user>`,
    outputPlaceholder: "Formatted XML yaha show hoga...",
    indent: "Indent Size",
    format: "Format XML",
    minify: "Minify",
    copy: "Copy XML",
    download: "Download XML",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    lines: "Lines",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "XML successfully copy ho gaya.",
    generated: "XML successfully format ho gaya.",
    minified: "XML successfully minify ho gaya.",
    noText: "Please pehle XML enter karo.",
    invalidXml: "Invalid XML. Syntax check karo.",
  },
};

const countLines = (text) => (text.trim() ? text.split(/\r\n|\r|\n/).length : 0);

const validateXml = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  const parserError = xmlDoc.querySelector("parsererror");

  if (parserError) {
    throw new Error(parserError.textContent || "Invalid XML");
  }

  return true;
};

const formatXml = (xmlText, indentSize = 2) => {
  validateXml(xmlText);

  const indent = " ".repeat(Number(indentSize));
  let formatted = "";
  let level = 0;

  const xml = xmlText
    .replace(/>\s*</g, "><")
    .replace(/(>)(<)(\/*)/g, "$1\n$2$3");

  xml.split("\n").forEach((node) => {
    const trimmedNode = node.trim();

    if (!trimmedNode) return;

    if (trimmedNode.match(/^<\/\w/)) {
      level = Math.max(level - 1, 0);
    }

    formatted += `${indent.repeat(level)}${trimmedNode}\n`;

    if (
      trimmedNode.match(/^<[^!?/][^>]*[^/]>/) &&
      !trimmedNode.match(/^<[^>]+>.*<\/[^>]+>$/)
    ) {
      level++;
    }
  });

  return formatted.trim();
};

const minifyXml = (xmlText) => {
  validateXml(xmlText);
  return xmlText.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
};

export default function XmlFormatter() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [xmlStatus, setXmlStatus] = useState("empty");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      return formatXml(inputText, indentSize);
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

  const handleFormat = () => {
    if (!inputText.trim()) {
      setXmlStatus("empty");
      showToast("error", t.noText);
      return;
    }

    try {
      const formatted = formatXml(inputText, indentSize);
      setOutputText(formatted);
      setXmlStatus("valid");
      showToast("success", t.generated);
    } catch {
      setOutputText("");
      setXmlStatus("invalid");
      showToast("error", t.invalidXml);
    }
  };

  const handleMinify = () => {
    if (!inputText.trim()) {
      setXmlStatus("empty");
      showToast("error", t.noText);
      return;
    }

    try {
      const minified = minifyXml(inputText);
      setOutputText(minified);
      setXmlStatus("valid");
      showToast("success", t.minified);
    } catch {
      setOutputText("");
      setXmlStatus("invalid");
      showToast("error", t.invalidXml);
    }
  };

  const copyXml = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadXml = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "application/xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_formatted_xml.xml";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
    setXmlStatus("empty");
  };

  const resetTool = () => {
    setInputText("");
    setOutputText("");
    setIndentSize(2);
    setXmlStatus("empty");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="xml formatter, xml beautifier, xml validator, xml minifier, format xml online"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/xml-formatter" />
      </Helmet>

      <main className={`xml-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`xml-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="xml-hero">
          <div className="xml-badge">
            <CodeXml />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="xml-info">
          <FileCode2 />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="xml-stats">
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
                xmlStatus === "valid"
                  ? "xml-valid"
                  : xmlStatus === "invalid"
                  ? "xml-invalid"
                  : ""
              }
            >
              {xmlStatus === "valid"
                ? t.valid
                : xmlStatus === "invalid"
                ? t.invalid
                : "-"}
            </strong>
          </div>
        </section>

        <section className="xml-options">
          <div className="xml-control">
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

        <section className="xml-shell">
          <div className="xml-card">
            <div className="xml-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
                setXmlStatus("empty");
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="xml-actions">
              <button onClick={handleFormat}>
                <Wand2 />
                {t.format}
              </button>

              <button onClick={handleMinify}>
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

          <div className="xml-card">
            <div className="xml-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="xml-actions">
              <button onClick={copyXml} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadXml} disabled={!currentOutput.trim()}>
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