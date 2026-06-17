import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { tools } from "../data/toolsData";
import {
  FileText,
  GitCompareArrows,
  ScrollText,
  Image,
  Smile,
  Images,
  Circle,
  Info,
  Regex,
  Crop,
  Bot,
  Binary,
  Braces,
  Video,
  HelpCircle,
  Hash,
  RotateCw,
  Music,
  Scissors,
  Pipette,
  QrCode,
  Trash2,
  Shuffle,
  Mic,
  Code2,
  Image as ImageIcon,
  KeyRound,
  Download,
  Map,
  Share2,
  Calendar,
  Calculator,
  BadgeIcon,
  Fingerprint,
  Search,
  Boxes,
  FileMinus,
  Type,
  Table,
  FileJson,
  Link2,
  ShieldCheck,
  CodeXml,
  Droplets,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala",
    title: "All Free Online Tools",
    subtitle:
      "Search and use powerful online tools for PDF, images, videos, SEO, finance, documents and daily needs.",
    searchPlaceholder: "Search for the tool you like",
    searchBtn: "Search",
    noResult: "No tools found",
    noResultText: "Try another keyword or choose another category.",
    open: "Open Tool",
    live: "Live",
    coming: "Coming Soon",
    seoTitle:
      "All Free Online Tools - PDF, Image, Video, AI & Finance Tools | Convert Wala",
    seoDescription:
      "Explore Convert Wala free online tools including resume builder, image tools, video tools, PDF tools, AI tools, SEO tools, GST calculator, EMI calculator and more.",
    seoKeywords:
      "free online tools, Convert Wala, PDF tools, image converter, video tools, resume builder, AI tools, GST calculator, EMI calculator, SEO tools, sitemap generator, robots txt generator",
    categories: {
      all: "All",
      image: "Image Tools",
      pdf: "PDF Tools",
      video: "Video Tools",
      ai: "AI Tools",
      seo: "SEO Tools",
      finance: "Finance Tools",
      daily: "Daily Tools",
      business: "Business Tools",
      education: "Education Tools",
      resume: "Resume Tools",
      text: "Text Tools",
      generator: "Generator Tools",
      security: "Security Tools",
      developer: "Developer Tools",
      emoji: "Emoji Tools",
    },
  },

  hi: {
    eyebrow: "Convert Wala",
    title: "सभी निःशुल्क ऑनलाइन टूल",
    subtitle:
      "PDF, इमेज, वीडियो, SEO, फाइनेंस, दस्तावेज़ और दैनिक उपयोग के लिए उपयोगी ऑनलाइन टूल खोजें और इस्तेमाल करें।",
    searchPlaceholder: "अपना पसंदीदा टूल खोजें",
    searchBtn: "खोजें",
    noResult: "कोई टूल नहीं मिला",
    noResultText: "कृपया दूसरा शब्द लिखें या दूसरी श्रेणी चुनें।",
    open: "टूल खोलें",
    live: "उपलब्ध",
    text: "टेक्स्ट टूल",
    coming: "जल्द उपलब्ध होगा",
    generator: "जनरेटर टूल",
    seoTitle:
      "सभी मुफ्त ऑनलाइन टूल - PDF, इमेज, वीडियो, AI और फाइनेंस टूल | Convert Wala",
    seoDescription:
      "Convert Wala पर रिज़्यूमे बिल्डर, इमेज टूल, वीडियो टूल, PDF टूल, AI टूल, SEO टूल, GST कैलकुलेटर, EMI कैलकुलेटर और अन्य मुफ्त ऑनलाइन टूल इस्तेमाल करें।",
    seoKeywords:
      "मुफ्त ऑनलाइन टूल, Convert Wala, PDF टूल, इमेज कन्वर्टर, वीडियो टूल, रिज्यूमे बिल्डर, AI टूल, GST कैलकुलेटर, EMI कैलकुलेटर, SEO टूल",
    categories: {
      all: "सभी",
      image: "इमेज टूल",
      pdf: "पीडीएफ टूल",
      video: "वीडियो टूल",
      ai: "एआई टूल",
      seo: "एसईओ टूल",
      finance: "फाइनेंस टूल",
      text: "टेक्स्ट टूल",
      emoji: "इमोजी टूल",
      generator: "जनरेटर टूल",
      daily: "दैनिक टूल",
      business: "बिज़नेस टूल",
      education: "शिक्षा टूल",
      security: "सिक्योरिटी टूल",
      developer: "डेवलपर टूल",
      resume: "रिज़्यूमे टूल",
    },
  },

  hinglish: {
    eyebrow: "Convert Wala",
    title: "All Free Online Tools",
    subtitle:
      "PDF, image, video, SEO, finance, documents aur daily needs ke useful online tools search aur use karo.",
    searchPlaceholder: "Search for the tool you like",
    searchBtn: "Search",
    noResult: "Koi tool nahi mila",
    noResultText: "Dusra keyword try karo ya category change karo.",
    open: "Open Tool",
    text: "Text Tools",
    live: "Live",
    coming: "Coming Soon",
    generator: "Generator Tools",
    seoTitle:
      "All Free Online Tools - PDF, Image, Video, AI & Finance Tools | Convert Wala",
    seoDescription:
      "Convert Wala par resume builder, image tools, video tools, PDF tools, AI tools, SEO tools, GST calculator, EMI calculator aur more free tools use karo.",
    seoKeywords:
      "free online tools, Convert Wala, PDF tools, image converter, video tools, resume builder, AI tools, GST calculator, EMI calculator, SEO tools",
    categories: {
      all: "All",
      image: "Image Tools",
      pdf: "PDF Tools",
      video: "Video Tools",
      ai: "AI Tools",
      seo: "SEO Tools",
      finance: "Finance Tools",
      text: "Text Tools",
      emoji: "Emoji Tools",
      generator: "Generator Tools",
      daily: "Daily Tools",
      business: "Business Tools",
      education: "Education Tools",
      security: "Security Tools",
      developer: "Developer Tools",
      resume: "Resume Tools",
    },
  },
};



const categoryOrder = [
  "all",
  "image",
  "pdf",
  "video",
  "ai",
  "seo",
  "finance",
  "text",
  "emoji",
  "generator",
  "daily",
  "business",
  "education",
  "security",
  "developer",
  "resume",
];

export default function Tools() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tools.filter((tool) => {
      const desc = tool.desc?.[language] || tool.desc?.en || "";
      const categoryLabel = t.categories?.[tool.category] || "";

      const searchableText = [
        tool.title,
        tool.category,
        categoryLabel,
        desc,
        ...(tool.keywords || []),
      ]
        .join(" ")
        .toLowerCase();

      const categoryMatch =
        activeCategory === "all" || tool.category === activeCategory;

      const searchMatch = !query || searchableText.includes(query);

      return categoryMatch && searchMatch;
    });
  }, [search, activeCategory, language, t.categories]);

  const groupedTools = useMemo(() => {
    return categoryOrder
      .filter((category) => category !== "all")
      .map((category) => ({
        category,
        label: t.categories?.[category] || category,
        tools: filteredTools.filter((tool) => tool.category === category),
      }))
      .filter((group) => group.tools.length > 0);
  }, [filteredTools, t.categories]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const renderToolCard = (tool) => {
    const Icon = tool.icon;
    const isDisabled = tool.status === "Coming Soon";
    const desc = tool.desc?.[language] || tool.desc?.en || "";

    return (
      <Link
        to={tool.path}
        className={`tool-card ${isDisabled ? "disabled" : ""}`}
        key={tool.title}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
        }}
      >
        <div className="tool-top">
          <div className="tool-icon">
            <Icon />
          </div>

          <span className="tool-status">{tool.status || t.live}</span>
        </div>

        <h3>{tool.title}</h3>
        <p>{desc}</p>

        <div className="tool-bottom">
          <span className="tool-category">
            {t.categories?.[tool.category] || tool.category}
          </span>
          <strong className="tool-open">
            {isDisabled ? t.coming : t.open}
          </strong>
        </div>
      </Link>
    );
  };

  return (
    <main className={`tools-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        <meta name="keywords" content={t.seoKeywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <link rel="canonical" href="https://www.convertwala.com/tools" />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertwala.com/tools" />
        <meta property="og:site_name" content="Convert Wala" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.seoTitle,
            description: t.seoDescription,
            url: "https://www.convertwala.com/tools",
            isPartOf: {
              "@type": "WebSite",
              name: "Convert Wala",
              url: "https://www.convertwala.com/",
            },
          })}
        </script>
      </Helmet>

      <style>{`
        .tools-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          overflow-x: hidden;
          transition: 0.25s ease;
        }

        .tools-page * {
          box-sizing: border-box;
        }

        .tools-page.dark {
          background: #020617;
          color: #f8fafc;
        }

        .tools-hero {
          padding: 64px 6% 42px;
          overflow: visible;
          background:
            radial-gradient(circle at 14% 0%, rgba(37, 99, 235, 0.14), transparent 32%),
            linear-gradient(135deg, #eef5ff, #ffffff);
          border-bottom: 1px solid #e5e7eb;
        }

        .tools-page.dark .tools-hero {
          background:
            radial-gradient(circle at 14% 0%, rgba(37, 99, 235, 0.26), transparent 32%),
            linear-gradient(135deg, #020617, #0f172a);
          border-bottom-color: rgba(255,255,255,0.09);
        }

        .rb-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .tools-page.dark .rb-eyebrow {
          color: #93c5fd;
        }

        .tools-hero h1 {
          margin: 0;
          color: inherit;
          font-size: clamp(2.35rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1.12;
          max-width: 920px;
          overflow: visible;
        }

        .tools-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.75;
          font-size: 1.04rem;
          margin: 16px 0 0;
        }

        .tools-page.dark .tools-hero p {
          color: #cbd5e1;
        }

        .tools-search-area {
          padding: 34px 6% 30px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .tools-page.dark .tools-search-area {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.08);
        }

        .tools-search-form {
          width: min(760px, 100%);
          margin: 0 auto;
          min-height: 66px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 118px 155px;
          gap: 10px;
          align-items: center;
          padding: 10px;
          border-radius: 22px;
          background: #f8fafc;
          border: 1px solid #dbeafe;
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
        }

        .tools-page.dark .tools-search-form {
          background: #0f172a;
          border-color: rgba(56, 189, 248, 0.2);
          box-shadow: 0 18px 54px rgba(0, 0, 0, 0.25);
        }

        .tools-search-input-wrap {
          position: relative;
          min-width: 0;
        }

        .tools-search-input-wrap svg {
          position: absolute;
          left: 17px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }

        .tools-search-input {
          width: 100%;
          height: 46px;
          border: 1px solid #dbeafe;
          outline: none;
          border-radius: 16px;
          background: #ffffff;
          color: #0f172a;
          padding: 0 16px 0 46px;
          font-size: 0.96rem;
          font-weight: 800;
        }

        .tools-search-input::placeholder {
          color: #94a3b8;
        }

        .tools-search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .tools-search-btn {
          height: 46px;
          border: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.22);
        }

        .tools-search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 45px rgba(37, 99, 235, 0.32);
        }

        .tools-category-select {
          height: 46px;
          border: 1px solid #bfdbfe;
          outline: none;
          border-radius: 16px;
          background: #eff6ff;
          color: #2563eb;
          padding: 0 14px;
          font-size: 0.95rem;
          font-weight: 950;
          cursor: pointer;
        }

        .tools-category-select:focus {
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .tools-page.dark .tools-search-input {
          background: #020617;
          border-color: rgba(56, 189, 248, 0.18);
          color: #f8fafc;
        }

        .tools-page.dark .tools-search-input:focus {
          background: #0f172a;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.12);
        }

        .tools-page.dark .tools-search-input::placeholder {
          color: #64748b;
        }

        .tools-page.dark .tools-search-btn {
          background: linear-gradient(135deg, #2563eb, #38bdf8);
        }

        .tools-page.dark .tools-category-select {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.18);
          color: #7dd3fc;
        }

        .tools-page.dark .tools-category-select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .tools-grid-wrap {
          padding: 34px 6% 84px;
        }

        .tool-group {
          margin-bottom: 42px;
        }

        .tool-group-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .tool-group-head h2 {
          margin: 0;
          color: inherit;
          font-size: clamp(1.35rem, 2.4vw, 2.15rem);
          letter-spacing: -0.04em;
        }

        .tool-count {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 12px;
          background: #e0f2fe;
          color: #0284c7;
          font-size: 0.8rem;
          font-weight: 950;
          white-space: nowrap;
        }

        .tools-page.dark .tool-count {
          background: rgba(56,189,248,0.14);
          color: #7dd3fc;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .tool-card {
          position: relative;
          min-height: 245px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 22px;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          box-shadow: 0 20px 55px rgba(15, 23, 42, 0.08);
          transition: 0.24s ease;
        }

        .tool-card.disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .tool-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 16% 12%, rgba(14, 165, 233, 0.14), transparent 28%),
            radial-gradient(circle at 90% 90%, rgba(37, 99, 235, 0.11), transparent 34%);
          opacity: 0;
          transition: 0.24s ease;
        }

        .tool-card:hover {
          transform: translateY(-6px);
          border-color: rgba(14, 165, 233, 0.45);
          box-shadow: 0 28px 75px rgba(14, 165, 233, 0.15);
        }

        .tool-card:hover::before {
          opacity: 1;
        }

        .tools-page.dark .tool-card {
          background: #0f172a;
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.28);
        }

        .tool-card > * {
          position: relative;
          z-index: 1;
        }

        .tool-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .tool-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          background: #e0f2fe;
          color: #0284c7;
          display: grid;
          place-items: center;
        }

        .tools-page.dark .tool-icon {
          background: rgba(56,189,248,0.14);
          color: #7dd3fc;
        }

        .tool-icon svg {
          width: 28px;
          height: 28px;
        }

        .tool-status {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 0.72rem;
          font-weight: 900;
          background: #dcfce7;
          color: #15803d;
        }

        .tools-page.dark .tool-status {
          background: rgba(34,197,94,0.16);
          color: #86efac;
        }

        .tool-card h3 {
          margin: 0 0 10px;
          color: inherit;
          font-size: 1.1rem;
          line-height: 1.25;
        }

        .tool-card p {
          margin: 0;
          color: #64748b;
          line-height: 1.65;
          font-size: 0.92rem;
        }

        .tools-page.dark .tool-card p {
          color: #cbd5e1;
        }

        .tool-bottom {
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .tool-category {
          color: #0284c7;
          background: #e0f2fe;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .tools-page.dark .tool-category {
          color: #7dd3fc;
          background: rgba(56,189,248,0.14);
        }

        .tool-open {
          color: #0284c7;
          font-weight: 950;
          font-size: 0.86rem;
          white-space: nowrap;
        }

        .tools-page.dark .tool-open {
          color: #7dd3fc;
        }

        .no-tools {
          min-height: 260px;
          border-radius: 24px;
          border: 1px dashed #cbd5e1;
          background: #ffffff;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 30px;
        }

        .tools-page.dark .no-tools {
          background: #0f172a;
          border-color: rgba(255,255,255,0.14);
        }

        .no-tools h3 {
          margin: 0 0 8px;
          font-size: 1.4rem;
        }

        .no-tools p {
          margin: 0;
          color: #64748b;
          font-weight: 800;
        }

        .tools-page.dark .no-tools p {
          color: #cbd5e1;
        }

        @media (max-width: 1200px) {
          .tools-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .tools-search-form {
            grid-template-columns: 1fr 110px;
            width: min(680px, 100%);
          }

          .tools-category-select {
            grid-column: 1 / -1;
          }

          .tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .tools-hero {
            padding: 46px 5% 30px;
          }

          .tools-hero h1 {
            font-size: 2.25rem;
          }

          .tools-search-area,
          .tools-grid-wrap {
            padding: 22px 5%;
          }

          .tools-search-form {
            grid-template-columns: 1fr;
            padding: 12px;
            border-radius: 20px;
          }

          .tools-search-input,
          .tools-search-btn,
          .tools-category-select {
            width: 100%;
            height: 46px;
            border-radius: 16px;
          }

          .tool-group {
            margin-bottom: 34px;
          }

          .tool-group-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .tools-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .tool-card {
            min-height: auto;
            border-radius: 22px;
            padding: 18px;
          }
        }
      `}</style>

      <section className="tools-hero">
        <p className="rb-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="tools-search-area">
        <form className="tools-search-form" onSubmit={handleSearch}>
          <div className="tools-search-input-wrap">
            <Search />
            <input
              className="tools-search-input"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSearch(e.target.value);
              }}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <button type="submit" className="tools-search-btn">
            {t.searchBtn}
          </button>

          <select
            className="tools-category-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categoryOrder.map((cat) => (
              <option value={cat} key={cat}>
                {t.categories?.[cat] || cat}
              </option>
            ))}
          </select>
        </form>
      </section>

      <section className="tools-grid-wrap">
        {filteredTools.length === 0 ? (
          <div className="no-tools">
            <div>
              <h3>{t.noResult}</h3>
              <p>{t.noResultText}</p>
            </div>
          </div>
        ) : activeCategory === "all" ? (
          groupedTools.map((group) => (
            <div className="tool-group" key={group.category}>
              <div className="tool-group-head">
                <h2>{group.label}</h2>
                <span className="tool-count">
                  {group.tools.length}{" "}
                  {language === "hi" ? "टूल" : "Tools"}
                </span>
              </div>

              <div className="tools-grid">
                {group.tools.map((tool) => renderToolCard(tool))}
              </div>
            </div>
          ))
        ) : (
          <div className="tools-grid">
            {filteredTools.map((tool) => renderToolCard(tool))}
          </div>
        )}
      </section>
    </main>
  );
}
