import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Image,
  Video,
  Sparkles,
  ShieldCheck,
  Mail,
  ArrowRight,
  Smile,
  Code2,
  Calculator,
  Search,
  QrCode,
  Lock,
} from "lucide-react";
import "../styles/footer.css";

const SETTINGS_EVENT = "convertwala-settings-change";
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";

const footerText = {
  en: {
    tagline:
      "Create resumes, convert files, compress documents and use powerful free online tools in one clean platform.",
    quickLinks: "Quick Links",
    allTools: "All Tools",
    categories: "Tool Categories",
    popularTools: "Popular Tools",
    trust: "Why Convert Wala",
    legal: "Legal",
    home: "Home",
    about: "About Us",
    tools: "All Tools",
    resume: "Resume Builder",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    image: "Image Tools",
    video: "Video Tools",
    pdf: "PDF Tools",
    seo: "SEO Tools",
    text: "Text Tools",
    emoji: "Emoji Tools",
    developer: "Developer Tools",
    finance: "Finance Tools",
    security: "Security Tools",
    qr: "QR Code Generator",
    youtube: "YouTube Thumbnail Downloader",
    secure: "Fast, simple and user-friendly tools for everyday work.",
    files: "Your files are processed safely in your browser wherever possible.",
    contact: "Contact",
    copyright: "All rights reserved.",
  },

  hi: {
    tagline:
      "रिज़्यूमे बनाएं, फाइलें कन्वर्ट करें, डॉक्यूमेंट compress करें और एक ही साफ-सुथरे प्लेटफॉर्म पर मुफ्त ऑनलाइन टूल इस्तेमाल करें।",
    quickLinks: "क्विक लिंक",
    allTools: "सभी टूल",
    categories: "टूल कैटेगरी",
    popularTools: "लोकप्रिय टूल",
    trust: "Convert Wala क्यों चुनें",
    legal: "कानूनी जानकारी",
    home: "होम",
    about: "हमारे बारे में",
    tools: "सभी टूल",
    resume: "रिज़्यूमे बिल्डर",
    privacy: "प्राइवेसी पॉलिसी",
    terms: "नियम और शर्तें",
    image: "इमेज टूल",
    video: "वीडियो टूल",
    pdf: "पीडीएफ टूल",
    seo: "एसईओ टूल",
    text: "टेक्स्ट टूल",
    emoji: "इमोजी टूल",
    developer: "डेवलपर टूल",
    finance: "फाइनेंस टूल",
    security: "सिक्योरिटी टूल",
    qr: "क्यूआर कोड जनरेटर",
    youtube: "यूट्यूब थंबनेल डाउनलोडर",
    secure: "रोज़मर्रा के काम के लिए तेज़, आसान और यूज़र-फ्रेंडली टूल।",
    files:
      "जहां संभव हो, आपकी फाइलें आपके ब्राउज़र में सुरक्षित तरीके से प्रोसेस होती हैं।",
    contact: "संपर्क",
    copyright: "सभी अधिकार सुरक्षित।",
  },

  hinglish: {
    tagline:
      "Resume banao, files convert karo, documents compress karo aur free online tools ek clean platform par use karo.",
    quickLinks: "Quick Links",
    allTools: "All Tools",
    categories: "Tool Categories",
    popularTools: "Popular Tools",
    trust: "Why Convert Wala",
    legal: "Legal",
    home: "Home",
    about: "About Us",
    tools: "All Tools",
    resume: "Resume Builder",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    image: "Image Tools",
    video: "Video Tools",
    pdf: "PDF Tools",
    seo: "SEO Tools",
    text: "Text Tools",
    emoji: "Emoji Tools",
    developer: "Developer Tools",
    finance: "Finance Tools",
    security: "Security Tools",
    qr: "QR Code Generator",
    youtube: "YouTube Thumbnail Downloader",
    secure: "Daily work ke liye fast, simple aur user-friendly tools.",
    files: "Jahan possible ho, files browser me safely process hoti hain.",
    contact: "Contact",
    copyright: "All rights reserved.",
  },
};

export default function Footer() {
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

  const t = footerText[language] || footerText.en;
  const year = new Date().getFullYear();

  const categories = [
    { label: t.allTools, path: "/tools", icon: Sparkles },
    { label: t.image, path: "/tools/image-tools", icon: Image },
    { label: t.pdf, path: "/tools/pdf-tools", icon: FileText },
    { label: t.video, path: "/tools/video-tools", icon: Video },
    { label: t.seo, path: "/tools/seo-tools", icon: Search },
    { label: t.text, path: "/tools/text-tools", icon: FileText },
    { label: t.emoji, path: "/tools/emoji-tools", icon: Smile },
    { label: t.developer, path: "/tools/developer-tools", icon: Code2 },
    { label: t.finance, path: "/tools/finance-tools", icon: Calculator },
    { label: t.security, path: "/tools/security-tools", icon: Lock },
  ];

  return (
    <footer className={`ath-footer ${theme === "dark" ? "dark" : "light"}`}>
      <div className="ath-footer-glow"></div>

      <div className="ath-footer-inner">
        <div className="ath-footer-brand">
          <Link to="/" className="ath-footer-logo">
            Convert <span>Wala</span>
          </Link>

          <p>{t.tagline}</p>

          <div className="ath-footer-badges">
            <span>
              <ShieldCheck size={16} />
              Free Tools
            </span>
            <span>
              <Sparkles size={16} />
              Smart Platform
            </span>
          </div>
        </div>

        <div className="ath-footer-col">
          <h3>{t.quickLinks}</h3>

          <Link to="/">
            {t.home}
            <ArrowRight size={14} />
          </Link>

          <Link to="/about-us">
            {t.about}
            <ArrowRight size={14} />
          </Link>

          <Link to="/tools">
            {t.tools}
            <ArrowRight size={14} />
          </Link>

          <Link to="/resume-builder/templates">
            {t.resume}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="ath-footer-col ath-footer-category-col">
          <h3>{t.categories}</h3>

          <div className="ath-footer-category-grid">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <Link to={item.path} key={item.path}>
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="ath-footer-col">
          <h3>{t.popularTools}</h3>

          <Link to="/image-converter">
            <Image size={15} />
            {t.image}
          </Link>

          <Link to="/youtube-thumbnail-downloader">
            <Video size={15} />
            {t.youtube}
          </Link>

          <Link to="/qr-code-generator">
            <QrCode size={15} />
            {t.qr}
          </Link>

          <Link to="/pdf-compressor">
            <FileText size={15} />
            {t.pdf}
          </Link>
        </div>

        <div className="ath-footer-col ath-footer-trust">
          <h3>{t.trust}</h3>

          <p>{t.secure}</p>
          <p>{t.files}</p>

          <a href="mailto:support@convertwala.com">
            <Mail size={15} />
            support@convertwala.com
          </a>
        </div>
      </div>

      <div className="ath-footer-bottom">
        <p>
          © {year} <strong>Convert Wala</strong>. {t.copyright}
        </p>

        <div>
          <Link to="/privacy-policy">{t.privacy}</Link>
          <span></span>
          <Link to="/terms-and-conditions">{t.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
