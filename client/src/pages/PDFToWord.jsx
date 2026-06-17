import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  PageBreak,
} from "docx";
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

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF to Word Converter",
    subtitle:
      "Upload PDF, extract selectable text and convert it into an editable Word DOCX file. Best for text-based PDFs.",
    uploadTitle: "Upload PDF",
    changePdf: "Change PDF",
    uploadText: "Select a text-based PDF file. File stays inside browser.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    totalPages: "Total Pages",
    fileType: "File Type",
    conversionSettings: "Conversion Settings",
    pageWise: "Page Wise",
    pageWiseDesc: "Keeps every PDF page as a separate Word page.",
    continuousText: "Continuous Text",
    continuousDesc: "Converts all extracted text into one flowing Word document.",
    warning:
      "Note: Browser-based PDF to Word does not preserve exact design. It converts selectable text into editable DOCX. Scanned PDFs need OCR/backend.",
    converting: "Converting...",
    convertToWord: "Convert to Word",
    downloadDocx: "Download DOCX",
    copyText: "Copy Text",
    clear: "Clear",
    conversionProgress: "Conversion Progress",
    wordOutputPreview: "Word Output Preview",
    readyText: "Word file is ready. Use Download DOCX button to download it.",
    originalPdf: "Original PDF",
    wordFileSize: "Word File Size",
    outputFile: "Output File",
    emptyPreview: "Converted Word preview will appear here.",
    invalidPdf: "Please upload a valid PDF file.",
    uploadSuccess: "PDF uploaded successfully.",
    loadFailed: "PDF could not be loaded. It may be password protected.",
    uploadFirst: "Please upload PDF first.",
    noSelectableText:
      "No selectable text found in this PDF. It may be a scanned PDF and needs OCR.",
    convertSuccess: "PDF converted to Word successfully.",
    convertFailed: "PDF to Word conversion failed.",
    downloadFirst: "Please convert PDF to Word first.",
    downloadStarted: "Word file download started.",
    noCopyText: "There is no text to copy.",
    copied: "Extracted text copied.",
    copyFailed: "Copy failed.",
    convertedBy: "Converted by Convert Wala PDF to Word Converter",
    seoTitle:
      "Free PDF to Word Converter Online - Convert PDF to DOCX | Convert Wala",
    seoDescription:
      "Convert PDF to Word online for free with Convert Wala PDF to Word Converter. Upload a text-based PDF, extract selectable text and download an editable DOCX file directly from your browser.",
    seoKeywords:
      "PDF to Word, PDF to DOCX, free PDF to Word converter, convert PDF to Word online, PDF text extractor, editable Word converter, online PDF converter, Convert Wala PDF tools",
  },

  hi: {
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF to Word Converter",
    subtitle:
      "PDF upload करें, selectable text extract करें और उसे editable Word DOCX file में convert करें। Text-based PDFs के लिए best है।",
    uploadTitle: "PDF Upload करें",
    changePdf: "PDF बदलें",
    uploadText: "Text-based PDF file select करें। File browser के अंदर ही रहती है।",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    totalPages: "Total Pages",
    fileType: "File Type",
    conversionSettings: "Conversion Settings",
    pageWise: "Page Wise",
    pageWiseDesc: "हर PDF page को Word में separate page के रूप में रखेगा।",
    continuousText: "Continuous Text",
    continuousDesc: "सारा extracted text एक flow में Word document में convert करेगा।",
    warning:
      "Note: Browser-based PDF to Word exact design preserve नहीं करता। यह selectable text को editable DOCX में convert करता है। Scanned PDF के लिए OCR/backend चाहिए।",
    converting: "Converting...",
    convertToWord: "Word में Convert करें",
    downloadDocx: "Download DOCX",
    copyText: "Copy Text",
    clear: "Clear",
    conversionProgress: "Conversion Progress",
    wordOutputPreview: "Word Output Preview",
    readyText: "Word file ready है। Download DOCX button से file download करें।",
    originalPdf: "Original PDF",
    wordFileSize: "Word File Size",
    outputFile: "Output File",
    emptyPreview: "Converted Word preview यहां दिखाई देगा।",
    invalidPdf: "कृपया valid PDF file upload करें।",
    uploadSuccess: "PDF successfully upload हो गई।",
    loadFailed: "PDF load नहीं हो पाया। Password protected PDF हो सकता है।",
    uploadFirst: "कृपया पहले PDF upload करें।",
    noSelectableText:
      "इस PDF में selectable text नहीं मिला। यह scanned PDF हो सकता है, OCR चाहिए।",
    convertSuccess: "PDF successfully Word में convert हो गई।",
    convertFailed: "PDF to Word conversion failed.",
    downloadFirst: "कृपया पहले PDF को Word में convert करें।",
    downloadStarted: "Word file download started.",
    noCopyText: "Copy करने के लिए text नहीं है।",
    copied: "Extracted text copied.",
    copyFailed: "Copy failed.",
    convertedBy: "Converted by Convert Wala PDF to Word Converter",
    seoTitle:
      "Free PDF to Word Converter Online - PDF को DOCX में बदलें | Convert Wala",
    seoDescription:
      "Convert Wala PDF to Word Converter से PDF को online free में Word DOCX में convert करें। Text-based PDF upload करें, selectable text extract करें और editable DOCX download करें।",
    seoKeywords:
      "PDF to Word, PDF to DOCX, PDF ko Word me badle, free PDF to Word converter, online PDF converter, editable Word converter, Convert Wala PDF tools",
  },

  hinglish: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF to Word Converter",
    subtitle:
      "PDF upload karo, selectable text extract karo aur editable Word DOCX file me convert karo. Text-based PDFs ke liye best hai.",
    uploadTitle: "Upload PDF",
    changePdf: "Change PDF",
    uploadText: "Text-based PDF file select karo. File browser ke andar hi rehti hai.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    totalPages: "Total Pages",
    fileType: "File Type",
    conversionSettings: "Conversion Settings",
    pageWise: "Page Wise",
    pageWiseDesc: "Har PDF page ko Word me separate page ke roop me rakhega.",
    continuousText: "Continuous Text",
    continuousDesc: "Saara extracted text ek flow me Word document me convert karega.",
    warning:
      "Note: Browser-based PDF to Word exact design preserve nahi karta. Ye selectable text ko editable DOCX me convert karta hai. Scanned PDF ke liye OCR/backend chahiye.",
    converting: "Converting...",
    convertToWord: "Convert to Word",
    downloadDocx: "Download DOCX",
    copyText: "Copy Text",
    clear: "Clear",
    conversionProgress: "Conversion Progress",
    wordOutputPreview: "Word Output Preview",
    readyText: "Word file ready hai. Download DOCX button se file download karo.",
    originalPdf: "Original PDF",
    wordFileSize: "Word File Size",
    outputFile: "Output File",
    emptyPreview: "Converted Word preview yahan appear hoga.",
    invalidPdf: "Please valid PDF file upload karo.",
    uploadSuccess: "PDF successfully upload ho gayi.",
    loadFailed: "PDF load nahi ho paya. Password protected PDF ho sakta hai.",
    uploadFirst: "Pehle PDF upload karo.",
    noSelectableText:
      "Is PDF me selectable text nahi mila. Ye scanned PDF ho sakta hai, OCR chahiye.",
    convertSuccess: "PDF converted to Word successfully.",
    convertFailed: "PDF to Word conversion failed.",
    downloadFirst: "Pehle PDF ko Word me convert karo.",
    downloadStarted: "Word file download started.",
    noCopyText: "Copy karne ke liye text nahi hai.",
    copied: "Extracted text copied.",
    copyFailed: "Copy failed.",
    convertedBy: "Converted by Convert Wala PDF to Word Converter",
    seoTitle:
      "Free PDF to Word Converter Online - Convert PDF to DOCX | Convert Wala",
    seoDescription:
      "Convert Wala PDF to Word Converter se PDF ko Word DOCX me online free convert karo. Text-based PDF upload karo, selectable text extract karo aur editable DOCX download karo.",
    seoKeywords:
      "PDF to Word, PDF to DOCX, free PDF to Word converter, convert PDF to Word online, PDF text extractor, editable Word converter, Convert Wala PDF tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "pdf_to_word") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

export default function PDFToWord() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [extractedPages, setExtractedPages] = useState([]);
  const [docxBlob, setDocxBlob] = useState(null);
  const [docxUrl, setDocxUrl] = useState("");
  const [mode, setMode] = useState("pagewise");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/pdf-to-word";

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

  const clearResult = () => {
    if (docxUrl) URL.revokeObjectURL(docxUrl);
    setDocxBlob(null);
    setDocxUrl("");
    setExtractedPages([]);
    setProgress(0);
  };

  const resetAll = () => {
    if (docxUrl) URL.revokeObjectURL(docxUrl);

    setFile(null);
    setFileInfo(null);
    setExtractedPages([]);
    setDocxBlob(null);
    setDocxUrl("");
    setMode("pagewise");
    setProcessing(false);
    setProgress(0);
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      showToast("error", t.invalidPdf);
      return;
    }

    try {
      resetAll();

      const buffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useWorkerFetch: true,
        isEvalSupported: false,
        disableFontFace: false,
      }).promise;

      setFile(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        pages: pdf.numPages,
        type: selectedFile.type,
      });

      showToast("success", t.uploadSuccess);
    } catch {
      showToast("error", t.loadFailed);
    }

    e.target.value = "";
  };

  const extractTextFromPDF = async () => {
    if (!file) {
      showToast("error", t.uploadFirst);
      return;
    }

    try {
      clearResult();
      setProcessing(true);
      setProgress(0);

      const buffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useWorkerFetch: true,
        isEvalSupported: false,
        disableFontFace: false,
      }).promise;

      const pages = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const linesMap = new Map();

        textContent.items.forEach((item) => {
          const y = Math.round(item.transform[5]);
          const text = item.str?.trim();

          if (!text) return;

          if (!linesMap.has(y)) {
            linesMap.set(y, []);
          }

          linesMap.get(y).push({
            text,
            x: item.transform[4],
          });
        });

        const lines = [...linesMap.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([, items]) =>
            items
              .sort((a, b) => a.x - b.x)
              .map((item) => item.text)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim()
          )
          .filter(Boolean);

        pages.push({
          pageNumber,
          text: lines.join("\n"),
        });

        setProgress(Math.round((pageNumber / pdf.numPages) * 100));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      setExtractedPages(pages);

      const hasText = pages.some((page) => page.text.trim());

      if (!hasText) {
        setProcessing(false);
        showToast("error", t.noSelectableText);
        return;
      }

      await createWordFile(pages);

      setProcessing(false);
      setProgress(100);
      showToast("success", t.convertSuccess);
    } catch {
      setProcessing(false);
      showToast("error", t.convertFailed);
    }
  };

  const createWordFile = async (pages) => {
    const children = [];

    children.push(
      new Paragraph({
        text: cleanFileName(file?.name || "PDF Document"),
        heading: HeadingLevel.TITLE,
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: t.convertedBy,
            italics: true,
            color: "64748B",
          }),
        ],
      })
    );

    children.push(new Paragraph({ text: "" }));

    pages.forEach((page, pageIndex) => {
      if (mode === "pagewise") {
        children.push(
          new Paragraph({
            text: `Page ${page.pageNumber}`,
            heading: HeadingLevel.HEADING_2,
          })
        );
      }

      const lines = page.text.split("\n").filter(Boolean);

      lines.forEach((line) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 22,
              }),
            ],
            spacing: {
              after: 120,
            },
          })
        );
      });

      if (mode === "pagewise" && pageIndex < pages.length - 1) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);

    setDocxBlob(blob);
    setDocxUrl(url);
  };

  const downloadWord = () => {
    if (!docxBlob || !docxUrl || !file) {
      showToast("error", t.downloadFirst);
      return;
    }

    const outputName = `Convert Wala_${cleanFileName(file.name)}_converted.docx`;

    const link = document.createElement("a");
    link.href = docxUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  const copyText = async () => {
    const text = extractedPages
      .map((page) => `Page ${page.pageNumber}\n${page.text}`)
      .join("\n\n");

    if (!text.trim()) {
      showToast("error", t.noCopyText);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  return (
    <main className={`ptw-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala PDF to Word Converter",
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
              "Convert PDF to Word",
              "Extract selectable PDF text",
              "Download DOCX file",
              "Page wise conversion",
              "Continuous text conversion",
              "Browser-based PDF conversion",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .ptw-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .ptw-page * {
          box-sizing: border-box;
        }

        .ptw-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .ptw-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .ptw-page.dark .ptw-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .ptw-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ptw-page.dark .ptw-eyebrow {
          color: #93c5fd;
        }

        .ptw-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .ptw-page.dark .ptw-hero h1 {
          color: #f8fafc;
        }

        .ptw-hero p {
          max-width: 880px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .ptw-page.dark .ptw-hero p,
        .ptw-page.dark .ptw-upload p,
        .ptw-page.dark .ptw-note,
        .ptw-page.dark .ptw-info-grid span,
        .ptw-page.dark .ptw-result-grid span,
        .ptw-page.dark .ptw-mode-btn span,
        .ptw-page.dark .ptw-empty {
          color: #cbd5e1;
        }

        .ptw-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .ptw-left,
        .ptw-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .ptw-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .ptw-page.dark .ptw-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .ptw-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .ptw-page.dark .ptw-card h3,
        .ptw-page.dark .ptw-upload strong,
        .ptw-page.dark .ptw-info-grid strong,
        .ptw-page.dark .ptw-result-grid strong,
        .ptw-page.dark .ptw-progress-head {
          color: #f8fafc;
        }

        .ptw-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .ptw-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
        }

        .ptw-upload input {
          display: none;
        }

        .ptw-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .ptw-page.dark .ptw-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .ptw-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .ptw-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .ptw-upload p,
        .ptw-note {
          color: #64748b;
          line-height: 1.6;
        }

        .ptw-info-grid,
        .ptw-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .ptw-info-grid div,
        .ptw-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .ptw-page.dark .ptw-info-grid div,
        .ptw-page.dark .ptw-result-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .ptw-info-grid span,
        .ptw-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .ptw-info-grid strong,
        .ptw-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .ptw-mode-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .ptw-mode-btn {
          min-height: 76px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 18px;
          padding: 14px;
          font-weight: 900;
          cursor: pointer;
          text-align: left;
        }

        .ptw-page.dark .ptw-mode-btn {
          background: #020617;
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ptw-mode-btn span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          margin-top: 5px;
          line-height: 1.45;
        }

        .ptw-mode-btn.active {
          background: #eff6ff;
          border-color: #2563eb;
          color: #2563eb;
        }

        .ptw-page.dark .ptw-mode-btn.active {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.32);
          color: #7dd3fc;
        }

        .ptw-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .ptw-primary,
        .ptw-dark,
        .ptw-light,
        .ptw-danger {
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

        .ptw-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .ptw-dark {
          background: #111827;
          color: #ffffff;
        }

        .ptw-page.dark .ptw-dark {
          background: #38bdf8;
          color: #020617;
        }

        .ptw-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .ptw-page.dark .ptw-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .ptw-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .ptw-primary:disabled,
        .ptw-dark:disabled,
        .ptw-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .ptw-progress-wrap {
          margin-top: 20px;
        }

        .ptw-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .ptw-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .ptw-page.dark .ptw-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .ptw-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
          transition: width 0.22s ease;
        }

        .ptw-page.dark .ptw-progress span {
          background: #38bdf8;
        }

        .ptw-preview {
          min-height: 420px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          padding: 22px;
          color: #334155;
          overflow: auto;
          max-height: 620px;
          white-space: pre-wrap;
          line-height: 1.7;
        }

        .ptw-page.dark .ptw-preview {
          background: #020617;
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ptw-empty {
          min-height: 420px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #94a3b8;
        }

        .ptw-empty svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .ptw-warning {
          padding: 16px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.7;
          font-weight: 800;
          margin-top: 16px;
        }

        .ptw-success {
          padding: 18px;
          border-radius: 20px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .ptw-toast {
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

        .ptw-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .ptw-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ptw-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .ptw-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .ptw-hero {
            padding: 56px 5% 34px;
          }

          .ptw-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .ptw-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .ptw-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .ptw-card {
            padding: 20px;
            border-radius: 22px;
          }

          .ptw-info-grid,
          .ptw-result-grid,
          .ptw-mode-grid {
            grid-template-columns: 1fr;
          }

          .ptw-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ptw-primary,
          .ptw-dark,
          .ptw-light,
          .ptw-danger {
            width: 100%;
          }

          .ptw-preview,
          .ptw-empty {
            min-height: 300px;
          }

          .ptw-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .ptw-hero {
            padding: 44px 4.5% 28px;
          }

          .ptw-hero h1 {
            font-size: 2rem;
          }

          .ptw-shell {
            padding: 24px 4.5% 48px;
          }

          .ptw-card {
            padding: 16px;
            border-radius: 18px;
          }
        }
      `}</style>

      {toast && (
        <div className={`ptw-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="ptw-hero">
        <p className="ptw-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="ptw-shell">
        <div className="ptw-left">
          <label className="ptw-card ptw-upload">
            <input type="file" accept="application/pdf" onChange={handleUpload} />
            <span className="ptw-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changePdf : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {fileInfo && (
            <div className="ptw-card">
              <h3>{t.pdfDetails}</h3>

              <div className="ptw-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{fileInfo.name}</strong>
                </div>

                <div>
                  <span>{t.fileSize}</span>
                  <strong>{formatBytes(fileInfo.size)}</strong>
                </div>

                <div>
                  <span>{t.totalPages}</span>
                  <strong>{fileInfo.pages}</strong>
                </div>

                <div>
                  <span>{t.fileType}</span>
                  <strong>{fileInfo.type}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="ptw-card">
            <h3>{t.conversionSettings}</h3>

            <div className="ptw-mode-grid">
              <button
                type="button"
                className={`ptw-mode-btn ${mode === "pagewise" ? "active" : ""}`}
                onClick={() => {
                  setMode("pagewise");
                  clearResult();
                }}
              >
                {t.pageWise}
                <span>{t.pageWiseDesc}</span>
              </button>

              <button
                type="button"
                className={`ptw-mode-btn ${mode === "continuous" ? "active" : ""}`}
                onClick={() => {
                  setMode("continuous");
                  clearResult();
                }}
              >
                {t.continuousText}
                <span>{t.continuousDesc}</span>
              </button>
            </div>

            <div className="ptw-warning">{t.warning}</div>

            <div className="ptw-actions">
              <button
                type="button"
                className="ptw-primary"
                onClick={extractTextFromPDF}
                disabled={!file || processing}
              >
                <RefreshCcw />
                {processing ? t.converting : t.convertToWord}
              </button>

              <button
                type="button"
                className="ptw-dark"
                onClick={downloadWord}
                disabled={!docxBlob}
              >
                <Download />
                {t.downloadDocx}
              </button>
            </div>

            <div className="ptw-actions">
              <button type="button" className="ptw-light" onClick={copyText}>
                <Copy />
                {t.copyText}
              </button>

              <button type="button" className="ptw-danger" onClick={resetAll}>
                <Trash2 />
                {t.clear}
              </button>
            </div>

            {(processing || progress > 0) && (
              <div className="ptw-progress-wrap">
                <div className="ptw-progress-head">
                  <span>{t.conversionProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="ptw-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ptw-right">
          <div className="ptw-card">
            <h3>{t.wordOutputPreview}</h3>

            {docxBlob ? (
              <>
                <div className="ptw-success">{t.readyText}</div>

                <div className="ptw-result-grid">
                  <div>
                    <span>{t.originalPdf}</span>
                    <strong>{formatBytes(file?.size)}</strong>
                  </div>

                  <div>
                    <span>{t.wordFileSize}</span>
                    <strong>{formatBytes(docxBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.totalPages}</span>
                    <strong>{fileInfo?.pages}</strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "pdf")}_converted.docx
                    </strong>
                  </div>
                </div>

                <div className="ptw-actions">
                  <button type="button" className="ptw-primary" onClick={downloadWord}>
                    <Download />
                    {t.downloadDocx}
                  </button>
                </div>
              </>
            ) : extractedPages.length ? (
              <div className="ptw-preview">
                {extractedPages
                  .map((page) => `Page ${page.pageNumber}\n${page.text}`)
                  .join("\n\n")}
              </div>
            ) : (
              <div className="ptw-empty">
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