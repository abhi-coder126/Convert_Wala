import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Image,
  Video,
  Sparkles,
  ShieldCheck,
  Calculator,
  Code2,
  Smile,
  Search,
  QrCode,
  Lock,
  ArrowRight,
  Zap,
} from "lucide-react";
import "../styles/home.css";

const SETTINGS_EVENT = "convertwala-settings-change";
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";

const homeText = {
  en: {
    seoTitle:
      "Convert Wala - Free Online Tools for PDF, Images, Videos, SEO, Text & Finance",
    seoDescription:
      "Use Convert Wala free online tools for PDF, images, videos, SEO, text, emojis, developers, finance, resume building and daily work.",
    seoKeywords:
      "free online tools, Convert Wala, PDF tools, image tools, video tools, SEO tools, text tools, emoji picker, developer tools, GST calculator, resume builder",
    eyebrow: "Free Online Tools Platform",
    titleBefore: "Simple tools for",
    titleHighlight: "everyday work",
    heroText:
      "Convert files, edit images, manage PDFs, generate schemas, calculate finance values, pick emojis and create professional resumes from one clean platform.",
    explore: "Explore All Tools",
    resume: "Start Resume Builder",
    popular: "Popular Categories",
    sectionTitle: "Everything useful in one place",
    whyTitle: "Why use Convert Wala?",
    ctaTitle: "Ready to use free tools?",
    ctaText:
      "Choose any category and start working instantly. Fast, simple and browser-friendly experience.",
    start: "Start Now",
    tools: "Tools",
  },
  hi: {
    seoTitle:
      "Convert Wala - PDF, इमेज, वीडियो, SEO, टेक्स्ट और फाइनेंस के लिए मुफ्त ऑनलाइन टूल",
    seoDescription:
      "Convert Wala पर PDF, इमेज, वीडियो, SEO, टेक्स्ट, इमोजी, डेवलपर, फाइनेंस, रिज़्यूमे और दैनिक काम के लिए मुफ्त ऑनलाइन टूल इस्तेमाल करें।",
    seoKeywords:
      "मुफ्त ऑनलाइन टूल, Convert Wala, पीडीएफ टूल, इमेज टूल, वीडियो टूल, एसईओ टूल, टेक्स्ट टूल, इमोजी पिकर, डेवलपर टूल, जीएसटी कैलकुलेटर, रिज़्यूमे बिल्डर",
    eyebrow: "मुफ्त ऑनलाइन टूल प्लेटफ़ॉर्म",
    titleBefore: "हर रोज़ के काम के लिए",
    titleHighlight: "आसान टूल",
    heroText:
      "फाइलें कन्वर्ट करें, इमेज एडिट करें, PDF मैनेज करें, SEO schema बनाएं, फाइनेंस कैलकुलेशन करें, इमोजी कॉपी करें और प्रोफेशनल रिज़्यूमे बनाएं।",
    explore: "सभी टूल देखें",
    resume: "रिज़्यूमे बिल्डर शुरू करें",
    popular: "लोकप्रिय कैटेगरी",
    sectionTitle: "सभी जरूरी टूल एक जगह",
    whyTitle: "Convert Wala क्यों इस्तेमाल करें?",
    ctaTitle: "मुफ्त टूल इस्तेमाल करने के लिए तैयार हैं?",
    ctaText:
      "कोई भी कैटेगरी चुनें और तुरंत काम शुरू करें। तेज़, आसान और ब्राउज़र-फ्रेंडली अनुभव।",
    start: "अभी शुरू करें",
    tools: "टूल",
  },
  hinglish: {
    seoTitle:
      "Convert Wala - Free Online Tools for PDF, Images, Videos, SEO, Text & Finance",
    seoDescription:
      "Convert Wala par PDF, image, video, SEO, text, emoji, developer, finance, resume aur daily work ke free online tools use karo.",
    seoKeywords:
      "free online tools, Convert Wala, PDF tools, image tools, video tools, SEO tools, text tools, emoji picker, developer tools, GST calculator, resume builder",
    eyebrow: "Free Online Tools Platform",
    titleBefore: "Daily work ke liye",
    titleHighlight: "simple tools",
    heroText:
      "Files convert karo, images edit karo, PDFs manage karo, SEO schema banao, finance calculate karo, emojis copy karo aur professional resume banao.",
    explore: "Explore All Tools",
    resume: "Start Resume Builder",
    popular: "Popular Categories",
    sectionTitle: "Everything useful in one place",
    whyTitle: "Why use Convert Wala?",
    ctaTitle: "Free tools use karne ke liye ready?",
    ctaText:
      "Koi bhi category choose karo aur instantly work start karo. Fast, simple aur browser-friendly experience.",
    start: "Start Now",
    tools: "Tools",
  },
};

const categoryData = {
  en: [
    ["Image Tools", "/tools/image-tools", Image, "Convert, crop, resize and edit images."],
    ["PDF Tools", "/tools/pdf-tools", FileText, "Merge, split, compress and edit PDFs."],
    ["Video Tools", "/tools/video-tools", Video, "Compress, trim and convert videos."],
    ["SEO Tools", "/tools/seo-tools", Search, "Generate sitemap, robots and schema."],
    ["Text Tools", "/tools/text-tools", FileText, "Count, compare and format text."],
    ["Emoji Tools", "/tools/emoji-tools", Smile, "Pick and copy emojis instantly."],
    ["Generator Tools", "/tools/generator-tools", QrCode, "Generate QR codes and useful assets."],
    ["Developer Tools", "/tools/developer-tools", Code2, "JSON, XML, JWT and URL utilities."],
    ["Finance Tools", "/tools/finance-tools", Calculator, "GST, EMI, salary and currency tools."],
    ["Security Tools", "/tools/security-tools", Lock, "Passwords, UUIDs and safety tools."],
  ],
  hi: [
    ["इमेज टूल", "/tools/image-tools", Image, "इमेज कन्वर्ट, crop, resize और edit करें।"],
    ["पीडीएफ टूल", "/tools/pdf-tools", FileText, "PDF merge, split, compress और edit करें।"],
    ["वीडियो टूल", "/tools/video-tools", Video, "वीडियो compress, trim और convert करें।"],
    ["एसईओ टूल", "/tools/seo-tools", Search, "Sitemap, robots और schema बनाएं।"],
    ["टेक्स्ट टूल", "/tools/text-tools", FileText, "Text count, compare और format करें।"],
    ["इमोजी टूल", "/tools/emoji-tools", Smile, "Emojis खोजें और तुरंत copy करें।"],
    ["जनरेटर टूल", "/tools/generator-tools", QrCode, "QR code और useful assets generate करें।"],
    ["डेवलपर टूल", "/tools/developer-tools", Code2, "JSON, XML, JWT और URL utilities।"],
    ["फाइनेंस टूल", "/tools/finance-tools", Calculator, "GST, EMI, salary और currency tools।"],
    ["सिक्योरिटी टूल", "/tools/security-tools", Lock, "Password, UUID और safety tools।"],
  ],
  hinglish: [
    ["Image Tools", "/tools/image-tools", Image, "Images convert, crop, resize aur edit karo."],
    ["PDF Tools", "/tools/pdf-tools", FileText, "PDF merge, split, compress aur edit karo."],
    ["Video Tools", "/tools/video-tools", Video, "Videos compress, trim aur convert karo."],
    ["SEO Tools", "/tools/seo-tools", Search, "Sitemap, robots aur schema banao."],
    ["Text Tools", "/tools/text-tools", FileText, "Text count, compare aur format karo."],
    ["Emoji Tools", "/tools/emoji-tools", Smile, "Emojis search aur instantly copy karo."],
    ["Generator Tools", "/tools/generator-tools", QrCode, "QR code aur useful assets generate karo."],
    ["Developer Tools", "/tools/developer-tools", Code2, "JSON, XML, JWT aur URL utilities."],
    ["Finance Tools", "/tools/finance-tools", Calculator, "GST, EMI, salary aur currency tools."],
    ["Security Tools", "/tools/security-tools", Lock, "Password, UUID aur safety tools."],
  ],
};

export default function Home() {
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

  const t = homeText[language] || homeText.en;
  const categories = categoryData[language] || categoryData.en;

  const schemaData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Convert Wala",
      url: "https://www.convertwala.com/",
      description: t.seoDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.convertwala.com/tools?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
    [t.seoDescription]
  );

  return (
    <main className={`ath-home-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        <meta name="keywords" content={t.seoKeywords} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <link rel="canonical" href="https://www.convertwala.com/" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <section className="rb-hero">
        <div className="rb-hero-content">
          <p className="rb-eyebrow">{t.eyebrow}</p>

          <h1>
            {t.titleBefore} <span>{t.titleHighlight}</span>
          </h1>

          <p className="rb-hero-text">{t.heroText}</p>

          <div className="rb-hero-actions">
            <Link to="/tools" className="rb-primary-btn">
              {t.explore}
              <ArrowRight size={18} />
            </Link>

            <Link to="/resume-builder/templates" className="rb-secondary-btn">
              {t.resume}
            </Link>
          </div>
        </div>

        <div className="rb-hero-card">
          <div className="art-home-tool-grid">
            {categories.slice(0, 4).map(([title, path, Icon]) => (
              <Link to={path} className="art-home-mini-card" key={path}>
                <Icon />
                <h3>{title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-features">
        <div className="rb-section-head">
          <p className="rb-eyebrow">{t.popular}</p>
          <h2>{t.sectionTitle}</h2>
        </div>

        <div className="rb-feature-grid">
          {categories.map(([title, path, Icon, text]) => (
            <Link to={path} className="rb-feature-card" key={path}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
              <strong>
                {t.start} <ArrowRight size={15} />
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="rb-why">
        <div className="rb-section-head">
          <p className="rb-eyebrow">Convert Wala</p>
          <h2>{t.whyTitle}</h2>
        </div>

        <div className="rb-why-grid">
          <div>
            <Zap />
            <h3>Fast</h3>
          </div>
          <div>
            <ShieldCheck />
            <h3>Browser Friendly</h3>
          </div>
          <div>
            <Sparkles />
            <h3>Clean UI</h3>
          </div>
        </div>
      </section>

      <section className="rb-home-cta">
        <div>
          <p className="rb-eyebrow">{t.start}</p>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
        </div>

        <Link to="/tools" className="rb-primary-btn">
          {t.explore}
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}