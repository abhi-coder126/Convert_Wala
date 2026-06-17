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
  ArrowLeftRight,
  WifiOff,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const currencies = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "$" },
];

const pageText = {
  en: {
    seoTitle:
      "Free Currency Converter Online - Live Exchange Rate Calculator | Convert Wala",
    seoDescription:
      "Convert currencies online using live exchange rates with Convert Wala Currency Converter. Useful for travel, invoices, freelancing, international payments and business calculations.",
    seoKeywords:
      "currency converter, live exchange rate calculator, USD to INR converter, forex calculator, money converter, currency calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "Currency Converter",
    subtitle:
      "Convert currencies using live exchange rates. Useful for travel, invoices, freelancing, international payments and quick business calculations.",

    convertCurrency: "Convert Currency",
    amount: "Amount",
    amountPlaceholder: "Enter amount",
    fromCurrency: "From Currency",
    toCurrency: "To Currency",
    swapCurrencies: "Swap currencies",
    refreshRate: "Refresh Rate",
    updating: "Updating...",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "Live exchange rates are coming from an external API. Banks, payment gateways, forex services or card networks may add extra markup or charges, so the final payable amount may be slightly different.",

    conversionResult: "Conversion Result",
    convertedAmount: "Converted Amount",
    from: "From",
    to: "To",
    exchangeRate: "Exchange Rate",
    reverseRate: "Reverse Rate",
    originalAmount: "Original Amount",
    lastUpdated: "Last Updated",
    loading: "Loading...",
    copyConversion: "Copy Conversion",
    loadingRate: "Live exchange rate is loading...",
    selectCurrency: "Select currency, conversion result will appear here.",

    apiError:
      "Live rates could not be loaded. Please check your internet/API connection.",
    resetDone: "Currency converter reset successfully.",
    invalidRate: "Valid exchange rate is not available.",
    copied: "Currency result copied.",
    downloaded: "Currency result downloaded.",
    copyFailed: "Copy failed.",
    notAvailable: "Not available",

    copyTitle: "Currency Converter Result",
    copyAmount: "Amount",
    copyExchangeRate: "Exchange Rate",
    copyConvertedAmount: "Converted Amount",
    copyLastUpdated: "Last Updated",
  },

  hi: {
    seoTitle:
      "Free Currency Converter Online - Live Exchange Rate Calculator | Convert Wala",
    seoDescription:
      "Convert Wala Currency Converter से live exchange rates के साथ currencies online convert करें। Travel, invoices, freelancing, international payments और business calculations के लिए useful है।",
    seoKeywords:
      "currency converter, live exchange rate calculator, USD to INR converter, forex calculator, money converter, currency calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance टूल",
    heading: "Currency Converter",
    subtitle:
      "Live exchange rates के साथ currencies convert करें। Travel, invoices, freelancing, international payments और quick business calculations के लिए useful है।",

    convertCurrency: "Currency Convert करें",
    amount: "Amount",
    amountPlaceholder: "Amount enter करें",
    fromCurrency: "From Currency",
    toCurrency: "To Currency",
    swapCurrencies: "Currencies swap करें",
    refreshRate: "Rate Refresh करें",
    updating: "Updating...",
    copyResult: "Result Copy करें",
    downloadTxt: "TXT Download करें",
    reset: "Reset करें",

    quickNoteTitle: "Quick Note",
    quickNote:
      "Live exchange rates external API से आ रहे हैं। Banks, payment gateways, forex services या card networks extra markup/charges add कर सकते हैं, इसलिए final payable amount थोड़ा different हो सकता है।",

    conversionResult: "Conversion Result",
    convertedAmount: "Converted Amount",
    from: "From",
    to: "To",
    exchangeRate: "Exchange Rate",
    reverseRate: "Reverse Rate",
    originalAmount: "Original Amount",
    lastUpdated: "Last Updated",
    loading: "Loading...",
    copyConversion: "Conversion Copy करें",
    loadingRate: "Live exchange rate load हो रहा है...",
    selectCurrency: "Currency select करें, conversion result यहां show होगा।",

    apiError:
      "Live rates load नहीं हो पाए। Internet/API connection check करें।",
    resetDone: "Currency converter reset हो गया।",
    invalidRate: "Valid exchange rate available नहीं है।",
    copied: "Currency result copy हो गया।",
    downloaded: "Currency result download हो गया।",
    copyFailed: "Copy failed.",
    notAvailable: "Not available",

    copyTitle: "Currency Converter Result",
    copyAmount: "Amount",
    copyExchangeRate: "Exchange Rate",
    copyConvertedAmount: "Converted Amount",
    copyLastUpdated: "Last Updated",
  },

  hinglish: {
    seoTitle:
      "Free Currency Converter Online - Live Exchange Rate Calculator | Convert Wala",
    seoDescription:
      "Convert Wala Currency Converter se live exchange rates ke saath currencies online convert karo. Travel, invoices, freelancing, international payments aur business calculations ke liye useful hai.",
    seoKeywords:
      "currency converter, live exchange rate calculator, USD to INR converter, forex calculator, money converter, currency calculator, Convert Wala finance tools",

    eyebrow: "Convert Wala Finance Tool",
    heading: "Currency Converter",
    subtitle:
      "Live exchange rates ke saath currencies convert karo. Travel, invoices, freelancing, international payments aur quick business calculations ke liye useful hai.",

    convertCurrency: "Convert Currency",
    amount: "Amount",
    amountPlaceholder: "Enter amount",
    fromCurrency: "From Currency",
    toCurrency: "To Currency",
    swapCurrencies: "Swap currencies",
    refreshRate: "Refresh Rate",
    updating: "Updating...",
    copyResult: "Copy Result",
    downloadTxt: "Download TXT",
    reset: "Reset",

    quickNoteTitle: "Quick Note",
    quickNote:
      "Live exchange rates external API se aa rahe hain. Bank, payment gateway, forex service ya card network apna extra markup/charges add kar sakte hain, isliye final payable amount thoda different ho sakta hai.",

    conversionResult: "Conversion Result",
    convertedAmount: "Converted Amount",
    from: "From",
    to: "To",
    exchangeRate: "Exchange Rate",
    reverseRate: "Reverse Rate",
    originalAmount: "Original Amount",
    lastUpdated: "Last Updated",
    loading: "Loading...",
    copyConversion: "Copy Conversion",
    loadingRate: "Live exchange rate load ho raha hai...",
    selectCurrency: "Currency select karo, conversion result yaha show hoga.",

    apiError: "Live rates load nahi ho paaye. Internet/API check karo.",
    resetDone: "Currency converter reset ho gaya.",
    invalidRate: "Valid exchange rate available nahi hai.",
    copied: "Currency result copied.",
    downloaded: "Currency result downloaded.",
    copyFailed: "Copy failed.",
    notAvailable: "Not available",

    copyTitle: "Currency Converter Result",
    copyAmount: "Amount",
    copyExchangeRate: "Exchange Rate",
    copyConvertedAmount: "Converted Amount",
    copyLastUpdated: "Last Updated",
  },
};

const formatMoney = (amount, code) => {
  const currency = currencies.find((item) => item.code === code);
  return `${currency?.symbol || code} ${Number(amount || 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
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

export default function CurrencyConverter() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/currency-converter";

  const rate = useMemo(() => {
    return Number(rates?.[toCurrency] || 0);
  }, [rates, toCurrency]);

  const convertedAmount = useMemo(() => {
    return Number(amount || 0) * rate;
  }, [amount, rate]);

  const inverseRate = useMemo(() => {
    if (!rate) return 0;
    return 1 / rate;
  }, [rate]);

  const fromInfo = currencies.find((item) => item.code === fromCurrency);
  const toInfo = currencies.find((item) => item.code === toCurrency);

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

  const fetchRates = async (base = fromCurrency) => {
    try {
      setLoading(true);
      setApiError("");

      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const data = await response.json();

      if (!response.ok || data?.result !== "success") {
        throw new Error("Exchange rate API failed");
      }

      setRates(data.rates || {});
      setLastUpdated(data.time_last_update_utc || "");
      setLoading(false);
    } catch {
      setLoading(false);
      setApiError(t.apiError);
      setRates({});
    }
  };

  useEffect(() => {
    fetchRates(fromCurrency);

    const interval = setInterval(() => {
      fetchRates(fromCurrency);
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency]);

  useEffect(() => {
    if (apiError) {
      setApiError(t.apiError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const swapCurrencies = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };

  const resetAll = () => {
    setAmount(1000);
    setFromCurrency("USD");
    setToCurrency("INR");
    showToast("success", t.resetDone);
  };

  const copyResult = async () => {
    if (!rate) {
      showToast("error", t.invalidRate);
      return;
    }

    const text = `${t.copyTitle}

${t.copyAmount}: ${formatMoney(amount, fromCurrency)}
${t.from}: ${fromCurrency} - ${fromInfo?.name}
${t.to}: ${toCurrency} - ${toInfo?.name}

${t.copyExchangeRate}:
1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}
1 ${toCurrency} = ${inverseRate.toFixed(6)} ${fromCurrency}

${t.copyConvertedAmount}:
${formatMoney(convertedAmount, toCurrency)}

${t.copyLastUpdated}:
${lastUpdated || t.notAvailable}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadResult = () => {
    if (!rate) {
      showToast("error", t.invalidRate);
      return;
    }

    const text = `Convert Wala ${t.copyTitle}

${t.copyAmount}: ${formatMoney(amount, fromCurrency)}
${t.from}: ${fromCurrency} - ${fromInfo?.name}
${t.to}: ${toCurrency} - ${toInfo?.name}

${t.copyExchangeRate}:
1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}
1 ${toCurrency} = ${inverseRate.toFixed(6)} ${fromCurrency}

${t.copyConvertedAmount}:
${formatMoney(convertedAmount, toCurrency)}

${t.copyLastUpdated}:
${lastUpdated || t.notAvailable}
`;

    downloadTextFile(text, "Convert Wala_Currency_Result.txt");
    showToast("success", t.downloaded);
  };

  return (
    <main className={`cc-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Currency Converter",
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
              "Live currency conversion",
              "Exchange rate calculator",
              "Reverse exchange rate",
              "Multiple currency support",
              "Copy conversion result",
              "Download currency result",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .cc-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .cc-page * {
          box-sizing: border-box;
        }

        .cc-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .cc-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .cc-page.dark .cc-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .cc-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .cc-page.dark .cc-eyebrow {
          color: #93c5fd;
        }

        .cc-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .cc-page.dark .cc-hero h1 {
          color: #f8fafc;
        }

        .cc-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .cc-page.dark .cc-hero p,
        .cc-page.dark .cc-result-box span {
          color: #cbd5e1;
        }

        .cc-shell {
          width: 100%;
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 28px;
          align-items: start;
        }

        .cc-left,
        .cc-right {
          display: grid;
          gap: 20px;
          min-width: 0;
        }

        @media (min-width: 1101px) {
          .cc-right {
            position: sticky;
            top: 18px;
          }
        }

        .cc-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .cc-page.dark .cc-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .cc-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.12rem;
        }

        .cc-page.dark .cc-card h3,
        .cc-page.dark .cc-field,
        .cc-page.dark .cc-result-box strong {
          color: #f8fafc;
        }

        .cc-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 58px minmax(0, 1fr);
          gap: 12px;
          align-items: end;
        }

        .cc-field {
          display: block;
          color: #334155;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 16px;
          min-width: 0;
        }

        .cc-field input,
        .cc-field select {
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

        .cc-page.dark .cc-field input,
        .cc-page.dark .cc-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .cc-page.dark .cc-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .cc-field input:focus,
        .cc-field select:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .cc-page.dark .cc-field input:focus,
        .cc-page.dark .cc-field select:focus {
          background: #020617;
        }

        .cc-swap {
          width: 54px;
          height: 54px;
          border: 0;
          border-radius: 18px;
          background: #2563eb;
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
          margin-bottom: 16px;
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.22);
        }

        .cc-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .cc-primary,
        .cc-dark,
        .cc-light,
        .cc-danger {
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

        .cc-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .cc-dark {
          background: #111827;
          color: #ffffff;
        }

        .cc-page.dark .cc-dark {
          background: #f8fafc;
          color: #111827;
        }

        .cc-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .cc-page.dark .cc-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .cc-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .cc-primary:disabled,
        .cc-dark:disabled,
        .cc-light:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cc-big-result {
          min-width: 0;
          background:
            radial-gradient(circle at 20% 0%, rgba(255,255,255,0.26), transparent 34%),
            linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(37, 99, 235, 0.22);
        }

        .cc-big-result span {
          display: block;
          opacity: 0.85;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          margin-bottom: 10px;
        }

        .cc-big-result h2 {
          margin: 0;
          font-size: clamp(2.1rem, 4vw, 4.4rem);
          letter-spacing: -0.06em;
          line-height: 1.06;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .cc-big-result p {
          margin: 14px 0 0;
          opacity: 0.9;
          line-height: 1.7;
          font-weight: 800;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .cc-result-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 16px;
        }

        .cc-result-box {
          min-width: 0;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 16px;
        }

        .cc-page.dark .cc-result-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .cc-result-box span {
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

        .cc-result-box strong {
          display: block;
          color: #111827;
          font-size: 1.18rem;
          word-break: break-word;
          overflow-wrap: anywhere;
          line-height: 1.35;
        }

        .cc-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .cc-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 900;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .cc-toast {
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

        .cc-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .cc-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .cc-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .cc-shell {
            grid-template-columns: 1fr;
          }

          .cc-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .cc-hero {
            padding: 52px 5% 34px;
          }

          .cc-hero h1 {
            font-size: clamp(2.1rem, 11vw, 3.2rem);
            letter-spacing: -0.045em;
          }

          .cc-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .cc-shell {
            padding: 32px 5% 60px;
          }

          .cc-grid,
          .cc-result-grid {
            grid-template-columns: 1fr;
          }

          .cc-swap {
            width: 100%;
            height: 52px;
            margin-bottom: 16px;
          }

          .cc-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .cc-primary,
          .cc-dark,
          .cc-light,
          .cc-danger {
            width: 100%;
          }

          .cc-big-result {
            padding: 24px;
            border-radius: 24px;
          }

          .cc-big-result h2 {
            font-size: clamp(1.85rem, 10vw, 2.65rem);
          }

          .cc-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .cc-card {
            padding: 16px;
            border-radius: 18px;
          }

          .cc-shell {
            padding: 24px 4.5% 48px;
          }

          .cc-field input,
          .cc-field select {
            padding: 12px;
            border-radius: 13px;
            font-size: 0.9rem;
          }

          .cc-big-result {
            padding: 20px;
            border-radius: 20px;
          }

          .cc-big-result h2 {
            font-size: 1.8rem;
            letter-spacing: -0.04em;
          }

          .cc-result-box {
            padding: 14px;
            border-radius: 16px;
          }

          .cc-result-box strong {
            font-size: 1rem;
          }
        }

        @media (max-width: 340px) {
          .cc-hero {
            padding: 42px 4% 28px;
          }

          .cc-hero h1 {
            font-size: 1.85rem;
          }

          .cc-card {
            padding: 14px;
          }

          .cc-primary,
          .cc-dark,
          .cc-light,
          .cc-danger {
            min-height: 46px;
            padding: 0 14px;
            font-size: 0.88rem;
          }
        }
      `}</style>

      {toast && (
        <div className={`cc-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="cc-hero">
        <p className="cc-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="cc-shell">
        <div className="cc-left">
          <div className="cc-card">
            <h3>{t.convertCurrency}</h3>

            <label className="cc-field">
              {t.amount}
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
              />
            </label>

            <div className="cc-grid">
              <label className="cc-field">
                {t.fromCurrency}
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="cc-swap"
                onClick={swapCurrencies}
                aria-label={t.swapCurrencies}
              >
                <ArrowLeftRight />
              </button>

              <label className="cc-field">
                {t.toCurrency}
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="cc-actions">
              <button
                type="button"
                className="cc-primary"
                onClick={() => fetchRates(fromCurrency)}
                disabled={loading}
              >
                <RefreshCcw />
                {loading ? t.updating : t.refreshRate}
              </button>

              <button
                type="button"
                className="cc-dark"
                onClick={copyResult}
                disabled={!rate}
              >
                <Copy />
                {t.copyResult}
              </button>
            </div>

            <div className="cc-actions">
              <button
                type="button"
                className="cc-light"
                onClick={downloadResult}
                disabled={!rate}
              >
                <Download />
                {t.downloadTxt}
              </button>

              <button type="button" className="cc-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="cc-card">
            <h3>{t.quickNoteTitle}</h3>

            <div className="cc-note">{t.quickNote}</div>
          </div>
        </div>

        <div className="cc-right">
          <div className="cc-card">
            <h3>{t.conversionResult}</h3>

            {apiError ? (
              <div className="cc-error">
                <WifiOff />
                <span>{apiError}</span>
              </div>
            ) : rate ? (
              <>
                <div className="cc-big-result">
                  <span>{t.convertedAmount}</span>
                  <h2>{formatMoney(convertedAmount, toCurrency)}</h2>
                  <p>
                    {formatMoney(amount, fromCurrency)} ={" "}
                    {formatMoney(convertedAmount, toCurrency)}
                  </p>
                </div>

                <div className="cc-result-grid">
                  <div className="cc-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.from}
                    </span>
                    <strong>
                      {fromCurrency} - {fromInfo?.name}
                    </strong>
                  </div>

                  <div className="cc-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.to}
                    </span>
                    <strong>
                      {toCurrency} - {toInfo?.name}
                    </strong>
                  </div>

                  <div className="cc-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.exchangeRate}
                    </span>
                    <strong>
                      1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
                    </strong>
                  </div>

                  <div className="cc-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.reverseRate}
                    </span>
                    <strong>
                      1 {toCurrency} = {inverseRate.toFixed(6)} {fromCurrency}
                    </strong>
                  </div>

                  <div className="cc-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.originalAmount}
                    </span>
                    <strong>{formatMoney(amount, fromCurrency)}</strong>
                  </div>

                  <div className="cc-result-box">
                    <span>
                      <Calculator size={16} />
                      {t.lastUpdated}
                    </span>
                    <strong>{lastUpdated || t.loading}</strong>
                  </div>
                </div>

                <div className="cc-actions">
                  <button type="button" className="cc-primary" onClick={copyResult}>
                    <Copy />
                    {t.copyConversion}
                  </button>
                </div>
              </>
            ) : (
              <div className="cc-note">
                {loading ? t.loadingRate : t.selectCurrency}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}