import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Fingerprint,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  FileText,
} from "lucide-react";
import "../styles/UUIDGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "UUID Generator Online Free | Random UUID v4 Generator",
    seoDesc:
      "Generate random UUID v4 values online for free. Create bulk UUIDs for apps, databases, testing and development.",
    eyebrow: "Convert Wala Security Tool",
    title: "UUID Generator",
    subtitle:
      "Generate secure random UUID v4 values for apps, databases, APIs and testing.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool generates UUID v4 identifiers in your browser. You can create single or bulk UUIDs and copy or download them instantly.",
    count: "UUID Count",
    uppercase: "Uppercase",
    removeHyphens: "Remove Hyphens",
    generate: "Generate UUIDs",
    copyAll: "Copy All",
    download: "Download TXT",
    clear: "Clear",
    generated: "Generated UUIDs",
    copied: "Copied successfully.",
    generatedSuccess: "UUIDs generated successfully.",
    noUuid: "Please generate UUID first.",
  },
  hi: {
    seoTitle: "UUID Generator Online Free | Random UUID v4 Generator",
    seoDesc:
      "Random UUID v4 values free online generate करें। Apps, databases, testing और development के लिए bulk UUIDs बनाएं।",
    eyebrow: "Convert Wala Security Tool",
    title: "UUID Generator",
    subtitle:
      "Apps, databases, APIs और testing के लिए secure random UUID v4 values generate करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool browser में UUID v4 identifiers generate करता है। Single या bulk UUIDs create करके instantly copy/download कर सकते हैं।",
    count: "UUID Count",
    uppercase: "Uppercase",
    removeHyphens: "Hyphens Remove करें",
    generate: "UUIDs Generate करें",
    copyAll: "Copy All",
    download: "TXT Download करें",
    clear: "Clear",
    generated: "Generated UUIDs",
    copied: "Successfully copy हो गया।",
    generatedSuccess: "UUIDs successfully generate हो गए।",
    noUuid: "कृपया पहले UUID generate करें।",
  },
  hinglish: {
    seoTitle: "UUID Generator Online Free | Random UUID v4 Generator",
    seoDesc:
      "Random UUID v4 values free online generate karo. Apps, databases, testing aur development ke liye bulk UUIDs banao.",
    eyebrow: "Convert Wala Security Tool",
    title: "UUID Generator",
    subtitle:
      "Apps, databases, APIs aur testing ke liye secure random UUID v4 values generate karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye browser me UUID v4 identifiers generate karta hai. Single ya bulk UUIDs create karke instantly copy/download kar sakte ho.",
    count: "UUID Count",
    uppercase: "Uppercase",
    removeHyphens: "Remove Hyphens",
    generate: "Generate UUIDs",
    copyAll: "Copy All",
    download: "Download TXT",
    clear: "Clear",
    generated: "Generated UUIDs",
    copied: "Successfully copy ho gaya.",
    generatedSuccess: "UUIDs successfully generate ho gaye.",
    noUuid: "Please pehle UUID generate karo.",
  },
};

const createUUID = () => {
  if (crypto.randomUUID) return crypto.randomUUID();

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      Number(c) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
    ).toString(16)
  );
};

const formatUUID = (uuid, uppercase, removeHyphens) => {
  let value = removeHyphens ? uuid.replace(/-/g, "") : uuid;
  return uppercase ? value.toUpperCase() : value;
};

export default function UUIDGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [uuids, setUuids] = useState([]);
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

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const generateUUIDs = () => {
    const generated = Array.from({ length: count }, () =>
      formatUUID(createUUID(), uppercase, removeHyphens)
    );

    setUuids(generated);
    showToast("success", t.generatedSuccess);
  };

  const copyText = async (text) => {
    if (!text) {
      showToast("error", t.noUuid);
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast("success", t.copied);
  };

  const copyAll = async () => {
    if (!uuids.length) {
      showToast("error", t.noUuid);
      return;
    }

    await navigator.clipboard.writeText(uuids.join("\n"));
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!uuids.length) {
      showToast("error", t.noUuid);
      return;
    }

    const blob = new Blob([uuids.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_UUIDs.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setUuids([]);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="uuid generator, uuid v4 generator, guid generator, random uuid, bulk uuid generator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/uuid-generator" />
      </Helmet>

      <main className={`uuid-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`uuid-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="uuid-hero">
          <div className="uuid-badge">
            <Fingerprint />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="uuid-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="uuid-shell">
          <aside className="uuid-control-card">
            <div className="uuid-card-head">
              <h3>Generator Settings</h3>
              <span>UUID v4</span>
            </div>

            <div className="uuid-control">
              <label>
                {t.count}: {count}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>

            <div className="uuid-options">
              <label>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                />
                <span>{t.uppercase}</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={removeHyphens}
                  onChange={(e) => setRemoveHyphens(e.target.checked)}
                />
                <span>{t.removeHyphens}</span>
              </label>
            </div>

            <div className="uuid-actions">
              <button onClick={generateUUIDs}>
                <RefreshCcw />
                {t.generate}
              </button>

              <button onClick={copyAll} disabled={!uuids.length}>
                <Copy />
                {t.copyAll}
              </button>

              <button onClick={downloadTxt} disabled={!uuids.length}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!uuids.length} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </aside>

          <section className="uuid-output-card">
            <div className="uuid-card-head">
              <h3>{t.generated}</h3>
              <span>{uuids.length} items</span>
            </div>

            {uuids.length ? (
              <div className="uuid-list">
                {uuids.map((uuid, index) => (
                  <div className="uuid-item" key={`${uuid}-${index}`}>
                    <span>{index + 1}</span>
                    <code>{uuid}</code>
                    <button onClick={() => copyText(uuid)}>
                      <Copy />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="uuid-empty">
                <Fingerprint />
                <p>Generate UUIDs to show them here.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}