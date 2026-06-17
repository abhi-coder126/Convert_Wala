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
import "../styles/PDFSplitter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Splitter Online Free | Split PDF Pages",
    seoDesc: "Split PDF pages online for free and download selected pages as a new high-quality PDF.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Splitter",
    subtitle: "Upload a PDF, enter page range and download selected pages as a new PDF without quality loss.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to split.",
    rangeLabel: "Page Range",
    rangeHint: "Example: 1-3, 5, 8-10",
    split: "Split PDF",
    splitting: "Splitting...",
    download: "Download Split PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF uploaded successfully.",
    rangeError: "Please enter a valid page range.",
    splitSuccess: "PDF split successfully.",
    splitFirst: "Please split PDF first.",
  },
  hi: {
    seoTitle: "PDF Splitter Online Free | PDF Pages Split करें",
    seoDesc: "PDF pages को free online split करें और selected pages को high-quality PDF में download करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Splitter",
    subtitle: "PDF upload करें, page range डालें और selected pages को बिना quality loss के new PDF में download करें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Split करने के लिए एक PDF file select करें।",
    rangeLabel: "Page Range",
    rangeHint: "Example: 1-3, 5, 8-10",
    split: "PDF Split करें",
    splitting: "Splitting...",
    download: "Split PDF Download करें",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF successfully upload हो गई।",
    rangeError: "कृपया valid page range डालें।",
    splitSuccess: "PDF successfully split हो गई।",
    splitFirst: "कृपया पहले PDF split करें।",
  },
  hinglish: {
    seoTitle: "PDF Splitter Online Free | Split PDF Pages",
    seoDesc: "PDF pages ko free online split karo aur selected pages ko high-quality PDF me download karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Splitter",
    subtitle: "PDF upload karo, page range enter karo aur selected pages ko bina quality loss ke new PDF me download karo.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Split karne ke liye one PDF file select karo.",
    rangeLabel: "Page Range",
    rangeHint: "Example: 1-3, 5, 8-10",
    split: "Split PDF",
    splitting: "Splitting...",
    download: "Download Split PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF successfully upload ho gayi.",
    rangeError: "Please valid page range enter karo.",
    splitSuccess: "PDF successfully split ho gayi.",
    splitFirst: "Please pehle PDF split karo.",
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

export default function PDFSplitter() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [splitBlob, setSplitBlob] = useState(null);
  const [splitUrl, setSplitUrl] = useState("");
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

  const clearSplit = () => {
    if (splitUrl) URL.revokeObjectURL(splitUrl);
    setSplitBlob(null);
    setSplitUrl("");
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      showToast("error", t.uploadError);
      return;
    }

    try {
      clearSplit();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
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

  const splitPDF = async () => {
    if (!pdfFile || !totalPages) {
      showToast("error", t.uploadError);
      return;
    }

    setLoading(true);
    clearSplit();

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
        useObjectStreams: true,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setSplitBlob(blob);
      setSplitUrl(url);
      showToast("success", t.splitSuccess);
    } catch {
      showToast("error", t.rangeError);
    } finally {
      setLoading(false);
    }
  };

  const downloadSplit = () => {
    if (!splitUrl || !splitBlob) {
      showToast("error", t.splitFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = splitUrl;
    link.download = "Convert Wala_split_pdf.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearSplit();
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
          content="pdf splitter, split pdf, extract pdf pages, pdf page extractor, pdf tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/pdf-splitter" />
      </Helmet>

      <main className={`pdf-split-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-split-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-split-hero">
          <div className="pdf-split-badge">
            <Scissors />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-split-shell">
          <div className="pdf-split-left">
            <label className="pdf-split-upload">
              <input type="file" accept="application/pdf,.pdf" onChange={handleUpload} />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            <div className="pdf-split-actions">
              <div className="pdf-split-control">
                <label>{t.rangeLabel}</label>
                <input
                  value={pageRange}
                  onChange={(e) => {
                    setPageRange(e.target.value);
                    clearSplit();
                  }}
                  placeholder={t.rangeHint}
                  disabled={!pdfFile}
                />
                <small>{t.rangeHint}</small>
              </div>

              <button onClick={splitPDF} disabled={loading || !pdfFile}>
                <Scissors />
                {loading ? t.splitting : t.split}
              </button>

              <button onClick={downloadSplit} disabled={!splitBlob}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!pdfFile} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="pdf-split-card">
            <div className="pdf-split-card-head">
              <h3>{t.selectedFile}</h3>
              <span>{totalPages ? `${totalPages} Pages` : "0 Pages"}</span>
            </div>

            {pdfFile ? (
              <div className="pdf-split-file">
                <div className="pdf-split-file-icon">
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
              <div className="pdf-split-empty">
                <FileText />
                <p>{t.uploadDesc}</p>
              </div>
            )}

            {splitBlob && (
              <div className="pdf-split-result">
                <CheckCircle />
                <strong>Split PDF Ready</strong>
                <span>{formatBytes(splitBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}