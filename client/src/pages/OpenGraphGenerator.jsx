import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Share2,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Image,
  RotateCcw,
  Wand2,
  Eye,
} from "lucide-react";
import "../styles/OpenGraphGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Open Graph Generator Online Free | OG Meta Tags",
    seoDesc: "Generate Open Graph meta tags for Facebook, LinkedIn, WhatsApp and social media sharing.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Open Graph Generator",
    subtitle: "Generate social sharing meta tags for better link previews.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool creates Open Graph and Twitter Card meta tags for websites, blogs and landing pages.",
    titleLabel: "OG Title",
    descLabel: "OG Description",
    urlLabel: "Page URL",
    imageLabel: "Image URL",
    siteLabel: "Site Name",
    typeLabel: "Content Type",
    twitterLabel: "Twitter Card",
    output: "Generated Meta Tags",
    preview: "Social Preview",
    generate: "Generate Tags",
    copy: "Copy Tags",
    download: "Download HTML",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    fields: "Fields",
    tags: "Tags",
    copied: "Meta tags copied successfully.",
    generated: "Open Graph tags generated successfully.",
    noTitle: "Please enter title first.",
  },
  hi: {
    seoTitle: "Open Graph Generator Online Free | OG Meta Tags",
    seoDesc: "Facebook, LinkedIn, WhatsApp और social media sharing के लिए Open Graph meta tags generate करें।",
    eyebrow: "Convert Wala SEO Tool",
    title: "Open Graph Generator",
    subtitle: "Better link previews के लिए social sharing meta tags generate करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool websites, blogs और landing pages के लिए Open Graph और Twitter Card meta tags बनाता है।",
    titleLabel: "OG Title",
    descLabel: "OG Description",
    urlLabel: "Page URL",
    imageLabel: "Image URL",
    siteLabel: "Site Name",
    typeLabel: "Content Type",
    twitterLabel: "Twitter Card",
    output: "Generated Meta Tags",
    preview: "Social Preview",
    generate: "Tags Generate करें",
    copy: "Tags Copy करें",
    download: "HTML Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    fields: "Fields",
    tags: "Tags",
    copied: "Meta tags successfully copy हो गए।",
    generated: "Open Graph tags successfully generate हो गए।",
    noTitle: "कृपया पहले title enter करें।",
  },
  hinglish: {
    seoTitle: "Open Graph Generator Online Free | OG Meta Tags",
    seoDesc: "Facebook, LinkedIn, WhatsApp aur social media sharing ke liye Open Graph meta tags generate karo.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Open Graph Generator",
    subtitle: "Better link previews ke liye social sharing meta tags generate karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye websites, blogs aur landing pages ke liye Open Graph aur Twitter Card meta tags banata hai.",
    titleLabel: "OG Title",
    descLabel: "OG Description",
    urlLabel: "Page URL",
    imageLabel: "Image URL",
    siteLabel: "Site Name",
    typeLabel: "Content Type",
    twitterLabel: "Twitter Card",
    output: "Generated Meta Tags",
    preview: "Social Preview",
    generate: "Generate Tags",
    copy: "Copy Tags",
    download: "Download HTML",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    fields: "Fields",
    tags: "Tags",
    copied: "Meta tags successfully copy ho gaye.",
    generated: "Open Graph tags successfully generate ho gaye.",
    noTitle: "Please pehle title enter karo.",
  },
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildOpenGraphTags = ({
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  siteName,
  ogType,
  twitterCard,
}) => {
  const tags = [];

  if (ogTitle) {
    tags.push(`<meta property="og:title" content="${escapeHtml(ogTitle)}" />`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`);
  }

  if (ogDescription) {
    tags.push(
      `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`
    );
    tags.push(
      `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`
    );
  }

  if (ogUrl) {
    tags.push(`<meta property="og:url" content="${escapeHtml(ogUrl)}" />`);
  }

  if (ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);
  }

  if (siteName) {
    tags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`);
  }

  tags.push(`<meta property="og:type" content="${escapeHtml(ogType)}" />`);
  tags.push(`<meta name="twitter:card" content="${escapeHtml(twitterCard)}" />`);

  return tags.join("\n");
};

export default function OpenGraphGenerator() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogUrl, setOgUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [ogType, setOgType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [outputText, setOutputText] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const formData = {
    ogTitle,
    ogDescription,
    ogUrl,
    ogImage,
    siteName,
    ogType,
    twitterCard,
  };

  const livePreview = useMemo(() => {
    if (!ogTitle.trim()) return "";
    return buildOpenGraphTags(formData);
  }, [ogTitle, ogDescription, ogUrl, ogImage, siteName, ogType, twitterCard]);

  const currentOutput = outputText || livePreview;

  const filledFields = [
    ogTitle,
    ogDescription,
    ogUrl,
    ogImage,
    siteName,
    ogType,
    twitterCard,
  ].filter(Boolean).length;

  const tagCount = currentOutput.trim()
    ? currentOutput.split(/\r\n|\r|\n/).filter(Boolean).length
    : 0;

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

  const generateTags = () => {
    if (!ogTitle.trim()) {
      showToast("error", t.noTitle);
      return;
    }

    setOutputText(buildOpenGraphTags(formData));
    showToast("success", t.generated);
  };

  const copyTags = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noTitle);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadHtml = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noTitle);
      return;
    }

    const htmlContent = `<!-- Open Graph Meta Tags Generated by Convert Wala -->
${currentOutput}`;

    const blob = new Blob([htmlContent], {
      type: "text/html;charset=utf-8",
    });

    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "Convert Wala_open_graph_tags.html";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const clearTool = () => {
    setOgTitle("");
    setOgDescription("");
    setOgUrl("");
    setOgImage("");
    setSiteName("");
    setOutputText("");
  };

  const resetTool = () => {
    clearTool();
    setOgType("website");
    setTwitterCard("summary_large_image");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="open graph generator, og meta tags, twitter card generator, social media meta tags"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/open-graph-generator" />
      </Helmet>

      <main className={`og-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`og-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="og-hero">
          <div className="og-badge">
            <Share2 />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="og-info">
          <Image />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="og-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{currentOutput.length}</strong>
          </div>
          <div>
            <span>{t.fields}</span>
            <strong>{filledFields}</strong>
          </div>
          <div>
            <span>{t.tags}</span>
            <strong>{tagCount}</strong>
          </div>
        </section>

        <section className="og-shell">
          <div className="og-card">
            <div className="og-card-head">
              <h3>Open Graph Details</h3>
              <span>OG + Twitter</span>
            </div>

            <div className="og-form">
              <label>
                {t.titleLabel}
                <input
                  value={ogTitle}
                  onChange={(e) => {
                    setOgTitle(e.target.value);
                    setOutputText("");
                  }}
                  placeholder="Best Free SEO Tools"
                />
              </label>

              <label>
                {t.descLabel}
                <textarea
                  value={ogDescription}
                  onChange={(e) => {
                    setOgDescription(e.target.value);
                    setOutputText("");
                  }}
                  placeholder="Generate free SEO and developer tools online."
                />
              </label>

              <label>
                {t.urlLabel}
                <input
                  value={ogUrl}
                  onChange={(e) => {
                    setOgUrl(e.target.value);
                    setOutputText("");
                  }}
                  placeholder="https://www.convertwala.com"
                />
              </label>

              <label>
                {t.imageLabel}
                <input
                  value={ogImage}
                  onChange={(e) => {
                    setOgImage(e.target.value);
                    setOutputText("");
                  }}
                  placeholder="https://www.convertwala.com/og-image.jpg"
                />
              </label>

              <label>
                {t.siteLabel}
                <input
                  value={siteName}
                  onChange={(e) => {
                    setSiteName(e.target.value);
                    setOutputText("");
                  }}
                  placeholder="Convert Wala"
                />
              </label>

              <div className="og-form-grid">
                <label>
                  {t.typeLabel}
                  <select
                    value={ogType}
                    onChange={(e) => {
                      setOgType(e.target.value);
                      setOutputText("");
                    }}
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                    <option value="profile">Profile</option>
                    <option value="video.movie">Video</option>
                  </select>
                </label>

                <label>
                  {t.twitterLabel}
                  <select
                    value={twitterCard}
                    onChange={(e) => {
                      setTwitterCard(e.target.value);
                      setOutputText("");
                    }}
                  >
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="summary">Summary</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="og-actions">
              <button onClick={generateTags}>
                <Wand2 />
                {t.generate}
              </button>

              <button onClick={clearTool} disabled={!ogTitle && !outputText} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="og-card">
            <div className="og-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              className="og-output"
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Generated Open Graph meta tags will appear here..."
              spellCheck="false"
            />

            <div className="og-actions">
              <button onClick={copyTags} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadHtml} disabled={!currentOutput.trim()}>
                <Download />
                {t.download}
              </button>
            </div>
          </div>
        </section>

        <section className="og-preview-wrap">
          <div className="og-preview-head">
            <Eye />
            <h3>{t.preview}</h3>
          </div>

          <div className="og-preview-card">
            <div className="og-preview-image">
              {ogImage ? <img src={ogImage} alt={ogTitle || "Open Graph Preview"} /> : <Image />}
            </div>

            <div className="og-preview-content">
              <span>{siteName || "Convert Wala"}</span>
              <h4>{ogTitle || "Your Open Graph Title"}</h4>
              <p>{ogDescription || "Your Open Graph description will appear here for social media preview."}</p>
              <small>{ogUrl || "https://www.convertwala.com"}</small>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}