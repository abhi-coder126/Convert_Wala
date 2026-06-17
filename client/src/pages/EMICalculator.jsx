import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  Copy,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Clock,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Free EMI Calculator Online - Loan EMI Calculator | Convert Wala",
    seoDescription:
      "Calculate monthly EMI, total interest, total payment and total loan cost online with Convert Wala EMI Calculator for home loan, car loan, personal loan and business loan.",
    seoKeywords:
      "EMI calculator, loan EMI calculator, home loan EMI calculator, car loan EMI calculator, personal loan EMI calculator, monthly EMI calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "EMI Calculator",
    subtitle:
      "Calculate monthly EMI, total interest, total payment and loan cost for home loan, car loan, personal loan or business loan.",

    loanDetails: "Loan Details",
    loanAmount: "Loan Amount",
    annualInterest: "Annual Interest Rate %",
    tenureYears: "Tenure Years",
    extraMonths: "Extra Months",
    processingFee: "Processing Fee / Extra Charges",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "EMI formula is based on the standard monthly reducing balance method. Actual bank EMI may differ slightly depending on processing fee, insurance, GST, floating rate and bank rules.",

    emiResult: "EMI Result",
    monthlyEmi: "Monthly EMI",
    tenureText: "Loan tenure",
    monthsText: "months",
    totalPaymentText: "Total payment",
    willBeText: "will be",

    tenure: "Tenure",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment",
    totalCost: "Total Cost",
    principal: "Principal",
    interest: "Interest",
    copyEmiSummary: "Copy EMI Summary",
    emptyResult:
      "Enter valid loan amount and tenure, EMI result will appear here.",

    resetDone: "EMI calculator reset successfully.",
    invalidResult: "Valid EMI result is not available.",
    copied: "EMI result copied.",
    copyFailed: "Copy failed.",
    downloaded: "EMI result downloaded.",

    copyTitle: "EMI Calculator Result",
    copyLoanAmount: "Loan Amount",
    copyInterestRate: "Interest Rate",
    copyPerYear: "per year",
    copyTenure: "Tenure",
    copyProcessingFee: "Processing Fee",
    copyMonthlyEmi: "Monthly EMI",
    copyTotalInterest: "Total Interest",
    copyTotalPayment: "Total Payment",
    copyTotalCostWithFee: "Total Cost With Fee",
  },

  hi: {
    seoTitle: "Free EMI Calculator Online - Loan EMI Calculate करें | Convert Wala",
    seoDescription:
      "Convert Wala EMI Calculator से home loan, car loan, personal loan और business loan की monthly EMI, total interest, total payment और total loan cost calculate करें।",
    seoKeywords:
      "EMI calculator, loan EMI calculator, EMI calculate kare, home loan EMI calculator, car loan EMI calculator, personal loan EMI calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance टूल",
    heading: "EMI Calculator",
    subtitle:
      "Home loan, car loan, personal loan या business loan की monthly EMI, total interest, total payment और loan cost calculate करें।",

    loanDetails: "Loan Details",
    loanAmount: "Loan Amount",
    annualInterest: "Annual Interest Rate %",
    tenureYears: "Tenure Years",
    extraMonths: "Extra Months",
    processingFee: "Processing Fee / Extra Charges",
    copyResult: "Result Copy करें",
    downloadTxt: "TXT Download करें",
    reset: "Reset करें",

    quickNoteTitle: "Quick Note",
    quickNote:
      "EMI formula standard monthly reducing balance method पर based है। Actual bank EMI processing fee, insurance, GST, floating rate और bank rules के हिसाब से थोड़ी different हो सकती है।",

    emiResult: "EMI Result",
    monthlyEmi: "Monthly EMI",
    tenureText: "Loan tenure",
    monthsText: "months",
    totalPaymentText: "Total payment",
    willBeText: "होगा",

    tenure: "Tenure",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment",
    totalCost: "Total Cost",
    principal: "Principal",
    interest: "Interest",
    copyEmiSummary: "EMI Summary Copy करें",
    emptyResult:
      "Valid loan amount और tenure enter करें, EMI result यहां show होगा।",

    resetDone: "EMI calculator reset हो गया।",
    invalidResult: "Valid EMI result नहीं है।",
    copied: "EMI result copy हो गया।",
    copyFailed: "Copy failed.",
    downloaded: "EMI result download हो गया।",

    copyTitle: "EMI Calculator Result",
    copyLoanAmount: "Loan Amount",
    copyInterestRate: "Interest Rate",
    copyPerYear: "per year",
    copyTenure: "Tenure",
    copyProcessingFee: "Processing Fee",
    copyMonthlyEmi: "Monthly EMI",
    copyTotalInterest: "Total Interest",
    copyTotalPayment: "Total Payment",
    copyTotalCostWithFee: "Total Cost With Fee",
  },

  hinglish: {
    seoTitle: "Free EMI Calculator Online - Loan EMI Calculator | Convert Wala",
    seoDescription:
      "Convert Wala EMI Calculator se home loan, car loan, personal loan aur business loan ki monthly EMI, total interest, total payment aur total loan cost calculate karo.",
    seoKeywords:
      "EMI calculator, loan EMI calculator, home loan EMI calculator, car loan EMI calculator, personal loan EMI calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "EMI Calculator",
    subtitle:
      "Home loan, car loan, personal loan ya business loan ki monthly EMI, total interest, total payment aur loan cost calculate karo.",

    loanDetails: "Loan Details",
    loanAmount: "Loan Amount",
    annualInterest: "Annual Interest Rate %",
    tenureYears: "Tenure Years",
    extraMonths: "Extra Months",
    processingFee: "Processing Fee / Extra Charges",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "EMI formula standard monthly reducing balance method par based hai. Actual bank EMI processing fee, insurance, GST, floating rate aur bank rules ke hisaab se thodi different ho sakti hai.",

    emiResult: "EMI Result",
    monthlyEmi: "Monthly EMI",
    tenureText: "Loan tenure",
    monthsText: "months",
    totalPaymentText: "Total payment",
    willBeText: "hoga",

    tenure: "Tenure",
    totalInterest: "Total Interest",
    totalPayment: "Total Payment",
    totalCost: "Total Cost",
    principal: "Principal",
    interest: "Interest",
    copyEmiSummary: "Copy EMI Summary",
    emptyResult:
      "Valid loan amount aur tenure enter karo, EMI result yaha show hoga.",

    resetDone: "EMI calculator reset ho gaya.",
    invalidResult: "Valid EMI result nahi hai.",
    copied: "EMI result copied.",
    copyFailed: "Copy failed.",
    downloaded: "EMI result downloaded.",

    copyTitle: "EMI Calculator Result",
    copyLoanAmount: "Loan Amount",
    copyInterestRate: "Interest Rate",
    copyPerYear: "per year",
    copyTenure: "Tenure",
    copyProcessingFee: "Processing Fee",
    copyMonthlyEmi: "Monthly EMI",
    copyTotalInterest: "Total Interest",
    copyTotalPayment: "Total Payment",
    copyTotalCostWithFee: "Total Cost With Fee",
  },
};

const formatMoney = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const formatDecimalMoney = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

export default function EMICalculator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [tenureMonths, setTenureMonths] = useState(0);
  const [processingFee, setProcessingFee] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/emi-calculator";

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
    const principal = Number(loanAmount || 0);
    const annualRate = Number(interestRate || 0);
    const totalMonths = Number(tenureYears || 0) * 12 + Number(tenureMonths || 0);
    const fee = Number(processingFee || 0);

    if (principal <= 0 || totalMonths <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 12 / 100;

    let emi = 0;

    if (monthlyRate === 0) {
      emi = principal / totalMonths;
    } else {
      emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;
    const totalCost = totalPayment + fee;

    const principalPercent = totalCost > 0 ? (principal / totalCost) * 100 : 0;
    const interestPercent = totalCost > 0 ? (totalInterest / totalCost) * 100 : 0;
    const feePercent = totalCost > 0 ? (fee / totalCost) * 100 : 0;

    return {
      emi,
      principal,
      totalMonths,
      totalPayment,
      totalInterest,
      processingFee: fee,
      totalCost,
      principalPercent,
      interestPercent,
      feePercent,
    };
  }, [loanAmount, interestRate, tenureYears, tenureMonths, processingFee]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const resetAll = () => {
    setLoanAmount(1000000);
    setInterestRate(9.5);
    setTenureYears(5);
    setTenureMonths(0);
    setProcessingFee(0);
    showToast("success", t.resetDone);
  };

  const copyResult = async () => {
    if (!result) {
      showToast("error", t.invalidResult);
      return;
    }

    const text = `${t.copyTitle}

${t.copyLoanAmount}: ${formatMoney(result.principal)}
${t.copyInterestRate}: ${interestRate}% ${t.copyPerYear}
${t.copyTenure}: ${result.totalMonths} ${t.monthsText}
${t.copyProcessingFee}: ${formatMoney(result.processingFee)}

${t.copyMonthlyEmi}: ${formatDecimalMoney(result.emi)}
${t.copyTotalInterest}: ${formatDecimalMoney(result.totalInterest)}
${t.copyTotalPayment}: ${formatDecimalMoney(result.totalPayment)}
${t.copyTotalCostWithFee}: ${formatDecimalMoney(result.totalCost)}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadResult = () => {
    if (!result) {
      showToast("error", t.invalidResult);
      return;
    }

    const text = `Convert Wala ${t.copyTitle}

${t.copyLoanAmount}: ${formatMoney(result.principal)}
${t.copyInterestRate}: ${interestRate}% ${t.copyPerYear}
${t.copyTenure}: ${result.totalMonths} ${t.monthsText}
${t.copyProcessingFee}: ${formatMoney(result.processingFee)}

${t.copyMonthlyEmi}: ${formatDecimalMoney(result.emi)}
${t.copyTotalInterest}: ${formatDecimalMoney(result.totalInterest)}
${t.copyTotalPayment}: ${formatDecimalMoney(result.totalPayment)}
${t.copyTotalCostWithFee}: ${formatDecimalMoney(result.totalCost)}
`;

    downloadTextFile(text, "Convert Wala_EMI_Result.txt");
    showToast("success", t.downloaded);
  };

  return (
    <main className={`emi-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala EMI Calculator",
            url: canonicalUrl,
            applicationCategory: "FinanceApplication",
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
              "Calculate monthly EMI",
              "Calculate total interest",
              "Calculate total payment",
              "Loan cost breakdown",
              "Copy EMI summary",
              "Download EMI result",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .emi-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .emi-page * {
          box-sizing: border-box;
        }

        .emi-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .emi-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .emi-page.dark .emi-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .emi-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .emi-page.dark .emi-eyebrow {
          color: #93c5fd;
        }

        .emi-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .emi-page.dark .emi-hero h1 {
          color: #f8fafc;
        }

        .emi-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .emi-page.dark .emi-hero p,
        .emi-page.dark .emi-result-box span,
        .emi-page.dark .emi-chart-head {
          color: #cbd5e1;
        }

        .emi-shell {
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(330px, 0.9fr) minmax(420px, 1.1fr);
          gap: 28px;
          align-items: start;
        }

        .emi-left,
        .emi-right {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1101px) {
          .emi-right {
            position: sticky;
            top: 18px;
          }
        }

        .emi-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .emi-page.dark .emi-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .emi-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.12rem;
        }

        .emi-page.dark .emi-card h3,
        .emi-page.dark .emi-field,
        .emi-page.dark .emi-result-box strong {
          color: #f8fafc;
        }

        .emi-field {
          display: block;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .emi-field input {
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

        .emi-page.dark .emi-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .emi-field input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .emi-page.dark .emi-field input:focus {
          background: #020617;
        }

        .emi-range {
          margin-top: 10px;
          width: 100%;
          accent-color: #2563eb;
        }

        .emi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .emi-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .emi-primary,
        .emi-dark,
        .emi-light,
        .emi-danger {
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

        .emi-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .emi-dark {
          background: #111827;
          color: #ffffff;
        }

        .emi-page.dark .emi-dark {
          background: #f8fafc;
          color: #111827;
        }

        .emi-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .emi-page.dark .emi-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .emi-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .emi-big-result {
          background:
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.26), transparent 34%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(37, 99, 235, 0.22);
        }

        .emi-big-result span {
          display: block;
          opacity: 0.85;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .emi-big-result h2 {
          margin: 0;
          font-size: clamp(2.3rem, 4vw, 4.6rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .emi-big-result p {
          margin: 14px 0 0;
          opacity: 0.9;
          line-height: 1.7;
          font-weight: 800;
        }

        .emi-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .emi-result-box {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 16px;
          min-width: 0;
        }

        .emi-page.dark .emi-result-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .emi-result-box span {
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

        .emi-result-box strong {
          display: block;
          color: #111827;
          font-size: 1.25rem;
          word-break: break-word;
        }

        .emi-chart {
          display: grid;
          gap: 14px;
          margin-top: 16px;
        }

        .emi-chart-row {
          display: grid;
          gap: 8px;
        }

        .emi-chart-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          gap: 12px;
        }

        .emi-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .emi-page.dark .emi-bar {
          background: rgba(255, 255, 255, 0.1);
        }

        .emi-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #2563eb;
        }

        .emi-bar.interest span {
          background: #f97316;
        }

        .emi-bar.fee span {
          background: #16a34a;
        }

        .emi-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .emi-toast {
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

        .emi-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .emi-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .emi-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .emi-shell {
            grid-template-columns: 1fr;
          }

          .emi-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .emi-hero {
            padding: 52px 5% 34px;
          }

          .emi-hero h1 {
            font-size: 2.2rem;
          }

          .emi-shell {
            padding: 32px 5% 60px;
          }

          .emi-grid,
          .emi-result-grid {
            grid-template-columns: 1fr;
          }

          .emi-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .emi-primary,
          .emi-dark,
          .emi-light,
          .emi-danger {
            width: 100%;
          }

          .emi-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .emi-card {
            padding: 16px;
            border-radius: 18px;
          }

          .emi-shell {
            padding: 24px 4.5% 48px;
          }

          .emi-big-result {
            padding: 22px;
            border-radius: 22px;
          }

          .emi-big-result h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      {toast && (
        <div className={`emi-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="emi-hero">
        <p className="emi-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="emi-shell">
        <div className="emi-left">
          <div className="emi-card">
            <h3>{t.loanDetails}</h3>

            <label className="emi-field">
              {t.loanAmount}
              <input
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              <input
                className="emi-range"
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </label>

            <label className="emi-field">
              {t.annualInterest}
              <input
                type="number"
                min="0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <input
                className="emi-range"
                type="range"
                min="0"
                max="30"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </label>

            <div className="emi-grid">
              <label className="emi-field">
                {t.tenureYears}
                <input
                  type="number"
                  min="0"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                />
              </label>

              <label className="emi-field">
                {t.extraMonths}
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(e.target.value)}
                />
              </label>
            </div>

            <label className="emi-field">
              {t.processingFee}
              <input
                type="number"
                min="0"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
              />
            </label>

            <div className="emi-actions">
              <button type="button" className="emi-dark" onClick={copyResult}>
                <Copy />
                {t.copyResult}
              </button>

              <button type="button" className="emi-light" onClick={downloadResult}>
                <Download />
                {t.downloadTxt}
              </button>
            </div>

            <div className="emi-actions">
              <button type="button" className="emi-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="emi-card">
            <h3>{t.quickNoteTitle}</h3>

            <div className="emi-note">{t.quickNote}</div>
          </div>
        </div>

        <div className="emi-right">
          <div className="emi-card">
            <h3>{t.emiResult}</h3>

            {result ? (
              <>
                <div className="emi-big-result">
                  <span>{t.monthlyEmi}</span>
                  <h2>{formatDecimalMoney(result.emi)}</h2>
                  <p>
                    {t.tenureText} {result.totalMonths} {t.monthsText}{" "}
                    {language === "hi" ? "है।" : "hai."} {t.totalPaymentText}{" "}
                    {formatDecimalMoney(result.totalPayment)} {t.willBeText}.
                  </p>
                </div>

                <div className="emi-result-grid">
                  <div className="emi-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.loanAmount}
                    </span>
                    <strong>{formatMoney(result.principal)}</strong>
                  </div>

                  <div className="emi-result-box">
                    <span>
                      <Clock size={16} />
                      {t.tenure}
                    </span>
                    <strong>
                      {result.totalMonths} {t.monthsText}
                    </strong>
                  </div>

                  <div className="emi-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.totalInterest}
                    </span>
                    <strong>{formatDecimalMoney(result.totalInterest)}</strong>
                  </div>

                  <div className="emi-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.totalPayment}
                    </span>
                    <strong>{formatDecimalMoney(result.totalPayment)}</strong>
                  </div>

                  <div className="emi-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.processingFee}
                    </span>
                    <strong>{formatMoney(result.processingFee)}</strong>
                  </div>

                  <div className="emi-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.totalCost}
                    </span>
                    <strong>{formatDecimalMoney(result.totalCost)}</strong>
                  </div>
                </div>

                <div className="emi-chart">
                  <div className="emi-chart-row">
                    <div className="emi-chart-head">
                      <span>{t.principal}</span>
                      <strong>{result.principalPercent.toFixed(1)}%</strong>
                    </div>
                    <div className="emi-bar">
                      <span style={{ width: `${result.principalPercent}%` }} />
                    </div>
                  </div>

                  <div className="emi-chart-row">
                    <div className="emi-chart-head">
                      <span>{t.interest}</span>
                      <strong>{result.interestPercent.toFixed(1)}%</strong>
                    </div>
                    <div className="emi-bar interest">
                      <span style={{ width: `${result.interestPercent}%` }} />
                    </div>
                  </div>

                  {result.processingFee > 0 && (
                    <div className="emi-chart-row">
                      <div className="emi-chart-head">
                        <span>{t.processingFee}</span>
                        <strong>{result.feePercent.toFixed(1)}%</strong>
                      </div>
                      <div className="emi-bar fee">
                        <span style={{ width: `${result.feePercent}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="emi-actions">
                  <button type="button" className="emi-primary" onClick={copyResult}>
                    <Copy />
                    {t.copyEmiSummary}
                  </button>
                </div>
              </>
            ) : (
              <div className="emi-note">{t.emptyResult}</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}