import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Copy,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Globe2,
  CalendarDays,
  ExternalLink,
  Eye,
  Clock,
  Building2,
  Server,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Free Domain Age Checker Online | Convert Wala",
    seoDescription:
      "Check domain age, domain creation date, expiry date, updated date, registrar and nameservers online using Convert Wala free Domain Age Checker.",
    seoKeywords:
      "domain age checker, domain age, domain creation date checker, expiry date checker, whois checker, rdap checker, SEO tools",

    eyebrow: "Convert Wala SEO Tool",
    heading: "Domain Age Checker",
    subtitle:
      "Check domain age, creation date, expiry date, registrar, nameservers and full domain registration history without any paid API.",

    checkerTitle: "Check Domain Age",
    domainLabel: "Enter Domain / URL",
    domainPlaceholder: "example.com or https://example.com",
    checkNow: "Check Now",
    checking: "Checking...",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    noteTitle: "Important Note",
    note:
      "DA, PA, Spam Score and Backlink data need paid SEO APIs, so they are removed. This tool shows only real domain registration data available through free RDAP lookup.",

    resultTitle: "Domain Report",
    historyTitle: "Search History",
    fullReport: "Full Domain Report",
    view: "View",
    visit: "Visit Domain",

    serial: "#",
    webPage: "Web Page",
    domainAge: "Domain Age",
    history: "History",
    domain: "Domain",
    creationDate: "Creation Date",
    expiryDate: "Expiry Date",
    updatedDate: "Updated Date",
    registrar: "Registrar",
    nameservers: "Nameservers",
    status: "Status",
    source: "Source",
    checkedAt: "Checked At",
    totalDays: "Total Days",
    years: "Years",
    months: "Months",
    days: "Days",
    notAvailable: "Not Available",

    errorInvalid: "Please enter a valid domain.",
    errorFetch:
      "Could not fetch domain data. Try another domain or check internet connection.",
    copied: "Result copied.",
    downloaded: "Result downloaded.",
    resetDone: "Checker reset successfully.",
    copyFailed: "Copy failed.",
  },

  hi: {
    seoTitle: "Free Domain Age Checker Online | Convert Wala",
    seoDescription:
      "Convert Wala Domain Age Checker से domain age, creation date, expiry date, updated date, registrar और nameservers online check करें।",
    seoKeywords:
      "domain age checker, domain age, domain creation date checker, expiry date checker, whois checker, rdap checker, SEO tools",

    eyebrow: "Convert Wala SEO टूल",
    heading: "Domain Age Checker",
    subtitle:
      "Paid API के बिना domain age, creation date, expiry date, registrar, nameservers और full registration history check करें।",

    checkerTitle: "Domain Age Check करें",
    domainLabel: "Domain / URL Enter करें",
    domainPlaceholder: "example.com या https://example.com",
    checkNow: "Check करें",
    checking: "Checking...",
    copyResult: "Result Copy करें",
    downloadTxt: "TXT Download करें",
    reset: "Reset करें",

    noteTitle: "Important Note",
    note:
      "DA, PA, Spam Score और Backlink data के लिए paid SEO APIs चाहिए, इसलिए इन्हें remove कर दिया है। यह tool free RDAP lookup से real domain registration data show करता है।",

    resultTitle: "Domain Report",
    historyTitle: "Search History",
    fullReport: "Full Domain Report",
    view: "View",
    visit: "Visit Domain",

    serial: "#",
    webPage: "Web Page",
    domainAge: "Domain Age",
    history: "History",
    domain: "Domain",
    creationDate: "Creation Date",
    expiryDate: "Expiry Date",
    updatedDate: "Updated Date",
    registrar: "Registrar",
    nameservers: "Nameservers",
    status: "Status",
    source: "Source",
    checkedAt: "Checked At",
    totalDays: "Total Days",
    years: "Years",
    months: "Months",
    days: "Days",
    notAvailable: "Not Available",

    errorInvalid: "Valid domain enter करें।",
    errorFetch:
      "Domain data fetch नहीं हो पाया। दूसरा domain try करें या internet connection check करें।",
    copied: "Result copy हो गया।",
    downloaded: "Result download हो गया।",
    resetDone: "Checker reset हो गया।",
    copyFailed: "Copy failed.",
  },

  hinglish: {
    seoTitle: "Free Domain Age Checker Online | Convert Wala",
    seoDescription:
      "Convert Wala Domain Age Checker se domain age, creation date, expiry date, updated date, registrar aur nameservers online check karo.",
    seoKeywords:
      "domain age checker, domain age, domain creation date checker, expiry date checker, whois checker, rdap checker, SEO tools",

    eyebrow: "Convert Wala SEO Tool",
    heading: "Domain Age Checker",
    subtitle:
      "Paid API ke bina domain age, creation date, expiry date, registrar, nameservers aur full registration history check karo.",

    checkerTitle: "Check Domain Age",
    domainLabel: "Enter Domain / URL",
    domainPlaceholder: "example.com ya https://example.com",
    checkNow: "Check Now",
    checking: "Checking...",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    noteTitle: "Important Note",
    note:
      "DA, PA, Spam Score aur Backlink data ke liye paid SEO APIs chahiye, isliye unko remove kar diya hai. Ye tool free RDAP lookup se real domain registration data show karta hai.",

    resultTitle: "Domain Report",
    historyTitle: "Search History",
    fullReport: "Full Domain Report",
    view: "View",
    visit: "Visit Domain",

    serial: "#",
    webPage: "Web Page",
    domainAge: "Domain Age",
    history: "History",
    domain: "Domain",
    creationDate: "Creation Date",
    expiryDate: "Expiry Date",
    updatedDate: "Updated Date",
    registrar: "Registrar",
    nameservers: "Nameservers",
    status: "Status",
    source: "Source",
    checkedAt: "Checked At",
    totalDays: "Total Days",
    years: "Years",
    months: "Months",
    days: "Days",
    notAvailable: "Not Available",

    errorInvalid: "Valid domain enter karo.",
    errorFetch:
      "Domain data fetch nahi ho paya. Dusra domain try karo ya internet connection check karo.",
    copied: "Result copied.",
    downloaded: "Result downloaded.",
    resetDone: "Checker reset ho gaya.",
    copyFailed: "Copy failed.",
  },
};

const cleanDomain = (value = "") => {
  let input = String(value).trim().toLowerCase();

  if (!input) return "";

  input = input.replace(/^https?:\/\//, "");
  input = input.replace(/^www\./, "");
  input = input.split("/")[0];
  input = input.split("?")[0];
  input = input.split("#")[0];
  input = input.replace(/:\d+$/, "");

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(input)) return "";

  return input;
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const calculateAge = (dateValue) => {
  if (!dateValue) return null;

  const start = new Date(dateValue);
  const end = new Date();

  if (Number.isNaN(start.getTime()) || start > end) return null;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    const previousMonthDays = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    ).getDate();

    days += previousMonthDays;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const totalDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    months,
    days,
    totalDays,
  };
};

const findEventDate = (events = [], actions = []) => {
  const matched = events.find((event) => {
    const action = String(event.eventAction || "").toLowerCase();
    return actions.some((item) => action.includes(item));
  });

  return matched?.eventDate || "";
};

const getRegistrarName = (entities = []) => {
  const registrarEntity = entities.find(
    (entity) => Array.isArray(entity.roles) && entity.roles.includes("registrar")
  );

  const vcardItems = registrarEntity?.vcardArray?.[1];

  if (!Array.isArray(vcardItems)) return "";

  const fn = vcardItems.find((item) => item?.[0] === "fn");

  return fn?.[3] || "";
};

const downloadTextFile = (content, filename) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export default function DomainAgeChecker() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [domainInput, setDomainInput] = useState("andnetics.in");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/domain-age-checker";

  const domain = useMemo(() => cleanDomain(domainInput), [domainInput]);

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

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const getAgeText = (age) => {
    if (!age) return t.notAvailable;
    return `${age.years} ${t.years}, ${age.months} ${t.months}, ${age.days} ${t.days}`;
  };

  const fetchDomainData = async (targetDomain) => {
    const response = await fetch(`https://rdap.org/domain/${targetDomain}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("RDAP lookup failed");
    }

    const creationDate = findEventDate(data.events, ["registration", "creation"]);
    const expiryDate = findEventDate(data.events, ["expiration", "expiry"]);
    const updatedDate = findEventDate(data.events, [
      "last changed",
      "last update",
      "changed",
      "update",
    ]);

    const nameservers = Array.isArray(data.nameservers)
      ? data.nameservers
        .map((item) => item.ldhName || item.unicodeName)
        .filter(Boolean)
      : [];

    const status = Array.isArray(data.status) ? data.status : [];

    const age = calculateAge(creationDate);

    return {
      id: `${Date.now()}_${targetDomain}`,
      domain: data.ldhName || targetDomain,
      webPage: `https://${targetDomain}`,
      creationDate,
      expiryDate,
      updatedDate,
      registrar: getRegistrarName(data.entities) || "",
      nameservers,
      status,
      source: "RDAP",
      age,
      rawEvents: Array.isArray(data.events) ? data.events : [],
      checkedAt: new Date().toLocaleString("en-IN"),
    };
  };

  const checkDomain = async () => {
    if (!domain) {
      setError(t.errorInvalid);
      return;
    }

    try {
      setChecking(true);
      setError("");

      const report = await fetchDomainData(domain);

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.domain !== report.domain);
        return [report, ...filtered].slice(0, 15);
      });

      setSelectedReport(report);
      setChecking(false);
    } catch {
      setChecking(false);
      setError(t.errorFetch);
    }
  };

  const buildReportText = (report) => {
    if (!report) return "";

    return `Convert Wala Domain Age Checker

${t.domain}: ${report.domain}
${t.webPage}: ${report.webPage}
${t.domainAge}: ${getAgeText(report.age)}
${t.totalDays}: ${report.age?.totalDays || t.notAvailable}
${t.creationDate}: ${formatDate(report.creationDate) || t.notAvailable}
${t.expiryDate}: ${formatDate(report.expiryDate) || t.notAvailable}
${t.updatedDate}: ${formatDate(report.updatedDate) || t.notAvailable}
${t.registrar}: ${report.registrar || t.notAvailable}
${t.nameservers}: ${report.nameservers?.length ? report.nameservers.join(", ") : t.notAvailable
      }
${t.status}: ${report.status?.length ? report.status.join(", ") : t.notAvailable}
${t.source}: ${report.source || t.notAvailable}
${t.checkedAt}: ${report.checkedAt || t.notAvailable}
`;
  };

  const copyResult = async () => {
    const report = selectedReport || history[0];

    if (!report) return;

    try {
      await navigator.clipboard.writeText(buildReportText(report));
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadResult = () => {
    const report = selectedReport || history[0];

    if (!report) return;

    downloadTextFile(buildReportText(report), "Convert Wala_Domain_Age_Result.txt");
    showToast("success", t.downloaded);
  };

  const resetAll = () => {
    setDomainInput("andnetics.in");
    setHistory([]);
    setSelectedReport(null);
    setError("");
    showToast("success", t.resetDone);
  };

  const InfoBox = ({ label, value, icon }) => (
    <div className="dac-info-box">
      <span>
        {icon}
        {label}
      </span>
      <strong>{value || t.notAvailable}</strong>
    </div>
  );

  return (
    <main className={`dac-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Domain Age Checker",
            url: canonicalUrl,
            applicationCategory: "SEOApplication",
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
              "Domain age checker",
              "Domain creation date checker",
              "Domain expiry date checker",
              "Registrar lookup",
              "Nameserver lookup",
              "RDAP domain lookup",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .dac-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
          overflow-x: hidden;
        }

        .dac-page * {
          box-sizing: border-box;
        }

        .dac-page.dark {
          background:
            radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .dac-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .dac-page.dark .dac-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .dac-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .dac-page.dark .dac-eyebrow {
          color: #93c5fd;
        }

        .dac-hero h1 {
          margin: 0;
          color: inherit;
          font-size: clamp(2.25rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .dac-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .dac-page.dark .dac-hero p {
          color: #cbd5e1;
        }

        .dac-shell {
          width: 100%;
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.82fr) minmax(420px, 1.18fr);
          gap: 28px;
          align-items: start;
        }

        .dac-left,
        .dac-right {
          display: grid;
          gap: 20px;
          min-width: 0;
        }

        @media (min-width: 1101px) {
          .dac-right {
            position: sticky;
            top: 18px;
          }
        }

        .dac-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .dac-page.dark .dac-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .dac-card h3 {
          margin: 0 0 16px;
          color: inherit;
          font-size: 1.12rem;
        }

        .dac-field {
          display: block;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 900;
          min-width: 0;
        }

        .dac-page.dark .dac-field {
          color: #f8fafc;
        }

        .dac-field input {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          margin-top: 8px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 16px;
          padding: 15px;
          outline: none;
          font-weight: 900;
          font-family: inherit;
        }

        .dac-page.dark .dac-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .dac-field input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .dac-page.dark .dac-field input:focus {
          background: #020617;
        }

        .dac-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .dac-primary,
        .dac-dark,
        .dac-light,
        .dac-danger {
          min-height: 50px;
          border: 0;
          border-radius: 999px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-weight: 900;
          cursor: pointer;
          flex: 1;
          text-align: center;
        }

        .dac-primary {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.22);
        }

        .dac-dark {
          background: #111827;
          color: #ffffff;
        }

        .dac-page.dark .dac-dark {
          background: #f8fafc;
          color: #111827;
        }

        .dac-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .dac-page.dark .dac-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .dac-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .dac-primary:disabled,
        .dac-dark:disabled,
        .dac-light:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dac-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .dac-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 18px;
          padding: 16px;
          font-weight: 900;
          line-height: 1.6;
          margin-top: 14px;
        }

        .dac-big-result {
          background:
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.26), transparent 34%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(37, 99, 235, 0.22);
          min-width: 0;
        }

        .dac-big-result span {
          display: block;
          opacity: 0.85;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .dac-big-result h2 {
          margin: 0;
          font-size: clamp(2.15rem, 4vw, 4.4rem);
          letter-spacing: -0.06em;
          line-height: 1.06;
          overflow-wrap: anywhere;
        }

        .dac-big-result p {
          margin: 14px 0 0;
          opacity: 0.9;
          line-height: 1.7;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .dac-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #ffffff;
          font-weight: 900;
          text-decoration: none;
          margin-top: 10px;
        }

        .dac-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .dac-info-box {
          min-width: 0;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 15px;
        }

        .dac-page.dark .dac-info-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .dac-info-box span {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 900;
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .dac-page.dark .dac-info-box span {
          color: #cbd5e1;
        }

        .dac-info-box strong {
          display: block;
          color: #111827;
          font-size: 1rem;
          overflow-wrap: anywhere;
          line-height: 1.45;
        }

        .dac-page.dark .dac-info-box strong {
          color: #f8fafc;
        }

        .dac-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
        }

        .dac-page.dark .dac-table-wrap {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .dac-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
          background: #ffffff;
        }

        .dac-page.dark .dac-table {
          background: rgba(15, 23, 42, 0.92);
        }

        .dac-table th,
        .dac-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 800;
          white-space: nowrap;
        }

        .dac-page.dark .dac-table th,
        .dac-page.dark .dac-table td {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .dac-table th {
          background: #f8fafc;
          color: #111827;
          font-weight: 950;
        }

        .dac-page.dark .dac-table th {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
        }

        .dac-table td {
          color: #dc2626;
        }

        .dac-view-btn {
          border: 0;
          background: transparent;
          color: #111827;
          font-weight: 950;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .dac-page.dark .dac-view-btn {
          color: #f8fafc;
        }

        .dac-view-btn:hover {
          color: #2563eb;
        }

        .dac-empty {
          min-height: 380px;
          display: grid;
          place-items: center;
          text-align: center;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          color: #64748b;
          padding: 30px;
        }

        .dac-page.dark .dac-empty {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }

        .dac-empty svg {
          width: 72px;
          height: 72px;
          margin-bottom: 14px;
          color: #2563eb;
        }

        .dac-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.62);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .dac-modal {
          width: min(820px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          background: #ffffff;
          color: #111827;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 35px 100px rgba(15, 23, 42, 0.32);
          position: relative;
        }

        .dac-page.dark .dac-modal {
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dac-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 50%;
          background: #f1f5f9;
          color: #111827;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .dac-page.dark .dac-modal-close {
          background: rgba(255, 255, 255, 0.08);
          color: #f8fafc;
        }

        .dac-toast {
          position: fixed;
          right: 24px;
          top: 92px;
          z-index: 99999;
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

        .dac-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .dac-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .dac-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .dac-shell {
            grid-template-columns: 1fr;
          }

          .dac-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .dac-hero {
            padding: 52px 5% 34px;
          }

          .dac-hero h1 {
            font-size: clamp(2.1rem, 11vw, 3.2rem);
            letter-spacing: -0.045em;
          }

          .dac-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .dac-shell {
            padding: 32px 5% 60px;
          }

          .dac-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .dac-primary,
          .dac-dark,
          .dac-light,
          .dac-danger {
            width: 100%;
          }

          .dac-info-grid {
            grid-template-columns: 1fr;
          }

          .dac-big-result {
            padding: 24px;
            border-radius: 24px;
          }

          .dac-big-result h2 {
            font-size: clamp(1.85rem, 10vw, 2.65rem);
          }

          .dac-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .dac-card,
          .dac-modal {
            padding: 16px;
            border-radius: 18px;
          }

          .dac-shell {
            padding: 24px 4.5% 48px;
          }

          .dac-field input {
            padding: 12px;
            border-radius: 13px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      {toast && (
        <div className={`dac-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      {selectedReport && (
        <div className="dac-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="dac-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dac-modal-close"
              onClick={() => setSelectedReport(null)}
              aria-label="Close modal"
            >
              <X />
            </button>

            <h3>{t.fullReport}</h3>

            <div className="dac-info-grid">
              <InfoBox label={t.domain} value={selectedReport.domain} icon={<Globe2 size={15} />} />
              <InfoBox label={t.webPage} value={selectedReport.webPage} icon={<ExternalLink size={15} />} />
              <InfoBox label={t.domainAge} value={getAgeText(selectedReport.age)} icon={<Clock size={15} />} />
              <InfoBox label={t.totalDays} value={selectedReport.age?.totalDays} icon={<CalendarDays size={15} />} />
              <InfoBox label={t.creationDate} value={formatDate(selectedReport.creationDate)} icon={<CalendarDays size={15} />} />
              <InfoBox label={t.expiryDate} value={formatDate(selectedReport.expiryDate)} icon={<CalendarDays size={15} />} />
              <InfoBox label={t.updatedDate} value={formatDate(selectedReport.updatedDate)} icon={<CalendarDays size={15} />} />
              <InfoBox label={t.registrar} value={selectedReport.registrar} icon={<Building2 size={15} />} />
              <InfoBox
                label={t.nameservers}
                value={
                  selectedReport.nameservers?.length
                    ? selectedReport.nameservers.join(", ")
                    : ""
                }
                icon={<Server size={15} />}
              />
              <InfoBox
                label={t.status}
                value={
                  selectedReport.status?.length ? selectedReport.status.join(", ") : ""
                }
                icon={<CheckCircle size={15} />}
              />
              <InfoBox label={t.source} value={selectedReport.source} icon={<Search size={15} />} />
              <InfoBox label={t.checkedAt} value={selectedReport.checkedAt} icon={<Clock size={15} />} />
            </div>
          </div>
        </div>
      )}

      <section className="dac-hero">
        <p className="dac-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="dac-shell">
        <div className="dac-left">
          <div className="dac-card">
            <h3>{t.checkerTitle}</h3>

            <label className="dac-field">
              {t.domainLabel}
              <input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder={t.domainPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") checkDomain();
                }}
              />
            </label>

            {error && <div className="dac-error">{error}</div>}

            <div className="dac-actions">
              <button
                type="button"
                className="dac-primary"
                onClick={checkDomain}
                disabled={checking}
              >
                <Search />
                {checking ? t.checking : t.checkNow}
              </button>

              <button
                type="button"
                className="dac-dark"
                onClick={copyResult}
                disabled={!history.length}
              >
                <Copy />
                {t.copyResult}
              </button>
            </div>

            <div className="dac-actions">
              <button
                type="button"
                className="dac-light"
                onClick={downloadResult}
                disabled={!history.length}
              >
                <Download />
                {t.downloadTxt}
              </button>

              <button type="button" className="dac-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="dac-card">
            <h3>{t.noteTitle}</h3>
            <div className="dac-note">{t.note}</div>
          </div>
        </div>

        <div className="dac-right">
          {history.length === 0 ? (
            <div className="dac-card">
              <div className="dac-empty">
                <div>
                  <Globe2 />
                  <h3>{t.domainAge}</h3>
                  <p>{t.domainPlaceholder}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="dac-card">
                <div className="dac-big-result">
                  <span>{t.domainAge}</span>
                  <h2>{getAgeText(history[0].age)}</h2>
                  <p>
                    {t.domain}: {history[0].domain}
                    <br />
                    {t.creationDate}:{" "}
                    {formatDate(history[0].creationDate) || t.notAvailable}
                  </p>

                  <a
                    className="dac-link"
                    href={history[0].webPage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={16} />
                    {t.visit}
                  </a>
                </div>
              </div>

              <div className="dac-card">
                <h3>{t.resultTitle}</h3>

                <div className="dac-info-grid">
                  <InfoBox
                    label={t.creationDate}
                    value={formatDate(history[0].creationDate)}
                    icon={<CalendarDays size={15} />}
                  />

                  <InfoBox
                    label={t.expiryDate}
                    value={formatDate(history[0].expiryDate)}
                    icon={<CalendarDays size={15} />}
                  />

                  <InfoBox
                    label={t.registrar}
                    value={history[0].registrar}
                    icon={<Building2 size={15} />}
                  />

                  <InfoBox
                    label={t.totalDays}
                    value={history[0].age?.totalDays}
                    icon={<Clock size={15} />}
                  />
                </div>
              </div>

              <div className="dac-card">
                <h3>{t.historyTitle}</h3>

                <div className="dac-table-wrap">
                  <table className="dac-table">
                    <thead>
                      <tr>
                        <th>{t.serial}</th>
                        <th>{t.webPage}</th>
                        <th>{t.domainAge}</th>
                        <th>{t.history}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.webPage}</td>
                          <td>{getAgeText(item.age)}</td>
                          <td>
                            <button
                              type="button"
                              className="dac-view-btn"
                              onClick={() => setSelectedReport(item)}
                            >
                              <Eye size={16} />
                              {t.view}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}