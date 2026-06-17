import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  Copy,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Percent,
  IndianRupee,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Free GST Calculator Online - Add or Remove GST | Convert Wala",
    seoDescription:
      "Calculate GST amount, taxable value, total amount, CGST, SGST and IGST online with Convert Wala GST Calculator. Add GST or remove GST from inclusive amount.",
    seoKeywords:
      "GST calculator, GST amount calculator, add GST, remove GST, CGST SGST calculator, IGST calculator, taxable value calculator, invoice GST calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "GST Calculator",
    subtitle:
      "Calculate GST amount, taxable value, total amount, CGST + SGST or IGST for invoices, bills and business pricing.",

    gstDetails: "GST Details",
    addGst: "Add GST",
    amountPlusGst: "Amount + GST",
    removeGst: "Remove GST",
    gstIncluded: "GST Included",
    amount: "Amount",
    gstRate: "GST Rate",
    useCustomRate: "Use custom GST rate",
    customRate: "Custom GST Rate %",
    customRatePlaceholder: "Enter custom GST rate",
    taxType: "Tax Type",
    intraState: "Intra-State: CGST + SGST",
    interState: "Inter-State: IGST",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "In Add GST mode, entered amount is taxable value. In Remove GST mode, entered amount is GST-inclusive total, from which taxable value and GST amount are reverse calculated.",

    gstResult: "GST Result",
    finalAmount: "Final Amount",
    taxableAmountTitle: "Taxable Amount",
    gstRateText: "GST Rate",
    gstAmountText: "GST amount",
    calculatedText: "calculated",
    taxableAmount: "Taxable Amount",
    gstAmount: "GST Amount",
    totalAmount: "Total Amount",
    calculation: "Calculation",
    gstAdded: "GST Added",
    gstRemoved: "GST Removed",
    copyGstSummary: "Copy GST Summary",
    emptyResult: "Enter valid amount, GST result will appear here.",

    resetDone: "GST calculator reset successfully.",
    invalidResult: "Valid GST result is not available.",
    copied: "GST result copied.",
    copyFailed: "Copy failed.",
    downloaded: "GST result downloaded.",

    copyTitle: "GST Calculator Result",
    copyCalculationType: "Calculation Type",
    copyTaxType: "Tax Type",
    copyAddGst: "Add GST",
    copyRemoveGst: "Remove GST / Inclusive GST",
  },

  hi: {
    seoTitle: "Free GST Calculator Online - GST Add या Remove करें | Convert Wala",
    seoDescription:
      "Convert Wala GST Calculator से GST amount, taxable value, total amount, CGST, SGST और IGST online calculate करें। Add GST या inclusive amount से GST remove करें।",
    seoKeywords:
      "GST calculator, GST calculate kare, add GST, remove GST, CGST SGST calculator, IGST calculator, taxable value calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance टूल",
    heading: "GST Calculator",
    subtitle:
      "Invoices, bills और business pricing के लिए GST amount, taxable value, total amount, CGST + SGST या IGST calculate करें।",

    gstDetails: "GST Details",
    addGst: "GST Add करें",
    amountPlusGst: "Amount + GST",
    removeGst: "GST Remove करें",
    gstIncluded: "GST Included",
    amount: "Amount",
    gstRate: "GST Rate",
    useCustomRate: "Custom GST rate use करें",
    customRate: "Custom GST Rate %",
    customRatePlaceholder: "Custom GST rate enter करें",
    taxType: "Tax Type",
    intraState: "Intra-State: CGST + SGST",
    interState: "Inter-State: IGST",
    copyResult: "Result Copy करें",
    downloadTxt: "TXT Download करें",
    reset: "Reset करें",

    quickNoteTitle: "Quick Note",
    quickNote:
      "Add GST mode में entered amount taxable value होता है। Remove GST mode में entered amount GST-inclusive total होता है, जिसमें से taxable value और GST amount reverse calculate होता है।",

    gstResult: "GST Result",
    finalAmount: "Final Amount",
    taxableAmountTitle: "Taxable Amount",
    gstRateText: "GST Rate",
    gstAmountText: "GST amount",
    calculatedText: "calculate हुआ",
    taxableAmount: "Taxable Amount",
    gstAmount: "GST Amount",
    totalAmount: "Total Amount",
    calculation: "Calculation",
    gstAdded: "GST Added",
    gstRemoved: "GST Removed",
    copyGstSummary: "GST Summary Copy करें",
    emptyResult: "Valid amount enter करें, GST result यहां show होगा।",

    resetDone: "GST calculator reset हो गया।",
    invalidResult: "Valid GST result नहीं है।",
    copied: "GST result copy हो गया।",
    copyFailed: "Copy failed.",
    downloaded: "GST result download हो गया।",

    copyTitle: "GST Calculator Result",
    copyCalculationType: "Calculation Type",
    copyTaxType: "Tax Type",
    copyAddGst: "Add GST",
    copyRemoveGst: "Remove GST / Inclusive GST",
  },

  hinglish: {
    seoTitle: "Free GST Calculator Online - Add or Remove GST | Convert Wala",
    seoDescription:
      "Convert Wala GST Calculator se GST amount, taxable value, total amount, CGST, SGST aur IGST online calculate karo. Add GST ya inclusive amount se GST remove karo.",
    seoKeywords:
      "GST calculator, GST amount calculator, add GST, remove GST, CGST SGST calculator, IGST calculator, taxable value calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "GST Calculator",
    subtitle:
      "Invoices, bills aur business pricing ke liye GST amount, taxable value, total amount, CGST + SGST ya IGST calculate karo.",

    gstDetails: "GST Details",
    addGst: "Add GST",
    amountPlusGst: "Amount + GST",
    removeGst: "Remove GST",
    gstIncluded: "GST Included",
    amount: "Amount",
    gstRate: "GST Rate",
    useCustomRate: "Use custom GST rate",
    customRate: "Custom GST Rate %",
    customRatePlaceholder: "Enter custom GST rate",
    taxType: "Tax Type",
    intraState: "Intra-State: CGST + SGST",
    interState: "Inter-State: IGST",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "Add GST mode me entered amount taxable value hota hai. Remove GST mode me entered amount GST-inclusive total hota hai, jisme se taxable value aur GST amount reverse calculate hota hai.",

    gstResult: "GST Result",
    finalAmount: "Final Amount",
    taxableAmountTitle: "Taxable Amount",
    gstRateText: "GST Rate",
    gstAmountText: "GST amount",
    calculatedText: "calculate hua",
    taxableAmount: "Taxable Amount",
    gstAmount: "GST Amount",
    totalAmount: "Total Amount",
    calculation: "Calculation",
    gstAdded: "GST Added",
    gstRemoved: "GST Removed",
    copyGstSummary: "Copy GST Summary",
    emptyResult: "Valid amount enter karo, GST result yaha show hoga.",

    resetDone: "GST calculator reset ho gaya.",
    invalidResult: "Valid GST result nahi hai.",
    copied: "GST result copied.",
    copyFailed: "Copy failed.",
    downloaded: "GST result downloaded.",

    copyTitle: "GST Calculator Result",
    copyCalculationType: "Calculation Type",
    copyTaxType: "Tax Type",
    copyAddGst: "Add GST",
    copyRemoveGst: "Remove GST / Inclusive GST",
  },
};

const formatMoney = (amount) => {
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

export default function GSTCalculator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [customRate, setCustomRate] = useState("");
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [mode, setMode] = useState("exclusive");
  const [taxType, setTaxType] = useState("intra");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/gst-calculator";

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

  const finalRate = useMemo(() => {
    return useCustomRate ? Number(customRate || 0) : Number(gstRate || 0);
  }, [useCustomRate, customRate, gstRate]);

  const result = useMemo(() => {
    const inputAmount = Number(amount || 0);
    const rate = Number(finalRate || 0);

    if (inputAmount <= 0 || rate < 0) return null;

    let taxableAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (mode === "exclusive") {
      taxableAmount = inputAmount;
      gstAmount = (taxableAmount * rate) / 100;
      totalAmount = taxableAmount + gstAmount;
    } else {
      totalAmount = inputAmount;
      taxableAmount = totalAmount / (1 + rate / 100);
      gstAmount = totalAmount - taxableAmount;
    }

    const cgst = taxType === "intra" ? gstAmount / 2 : 0;
    const sgst = taxType === "intra" ? gstAmount / 2 : 0;
    const igst = taxType === "inter" ? gstAmount : 0;

    return {
      inputAmount,
      rate,
      taxableAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst,
      igst,
    };
  }, [amount, finalRate, mode, taxType]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const resetAll = () => {
    setAmount(10000);
    setGstRate(18);
    setCustomRate("");
    setUseCustomRate(false);
    setMode("exclusive");
    setTaxType("intra");
    showToast("success", t.resetDone);
  };

  const copyResult = async () => {
    if (!result) {
      showToast("error", t.invalidResult);
      return;
    }

    const text = `${t.copyTitle}

${t.copyCalculationType}: ${
      mode === "exclusive" ? t.copyAddGst : t.copyRemoveGst
    }
${t.copyTaxType}: ${taxType === "intra" ? "CGST + SGST" : "IGST"}
${t.gstRate}: ${result.rate}%

${t.taxableAmount}: ${formatMoney(result.taxableAmount)}
${t.gstAmount}: ${formatMoney(result.gstAmount)}
CGST: ${formatMoney(result.cgst)}
SGST: ${formatMoney(result.sgst)}
IGST: ${formatMoney(result.igst)}
${t.totalAmount}: ${formatMoney(result.totalAmount)}`;

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

${t.copyCalculationType}: ${
      mode === "exclusive" ? t.copyAddGst : t.copyRemoveGst
    }
${t.copyTaxType}: ${taxType === "intra" ? "CGST + SGST" : "IGST"}
${t.gstRate}: ${result.rate}%

${t.taxableAmount}: ${formatMoney(result.taxableAmount)}
${t.gstAmount}: ${formatMoney(result.gstAmount)}
CGST: ${formatMoney(result.cgst)}
SGST: ${formatMoney(result.sgst)}
IGST: ${formatMoney(result.igst)}
${t.totalAmount}: ${formatMoney(result.totalAmount)}
`;

    downloadTextFile(text, "Convert Wala_GST_Result.txt");
    showToast("success", t.downloaded);
  };

  return (
    <main className={`gst-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala GST Calculator",
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
              "Add GST calculation",
              "Remove GST from inclusive amount",
              "Calculate CGST and SGST",
              "Calculate IGST",
              "Copy GST summary",
              "Download GST result",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .gst-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .gst-page * {
          box-sizing: border-box;
        }

        .gst-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .gst-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .gst-page.dark .gst-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .gst-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .gst-page.dark .gst-eyebrow {
          color: #93c5fd;
        }

        .gst-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .gst-page.dark .gst-hero h1 {
          color: #f8fafc;
        }

        .gst-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .gst-page.dark .gst-hero p,
        .gst-page.dark .gst-result-box span {
          color: #cbd5e1;
        }

        .gst-shell {
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(330px, 0.9fr) minmax(420px, 1.1fr);
          gap: 28px;
          align-items: start;
        }

        .gst-left,
        .gst-right {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1101px) {
          .gst-right {
            position: sticky;
            top: 18px;
          }
        }

        .gst-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .gst-page.dark .gst-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .gst-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.12rem;
        }

        .gst-page.dark .gst-card h3,
        .gst-page.dark .gst-field,
        .gst-page.dark .gst-check,
        .gst-page.dark .gst-result-box strong {
          color: #f8fafc;
        }

        .gst-field {
          display: block;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .gst-field input,
        .gst-field select {
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

        .gst-page.dark .gst-field input,
        .gst-page.dark .gst-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .gst-page.dark .gst-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .gst-field input:focus,
        .gst-field select:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .gst-page.dark .gst-field input:focus,
        .gst-page.dark .gst-field select:focus {
          background: #020617;
        }

        .gst-range {
          width: 100%;
          margin-top: 10px;
          accent-color: #2563eb;
        }

        .gst-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .gst-mode-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .gst-mode {
          min-height: 58px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 18px;
          font-weight: 900;
          cursor: pointer;
          padding: 10px;
        }

        .gst-page.dark .gst-mode {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
        }

        .gst-mode.active {
          background: #eff6ff;
          color: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
        }

        .gst-page.dark .gst-mode.active {
          background: rgba(37, 99, 235, 0.24);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.5);
        }

        .gst-check {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #334155;
          border-radius: 16px;
          padding: 13px;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .gst-page.dark .gst-check,
        .gst-page.dark .gst-result-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .gst-check input {
          accent-color: #2563eb;
        }

        .gst-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .gst-primary,
        .gst-dark,
        .gst-light,
        .gst-danger {
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

        .gst-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .gst-dark {
          background: #111827;
          color: #ffffff;
        }

        .gst-page.dark .gst-dark {
          background: #f8fafc;
          color: #111827;
        }

        .gst-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .gst-page.dark .gst-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .gst-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .gst-big-result {
          background:
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.26), transparent 34%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(37, 99, 235, 0.22);
        }

        .gst-big-result span {
          display: block;
          opacity: 0.85;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .gst-big-result h2 {
          margin: 0;
          font-size: clamp(2.3rem, 4vw, 4.5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .gst-big-result p {
          margin: 14px 0 0;
          opacity: 0.9;
          line-height: 1.7;
          font-weight: 800;
        }

        .gst-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .gst-result-box {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 16px;
          min-width: 0;
        }

        .gst-result-box span {
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

        .gst-result-box strong {
          display: block;
          color: #111827;
          font-size: 1.25rem;
          word-break: break-word;
        }

        .gst-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .gst-toast {
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

        .gst-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .gst-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .gst-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .gst-shell {
            grid-template-columns: 1fr;
          }

          .gst-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .gst-hero {
            padding: 52px 5% 34px;
          }

          .gst-hero h1 {
            font-size: 2.2rem;
          }

          .gst-shell {
            padding: 32px 5% 60px;
          }

          .gst-grid,
          .gst-mode-grid,
          .gst-result-grid {
            grid-template-columns: 1fr;
          }

          .gst-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .gst-primary,
          .gst-dark,
          .gst-light,
          .gst-danger {
            width: 100%;
          }

          .gst-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .gst-card {
            padding: 16px;
            border-radius: 18px;
          }

          .gst-shell {
            padding: 24px 4.5% 48px;
          }

          .gst-big-result {
            padding: 22px;
            border-radius: 22px;
          }

          .gst-big-result h2 {
            font-size: 2rem;
          }
        }
      `}</style>

      {toast && (
        <div className={`gst-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="gst-hero">
        <p className="gst-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="gst-shell">
        <div className="gst-left">
          <div className="gst-card">
            <h3>{t.gstDetails}</h3>

            <div className="gst-mode-grid">
              <button
                type="button"
                className={`gst-mode ${mode === "exclusive" ? "active" : ""}`}
                onClick={() => setMode("exclusive")}
              >
                {t.addGst}
                <br />
                <small>{t.amountPlusGst}</small>
              </button>

              <button
                type="button"
                className={`gst-mode ${mode === "inclusive" ? "active" : ""}`}
                onClick={() => setMode("inclusive")}
              >
                {t.removeGst}
                <br />
                <small>{t.gstIncluded}</small>
              </button>
            </div>

            <label className="gst-field">
              {t.amount}
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                className="gst-range"
                type="range"
                min="0"
                max="1000000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            <label className="gst-field">
              {t.gstRate}
              <select
                value={gstRate}
                disabled={useCustomRate}
                onChange={(e) => setGstRate(e.target.value)}
              >
                <option value="0">0%</option>
                <option value="3">3%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </label>

            <label className="gst-check">
              <input
                type="checkbox"
                checked={useCustomRate}
                onChange={(e) => setUseCustomRate(e.target.checked)}
              />
              {t.useCustomRate}
            </label>

            {useCustomRate && (
              <label className="gst-field">
                {t.customRate}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  placeholder={t.customRatePlaceholder}
                />
              </label>
            )}

            <label className="gst-field">
              {t.taxType}
              <select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                <option value="intra">{t.intraState}</option>
                <option value="inter">{t.interState}</option>
              </select>
            </label>

            <div className="gst-actions">
              <button type="button" className="gst-dark" onClick={copyResult}>
                <Copy />
                {t.copyResult}
              </button>

              <button type="button" className="gst-light" onClick={downloadResult}>
                <Download />
                {t.downloadTxt}
              </button>
            </div>

            <div className="gst-actions">
              <button type="button" className="gst-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="gst-card">
            <h3>{t.quickNoteTitle}</h3>

            <div className="gst-note">{t.quickNote}</div>
          </div>
        </div>

        <div className="gst-right">
          <div className="gst-card">
            <h3>{t.gstResult}</h3>

            {result ? (
              <>
                <div className="gst-big-result">
                  <span>
                    {mode === "exclusive" ? t.finalAmount : t.taxableAmountTitle}
                  </span>
                  <h2>
                    {mode === "exclusive"
                      ? formatMoney(result.totalAmount)
                      : formatMoney(result.taxableAmount)}
                  </h2>
                  <p>
                    {t.gstRateText} {result.rate}%{" "}
                    {language === "hi" ? "है।" : "hai."} {t.gstAmountText}{" "}
                    {formatMoney(result.gstAmount)} {t.calculatedText}.
                  </p>
                </div>

                <div className="gst-result-grid">
                  <div className="gst-result-box">
                    <span>
                      <IndianRupee size={16} />
                      {t.taxableAmount}
                    </span>
                    <strong>{formatMoney(result.taxableAmount)}</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Percent size={16} />
                      {t.gstRate}
                    </span>
                    <strong>{result.rate}%</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.gstAmount}
                    </span>
                    <strong>{formatMoney(result.gstAmount)}</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.totalAmount}
                    </span>
                    <strong>{formatMoney(result.totalAmount)}</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Calculator size={16} />
                      CGST
                    </span>
                    <strong>{formatMoney(result.cgst)}</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Calculator size={16} />
                      SGST
                    </span>
                    <strong>{formatMoney(result.sgst)}</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Calculator size={16} />
                      IGST
                    </span>
                    <strong>{formatMoney(result.igst)}</strong>
                  </div>

                  <div className="gst-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.calculation}
                    </span>
                    <strong>
                      {mode === "exclusive" ? t.gstAdded : t.gstRemoved}
                    </strong>
                  </div>
                </div>

                <div className="gst-actions">
                  <button type="button" className="gst-primary" onClick={copyResult}>
                    <Copy />
                    {t.copyGstSummary}
                  </button>
                </div>
              </>
            ) : (
              <div className="gst-note">{t.emptyResult}</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}