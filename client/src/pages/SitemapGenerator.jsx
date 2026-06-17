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
const today = new Date().toISOString().slice(0, 10);

const pageText = {
  en: {
    seoTitle: "Free Sitemap Generator Online - Create sitemap.xml | Convert Wala",
    seoDescription:
      "Create SEO-friendly sitemap.xml online for free with Convert Wala Sitemap Generator. Add lastmod, changefreq, priority, bulk URLs and download XML sitemap.",
    seoKeywords:
      "sitemap generator, sitemap.xml generator, free sitemap generator, XML sitemap, SEO sitemap, online sitemap maker, Convert Wala SEO tools",

    eyebrow: "Convert Wala SEO Tool",
    heading: "Sitemap Generator",
    subtitle:
      "Create SEO-friendly sitemap.xml for your website with lastmod, changefreq, priority, bulk URLs and ready-to-download XML output.",

    websiteSettings: "Website Settings",
    websiteUrl: "Website URL",
    defaultLastmod: "Default Last Modified",
    defaultChangefreq: "Default Changefreq",
    defaultPriority: "Default Priority",
    applyDefaults: "Apply Defaults to All",

    includeFields: "Include Fields",
    includeLastmod: "Include lastmod",
    includeChangefreq: "Include changefreq",
    includePriority: "Include priority",

    quickPresets: "Quick Presets",
    basicSite: "Basic Site",
    toolsWebsite: "Tools Website",
    businessSite: "Business Site",

    urls: "URLs",
    pageUrlPath: "Page URL / Path",
    changefreq: "Changefreq",
    priority: "Priority",
    lastModified: "Last Modified",
    addUrl: "Add URL",

    bulkAddUrls: "Bulk Add URLs",
    bulkLabel: "Paste one URL/path per line",
    addBulkUrls: "Add Bulk URLs",

    generatedSitemap: "Generated sitemap.xml",
    copyXml: "Copy XML",
    downloadSitemap: "Download sitemap.xml",
    reset: "Reset",

    sitemapInfo: "Sitemap Info",
    domain: "Domain",
    totalUrls: "Total URLs",
    sitemapUrl: "Sitemap URL",
    fileName: "File Name",
    invalidUrl: "Invalid URL",

    noteLine1: "In React/Vite website, place the downloaded file here:",
    noteLine2: "After build, it will open from root:",
    robotsTitle: "Robots.txt Sitemap Line",
    copyRobotsLine: "Copy Robots Line",

    minUrl: "Minimum 1 URL required.",
    defaultsApplied: "Default settings applied.",
    bulkRequired: "Paste bulk URLs/paths first.",
    urlsAdded: "URLs added.",
    presetApplied: "Preset applied.",
    copied: "sitemap.xml copied.",
    robotsCopied: "Robots sitemap line copied.",
    copyFailed: "Copy failed.",
    downloaded: "sitemap.xml downloaded.",
    resetDone: "Reset done.",
  },

  hi: {
    seoTitle: "Free Sitemap Generator Online - sitemap.xml बनाएं | Convert Wala",
    seoDescription:
      "Convert Wala Sitemap Generator से SEO-friendly sitemap.xml online free में बनाएं। lastmod, changefreq, priority, bulk URLs add करें और XML sitemap download करें।",
    seoKeywords:
      "sitemap generator, sitemap.xml generator, XML sitemap, SEO sitemap, online sitemap maker, sitemap banaye, Convert Wala SEO tools",

    eyebrow: "Convert Wala SEO टूल",
    heading: "Sitemap Generator",
    subtitle:
      "अपनी website के लिए lastmod, changefreq, priority, bulk URLs और ready-to-download XML output के साथ SEO-friendly sitemap.xml बनाएं।",

    websiteSettings: "Website Settings",
    websiteUrl: "Website URL",
    defaultLastmod: "Default Last Modified",
    defaultChangefreq: "Default Changefreq",
    defaultPriority: "Default Priority",
    applyDefaults: "Defaults सभी URLs पर Apply करें",

    includeFields: "Include Fields",
    includeLastmod: "lastmod Include करें",
    includeChangefreq: "changefreq Include करें",
    includePriority: "priority Include करें",

    quickPresets: "Quick Presets",
    basicSite: "Basic Site",
    toolsWebsite: "Tools Website",
    businessSite: "Business Site",

    urls: "URLs",
    pageUrlPath: "Page URL / Path",
    changefreq: "Changefreq",
    priority: "Priority",
    lastModified: "Last Modified",
    addUrl: "URL Add करें",

    bulkAddUrls: "Bulk URLs Add करें",
    bulkLabel: "एक line में एक URL/path paste करें",
    addBulkUrls: "Bulk URLs Add करें",

    generatedSitemap: "Generated sitemap.xml",
    copyXml: "XML Copy करें",
    downloadSitemap: "sitemap.xml Download करें",
    reset: "Reset करें",

    sitemapInfo: "Sitemap Info",
    domain: "Domain",
    totalUrls: "Total URLs",
    sitemapUrl: "Sitemap URL",
    fileName: "File Name",
    invalidUrl: "Invalid URL",

    noteLine1: "React/Vite website में downloaded file को यहां रखें:",
    noteLine2: "Build के बाद यह root पर open होगा:",
    robotsTitle: "Robots.txt Sitemap Line",
    copyRobotsLine: "Robots Line Copy करें",

    minUrl: "Minimum 1 URL required है।",
    defaultsApplied: "Default settings apply हो गई।",
    bulkRequired: "पहले bulk URLs/paths paste करें।",
    urlsAdded: "URLs add हो गए।",
    presetApplied: "Preset apply हो गया।",
    copied: "sitemap.xml copy हो गया।",
    robotsCopied: "Robots sitemap line copy हो गई।",
    copyFailed: "Copy failed.",
    downloaded: "sitemap.xml download हो गया।",
    resetDone: "Reset हो गया।",
  },

  hinglish: {
    seoTitle: "Free Sitemap Generator Online - Create sitemap.xml | Convert Wala",
    seoDescription:
      "Convert Wala Sitemap Generator se SEO-friendly sitemap.xml online free me banao. lastmod, changefreq, priority, bulk URLs add karo aur XML sitemap download karo.",
    seoKeywords:
      "sitemap generator, sitemap.xml generator, XML sitemap, SEO sitemap, online sitemap maker, Convert Wala SEO tools",

    eyebrow: "Convert Wala SEO Tool",
    heading: "Sitemap Generator",
    subtitle:
      "Apni website ke liye lastmod, changefreq, priority, bulk URLs aur ready-to-download XML output ke saath SEO-friendly sitemap.xml banao.",

    websiteSettings: "Website Settings",
    websiteUrl: "Website URL",
    defaultLastmod: "Default Last Modified",
    defaultChangefreq: "Default Changefreq",
    defaultPriority: "Default Priority",
    applyDefaults: "Apply Defaults to All",

    includeFields: "Include Fields",
    includeLastmod: "Include lastmod",
    includeChangefreq: "Include changefreq",
    includePriority: "Include priority",

    quickPresets: "Quick Presets",
    basicSite: "Basic Site",
    toolsWebsite: "Tools Website",
    businessSite: "Business Site",

    urls: "URLs",
    pageUrlPath: "Page URL / Path",
    changefreq: "Changefreq",
    priority: "Priority",
    lastModified: "Last Modified",
    addUrl: "Add URL",

    bulkAddUrls: "Bulk Add URLs",
    bulkLabel: "One URL/path per line paste karo",
    addBulkUrls: "Add Bulk URLs",

    generatedSitemap: "Generated sitemap.xml",
    copyXml: "Copy XML",
    downloadSitemap: "Download sitemap.xml",
    reset: "Reset",

    sitemapInfo: "Sitemap Info",
    domain: "Domain",
    totalUrls: "Total URLs",
    sitemapUrl: "Sitemap URL",
    fileName: "File Name",
    invalidUrl: "Invalid URL",

    noteLine1: "React/Vite website me downloaded file ko yaha rakho:",
    noteLine2: "Build ke baad ye root par open hoga:",
    robotsTitle: "Robots.txt Sitemap Line",
    copyRobotsLine: "Copy Robots Line",

    minUrl: "Minimum 1 URL required hai.",
    defaultsApplied: "Default settings applied.",
    bulkRequired: "Bulk URLs/paths pehle paste karo.",
    urlsAdded: "URLs added.",
    presetApplied: "Preset applied.",
    copied: "sitemap.xml copied.",
    robotsCopied: "Robots sitemap line copied.",
    copyFailed: "Copy failed.",
    downloaded: "sitemap.xml downloaded.",
    resetDone: "Reset done.",
  },
};

const escapeXml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
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

const normalizePath = (path = "") => {
  const clean = path.trim();

  if (!clean) return "/";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return clean.startsWith("/") ? clean : `/${clean}`;
};

const buildFullUrl = (domain, path) => {
  const normalizedPath = normalizePath(path);

  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return normalizedPath;
  }

  return `${domain}${normalizedPath}`;
};

export default function SitemapGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [toast, setToast] = useState(null);

  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [includeLastmod, setIncludeLastmod] = useState(true);
  const [includeChangefreq, setIncludeChangefreq] = useState(true);
  const [includePriority, setIncludePriority] = useState(true);
  const [defaultLastmod, setDefaultLastmod] = useState(today);
  const [defaultChangefreq, setDefaultChangefreq] = useState("weekly");
  const [defaultPriority, setDefaultPriority] = useState("0.8");
  const [bulkText, setBulkText] = useState("");

  const [pages, setPages] = useState([
    {
      id: makeId(),
      path: "/",
      lastmod: today,
      changefreq: "daily",
      priority: "1.0",
    },
    {
      id: makeId(),
      path: "/tools",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      id: makeId(),
      path: "/resume-builder/templates",
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
    },
  ]);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/sitemap-generator";

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

  const sitemapXml = useMemo(() => {
    const domain = normalizedSite || "https://example.com";

    const validPages = pages
      .map((page) => ({
        ...page,
        path: page.path.trim(),
      }))
      .filter((page) => page.path);

    const lines = [];

    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

    validPages.forEach((page) => {
      const loc = buildFullUrl(domain, page.path);

      lines.push(`  <url>`);
      lines.push(`    <loc>${escapeXml(loc)}</loc>`);

      if (includeLastmod && page.lastmod) {
        lines.push(`    <lastmod>${escapeXml(page.lastmod)}</lastmod>`);
      }

      if (includeChangefreq && page.changefreq) {
        lines.push(`    <changefreq>${escapeXml(page.changefreq)}</changefreq>`);
      }

      if (includePriority && page.priority) {
        lines.push(`    <priority>${escapeXml(page.priority)}</priority>`);
      }

      lines.push(`  </url>`);
    });

    lines.push(`</urlset>`);

    return lines.join("\n");
  }, [pages, normalizedSite, includeLastmod, includeChangefreq, includePriority]);

  const robotsLine = useMemo(() => {
    const domain = normalizedSite || "https://example.com";
    return `Sitemap: ${domain}/sitemap.xml`;
  }, [normalizedSite]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const updatePage = (id, key, value) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, [key]: value } : page))
    );
  };

  const addPage = () => {
    setPages((prev) => [
      ...prev,
      {
        id: makeId(),
        path: "/new-page",
        lastmod: defaultLastmod,
        changefreq: defaultChangefreq,
        priority: defaultPriority,
      },
    ]);
  };

  const removePage = (id) => {
    if (pages.length === 1) {
      showToast("error", t.minUrl);
      return;
    }

    setPages((prev) => prev.filter((page) => page.id !== id));
  };

  const applyDefaults = () => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        lastmod: defaultLastmod,
        changefreq: defaultChangefreq,
        priority: defaultPriority,
      }))
    );

    showToast("success", t.defaultsApplied);
  };

  const addBulkPages = () => {
    const lines = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      showToast("error", t.bulkRequired);
      return;
    }

    const prepared = lines.map((line) => ({
      id: makeId(),
      path: normalizePath(line),
      lastmod: defaultLastmod,
      changefreq: defaultChangefreq,
      priority: defaultPriority,
    }));

    setPages((prev) => [...prev, ...prepared]);
    setBulkText("");
    showToast("success", `${prepared.length} ${t.urlsAdded}`);
  };

  const applyPreset = (preset) => {
    if (preset === "basic") {
      setPages([
        { id: makeId(), path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
        { id: makeId(), path: "/about", lastmod: today, changefreq: "monthly", priority: "0.8" },
        { id: makeId(), path: "/contact", lastmod: today, changefreq: "monthly", priority: "0.8" },
        { id: makeId(), path: "/tools", lastmod: today, changefreq: "weekly", priority: "0.9" },
      ]);
    }

    if (preset === "tools") {
      setPages([
        { id: makeId(), path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
        { id: makeId(), path: "/tools", lastmod: today, changefreq: "daily", priority: "0.95" },
        { id: makeId(), path: "/resume-builder/templates", lastmod: today, changefreq: "weekly", priority: "0.9" },
        { id: makeId(), path: "/image-converter", lastmod: today, changefreq: "weekly", priority: "0.8" },
        { id: makeId(), path: "/pdf-compressor", lastmod: today, changefreq: "weekly", priority: "0.8" },
        { id: makeId(), path: "/invoice-generator", lastmod: today, changefreq: "weekly", priority: "0.8" },
        { id: makeId(), path: "/robots-txt-generator", lastmod: today, changefreq: "monthly", priority: "0.7" },
      ]);
    }

    if (preset === "business") {
      setPages([
        { id: makeId(), path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
        { id: makeId(), path: "/about", lastmod: today, changefreq: "monthly", priority: "0.8" },
        { id: makeId(), path: "/services", lastmod: today, changefreq: "weekly", priority: "0.9" },
        { id: makeId(), path: "/blogs", lastmod: today, changefreq: "weekly", priority: "0.8" },
        { id: makeId(), path: "/contact", lastmod: today, changefreq: "monthly", priority: "0.8" },
        { id: makeId(), path: "/privacy-policy", lastmod: today, changefreq: "yearly", priority: "0.3" },
        { id: makeId(), path: "/terms-and-conditions", lastmod: today, changefreq: "yearly", priority: "0.3" },
      ]);
    }

    showToast("success", t.presetApplied);
  };

  const copySitemap = async () => {
    try {
      await navigator.clipboard.writeText(sitemapXml);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const copyRobotsLine = async () => {
    try {
      await navigator.clipboard.writeText(robotsLine);
      showToast("success", t.robotsCopied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadSitemap = () => {
    const blob = new Blob([sitemapXml], {
      type: "application/xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "sitemap.xml";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    showToast("success", t.downloaded);
  };

  const resetAll = () => {
    setSiteUrl("https://example.com");
    setIncludeLastmod(true);
    setIncludeChangefreq(true);
    setIncludePriority(true);
    setDefaultLastmod(today);
    setDefaultChangefreq("weekly");
    setDefaultPriority("0.8");
    setBulkText("");
    setPages([
      { id: makeId(), path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
      { id: makeId(), path: "/tools", lastmod: today, changefreq: "weekly", priority: "0.9" },
      { id: makeId(), path: "/resume-builder/templates", lastmod: today, changefreq: "weekly", priority: "0.8" },
    ]);

    showToast("success", t.resetDone);
  };

  return (
    <main className={`stg-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Sitemap Generator",
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
              "Generate sitemap.xml",
              "Add lastmod changefreq and priority",
              "Bulk URL import",
              "Website presets",
              "Copy robots.txt sitemap line",
              "Download XML sitemap",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .stg-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .stg-page * {
          box-sizing: border-box;
        }

        .stg-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .stg-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .stg-page.dark .stg-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .stg-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .stg-page.dark .stg-eyebrow {
          color: #93c5fd;
        }

        .stg-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .stg-page.dark .stg-hero h1 {
          color: #f8fafc;
        }

        .stg-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .stg-page.dark .stg-hero p,
        .stg-page.dark .stg-info span {
          color: #cbd5e1;
        }

        .stg-shell {
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(330px, 0.95fr) minmax(420px, 1.05fr);
          gap: 28px;
          align-items: start;
        }

        .stg-left,
        .stg-right {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1101px) {
          .stg-right {
            position: sticky;
            top: 18px;
          }
        }

        .stg-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 22px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .stg-page.dark .stg-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .stg-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.08rem;
        }

        .stg-page.dark .stg-card h3,
        .stg-page.dark .stg-field,
        .stg-page.dark .stg-check,
        .stg-page.dark .stg-info strong {
          color: #f8fafc;
        }

        .stg-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stg-field {
          display: block;
          color: #334155;
          font-size: 0.86rem;
          font-weight: 900;
        }

        .stg-field input,
        .stg-field select,
        .stg-field textarea {
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

        .stg-page.dark .stg-field input,
        .stg-page.dark .stg-field select,
        .stg-page.dark .stg-field textarea {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .stg-page.dark .stg-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .stg-field textarea {
          min-height: 130px;
          resize: vertical;
          line-height: 1.55;
        }

        .stg-field input:focus,
        .stg-field select:focus,
        .stg-field textarea:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .stg-page.dark .stg-field input:focus,
        .stg-page.dark .stg-field select:focus,
        .stg-page.dark .stg-field textarea:focus {
          background: #020617;
        }

        .span-2 {
          grid-column: 1 / -1;
        }

        .stg-checks {
          display: grid;
          gap: 10px;
        }

        .stg-check {
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

        .stg-page.dark .stg-check,
        .stg-page.dark .stg-url-row,
        .stg-page.dark .stg-info div,
        .stg-page.dark .stg-robots-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .stg-check input {
          accent-color: #2563eb;
        }

        .stg-preset-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .stg-preset {
          min-height: 56px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 16px;
          font-weight: 900;
          cursor: pointer;
          padding: 10px;
        }

        .stg-page.dark .stg-preset {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
        }

        .stg-preset:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .stg-page.dark .stg-preset:hover {
          background: rgba(37, 99, 235, 0.18);
          color: #93c5fd;
        }

        .stg-url-list {
          display: grid;
          gap: 12px;
        }

        .stg-url-row {
          display: grid;
          grid-template-columns: 1fr 135px 105px 42px;
          gap: 10px;
          align-items: end;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 12px;
        }

        .stg-icon-btn {
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

        .stg-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .stg-primary,
        .stg-dark,
        .stg-light,
        .stg-danger {
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

        .stg-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .stg-dark {
          background: #111827;
          color: #ffffff;
        }

        .stg-page.dark .stg-dark {
          background: #f8fafc;
          color: #111827;
        }

        .stg-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .stg-page.dark .stg-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .stg-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .stg-preview {
          background: #020617;
          color: #dbeafe;
          border-radius: 22px;
          padding: 20px;
          min-height: 520px;
          white-space: pre-wrap;
          line-height: 1.7;
          overflow: auto;
          font-family: Consolas, Monaco, monospace;
          font-size: 0.92rem;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .stg-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stg-info div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
        }

        .stg-info span {
          display: block;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .stg-info strong {
          color: #111827;
          word-break: break-word;
        }

        .stg-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .stg-robots-box {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #111827;
          border-radius: 18px;
          padding: 14px;
          font-family: Consolas, Monaco, monospace;
          word-break: break-word;
        }

        .stg-page.dark .stg-robots-box {
          color: #f8fafc;
        }

        .stg-toast {
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

        .stg-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .stg-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .stg-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .stg-shell {
            grid-template-columns: 1fr;
          }

          .stg-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .stg-hero {
            padding: 52px 5% 34px;
          }

          .stg-hero h1 {
            font-size: 2.2rem;
          }

          .stg-shell {
            padding: 32px 5% 60px;
          }

          .stg-grid,
          .stg-preset-grid,
          .stg-info {
            grid-template-columns: 1fr;
          }

          .stg-url-row {
            grid-template-columns: 1fr;
          }

          .stg-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .stg-preview {
            min-height: 360px;
            font-size: 0.84rem;
          }

          .stg-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .stg-card {
            padding: 16px;
            border-radius: 18px;
          }

          .stg-shell {
            padding: 24px 4.5% 48px;
          }
        }
      `}</style>

      {toast && (
        <div className={`stg-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="stg-hero">
        <p className="stg-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="stg-shell">
        <div className="stg-left">
          <div className="stg-card">
            <h3>{t.websiteSettings}</h3>

            <div className="stg-grid">
              <label className="stg-field span-2">
                {t.websiteUrl}
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </label>

              <label className="stg-field">
                {t.defaultLastmod}
                <input
                  type="date"
                  value={defaultLastmod}
                  onChange={(e) => setDefaultLastmod(e.target.value)}
                />
              </label>

              <label className="stg-field">
                {t.defaultChangefreq}
                <select
                  value={defaultChangefreq}
                  onChange={(e) => setDefaultChangefreq(e.target.value)}
                >
                  <option value="always">always</option>
                  <option value="hourly">hourly</option>
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                  <option value="yearly">yearly</option>
                  <option value="never">never</option>
                </select>
              </label>

              <label className="stg-field">
                {t.defaultPriority}
                <select
                  value={defaultPriority}
                  onChange={(e) => setDefaultPriority(e.target.value)}
                >
                  <option value="1.0">1.0</option>
                  <option value="0.9">0.9</option>
                  <option value="0.8">0.8</option>
                  <option value="0.7">0.7</option>
                  <option value="0.6">0.6</option>
                  <option value="0.5">0.5</option>
                  <option value="0.3">0.3</option>
                </select>
              </label>
            </div>

            <div className="stg-actions">
              <button type="button" className="stg-light" onClick={applyDefaults}>
                <RefreshCcw />
                {t.applyDefaults}
              </button>
            </div>
          </div>

          <div className="stg-card">
            <h3>{t.includeFields}</h3>

            <div className="stg-checks">
              <label className="stg-check">
                <input
                  type="checkbox"
                  checked={includeLastmod}
                  onChange={(e) => setIncludeLastmod(e.target.checked)}
                />
                {t.includeLastmod}
              </label>

              <label className="stg-check">
                <input
                  type="checkbox"
                  checked={includeChangefreq}
                  onChange={(e) => setIncludeChangefreq(e.target.checked)}
                />
                {t.includeChangefreq}
              </label>

              <label className="stg-check">
                <input
                  type="checkbox"
                  checked={includePriority}
                  onChange={(e) => setIncludePriority(e.target.checked)}
                />
                {t.includePriority}
              </label>
            </div>
          </div>

          <div className="stg-card">
            <h3>{t.quickPresets}</h3>

            <div className="stg-preset-grid">
              <button
                type="button"
                className="stg-preset"
                onClick={() => applyPreset("basic")}
              >
                {t.basicSite}
              </button>

              <button
                type="button"
                className="stg-preset"
                onClick={() => applyPreset("tools")}
              >
                {t.toolsWebsite}
              </button>

              <button
                type="button"
                className="stg-preset"
                onClick={() => applyPreset("business")}
              >
                {t.businessSite}
              </button>
            </div>
          </div>

          <div className="stg-card">
            <h3>{t.urls}</h3>

            <div className="stg-url-list">
              {pages.map((page) => (
                <div className="stg-url-row" key={page.id}>
                  <label className="stg-field">
                    {t.pageUrlPath}
                    <input
                      value={page.path}
                      onChange={(e) => updatePage(page.id, "path", e.target.value)}
                      placeholder="/about"
                    />
                  </label>

                  <label className="stg-field">
                    {t.changefreq}
                    <select
                      value={page.changefreq}
                      onChange={(e) =>
                        updatePage(page.id, "changefreq", e.target.value)
                      }
                    >
                      <option value="always">always</option>
                      <option value="hourly">hourly</option>
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                      <option value="never">never</option>
                    </select>
                  </label>

                  <label className="stg-field">
                    {t.priority}
                    <select
                      value={page.priority}
                      onChange={(e) =>
                        updatePage(page.id, "priority", e.target.value)
                      }
                    >
                      <option value="1.0">1.0</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.6">0.6</option>
                      <option value="0.5">0.5</option>
                      <option value="0.3">0.3</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="stg-icon-btn"
                    onClick={() => removePage(page.id)}
                    aria-label="Remove URL"
                  >
                    <Trash2 size={18} />
                  </button>

                  <label className="stg-field span-2">
                    {t.lastModified}
                    <input
                      type="date"
                      value={page.lastmod}
                      onChange={(e) =>
                        updatePage(page.id, "lastmod", e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="stg-actions">
              <button type="button" className="stg-light" onClick={addPage}>
                <Plus />
                {t.addUrl}
              </button>
            </div>
          </div>

          <div className="stg-card">
            <h3>{t.bulkAddUrls}</h3>

            <label className="stg-field">
              {t.bulkLabel}
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`/about\n/contact\n/services\n/blogs\n/privacy-policy`}
              />
            </label>

            <div className="stg-actions">
              <button type="button" className="stg-primary" onClick={addBulkPages}>
                <Plus />
                {t.addBulkUrls}
              </button>
            </div>
          </div>
        </div>

        <div className="stg-right">
          <div className="stg-card">
            <h3>{t.generatedSitemap}</h3>

            <div className="stg-preview">{sitemapXml}</div>

            <div className="stg-actions">
              <button type="button" className="stg-dark" onClick={copySitemap}>
                <Copy />
                {t.copyXml}
              </button>

              <button
                type="button"
                className="stg-primary"
                onClick={downloadSitemap}
              >
                <Download />
                {t.downloadSitemap}
              </button>
            </div>

            <div className="stg-actions">
              <button type="button" className="stg-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="stg-card">
            <h3>{t.sitemapInfo}</h3>

            <div className="stg-info">
              <div>
                <span>{t.domain}</span>
                <strong>{normalizedSite || t.invalidUrl}</strong>
              </div>

              <div>
                <span>{t.totalUrls}</span>
                <strong>{pages.filter((p) => p.path.trim()).length}</strong>
              </div>

              <div>
                <span>{t.sitemapUrl}</span>
                <strong>
                  {normalizedSite ? `${normalizedSite}/sitemap.xml` : "/sitemap.xml"}
                </strong>
              </div>

              <div>
                <span>{t.fileName}</span>
                <strong>sitemap.xml</strong>
              </div>
            </div>

            <div className="stg-note" style={{ marginTop: 16 }}>
              {t.noteLine1}
              <br />
              <strong>/public/sitemap.xml</strong>
              <br />
              {t.noteLine2}
              <br />
              <strong>{normalizedSite || "https://example.com"}/sitemap.xml</strong>
            </div>
          </div>

          <div className="stg-card">
            <h3>{t.robotsTitle}</h3>

            <div className="stg-robots-box">{robotsLine}</div>

            <div className="stg-actions">
              <button type="button" className="stg-light" onClick={copyRobotsLine}>
                <Copy />
                {t.copyRobotsLine}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}