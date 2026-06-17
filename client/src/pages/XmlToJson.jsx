import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileJson,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  CodeXml,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/XmlToJson.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "XML to JSON Converter Online Free",
    seoDesc: "Convert XML data into clean JSON format online for free.",
    eyebrow: "Convert Wala Developer Tool",
    title: "XML to JSON",
    subtitle: "Convert XML data into readable JSON instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool converts valid XML into clean JSON format with proper structure.",
    input: "Input XML",
    output: "Generated JSON",
    placeholder: `<user><name>Ajay</name><skill>React</skill></user>`,
    outputPlaceholder: "JSON output will appear here...",
    indent: "Indent Size",
    convert: "Convert to JSON",
    copy: "Copy JSON",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    nodes: "Nodes",
    lines: "Lines",
    copied: "JSON copied successfully.",
    generated: "JSON generated successfully.",
    noText: "Please enter XML first.",
    invalidXml: "Invalid XML. Please check your syntax.",
  },
  hi: {
    seoTitle: "XML to JSON Converter Online Free",
    seoDesc: "XML data को clean JSON format में free online convert करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "XML to JSON",
    subtitle: "XML data को readable JSON में instantly convert करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool valid XML को proper structure वाले clean JSON format में convert करता है।",
    input: "Input XML",
    output: "Generated JSON",
    placeholder: `<user><name>Ajay</name><skill>React</skill></user>`,
    outputPlaceholder: "JSON output यहां दिखेगा...",
    indent: "Indent Size",
    convert: "JSON में Convert करें",
    copy: "JSON Copy करें",
    download: "JSON Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    nodes: "Nodes",
    lines: "Lines",
    copied: "JSON successfully copy हो गया।",
    generated: "JSON successfully generate हो गया।",
    noText: "कृपया पहले XML enter करें।",
    invalidXml: "Invalid XML. कृपया syntax check करें।",
  },
  hinglish: {
    seoTitle: "XML to JSON Converter Online Free",
    seoDesc: "XML data ko clean JSON format me free online convert karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "XML to JSON",
    subtitle: "XML data ko readable JSON me instantly convert karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye valid XML ko proper structure wale clean JSON format me convert karta hai.",
    input: "Input XML",
    output: "Generated JSON",
    placeholder: `<user><name>Ajay</name><skill>React</skill></user>`,
    outputPlaceholder: "JSON output yaha show hoga...",
    indent: "Indent Size",
    convert: "Convert to JSON",
    copy: "Copy JSON",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    nodes: "Nodes",
    lines: "Lines",
    copied: "JSON successfully copy ho gaya.",
    generated: "JSON successfully generate ho gaya.",
    noText: "Please pehle XML enter karo.",
    invalidXml: "Invalid XML. Syntax check karo.",
  },
};

const countLines = (text) => (text.trim() ? text.split(/\r\n|\r|\n/).length : 0);

const countNodes = (xmlText) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    if (xmlDoc.querySelector("parsererror")) return 0;
    return xmlDoc.getElementsByTagName("*").length;
  } catch {
    return 0;
  }
};

const xmlNodeToJson = (node) => {
  const obj = {};

  if (node.nodeType === Node.ELEMENT_NODE && node.attributes.length > 0) {
    obj["@attributes"] = {};
    Array.from(node.attributes).forEach((attr) => {
      obj["@attributes"][attr.name] = attr.value;
    });
  }

  const childElements = Array.from(node.childNodes).filter(
    (child) => child.nodeType === Node.ELEMENT_NODE
  );

  const textContent = Array.from(node.childNodes)
    .filter((child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.nodeValue.trim())
    .filter(Boolean)
    .join(" ");

  if (childElements.length === 0) {
    if (Object.keys(obj).length > 0) {
      obj["#text"] = textContent;
      return obj;
    }
    return textContent;
  }

  childElements.forEach((child) => {
    const childJson = xmlNodeToJson(child);
    const childName = child.nodeName;

    if (obj[childName]) {
      if (!Array.isArray(obj[childName])) {
        obj[childName] = [obj[childName]];
      }
      obj[childName].push(childJson);
    } else {
      obj[childName] = childJson;
    }
  });

  if (textContent) {
    obj["#text"] = textContent;
  }

  return obj;
};

const xmlToJson = (xmlText, indentSize) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  const parserError = xmlDoc.querySelector("parsererror");

  if (parserError) {
    throw new Error("Invalid XML");
  }

  const root = xmlDoc.documentElement;

  if (!root) {
    throw new Error("Invalid XML");
  }

  const result = {
    [root.nodeName]: xmlNodeToJson(root),
  };

  return JSON.stringify(result, null, Number(indentSize));
};

export default function XmlToJson() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      return xmlToJson(inputText, indentSize);
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

  const convertXml = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const json = xmlToJson(inputText, indentSize);
      setOutputText(json);
      showToast("success", t.generated);
    } catch {
      setOutputText("");
      showToast("error", t.invalidXml);
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
    link.download = "Convert Wala_xml_to_json.json";
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
    setIndentSize(2);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="xml to json, convert xml to json, xml json converter, online xml to json"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/xml-to-json" />
      </Helmet>

      <main className={`xmljson-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`xmljson-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="xmljson-hero">
          <div className="xmljson-badge">
            <FileJson />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="xmljson-info">
          <CodeXml />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="xmljson-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>
          <div>
            <span>{t.nodes}</span>
            <strong>{countNodes(inputText)}</strong>
          </div>
          <div>
            <span>{t.lines}</span>
            <strong>{countLines(inputText)}</strong>
          </div>
        </section>

        <section className="xmljson-options">
          <div className="xmljson-control">
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

        <section className="xmljson-shell">
          <div className="xmljson-card">
            <div className="xmljson-card-head">
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
              spellCheck="false"
            />

            <div className="xmljson-actions">
              <button onClick={convertXml}>
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

          <div className="xmljson-card">
            <div className="xmljson-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="xmljson-actions">
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