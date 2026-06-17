import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { jsPDF } from "jspdf";
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
    title: "PDF Compressor",
    subtitle:
      "Upload PDF, choose compression mode and download a smaller PDF. Strong mode gives better size reduction by converting pages into compressed images.",
    uploadTitle: "Upload PDF",
    changePdf: "Change PDF",
    uploadText: "Select any PDF file from your device. File stays inside browser.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    originalSize: "Original Size",
    totalPages: "Total Pages",
    fileType: "File Type",
    compressionMode: "Compression Mode",
    smartOptimize: "Smart Optimize",
    smartDesc: "Preserves text/selectable PDF, compression is light.",
    strongCompress: "Strong Compress",
    strongDesc:
      "Converts pages into compressed image PDF, gives better size reduction.",
    quality: "Quality",
    pageScale: "Page Scale",
    strongWarning:
      "In strong mode, PDF text will not remain selectable because pages become images. Best for scanned/image PDFs.",
    compressing: "Compressing...",
    compressPdf: "Compress PDF",
    download: "Download",
    copyInfo: "Copy Info",
    clear: "Clear",
    compressionProgress: "Compression Progress",
    compressionResult: "Compression Result",
    sizeReduced: "Size Reduced",
    compressedSize: "Compressed Size",
    mode: "Mode",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    downloadPdf: "Download PDF",
    emptyResult: "Compressed PDF result will appear here.",
    note:
      "Best result comes with scanned PDF/image-heavy PDF. Already optimized PDFs may not reduce much.",
    invalidPdf: "Please upload a valid PDF file.",
    uploadSuccess: "PDF uploaded successfully.",
    loadFailed:
      "PDF could not be loaded. It may be password protected.",
    uploadFirst: "Please upload PDF first.",
    alreadyOptimized:
      "PDF is already optimized. Size was not reduced, try lower settings.",
    compressedSuccess: "PDF compressed successfully.",
    compressionFailed:
      "Compression failed. Try another PDF or lower settings.",
    compressFirst: "Please compress PDF first.",
    downloadStarted: "PDF download started.",
    copyNoInfo: "There is no PDF info to copy.",
    copied: "PDF info copied.",
    copyFailed: "Copy failed.",
    notCompressed: "Not compressed",
    smartMode: "Smart Optimize",
    strongMode: "Strong Compress",
    seoTitle:
      "Free PDF Compressor Online - Reduce PDF File Size | Convert Wala",
    seoDescription:
      "Compress PDF files online for free with Convert Wala PDF Compressor. Upload a PDF, choose smart optimize or strong compression, and download a smaller PDF directly from your browser.",
    seoKeywords:
      "PDF compressor, free PDF compressor, compress PDF online, reduce PDF size, PDF size reducer, online PDF compressor, compress scanned PDF, PDF optimizer, Convert Wala PDF tools",
  },

  hi: {
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Compressor",
    subtitle:
      "PDF upload करें, compression mode choose करें और smaller PDF download करें। Strong mode pages को compressed images में convert करके better size reduction देता है।",
    uploadTitle: "PDF Upload करें",
    changePdf: "PDF बदलें",
    uploadText: "Device से कोई भी PDF select करें। File browser के अंदर ही रहती है।",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    originalSize: "Original Size",
    totalPages: "Total Pages",
    fileType: "File Type",
    compressionMode: "Compression Mode",
    smartOptimize: "Smart Optimize",
    smartDesc: "Text/selectable PDF preserve करता है, compression light होती है।",
    strongCompress: "Strong Compress",
    strongDesc:
      "Pages को compressed image PDF में convert करता है, size ज्यादा reduce होता है।",
    quality: "Quality",
    pageScale: "Page Scale",
    strongWarning:
      "Strong mode में PDF text selectable नहीं रहेगा, क्योंकि pages image बन जाते हैं। Scanned/image PDFs के लिए best है।",
    compressing: "Compressing...",
    compressPdf: "PDF Compress करें",
    download: "Download",
    copyInfo: "Copy Info",
    clear: "Clear",
    compressionProgress: "Compression Progress",
    compressionResult: "Compression Result",
    sizeReduced: "Size Reduced",
    compressedSize: "Compressed Size",
    mode: "Mode",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    downloadPdf: "Download PDF",
    emptyResult: "Compressed PDF result यहां दिखाई देगा।",
    note:
      "Best result scanned PDF/image-heavy PDF में मिलेगा। Already optimized PDF का size कभी-कभी ज्यादा reduce नहीं होता।",
    invalidPdf: "कृपया valid PDF file upload करें।",
    uploadSuccess: "PDF successfully upload हो गई।",
    loadFailed:
      "PDF load नहीं हो पाया। Password protected PDF हो सकता है।",
    uploadFirst: "कृपया पहले PDF upload करें।",
    alreadyOptimized:
      "PDF already optimized है। Size reduce नहीं हुआ, settings low करके try करें।",
    compressedSuccess: "PDF successfully compress हो गई।",
    compressionFailed:
      "Compression failed. दूसरा PDF या lower settings try करें।",
    compressFirst: "कृपया पहले PDF compress करें।",
    downloadStarted: "PDF download started.",
    copyNoInfo: "Copy करने के लिए PDF info नहीं है।",
    copied: "PDF info copied.",
    copyFailed: "Copy failed.",
    notCompressed: "Not compressed",
    smartMode: "Smart Optimize",
    strongMode: "Strong Compress",
    seoTitle:
      "Free PDF Compressor Online - PDF File Size कम करें | Convert Wala",
    seoDescription:
      "Convert Wala PDF Compressor से PDF files online free में compress करें। PDF upload करें, smart optimize या strong compression choose करें और smaller PDF download करें।",
    seoKeywords:
      "PDF compressor, free PDF compressor, PDF size kam kare, compress PDF online, PDF size reducer, online PDF compressor, scanned PDF compressor, Convert Wala PDF tools",
  },

  hinglish: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Compressor",
    subtitle:
      "PDF upload karo, compression mode choose karo aur smaller PDF download karo. Strong mode pages ko compressed images me convert karke better size reduction deta hai.",
    uploadTitle: "Upload PDF",
    changePdf: "Change PDF",
    uploadText: "Device se koi bhi PDF select karo. File browser ke andar hi rehti hai.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    originalSize: "Original Size",
    totalPages: "Total Pages",
    fileType: "File Type",
    compressionMode: "Compression Mode",
    smartOptimize: "Smart Optimize",
    smartDesc: "Text/selectable PDF preserve karta hai, compression light hoti hai.",
    strongCompress: "Strong Compress",
    strongDesc:
      "Pages ko compressed image PDF me convert karta hai, size zyada reduce hota hai.",
    quality: "Quality",
    pageScale: "Page Scale",
    strongWarning:
      "Strong mode me PDF text selectable nahi rahega, kyunki pages image ban jaate hain. Scanned/image PDFs ke liye ye best hai.",
    compressing: "Compressing...",
    compressPdf: "Compress PDF",
    download: "Download",
    copyInfo: "Copy Info",
    clear: "Clear",
    compressionProgress: "Compression Progress",
    compressionResult: "Compression Result",
    sizeReduced: "Size Reduced",
    compressedSize: "Compressed Size",
    mode: "Mode",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    downloadPdf: "Download PDF",
    emptyResult: "Compressed PDF result yahan appear hoga.",
    note:
      "Best result scanned PDF/image-heavy PDF me milega. Already optimized PDF ka size kabhi-kabhi zyada reduce nahi hota.",
    invalidPdf: "Please valid PDF file upload karo.",
    uploadSuccess: "PDF successfully upload ho gayi.",
    loadFailed:
      "PDF load nahi ho paya. Password protected PDF ho sakta hai.",
    uploadFirst: "Pehle PDF upload karo.",
    alreadyOptimized:
      "PDF already optimized hai. Size reduce nahi hua, settings low karke try karo.",
    compressedSuccess: "PDF compressed successfully.",
    compressionFailed:
      "Compression failed. Dusra PDF ya lower settings try karo.",
    compressFirst: "Pehle PDF compress karo.",
    downloadStarted: "PDF download started.",
    copyNoInfo: "Copy karne ke liye PDF info nahi hai.",
    copied: "PDF info copied.",
    copyFailed: "Copy failed.",
    notCompressed: "Not compressed",
    smartMode: "Smart Optimize",
    strongMode: "Strong Compress",
    seoTitle:
      "Free PDF Compressor Online - Reduce PDF File Size | Convert Wala",
    seoDescription:
      "Convert Wala PDF Compressor se PDF files online free me compress karo. PDF upload karo, smart optimize ya strong compression choose karo aur smaller PDF download karo.",
    seoKeywords:
      "PDF compressor, free PDF compressor, compress PDF online, reduce PDF size, PDF size reducer, online PDF compressor, compress scanned PDF, Convert Wala PDF tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "pdf") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

export default function PDFCompressor() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const [mode, setMode] = useState("strong");
  const [quality, setQuality] = useState(0.72);
  const [scale, setScale] = useState(0.95);

  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/pdf-compressor";

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

  const reduction = useMemo(() => {
    if (!file?.size || !resultBlob?.size) return null;
    return Math.max(0, 100 - (resultBlob.size / file.size) * 100).toFixed(1);
  }, [file, resultBlob]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2800);
  };

  const clearResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl("");
    setProgress(0);
  };

  const resetAll = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setFileInfo(null);
    setResultBlob(null);
    setResultUrl("");
    setProgress(0);
    setProcessing(false);
    setMode("strong");
    setQuality(0.72);
    setScale(0.95);
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
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      setFile(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        pages: pdfDoc.getPageCount(),
        type: selectedFile.type,
      });

      showToast("success", t.uploadSuccess);
    } catch {
      showToast("error", t.loadFailed);
    }

    e.target.value = "";
  };

  const smartCompress = async () => {
    const buffer = await file.arrayBuffer();

    const sourcePdf = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const outputPdf = await PDFDocument.create();

    const pages = await outputPdf.copyPages(
      sourcePdf,
      sourcePdf.getPageIndices()
    );

    pages.forEach((page) => outputPdf.addPage(page));

    outputPdf.setTitle("");
    outputPdf.setAuthor("");
    outputPdf.setSubject("");
    outputPdf.setKeywords([]);
    outputPdf.setProducer("Convert Wala PDF Compressor");
    outputPdf.setCreator("Convert Wala");

    const compressedBytes = await outputPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    return new Blob([compressedBytes], { type: "application/pdf" });
  };

  const strongCompress = async () => {
    const buffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: true,
      isEvalSupported: false,
      disableFontFace: false,
    });

    const pdf = await loadingTask.promise;

    let outputPdf = null;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const viewport = page.getViewport({ scale: Number(scale) });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: false });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      const imgData = canvas.toDataURL("image/jpeg", Number(quality));

      const pageWidth = canvas.width;
      const pageHeight = canvas.height;
      const orientation = pageWidth > pageHeight ? "landscape" : "portrait";

      if (!outputPdf) {
        outputPdf = new jsPDF({
          orientation,
          unit: "pt",
          format: [pageWidth, pageHeight],
          compress: true,
        });
      } else {
        outputPdf.addPage([pageWidth, pageHeight], orientation);
      }

      outputPdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        "FAST"
      );

      canvas.width = 0;
      canvas.height = 0;

      setProgress(Math.round((pageNumber / pdf.numPages) * 100));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return outputPdf.output("blob");
  };

  const compressPDF = async () => {
    if (!file) {
      showToast("error", t.uploadFirst);
      return;
    }

    try {
      clearResult();
      setProcessing(true);
      setProgress(0);

      let blob;

      if (mode === "smart") {
        blob = await smartCompress();
        setProgress(100);
      } else {
        blob = await strongCompress();
      }

      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setProcessing(false);
      setProgress(100);

      if (blob.size >= file.size) {
        showToast("error", t.alreadyOptimized);
      } else {
        showToast("success", t.compressedSuccess);
      }
    } catch {
      setProcessing(false);
      showToast("error", t.compressionFailed);
    }
  };

  const downloadPDF = () => {
    if (!resultBlob || !resultUrl || !file) {
      showToast("error", t.compressFirst);
      return;
    }

    const name = cleanFileName(file.name);
    const outputName = `Convert Wala_${name}_compressed.pdf`;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  const copyInfo = async () => {
    if (!fileInfo) {
      showToast("error", t.copyNoInfo);
      return;
    }

    const text = `PDF Name: ${fileInfo.name}
Original Size: ${formatBytes(fileInfo.size)}
Pages: ${fileInfo.pages}
Compressed Size: ${resultBlob ? formatBytes(resultBlob.size) : t.notCompressed}
Reduction: ${reduction ? `${reduction}%` : t.notCompressed}`;

    try {
      await navigator.clipboard.writeText(text);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  return (
    <main className={`pc-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala PDF Compressor",
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
              "Compress PDF online",
              "Reduce PDF file size",
              "Smart PDF optimization",
              "Strong PDF compression",
              "Browser-based PDF processing",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .pc-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .pc-page * {
          box-sizing: border-box;
        }

        .pc-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .pc-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .pc-page.dark .pc-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .pc-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .pc-page.dark .pc-eyebrow {
          color: #93c5fd;
        }

        .pc-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .pc-page.dark .pc-hero h1 {
          color: #f8fafc;
        }

        .pc-hero p {
          max-width: 880px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .pc-page.dark .pc-hero p,
        .pc-page.dark .pc-upload p,
        .pc-page.dark .pc-note,
        .pc-page.dark .pc-info-grid span,
        .pc-page.dark .pc-result-grid span,
        .pc-page.dark .pc-mode-btn span,
        .pc-page.dark .pc-preview {
          color: #cbd5e1;
        }

        .pc-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .pc-left,
        .pc-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .pc-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .pc-page.dark .pc-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .pc-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .pc-page.dark .pc-card h3,
        .pc-page.dark .pc-upload strong,
        .pc-page.dark .pc-info-grid strong,
        .pc-page.dark .pc-result-grid strong,
        .pc-page.dark .pc-field,
        .pc-page.dark .pc-progress-head {
          color: #f8fafc;
        }

        .pc-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .pc-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
        }

        .pc-upload input {
          display: none;
        }

        .pc-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .pc-page.dark .pc-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .pc-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .pc-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .pc-upload p,
        .pc-note {
          color: #64748b;
          line-height: 1.6;
        }

        .pc-mode-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .pc-mode-btn {
          min-height: 78px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 18px;
          padding: 14px;
          font-weight: 900;
          cursor: pointer;
          text-align: left;
        }

        .pc-page.dark .pc-mode-btn {
          background: #020617;
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .pc-mode-btn span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          margin-top: 5px;
          line-height: 1.45;
        }

        .pc-mode-btn.active {
          background: #eff6ff;
          border-color: #2563eb;
          color: #2563eb;
        }

        .pc-page.dark .pc-mode-btn.active {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.32);
        }

        .pc-form-grid,
        .pc-info-grid,
        .pc-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .pc-info-grid div,
        .pc-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .pc-page.dark .pc-info-grid div,
        .pc-page.dark .pc-result-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .pc-info-grid span,
        .pc-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .pc-info-grid strong,
        .pc-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .pc-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .pc-field select,
        .pc-field input {
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

        .pc-page.dark .pc-field select,
        .pc-page.dark .pc-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .pc-page.dark .pc-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .pc-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .pc-primary,
        .pc-dark,
        .pc-light,
        .pc-danger {
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

        .pc-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .pc-dark {
          background: #111827;
          color: #ffffff;
        }

        .pc-page.dark .pc-dark {
          background: #38bdf8;
          color: #020617;
        }

        .pc-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .pc-page.dark .pc-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .pc-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .pc-primary:disabled,
        .pc-dark:disabled,
        .pc-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .pc-primary:hover,
        .pc-dark:hover,
        .pc-light:hover,
        .pc-danger:hover {
          transform: translateY(-2px);
        }

        .pc-progress-wrap {
          margin-top: 20px;
        }

        .pc-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .pc-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .pc-page.dark .pc-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .pc-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
          transition: width 0.22s ease;
        }

        .pc-page.dark .pc-progress span {
          background: #38bdf8;
        }

        .pc-preview {
          min-height: 420px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 30px;
          color: #94a3b8;
        }

        .pc-page.dark .pc-preview {
          background: #020617;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .pc-preview svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .pc-big-result {
          text-align: center;
          padding: 28px;
          border-radius: 24px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          margin-bottom: 16px;
        }

        .pc-big-result strong {
          display: block;
          font-size: clamp(2rem, 5vw, 4rem);
          line-height: 1;
          margin-bottom: 8px;
        }

        .pc-warning {
          padding: 16px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.7;
          font-weight: 800;
          margin-top: 16px;
        }

        .pc-toast {
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

        .pc-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .pc-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .pc-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .pc-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .pc-hero {
            padding: 56px 5% 34px;
          }

          .pc-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .pc-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .pc-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .pc-card {
            padding: 20px;
            border-radius: 22px;
          }

          .pc-mode-grid,
          .pc-form-grid,
          .pc-info-grid,
          .pc-result-grid {
            grid-template-columns: 1fr;
          }

          .pc-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .pc-primary,
          .pc-dark,
          .pc-light,
          .pc-danger {
            width: 100%;
          }

          .pc-preview {
            min-height: 300px;
          }

          .pc-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .pc-hero {
            padding: 44px 4.5% 28px;
          }

          .pc-hero h1 {
            font-size: 2rem;
          }

          .pc-shell {
            padding: 24px 4.5% 48px;
          }

          .pc-card {
            padding: 16px;
            border-radius: 18px;
          }
        }
      `}</style>

      {toast && (
        <div className={`pc-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="pc-hero">
        <p className="pc-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="pc-shell">
        <div className="pc-left">
          <label className="pc-card pc-upload">
            <input type="file" accept="application/pdf" onChange={handleUpload} />
            <span className="pc-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changePdf : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {fileInfo && (
            <div className="pc-card">
              <h3>{t.pdfDetails}</h3>

              <div className="pc-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{fileInfo.name}</strong>
                </div>

                <div>
                  <span>{t.originalSize}</span>
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

          <div className="pc-card">
            <h3>{t.compressionMode}</h3>

            <div className="pc-mode-grid">
              <button
                type="button"
                className={`pc-mode-btn ${mode === "smart" ? "active" : ""}`}
                onClick={() => {
                  setMode("smart");
                  clearResult();
                }}
              >
                {t.smartOptimize}
                <span>{t.smartDesc}</span>
              </button>

              <button
                type="button"
                className={`pc-mode-btn ${mode === "strong" ? "active" : ""}`}
                onClick={() => {
                  setMode("strong");
                  clearResult();
                }}
              >
                {t.strongCompress}
                <span>{t.strongDesc}</span>
              </button>
            </div>

            {mode === "strong" && (
              <>
                <div className="pc-form-grid" style={{ marginTop: 20 }}>
                  <label className="pc-field">
                    {t.quality}
                    <select
                      value={quality}
                      onChange={(e) => {
                        setQuality(Number(e.target.value));
                        clearResult();
                      }}
                    >
                      <option value="0.45">Very Small - Low Quality</option>
                      <option value="0.6">Small - Good</option>
                      <option value="0.72">Balanced - Recommended</option>
                      <option value="0.85">High Quality</option>
                      <option value="0.95">Maximum Quality</option>
                    </select>
                  </label>

                  <label className="pc-field">
                    {t.pageScale}
                    <select
                      value={scale}
                      onChange={(e) => {
                        setScale(Number(e.target.value));
                        clearResult();
                      }}
                    >
                      <option value="0.65">Small Size</option>
                      <option value="0.8">Medium Size</option>
                      <option value="0.95">Recommended</option>
                      <option value="1.15">High Quality</option>
                      <option value="1.35">Best Quality</option>
                    </select>
                  </label>
                </div>

                <div className="pc-warning">{t.strongWarning}</div>
              </>
            )}

            <div className="pc-actions">
              <button
                type="button"
                className="pc-primary"
                onClick={compressPDF}
                disabled={!file || processing}
              >
                <RefreshCcw />
                {processing ? t.compressing : t.compressPdf}
              </button>

              <button
                type="button"
                className="pc-dark"
                onClick={downloadPDF}
                disabled={!resultBlob}
              >
                <Download />
                {t.download}
              </button>
            </div>

            <div className="pc-actions">
              <button type="button" className="pc-light" onClick={copyInfo}>
                <Copy />
                {t.copyInfo}
              </button>

              <button type="button" className="pc-danger" onClick={resetAll}>
                <Trash2 />
                {t.clear}
              </button>
            </div>

            {(processing || progress > 0) && (
              <div className="pc-progress-wrap">
                <div className="pc-progress-head">
                  <span>{t.compressionProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="pc-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pc-right">
          <div className="pc-card">
            <h3>{t.compressionResult}</h3>

            {resultBlob ? (
              <>
                <div className="pc-big-result">
                  <strong>{reduction}%</strong>
                  <span>{t.sizeReduced}</span>
                </div>

                <div className="pc-result-grid">
                  <div>
                    <span>{t.originalSize}</span>
                    <strong>{formatBytes(file?.size)}</strong>
                  </div>

                  <div>
                    <span>{t.compressedSize}</span>
                    <strong>{formatBytes(resultBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.mode}</span>
                    <strong>
                      {mode === "strong" ? t.strongMode : t.smartMode}
                    </strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "pdf")}_compressed.pdf
                    </strong>
                  </div>
                </div>

                <div className="pc-actions">
                  <a
                    className="pc-light"
                    href={resultUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText />
                    {t.previewPdf}
                  </a>

                  <button type="button" className="pc-primary" onClick={downloadPDF}>
                    <Download />
                    {t.downloadPdf}
                  </button>
                </div>
              </>
            ) : (
              <div className="pc-preview">
                <div>
                  <FileText />
                  <p>{t.emptyResult}</p>
                </div>
              </div>
            )}

            <p className="pc-note">{t.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}