import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
  Unlock,
} from "lucide-react";
import "../styles/UrlEncoderDecoder.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "URL Encoder Decoder Online Free",
    seoDesc: "Encode and decode URLs online for free. Convert special characters into URL-safe format instantly.",
    eyebrow: "Convert Wala Developer Tool",
    title: "URL Encoder Decoder",
    subtitle: "Encode and decode URLs or text into URL-safe format instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool converts normal text into encoded URL format and decodes URL encoded text back to readable text.",
    input: "Input Text / URL",
    output: "Output",
    placeholder: "https://example.com/search?q=hello world&name=Ajay Kumar",
    outputPlaceholder: "Encoded or decoded output will appear here...",
    mode: "Mode",
    encode: "Encode URL",
    decode: "Decode URL",
    copy: "Copy Output",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "Output copied successfully.",
    encoded: "URL encoded successfully.",
    decoded: "URL decoded successfully.",
    noText: "Please enter text or URL first.",
    invalid: "Invalid encoded URL/text.",
  },
  hi: {
    seoTitle: "URL Encoder Decoder Online Free",
    seoDesc: "URLs को free online encode और decode करें। Special characters को URL-safe format में instantly convert करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "URL Encoder Decoder",
    subtitle: "URLs या text को URL-safe format में encode और decode करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह normal text को encoded URL format में convert करता है और encoded URL text को readable text में decode करता है।",
    input: "Input Text / URL",
    output: "Output",
    placeholder: "https://example.com/search?q=hello world&name=Ajay Kumar",
    outputPlaceholder: "Encoded या decoded output यहां दिखेगा...",
    mode: "Mode",
    encode: "URL Encode करें",
    decode: "URL Decode करें",
    copy: "Output Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "Output successfully copy हो गया।",
    encoded: "URL successfully encode हो गया।",
    decoded: "URL successfully decode हो गया।",
    noText: "कृपया पहले text या URL enter करें।",
    invalid: "Invalid encoded URL/text.",
  },
  hinglish: {
    seoTitle: "URL Encoder Decoder Online Free",
    seoDesc: "URLs ko free online encode aur decode karo. Special characters ko URL-safe format me instantly convert karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "URL Encoder Decoder",
    subtitle: "URLs ya text ko URL-safe format me encode aur decode karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye normal text ko encoded URL format me convert karta hai aur encoded URL text ko readable text me decode karta hai.",
    input: "Input Text / URL",
    output: "Output",
    placeholder: "https://example.com/search?q=hello world&name=Ajay Kumar",
    outputPlaceholder: "Encoded ya decoded output yaha show hoga...",
    mode: "Mode",
    encode: "Encode URL",
    decode: "Decode URL",
    copy: "Copy Output",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "Output successfully copy ho gaya.",
    encoded: "URL successfully encode ho gaya.",
    decoded: "URL successfully decode ho gaya.",
    noText: "Please pehle text ya URL enter karo.",
    invalid: "Invalid encoded URL/text.",
  },
};

const countWords = (text) =>
  text.trim() ? text.trim().match(/\S+/g)?.length || 0 : 0;

const countLines = (text) =>
  text.trim() ? text.split(/\r\n|\r|\n/).length : 0;

const processUrlText = (text, mode) => {
  if (mode === "encode") {
    return encodeURIComponent(text);
  }

  return decodeURIComponent(text.replace(/\+/g, " "));
};

export default function UrlEncoderDecoder() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("encode");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      return processUrlText(inputText, mode);
    } catch {
      return outputText;
    }
  }, [inputText, mode, outputText]);

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

  const encodeUrl = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = processUrlText(inputText, "encode");
      setMode("encode");
      setOutputText(result);
      showToast("success", t.encoded);
    } catch {
      showToast("error", t.invalid);
    }
  };

  const decodeUrl = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = processUrlText(inputText, "decode");
      setMode("decode");
      setOutputText(result);
      showToast("success", t.decoded);
    } catch {
      setOutputText("");
      showToast("error", t.invalid);
    }
  };

  const copyOutput = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_url_encoder_decoder.txt";
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
    setMode("encode");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="url encoder decoder, url encode, url decode, encode url online, decode url online"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/url-encoder-decoder" />
      </Helmet>

      <main className={`urltool-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`urltool-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="urltool-hero">
          <div className="urltool-badge">
            <Link />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="urltool-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="urltool-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>
          <div>
            <span>{t.words}</span>
            <strong>{countWords(inputText)}</strong>
          </div>
          <div>
            <span>{t.lines}</span>
            <strong>{countLines(inputText)}</strong>
          </div>
        </section>

        <section className="urltool-options">
          <div className="urltool-control">
            <label>{t.mode}</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setOutputText("");
              }}
            >
              <option value="encode">Encode</option>
              <option value="decode">Decode</option>
            </select>
          </div>
        </section>

        <section className="urltool-shell">
          <div className="urltool-card">
            <div className="urltool-card-head">
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

            <div className="urltool-actions">
              <button onClick={encodeUrl}>
                <Wand2 />
                {t.encode}
              </button>

              <button onClick={decodeUrl}>
                <Unlock />
                {t.decode}
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

          <div className="urltool-card">
            <div className="urltool-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="urltool-actions">
              <button onClick={copyOutput} disabled={!currentOutput.trim()}>
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