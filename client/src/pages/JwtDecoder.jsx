import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  KeyRound,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  Wand2,
  FileJson,
} from "lucide-react";
import "../styles/JwtDecoder.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "JWT Decoder Online Free",
    seoDesc: "Decode JWT tokens online for free. View JWT header, payload and expiry details instantly.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JWT Decoder",
    subtitle: "Decode JWT header and payload instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool decodes JWT tokens locally in your browser and shows readable header, payload and expiry details.",
    input: "Input JWT Token",
    output: "Decoded JWT",
    placeholder: "Paste your JWT token here...",
    outputPlaceholder: "Decoded JWT data will appear here...",
    decode: "Decode JWT",
    sample: "Sample JWT",
    copy: "Copy Result",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    parts: "Parts",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    expired: "Expired",
    active: "Active",
    copied: "Decoded result copied successfully.",
    decoded: "JWT decoded successfully.",
    sampleLoaded: "Sample JWT loaded successfully.",
    noText: "Please enter JWT token first.",
    invalidJwt: "Invalid JWT token.",
  },
  hi: {
    seoTitle: "JWT Decoder Online Free",
    seoDesc: "JWT tokens को free online decode करें। JWT header, payload और expiry details instantly देखें।",
    eyebrow: "Convert Wala Developer Tool",
    title: "JWT Decoder",
    subtitle: "JWT header और payload को instantly decode करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool JWT token को browser में locally decode करता है और readable header, payload व expiry details दिखाता है।",
    input: "Input JWT Token",
    output: "Decoded JWT",
    placeholder: "अपना JWT token यहां paste करें...",
    outputPlaceholder: "Decoded JWT data यहां दिखेगा...",
    decode: "JWT Decode करें",
    sample: "Sample JWT",
    copy: "Result Copy करें",
    download: "JSON Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    parts: "Parts",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    expired: "Expired",
    active: "Active",
    copied: "Decoded result successfully copy हो गया।",
    decoded: "JWT successfully decode हो गया।",
    sampleLoaded: "Sample JWT successfully load हो गया।",
    noText: "कृपया पहले JWT token enter करें।",
    invalidJwt: "Invalid JWT token.",
  },
  hinglish: {
    seoTitle: "JWT Decoder Online Free",
    seoDesc: "JWT tokens ko free online decode karo. JWT header, payload aur expiry details instantly dekho.",
    eyebrow: "Convert Wala Developer Tool",
    title: "JWT Decoder",
    subtitle: "JWT header aur payload ko instantly decode karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye JWT token ko browser me locally decode karta hai aur readable header, payload aur expiry details show karta hai.",
    input: "Input JWT Token",
    output: "Decoded JWT",
    placeholder: "Apna JWT token yaha paste karo...",
    outputPlaceholder: "Decoded JWT data yaha show hoga...",
    decode: "Decode JWT",
    sample: "Sample JWT",
    copy: "Copy Result",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    parts: "Parts",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    expired: "Expired",
    active: "Active",
    copied: "Decoded result successfully copy ho gaya.",
    decoded: "JWT successfully decode ho gaya.",
    sampleLoaded: "Sample JWT successfully load ho gaya.",
    noText: "Please pehle JWT token enter karo.",
    invalidJwt: "Invalid JWT token.",
  },
};

const sampleJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWpheSBLdW1hciIsInJvbGUiOiJSZWFjdCBEZXZlbG9wZXIiLCJleHAiOjk5OTk5OTk5OTl9.demo-signature";

const base64UrlDecode = (value) => {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");

  while (base64.length % 4) {
    base64 += "=";
  }

  const decoded = atob(base64);

  return decodeURIComponent(
    decoded
      .split("")
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
};

const decodeJwt = (token) => {
  const parts = token.trim().split(".");

  if (parts.length < 2) {
    throw new Error("Invalid JWT");
  }

  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  const signature = parts[2] || "";

  const expiryDate = payload.exp
    ? new Date(payload.exp * 1000).toLocaleString()
    : "Not available";

  const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;

  return {
    header,
    payload,
    signature,
    expiryDate,
    isExpired,
    parts: parts.length,
  };
};

export default function JwtDecoder() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [tokenStatus, setTokenStatus] = useState("empty");
  const [partCount, setPartCount] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";

    try {
      const decoded = decodeJwt(inputText);

      return JSON.stringify(
        {
          status: decoded.isExpired ? t.expired : t.active,
          expiryDate: decoded.expiryDate,
          header: decoded.header,
          payload: decoded.payload,
          signature: decoded.signature,
        },
        null,
        2
      );
    } catch {
      return outputText;
    }
  }, [inputText, outputText, t.active, t.expired]);

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

  const handleDecode = () => {
    if (!inputText.trim()) {
      setTokenStatus("empty");
      setPartCount(0);
      showToast("error", t.noText);
      return;
    }

    try {
      const decoded = decodeJwt(inputText);

      setOutputText(
        JSON.stringify(
          {
            status: decoded.isExpired ? t.expired : t.active,
            expiryDate: decoded.expiryDate,
            header: decoded.header,
            payload: decoded.payload,
            signature: decoded.signature,
          },
          null,
          2
        )
      );

      setPartCount(decoded.parts);
      setTokenStatus(decoded.isExpired ? "expired" : "valid");
      showToast("success", t.decoded);
    } catch {
      setOutputText("");
      setPartCount(0);
      setTokenStatus("invalid");
      showToast("error", t.invalidJwt);
    }
  };

  const copyResult = async () => {
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
    link.download = "Convert Wala_jwt_decoded.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputText(sampleJwt);
    setOutputText("");
    setTokenStatus("empty");
    setPartCount(0);
    showToast("success", t.sampleLoaded);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
    setTokenStatus("empty");
    setPartCount(0);
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
          content="jwt decoder, decode jwt, jwt token decoder, json web token decoder, jwt parser"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/jwt-decoder" />
      </Helmet>

      <main className={`jwt-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`jwt-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="jwt-hero">
          <div className="jwt-badge">
            <KeyRound />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="jwt-info">
          <ShieldCheck />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="jwt-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>

          <div>
            <span>{t.parts}</span>
            <strong>{partCount || inputText.split(".").filter(Boolean).length}</strong>
          </div>

          <div>
            <span>{t.status}</span>
            <strong
              className={
                tokenStatus === "valid"
                  ? "jwt-valid"
                  : tokenStatus === "invalid" || tokenStatus === "expired"
                  ? "jwt-invalid"
                  : ""
              }
            >
              {tokenStatus === "valid"
                ? t.active
                : tokenStatus === "expired"
                ? t.expired
                : tokenStatus === "invalid"
                ? t.invalid
                : "-"}
            </strong>
          </div>
        </section>

        <section className="jwt-shell">
          <div className="jwt-card">
            <div className="jwt-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
                setTokenStatus("empty");
                setPartCount(0);
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="jwt-actions">
              <button onClick={handleDecode}>
                <Wand2 />
                {t.decode}
              </button>

              <button onClick={loadSample}>
                <FileJson />
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

          <div className="jwt-card">
            <div className="jwt-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="jwt-actions">
              <button onClick={copyResult} disabled={!currentOutput.trim()}>
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