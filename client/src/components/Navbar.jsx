import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Languages, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import logo from "/Tab-logo.png";
import "../styles/navbar.css";

const SETTINGS_EVENT = "convertwala-settings-change";
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";

const toolCategories = {
  en: [
    { label: "All Tools", path: "/tools" },
    { label: "Image Tools", path: "/tools/image-tools" },
    { label: "PDF Tools", path: "/tools/pdf-tools" },
    { label: "Video Tools", path: "/tools/video-tools" },
    { label: "AI Tools", path: "/tools/ai-tools" },
    { label: "SEO Tools", path: "/tools/seo-tools" },
    { label: "Finance Tools", path: "/tools/finance-tools" },
    { label: "Text Tools", path: "/tools/text-tools" },
    { label: "Emoji Tools", path: "/tools/emoji-tools" },
    { label: "Generator Tools", path: "/tools/generator-tools" },
    { label: "Daily Tools", path: "/tools/daily-tools" },
    { label: "Business Tools", path: "/tools/business-tools" },
    { label: "Education Tools", path: "/tools/education-tools" },
    { label: "Security Tools", path: "/tools/security-tools" },
    { label: "Developer Tools", path: "/tools/developer-tools" },
    { label: "Resume Tools", path: "/tools/resume-tools" },
  ],
  hi: [
    { label: "सभी टूल", path: "/tools" },
    { label: "इमेज टूल", path: "/tools/image-tools" },
    { label: "पीडीएफ टूल", path: "/tools/pdf-tools" },
    { label: "वीडियो टूल", path: "/tools/video-tools" },
    { label: "एआई टूल", path: "/tools/ai-tools" },
    { label: "एसईओ टूल", path: "/tools/seo-tools" },
    { label: "फाइनेंस टूल", path: "/tools/finance-tools" },
    { label: "टेक्स्ट टूल", path: "/tools/text-tools" },
    { label: "इमोजी टूल", path: "/tools/emoji-tools" },
    { label: "जनरेटर टूल", path: "/tools/generator-tools" },
    { label: "दैनिक टूल", path: "/tools/daily-tools" },
    { label: "बिज़नेस टूल", path: "/tools/business-tools" },
    { label: "शिक्षा टूल", path: "/tools/education-tools" },
    { label: "सिक्योरिटी टूल", path: "/tools/security-tools" },
    { label: "डेवलपर टूल", path: "/tools/developer-tools" },
    { label: "रिज़्यूमे टूल", path: "/tools/resume-tools" },
  ],
  hinglish: [
    { label: "All Tools", path: "/tools" },
    { label: "Image Tools", path: "/tools/image-tools" },
    { label: "PDF Tools", path: "/tools/pdf-tools" },
    { label: "Video Tools", path: "/tools/video-tools" },
    { label: "AI Tools", path: "/tools/ai-tools" },
    { label: "SEO Tools", path: "/tools/seo-tools" },
    { label: "Finance Tools", path: "/tools/finance-tools" },
    { label: "Text Tools", path: "/tools/text-tools" },
    { label: "Emoji Tools", path: "/tools/emoji-tools" },
    { label: "Generator Tools", path: "/tools/generator-tools" },
    { label: "Daily Tools", path: "/tools/daily-tools" },
    { label: "Business Tools", path: "/tools/business-tools" },
    { label: "Education Tools", path: "/tools/education-tools" },
    { label: "Security Tools", path: "/tools/security-tools" },
    { label: "Developer Tools", path: "/tools/developer-tools" },
    { label: "Resume Tools", path: "/tools/resume-tools" },
  ],
};

const navText = {
  en: {
    home: "Home",
    about: "About Us",
    tools: "Tools",
    resume: "Resume Builder",
    light: "",
    dark: "",
  },
  hi: {
    home: "होम",
    about: "हमारे बारे में",
    tools: "टूल",
    resume: "रिज़्यूमे बिल्डर",
    light: "",
    dark: "",
  },
  hinglish: {
    home: "Home",
    about: "About Us",
    tools: "Tools",
    resume: "Resume Builder",
    light: "",
    dark: "",
  },
};

export default function Navbar() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const t = navText[language] || navText.en;
  const categories = toolCategories[language] || toolCategories.en;

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    const closeOnResize = () => {
      if (window.innerWidth > 920) {
        setMenuOpen(false);
        setToolsOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", closeOnResize);
    };
  }, [menuOpen]);

  const updateLanguage = (value) => {
    setLanguage(value);
    localStorage.setItem(STORAGE_LANGUAGE, value);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
  };

  const updateTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_THEME, nextTheme);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setToolsOpen(false);
  };

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className={`ath-navbar ${theme === "dark" ? "dark" : "light"}`}>
      <div className="ath-navbar-inner">
        <Link to="/" className="ath-logo" onClick={closeMenu}>
          <span className="ath-logo-img-wrap">
            <img src={logo} alt="Convert Wala Logo" />
          </span>

          <span className="ath-logo-text">
            <span className="ath-logo-main">Convert</span>
            <span className="ath-logo-accent">Wala</span>
          </span>
        </Link>

        <button
          type="button"
          className="ath-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div
          className={`ath-mobile-backdrop ${menuOpen ? "show" : ""}`}
          onClick={closeMenu}
        />

        <div className={`ath-nav-right ${menuOpen ? "open" : ""}`}>
          <div className="ath-nav-links">
            <NavLink to="/" className={navClass} onClick={closeMenu} end>
              {t.home}
            </NavLink>

            <div className={`ath-tools-dropdown ${toolsOpen ? "open" : ""}`}>
              <button
                type="button"
                className="ath-tools-toggle"
                onClick={() => setToolsOpen((prev) => !prev)}
              >
                {t.tools}
                <ChevronDown size={16} />
              </button>

              <div className="ath-tools-menu">
                {categories.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    end={item.path === "/tools"}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/about-us" className={navClass} onClick={closeMenu}>
              {t.about}
            </NavLink>

            <NavLink
              to="/resume-builder/templates"
              className={navClass}
              onClick={closeMenu}
            >
              {t.resume}
            </NavLink>
          </div>

          <div className="ath-nav-settings">
            <label className="ath-lang-box">
              <Languages size={16} />
              <select
                value={language}
                onChange={(e) => updateLanguage(e.target.value)}
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </label>

            <button
              type="button"
              className="ath-theme-btn"
              onClick={updateTheme}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              <span>{theme === "dark" ? t.light : t.dark}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
