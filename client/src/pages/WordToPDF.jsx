import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import mammoth from "mammoth";
import html2pdf from "html2pdf.js";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Copy,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala Document Tool",
    title: "Word to PDF Converter",
    subtitle:
      "Upload DOCX Word file, preview content and convert it into PDF directly inside browser.",
    uploadTitle: "Upload DOCX File",
    changeDocx: "Change DOCX File",
    uploadText: "Select a .docx Word file. File stays inside browser.",
    wordDetails: "Word File Details",
    fileName: "File Name",
    fileSize: "File Size",
    fileType: "File Type",
    warnings: "Warnings",
    pdfSettings: "PDF Settings",
    pageSize: "Page Size",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    warning:
      "Note: Browser-based Word to PDF does not preserve exact MS Word layout 100%. It converts DOCX content into a clean PDF.",
    converting: "Converting...",
    convertToPdf: "Convert to PDF",
    downloadPdf: "Download PDF",
    copyText: "Copy Text",
    clear: "Clear",
    wordPreview: "Word Preview",
    pdfReady: "PDF is ready. Use Download PDF button to save the file.",
    originalWordSize: "Original Word Size",
    pdfSize: "PDF Size",
    outputFile: "Output File",
    emptyPreview: "Word preview will appear here.",
    invalidDocx: "Please upload only .docx Word file.",
    contentFailed: "Word file content could not be read.",
    uploadSuccess: "Word file uploaded successfully.",
    readFailed: "Word file could not be read. Upload a valid DOCX file.",
    uploadFirst: "Please upload Word file first.",
    convertSuccess: "Word converted to PDF successfully.",
    convertFailed:
      "PDF could not be converted. Try with simpler DOCX content.",
    convertFirst: "Please convert PDF first.",
    downloadStarted: "PDF download started.",
    noCopyText: "There is no text to copy.",
    copied: "Text copied.",
    copyFailed: "Copy failed.",
    seoTitle:
      "Free Word to PDF Converter Online - Convert DOCX to PDF | Convert Wala",
    seoDescription:
      "Convert Word DOCX files to PDF online for free with Convert Wala Word to PDF Converter. Upload DOCX, preview content and download a PDF directly from your browser.",
    seoKeywords:
      "Word to PDF, DOCX to PDF, free Word to PDF converter, convert DOCX to PDF online, online document converter, Word file to PDF, browser Word to PDF, Convert Wala document tools",
  },

  hi: {
    eyebrow: "Convert Wala डॉक्यूमेंट टूल",
    title: "Word to PDF Converter",
    subtitle:
      "DOCX Word file upload करें, content preview करें और browser के अंदर directly PDF में convert करें।",
    uploadTitle: "DOCX File Upload करें",
    changeDocx: "DOCX File बदलें",
    uploadText: ".docx Word file select करें। File browser के अंदर ही रहती है।",
    wordDetails: "Word File Details",
    fileName: "File Name",
    fileSize: "File Size",
    fileType: "File Type",
    warnings: "Warnings",
    pdfSettings: "PDF Settings",
    pageSize: "Page Size",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    warning:
      "Note: Browser-based Word to PDF exact MS Word layout 100% preserve नहीं करता। यह DOCX content को clean PDF में convert करता है।",
    converting: "Converting...",
    convertToPdf: "PDF में Convert करें",
    downloadPdf: "Download PDF",
    copyText: "Copy Text",
    clear: "Clear",
    wordPreview: "Word Preview",
    pdfReady: "PDF ready है। Download PDF button से file save करें।",
    originalWordSize: "Original Word Size",
    pdfSize: "PDF Size",
    outputFile: "Output File",
    emptyPreview: "Word preview यहां दिखाई देगा।",
    invalidDocx: "कृपया केवल .docx Word file upload करें।",
    contentFailed: "Word file content read नहीं हो पाया।",
    uploadSuccess: "Word file successfully upload हो गई।",
    readFailed: "Word file read नहीं हो पाई। Valid DOCX upload करें।",
    uploadFirst: "कृपया पहले Word file upload करें।",
    convertSuccess: "Word successfully PDF में convert हो गया।",
    convertFailed:
      "PDF convert नहीं हुआ। DOCX content simple करके try करें।",
    convertFirst: "कृपया पहले PDF convert करें।",
    downloadStarted: "PDF download started.",
    noCopyText: "Copy करने के लिए text नहीं है।",
    copied: "Text copied.",
    copyFailed: "Copy failed.",
    seoTitle:
      "Free Word to PDF Converter Online - DOCX को PDF में बदलें | Convert Wala",
    seoDescription:
      "Convert Wala Word to PDF Converter से DOCX Word files को online free में PDF में convert करें। DOCX upload करें, preview देखें और browser से PDF download करें।",
    seoKeywords:
      "Word to PDF, DOCX to PDF, Word ko PDF me badle, free Word to PDF converter, online document converter, DOCX converter, Convert Wala document tools",
  },

  hinglish: {
    eyebrow: "Convert Wala Document Tool",
    title: "Word to PDF Converter",
    subtitle:
      "DOCX Word file upload karo, content preview karo aur browser ke andar directly PDF me convert karo.",
    uploadTitle: "Upload DOCX File",
    changeDocx: "Change DOCX File",
    uploadText: ".docx Word file select karo. File browser ke andar hi rehti hai.",
    wordDetails: "Word File Details",
    fileName: "File Name",
    fileSize: "File Size",
    fileType: "File Type",
    warnings: "Warnings",
    pdfSettings: "PDF Settings",
    pageSize: "Page Size",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    warning:
      "Note: Browser-based Word to PDF exact MS Word layout 100% preserve nahi karta. Ye DOCX content ko clean PDF me convert karta hai.",
    converting: "Converting...",
    convertToPdf: "Convert to PDF",
    downloadPdf: "Download PDF",
    copyText: "Copy Text",
    clear: "Clear",
    wordPreview: "Word Preview",
    pdfReady: "PDF ready hai. Download PDF button se file save karo.",
    originalWordSize: "Original Word Size",
    pdfSize: "PDF Size",
    outputFile: "Output File",
    emptyPreview: "Word preview yahan appear hoga.",
    invalidDocx: "Please only .docx Word file upload karo.",
    contentFailed: "Word file content read nahi ho paya.",
    uploadSuccess: "Word file successfully upload ho gayi.",
    readFailed: "Word file read nahi ho payi. Valid DOCX upload karo.",
    uploadFirst: "Pehle Word file upload karo.",
    convertSuccess: "Word converted to PDF successfully.",
    convertFailed:
      "PDF convert nahi hua. DOCX content simple karke try karo.",
    convertFirst: "Pehle PDF convert karo.",
    downloadStarted: "PDF download started.",
    noCopyText: "Copy karne ke liye text nahi hai.",
    copied: "Text copied.",
    copyFailed: "Copy failed.",
    seoTitle:
      "Free Word to PDF Converter Online - Convert DOCX to PDF | Convert Wala",
    seoDescription:
      "Convert Wala Word to PDF Converter se DOCX Word files ko PDF me online free convert karo. DOCX upload karo, preview dekho aur browser se PDF download karo.",
    seoKeywords:
      "Word to PDF, DOCX to PDF, free Word to PDF converter, convert DOCX to PDF online, online document converter, Word file to PDF, Convert Wala document tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "word_to_pdf") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

const sanitizeHtml = (html = "") => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("script, style, iframe").forEach((el) => el.remove());

  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase();

      if (name.startsWith("on") || value.includes("javascript:")) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};

export default function WordToPDF() {
  const previewRef = useRef(null);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [orientation, setOrientation] = useState("portrait");
  const [pageSize, setPageSize] = useState("a4");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/word-to-pdf";

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
    setTimeout(() => setToast(null), 2800);
  };

  const clearPDF = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfBlob(null);
    setPdfUrl("");
  };

  const resetAll = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    setFile(null);
    setFileInfo(null);
    setHtmlContent("");
    setPlainText("");
    setPdfBlob(null);
    setPdfUrl("");
    setOrientation("portrait");
    setPageSize("a4");
    setProcessing(false);
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    if (!fileName.endsWith(".docx")) {
      showToast("error", t.invalidDocx);
      e.target.value = "";
      return;
    }

    try {
      resetAll();

      const arrayBuffer = await selectedFile.arrayBuffer();

      const htmlResult = await mammoth.convertToHtml({
        arrayBuffer,
      });

      const textResult = await mammoth.extractRawText({
        arrayBuffer,
      });

      const safeHtml = sanitizeHtml(htmlResult.value);

      if (!safeHtml.trim()) {
        showToast("error", t.contentFailed);
        return;
      }

      setFile(selectedFile);
      setHtmlContent(safeHtml);
      setPlainText(textResult.value || "");

      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type:
          selectedFile.type ||
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        warnings: htmlResult.messages?.length || 0,
      });

      clearPDF();
      showToast("success", t.uploadSuccess);
    } catch {
      showToast("error", t.readFailed);
    }

    e.target.value = "";
  };

  const convertToPDF = async () => {
    if (!file || !htmlContent || !previewRef.current) {
      showToast("error", t.uploadFirst);
      return;
    }

    try {
      clearPDF();
      setProcessing(true);

      const outputName = `Convert Wala_${cleanFileName(file.name)}_converted.pdf`;

      const options = {
        margin: [10, 10, 10, 10],
        filename: outputName,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: pageSize,
          orientation,
          compress: true,
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      };

      const worker = html2pdf().set(options).from(previewRef.current).toPdf();
      const blob = await worker.outputPdf("blob");

      const url = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setProcessing(false);

      showToast("success", t.convertSuccess);
    } catch {
      setProcessing(false);
      showToast("error", t.convertFailed);
    }
  };

  const downloadPDF = () => {
    if (!pdfBlob || !pdfUrl || !file) {
      showToast("error", t.convertFirst);
      return;
    }

    const outputName = `Convert Wala_${cleanFileName(file.name)}_converted.pdf`;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  const copyText = async () => {
    if (!plainText.trim()) {
      showToast("error", t.noCopyText);
      return;
    }

    try {
      await navigator.clipboard.writeText(plainText);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  return (
    <main className={`wtp-page ${theme === "dark" ? "dark" : "light"}`}>
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
        <meta property="og:locale" content={language === "hi" ? "hi_IN" : "en_US"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Word to PDF Converter",
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
              "Convert Word to PDF",
              "Convert DOCX to PDF online",
              "Preview Word document",
              "Copy Word text",
              "Browser-based document conversion",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .wtp-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .wtp-page * {
          box-sizing: border-box;
        }

        .wtp-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .wtp-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .wtp-page.dark .wtp-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .wtp-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .wtp-page.dark .wtp-eyebrow {
          color: #93c5fd;
        }

        .wtp-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .wtp-page.dark .wtp-hero h1 {
          color: #f8fafc;
        }

        .wtp-hero p {
          max-width: 880px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .wtp-page.dark .wtp-hero p,
        .wtp-page.dark .wtp-upload p,
        .wtp-page.dark .wtp-note,
        .wtp-page.dark .wtp-info-grid span,
        .wtp-page.dark .wtp-result-grid span,
        .wtp-page.dark .wtp-empty {
          color: #cbd5e1;
        }

        .wtp-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .wtp-left,
        .wtp-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .wtp-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .wtp-page.dark .wtp-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .wtp-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .wtp-page.dark .wtp-card h3,
        .wtp-page.dark .wtp-upload strong,
        .wtp-page.dark .wtp-info-grid strong,
        .wtp-page.dark .wtp-result-grid strong,
        .wtp-page.dark .wtp-field {
          color: #f8fafc;
        }

        .wtp-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .wtp-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
        }

        .wtp-upload input {
          display: none;
        }

        .wtp-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .wtp-page.dark .wtp-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .wtp-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .wtp-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .wtp-upload p,
        .wtp-note {
          color: #64748b;
          line-height: 1.6;
        }

        .wtp-info-grid,
        .wtp-result-grid,
        .wtp-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .wtp-info-grid div,
        .wtp-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .wtp-page.dark .wtp-info-grid div,
        .wtp-page.dark .wtp-result-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .wtp-info-grid span,
        .wtp-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .wtp-info-grid strong,
        .wtp-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .wtp-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .wtp-field select {
          width: 100%;
          margin-top: 8px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 16px;
          padding: 13px 15px;
          outline: none;
          font-weight: 800;
        }

        .wtp-page.dark .wtp-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .wtp-page.dark .wtp-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .wtp-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .wtp-primary,
        .wtp-dark,
        .wtp-light,
        .wtp-danger {
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
          transition: 0.22s ease;
          flex: 1;
          text-decoration: none;
        }

        .wtp-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .wtp-dark {
          background: #111827;
          color: #ffffff;
        }

        .wtp-page.dark .wtp-dark {
          background: #38bdf8;
          color: #020617;
        }

        .wtp-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .wtp-page.dark .wtp-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .wtp-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .wtp-primary:disabled,
        .wtp-dark:disabled,
        .wtp-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .wtp-preview-wrap {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          padding: 20px;
          overflow: auto;
          max-height: 720px;
        }

        .wtp-page.dark .wtp-preview-wrap,
        .wtp-page.dark .wtp-empty {
          background: #020617;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .wtp-doc-preview {
          width: 794px;
          min-height: 1123px;
          max-width: 100%;
          margin: 0 auto;
          background: #ffffff;
          color: #111827;
          padding: 56px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.14);
          font-family: Arial, sans-serif;
          line-height: 1.65;
          overflow-wrap: break-word;
        }

        .wtp-doc-preview h1,
        .wtp-doc-preview h2,
        .wtp-doc-preview h3 {
          color: #0f172a;
          line-height: 1.25;
          margin: 18px 0 10px;
        }

        .wtp-doc-preview p {
          margin: 0 0 10px;
        }

        .wtp-doc-preview ul,
        .wtp-doc-preview ol {
          padding-left: 24px;
        }

        .wtp-empty {
          min-height: 420px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #94a3b8;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          padding: 30px;
        }

        .wtp-empty svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .wtp-success {
          padding: 18px;
          border-radius: 20px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .wtp-warning {
          padding: 16px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.7;
          font-weight: 800;
          margin-top: 16px;
        }

        .wtp-toast {
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

        .wtp-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .wtp-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .wtp-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .wtp-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .wtp-hero {
            padding: 56px 5% 34px;
          }

          .wtp-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .wtp-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .wtp-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .wtp-card {
            padding: 20px;
            border-radius: 22px;
          }

          .wtp-info-grid,
          .wtp-result-grid,
          .wtp-form-grid {
            grid-template-columns: 1fr;
          }

          .wtp-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .wtp-primary,
          .wtp-dark,
          .wtp-light,
          .wtp-danger {
            width: 100%;
          }

          .wtp-doc-preview {
            padding: 28px;
            min-height: 780px;
          }

          .wtp-empty {
            min-height: 300px;
          }

          .wtp-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .wtp-hero {
            padding: 44px 4.5% 28px;
          }

          .wtp-hero h1 {
            font-size: 2rem;
          }

          .wtp-shell {
            padding: 24px 4.5% 48px;
          }

          .wtp-card {
            padding: 16px;
            border-radius: 18px;
          }

          .wtp-doc-preview {
            padding: 20px;
          }
        }
      `}</style>

      {toast && (
        <div className={`wtp-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="wtp-hero">
        <p className="wtp-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="wtp-shell">
        <div className="wtp-left">
          <label className="wtp-card wtp-upload">
            <input
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleUpload}
            />
            <span className="wtp-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changeDocx : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {fileInfo && (
            <div className="wtp-card">
              <h3>{t.wordDetails}</h3>

              <div className="wtp-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{fileInfo.name}</strong>
                </div>

                <div>
                  <span>{t.fileSize}</span>
                  <strong>{formatBytes(fileInfo.size)}</strong>
                </div>

                <div>
                  <span>{t.fileType}</span>
                  <strong>DOCX</strong>
                </div>

                <div>
                  <span>{t.warnings}</span>
                  <strong>{fileInfo.warnings}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="wtp-card">
            <h3>{t.pdfSettings}</h3>

            <div className="wtp-form-grid">
              <label className="wtp-field">
                {t.pageSize}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    clearPDF();
                  }}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </label>

              <label className="wtp-field">
                {t.orientation}
                <select
                  value={orientation}
                  onChange={(e) => {
                    setOrientation(e.target.value);
                    clearPDF();
                  }}
                >
                  <option value="portrait">{t.portrait}</option>
                  <option value="landscape">{t.landscape}</option>
                </select>
              </label>
            </div>

            <div className="wtp-warning">{t.warning}</div>

            <div className="wtp-actions">
              <button
                type="button"
                className="wtp-primary"
                onClick={convertToPDF}
                disabled={!file || processing}
              >
                <RefreshCcw />
                {processing ? t.converting : t.convertToPdf}
              </button>

              <button
                type="button"
                className="wtp-dark"
                onClick={downloadPDF}
                disabled={!pdfBlob}
              >
                <Download />
                {t.downloadPdf}
              </button>
            </div>

            <div className="wtp-actions">
              <button type="button" className="wtp-light" onClick={copyText}>
                <Copy />
                {t.copyText}
              </button>

              <button type="button" className="wtp-danger" onClick={resetAll}>
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>
        </div>

        <div className="wtp-right">
          <div className="wtp-card">
            <h3>{t.wordPreview}</h3>

            {pdfBlob && <div className="wtp-success">{t.pdfReady}</div>}

            {htmlContent ? (
              <>
                <div className="wtp-preview-wrap">
                  <div
                    ref={previewRef}
                    className="wtp-doc-preview"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>

                {pdfBlob && (
                  <div className="wtp-result-grid" style={{ marginTop: 16 }}>
                    <div>
                      <span>{t.originalWordSize}</span>
                      <strong>{formatBytes(file?.size)}</strong>
                    </div>

                    <div>
                      <span>{t.pdfSize}</span>
                      <strong>{formatBytes(pdfBlob.size)}</strong>
                    </div>

                    <div>
                      <span>{t.pageSize}</span>
                      <strong>{pageSize.toUpperCase()}</strong>
                    </div>

                    <div>
                      <span>{t.outputFile}</span>
                      <strong>
                        Convert Wala_{cleanFileName(file?.name || "word")}
                        _converted.pdf
                      </strong>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="wtp-empty">
                <div>
                  <FileText />
                  <p>{t.emptyPreview}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}