import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { tools } from "../data/toolsData";
import "../styles/tools.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const categoryMap = {
  "image-tools": {
    key: "image",
    title: { en: "Image Tools", hi: "इमेज टूल", hinglish: "Image Tools" },
  },
  "pdf-tools": {
    key: "pdf",
    title: { en: "PDF Tools", hi: "पीडीएफ टूल", hinglish: "PDF Tools" },
  },
  "video-tools": {
    key: "video",
    title: { en: "Video Tools", hi: "वीडियो टूल", hinglish: "Video Tools" },
  },
  "ai-tools": {
    key: "ai",
    title: { en: "AI Tools", hi: "एआई टूल", hinglish: "AI Tools" },
  },
  "seo-tools": {
    key: "seo",
    title: { en: "SEO Tools", hi: "एसईओ टूल", hinglish: "SEO Tools" },
  },
  "finance-tools": {
    key: "finance",
    title: { en: "Finance Tools", hi: "फाइनेंस टूल", hinglish: "Finance Tools" },
  },
  "text-tools": {
    key: "text",
    title: { en: "Text Tools", hi: "टेक्स्ट टूल", hinglish: "Text Tools" },
  },
  "emoji-tools": {
    key: "emoji",
    title: { en: "Emoji Tools", hi: "इमोजी टूल", hinglish: "Emoji Tools" },
  },
  "generator-tools": {
    key: "generator",
    title: { en: "Generator Tools", hi: "जनरेटर टूल", hinglish: "Generator Tools" },
  },
  "daily-tools": {
    key: "daily",
    title: { en: "Daily Tools", hi: "दैनिक टूल", hinglish: "Daily Tools" },
  },
  "business-tools": {
    key: "business",
    title: { en: "Business Tools", hi: "बिज़नेस टूल", hinglish: "Business Tools" },
  },
  "education-tools": {
    key: "education",
    title: { en: "Education Tools", hi: "शिक्षा टूल", hinglish: "Education Tools" },
  },
  "security-tools": {
    key: "security",
    title: { en: "Security Tools", hi: "सिक्योरिटी टूल", hinglish: "Security Tools" },
  },
  "developer-tools": {
    key: "developer",
    title: { en: "Developer Tools", hi: "डेवलपर टूल", hinglish: "Developer Tools" },
  },
  "resume-tools": {
    key: "resume",
    title: { en: "Resume Tools", hi: "रिज़्यूमे टूल", hinglish: "Resume Tools" },
  },
};

const pageText = {
  en: {
    eyebrow: "Convert Wala",
    tools: "Tools",
    open: "Open Tool",
    live: "Live",
    noTools: "No tools found",
    noToolsText: "This category does not have tools yet.",
    description: (title) =>
      `Use free ${title.toLowerCase()} on Convert Wala. Fast, simple and browser-based online tools.`,
    seoTitle: (title) => `${title} Online Free | Convert Wala`,
  },
  hi: {
    eyebrow: "Convert Wala",
    tools: "टूल",
    open: "टूल खोलें",
    live: "उपलब्ध",
    noTools: "कोई टूल नहीं मिला",
    noToolsText: "इस कैटेगरी में अभी कोई टूल उपलब्ध नहीं है।",
    description: (title) =>
      `Convert Wala पर मुफ्त ${title} इस्तेमाल करें। ये तेज़, आसान और ब्राउज़र-आधारित ऑनलाइन टूल हैं।`,
    seoTitle: (title) => `${title} ऑनलाइन मुफ्त | Convert Wala`,
  },
  hinglish: {
    eyebrow: "Convert Wala",
    tools: "Tools",
    open: "Open Tool",
    live: "Live",
    noTools: "Koi tool nahi mila",
    noToolsText: "Is category me abhi tools available nahi hain.",
    description: (title) =>
      `Convert Wala par free ${title.toLowerCase()} use karo. Fast, simple aur browser-based online tools.`,
    seoTitle: (title) => `${title} Online Free | Convert Wala`,
  },
};

export default function ToolsCategoryPage() {
  const { categorySlug } = useParams();

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

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

  const currentCategory = categoryMap[categorySlug] || categoryMap["image-tools"];
  const t = pageText[language] || pageText.en;

  const categoryTitle =
    currentCategory.title?.[language] || currentCategory.title?.en || "Tools";

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => tool.category === currentCategory.key);
  }, [currentCategory.key]);

  const canonicalUrl = `https://www.convertwala.com/tools/${categorySlug}`;
  const seoTitle = t.seoTitle(categoryTitle);
  const seoDescription = t.description(categoryTitle);

  return (
    <main className={`tools-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="keywords"
          content={`${categoryTitle}, free online tools, Convert Wala, online tools`}
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <meta
          name="theme-color"
          content={theme === "dark" ? "#020617" : "#2563eb"}
        />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Convert Wala" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: seoTitle,
            description: seoDescription,
            url: canonicalUrl,
            isPartOf: {
              "@type": "WebSite",
              name: "Convert Wala",
              url: "https://www.convertwala.com/",
            },
            mainEntity: filteredTools.map((tool) => ({
              "@type": "WebApplication",
              name: tool.title,
              url: `https://www.convertwala.com${tool.path}`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              description: tool.desc?.[language] || tool.desc?.en || "",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            })),
          })}
        </script>
      </Helmet>

      <section className="tools-hero">
        <p className="rb-eyebrow">{t.eyebrow}</p>
        <h1>{categoryTitle}</h1>
        <p>{seoDescription}</p>
      </section>

      <section className="tools-grid-wrap">
        <div className="tool-group-head">
          <h2>{categoryTitle}</h2>
          <span className="tool-count">
            {filteredTools.length} {t.tools}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="no-tools">
            <div>
              <Search />
              <h3>{t.noTools}</h3>
              <p>{t.noToolsText}</p>
            </div>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const desc = tool.desc?.[language] || tool.desc?.en || "";

              return (
                <Link to={tool.path} className="tool-card" key={tool.title}>
                  <div className="tool-top">
                    <div className="tool-icon">
                      <Icon />
                    </div>

                    <span className="tool-status">{tool.status || t.live}</span>
                  </div>

                  <h3>{tool.title}</h3>
                  <p>{desc}</p>

                  <div className="tool-bottom">
                    <span className="tool-category">{categoryTitle}</span>
                    <strong className="tool-open">{t.open}</strong>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}