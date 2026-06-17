import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Map,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/SitemapChecker.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Sitemap Checker Online Free",
    seoDesc: "Check XML sitemap online. Validate sitemap URLs, count links and detect sitemap index files.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Sitemap Checker",
    subtitle: "Check sitemap XML and validate URLs instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool checks sitemap XML, counts URLs and detects sitemap index or normal sitemap files.",
    input: "Sitemap XML",
    output: "Checker Report",
    placeholder: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
  </url>
</urlset>`,
    outputPlaceholder: "Sitemap checker report will appear here...",
    check: "Check Sitemap",
    sample: "Sample",
    copy: "Copy Report",
    download: "Download Report",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    urls: "URLs",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    copied: "Report copied successfully.",
    checked: "Sitemap checked successfully.",
    sampleLoaded: "Sample loaded successfully.",
    noText: "Please enter sitemap XML first.",
    invalidXml: "Invalid sitemap XML.",
  },
};

const sampleSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.convertwala.com/</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.convertwala.com/tools</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const checkSitemap = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  const error = xmlDoc.querySelector("parsererror");

  if (error) throw new Error("Invalid XML");

  const urlNodes = Array.from(xmlDoc.querySelectorAll("url"));
  const sitemapNodes = Array.from(xmlDoc.querySelectorAll("sitemap"));

  const isSitemapIndex = sitemapNodes.length > 0;
  const locNodes = Array.from(xmlDoc.querySelectorAll("loc"));

  const urls = locNodes.map((node) => node.textContent.trim()).filter(Boolean);
  const validUrls = urls.filter(isValidUrl);
  const invalidUrls = urls.filter((url) => !isValidUrl(url));

  const report = `Sitemap Checker Report

Type: ${isSitemapIndex ? "Sitemap Index" : "URL Sitemap"}
Total <loc> URLs: ${urls.length}
Valid URLs: ${validUrls.length}
Invalid URLs: ${invalidUrls.length}
URL Entries: ${urlNodes.length}
Sitemap Entries: ${sitemapNodes.length}

Valid URLs:
${validUrls.length ? validUrls.join("\n") : "No valid URLs found."}

Invalid URLs:
${invalidUrls.length ? invalidUrls.join("\n") : "No invalid URLs found."}`;

  return {
    report,
    urlCount: urls.length,
    isValid: invalidUrls.length === 0 && urls.length > 0,
  };
};

export default function SitemapChecker() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [urlCount, setUrlCount] = useState(0);
  const [status, setStatus] = useState("empty");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!inputText.trim()) return "";
    try {
      return checkSitemap(inputText).report;
    } catch {
      return outputText;
    }
  }, [inputText, outputText]);

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

  const runCheck = () => {
    if (!inputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    try {
      const result = checkSitemap(inputText);
      setOutputText(result.report);
      setUrlCount(result.urlCount);
      setStatus(result.isValid ? "valid" : "invalid");
      showToast("success", t.checked);
    } catch {
      setOutputText("");
      setUrlCount(0);
      setStatus("invalid");
      showToast("error", t.invalidXml);
    }
  };

  const loadSample = () => {
    setInputText(sampleSitemap);
    setOutputText("");
    setUrlCount(0);
    setStatus("empty");
    showToast("success", t.sampleLoaded);
  };

  const copyReport = async () => {
    if (!currentOutput.trim()) return showToast("error", t.noText);
    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadReport = () => {
    if (!currentOutput.trim()) return showToast("error", t.noText);

    const blob = new Blob([currentOutput], {
      type: "text/plain;charset=utf-8",
    });

    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "Convert Wala_sitemap_checker_report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const clearTool = () => {
    setInputText("");
    setOutputText("");
    setUrlCount(0);
    setStatus("empty");
  };

  const resetTool = () => clearTool();

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="sitemap checker, xml sitemap checker, sitemap validator, seo sitemap tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/sitemap-checker" />
      </Helmet>

      <main className={`sitemap-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`sitemap-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="sitemap-hero">
          <div className="sitemap-badge">
            <Map />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="sitemap-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="sitemap-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{inputText.length}</strong>
          </div>
          <div>
            <span>{t.urls}</span>
            <strong>{urlCount}</strong>
          </div>
          <div>
            <span>{t.status}</span>
            <strong className={status === "valid" ? "sitemap-valid" : status === "invalid" ? "sitemap-invalid" : ""}>
              {status === "valid" ? t.valid : status === "invalid" ? t.invalid : "-"}
            </strong>
          </div>
        </section>

        <section className="sitemap-shell">
          <div className="sitemap-card">
            <div className="sitemap-card-head">
              <h3>{t.input}</h3>
              <span>{inputText.length} chars</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setOutputText("");
                setStatus("empty");
                setUrlCount(0);
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="sitemap-actions">
              <button onClick={runCheck}>
                <Wand2 />
                {t.check}
              </button>

              <button onClick={loadSample}>
                <FileText />
                {t.sample}
              </button>

              <button onClick={clearTool} disabled={!inputText && !outputText} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="sitemap-card">
            <div className="sitemap-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="sitemap-actions">
              <button onClick={copyReport} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadReport} disabled={!currentOutput.trim()}>
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