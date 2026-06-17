import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, Crown, Layers, CheckCircle } from "lucide-react";
import { templates } from "../data/templates";
import "../styles/templates.css";

const SETTINGS_EVENT = "convertwala-settings-change";
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";

const filters = [
  { label: { en: "Basic", hi: "बेसिक", hinglish: "Basic" }, value: "basic" },
  { label: { en: "Standard", hi: "स्टैंडर्ड", hinglish: "Standard" }, value: "standard" },
  { label: { en: "Premium", hi: "प्रीमियम", hinglish: "Premium" }, value: "premium" },
];

const pageText = {
  en: {
    seoTitle: "Resume Templates - Free ATS Friendly Resume Builder | Convert Wala",
    seoDescription:
      "Choose free ATS friendly resume templates from basic, standard and premium categories. Preview templates and create a professional resume online with Convert Wala.",
    seoKeywords:
      "resume templates, ATS resume templates, free resume builder, professional resume templates, online resume builder, CV templates, Convert Wala resume builder",
    eyebrow: "Choose Template",
    title: "Pick your resume template",
    subtitle:
      "Select a clean, ATS friendly resume template and start building your professional resume instantly.",
    basic: "Basic",
    standard: "Standard",
    premium: "Premium",
    templates: "Templates",
    available: "Available Templates",
    activeCategory: "Selected Category",
    preview: "Preview Template",
    templateNo: "Template",
    clickText: "Click any template to view full preview and continue editing.",
    empty: "No templates found in this category.",
  },

  hi: {
    seoTitle: "रिज़्यूमे टेम्पलेट्स - मुफ्त ATS फ्रेंडली रिज़्यूमे बिल्डर | Convert Wala",
    seoDescription:
      "Convert Wala पर बेसिक, स्टैंडर्ड और प्रीमियम श्रेणियों में मुफ्त ATS फ्रेंडली रिज़्यूमे टेम्पलेट चुनें और ऑनलाइन प्रोफेशनल रिज़्यूमे बनाएं।",
    seoKeywords:
      "रिज्यूमे टेम्पलेट, ATS रिज्यूमे, मुफ्त रिज्यूमे बिल्डर, प्रोफेशनल रिज्यूमे टेम्पलेट, ऑनलाइन रिज्यूमे बिल्डर, CV टेम्पलेट",
    eyebrow: "टेम्पलेट चुनें",
    title: "अपना रिज़्यूमे टेम्पलेट चुनें",
    subtitle:
      "एक साफ़, ATS फ्रेंडली रिज़्यूमे टेम्पलेट चुनें और तुरंत अपना प्रोफेशनल रिज़्यूमे बनाना शुरू करें।",
    basic: "बेसिक",
    standard: "स्टैंडर्ड",
    premium: "प्रीमियम",
    templates: "टेम्पलेट",
    available: "उपलब्ध टेम्पलेट",
    activeCategory: "चुनी गई श्रेणी",
    preview: "टेम्पलेट देखें",
    templateNo: "टेम्पलेट",
    clickText: "पूरी preview देखने और edit शुरू करने के लिए किसी भी template पर क्लिक करें।",
    empty: "इस श्रेणी में कोई टेम्पलेट नहीं मिला।",
  },

  hinglish: {
    seoTitle: "Resume Templates - Free ATS Friendly Resume Builder | Convert Wala",
    seoDescription:
      "Convert Wala par basic, standard aur premium categories me ATS friendly resume templates choose karo aur professional resume online banao.",
    seoKeywords:
      "resume templates, ATS resume templates, free resume builder, professional resume templates, online resume builder, CV templates",
    eyebrow: "Choose Template",
    title: "Apna resume template choose karo",
    subtitle:
      "Clean ATS friendly resume template choose karo aur instantly professional resume banana start karo.",
    basic: "Basic",
    standard: "Standard",
    premium: "Premium",
    templates: "Templates",
    available: "Available Templates",
    activeCategory: "Selected Category",
    preview: "Preview Template",
    templateNo: "Template",
    clickText: "Full preview dekhne aur editing start karne ke liye kisi bhi template par click karo.",
    empty: "Is category me koi template nahi mila.",
  },
};

export default function Templates() {
  const [active, setActive] = useState("basic");
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

  const t = pageText[language] || pageText.en;

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => template.category === active);
  }, [active]);

  const schemaData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t.seoTitle,
      description: t.seoDescription,
      url: "https://www.convertwala.com/resume-builder/templates",
      isPartOf: {
        "@type": "WebSite",
        name: "Convert Wala",
        url: "https://www.convertwala.com/",
      },
      about: "Resume templates and online resume builder",
    }),
    [t.seoTitle, t.seoDescription]
  );

  return (
    <main className={`rb-templates-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        <meta name="keywords" content={t.seoKeywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/resume-builder/templates"
        />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.convertwala.com/resume-builder/templates"
        />
        <meta property="og:site_name" content="Convert Wala" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <section className="rt-hero">
        <div className="rt-hero-content">
          <p className="rt-eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="rt-hero-stats">
          <div>
            <FileText />
            <span>{t.available}</span>
            <strong>{templates.length}</strong>
          </div>

          <div>
            <Layers />
            <span>{t.activeCategory}</span>
            <strong>{t[active]}</strong>
          </div>

          <div>
            <Crown />
            <span>{t.templates}</span>
            <strong>{filteredTemplates.length}</strong>
          </div>
        </div>
      </section>

      <section className="rt-template-section">
        <div className="rt-section-top">
          <div>
            <p className="rt-eyebrow">{t.templates}</p>
            <h2>{t[active]} {t.templates}</h2>
            <p>{t.clickText}</p>
          </div>

          <div className="rt-filter-tabs">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setActive(filter.value)}
                className={active === filter.value ? "active" : ""}
              >
                {filter.label[language] || filter.label.en}
              </button>
            ))}
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="rt-empty">
            <FileText />
            <h3>{t.empty}</h3>
          </div>
        ) : (
          <div className="rt-template-grid">
            {filteredTemplates.map((template) => (
              <Link
                to={`/resume-builder/template/${template.id}`}
                className="rt-template-card"
                key={template.id}
              >
                <div
                  className={`rt-template-preview ${template.layout}`}
                  style={{ "--accent": template.accent }}
                >
                  <div className="preview-top">
                    <div className="preview-avatar"></div>
                    <div>
                      <div className="preview-line large"></div>
                      <div className="preview-line small"></div>
                    </div>
                  </div>

                  <div className="preview-section"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>

                  <div className="preview-section"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line"></div>

                  <div className="preview-bottom-grid">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>

                <div className="rt-template-info">
                  <div className="rt-template-meta">
                    <span>{template.badge}</span>
                    <small>
                      <CheckCircle size={14} />
                      ATS
                    </small>
                  </div>

                  <h3>{template.name}</h3>
                  <p>
                    {t.templateNo} #{template.number}
                  </p>

                  <strong>{t.preview}</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}