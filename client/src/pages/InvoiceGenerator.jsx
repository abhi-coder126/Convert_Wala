import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import html2pdf from "html2pdf.js";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  RefreshCcw,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;
const today = new Date().toISOString().slice(0, 10);

const seoText = {
  en: {
    title: "Free Invoice Generator Online - Create Invoice PDF | Convert Wala",
    description:
      "Create professional invoices online for free with Convert Wala Invoice Generator. Add logo, signature, stamp, invoice items, tax, discount and download invoice as PDF.",
    keywords:
      "invoice generator, free invoice generator, invoice PDF, online invoice maker, bill generator, business invoice, GST invoice, invoice template, Convert Wala business tools",
  },
  hi: {
    title: "Free Invoice Generator Online - Invoice PDF बनाएं | Convert Wala",
    description:
      "Convert Wala Invoice Generator से professional invoice online free में बनाएं। Logo, signature, stamp, invoice items, tax, discount add करें और PDF download करें।",
    keywords:
      "invoice generator, bill generator, invoice PDF, online invoice maker, free invoice generator, business invoice, GST invoice, Convert Wala business tools",
  },
  hinglish: {
    title: "Free Invoice Generator Online - Create Invoice PDF | Convert Wala",
    description:
      "Convert Wala Invoice Generator se professional invoice online free me banao. Logo, signature, stamp, invoice items, tax, discount add karo aur PDF download karo.",
    keywords:
      "invoice generator, free invoice generator, invoice PDF, online invoice maker, bill generator, business invoice, GST invoice, Convert Wala business tools",
  },
};

const formatMoney = (amount, currency) => {
  const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
  return `${symbols[currency] || currency}${Number(amount || 0).toFixed(2)}`;
};

const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function InvoiceGenerator() {
  const invoiceRef = useRef(null);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [toast, setToast] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const [logo, setLogo] = useState("");
  const [signature, setSignature] = useState("");
  const [stamp, setStamp] = useState("");

  const [invoice, setInvoice] = useState({
    title: "INVOICE",
    invoiceLabel: "Invoice :",
    invoiceFor: "MENSTONE DVC LTD.",

    companyName: "GRAPHICS FAMILY",
    companyAddress: "Your Town 2/3 NY USA",
    companyPhone: "+123 456 7890",
    companyEmail: "info@graphicsfamily.com",
    companyWebsite: "www.graphicsfamily.com",

    dateLabel: "Date",
    dateValue: today,
    serviceLabel: "Service No",
    serviceValue: "0012254789",
    accountLabel: "Account No",
    accountValue: "00122547892121",
    amountLabel: "Amount",

    itemHeader: "Item Description",
    priceHeader: "Price",
    qtyHeader: "Qty",
    totalHeader: "Total",

    subtotalLabel: "Subtotal",
    discountLabel: "Discount",
    taxLabel: "VAT/TAX",
    totalDueLabel: "Total Due",

    currency: "USD",
    taxRate: 15,
    discountRate: 0,

    paymentTitle: "PAYMENT TERMS",
    paymentText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod.",

    signatureName: "ADI BARBU",
    signatureTitle: "CEO. ADI BARBU",
    thankYouText: "THANK YOU",
    footerText: "Generated with Convert Wala Invoice Generator",
  });

  const [items, setItems] = useState([
    {
      id: makeId(),
      title: "Graphic Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisc.",
      price: 125,
      qty: 2,
    },
    {
      id: makeId(),
      title: "Web Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisc.",
      price: 150,
      qty: 1,
    },
    {
      id: makeId(),
      title: "Branding Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisc.",
      price: 50,
      qty: 1,
    },
    {
      id: makeId(),
      title: "Brochure Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisc.",
      price: 50,
      qty: 1,
    },
  ]);

  const seo = seoText[language] || seoText.en;
  const canonicalUrl = "https://www.convertwala.com/invoice-generator";

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

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
      0
    );

    const discount = (subtotal * Number(invoice.discountRate || 0)) / 100;
    const taxable = subtotal - discount;
    const tax = (taxable * Number(invoice.taxRate || 0)) / 100;
    const total = taxable + tax;

    return { subtotal, discount, taxable, tax, total };
  }, [items, invoice.taxRate, invoice.discountRate]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const updateInvoice = (key, value) => {
    setInvoice((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (id, key, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: makeId(),
        title: "New Service",
        desc: "Service description",
        price: 0,
        qty: 1,
      },
    ]);
  };

  const removeItem = (id) => {
    if (items.length === 1) {
      showToast("error", "Minimum 1 item required hai.");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const uploadImage = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Only image file upload karo.");
      e.target.value = "";
      return;
    }

    const dataUrl = await fileToDataURL(file);

    if (type === "logo") setLogo(dataUrl);
    if (type === "signature") setSignature(dataUrl);
    if (type === "stamp") setStamp(dataUrl);

    showToast("success", `${type} uploaded successfully.`);
    e.target.value = "";
  };

  const clearUploads = () => {
    setLogo("");
    setSignature("");
    setStamp("");
    showToast("success", "Uploads cleared. Text data safe hai.");
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) {
      showToast("error", "Invoice preview not found.");
      return;
    }

    let exportWrap = null;

    try {
      setDownloading(true);

      const clone = invoiceRef.current.cloneNode(true);

      clone.style.transform = "none";
      clone.style.position = "relative";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.width = "794px";
      clone.style.minHeight = "1123px";
      clone.style.maxWidth = "none";
      clone.style.boxShadow = "none";

      exportWrap = document.createElement("div");
      exportWrap.style.position = "fixed";
      exportWrap.style.left = "-99999px";
      exportWrap.style.top = "0";
      exportWrap.style.width = "794px";
      exportWrap.style.background = "#ffffff";
      exportWrap.appendChild(clone);
      document.body.appendChild(exportWrap);

      const options = {
        margin: [0, 0, 0, 0],
        filename: `Convert Wala_${invoice.invoiceFor.replace(/\s+/g, "_")}_invoice.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
      };

      await html2pdf().set(options).from(clone).save();

      showToast("success", "Invoice PDF downloaded.");
    } catch {
      showToast("error", "PDF download failed.");
    } finally {
      if (exportWrap?.parentNode) {
        document.body.removeChild(exportWrap);
      }
      setDownloading(false);
    }
  };

  return (
    <main className={`inv-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />

        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <meta name="application-name" content="Convert Wala" />
        <meta
          name="theme-color"
          content={theme === "dark" ? "#020617" : "#ff4f6d"}
        />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Convert Wala" />
        <meta
          property="og:locale"
          content={language === "hi" ? "hi_IN" : "en_US"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Invoice Generator",
            url: canonicalUrl,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            description: seo.description,
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
              "Create invoice online",
              "Download invoice as PDF",
              "Add logo signature and stamp",
              "Add tax and discount",
              "Multiple currency support",
              "Browser-based invoice generator",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .inv-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
        }

        .inv-page * {
          box-sizing: border-box;
        }

        .inv-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(255, 79, 109, 0.16), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .inv-hero {
          padding: 70px 6% 38px;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
        }

        .inv-page.dark .inv-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .inv-hero p {
          margin: 0 0 12px;
          color: #ff4f6d;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .inv-hero h1 {
          margin: 0;
          font-size: clamp(2.3rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          color: #0f172a;
        }

        .inv-page.dark .inv-hero h1 {
          color: #f8fafc;
        }

        .inv-shell {
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(330px, 0.95fr) minmax(450px, 1.05fr);
          gap: 28px;
          align-items: start;
        }

        .inv-left,
        .inv-right {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1101px) {
          .inv-right {
            position: sticky;
            top: 18px;
          }
        }

        .inv-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 22px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .inv-page.dark .inv-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .inv-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.08rem;
        }

        .inv-page.dark .inv-card h3,
        .inv-page.dark .inv-field,
        .inv-page.dark .small-label {
          color: #f8fafc;
        }

        .inv-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .inv-field {
          display: block;
          color: #334155;
          font-size: 0.86rem;
          font-weight: 900;
        }

        .inv-field input,
        .inv-field select,
        .inv-field textarea {
          width: 100%;
          margin-top: 7px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 14px;
          padding: 12px 13px;
          outline: none;
          font-weight: 800;
          font-family: inherit;
        }

        .inv-page.dark .inv-field input,
        .inv-page.dark .inv-field select,
        .inv-page.dark .inv-field textarea,
        .inv-page.dark .item-row input,
        .inv-page.dark .item-row textarea {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .inv-page.dark .inv-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .inv-field textarea {
          min-height: 82px;
          resize: vertical;
          line-height: 1.5;
        }

        .inv-field input:focus,
        .inv-field select:focus,
        .inv-field textarea:focus {
          border-color: #ff4f6d;
          box-shadow: 0 0 0 4px rgba(255, 79, 109, 0.12);
          background: #fff;
        }

        .inv-page.dark .inv-field input:focus,
        .inv-page.dark .inv-field select:focus,
        .inv-page.dark .inv-field textarea:focus {
          background: #020617;
        }

        .span-2 {
          grid-column: 1 / -1;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .upload-box {
          min-height: 112px;
          border: 1px dashed #cbd5e1;
          background: #f8fafc;
          border-radius: 18px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          color: #64748b;
          font-weight: 900;
          padding: 12px;
        }

        .inv-page.dark .upload-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
        }

        .upload-box input {
          display: none;
        }

        .upload-box svg {
          color: #ff4f6d;
          margin-bottom: 7px;
        }

        .item-list {
          display: grid;
          gap: 12px;
        }

        .item-row {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 12px;
          display: grid;
          gap: 10px;
        }

        .inv-page.dark .item-row {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .item-row-top {
          display: grid;
          grid-template-columns: 1fr 90px 90px 42px;
          gap: 10px;
          align-items: end;
        }

        .item-row input,
        .item-row textarea {
          width: 100%;
          border: 1px solid #dbe3ef;
          background: #fff;
          border-radius: 12px;
          padding: 10px;
          outline: none;
          font-weight: 800;
        }

        .item-row textarea {
          min-height: 54px;
          resize: vertical;
        }

        .small-label {
          display: block;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 12px;
          background: #fee2e2;
          color: #dc2626;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .inv-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .inv-primary,
        .inv-dark,
        .inv-light,
        .inv-danger {
          min-height: 48px;
          border: 0;
          border-radius: 999px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 900;
          cursor: pointer;
          flex: 1;
        }

        .inv-primary {
          background: #ff4f6d;
          color: #fff;
        }

        .inv-dark {
          background: #111827;
          color: #fff;
        }

        .inv-page.dark .inv-dark {
          background: #f8fafc;
          color: #111827;
        }

        .inv-light {
          background: #fff1f3;
          color: #ff4f6d;
          border: 1px solid #fecdd3;
        }

        .inv-page.dark .inv-light {
          background: rgba(255, 79, 109, 0.12);
          color: #ff9a73;
          border-color: rgba(255, 79, 109, 0.3);
        }

        .inv-danger {
          background: #dc2626;
          color: #fff;
        }

        .inv-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .preview-wrap {
          overflow: hidden;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          padding: 18px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .inv-page.dark .preview-wrap {
          background: #020617;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .invoice-stage {
          --invoice-scale: 0.5;
          width: calc(794px * var(--invoice-scale));
          height: calc(1123px * var(--invoice-scale));
          position: relative;
          margin: 0 auto;
          flex: 0 0 auto;
        }

        .invoice-sheet {
          width: 794px;
          min-height: 1123px;
          background: #fff;
          color: #161616;
          font-family: Arial, sans-serif;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 70px rgba(15, 23, 42, 0.14);
        }

        .invoice-stage .invoice-sheet {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%) scale(var(--invoice-scale));
          transform-origin: top center;
        }

        .wave-top {
          position: absolute;
          left: -80px;
          top: -100px;
          width: 520px;
          height: 280px;
          background: linear-gradient(135deg, #ff9a73, #ff315f);
          border-bottom-right-radius: 85% 75%;
          z-index: 1;
        }

        .wave-top-white {
          position: absolute;
          left: 260px;
          top: -115px;
          width: 280px;
          height: 240px;
          background: #fff;
          border-bottom-left-radius: 95% 85%;
          z-index: 2;
        }

        .wave-bottom {
          position: absolute;
          left: -60px;
          right: -60px;
          bottom: -72px;
          height: 125px;
          background: linear-gradient(135deg, #ff315f, #ff9a73);
          border-top-left-radius: 55% 70%;
          border-top-right-radius: 75% 80%;
          z-index: 1;
        }

        .invoice-content {
          position: relative;
          z-index: 5;
          padding: 52px 46px 56px;
        }

        .top-row {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 24px;
          min-height: 150px;
        }

        .invoice-title h1 {
          margin: 0 0 13px;
          color: #fff;
          letter-spacing: 0.12em;
          font-size: 2.7rem;
          font-weight: 700;
        }

        .invoice-title p {
          margin: 0;
          color: #1f2937;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .company-box {
          text-align: left;
          justify-self: end;
          width: 240px;
        }

        .company-logo {
          height: 48px;
          object-fit: contain;
          display: block;
          margin-left: auto;
          margin-bottom: 8px;
        }

        .company-name {
          margin: 0 0 8px;
          color: #111827;
          font-size: 1.35rem;
          font-weight: 900;
          line-height: 1;
        }

        .company-box p {
          margin: 2px 0;
          font-size: 0.67rem;
          color: #111827;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin: 46px 0 28px;
        }

        .info-card {
          background: #edf0f4;
          min-height: 90px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 12px;
        }

        .info-card strong {
          display: block;
          font-size: 0.85rem;
          color: #111827;
        }

        .info-card span {
          display: block;
          margin-top: 4px;
          font-size: 0.68rem;
          color: #111827;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }

        .invoice-table thead tr {
          background: linear-gradient(90deg, #ff315f, #ff9a73);
          color: #fff;
        }

        .invoice-table th {
          padding: 13px 15px;
          font-size: 0.78rem;
          text-align: left;
          text-transform: uppercase;
        }

        .invoice-table th:first-child {
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }

        .invoice-table th:last-child {
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .invoice-table td {
          padding: 14px 15px;
          vertical-align: top;
          font-size: 0.82rem;
          color: #111827;
        }

        .invoice-table td:nth-child(2),
        .invoice-table td:nth-child(3),
        .invoice-table td:nth-child(4),
        .invoice-table th:nth-child(2),
        .invoice-table th:nth-child(3),
        .invoice-table th:nth-child(4) {
          text-align: right;
        }

        .item-title {
          font-weight: 900;
          display: block;
          margin-bottom: 3px;
        }

        .item-desc {
          color: #4b5563;
          font-size: 0.68rem;
        }

        .middle-line {
          height: 1px;
          background: #d1d5db;
          margin: 12px 0 20px;
        }

        .bottom-area {
          display: grid;
          grid-template-columns: 1fr 260px;
          gap: 28px;
          align-items: start;
        }

        .payment h3 {
          margin: 0 0 8px;
          font-size: 1.08rem;
          letter-spacing: 0.04em;
        }

        .payment p {
          margin: 0;
          max-width: 280px;
          color: #4b5563;
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .summary {
          display: grid;
          gap: 14px;
        }

        .summary div {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          font-size: 1rem;
          font-weight: 900;
        }

        .summary .due strong {
          background: linear-gradient(90deg, #ff315f, #ff9a73);
          color: #fff;
          padding: 8px 13px;
          border-radius: 2px;
        }

        .sign-area {
          margin-top: 52px;
          display: grid;
          grid-template-columns: 230px 1fr 150px;
          align-items: end;
          gap: 20px;
        }

        .signature-img {
          max-width: 190px;
          max-height: 58px;
          object-fit: contain;
          display: block;
          margin-bottom: 4px;
        }

        .sign-fake {
          font-family: cursive;
          font-size: 1.45rem;
          color: #111827;
          border-bottom: 1px solid #9ca3af;
          padding-bottom: 6px;
        }

        .sign-name {
          text-align: center;
          font-size: 0.82rem;
          font-weight: 900;
          margin-top: 8px;
        }

        .stamp-img {
          max-width: 115px;
          max-height: 115px;
          object-fit: contain;
          opacity: 0.9;
          justify-self: center;
        }

        .thanks {
          text-align: right;
          color: #ff4f6d;
          font-weight: 900;
          letter-spacing: 0.08em;
          font-size: 1.35rem;
        }

        .footer-text {
          position: absolute;
          z-index: 6;
          left: 46px;
          bottom: 24px;
          color: rgba(255,255,255,0.9);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .inv-toast {
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

        .inv-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .inv-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .inv-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .inv-shell {
            grid-template-columns: 1fr;
          }

          .inv-right {
            position: static;
          }

          .invoice-stage {
            --invoice-scale: 0.55;
          }
        }

        @media (max-width: 760px) {
          .inv-hero {
            padding: 48px 5% 30px;
          }

          .inv-hero h1 {
            font-size: 2.3rem;
          }

          .inv-shell {
            padding: 30px 5% 60px;
          }

          .inv-grid,
          .upload-grid {
            grid-template-columns: 1fr;
          }

          .item-row-top {
            grid-template-columns: 1fr;
          }

          .inv-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .invoice-stage {
            --invoice-scale: 0.42;
          }

          .invoice-content {
            padding: 38px 26px 54px;
          }

          .top-row,
          .bottom-area,
          .sign-area {
            grid-template-columns: 1fr;
          }

          .company-box {
            justify-self: start;
          }

          .info-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .thanks {
            text-align: left;
          }

          .inv-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .inv-card {
            padding: 16px;
            border-radius: 18px;
          }

          .invoice-stage {
            --invoice-scale: 0.32;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }

          .invoice-content {
            padding: 28px 18px 54px;
          }
        }
      `}</style>

      {toast && (
        <div className={`inv-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="inv-hero">
        <p>Convert Wala Business Tool</p>
        <h1>Invoice Generator</h1>
      </section>

      <section className="inv-shell">
        <div className="inv-left">
          <div className="inv-card">
            <h3>Upload Logo, Signature & Stamp</h3>

            <div className="upload-grid">
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadImage(e, "logo")}
                />
                <UploadCloud />
                Logo Upload
              </label>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadImage(e, "signature")}
                />
                <UploadCloud />
                Signature Upload
              </label>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadImage(e, "stamp")}
                />
                <UploadCloud />
                Stamp Upload
              </label>
            </div>

            <div className="inv-actions">
              <button className="inv-danger" type="button" onClick={clearUploads}>
                <RefreshCcw />
                Clear Uploads
              </button>
            </div>
          </div>

          <div className="inv-card">
            <h3>Header Details</h3>

            <div className="inv-grid">
              <label className="inv-field">
                Invoice Title
                <input
                  value={invoice.title}
                  onChange={(e) => updateInvoice("title", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Invoice Label
                <input
                  value={invoice.invoiceLabel}
                  onChange={(e) => updateInvoice("invoiceLabel", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Invoice For
                <input
                  value={invoice.invoiceFor}
                  onChange={(e) => updateInvoice("invoiceFor", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Company Name
                <input
                  value={invoice.companyName}
                  onChange={(e) => updateInvoice("companyName", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Phone
                <input
                  value={invoice.companyPhone}
                  onChange={(e) => updateInvoice("companyPhone", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Email
                <input
                  value={invoice.companyEmail}
                  onChange={(e) => updateInvoice("companyEmail", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Website
                <input
                  value={invoice.companyWebsite}
                  onChange={(e) => updateInvoice("companyWebsite", e.target.value)}
                />
              </label>

              <label className="inv-field span-2">
                Address
                <textarea
                  value={invoice.companyAddress}
                  onChange={(e) => updateInvoice("companyAddress", e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="inv-card">
            <h3>Info Boxes</h3>

            <div className="inv-grid">
              {[
                ["dateLabel", "Date Label"],
                ["dateValue", "Date Value"],
                ["serviceLabel", "Service Label"],
                ["serviceValue", "Service Value"],
                ["accountLabel", "Account Label"],
                ["accountValue", "Account Value"],
                ["amountLabel", "Amount Label"],
              ].map(([key, label]) => (
                <label className="inv-field" key={key}>
                  {label}
                  <input
                    value={invoice[key]}
                    onChange={(e) => updateInvoice(key, e.target.value)}
                  />
                </label>
              ))}

              <label className="inv-field">
                Currency
                <select
                  value={invoice.currency}
                  onChange={(e) => updateInvoice("currency", e.target.value)}
                >
                  <option value="INR">INR ₹</option>
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                  <option value="GBP">GBP £</option>
                </select>
              </label>

              <label className="inv-field">
                VAT / TAX %
                <input
                  type="number"
                  value={invoice.taxRate}
                  onChange={(e) => updateInvoice("taxRate", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Discount %
                <input
                  type="number"
                  value={invoice.discountRate}
                  onChange={(e) => updateInvoice("discountRate", e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="inv-card">
            <h3>Table & Total Labels</h3>

            <div className="inv-grid">
              {[
                ["itemHeader", "Item Header"],
                ["priceHeader", "Price Header"],
                ["qtyHeader", "Qty Header"],
                ["totalHeader", "Total Header"],
                ["subtotalLabel", "Subtotal Label"],
                ["discountLabel", "Discount Label"],
                ["taxLabel", "Tax Label"],
                ["totalDueLabel", "Total Due Label"],
              ].map(([key, label]) => (
                <label className="inv-field" key={key}>
                  {label}
                  <input
                    value={invoice[key]}
                    onChange={(e) => updateInvoice(key, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="inv-card">
            <h3>Item Description</h3>

            <div className="item-list">
              {items.map((item) => (
                <div className="item-row" key={item.id}>
                  <div className="item-row-top">
                    <label>
                      <span className="small-label">Item Title</span>
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, "title", e.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span className="small-label">Price</span>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", e.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span className="small-label">Qty</span>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item.id, "qty", e.target.value)
                        }
                      />
                    </label>

                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <label>
                    <span className="small-label">Description</span>
                    <textarea
                      value={item.desc}
                      onChange={(e) =>
                        updateItem(item.id, "desc", e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="inv-actions">
              <button className="inv-light" type="button" onClick={addItem}>
                <Plus />
                Add Item
              </button>
            </div>
          </div>

          <div className="inv-card">
            <h3>Payment, Signature & Footer</h3>

            <div className="inv-grid">
              <label className="inv-field">
                Payment Title
                <input
                  value={invoice.paymentTitle}
                  onChange={(e) => updateInvoice("paymentTitle", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Thank You Text
                <input
                  value={invoice.thankYouText}
                  onChange={(e) => updateInvoice("thankYouText", e.target.value)}
                />
              </label>

              <label className="inv-field span-2">
                Payment Terms
                <textarea
                  value={invoice.paymentText}
                  onChange={(e) => updateInvoice("paymentText", e.target.value)}
                />
              </label>

              <label className="inv-field">
                Signature Name
                <input
                  value={invoice.signatureName}
                  onChange={(e) =>
                    updateInvoice("signatureName", e.target.value)
                  }
                />
              </label>

              <label className="inv-field">
                Signature Title
                <input
                  value={invoice.signatureTitle}
                  onChange={(e) =>
                    updateInvoice("signatureTitle", e.target.value)
                  }
                />
              </label>

              <label className="inv-field span-2">
                Footer Text
                <input
                  value={invoice.footerText}
                  onChange={(e) => updateInvoice("footerText", e.target.value)}
                />
              </label>
            </div>

            <div className="inv-actions">
              <button
                className="inv-primary"
                type="button"
                onClick={downloadPDF}
                disabled={downloading}
              >
                <Download />
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>

        <div className="inv-right">
          <div className="inv-card">
            <h3>Live Invoice Preview</h3>

            <div className="preview-wrap">
              <div className="invoice-stage">
                <div className="invoice-sheet" ref={invoiceRef}>
                  <div className="wave-top"></div>
                  <div className="wave-top-white"></div>
                  <div className="wave-bottom"></div>

                  <div className="invoice-content">
                    <div className="top-row">
                      <div className="invoice-title">
                        <h1>{invoice.title}</h1>
                        <p>
                          {invoice.invoiceLabel}{" "}
                          <strong>{invoice.invoiceFor}</strong>
                        </p>
                      </div>

                      <div className="company-box">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Company Logo"
                            className="company-logo"
                          />
                        ) : (
                          <h2 className="company-name">{invoice.companyName}</h2>
                        )}

                        <p>Address : {invoice.companyAddress}</p>
                        <p>Phone : {invoice.companyPhone}</p>
                        <p>Email : {invoice.companyEmail}</p>
                        <p>Website : {invoice.companyWebsite}</p>
                      </div>
                    </div>

                    <div className="info-cards">
                      <div className="info-card">
                        <strong>{invoice.dateLabel}</strong>
                        <span>{invoice.dateValue}</span>
                      </div>

                      <div className="info-card">
                        <strong>{invoice.serviceLabel}</strong>
                        <span>{invoice.serviceValue}</span>
                      </div>

                      <div className="info-card">
                        <strong>{invoice.accountLabel}</strong>
                        <span>{invoice.accountValue}</span>
                      </div>

                      <div className="info-card">
                        <strong>{invoice.amountLabel}</strong>
                        <span>{formatMoney(totals.total, invoice.currency)}</span>
                      </div>
                    </div>

                    <table className="invoice-table">
                      <thead>
                        <tr>
                          <th>{invoice.itemHeader}</th>
                          <th>{invoice.priceHeader}</th>
                          <th>{invoice.qtyHeader}</th>
                          <th>{invoice.totalHeader}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span className="item-title">{item.title}</span>
                              <span className="item-desc">{item.desc}</span>
                            </td>
                            <td>{formatMoney(item.price, invoice.currency)}</td>
                            <td>{item.qty}</td>
                            <td>
                              {formatMoney(
                                Number(item.price || 0) * Number(item.qty || 0),
                                invoice.currency
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="middle-line"></div>

                    <div className="bottom-area">
                      <div className="payment">
                        <h3>{invoice.paymentTitle}</h3>
                        <p>{invoice.paymentText}</p>
                      </div>

                      <div className="summary">
                        <div>
                          <span>{invoice.subtotalLabel}</span>
                          <strong>
                            {formatMoney(totals.subtotal, invoice.currency)}
                          </strong>
                        </div>

                        {Number(invoice.discountRate) > 0 && (
                          <div>
                            <span>
                              {invoice.discountLabel} {invoice.discountRate}%
                            </span>
                            <strong>
                              {formatMoney(totals.discount, invoice.currency)}
                            </strong>
                          </div>
                        )}

                        <div>
                          <span>
                            {invoice.taxLabel} {invoice.taxRate}%
                          </span>
                          <strong>
                            {formatMoney(totals.tax, invoice.currency)}
                          </strong>
                        </div>

                        <div className="due">
                          <span>{invoice.totalDueLabel}</span>
                          <strong>
                            {formatMoney(totals.total, invoice.currency)}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="sign-area">
                      <div>
                        {signature ? (
                          <img
                            src={signature}
                            alt="Signature"
                            className="signature-img"
                          />
                        ) : (
                          <div className="sign-fake">{invoice.signatureName}</div>
                        )}
                        <div className="sign-name">{invoice.signatureTitle}</div>
                      </div>

                      {stamp ? (
                        <img src={stamp} alt="Stamp" className="stamp-img" />
                      ) : (
                        <div></div>
                      )}

                      <div className="thanks">{invoice.thankYouText}</div>
                    </div>
                  </div>

                  <div className="footer-text">{invoice.footerText}</div>
                </div>
              </div>
            </div>

            <div className="inv-actions">
              <button
                className="inv-primary"
                type="button"
                onClick={downloadPDF}
                disabled={downloading}
              >
                <FileText />
                Download Invoice PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}