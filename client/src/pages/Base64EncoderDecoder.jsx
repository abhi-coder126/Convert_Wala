import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Binary,
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
import "../styles/Base64EncoderDecoder.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Base64 Encoder Decoder Online Free",
    seoDesc: "Encode and decode Base64 text online for free with Unicode support.",
    eyebrow: "Convert Wala Developer Tool",
    title: "Base64 Encoder Decoder",
    subtitle: "Encode and decode Base64 text instantly.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool converts normal text into Base64 and decodes Base64 back to readable text.",
    input: "Input Text",
    output: "Output",
    placeholder: "Enter text or Base64 here...",
    outputPlaceholder: "Encoded or decoded output will appear here...",
    mode: "Mode",
    encode: "Encode Base64",
    decode: "Decode Base64",
    sample: "Sample Text",
    copy: "Copy Output",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "Output copied successfully.",
    encoded: "Text encoded successfully.",
    decoded: "Base64 decoded successfully.",
    sampleLoaded: "Sample text loaded successfully.",
    noText: "Please enter text first.",
    invalid: "Invalid Base64 text.",
  },
  hi: {
    seoTitle: "Base64 Encoder Decoder Online Free",
    seoDesc: "Base64 text को Unicode support के साथ free online encode और decode करें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "Base64 Encoder Decoder",
    subtitle: "Base64 text को instantly encode और decode करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह normal text को Base64 में convert करता है और Base64 को readable text में decode करता है।",
    input: "Input Text",
    output: "Output",
    placeholder: "Text या Base64 यहां enter करें...",
    outputPlaceholder: "Encoded या decoded output यहां दिखेगा...",
    mode: "Mode",
    encode: "Base64 Encode करें",
    decode: "Base64 Decode करें",
    sample: "Sample Text",
    copy: "Output Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "Output successfully copy हो गया।",
    encoded: "Text successfully encode हो गया।",
    decoded: "Base64 successfully decode हो गया।",
    sampleLoaded: "Sample text successfully load हो गया।",
    noText: "कृपया पहले text enter करें।",
    invalid: "Invalid Base64 text.",
  },
  hinglish: {
    seoTitle: "Base64 Encoder Decoder Online Free",
    seoDesc: "Base64 text ko Unicode support ke saath free online encode aur decode karo.",
    eyebrow: "Convert Wala Developer Tool",
    title: "Base64 Encoder Decoder",
    subtitle: "Base64 text ko instantly encode aur decode karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye normal text ko Base64 me convert karta hai aur Base64 ko readable text me decode karta hai.",
    input: "Input Text",
    output: "Output",
    placeholder: "Text ya Base64 yaha enter karo...",
    outputPlaceholder: "Encoded ya decoded output yaha show hoga...",
    mode: "Mode",
    encode: "Encode Base64",
    decode: "Decode Base64",
    sample: "Sample Text",
    copy: "Copy Output",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    words: "Words",
    lines: "Lines",
    copied: "Output successfully copy ho gaya.",
    encoded: "Text successfully encode ho gaya.",
    decoded: "Base64 successfully decode ho gaya.",
    sampleLoaded: "Sample text successfully load ho gaya.",
    noText: "Please pehle text enter karo.",
    invalid: "Invalid Base64 text.",
  },
};

const sampleText = "Hello Ajay! Welcome to Convert Wala.";

const countWords = (text) =>
  text.trim() ? text.trim().match(/\S+/g)?.length || 0 : 0;

const countLines = (text) =>
  text.trim() ? text.split(/\r\n|\r|\n/).length : 0;

const encodeBase64 = (text) =>
  btoa(unescape(encodeURIComponent(text)));

const decodeBase64 = (text) =>
  decodeURIComponent(escape(atob(text.trim())));

const processBase64 = (text, mode) => {
  if (mode === "encode") return encodeBase64(text);
  return decodeBase64(text);
};

export default function Base64EncoderDecoder() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("encode");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      return processBase64(inputText, mode);
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

  const handleEncode = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = processBase64(inputText, "encode");
      setMode("encode");
      setOutputText(result);
      showToast("success", t.encoded);
    } catch {
      showToast("error", t.invalid);
    }
  };

  const handleDecode = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = processBase64(inputText, "decode");
      setMode("decode");
      setOutputText(result);
      showToast("success", t.decoded);
    } catch {
      setOutputText("");
      showToast("error", t.invalid);
    }
  };

  const loadSample = () => {
    setInputText(sampleText);
    setOutputText("");
    setMode("encode");
    showToast("success", t.sampleLoaded);
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
    link.download = "Convert Wala_base64_encoder_decoder.txt";
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
          content="base64 encoder decoder, base64 encode, base64 decode, encode base64 online, decode base64 online"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/base64-encoder-decoder"
        />
      </Helmet>

      <main className={`base64-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`base64-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="base64-hero">
          <div className="base64-badge">
            <Binary />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="base64-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="base64-stats">
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

        <section className="base64-options">
          <div className="base64-control">
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

        <section className="base64-shell">
          <div className="base64-card">
            <div className="base64-card-head">
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

            <div className="base64-actions">
              <button onClick={handleEncode}>
                <Wand2 />
                {t.encode}
              </button>

              <button onClick={handleDecode}>
                <Unlock />
                {t.decode}
              </button>

              <button onClick={loadSample}>
                <FileText />
                {t.sample}
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

          <div className="base64-card">
            <div className="base64-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="base64-actions">
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