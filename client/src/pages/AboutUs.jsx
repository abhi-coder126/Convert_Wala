import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Image,
  LockKeyhole,
  MonitorSmartphone,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "About Us | Convert Wala - Free Online Tools Platform",
    seoDescription:
      "Learn about Convert Wala, a free online tools platform founded by Abhishek Singh to provide simple, fast and useful tools for images, PDFs, SEO, finance, education and daily needs.",
    seoKeywords:
      "about Convert Wala, Convert Wala founder, Abhishek Singh, free online tools, PDF tools, image tools, SEO tools, finance tools",

    eyebrow: "About Convert Wala",
    title: "Simple, Fast & Free Online Tools for Everyone",
    subtitle:
      "Convert Wala is built to help users complete daily digital tasks quickly without complicated software, paid barriers or unnecessary steps.",
    founderLabel: "Founded by",
    founderName: "Abhishek Singh",

    missionTitle: "Our Mission",
    missionText:
      "Our mission is to make useful online tools accessible for students, creators, professionals, businesses and everyday users in one clean platform.",

    visionTitle: "Our Vision",
    visionText:
      "We want Convert Wala to become a trusted hub where users can find reliable tools for documents, media, SEO, calculations, education and productivity.",

    whatTitle: "What We Provide",
    whatSubtitle:
      "A growing collection of practical tools designed for real daily use.",

    whyTitle: "Why Choose Convert Wala?",
    whySubtitle:
      "Every tool is designed with speed, simplicity, privacy and mobile responsiveness in mind.",

    valuesTitle: "Our Core Values",
    ctaTitle: "Explore Free Tools",
    ctaText:
      "Start using Convert Wala tools for documents, images, videos, SEO, finance and more.",
    ctaBtn: "View All Tools",

    stats1: "Growing Library",
    stats2: "Free Access",
    stats3: "Mobile Ready",
    stats4: "Fast Tools",
  },

  hi: {
    seoTitle: "About Us | Convert Wala - Free Online Tools Platform",
    seoDescription:
      "Convert Wala के बारे में जानें, जिसे Abhishek Singh ने images, PDFs, SEO, finance, education और daily needs के लिए simple, fast और useful tools provide करने के लिए बनाया है।",
    seoKeywords:
      "about Convert Wala, Convert Wala founder, Abhishek Singh, free online tools, PDF tools, image tools, SEO tools, finance tools",

    eyebrow: "Convert Wala के बारे में",
    title: "हर किसी के लिए Simple, Fast और Free Online Tools",
    subtitle:
      "Convert Wala daily digital tasks को जल्दी पूरा करने के लिए बनाया गया है, बिना complicated software, paid barriers या extra steps के।",
    founderLabel: "Founder",
    founderName: "Abhishek Singh",

    missionTitle: "हमारा Mission",
    missionText:
      "हमारा mission students, creators, professionals, businesses और daily users के लिए useful online tools को एक clean platform पर accessible बनाना है।",

    visionTitle: "हमारा Vision",
    visionText:
      "हम Convert Wala को एक trusted hub बनाना चाहते हैं जहां users documents, media, SEO, calculations, education और productivity tools आसानी से पा सकें।",

    whatTitle: "हम क्या Provide करते हैं",
    whatSubtitle:
      "Real daily use के लिए practical tools की growing collection.",

    whyTitle: "Convert Wala क्यों चुनें?",
    whySubtitle:
      "हर tool speed, simplicity, privacy और mobile responsiveness को ध्यान में रखकर design किया गया है।",

    valuesTitle: "हमारी Core Values",
    ctaTitle: "Free Tools Explore करें",
    ctaText:
      "Documents, images, videos, SEO, finance और more tools के लिए Convert Wala use करें।",
    ctaBtn: "All Tools देखें",

    stats1: "Growing Library",
    stats2: "Free Access",
    stats3: "Mobile Ready",
    stats4: "Fast Tools",
  },

  hinglish: {
    seoTitle: "About Us | Convert Wala - Free Online Tools Platform",
    seoDescription:
      "Convert Wala ke baare me janiye, jise Abhishek Singh ne images, PDFs, SEO, finance, education aur daily needs ke liye simple, fast aur useful tools provide karne ke liye banaya hai.",
    seoKeywords:
      "about Convert Wala, Convert Wala founder, Abhishek Singh, free online tools, PDF tools, image tools, SEO tools, finance tools",

    eyebrow: "About Convert Wala",
    title: "Simple, Fast aur Free Online Tools Sabke Liye",
    subtitle:
      "Convert Wala daily digital tasks ko quickly complete karne ke liye built hai, bina complicated software, paid barriers ya extra steps ke.",
    founderLabel: "Founded by",
    founderName: "Abhishek Singh",

    missionTitle: "Our Mission",
    missionText:
      "Hamari mission students, creators, professionals, businesses aur daily users ke liye useful online tools ko ek clean platform par accessible banana hai.",

    visionTitle: "Our Vision",
    visionText:
      "Hum Convert Wala ko ek trusted hub banana chahte hain jahan users documents, media, SEO, calculations, education aur productivity tools easily use kar saken.",

    whatTitle: "What We Provide",
    whatSubtitle:
      "Real daily use ke liye practical tools ki growing collection.",

    whyTitle: "Why Choose Convert Wala?",
    whySubtitle:
      "Har tool speed, simplicity, privacy aur mobile responsiveness ko dhyan me rakhkar design kiya gaya hai.",

    valuesTitle: "Our Core Values",
    ctaTitle: "Explore Free Tools",
    ctaText:
      "Documents, images, videos, SEO, finance aur more tools ke liye Convert Wala use karo.",
    ctaBtn: "View All Tools",

    stats1: "Growing Library",
    stats2: "Free Access",
    stats3: "Mobile Ready",
    stats4: "Fast Tools",
  },
};

export default function AboutUs() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/about-us";

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
    const nodes = document.querySelectorAll(".about-reveal");

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: <Wrench />, value: "100+", label: t.stats1 },
    { icon: <Sparkles />, value: "Free", label: t.stats2 },
    { icon: <MonitorSmartphone />, value: "100%", label: t.stats3 },
    { icon: <Zap />, value: "Fast", label: t.stats4 },
  ];

  const toolCards = [
    {
      icon: <Image />,
      title: "Image Tools",
      text: "Convert, resize, crop, remove background and create clean media outputs.",
    },
    {
      icon: <FileText />,
      title: "PDF & Document Tools",
      text: "Compress PDFs, convert files, protect documents and generate invoices.",
    },
    {
      icon: <Search />,
      title: "SEO Tools",
      text: "Create robots.txt, sitemap.xml and check important domain details.",
    },
    {
      icon: <Calculator />,
      title: "Finance Calculators",
      text: "Calculate EMI, GST, salary, currency conversion and daily finance needs.",
    },
    {
      icon: <GraduationCap />,
      title: "Education Tools",
      text: "Generate question papers and useful learning resources quickly.",
    },
    {
      icon: <Globe2 />,
      title: "Daily Utility Tools",
      text: "Simple, fast and browser-friendly utilities for everyday digital work.",
    },
  ];

  const features = [
    {
      icon: <Rocket />,
      title: "Fast Performance",
      text: "Pages and tools are designed to load quickly and work smoothly.",
    },
    {
      icon: <ShieldCheck />,
      title: "Privacy Friendly",
      text: "Many tools run directly inside your browser for a safer experience.",
    },
    {
      icon: <HeartHandshake />,
      title: "Easy for Everyone",
      text: "Clean UI and simple steps help beginners use tools without confusion.",
    },
    {
      icon: <LockKeyhole />,
      title: "No Extra Complexity",
      text: "No unnecessary steps, no heavy software and no complicated flow.",
    },
  ];

  const values = [
    "Useful tools for real-life needs",
    "Clean, fast and beginner-friendly design",
    "Mobile-first experience",
    "SEO-friendly and performance-focused pages",
    "Continuous improvement with more tools",
  ];

  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${canonicalUrl}#aboutpage`,
        url: canonicalUrl,
        name: t.seoTitle,
        description: t.seoDescription,
        isPartOf: {
          "@id": "https://www.convertwala.com/#website",
        },
        about: {
          "@id": "https://www.convertwala.com/#organization",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://www.convertwala.com/#website",
        name: "Convert Wala",
        url: "https://www.convertwala.com/",
        publisher: {
          "@id": "https://www.convertwala.com/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.convertwala.com/#organization",
        name: "Convert Wala",
        url: "https://www.convertwala.com/",
        description:
          "Convert Wala is a free online tools platform for images, PDFs, SEO, finance, education and daily digital tasks.",
        founder: {
          "@type": "Person",
          name: "Abhishek Singh",
        },
      },
      {
        "@type": "Person",
        "@id": "https://www.convertwala.com/#founder",
        name: "Abhishek Singh",
        jobTitle: "Founder",
        worksFor: {
          "@id": "https://www.convertwala.com/#organization",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.convertwala.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About Us",
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className={`about-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        <meta name="keywords" content={t.seoKeywords} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="Abhishek Singh" />
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
          {JSON.stringify(aboutSchema)}
        </script>
      </Helmet>

      <style>{`
        .about-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            radial-gradient(circle at 92% 12%, rgba(14, 165, 233, 0.12), transparent 30%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
          overflow-x: hidden;
        }

        .about-page * {
          box-sizing: border-box;
        }

        .about-page.dark {
          background:
            radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            radial-gradient(circle at 92% 12%, rgba(14, 165, 233, 0.18), transparent 30%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .about-reveal {
          opacity: 0;
          transform: translateY(28px) scale(0.98);
          transition:
            opacity 0.75s ease,
            transform 0.75s cubic-bezier(.2,.8,.2,1);
          transition-delay: var(--delay, 0ms);
        }

        .about-reveal.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .about-hero {
          position: relative;
          isolation: isolate;
          padding: 92px 6% 58px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .about-page.dark .about-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .about-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image:
            linear-gradient(rgba(37, 99, 235, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, black, transparent);
          animation: aboutGridMove 18s linear infinite;
        }

        .about-hero::after {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          right: -170px;
          top: -170px;
          z-index: -1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.18), transparent 65%);
          animation: aboutPulse 5s ease-in-out infinite;
        }

        .about-orb {
          position: absolute;
          z-index: -1;
          border-radius: 999px;
          filter: blur(0.2px);
          opacity: 0.72;
          animation: aboutFloat 7s ease-in-out infinite;
        }

        .about-orb.one {
          width: 76px;
          height: 76px;
          left: 7%;
          bottom: 48px;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
        }

        .about-orb.two {
          width: 46px;
          height: 46px;
          left: 46%;
          top: 82px;
          background: linear-gradient(135deg, #22c55e, #14b8a6);
          animation-delay: 1.2s;
        }

        .about-orb.three {
          width: 58px;
          height: 58px;
          right: 18%;
          bottom: 82px;
          background: linear-gradient(135deg, #f97316, #facc15);
          animation-delay: 2s;
        }

        .about-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1120px;
        }

        .about-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
          padding: 9px 13px;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 0.82rem;
          font-weight: 950;
          border: 1px solid #bfdbfe;
        }

        .about-page.dark .about-breadcrumb {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.25);
        }

        .about-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .about-page.dark .about-eyebrow {
          color: #93c5fd;
        }

        .about-hero h1 {
          margin: 0;
          font-size: clamp(2.45rem, 5.5vw, 5.6rem);
          letter-spacing: -0.07em;
          line-height: 0.96;
          max-width: 1020px;
        }

        .about-gradient-text {
          background: linear-gradient(135deg, #2563eb, #0ea5e9, #22c55e);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: aboutGradient 5s ease infinite;
        }

        .about-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.06rem;
          margin: 20px 0 0;
        }

        .about-page.dark .about-hero p {
          color: #cbd5e1;
        }

        .about-hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin-top: 28px;
        }

        .about-primary-btn {
          min-height: 52px;
          padding: 0 22px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #ffffff;
          text-decoration: none;
          font-weight: 950;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          box-shadow: 0 18px 45px rgba(37, 99, 235, 0.28);
          transition: 0.24s ease;
        }

        .about-primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 26px 60px rgba(37, 99, 235, 0.35);
        }

        .about-founder {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 52px;
          padding: 0 17px;
          border-radius: 999px;
          background: #ffffff;
          color: #0f172a;
          font-weight: 950;
          border: 1px solid #dbeafe;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
        }

        .about-founder svg {
          color: #2563eb;
          animation: aboutIconBounce 2.2s ease-in-out infinite;
        }

        .about-page.dark .about-founder {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          border-color: rgba(147, 197, 253, 0.18);
        }

        .about-section {
          padding: 64px 6%;
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .about-stat {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 22px;
          min-height: 150px;
          box-shadow: 0 22px 58px rgba(15, 23, 42, 0.08);
          transition: 0.26s ease;
        }

        .about-page.dark .about-stat,
        .about-card,
        .about-value {
          background: rgba(255, 255, 255, 0.96);
        }

        .about-page.dark .about-stat {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .about-stat:hover,
        .about-card:hover,
        .about-tool-card:hover,
        .about-value:hover {
          transform: translateY(-7px);
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 0 28px 75px rgba(37, 99, 235, 0.14);
        }

        .about-stat::before,
        .about-card::before,
        .about-tool-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: translateX(-120%);
          transition: 0.7s ease;
        }

        .about-page.dark .about-stat::before,
        .about-page.dark .about-card::before,
        .about-page.dark .about-tool-card::before {
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        .about-stat:hover::before,
        .about-card:hover::before,
        .about-tool-card:hover::before {
          transform: translateX(120%);
        }

        .about-stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 15px;
        }

        .about-page.dark .about-stat-icon {
          background: rgba(37, 99, 235, 0.15);
          color: #93c5fd;
        }

        .about-stat h3 {
          margin: 0;
          font-size: 2rem;
          letter-spacing: -0.05em;
        }

        .about-stat p {
          margin: 6px 0 0;
          color: #64748b;
          font-weight: 850;
        }

        .about-page.dark .about-stat p {
          color: #cbd5e1;
        }

        .about-two-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .about-card,
        .about-tool-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
          min-width: 0;
          transition: 0.26s ease;
        }

        .about-page.dark .about-card,
        .about-page.dark .about-tool-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .about-icon {
          width: 60px;
          height: 60px;
          border-radius: 21px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 18px;
          transition: 0.25s ease;
        }

        .about-card:hover .about-icon,
        .about-tool-card:hover .about-icon {
          transform: rotate(-8deg) scale(1.08);
          background: #2563eb;
          color: #ffffff;
        }

        .about-page.dark .about-icon {
          background: rgba(37, 99, 235, 0.15);
          color: #93c5fd;
        }

        .about-icon svg {
          width: 28px;
          height: 28px;
        }

        .about-card h2,
        .about-card h3,
        .about-tool-card h3,
        .about-section-head h2 {
          margin: 0;
          color: inherit;
          letter-spacing: -0.045em;
        }

        .about-card h2 {
          font-size: 1.7rem;
        }

        .about-card h3,
        .about-tool-card h3 {
          font-size: 1.18rem;
        }

        .about-card p,
        .about-tool-card p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.75;
          font-weight: 750;
        }

        .about-page.dark .about-card p,
        .about-page.dark .about-tool-card p,
        .about-page.dark .about-section-head p {
          color: #cbd5e1;
        }

        .about-section-head {
          max-width: 860px;
          margin-bottom: 26px;
        }

        .about-section-head h2 {
          font-size: clamp(1.9rem, 3.3vw, 3.2rem);
        }

        .about-section-head p {
          color: #64748b;
          line-height: 1.75;
          margin: 12px 0 0;
          font-weight: 750;
        }

        .about-tool-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .about-tool-card {
          min-height: 245px;
        }

        .about-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .about-values {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }

        .about-value {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          color: #334155;
          font-weight: 900;
          line-height: 1.5;
          box-shadow: 0 14px 40px rgba(15, 23, 42, 0.06);
          transition: 0.26s ease;
        }

        .about-page.dark .about-value {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
        }

        .about-value svg {
          flex: 0 0 auto;
          color: #2563eb;
          margin-top: 2px;
        }

        .about-page.dark .about-value svg {
          color: #93c5fd;
        }

        .about-founder-panel {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          padding: 34px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 26px;
          align-items: center;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.22), transparent 30%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          box-shadow: 0 28px 80px rgba(37, 99, 235, 0.22);
        }

        .about-founder-panel::before {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          left: -110px;
          bottom: -110px;
          border-radius: 50%;
          background: rgba(255,255,255,0.14);
          animation: aboutPulse 5s ease-in-out infinite;
        }

        .about-founder-avatar {
          width: min(240px, 100%);
          aspect-ratio: 1;
          border-radius: 36px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(16px);
          margin: 0 auto;
        }

        .about-founder-avatar svg {
          width: 104px;
          height: 104px;
          animation: aboutFloat 5s ease-in-out infinite;
        }

        .about-founder-content {
          position: relative;
          z-index: 1;
        }

        .about-founder-content span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.8);
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .about-founder-content h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 4rem);
          letter-spacing: -0.06em;
        }

        .about-founder-content p {
          margin: 14px 0 0;
          color: rgba(255,255,255,0.84);
          line-height: 1.75;
          font-weight: 760;
        }

        .about-cta {
          margin: 0 6% 82px;
          border-radius: 34px;
          padding: 40px;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.22), transparent 30%),
            linear-gradient(135deg, #2563eb, #0ea5e9, #0f172a);
          background-size: 180% 180%;
          animation: aboutGradient 7s ease infinite;
          color: #ffffff;
          box-shadow: 0 28px 80px rgba(37, 99, 235, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .about-cta h2 {
          margin: 0;
          font-size: clamp(1.7rem, 3vw, 3.1rem);
          letter-spacing: -0.055em;
        }

        .about-cta p {
          margin: 10px 0 0;
          color: rgba(255,255,255,0.84);
          line-height: 1.7;
          max-width: 720px;
          font-weight: 750;
        }

        .about-cta a {
          min-height: 54px;
          padding: 0 23px;
          border-radius: 999px;
          background: #ffffff;
          color: #2563eb;
          text-decoration: none;
          font-weight: 950;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          white-space: nowrap;
          transition: 0.24s ease;
        }

        .about-cta a:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
        }

        @keyframes aboutGridMove {
          from { background-position: 0 0; }
          to { background-position: 44px 44px; }
        }

        @keyframes aboutFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        @keyframes aboutPulse {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes aboutGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes aboutIconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (max-width: 1180px) {
          .about-stats-grid,
          .about-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .about-tool-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .about-values {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 860px) {
          .about-founder-panel {
            grid-template-columns: 1fr;
            text-align: left;
          }
        }

        @media (max-width: 760px) {
          .about-hero {
            padding: 60px 5% 42px;
          }

          .about-hero h1 {
            font-size: clamp(2.15rem, 11vw, 3.35rem);
            letter-spacing: -0.05em;
          }

          .about-hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .about-primary-btn,
          .about-founder {
            width: 100%;
            justify-content: center;
          }

          .about-section {
            padding: 42px 5%;
          }

          .about-two-grid,
          .about-stats-grid,
          .about-tool-grid,
          .about-feature-grid,
          .about-values {
            grid-template-columns: 1fr;
          }

          .about-card,
          .about-tool-card {
            padding: 22px;
            border-radius: 22px;
          }

          .about-founder-panel {
            border-radius: 26px;
            padding: 26px;
          }

          .about-founder-avatar {
            width: 190px;
            border-radius: 28px;
          }

          .about-cta {
            margin: 0 5% 58px;
            padding: 28px;
            border-radius: 26px;
            flex-direction: column;
            align-items: flex-start;
          }

          .about-cta a {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 430px) {
          .about-hero {
            padding-top: 48px;
          }

          .about-breadcrumb {
            font-size: 0.74rem;
          }

          .about-stat,
          .about-card,
          .about-tool-card,
          .about-founder-panel,
          .about-cta {
            border-radius: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-page *,
          .about-page *::before,
          .about-page *::after {
            animation: none !important;
            transition: none !important;
          }

          .about-reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <section className="about-hero">
        <span className="about-orb one" />
        <span className="about-orb two" />
        <span className="about-orb three" />

        <div className="about-hero-inner about-reveal">
          <div className="about-breadcrumb">
            <Globe2 size={15} />
            Home / About Us
          </div>

          <p className="about-eyebrow">{t.eyebrow}</p>

          <h1>
            {t.title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="about-gradient-text">
              {t.title.split(" ").slice(-2).join(" ")}
            </span>
          </h1>

          <p>{t.subtitle}</p>

          <div className="about-hero-actions">
            <Link to="/tools" className="about-primary-btn">
              {t.ctaBtn}
              <ArrowRight size={18} />
            </Link>

            <div className="about-founder">
              <BadgeCheck size={18} />
              {t.founderLabel}: {t.founderName}
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-stats-grid">
          {stats.map((item, index) => (
            <div
              className="about-stat about-reveal"
              style={{ "--delay": `${index * 90}ms` }}
              key={item.label}
            >
              <div className="about-stat-icon">{item.icon}</div>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-two-grid">
          <div className="about-card about-reveal">
            <div className="about-icon">
              <Rocket />
            </div>
            <h2>{t.missionTitle}</h2>
            <p>{t.missionText}</p>
          </div>

          <div
            className="about-card about-reveal"
            style={{ "--delay": "120ms" }}
          >
            <div className="about-icon">
              <Globe2 />
            </div>
            <h2>{t.visionTitle}</h2>
            <p>{t.visionText}</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-head about-reveal">
          <h2>{t.whatTitle}</h2>
          <p>{t.whatSubtitle}</p>
        </div>

        <div className="about-tool-grid">
          {toolCards.map((card, index) => (
            <div
              className="about-tool-card about-reveal"
              style={{ "--delay": `${index * 80}ms` }}
              key={card.title}
            >
              <div className="about-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-head about-reveal">
          <h2>{t.whyTitle}</h2>
          <p>{t.whySubtitle}</p>
        </div>

        <div className="about-feature-grid">
          {features.map((card, index) => (
            <div
              className="about-card about-reveal"
              style={{ "--delay": `${index * 80}ms` }}
              key={card.title}
            >
              <div className="about-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-founder-panel about-reveal">
          <div className="about-founder-avatar">
            <Users />
          </div>

          <div className="about-founder-content">
            <span>
              <Star size={15} />
              {t.founderLabel}
            </span>
            <h2>{t.founderName}</h2>
            <p>
              Convert Wala is founded by Abhishek Singh with a goal to create a
              clean, useful and free online tools platform for everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-head about-reveal">
          <h2>{t.valuesTitle}</h2>
        </div>

        <div className="about-values">
          {values.map((value, index) => (
            <div
              className="about-value about-reveal"
              style={{ "--delay": `${index * 70}ms` }}
              key={value}
            >
              <CheckCircle2 size={19} />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta about-reveal">
        <div>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
        </div>

        <Link to="/tools">
          {t.ctaBtn}
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}