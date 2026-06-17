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
  IndianRupee,
  Wallet,
  Percent,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle:
      "Free Salary Calculator Online - In-Hand Salary Calculator | Convert Wala",
    seoDescription:
      "Calculate monthly in-hand salary, annual salary, gross earnings, deductions, PF, TDS and take-home salary online with Convert Wala Salary Calculator.",
    seoKeywords:
      "salary calculator, in hand salary calculator, take home salary calculator, monthly salary calculator, annual salary calculator, PF calculator, TDS salary calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "Salary Calculator",
    subtitle:
      "Calculate monthly in-hand salary, annual salary, gross earnings, deductions, PF, TDS and take-home salary with editable salary breakup.",

    resultView: "Result View",
    monthly: "Monthly",
    monthlySmall: "Per Month Result",
    annual: "Annual",
    annualSmall: "Per Year Result",

    earningsTitle: "Earnings / Salary Breakup",
    basicSalary: "Basic Salary",
    hra: "HRA",
    conveyanceAllowance: "Conveyance Allowance",
    medicalAllowance: "Medical Allowance",
    specialAllowance: "Special Allowance",
    bonusIncentive: "Bonus / Incentive",
    otherEarnings: "Other Earnings",

    deductionsTitle: "Deductions",
    autoPF: "Auto calculate PF from basic salary",
    pfRate: "PF Rate %",
    employeePF: "Employee PF",
    professionalTax: "Professional Tax",
    tdsIncomeTax: "TDS / Income Tax",
    insurance: "Insurance",
    loanAdvance: "Loan / Advance",
    otherDeductions: "Other Deductions",

    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "This calculator estimates salary based on editable breakup. Actual in-hand salary may differ depending on company policy, tax regime, PF rules, bonus cycle and payroll settings.",

    salaryResult: "Salary Result",
    monthlyInHandSalary: "Monthly In-Hand Salary",
    annualInHandSalary: "Annual In-Hand Salary",
    perMonth: "per month",
    perYear: "per year",
    grossSalary: "Gross salary",
    deductionsText: "deductions",

    monthlyGross: "Monthly Gross",
    monthlyInHand: "Monthly In-Hand",
    annualGross: "Annual Gross",
    annualInHand: "Annual In-Hand",
    monthlyDeductions: "Monthly Deductions",
    pfAmount: "PF Amount",
    taxOtherDeductions: "Tax + Other Deductions",
    finalInHand: "Final In-Hand",
    copySalarySummary: "Copy Salary Summary",

    resetDone: "Salary calculator reset successfully.",
    copied: "Salary result copied.",
    downloaded: "Salary result downloaded.",
    copyFailed: "Copy failed.",

    copyTitle: "Salary Calculator Result",
    copyMonthlyGross: "Monthly Gross Salary",
    copyMonthlyDeductions: "Monthly Deductions",
    copyMonthlyInHand: "Monthly In-Hand Salary",
    copyAnnualGross: "Annual Gross Salary",
    copyAnnualDeductions: "Annual Deductions",
    copyAnnualInHand: "Annual In-Hand Salary",
    copyEarnings: "Earnings",
    copyDeductions: "Deductions",
  },

  hi: {
    seoTitle:
      "Free Salary Calculator Online - In-Hand Salary Calculate करें | Convert Wala",
    seoDescription:
      "Convert Wala Salary Calculator से monthly in-hand salary, annual salary, gross earnings, deductions, PF, TDS और take-home salary online calculate करें।",
    seoKeywords:
      "salary calculator, in hand salary calculator, take home salary calculator, monthly salary calculator, annual salary calculator, PF calculator, TDS salary calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance टूल",
    heading: "Salary Calculator",
    subtitle:
      "Editable salary breakup के साथ monthly in-hand salary, annual salary, gross earnings, deductions, PF, TDS और take-home salary calculate करें।",

    resultView: "Result View",
    monthly: "Monthly",
    monthlySmall: "Per Month Result",
    annual: "Annual",
    annualSmall: "Per Year Result",

    earningsTitle: "Earnings / Salary Breakup",
    basicSalary: "Basic Salary",
    hra: "HRA",
    conveyanceAllowance: "Conveyance Allowance",
    medicalAllowance: "Medical Allowance",
    specialAllowance: "Special Allowance",
    bonusIncentive: "Bonus / Incentive",
    otherEarnings: "Other Earnings",

    deductionsTitle: "Deductions",
    autoPF: "Basic salary से PF auto calculate करें",
    pfRate: "PF Rate %",
    employeePF: "Employee PF",
    professionalTax: "Professional Tax",
    tdsIncomeTax: "TDS / Income Tax",
    insurance: "Insurance",
    loanAdvance: "Loan / Advance",
    otherDeductions: "Other Deductions",

    copyResult: "Result Copy करें",
    downloadTxt: "TXT Download करें",
    reset: "Reset करें",

    quickNoteTitle: "Quick Note",
    quickNote:
      "यह calculator editable breakup के basis पर salary estimate करता है। Company policy, tax regime, PF rules, bonus cycle और payroll settings के हिसाब से actual in-hand salary different हो सकती है।",

    salaryResult: "Salary Result",
    monthlyInHandSalary: "Monthly In-Hand Salary",
    annualInHandSalary: "Annual In-Hand Salary",
    perMonth: "per month",
    perYear: "per year",
    grossSalary: "Gross salary",
    deductionsText: "deductions",

    monthlyGross: "Monthly Gross",
    monthlyInHand: "Monthly In-Hand",
    annualGross: "Annual Gross",
    annualInHand: "Annual In-Hand",
    monthlyDeductions: "Monthly Deductions",
    pfAmount: "PF Amount",
    taxOtherDeductions: "Tax + Other Deductions",
    finalInHand: "Final In-Hand",
    copySalarySummary: "Salary Summary Copy करें",

    resetDone: "Salary calculator reset हो गया।",
    copied: "Salary result copy हो गया।",
    downloaded: "Salary result download हो गया।",
    copyFailed: "Copy failed.",

    copyTitle: "Salary Calculator Result",
    copyMonthlyGross: "Monthly Gross Salary",
    copyMonthlyDeductions: "Monthly Deductions",
    copyMonthlyInHand: "Monthly In-Hand Salary",
    copyAnnualGross: "Annual Gross Salary",
    copyAnnualDeductions: "Annual Deductions",
    copyAnnualInHand: "Annual In-Hand Salary",
    copyEarnings: "Earnings",
    copyDeductions: "Deductions",
  },

  hinglish: {
    seoTitle:
      "Free Salary Calculator Online - In-Hand Salary Calculator | Convert Wala",
    seoDescription:
      "Convert Wala Salary Calculator se monthly in-hand salary, annual salary, gross earnings, deductions, PF, TDS aur take-home salary online calculate karo.",
    seoKeywords:
      "salary calculator, in hand salary calculator, take home salary calculator, monthly salary calculator, annual salary calculator, PF calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "Salary Calculator",
    subtitle:
      "Editable salary breakup ke saath monthly in-hand salary, annual salary, gross earnings, deductions, PF, TDS aur take-home salary calculate karo.",

    resultView: "Result View",
    monthly: "Monthly",
    monthlySmall: "Per Month Result",
    annual: "Annual",
    annualSmall: "Per Year Result",

    earningsTitle: "Earnings / Salary Breakup",
    basicSalary: "Basic Salary",
    hra: "HRA",
    conveyanceAllowance: "Conveyance Allowance",
    medicalAllowance: "Medical Allowance",
    specialAllowance: "Special Allowance",
    bonusIncentive: "Bonus / Incentive",
    otherEarnings: "Other Earnings",

    deductionsTitle: "Deductions",
    autoPF: "Auto calculate PF from basic salary",
    pfRate: "PF Rate %",
    employeePF: "Employee PF",
    professionalTax: "Professional Tax",
    tdsIncomeTax: "TDS / Income Tax",
    insurance: "Insurance",
    loanAdvance: "Loan / Advance",
    otherDeductions: "Other Deductions",

    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "Ye calculator editable breakup ke basis par salary estimate karta hai. Company policy, tax regime, PF rules, bonus cycle aur payroll settings ke hisaab se actual in-hand salary different ho sakti hai.",

    salaryResult: "Salary Result",
    monthlyInHandSalary: "Monthly In-Hand Salary",
    annualInHandSalary: "Annual In-Hand Salary",
    perMonth: "per month",
    perYear: "per year",
    grossSalary: "Gross salary",
    deductionsText: "deductions",

    monthlyGross: "Monthly Gross",
    monthlyInHand: "Monthly In-Hand",
    annualGross: "Annual Gross",
    annualInHand: "Annual In-Hand",
    monthlyDeductions: "Monthly Deductions",
    pfAmount: "PF Amount",
    taxOtherDeductions: "Tax + Other Deductions",
    finalInHand: "Final In-Hand",
    copySalarySummary: "Copy Salary Summary",

    resetDone: "Salary calculator reset ho gaya.",
    copied: "Salary result copied.",
    downloaded: "Salary result downloaded.",
    copyFailed: "Copy failed.",

    copyTitle: "Salary Calculator Result",
    copyMonthlyGross: "Monthly Gross Salary",
    copyMonthlyDeductions: "Monthly Deductions",
    copyMonthlyInHand: "Monthly In-Hand Salary",
    copyAnnualGross: "Annual Gross Salary",
    copyAnnualDeductions: "Annual Deductions",
    copyAnnualInHand: "Annual In-Hand Salary",
    copyEarnings: "Earnings",
    copyDeductions: "Deductions",
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

export default function SalaryCalculator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [toast, setToast] = useState(null);

  const [salaryMode, setSalaryMode] = useState("monthly");
  const [autoPF, setAutoPF] = useState(true);
  const [pfRate, setPfRate] = useState(12);

  const [income, setIncome] = useState({
    basic: 30000,
    hra: 12000,
    conveyance: 2000,
    medical: 1250,
    special: 14750,
    bonus: 0,
    other: 0,
  });

  const [deductions, setDeductions] = useState({
    employeePF: 0,
    professionalTax: 200,
    tds: 0,
    insurance: 0,
    loan: 0,
    other: 0,
  });

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/salary-calculator";

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
    const basic = Number(income.basic || 0);
    const hra = Number(income.hra || 0);
    const conveyance = Number(income.conveyance || 0);
    const medical = Number(income.medical || 0);
    const special = Number(income.special || 0);
    const bonus = Number(income.bonus || 0);
    const otherIncome = Number(income.other || 0);

    const monthlyGross =
      basic + hra + conveyance + medical + special + bonus + otherIncome;

    const pfAmount = autoPF
      ? (basic * Number(pfRate || 0)) / 100
      : Number(deductions.employeePF || 0);

    const professionalTax = Number(deductions.professionalTax || 0);
    const tds = Number(deductions.tds || 0);
    const insurance = Number(deductions.insurance || 0);
    const loan = Number(deductions.loan || 0);
    const otherDeduction = Number(deductions.other || 0);

    const monthlyDeductions =
      pfAmount + professionalTax + tds + insurance + loan + otherDeduction;

    const monthlyInHand = monthlyGross - monthlyDeductions;

    return {
      monthlyGross,
      monthlyDeductions,
      monthlyInHand,
      annualGross: monthlyGross * 12,
      annualDeductions: monthlyDeductions * 12,
      annualInHand: monthlyInHand * 12,
      pfAmount,
      professionalTax,
      tds,
      insurance,
      loan,
      otherDeduction,
      basic,
      hra,
      conveyance,
      medical,
      special,
      bonus,
      otherIncome,
    };
  }, [income, deductions, autoPF, pfRate]);

  const displayResult = useMemo(() => {
    if (salaryMode === "annual") {
      return {
        gross: result.annualGross,
        deductions: result.annualDeductions,
        inHand: result.annualInHand,
        label: t.annualInHandSalary,
        period: t.perYear,
      };
    }

    return {
      gross: result.monthlyGross,
      deductions: result.monthlyDeductions,
      inHand: result.monthlyInHand,
      label: t.monthlyInHandSalary,
      period: t.perMonth,
    };
  }, [salaryMode, result, t]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const updateIncome = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
  };

  const updateDeduction = (key, value) => {
    setDeductions((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setSalaryMode("monthly");
    setAutoPF(true);
    setPfRate(12);
    setIncome({
      basic: 30000,
      hra: 12000,
      conveyance: 2000,
      medical: 1250,
      special: 14750,
      bonus: 0,
      other: 0,
    });
    setDeductions({
      employeePF: 0,
      professionalTax: 200,
      tds: 0,
      insurance: 0,
      loan: 0,
      other: 0,
    });
    showToast("success", t.resetDone);
  };

  const copyResult = async () => {
    const text = `${t.copyTitle}

${t.copyMonthlyGross}: ${formatMoney(result.monthlyGross)}
${t.copyMonthlyDeductions}: ${formatMoney(result.monthlyDeductions)}
${t.copyMonthlyInHand}: ${formatMoney(result.monthlyInHand)}

${t.copyAnnualGross}: ${formatMoney(result.annualGross)}
${t.copyAnnualDeductions}: ${formatMoney(result.annualDeductions)}
${t.copyAnnualInHand}: ${formatMoney(result.annualInHand)}

${t.copyEarnings}:
${t.basicSalary}: ${formatMoney(result.basic)}
${t.hra}: ${formatMoney(result.hra)}
${t.conveyanceAllowance}: ${formatMoney(result.conveyance)}
${t.medicalAllowance}: ${formatMoney(result.medical)}
${t.specialAllowance}: ${formatMoney(result.special)}
${t.bonusIncentive}: ${formatMoney(result.bonus)}
${t.otherEarnings}: ${formatMoney(result.otherIncome)}

${t.copyDeductions}:
PF: ${formatMoney(result.pfAmount)}
${t.professionalTax}: ${formatMoney(result.professionalTax)}
${t.tdsIncomeTax}: ${formatMoney(result.tds)}
${t.insurance}: ${formatMoney(result.insurance)}
${t.loanAdvance}: ${formatMoney(result.loan)}
${t.otherDeductions}: ${formatMoney(result.otherDeduction)}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadResult = () => {
    const text = `Convert Wala ${t.copyTitle}

${t.copyMonthlyGross}: ${formatMoney(result.monthlyGross)}
${t.copyMonthlyDeductions}: ${formatMoney(result.monthlyDeductions)}
${t.copyMonthlyInHand}: ${formatMoney(result.monthlyInHand)}

${t.copyAnnualGross}: ${formatMoney(result.annualGross)}
${t.copyAnnualDeductions}: ${formatMoney(result.annualDeductions)}
${t.copyAnnualInHand}: ${formatMoney(result.annualInHand)}

${t.copyEarnings}:
${t.basicSalary}: ${formatMoney(result.basic)}
${t.hra}: ${formatMoney(result.hra)}
${t.conveyanceAllowance}: ${formatMoney(result.conveyance)}
${t.medicalAllowance}: ${formatMoney(result.medical)}
${t.specialAllowance}: ${formatMoney(result.special)}
${t.bonusIncentive}: ${formatMoney(result.bonus)}
${t.otherEarnings}: ${formatMoney(result.otherIncome)}

${t.copyDeductions}:
PF: ${formatMoney(result.pfAmount)}
${t.professionalTax}: ${formatMoney(result.professionalTax)}
${t.tdsIncomeTax}: ${formatMoney(result.tds)}
${t.insurance}: ${formatMoney(result.insurance)}
${t.loanAdvance}: ${formatMoney(result.loan)}
${t.otherDeductions}: ${formatMoney(result.otherDeduction)}
`;

    downloadTextFile(text, "Convert Wala_Salary_Result.txt");
    showToast("success", t.downloaded);
  };

  return (
    <main className={`sal-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Salary Calculator",
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
              "Calculate monthly in-hand salary",
              "Calculate annual salary",
              "Salary breakup calculator",
              "PF and deductions calculator",
              "Copy salary summary",
              "Download salary result",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .sal-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .sal-page * {
          box-sizing: border-box;
        }

        .sal-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .sal-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .sal-page.dark .sal-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .sal-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .sal-page.dark .sal-eyebrow {
          color: #93c5fd;
        }

        .sal-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .sal-page.dark .sal-hero h1 {
          color: #f8fafc;
        }

        .sal-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .sal-page.dark .sal-hero p,
        .sal-page.dark .sal-result-box span,
        .sal-page.dark .sal-row {
          color: #cbd5e1;
        }

        .sal-shell {
          width: 100%;
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 28px;
          align-items: start;
        }

        .sal-left,
        .sal-right {
          display: grid;
          gap: 20px;
          min-width: 0;
        }

        @media (min-width: 1101px) {
          .sal-right {
            position: sticky;
            top: 18px;
          }
        }

        .sal-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .sal-page.dark .sal-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .sal-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.12rem;
        }

        .sal-page.dark .sal-card h3,
        .sal-page.dark .sal-field,
        .sal-page.dark .sal-check,
        .sal-page.dark .sal-result-box strong,
        .sal-page.dark .sal-row strong {
          color: #f8fafc;
        }

        .sal-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .sal-field {
          display: block;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 900;
          min-width: 0;
        }

        .sal-field input {
          width: 100%;
          max-width: 100%;
          min-width: 0;
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

        .sal-page.dark .sal-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .sal-field input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .sal-page.dark .sal-field input:focus {
          background: #020617;
        }

        .sal-mode-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .sal-mode {
          min-height: 58px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 18px;
          font-weight: 900;
          cursor: pointer;
          padding: 10px;
        }

        .sal-page.dark .sal-mode {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          color: #e2e8f0;
        }

        .sal-mode.active {
          background: #eff6ff;
          color: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
        }

        .sal-page.dark .sal-mode.active {
          background: rgba(37, 99, 235, 0.24);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.5);
        }

        .sal-check {
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

        .sal-page.dark .sal-check,
        .sal-page.dark .sal-result-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .sal-check input {
          accent-color: #2563eb;
        }

        .sal-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .sal-primary,
        .sal-dark,
        .sal-light,
        .sal-danger {
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

        .sal-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .sal-dark {
          background: #111827;
          color: #ffffff;
        }

        .sal-page.dark .sal-dark {
          background: #f8fafc;
          color: #111827;
        }

        .sal-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .sal-page.dark .sal-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .sal-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .sal-big-result {
          min-width: 0;
          background:
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.26), transparent 34%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(37, 99, 235, 0.22);
        }

        .sal-big-result span {
          display: block;
          opacity: 0.85;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .sal-big-result h2 {
          margin: 0;
          font-size: clamp(2.1rem, 4vw, 4.4rem);
          letter-spacing: -0.06em;
          line-height: 1.06;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .sal-big-result p {
          margin: 14px 0 0;
          opacity: 0.9;
          line-height: 1.7;
          font-weight: 800;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .sal-result-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 16px;
        }

        .sal-result-box {
          min-width: 0;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 16px;
        }

        .sal-result-box span {
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

        .sal-result-box strong {
          display: block;
          color: #111827;
          font-size: 1.2rem;
          word-break: break-word;
          overflow-wrap: anywhere;
          line-height: 1.35;
        }

        .sal-breakdown {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }

        .sal-row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: #334155;
          font-weight: 900;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          min-width: 0;
        }

        .sal-page.dark .sal-row {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .sal-row:last-child {
          border-bottom: 0;
        }

        .sal-row span {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .sal-row strong {
          color: #111827;
          text-align: right;
          overflow-wrap: anywhere;
        }

        .sal-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .sal-toast {
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

        .sal-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .sal-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .sal-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .sal-shell {
            grid-template-columns: 1fr;
          }

          .sal-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .sal-hero {
            padding: 52px 5% 34px;
          }

          .sal-hero h1 {
            font-size: clamp(2.1rem, 11vw, 3.2rem);
            letter-spacing: -0.045em;
          }

          .sal-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .sal-shell {
            padding: 32px 5% 60px;
          }

          .sal-grid,
          .sal-mode-grid,
          .sal-result-grid {
            grid-template-columns: 1fr;
          }

          .sal-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .sal-primary,
          .sal-dark,
          .sal-light,
          .sal-danger {
            width: 100%;
          }

          .sal-big-result {
            padding: 24px;
            border-radius: 24px;
          }

          .sal-big-result h2 {
            font-size: clamp(1.85rem, 10vw, 2.65rem);
          }

          .sal-row {
            flex-direction: column;
            gap: 6px;
          }

          .sal-row strong {
            text-align: left;
          }

          .sal-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .sal-card {
            padding: 16px;
            border-radius: 18px;
          }

          .sal-shell {
            padding: 24px 4.5% 48px;
          }

          .sal-field input {
            padding: 12px;
            border-radius: 13px;
            font-size: 0.9rem;
          }

          .sal-big-result {
            padding: 20px;
            border-radius: 20px;
          }

          .sal-big-result h2 {
            font-size: 1.8rem;
            letter-spacing: -0.04em;
          }

          .sal-result-box {
            padding: 14px;
            border-radius: 16px;
          }

          .sal-result-box strong {
            font-size: 1rem;
          }
        }

        @media (max-width: 340px) {
          .sal-hero {
            padding: 42px 4% 28px;
          }

          .sal-hero h1 {
            font-size: 1.85rem;
          }

          .sal-card {
            padding: 14px;
          }

          .sal-primary,
          .sal-dark,
          .sal-light,
          .sal-danger {
            min-height: 46px;
            padding: 0 14px;
            font-size: 0.88rem;
          }
        }
      `}</style>

      {toast && (
        <div className={`sal-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="sal-hero">
        <p className="sal-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="sal-shell">
        <div className="sal-left">
          <div className="sal-card">
            <h3>{t.resultView}</h3>

            <div className="sal-mode-grid">
              <button
                type="button"
                className={`sal-mode ${salaryMode === "monthly" ? "active" : ""}`}
                onClick={() => setSalaryMode("monthly")}
              >
                {t.monthly}
                <br />
                <small>{t.monthlySmall}</small>
              </button>

              <button
                type="button"
                className={`sal-mode ${salaryMode === "annual" ? "active" : ""}`}
                onClick={() => setSalaryMode("annual")}
              >
                {t.annual}
                <br />
                <small>{t.annualSmall}</small>
              </button>
            </div>
          </div>

          <div className="sal-card">
            <h3>{t.earningsTitle}</h3>

            <div className="sal-grid">
              <label className="sal-field">
                {t.basicSalary}
                <input
                  type="number"
                  min="0"
                  value={income.basic}
                  onChange={(e) => updateIncome("basic", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.hra}
                <input
                  type="number"
                  min="0"
                  value={income.hra}
                  onChange={(e) => updateIncome("hra", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.conveyanceAllowance}
                <input
                  type="number"
                  min="0"
                  value={income.conveyance}
                  onChange={(e) => updateIncome("conveyance", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.medicalAllowance}
                <input
                  type="number"
                  min="0"
                  value={income.medical}
                  onChange={(e) => updateIncome("medical", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.specialAllowance}
                <input
                  type="number"
                  min="0"
                  value={income.special}
                  onChange={(e) => updateIncome("special", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.bonusIncentive}
                <input
                  type="number"
                  min="0"
                  value={income.bonus}
                  onChange={(e) => updateIncome("bonus", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.otherEarnings}
                <input
                  type="number"
                  min="0"
                  value={income.other}
                  onChange={(e) => updateIncome("other", e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="sal-card">
            <h3>{t.deductionsTitle}</h3>

            <label className="sal-check">
              <input
                type="checkbox"
                checked={autoPF}
                onChange={(e) => setAutoPF(e.target.checked)}
              />
              {t.autoPF}
            </label>

            {autoPF ? (
              <label className="sal-field">
                {t.pfRate}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pfRate}
                  onChange={(e) => setPfRate(e.target.value)}
                />
              </label>
            ) : (
              <label className="sal-field">
                {t.employeePF}
                <input
                  type="number"
                  min="0"
                  value={deductions.employeePF}
                  onChange={(e) =>
                    updateDeduction("employeePF", e.target.value)
                  }
                />
              </label>
            )}

            <div className="sal-grid">
              <label className="sal-field">
                {t.professionalTax}
                <input
                  type="number"
                  min="0"
                  value={deductions.professionalTax}
                  onChange={(e) =>
                    updateDeduction("professionalTax", e.target.value)
                  }
                />
              </label>

              <label className="sal-field">
                {t.tdsIncomeTax}
                <input
                  type="number"
                  min="0"
                  value={deductions.tds}
                  onChange={(e) => updateDeduction("tds", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.insurance}
                <input
                  type="number"
                  min="0"
                  value={deductions.insurance}
                  onChange={(e) =>
                    updateDeduction("insurance", e.target.value)
                  }
                />
              </label>

              <label className="sal-field">
                {t.loanAdvance}
                <input
                  type="number"
                  min="0"
                  value={deductions.loan}
                  onChange={(e) => updateDeduction("loan", e.target.value)}
                />
              </label>

              <label className="sal-field">
                {t.otherDeductions}
                <input
                  type="number"
                  min="0"
                  value={deductions.other}
                  onChange={(e) => updateDeduction("other", e.target.value)}
                />
              </label>
            </div>

            <div className="sal-actions">
              <button type="button" className="sal-dark" onClick={copyResult}>
                <Copy />
                {t.copyResult}
              </button>

              <button type="button" className="sal-light" onClick={downloadResult}>
                <Download />
                {t.downloadTxt}
              </button>
            </div>

            <div className="sal-actions">
              <button type="button" className="sal-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="sal-card">
            <h3>{t.quickNoteTitle}</h3>

            <div className="sal-note">{t.quickNote}</div>
          </div>
        </div>

        <div className="sal-right">
          <div className="sal-card">
            <h3>{t.salaryResult}</h3>

            <div className="sal-big-result">
              <span>{displayResult.label}</span>
              <h2>{formatMoney(displayResult.inHand)}</h2>
              <p>
                {t.grossSalary} {formatMoney(displayResult.gross)}{" "}
                {displayResult.period}, {t.deductionsText}{" "}
                {formatMoney(displayResult.deductions)}.
              </p>
            </div>

            <div className="sal-result-grid">
              <div className="sal-result-box">
                <span>
                  <IndianRupee size={16} />
                  {t.monthlyGross}
                </span>
                <strong>{formatMoney(result.monthlyGross)}</strong>
              </div>

              <div className="sal-result-box">
                <span>
                  <Wallet size={16} />
                  {t.monthlyInHand}
                </span>
                <strong>{formatMoney(result.monthlyInHand)}</strong>
              </div>

              <div className="sal-result-box">
                <span>
                  <IndianRupee size={16} />
                  {t.annualGross}
                </span>
                <strong>{formatMoney(result.annualGross)}</strong>
              </div>

              <div className="sal-result-box">
                <span>
                  <Wallet size={16} />
                  {t.annualInHand}
                </span>
                <strong>{formatMoney(result.annualInHand)}</strong>
              </div>

              <div className="sal-result-box">
                <span>
                  <Calculator size={16} />
                  {t.monthlyDeductions}
                </span>
                <strong>{formatMoney(result.monthlyDeductions)}</strong>
              </div>

              <div className="sal-result-box">
                <span>
                  <Percent size={16} />
                  {t.pfAmount}
                </span>
                <strong>{formatMoney(result.pfAmount)}</strong>
              </div>
            </div>

            <div className="sal-breakdown">
              <div className="sal-row">
                <span>{t.basicSalary}</span>
                <strong>{formatMoney(result.basic)}</strong>
              </div>

              <div className="sal-row">
                <span>{t.hra}</span>
                <strong>{formatMoney(result.hra)}</strong>
              </div>

              <div className="sal-row">
                <span>{t.otherEarnings}</span>
                <strong>
                  {formatMoney(
                    result.conveyance +
                      result.medical +
                      result.special +
                      result.bonus +
                      result.otherIncome
                  )}
                </strong>
              </div>

              <div className="sal-row">
                <span>PF</span>
                <strong>{formatMoney(result.pfAmount)}</strong>
              </div>

              <div className="sal-row">
                <span>{t.taxOtherDeductions}</span>
                <strong>
                  {formatMoney(
                    result.professionalTax +
                      result.tds +
                      result.insurance +
                      result.loan +
                      result.otherDeduction
                  )}
                </strong>
              </div>

              <div className="sal-row">
                <span>{t.finalInHand}</span>
                <strong>{formatMoney(result.monthlyInHand)}</strong>
              </div>
            </div>

            <div className="sal-actions">
              <button type="button" className="sal-primary" onClick={copyResult}>
                <Copy />
                {t.copySalarySummary}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}