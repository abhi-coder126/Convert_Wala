import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Calendar,
  Copy,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  Gift,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pad = (num) => String(num).padStart(2, "0");

const todayInput = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const pageText = {
  en: {
    seoTitle: "Free Age Calculator Online - Calculate Exact Age | Convert Wala",
    seoDescription:
      "Calculate your exact age online in years, months, days, weeks, hours and minutes with Convert Wala Age Calculator. Also check next birthday countdown.",
    seoKeywords:
      "age calculator, free age calculator, calculate age online, exact age calculator, birthday calculator, age in years months days, Convert Wala daily tools",

    eyebrow: "Convert Wala Daily Tool",
    heading: "Age Calculator",
    subtitle:
      "Calculate exact age in years, months and days. Also get total days, weeks, hours, minutes and next birthday countdown.",

    enterDetails: "Enter Date Details",
    dobLabel: "Date of Birth",
    calculateOn: "Calculate Age On",
    setToday: "Set Today",
    copyResult: "Copy Result",
    reset: "Reset",

    quickInfo: "Quick Info",
    quickNote:
      "Select DOB and age will be calculated instantly. This tool is useful for birthday, school forms, job forms, document verification and daily age calculation.",

    ageResult: "Age Result",
    emptyText: "Select date of birth to calculate age.",
    exactAge: "Exact Age",
    bornOn: "Born on",

    years: "Years",
    months: "Months",
    days: "Days",
    totalDays: "Total Days",
    totalWeeks: "Total Weeks",
    totalMonths: "Total Months",
    totalHours: "Total Hours",
    totalMinutes: "Total Minutes",
    nextBirthday: "Next Birthday",
    daysLeft: "Days Left",
    copyFullResult: "Copy Full Result",

    invalidDate: "Invalid date selected.",
    futureDob: "Date of birth cannot be in the future.",
    resetDone: "Calculator reset successfully.",
    todaySet: "Calculate date set to today.",
    noCopyResult: "No valid result to copy.",
    copied: "Age result copied.",
    copyFailed: "Copy failed.",

    copyTitle: "Age Calculator Result",
    copyDob: "Date of Birth",
    copyBornDay: "Born Day",
    copyAgeOn: "Age On",
    copyExactAge: "Exact Age",
    copyTotal: "Total",
    copyNextBirthday: "Next Birthday",
  },

  hi: {
    seoTitle: "Free Age Calculator Online - Exact Age Calculate करें | Convert Wala",
    seoDescription:
      "Convert Wala Age Calculator से अपनी exact age online calculate करें। Years, months, days, weeks, hours, minutes और next birthday countdown देखें।",
    seoKeywords:
      "age calculator, age calculate kare, exact age calculator, birthday calculator, age in years months days, Convert Wala daily tools",

    eyebrow: "Convert Wala Daily टूल",
    heading: "Age Calculator",
    subtitle:
      "अपनी exact age years, months और days में calculate करें। साथ में total days, weeks, hours, minutes और next birthday countdown भी देखें।",

    enterDetails: "Date Details Enter करें",
    dobLabel: "Date of Birth",
    calculateOn: "Age Calculate करने की Date",
    setToday: "Today Set करें",
    copyResult: "Result Copy करें",
    reset: "Reset करें",

    quickInfo: "Quick Info",
    quickNote:
      "DOB select करते ही age instantly calculate हो जाएगी। यह tool birthday, school form, job form, document verification और daily age calculation के लिए useful है।",

    ageResult: "Age Result",
    emptyText: "Age calculate करने के लिए date of birth select करें।",
    exactAge: "Exact Age",
    bornOn: "Born on",

    years: "Years",
    months: "Months",
    days: "Days",
    totalDays: "Total Days",
    totalWeeks: "Total Weeks",
    totalMonths: "Total Months",
    totalHours: "Total Hours",
    totalMinutes: "Total Minutes",
    nextBirthday: "Next Birthday",
    daysLeft: "Days Left",
    copyFullResult: "Full Result Copy करें",

    invalidDate: "Invalid date selected.",
    futureDob: "Date of birth future में नहीं हो सकती।",
    resetDone: "Calculator reset हो गया।",
    todaySet: "Calculate date today set हो गई।",
    noCopyResult: "Copy करने के लिए valid result नहीं है।",
    copied: "Age result copy हो गया।",
    copyFailed: "Copy failed.",

    copyTitle: "Age Calculator Result",
    copyDob: "Date of Birth",
    copyBornDay: "Born Day",
    copyAgeOn: "Age On",
    copyExactAge: "Exact Age",
    copyTotal: "Total",
    copyNextBirthday: "Next Birthday",
  },

  hinglish: {
    seoTitle: "Free Age Calculator Online - Calculate Exact Age | Convert Wala",
    seoDescription:
      "Convert Wala Age Calculator se exact age online calculate karo. Years, months, days, weeks, hours, minutes aur next birthday countdown dekho.",
    seoKeywords:
      "age calculator, free age calculator, calculate age online, exact age calculator, birthday calculator, Convert Wala daily tools",

    eyebrow: "Convert Wala Daily Tool",
    heading: "Age Calculator",
    subtitle:
      "Exact age years, months aur days me calculate karo. Total days, weeks, hours, minutes aur next birthday countdown bhi dekho.",

    enterDetails: "Enter Date Details",
    dobLabel: "Date of Birth",
    calculateOn: "Calculate Age On",
    setToday: "Set Today",
    copyResult: "Copy Result",
    reset: "Reset",

    quickInfo: "Quick Info",
    quickNote:
      "DOB select karo aur age instantly calculate ho jayegi. Ye tool birthday, school form, job form, document verification aur daily age calculation ke liye useful hai.",

    ageResult: "Age Result",
    emptyText: "Age calculate karne ke liye date of birth select karo.",
    exactAge: "Exact Age",
    bornOn: "Born on",

    years: "Years",
    months: "Months",
    days: "Days",
    totalDays: "Total Days",
    totalWeeks: "Total Weeks",
    totalMonths: "Total Months",
    totalHours: "Total Hours",
    totalMinutes: "Total Minutes",
    nextBirthday: "Next Birthday",
    daysLeft: "Days Left",
    copyFullResult: "Copy Full Result",

    invalidDate: "Invalid date selected.",
    futureDob: "Date of birth future me nahi ho sakti.",
    resetDone: "Calculator reset ho gaya.",
    todaySet: "Calculate date today set ho gaya.",
    noCopyResult: "Copy karne ke liye valid result nahi hai.",
    copied: "Age result copied.",
    copyFailed: "Copy failed.",

    copyTitle: "Age Calculator Result",
    copyDob: "Date of Birth",
    copyBornDay: "Born Day",
    copyAgeOn: "Age On",
    copyExactAge: "Exact Age",
    copyTotal: "Total",
    copyNextBirthday: "Next Birthday",
  },
};

const getLocale = (language) => (language === "hi" ? "hi-IN" : "en-IN");

const formatDate = (date, language = "en") => {
  return date.toLocaleDateString(getLocale(language), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getDayName = (date, language = "en") => {
  return date.toLocaleDateString(getLocale(language), { weekday: "long" });
};

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getSafeBirthday = (year, month, day) => {
  if (month === 1 && day === 29 && !isLeapYear(year)) {
    return new Date(year, 1, 28);
  }

  return new Date(year, month, day);
};

const calculateAgeData = (dobValue, targetValue, language = "en") => {
  if (!dobValue || !targetValue) return null;

  const dob = new Date(`${dobValue}T00:00:00`);
  const target = new Date(`${targetValue}T00:00:00`);

  if (Number.isNaN(dob.getTime()) || Number.isNaN(target.getTime())) {
    return { errorKey: "invalidDate" };
  }

  if (dob > target) {
    return { errorKey: "futureDob" };
  }

  let years = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth() - dob.getMonth();
  let days = target.getDate() - dob.getDate();

  if (days < 0) {
    const previousMonthLastDay = new Date(
      target.getFullYear(),
      target.getMonth(),
      0
    ).getDate();

    days += previousMonthLastDay;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffMs = target.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingWeekDays = totalDays % 7;
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const birthdayThisYear = getSafeBirthday(
    target.getFullYear(),
    dob.getMonth(),
    dob.getDate()
  );

  const nextBirthday =
    birthdayThisYear >= target
      ? birthdayThisYear
      : getSafeBirthday(target.getFullYear() + 1, dob.getMonth(), dob.getDate());

  const daysToBirthday = Math.ceil(
    (nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    dob,
    target,
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingWeekDays,
    totalMonths,
    totalHours,
    totalMinutes,
    nextBirthday,
    daysToBirthday,
    bornDay: getDayName(dob, language),
    targetDay: getDayName(target, language),
  };
};

export default function AgeCalculator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(todayInput());
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/age-calculator";

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

  const result = useMemo(() => {
    return calculateAgeData(dob, targetDate, language);
  }, [dob, targetDate, language]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const resetAll = () => {
    setDob("");
    setTargetDate(todayInput());
    showToast("success", t.resetDone);
  };

  const setToday = () => {
    setTargetDate(todayInput());
    showToast("success", t.todaySet);
  };

  const copyResult = async () => {
    if (!result || result.errorKey) {
      showToast("error", t.noCopyResult);
      return;
    }

    const text = `${t.copyTitle}

${t.copyDob}: ${formatDate(result.dob, language)}
${t.copyBornDay}: ${result.bornDay}
${t.copyAgeOn}: ${formatDate(result.target, language)}

${t.copyExactAge}:
${result.years} years, ${result.months} months, ${result.days} days

${t.copyTotal}:
${result.totalMonths} months
${result.totalWeeks} weeks and ${result.remainingWeekDays} days
${result.totalDays} days
${result.totalHours} hours
${result.totalMinutes} minutes

${t.copyNextBirthday}:
${formatDate(result.nextBirthday, language)}
${t.daysLeft}: ${result.daysToBirthday}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  return (
    <main className={`ac-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Age Calculator",
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
              "Calculate exact age",
              "Age in years months and days",
              "Total days weeks hours and minutes",
              "Next birthday countdown",
              "Copy age result",
              "Browser-based age calculator",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .ac-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .ac-page * {
          box-sizing: border-box;
        }

        .ac-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .ac-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .ac-page.dark .ac-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .ac-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .ac-page.dark .ac-eyebrow {
          color: #93c5fd;
        }

        .ac-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .ac-page.dark .ac-hero h1 {
          color: #f8fafc;
        }

        .ac-hero p {
          max-width: 820px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .ac-page.dark .ac-hero p,
        .ac-page.dark .ac-empty,
        .ac-page.dark .ac-result-box span {
          color: #cbd5e1;
        }

        .ac-shell {
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(330px, 0.9fr) minmax(420px, 1.1fr);
          gap: 28px;
          align-items: start;
        }

        .ac-left,
        .ac-right {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1101px) {
          .ac-right {
            position: sticky;
            top: 18px;
          }
        }

        .ac-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .ac-page.dark .ac-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .ac-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.12rem;
        }

        .ac-page.dark .ac-card h3,
        .ac-page.dark .ac-field,
        .ac-page.dark .ac-result-box strong {
          color: #f8fafc;
        }

        .ac-field {
          display: block;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 14px;
        }

        .ac-field input {
          width: 100%;
          margin-top: 8px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 16px;
          padding: 14px 15px;
          outline: none;
          font-weight: 900;
          font-family: inherit;
        }

        .ac-page.dark .ac-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ac-field input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .ac-page.dark .ac-field input:focus {
          background: #020617;
        }

        .ac-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .ac-primary,
        .ac-dark,
        .ac-light,
        .ac-danger {
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
        }

        .ac-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .ac-dark {
          background: #111827;
          color: #ffffff;
        }

        .ac-page.dark .ac-dark {
          background: #f8fafc;
          color: #111827;
        }

        .ac-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .ac-page.dark .ac-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .ac-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .ac-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 18px;
          padding: 16px;
          font-weight: 900;
          line-height: 1.6;
        }

        .ac-big-result {
          background:
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.26), transparent 34%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(37, 99, 235, 0.22);
        }

        .ac-big-result span {
          display: block;
          opacity: 0.85;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .ac-big-result h2 {
          margin: 0;
          font-size: clamp(2.2rem, 4vw, 4.4rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .ac-big-result p {
          margin: 14px 0 0;
          opacity: 0.9;
          line-height: 1.7;
          font-weight: 800;
        }

        .ac-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .ac-result-box {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 16px;
          min-width: 0;
        }

        .ac-page.dark .ac-result-box,
        .ac-page.dark .ac-empty {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .ac-result-box span {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .ac-result-box strong {
          display: block;
          color: #111827;
          font-size: 1.3rem;
          word-break: break-word;
        }

        .ac-mini {
          font-size: 0.94rem !important;
          line-height: 1.45;
        }

        .ac-empty {
          min-height: 360px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #94a3b8;
          padding: 30px;
        }

        .ac-empty svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .ac-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .ac-toast {
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

        .ac-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .ac-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ac-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .ac-shell {
            grid-template-columns: 1fr;
          }

          .ac-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .ac-hero {
            padding: 52px 5% 34px;
          }

          .ac-hero h1 {
            font-size: 2.2rem;
          }

          .ac-shell {
            padding: 32px 5% 60px;
          }

          .ac-result-grid {
            grid-template-columns: 1fr;
          }

          .ac-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ac-primary,
          .ac-dark,
          .ac-light,
          .ac-danger {
            width: 100%;
          }

          .ac-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .ac-card {
            padding: 16px;
            border-radius: 18px;
          }

          .ac-shell {
            padding: 24px 4.5% 48px;
          }

          .ac-big-result {
            padding: 22px;
            border-radius: 22px;
          }
        }
      `}</style>

      {toast && (
        <div className={`ac-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="ac-hero">
        <p className="ac-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="ac-shell">
        <div className="ac-left">
          <div className="ac-card">
            <h3>{t.enterDetails}</h3>

            <label className="ac-field">
              {t.dobLabel}
              <input
                type="date"
                value={dob}
                max={targetDate || todayInput()}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>

            <label className="ac-field">
              {t.calculateOn}
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </label>

            <div className="ac-actions">
              <button type="button" className="ac-light" onClick={setToday}>
                <Calendar />
                {t.setToday}
              </button>

              <button type="button" className="ac-dark" onClick={copyResult}>
                <Copy />
                {t.copyResult}
              </button>
            </div>

            <div className="ac-actions">
              <button type="button" className="ac-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="ac-card">
            <h3>{t.quickInfo}</h3>

            <div className="ac-note">{t.quickNote}</div>
          </div>
        </div>

        <div className="ac-right">
          <div className="ac-card">
            <h3>{t.ageResult}</h3>

            {!dob ? (
              <div className="ac-empty">
                <div>
                  <Calendar />
                  <p>{t.emptyText}</p>
                </div>
              </div>
            ) : result?.errorKey ? (
              <div className="ac-error">{t[result.errorKey]}</div>
            ) : result ? (
              <>
                <div className="ac-big-result">
                  <span>{t.exactAge}</span>
                  <h2>
                    {result.years}y {result.months}m {result.days}d
                  </h2>
                  <p>
                    {t.bornOn} {formatDate(result.dob, language)} ({result.bornDay})
                  </p>
                </div>

                <div className="ac-result-grid" style={{ marginTop: 16 }}>
                  <div className="ac-result-box">
                    <span>
                      <Calendar size={16} />
                      {t.years}
                    </span>
                    <strong>{result.years}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Calendar size={16} />
                      {t.months}
                    </span>
                    <strong>{result.months}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Calendar size={16} />
                      {t.days}
                    </span>
                    <strong>{result.days}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Clock size={16} />
                      {t.totalDays}
                    </span>
                    <strong>{result.totalDays}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Clock size={16} />
                      {t.totalWeeks}
                    </span>
                    <strong className="ac-mini">
                      {result.totalWeeks} weeks, {result.remainingWeekDays} days
                    </strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Clock size={16} />
                      {t.totalMonths}
                    </span>
                    <strong>{result.totalMonths}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Clock size={16} />
                      {t.totalHours}
                    </span>
                    <strong>{result.totalHours}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Clock size={16} />
                      {t.totalMinutes}
                    </span>
                    <strong>{result.totalMinutes}</strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Gift size={16} />
                      {t.nextBirthday}
                    </span>
                    <strong className="ac-mini">
                      {formatDate(result.nextBirthday, language)}
                    </strong>
                  </div>

                  <div className="ac-result-box">
                    <span>
                      <Gift size={16} />
                      {t.daysLeft}
                    </span>
                    <strong>{result.daysToBirthday}</strong>
                  </div>
                </div>

                <div className="ac-actions">
                  <button type="button" className="ac-primary" onClick={copyResult}>
                    <Copy />
                    {t.copyFullResult}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}