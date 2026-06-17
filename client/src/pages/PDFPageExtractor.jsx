import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import {
  UploadCloud,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Scissors,
} from "lucide-react";
import "../styles/PDFPageExtractor.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Page Extractor Online Free | Extract PDF Pages",
    seoDesc:
      "Extract selected pages from PDF online for free and download them as a new high-quality PDF.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Extractor",
    subtitle:
      "Upload a PDF, enter page numbers or ranges and extract selected pages into a new PDF without quality loss.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to extract pages.",
    rangeLabel: "Pages to Extract",
    rangeHint: "Example: 1-3, 5, 8-10",
    extract: "Extract Pages",
    extracting: "Extracting...",
    download: "Download Extracted PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF uploaded successfully.",
    rangeError: "Please enter a valid page range.",
    extractSuccess: "PDF pages extracted successfully.",
    extractFirst: "Please extract PDF pages first.",
  },
  hi: {
    seoTitle: "PDF Page Extractor Online Free | PDF Pages Extract करें",
    seoDesc:
      "PDF से selected pages free online extract करें और new high-quality PDF download करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Page Extractor",
    subtitle:
      "PDF upload करें, page numbers या ranges डालें और selected pages को बिना quality loss के new PDF में extract करें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Pages extract करने के लिए एक PDF file select करें।",
    rangeLabel: "Extract करने वाले Pages",
    rangeHint: "Example: 1-3, 5, 8-10",
    extract: "Pages Extract करें",
    extracting: "Extracting...",
    download: "Extracted PDF Download करें",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF successfully upload हो गई।",
    rangeError: "कृपया valid page range डालें।",
    extractSuccess: "PDF pages successfully extract हो गए।",
    extractFirst: "कृपया पहले PDF pages extract करें।",
  },
  hinglish: {
    seoTitle: "PDF Page Extractor Online Free | Extract PDF Pages",
    seoDesc:
      "PDF se selected pages free online extract karo aur new high-quality PDF download karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Extractor",
    subtitle:
      "PDF upload karo, page numbers ya ranges enter karo aur selected pages ko bina quality loss ke new PDF me extract karo.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Pages extract karne ke liye one PDF file select karo.",
    rangeLabel: "Pages to Extract",
    rangeHint: "Example: 1-3, 5, 8-10",
    extract: "Extract Pages",
    extracting: "Extracting...",
    download: "Download Extracted PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF successfully upload ho gayi.",
    rangeError: "Please valid page range enter karo.",
    extractSuccess: "PDF pages successfully extract ho gaye.",
    extractFirst: "Please pehle PDF pages extract karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const parsePageRange = (range, totalPages) => {
  const pages = new Set();

  range.split(",").forEach((part) => {
    const value = part.trim();
    if (!value) return;

    if (value.includes("-")) {
      const [start, end] = value.split("-").map((num) => Number(num.trim()));

      if (!start || !end || start > end) {
        throw new Error("Invalid range");
      }

      for (let i = start; i <= end; i++) {
        if (i < 1 || i > totalPages) throw new Error("Invalid range");
        pages.add(i - 1);
      }
    } else {
      const page = Number(value);

      if (!page || page < 1 || page > totalPages) {
        throw new Error("Invalid range");
      }

      pages.add(page - 1);
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
};

export default function PDFPageExtractor() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [extractedBlob, setExtractedBlob] = useState(null);
  const [extractedUrl, setExtractedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

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

  const clearExtracted = () => {
    if (extractedUrl) URL.revokeObjectURL(extractedUrl);
    setExtractedBlob(null);
    setExtractedUrl("");
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (
      !file ||
      !(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
    ) {
      showToast("error", t.uploadError);
      return;
    }

    try {
      clearExtracted();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pageCount = pdf.getPageCount();

      setPdfFile(file);
      setTotalPages(pageCount);
      setPageRange(pageCount > 1 ? `1-${pageCount}` : "1");
      showToast("success", t.uploaded);
    } catch {
      showToast("error", "PDF read failed. Password-protected ya damaged PDF ho sakti hai.");
    }

    e.target.value = "";
  };

  const extractPages = async () => {
    if (!pdfFile || !totalPages) {
      showToast("error", t.uploadError);
      return;
    }

    setLoading(true);
    clearExtracted();

    try {
      const selectedPages = parsePageRange(pageRange, totalPages);

      if (!selectedPages.length) {
        showToast("error", t.rangeError);
        return;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, selectedPages);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setExtractedBlob(blob);
      setExtractedUrl(url);
      showToast("success", t.extractSuccess);
    } catch {
      showToast("error", t.rangeError);
    } finally {
      setLoading(false);
    }
  };

  const downloadExtracted = () => {
    if (!extractedUrl || !extractedBlob) {
      showToast("error", t.extractFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = extractedUrl;
    link.download = "Convert Wala_extracted_pages.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearExtracted();
    setPdfFile(null);
    setTotalPages(0);
    setPageRange("");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf page extractor, extract pdf pages, pdf extractor, selected pdf pages, pdf page tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/pdf-page-extractor" />
      </Helmet>

      <main className={`pdf-extract-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-extract-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-extract-hero">
          <div className="pdf-extract-badge">
            <Scissors />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-extract-info">
          <FileText />
          <div>
            <h3>{t.title}</h3>
            <p>
              Selected pages direct copy hote hain, image me convert nahi hote.
              Isliye PDF quality same rehti hai.
            </p>
          </div>
        </section>

        <section className="pdf-extract-shell">
          <div className="pdf-extract-left">
            <label className="pdf-extract-upload">
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleUpload}
              />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            <div className="pdf-extract-actions">
              <div className="pdf-extract-control">
                <label>{t.rangeLabel}</label>
                <input
                  value={pageRange}
                  onChange={(e) => {
                    setPageRange(e.target.value);
                    clearExtracted();
                  }}
                  placeholder={t.rangeHint}
                  disabled={!pdfFile}
                />
                <small>{t.rangeHint}</small>
              </div>

              <button onClick={extractPages} disabled={loading || !pdfFile}>
                <Scissors />
                {loading ? t.extracting : t.extract}
              </button>

              <button onClick={downloadExtracted} disabled={!extractedBlob}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!pdfFile} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="pdf-extract-card">
            <div className="pdf-extract-card-head">
              <h3>{t.selectedFile}</h3>
              <span>{totalPages ? `${totalPages} Pages` : "0 Pages"}</span>
            </div>

            {pdfFile ? (
              <div className="pdf-extract-file">
                <div className="pdf-extract-file-icon">
                  <FileText />
                </div>

                <div>
                  <strong>{pdfFile.name}</strong>
                  <small>{formatBytes(pdfFile.size)}</small>
                  <small>
                    {t.totalPages}: {totalPages}
                  </small>
                </div>
              </div>
            ) : (
              <div className="pdf-extract-empty">
                <FileText />
                <p>{t.uploadDesc}</p>
              </div>
            )}

            {extractedBlob && (
              <div className="pdf-extract-result">
                <CheckCircle />
                <strong>Extracted PDF Ready</strong>
                <span>{formatBytes(extractedBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}