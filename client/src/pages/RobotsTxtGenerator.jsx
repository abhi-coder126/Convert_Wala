import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Copy,
  Download,
  RefreshCcw,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const pageText = {
  en: {
    seoTitle:
      "Free Robots.txt Generator Online - SEO Robots File Maker | Convert Wala",
    seoDescription:
      "Create SEO-friendly robots.txt files online for free with Convert Wala Robots.txt Generator. Add sitemap, allow/disallow rules, crawl delay and presets for React, WordPress and ecommerce websites.",
    seoKeywords:
      "robots.txt generator, free robots.txt generator, SEO robots file, robots txt maker, sitemap robots txt, crawl delay, allow disallow robots, Convert Wala SEO tools",

    eyebrow: "Convert Wala SEO Tool",
    heading: "Robots.txt Generator",
    subtitle:
      "Create SEO-friendly robots.txt file with sitemap, allow/disallow rules, crawl delay and presets for React, WordPress and ecommerce websites.",

    websiteSettings: "Website Settings",
    websiteUrl: "Website URL",
    sitemapUrl: "Sitemap URL",
    userAgent: "User-agent",
    crawlDelay: "Crawl-delay",
    optional: "Optional",
    autoSitemap: "Auto Sitemap",

    robotsMode: "Robots Mode",
    allowAll: "Allow All",
    blockAll: "Block All",
    custom: "Custom",

    quickPresets: "Quick Presets",
    reactVite: "React / Vite",
    wordpress: "WordPress",
    ecommerce: "Ecommerce",
    privateSite: "Private Site",

    rulesTitle: "Allow / Disallow Rules",
    customModeNote: "To edit rules, select Custom mode.",
    ruleType: "Rule Type",
    path: "Path",
    addRule: "Add Rule",

    extraOptions: "Extra Options",
    includeSitemap: "Include Sitemap URL",
    includeHost: "Include Host line",
    customLines: "Custom Lines",
    customLinesPlaceholder: "Example:\nDisallow: /*?sort=\nDisallow: /thank-you/",

    generatedRobots: "Generated robots.txt",
    copy: "Copy",
    download: "Download robots.txt",
    reset: "Reset",

    seoInfo: "SEO Info",
    domain: "Domain",
    robotsPath: "Robots Path",
    sitemap: "Sitemap",
    mode: "Mode",
    included: "Included",
    notIncluded: "Not Included",
    invalidUrl: "Invalid URL",
    uploadNote: "After upload, place this file inside your website public/root folder:",
    viteNote: "In Vite/React site, after build it will open from root.",

    minRule: "Minimum 1 rule required.",
    presetApplied: "Preset applied.",
    validUrl: "Enter a valid website URL.",
    sitemapGenerated: "Sitemap URL generated.",
    copied: "robots.txt copied.",
    copyFailed: "Copy failed.",
    downloaded: "robots.txt downloaded.",
    resetDone: "Reset done.",
  },

  hi: {
    seoTitle:
      "Free Robots.txt Generator Online - SEO Robots File बनाएं | Convert Wala",
    seoDescription:
      "Convert Wala Robots.txt Generator से SEO-friendly robots.txt file online free में बनाएं। Sitemap, allow/disallow rules, crawl delay और React, WordPress, ecommerce presets add करें।",
    seoKeywords:
      "robots.txt generator, SEO robots file, robots txt maker, sitemap robots txt, crawl delay, allow disallow, Convert Wala SEO tools",

    eyebrow: "Convert Wala SEO टूल",
    heading: "Robots.txt Generator",
    subtitle:
      "Sitemap, allow/disallow rules, crawl delay और React, WordPress, ecommerce presets के साथ SEO-friendly robots.txt file बनाएं।",

    websiteSettings: "Website Settings",
    websiteUrl: "Website URL",
    sitemapUrl: "Sitemap URL",
    userAgent: "User-agent",
    crawlDelay: "Crawl-delay",
    optional: "Optional",
    autoSitemap: "Auto Sitemap बनाएं",

    robotsMode: "Robots Mode",
    allowAll: "सब Allow करें",
    blockAll: "सब Block करें",
    custom: "Custom",

    quickPresets: "Quick Presets",
    reactVite: "React / Vite",
    wordpress: "WordPress",
    ecommerce: "Ecommerce",
    privateSite: "Private Site",

    rulesTitle: "Allow / Disallow Rules",
    customModeNote: "Rules edit करने के लिए Custom mode select करें।",
    ruleType: "Rule Type",
    path: "Path",
    addRule: "Rule Add करें",

    extraOptions: "Extra Options",
    includeSitemap: "Sitemap URL Include करें",
    includeHost: "Host line Include करें",
    customLines: "Custom Lines",
    customLinesPlaceholder:
      "Example:\nDisallow: /*?sort=\nDisallow: /thank-you/",

    generatedRobots: "Generated robots.txt",
    copy: "Copy करें",
    download: "robots.txt Download करें",
    reset: "Reset करें",

    seoInfo: "SEO Info",
    domain: "Domain",
    robotsPath: "Robots Path",
    sitemap: "Sitemap",
    mode: "Mode",
    included: "Included",
    notIncluded: "Not Included",
    invalidUrl: "Invalid URL",
    uploadNote: "Upload के बाद इस file को website के public/root folder में रखें:",
    viteNote: "Vite/React site में build के बाद यह root पर open होगा।",

    minRule: "Minimum 1 rule required है।",
    presetApplied: "Preset apply हो गया।",
    validUrl: "Valid website URL enter करें।",
    sitemapGenerated: "Sitemap URL generate हो गया।",
    copied: "robots.txt copy हो गया।",
    copyFailed: "Copy failed.",
    downloaded: "robots.txt download हो गया।",
    resetDone: "Reset हो गया।",
  },

  hinglish: {
    seoTitle:
      "Free Robots.txt Generator Online - SEO Robots File Maker | Convert Wala",
    seoDescription:
      "Convert Wala Robots.txt Generator se SEO-friendly robots.txt file online free me banao. Sitemap, allow/disallow rules, crawl delay aur website presets add karo.",
    seoKeywords:
      "robots.txt generator, free robots.txt generator, SEO robots file, robots txt maker, sitemap robots txt, crawl delay, Convert Wala SEO tools",

    eyebrow: "Convert Wala SEO Tool",
    heading: "Robots.txt Generator",
    subtitle:
      "Sitemap, allow/disallow rules, crawl delay aur React, WordPress, ecommerce presets ke saath SEO-friendly robots.txt file banao.",

    websiteSettings: "Website Settings",
    websiteUrl: "Website URL",
    sitemapUrl: "Sitemap URL",
    userAgent: "User-agent",
    crawlDelay: "Crawl-delay",
    optional: "Optional",
    autoSitemap: "Auto Sitemap",

    robotsMode: "Robots Mode",
    allowAll: "Allow All",
    blockAll: "Block All",
    custom: "Custom",

    quickPresets: "Quick Presets",
    reactVite: "React / Vite",
    wordpress: "WordPress",
    ecommerce: "Ecommerce",
    privateSite: "Private Site",

    rulesTitle: "Allow / Disallow Rules",
    customModeNote: "Rules edit karne ke liye Custom mode select karo.",
    ruleType: "Rule Type",
    path: "Path",
    addRule: "Add Rule",

    extraOptions: "Extra Options",
    includeSitemap: "Include Sitemap URL",
    includeHost: "Include Host line",
    customLines: "Custom Lines",
    customLinesPlaceholder:
      "Example:\nDisallow: /*?sort=\nDisallow: /thank-you/",

    generatedRobots: "Generated robots.txt",
    copy: "Copy",
    download: "Download robots.txt",
    reset: "Reset",

    seoInfo: "SEO Info",
    domain: "Domain",
    robotsPath: "Robots Path",
    sitemap: "Sitemap",
    mode: "Mode",
    included: "Included",
    notIncluded: "Not Included",
    invalidUrl: "Invalid URL",
    uploadNote: "Upload ke baad file ko website ke public/root folder me rakho:",
    viteNote: "Vite/React site me build ke baad ye root par open hoga.",

    minRule: "Minimum 1 rule required hai.",
    presetApplied: "Preset applied.",
    validUrl: "Valid website URL enter karo.",
    sitemapGenerated: "Sitemap URL generated.",
    copied: "robots.txt copied.",
    copyFailed: "Copy failed.",
    downloaded: "robots.txt downloaded.",
    resetDone: "Reset done.",
  },
};

const cleanDomain = (value = "") => {
  const input = value.trim();

  if (!input) return "";

  try {
    const withProtocol =
      input.startsWith("http://") || input.startsWith("https://")
        ? input
        : `https://${input}`;

    const url = new URL(withProtocol);
    return `${url.protocol}//${url.hostname}`;
  } catch {
    return "";
  }
};

export default function RobotsTxtGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [toast, setToast] = useState(null);

  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [userAgent, setUserAgent] = useState("*");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [includeSitemap, setIncludeSitemap] = useState(true);
  const [includeHost, setIncludeHost] = useState(false);
  const [mode, setMode] = useState("custom");
  const [customLines, setCustomLines] = useState("");

  const [rules, setRules] = useState([
    { id: makeId(), type: "Allow", path: "/" },
    { id: makeId(), type: "Disallow", path: "/admin/" },
    { id: makeId(), type: "Disallow", path: "/private/" },
  ]);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/robots-txt-generator";

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

  const normalizedSite = useMemo(() => cleanDomain(siteUrl), [siteUrl]);

  const robotsText = useMemo(() => {
    const lines = [];

    lines.push(`User-agent: ${userAgent.trim() || "*"}`);

    if (mode === "allow-all") {
      lines.push("Allow: /");
    }

    if (mode === "block-all") {
      lines.push("Disallow: /");
    }

    if (mode === "custom") {
      rules.forEach((rule) => {
        const path = rule.path.trim();
        if (!path) return;
        lines.push(`${rule.type}: ${path.startsWith("/") ? path : `/${path}`}`);
      });
    }

    if (crawlDelay.toString().trim()) {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }

    if (customLines.trim()) {
      lines.push("");
      lines.push("# Custom Rules");
      customLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => lines.push(line));
    }

    if (includeSitemap && sitemapUrl.trim()) {
      lines.push("");
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    if (includeHost && normalizedSite) {
      lines.push(`Host: ${normalizedSite.replace(/^https?:\/\//, "")}`);
    }

    return lines.join("\n");
  }, [
    userAgent,
    mode,
    rules,
    crawlDelay,
    customLines,
    includeSitemap,
    sitemapUrl,
    includeHost,
    normalizedSite,
  ]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const updateRule = (id, key, value) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule))
    );
  };

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: makeId(),
        type: "Disallow",
        path: "/new-path/",
      },
    ]);
  };

  const removeRule = (id) => {
    if (rules.length === 1) {
      showToast("error", t.minRule);
      return;
    }

    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const applyPreset = (preset) => {
    setMode("custom");

    if (preset === "react") {
      setRules([
        { id: makeId(), type: "Allow", path: "/" },
        { id: makeId(), type: "Disallow", path: "/admin/" },
        { id: makeId(), type: "Disallow", path: "/dashboard/" },
        { id: makeId(), type: "Disallow", path: "/login/" },
        { id: makeId(), type: "Disallow", path: "/register/" },
      ]);
    }

    if (preset === "wordpress") {
      setRules([
        { id: makeId(), type: "Allow", path: "/" },
        { id: makeId(), type: "Disallow", path: "/wp-admin/" },
        { id: makeId(), type: "Allow", path: "/wp-admin/admin-ajax.php" },
        { id: makeId(), type: "Disallow", path: "/wp-login.php" },
        { id: makeId(), type: "Disallow", path: "/?s=" },
      ]);
    }

    if (preset === "ecommerce") {
      setRules([
        { id: makeId(), type: "Allow", path: "/" },
        { id: makeId(), type: "Disallow", path: "/cart/" },
        { id: makeId(), type: "Disallow", path: "/checkout/" },
        { id: makeId(), type: "Disallow", path: "/my-account/" },
        { id: makeId(), type: "Disallow", path: "/search/" },
      ]);
    }

    if (preset === "private") {
      setMode("block-all");
      setRules([{ id: makeId(), type: "Disallow", path: "/" }]);
    }

    showToast("success", t.presetApplied);
  };

  const autoFillSitemap = () => {
    const domain = cleanDomain(siteUrl);

    if (!domain) {
      showToast("error", t.validUrl);
      return;
    }

    setSitemapUrl(`${domain}/sitemap.xml`);
    showToast("success", t.sitemapGenerated);
  };

  const copyRobots = async () => {
    try {
      await navigator.clipboard.writeText(robotsText);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadRobots = () => {
    const blob = new Blob([robotsText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "robots.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    showToast("success", t.downloaded);
  };

  const resetAll = () => {
    setSiteUrl("https://example.com");
    setSitemapUrl("https://example.com/sitemap.xml");
    setUserAgent("*");
    setCrawlDelay("");
    setIncludeSitemap(true);
    setIncludeHost(false);
    setMode("custom");
    setCustomLines("");
    setRules([
      { id: makeId(), type: "Allow", path: "/" },
      { id: makeId(), type: "Disallow", path: "/admin/" },
      { id: makeId(), type: "Disallow", path: "/private/" },
    ]);
    showToast("success", t.resetDone);
  };

  return (
    <main className={`rtg-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        <meta name="keywords" content={t.seoKeywords} />

        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <meta name="application-name" content="Convert Wala" />
        <meta
          name="theme-color"
          content={theme === "dark" ? "#020617" : "#2563eb"}
        />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Convert Wala" />
        <meta
          property="og:locale"
          content={language === "hi" ? "hi_IN" : "en_US"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Robots.txt Generator",
            url: canonicalUrl,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description: t.seoDescription,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            publisher: {
              "@type": "Organization",
              name: "Convert Wala",
              url: "https://www.convertwala.com/",
            },
            featureList: [
              "Generate robots.txt file",
              "Add sitemap URL",
              "Create allow and disallow rules",
              "Add crawl delay",
              "React WordPress ecommerce presets",
              "Download robots.txt",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .rtg-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .rtg-page * {
          box-sizing: border-box;
        }

        .rtg-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .rtg-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .rtg-page.dark .rtg-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .rtg-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .rtg-page.dark .rtg-eyebrow {
          color: #93c5fd;
        }

        .rtg-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .rtg-page.dark .rtg-hero h1 {
          color: #f8fafc;
        }

        .rtg-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .rtg-page.dark .rtg-hero p,
        .rtg-page.dark .rtg-info span {
          color: #cbd5e1;
        }

        .rtg-shell {
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(330px, 0.95fr) minmax(420px, 1.05fr);
          gap: 28px;
          align-items: start;
        }

        .rtg-left,
        .rtg-right {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1101px) {
          .rtg-right {
            position: sticky;
            top: 18px;
          }
        }

        .rtg-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 22px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .rtg-page.dark .rtg-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .rtg-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.08rem;
        }

        .rtg-page.dark .rtg-card h3,
        .rtg-page.dark .rtg-field,
        .rtg-page.dark .rtg-check,
        .rtg-page.dark .rtg-info strong {
          color: #f8fafc;
        }

        .rtg-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .rtg-field {
          display: block;
          color: #334155;
          font-size: 0.86rem;
          font-weight: 900;
        }

        .rtg-field input,
        .rtg-field select,
        .rtg-field textarea {
          width: 100%;
          margin-top: 7px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 14px;
          padding: 12px 13px;
          outline: none;
          font-weight: 800;
          font-family: inherit;
        }

        .rtg-page.dark .rtg-field input,
        .rtg-page.dark .rtg-field select,
        .rtg-page.dark .rtg-field textarea {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .rtg-page.dark .rtg-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .rtg-field textarea {
          min-height: 110px;
          resize: vertical;
          line-height: 1.55;
        }

        .rtg-field input:focus,
        .rtg-field select:focus,
        .rtg-field textarea:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .rtg-page.dark .rtg-field input:focus,
        .rtg-page.dark .rtg-field select:focus,
        .rtg-page.dark .rtg-field textarea:focus {
          background: #020617;
        }

        .span-2 {
          grid-column: 1 / -1;
        }

        .rtg-mode-grid,
        .rtg-preset-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .rtg-mode,
        .rtg-preset {
          min-height: 56px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 16px;
          font-weight: 900;
          cursor: pointer;
          padding: 10px;
        }

        .rtg-page.dark .rtg-mode,
        .rtg-page.dark .rtg-preset {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
        }

        .rtg-mode.active {
          background: #eff6ff;
          color: #2563eb;
          border-color: #2563eb;
        }

        .rtg-page.dark .rtg-mode.active {
          background: rgba(37, 99, 235, 0.24);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.5);
        }

        .rtg-preset:hover,
        .rtg-mode:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .rtg-page.dark .rtg-preset:hover,
        .rtg-page.dark .rtg-mode:hover {
          background: rgba(37, 99, 235, 0.18);
          color: #93c5fd;
        }

        .rtg-rule-list {
          display: grid;
          gap: 12px;
        }

        .rtg-rule-row {
          display: grid;
          grid-template-columns: 140px 1fr 42px;
          gap: 10px;
          align-items: end;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 12px;
        }

        .rtg-page.dark .rtg-rule-row,
        .rtg-page.dark .rtg-check,
        .rtg-page.dark .rtg-info div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .rtg-icon-btn {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 12px;
          background: #fee2e2;
          color: #dc2626;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .rtg-icon-btn:disabled,
        .rtg-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .rtg-checks {
          display: grid;
          gap: 10px;
        }

        .rtg-check {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #334155;
          font-weight: 900;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 13px;
        }

        .rtg-check input {
          accent-color: #2563eb;
        }

        .rtg-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .rtg-primary,
        .rtg-dark,
        .rtg-light,
        .rtg-danger {
          min-height: 48px;
          border: 0;
          border-radius: 999px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 900;
          cursor: pointer;
          flex: 1;
          text-decoration: none;
        }

        .rtg-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .rtg-dark {
          background: #111827;
          color: #ffffff;
        }

        .rtg-page.dark .rtg-dark {
          background: #f8fafc;
          color: #111827;
        }

        .rtg-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .rtg-page.dark .rtg-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .rtg-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .rtg-preview {
          background: #020617;
          color: #dbeafe;
          border-radius: 22px;
          padding: 20px;
          min-height: 520px;
          white-space: pre-wrap;
          line-height: 1.7;
          overflow: auto;
          font-family: Consolas, Monaco, monospace;
          font-size: 0.95rem;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .rtg-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .rtg-info div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
        }

        .rtg-info span {
          display: block;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .rtg-info strong {
          color: #111827;
          word-break: break-word;
        }

        .rtg-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .rtg-toast {
          position: fixed;
          right: 24px;
          top: 92px;
          z-index: 9999;
          min-width: 280px;
          max-width: 430px;
          min-height: 54px;
          padding: 14px 16px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
        }

        .rtg-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .rtg-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .rtg-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .rtg-shell {
            grid-template-columns: 1fr;
          }

          .rtg-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .rtg-hero {
            padding: 52px 5% 34px;
          }

          .rtg-hero h1 {
            font-size: 2.2rem;
          }

          .rtg-shell {
            padding: 32px 5% 60px;
          }

          .rtg-grid,
          .rtg-mode-grid,
          .rtg-preset-grid,
          .rtg-info {
            grid-template-columns: 1fr;
          }

          .rtg-rule-row {
            grid-template-columns: 1fr;
          }

          .rtg-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .rtg-preview {
            min-height: 360px;
            font-size: 0.88rem;
          }

          .rtg-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .rtg-card {
            padding: 16px;
            border-radius: 18px;
          }

          .rtg-shell {
            padding: 24px 4.5% 48px;
          }
        }
      `}</style>

      {toast && (
        <div className={`rtg-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="rtg-hero">
        <p className="rtg-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="rtg-shell">
        <div className="rtg-left">
          <div className="rtg-card">
            <h3>{t.websiteSettings}</h3>

            <div className="rtg-grid">
              <label className="rtg-field span-2">
                {t.websiteUrl}
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </label>

              <label className="rtg-field span-2">
                {t.sitemapUrl}
                <input
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                />
              </label>

              <label className="rtg-field">
                {t.userAgent}
                <input
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  placeholder="*"
                />
              </label>

              <label className="rtg-field">
                {t.crawlDelay}
                <input
                  type="number"
                  min="0"
                  value={crawlDelay}
                  onChange={(e) => setCrawlDelay(e.target.value)}
                  placeholder={t.optional}
                />
              </label>
            </div>

            <div className="rtg-actions">
              <button type="button" className="rtg-light" onClick={autoFillSitemap}>
                <FileText />
                {t.autoSitemap}
              </button>
            </div>
          </div>

          <div className="rtg-card">
            <h3>{t.robotsMode}</h3>

            <div className="rtg-mode-grid">
              <button
                type="button"
                className={`rtg-mode ${mode === "allow-all" ? "active" : ""}`}
                onClick={() => setMode("allow-all")}
              >
                {t.allowAll}
              </button>

              <button
                type="button"
                className={`rtg-mode ${mode === "block-all" ? "active" : ""}`}
                onClick={() => setMode("block-all")}
              >
                {t.blockAll}
              </button>

              <button
                type="button"
                className={`rtg-mode ${mode === "custom" ? "active" : ""}`}
                onClick={() => setMode("custom")}
              >
                {t.custom}
              </button>
            </div>
          </div>

          <div className="rtg-card">
            <h3>{t.quickPresets}</h3>

            <div className="rtg-preset-grid">
              <button
                type="button"
                className="rtg-preset"
                onClick={() => applyPreset("react")}
              >
                {t.reactVite}
              </button>

              <button
                type="button"
                className="rtg-preset"
                onClick={() => applyPreset("wordpress")}
              >
                {t.wordpress}
              </button>

              <button
                type="button"
                className="rtg-preset"
                onClick={() => applyPreset("ecommerce")}
              >
                {t.ecommerce}
              </button>

              <button
                type="button"
                className="rtg-preset"
                onClick={() => applyPreset("private")}
              >
                {t.privateSite}
              </button>
            </div>
          </div>

          <div className="rtg-card">
            <h3>{t.rulesTitle}</h3>

            {mode !== "custom" && (
              <div className="rtg-note" style={{ marginBottom: 14 }}>
                {t.customModeNote}
              </div>
            )}

            <div className="rtg-rule-list">
              {rules.map((rule) => (
                <div className="rtg-rule-row" key={rule.id}>
                  <label className="rtg-field">
                    {t.ruleType}
                    <select
                      value={rule.type}
                      disabled={mode !== "custom"}
                      onChange={(e) => updateRule(rule.id, "type", e.target.value)}
                    >
                      <option value="Allow">Allow</option>
                      <option value="Disallow">Disallow</option>
                    </select>
                  </label>

                  <label className="rtg-field">
                    {t.path}
                    <input
                      value={rule.path}
                      disabled={mode !== "custom"}
                      onChange={(e) => updateRule(rule.id, "path", e.target.value)}
                      placeholder="/admin/"
                    />
                  </label>

                  <button
                    type="button"
                    className="rtg-icon-btn"
                    disabled={mode !== "custom"}
                    onClick={() => removeRule(rule.id)}
                    aria-label="Remove rule"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="rtg-actions">
              <button
                type="button"
                className="rtg-light"
                onClick={addRule}
                disabled={mode !== "custom"}
              >
                <Plus />
                {t.addRule}
              </button>
            </div>
          </div>

          <div className="rtg-card">
            <h3>{t.extraOptions}</h3>

            <div className="rtg-checks">
              <label className="rtg-check">
                <input
                  type="checkbox"
                  checked={includeSitemap}
                  onChange={(e) => setIncludeSitemap(e.target.checked)}
                />
                {t.includeSitemap}
              </label>

              <label className="rtg-check">
                <input
                  type="checkbox"
                  checked={includeHost}
                  onChange={(e) => setIncludeHost(e.target.checked)}
                />
                {t.includeHost}
              </label>
            </div>

            <label className="rtg-field" style={{ marginTop: 16 }}>
              {t.customLines}
              <textarea
                value={customLines}
                onChange={(e) => setCustomLines(e.target.value)}
                placeholder={t.customLinesPlaceholder}
              />
            </label>
          </div>
        </div>

        <div className="rtg-right">
          <div className="rtg-card">
            <h3>{t.generatedRobots}</h3>

            <div className="rtg-preview">{robotsText}</div>

            <div className="rtg-actions">
              <button type="button" className="rtg-dark" onClick={copyRobots}>
                <Copy />
                {t.copy}
              </button>

              <button
                type="button"
                className="rtg-primary"
                onClick={downloadRobots}
              >
                <Download />
                {t.download}
              </button>
            </div>

            <div className="rtg-actions">
              <button type="button" className="rtg-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="rtg-card">
            <h3>{t.seoInfo}</h3>

            <div className="rtg-info">
              <div>
                <span>{t.domain}</span>
                <strong>{normalizedSite || t.invalidUrl}</strong>
              </div>

              <div>
                <span>{t.robotsPath}</span>
                <strong>
                  {normalizedSite ? `${normalizedSite}/robots.txt` : "/robots.txt"}
                </strong>
              </div>

              <div>
                <span>{t.sitemap}</span>
                <strong>{includeSitemap ? t.included : t.notIncluded}</strong>
              </div>

              <div>
                <span>{t.mode}</span>
                <strong>{mode}</strong>
              </div>
            </div>

            <div className="rtg-note" style={{ marginTop: 16 }}>
              {t.uploadNote}
              <br />
              <strong>/public/robots.txt</strong>
              <br />
              {t.viteNote}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}