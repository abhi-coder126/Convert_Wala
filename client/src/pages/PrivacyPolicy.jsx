import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BadgeCheck,
  Cookie,
  Database,
  Eye,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  RefreshCcw,
  Scale,
  Server,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Privacy Policy | Convert Wala",
    seoDescription:
      "Read the Convert Wala Privacy Policy to understand how we collect, use, protect and manage user information, cookies, local storage, uploaded files and privacy rights.",
    seoKeywords:
      "Convert Wala privacy policy, privacy policy, data protection, cookies policy, user data, online tools privacy",

    eyebrow: "Legal Information",
    title: "Privacy Policy",
    subtitle:
      "This Privacy Policy explains how Convert Wala collects, uses, stores and protects information when users access our free online tools and website.",
    updated: "Last Updated",
    updatedDate: "28 May 2026",
    founder: "Convert Wala is founded by Abhishek Singh.",

    introTitle: "Your Privacy Matters",
    introText:
      "Convert Wala is designed to provide simple and useful online tools while respecting user privacy. Many tools work directly in your browser, but some features may use browser storage, analytics or third-party services to improve the experience.",

    dataTitle: "Information We May Collect",
    dataText:
      "We may collect basic usage data, device/browser information, pages visited, tool preferences, language/theme settings, and information you voluntarily provide through forms or uploaded files.",

    useTitle: "How We Use Information",
    useText:
      "We use information to operate tools, improve website performance, remember user preferences, fix errors, prevent misuse, improve SEO visibility and provide a better user experience.",

    localTitle: "Browser Storage & Cookies",
    localText:
      "Convert Wala may use localStorage, cookies or similar technologies to remember preferences such as language, theme and tool settings. Users can clear browser data anytime from their browser settings.",

    filesTitle: "Uploaded Files & Tool Data",
    filesText:
      "For tools such as image, PDF or document utilities, files may be processed in the browser where possible. If any tool needs server processing in future, it should clearly mention that before upload.",

    sharingTitle: "Data Sharing",
    sharingText:
      "We do not sell personal data. Limited data may be shared with trusted service providers such as hosting, analytics, security, performance or legal compliance services only when needed.",

    securityTitle: "Data Security",
    securityText:
      "We use reasonable technical and organizational measures to protect user information. However, no internet-based service can be guaranteed 100% secure.",

    rightsTitle: "User Rights",
    rightsText:
      "Depending on your location, you may request access, correction, deletion, restriction, withdrawal of consent or information about how your data is used.",

    childrenTitle: "Children's Privacy",
    childrenText:
      "Convert Wala is not intended to knowingly collect personal information from children. If a parent or guardian believes a child has provided personal data, they can contact us for removal.",

    thirdTitle: "Third-Party Links",
    thirdText:
      "Our website may include links to third-party websites or services. We are not responsible for the privacy practices, content or policies of external websites.",

    retentionTitle: "Data Retention",
    retentionText:
      "We keep information only as long as necessary for tool functionality, security, legal compliance, analytics or legitimate business purposes.",

    policyTitle: "Policy Updates",
    policyText:
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.",

    contactTitle: "Contact for Privacy Requests",
    contactText:
      "For privacy questions, correction requests or deletion requests, contact us through the website contact page or official support email.",
    contactBtn: "Contact Us",

    legalTitle: "Key Legal Points Included",
    point1: "We do not sell personal data.",
    point2: "Users can request data access, correction or deletion.",
    point3: "Cookies/localStorage may be used for preferences and performance.",
    point4: "Uploaded files should be processed locally where possible.",
    point5: "Third-party services may have their own privacy policies.",
    point6: "No online system can be guaranteed fully secure.",
    point7: "Policy may be updated as the platform grows.",
    point8: "Children's personal data should not be knowingly collected.",

    ctaTitle: "Use Convert Wala with Confidence",
    ctaText:
      "Explore free tools for images, PDFs, SEO, finance, education and daily productivity.",
    ctaBtn: "View All Tools",
  },

  hi: {
    seoTitle: "Privacy Policy | Convert Wala",
    seoDescription:
      "Convert Wala Privacy Policy पढ़ें और जानें कि हम user information, cookies, local storage, uploaded files और privacy rights को कैसे manage करते हैं।",
    seoKeywords:
      "Convert Wala privacy policy, privacy policy, data protection, cookies policy, user data, online tools privacy",

    eyebrow: "Legal Information",
    title: "Privacy Policy",
    subtitle:
      "यह Privacy Policy बताती है कि Convert Wala users की information को कैसे collect, use, store और protect करता है।",
    updated: "Last Updated",
    updatedDate: "28 May 2026",
    founder: "Convert Wala के founder Abhishek Singh हैं।",

    introTitle: "आपकी Privacy Important है",
    introText:
      "Convert Wala useful online tools provide करता है और user privacy को respect करता है। कई tools browser में directly work करते हैं, लेकिन कुछ features preferences, analytics या third-party services use कर सकते हैं।",

    dataTitle: "हम कौन सी Information Collect कर सकते हैं",
    dataText:
      "हम basic usage data, browser/device information, visited pages, language/theme settings और forms/uploaded files के through voluntarily provided data collect कर सकते हैं।",

    useTitle: "Information का Use कैसे होता है",
    useText:
      "Information का use tools operate करने, performance improve करने, preferences remember करने, errors fix करने, misuse prevent करने और user experience improve करने के लिए होता है।",

    localTitle: "Browser Storage और Cookies",
    localText:
      "Convert Wala localStorage, cookies या similar technologies use कर सकता है ताकि language, theme और tool settings remember रहें। Users browser settings से data clear कर सकते हैं।",

    filesTitle: "Uploaded Files और Tool Data",
    filesText:
      "Image, PDF या document tools में files जहां possible हो browser में process होंगी। Future में अगर कोई tool server processing use करेगा, तो upload से पहले clearly mention करना चाहिए।",

    sharingTitle: "Data Sharing",
    sharingText:
      "हम personal data sell नहीं करते। Limited data hosting, analytics, security, performance या legal compliance services के साथ जरूरत पड़ने पर share हो सकता है।",

    securityTitle: "Data Security",
    securityText:
      "हम user information protect करने के लिए reasonable measures use करते हैं। लेकिन कोई भी internet-based service 100% secure guarantee नहीं कर सकती।",

    rightsTitle: "User Rights",
    rightsText:
      "Location के हिसाब से users access, correction, deletion, restriction, consent withdrawal या data usage information request कर सकते हैं।",

    childrenTitle: "Children's Privacy",
    childrenText:
      "Convert Wala knowingly children की personal information collect करने के लिए intended नहीं है। Parent/guardian removal के लिए contact कर सकते हैं।",

    thirdTitle: "Third-Party Links",
    thirdText:
      "Website में third-party links हो सकते हैं। External websites की privacy practices, content या policies के लिए हम responsible नहीं हैं।",

    retentionTitle: "Data Retention",
    retentionText:
      "Information केवल उतने समय तक रखी जाती है जितना tool functionality, security, legal compliance, analytics या legitimate purposes के लिए जरूरी हो।",

    policyTitle: "Policy Updates",
    policyText:
      "हम Privacy Policy को समय-समय पर update कर सकते हैं। Changes इसी page पर updated date के साथ post होंगे।",

    contactTitle: "Privacy Requests के लिए Contact",
    contactText:
      "Privacy questions, correction requests या deletion requests के लिए website contact page या official support email से contact करें।",
    contactBtn: "Contact Us",

    legalTitle: "Key Legal Points Included",
    point1: "हम personal data sell नहीं करते।",
    point2: "Users data access, correction या deletion request कर सकते हैं।",
    point3: "Cookies/localStorage preferences और performance के लिए use हो सकते हैं।",
    point4: "Uploaded files जहां possible हो local process होने चाहिए।",
    point5: "Third-party services की अपनी privacy policies हो सकती हैं।",
    point6: "कोई online system पूरी तरह secure guarantee नहीं हो सकता।",
    point7: "Platform grow होने पर policy update हो सकती है।",
    point8: "Children का personal data knowingly collect नहीं किया जाना चाहिए।",

    ctaTitle: "Convert Wala Confidently Use करें",
    ctaText:
      "Images, PDFs, SEO, finance, education और daily productivity के free tools explore करें।",
    ctaBtn: "All Tools देखें",
  },

  hinglish: {
    seoTitle: "Privacy Policy | Convert Wala",
    seoDescription:
      "Convert Wala Privacy Policy padho aur samjho ki hum user information, cookies, local storage, uploaded files aur privacy rights ko kaise manage karte hain.",
    seoKeywords:
      "Convert Wala privacy policy, privacy policy, data protection, cookies policy, user data, online tools privacy",

    eyebrow: "Legal Information",
    title: "Privacy Policy",
    subtitle:
      "Ye Privacy Policy explain karti hai ki Convert Wala user information ko kaise collect, use, store aur protect karta hai.",
    updated: "Last Updated",
    updatedDate: "28 May 2026",
    founder: "Convert Wala is founded by Abhishek Singh.",

    introTitle: "Your Privacy Matters",
    introText:
      "Convert Wala useful online tools provide karta hai aur user privacy ko respect karta hai. Kai tools browser me directly work karte hain, lekin kuch features preferences, analytics ya third-party services use kar sakte hain.",

    dataTitle: "Hum Kaunsi Information Collect Kar Sakte Hain",
    dataText:
      "Hum basic usage data, browser/device information, visited pages, language/theme settings aur forms/uploaded files ke through voluntarily provided data collect kar sakte hain.",

    useTitle: "Information Ka Use Kaise Hota Hai",
    useText:
      "Information tools operate karne, performance improve karne, preferences remember karne, errors fix karne, misuse prevent karne aur user experience improve karne ke liye use hoti hai.",

    localTitle: "Browser Storage & Cookies",
    localText:
      "Convert Wala localStorage, cookies ya similar technologies use kar sakta hai taaki language, theme aur tool settings remember rahein. Users browser settings se data clear kar sakte hain.",

    filesTitle: "Uploaded Files & Tool Data",
    filesText:
      "Image, PDF ya document tools me files jahan possible ho browser me process hongi. Future me agar koi tool server processing use karega, to upload se pehle clearly mention karna chahiye.",

    sharingTitle: "Data Sharing",
    sharingText:
      "Hum personal data sell nahi karte. Limited data hosting, analytics, security, performance ya legal compliance services ke saath zarurat par share ho sakta hai.",

    securityTitle: "Data Security",
    securityText:
      "Hum user information protect karne ke liye reasonable measures use karte hain. Lekin koi bhi internet-based service 100% secure guarantee nahi kar sakti.",

    rightsTitle: "User Rights",
    rightsText:
      "Location ke hisaab se users access, correction, deletion, restriction, consent withdrawal ya data usage information request kar sakte hain.",

    childrenTitle: "Children's Privacy",
    childrenText:
      "Convert Wala knowingly children ki personal information collect karne ke liye intended nahi hai. Parent/guardian removal ke liye contact kar sakte hain.",

    thirdTitle: "Third-Party Links",
    thirdText:
      "Website me third-party links ho sakte hain. External websites ki privacy practices, content ya policies ke liye hum responsible nahi hain.",

    retentionTitle: "Data Retention",
    retentionText:
      "Information sirf utne time tak rakhi jati hai jitna tool functionality, security, legal compliance, analytics ya legitimate purposes ke liye zaruri ho.",

    policyTitle: "Policy Updates",
    policyText:
      "Hum Privacy Policy ko time to time update kar sakte hain. Changes isi page par updated date ke saath post honge.",

    contactTitle: "Privacy Requests ke liye Contact",
    contactText:
      "Privacy questions, correction requests ya deletion requests ke liye website contact page ya official support email se contact karo.",
    contactBtn: "Contact Us",

    legalTitle: "Key Legal Points Included",
    point1: "Hum personal data sell nahi karte.",
    point2: "Users data access, correction ya deletion request kar sakte hain.",
    point3: "Cookies/localStorage preferences aur performance ke liye use ho sakte hain.",
    point4: "Uploaded files jahan possible ho local process hone chahiye.",
    point5: "Third-party services ki apni privacy policies ho sakti hain.",
    point6: "Koi online system fully secure guarantee nahi ho sakta.",
    point7: "Platform grow hone par policy update ho sakti hai.",
    point8: "Children ka personal data knowingly collect nahi kiya jana chahiye.",

    ctaTitle: "Convert Wala Confidently Use Karo",
    ctaText:
      "Images, PDFs, SEO, finance, education aur daily productivity ke free tools explore karo.",
    ctaBtn: "View All Tools",
  },
};

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/privacy-policy";

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
    const nodes = document.querySelectorAll(".pp-reveal");

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

  const policyCards = [
    { icon: <ShieldCheck />, title: t.introTitle, text: t.introText },
    { icon: <Database />, title: t.dataTitle, text: t.dataText },
    { icon: <UserCheck />, title: t.useTitle, text: t.useText },
    { icon: <Cookie />, title: t.localTitle, text: t.localText },
    { icon: <FileText />, title: t.filesTitle, text: t.filesText },
    { icon: <Server />, title: t.sharingTitle, text: t.sharingText },
    { icon: <LockKeyhole />, title: t.securityTitle, text: t.securityText },
    { icon: <Scale />, title: t.rightsTitle, text: t.rightsText },
    { icon: <Users />, title: t.childrenTitle, text: t.childrenText },
    { icon: <Globe2 />, title: t.thirdTitle, text: t.thirdText },
    { icon: <Trash2 />, title: t.retentionTitle, text: t.retentionText },
    { icon: <RefreshCcw />, title: t.policyTitle, text: t.policyText },
  ];

  const legalPoints = [
    t.point1,
    t.point2,
    t.point3,
    t.point4,
    t.point5,
    t.point6,
    t.point7,
    t.point8,
  ];

  const privacySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
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
        "@type": "CreativeWork",
        "@id": `${canonicalUrl}#privacy-policy`,
        name: "Convert Wala Privacy Policy",
        url: canonicalUrl,
        text: t.seoDescription,
        author: {
          "@type": "Organization",
          name: "Convert Wala",
        },
        publisher: {
          "@id": "https://www.convertwala.com/#organization",
        },
        dateModified: "2026-05-28",
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
        founder: {
          "@type": "Person",
          name: "Abhishek Singh",
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
            name: "Privacy Policy",
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className={`privacy-page ${theme === "dark" ? "dark" : "light"}`}>
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
          {JSON.stringify(privacySchema)}
        </script>
      </Helmet>

      <style>{`
        .privacy-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            radial-gradient(circle at 92% 16%, rgba(14, 165, 233, 0.12), transparent 32%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
          overflow-x: hidden;
        }

        .privacy-page * {
          box-sizing: border-box;
        }

        .privacy-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            radial-gradient(circle at 92% 16%, rgba(14, 165, 233, 0.18), transparent 32%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .pp-reveal {
          opacity: 0;
          transform: translateY(28px) scale(0.985);
          transition:
            opacity 0.72s ease,
            transform 0.72s cubic-bezier(.2,.8,.2,1);
          transition-delay: var(--delay, 0ms);
        }

        .pp-reveal.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .pp-hero {
          position: relative;
          isolation: isolate;
          padding: 92px 6% 58px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .privacy-page.dark .pp-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .pp-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background-image:
            linear-gradient(rgba(37, 99, 235, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, black, transparent);
          animation: ppGridMove 18s linear infinite;
        }

        .pp-hero::after {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          right: -170px;
          top: -170px;
          z-index: -1;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.18), transparent 65%);
          animation: ppPulse 5s ease-in-out infinite;
        }

        .pp-orb {
          position: absolute;
          z-index: -1;
          border-radius: 999px;
          opacity: 0.72;
          animation: ppFloat 7s ease-in-out infinite;
        }

        .pp-orb.one {
          width: 76px;
          height: 76px;
          left: 7%;
          bottom: 48px;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
        }

        .pp-orb.two {
          width: 48px;
          height: 48px;
          left: 46%;
          top: 84px;
          background: linear-gradient(135deg, #22c55e, #14b8a6);
          animation-delay: 1.2s;
        }

        .pp-orb.three {
          width: 58px;
          height: 58px;
          right: 18%;
          bottom: 82px;
          background: linear-gradient(135deg, #f97316, #facc15);
          animation-delay: 2s;
        }

        .pp-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1120px;
        }

        .pp-breadcrumb {
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

        .privacy-page.dark .pp-breadcrumb {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.25);
        }

        .pp-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .privacy-page.dark .pp-eyebrow {
          color: #93c5fd;
        }

        .pp-hero h1 {
          margin: 0;
          font-size: clamp(2.6rem, 5.8vw, 5.8rem);
          letter-spacing: -0.075em;
          line-height: 0.96;
          max-width: 1020px;
        }

        .pp-gradient-text {
          background: linear-gradient(135deg, #2563eb, #0ea5e9, #22c55e);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ppGradient 5s ease infinite;
        }

        .pp-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.06rem;
          margin: 20px 0 0;
        }

        .privacy-page.dark .pp-hero p {
          color: #cbd5e1;
        }

        .pp-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .pp-pill {
          min-height: 50px;
          padding: 0 16px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: #ffffff;
          color: #0f172a;
          border: 1px solid #dbeafe;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
          font-weight: 950;
        }

        .pp-pill svg {
          color: #2563eb;
          animation: ppIconBounce 2.2s ease-in-out infinite;
        }

        .privacy-page.dark .pp-pill {
          background: rgba(255,255,255,0.05);
          color: #f8fafc;
          border-color: rgba(147, 197, 253, 0.18);
        }

        .pp-section {
          padding: 60px 6%;
        }

        .pp-section-head {
          max-width: 860px;
          margin-bottom: 26px;
        }

        .pp-section-head h2 {
          margin: 0;
          font-size: clamp(1.9rem, 3.3vw, 3.2rem);
          letter-spacing: -0.045em;
        }

        .pp-section-head p {
          color: #64748b;
          line-height: 1.75;
          margin: 12px 0 0;
          font-weight: 750;
        }

        .privacy-page.dark .pp-section-head p {
          color: #cbd5e1;
        }

        .pp-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .pp-card {
          position: relative;
          overflow: hidden;
          min-height: 245px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 28px;
          padding: 26px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
          transition: 0.26s ease;
        }

        .privacy-page.dark .pp-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .pp-card::before,
        .pp-legal-box::before,
        .pp-contact-box::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: translateX(-120%);
          transition: 0.72s ease;
        }

        .privacy-page.dark .pp-card::before,
        .privacy-page.dark .pp-legal-box::before,
        .privacy-page.dark .pp-contact-box::before {
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.08), transparent);
        }

        .pp-card:hover,
        .pp-legal-item:hover,
        .pp-contact-box:hover {
          transform: translateY(-7px);
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 0 28px 75px rgba(37, 99, 235, 0.14);
        }

        .pp-card:hover::before,
        .pp-contact-box:hover::before {
          transform: translateX(120%);
        }

        .pp-icon {
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

        .pp-card:hover .pp-icon {
          transform: rotate(-8deg) scale(1.08);
          background: #2563eb;
          color: #ffffff;
        }

        .privacy-page.dark .pp-icon {
          background: rgba(37, 99, 235, 0.15);
          color: #93c5fd;
        }

        .pp-icon svg {
          width: 28px;
          height: 28px;
        }

        .pp-card h3 {
          position: relative;
          z-index: 1;
          margin: 0;
          color: inherit;
          letter-spacing: -0.04em;
          font-size: 1.2rem;
        }

        .pp-card p {
          position: relative;
          z-index: 1;
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.75;
          font-weight: 750;
        }

        .privacy-page.dark .pp-card p {
          color: #cbd5e1;
        }

        .pp-legal-box {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          padding: 32px;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.24), transparent 32%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          box-shadow: 0 28px 80px rgba(37, 99, 235, 0.22);
        }

        .pp-legal-box h2 {
          position: relative;
          z-index: 1;
          margin: 0 0 20px;
          font-size: clamp(1.8rem, 3vw, 3rem);
          letter-spacing: -0.055em;
        }

        .pp-legal-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .pp-legal-item {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-weight: 850;
          line-height: 1.55;
          transition: 0.25s ease;
        }

        .pp-legal-item svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: #93c5fd;
        }

        .pp-contact-box {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 80px 1fr auto;
          align-items: center;
          gap: 20px;
          padding: 26px;
          border-radius: 28px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
          transition: 0.26s ease;
        }

        .privacy-page.dark .pp-contact-box {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .pp-contact-icon {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
        }

        .privacy-page.dark .pp-contact-icon {
          background: rgba(37, 99, 235, 0.15);
          color: #93c5fd;
        }

        .pp-contact-box h2 {
          position: relative;
          z-index: 1;
          margin: 0;
          letter-spacing: -0.04em;
        }

        .pp-contact-box p {
          position: relative;
          z-index: 1;
          margin: 8px 0 0;
          color: #64748b;
          line-height: 1.7;
          font-weight: 750;
        }

        .privacy-page.dark .pp-contact-box p {
          color: #cbd5e1;
        }

        .pp-contact-box a {
          position: relative;
          z-index: 1;
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
          white-space: nowrap;
          box-shadow: 0 18px 45px rgba(37, 99, 235, 0.24);
        }

        .pp-cta {
          margin: 0 6% 82px;
          border-radius: 34px;
          padding: 40px;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,255,255,0.22), transparent 30%),
            linear-gradient(135deg, #2563eb, #0ea5e9, #0f172a);
          background-size: 180% 180%;
          animation: ppGradient 7s ease infinite;
          color: #ffffff;
          box-shadow: 0 28px 80px rgba(37, 99, 235, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .pp-cta h2 {
          margin: 0;
          font-size: clamp(1.7rem, 3vw, 3.1rem);
          letter-spacing: -0.055em;
        }

        .pp-cta p {
          margin: 10px 0 0;
          color: rgba(255,255,255,0.84);
          line-height: 1.7;
          max-width: 720px;
          font-weight: 750;
        }

        .pp-cta a {
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

        .pp-cta a:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 45px rgba(0,0,0,0.2);
        }

        @keyframes ppGridMove {
          from { background-position: 0 0; }
          to { background-position: 44px 44px; }
        }

        @keyframes ppFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        @keyframes ppPulse {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes ppGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes ppIconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (max-width: 1180px) {
          .pp-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .pp-contact-box {
            grid-template-columns: 72px 1fr;
          }

          .pp-contact-box a {
            grid-column: 1 / -1;
            justify-content: center;
          }
        }

        @media (max-width: 760px) {
          .pp-hero {
            padding: 60px 5% 42px;
          }

          .pp-hero h1 {
            font-size: clamp(2.25rem, 11vw, 3.5rem);
            letter-spacing: -0.055em;
          }

          .pp-meta-row {
            align-items: stretch;
            flex-direction: column;
          }

          .pp-pill {
            width: 100%;
            justify-content: center;
          }

          .pp-section {
            padding: 42px 5%;
          }

          .pp-grid,
          .pp-legal-grid {
            grid-template-columns: 1fr;
          }

          .pp-card {
            padding: 22px;
            border-radius: 22px;
            min-height: auto;
          }

          .pp-legal-box {
            padding: 24px;
            border-radius: 26px;
          }

          .pp-contact-box {
            grid-template-columns: 1fr;
            text-align: left;
            padding: 22px;
            border-radius: 22px;
          }

          .pp-contact-icon {
            width: 64px;
            height: 64px;
          }

          .pp-cta {
            margin: 0 5% 58px;
            padding: 28px;
            border-radius: 26px;
            flex-direction: column;
            align-items: flex-start;
          }

          .pp-cta a {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 430px) {
          .pp-hero {
            padding-top: 48px;
          }

          .pp-breadcrumb {
            font-size: 0.74rem;
          }

          .pp-card,
          .pp-legal-box,
          .pp-contact-box,
          .pp-cta {
            border-radius: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .privacy-page *,
          .privacy-page *::before,
          .privacy-page *::after {
            animation: none !important;
            transition: none !important;
          }

          .pp-reveal {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <section className="pp-hero">
        <span className="pp-orb one" />
        <span className="pp-orb two" />
        <span className="pp-orb three" />

        <div className="pp-hero-inner pp-reveal">
          <div className="pp-breadcrumb">
            <Globe2 size={15} />
            Home / Privacy Policy
          </div>

          <p className="pp-eyebrow">{t.eyebrow}</p>

          <h1>
            Privacy{" "}
            <span className="pp-gradient-text">Policy</span>
          </h1>

          <p>{t.subtitle}</p>

          <div className="pp-meta-row">
            <div className="pp-pill">
              <BadgeCheck size={18} />
              {t.updated}: {t.updatedDate}
            </div>

            <div className="pp-pill">
              <ShieldCheck size={18} />
              {t.founder}
            </div>
          </div>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-section-head pp-reveal">
          <h2>{t.title}</h2>
          <p>{t.introText}</p>
        </div>

        <div className="pp-grid">
          {policyCards.map((card, index) => (
            <div
              className="pp-card pp-reveal"
              style={{ "--delay": `${index * 65}ms` }}
              key={card.title}
            >
              <div className="pp-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-legal-box pp-reveal">
          <h2>{t.legalTitle}</h2>

          <div className="pp-legal-grid">
            {legalPoints.map((point, index) => (
              <div className="pp-legal-item" key={point}>
                <Scale size={18} />
                <span>{index + 1}. {point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-contact-box pp-reveal">
          <div className="pp-contact-icon">
            <Mail size={30} />
          </div>

          <div>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>
          </div>

          <Link to="/contact-us">
            {t.contactBtn}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="pp-cta pp-reveal">
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