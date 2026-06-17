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
} from "lucide-react";
import "../styles/PDFPageDelete.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Page Delete Online Free | Remove PDF Pages",
    seoDesc:
      "Delete selected pages from PDF online for free and download a new high-quality PDF without quality loss.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Delete",
    subtitle:
      "Upload a PDF, enter pages to delete and download a new PDF without quality loss.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to delete pages.",
    rangeLabel: "Pages to Delete",
    rangeHint: "Example: 2, 5, 8-10",
    delete: "Delete Pages",
    deleting: "Deleting...",
    download: "Download New PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF uploaded successfully.",
    rangeError: "Please enter a valid page range.",
    deleteSuccess: "Selected PDF pages deleted successfully.",
    deleteFirst: "Please delete PDF pages first.",
  },
  hi: {
    seoTitle: "PDF Page Delete Online Free | PDF Pages Remove करें",
    seoDesc:
      "PDF से selected pages free online delete करें और बिना quality loss के new PDF download करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Page Delete",
    subtitle:
      "PDF upload करें, delete करने वाले pages डालें और बिना quality loss के new PDF download करें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Pages delete करने के लिए एक PDF file select करें।",
    rangeLabel: "Delete करने वाले Pages",
    rangeHint: "Example: 2, 5, 8-10",
    delete: "Pages Delete करें",
    deleting: "Deleting...",
    download: "New PDF Download करें",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF successfully upload हो गई।",
    rangeError: "कृपया valid page range डालें।",
    deleteSuccess: "Selected PDF pages successfully delete हो गए।",
    deleteFirst: "कृपया पहले PDF pages delete करें।",
  },
  hinglish: {
    seoTitle: "PDF Page Delete Online Free | Remove PDF Pages",
    seoDesc:
      "PDF se selected pages free online delete karo aur bina quality loss ke new PDF download karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Delete",
    subtitle:
      "PDF upload karo, delete karne wale pages enter karo aur bina quality loss ke new PDF download karo.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Pages delete karne ke liye one PDF file select karo.",
    rangeLabel: "Pages to Delete",
    rangeHint: "Example: 2, 5, 8-10",
    delete: "Delete Pages",
    deleting: "Deleting...",
    download: "Download New PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF successfully upload ho gayi.",
    rangeError: "Please valid page range enter karo.",
    deleteSuccess: "Selected PDF pages successfully delete ho gaye.",
    deleteFirst: "Please pehle PDF pages delete karo.",
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

      if (!start || !end || start > end) throw new Error("Invalid range");

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

  return Array.from(pages).sort((a, b) => b - a);
};

export default function PDFPageDelete() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputUrl, setOutputUrl] = useState("");
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

  const clearOutput = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputBlob(null);
    setOutputUrl("");
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
      clearOutput();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const pageCount = pdf.getPageCount();

      setPdfFile(file);
      setTotalPages(pageCount);
      setPageRange("");
      showToast("success", t.uploaded);
    } catch {
      showToast(
        "error",
        "PDF read failed. Password-protected ya damaged PDF ho sakti hai."
      );
    }

    e.target.value = "";
  };

  const deletePages = async () => {
    if (!pdfFile || !totalPages) {
      showToast("error", t.uploadError);
      return;
    }

    setLoading(true);
    clearOutput();

    try {
      const pagesToDelete = parsePageRange(pageRange, totalPages);

      if (!pagesToDelete.length) {
        showToast("error", t.rangeError);
        return;
      }

      if (pagesToDelete.length >= totalPages) {
        showToast("error", "Aap saare pages delete nahi kar sakte.");
        return;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      pagesToDelete.forEach((pageIndex) => {
        sourcePdf.removePage(pageIndex);
      });

      const pdfBytes = await sourcePdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      showToast("success", t.deleteSuccess);
    } catch {
      showToast("error", t.rangeError);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!outputUrl || !outputBlob) {
      showToast("error", t.deleteFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "Convert Wala_pages_deleted.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearOutput();
    setPdfFile(null);
    setTotalPages(0);
    setPageRange("");
  };

  const remainingPages = totalPages
    ? totalPages - (pageRange ? (() => {
        try {
          return parsePageRange(pageRange, totalPages).length;
        } catch {
          return 0;
        }
      })() : 0)
    : 0;

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf page delete, remove pdf pages, delete pages from pdf, pdf editor, pdf page remover"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/pdf-page-delete" />
      </Helmet>

      <main className={`pdf-delete-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-delete-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-delete-hero">
          <div className="pdf-delete-badge">
            <Trash2 />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-delete-info">
          <FileText />
          <div>
            <h3>{t.title}</h3>
            <p>
              Pages direct remove hote hain, image conversion nahi hoti. Isliye
              PDF text, image, vector aur print quality same rehti hai.
            </p>
          </div>
        </section>

        <section className="pdf-delete-shell">
          <div className="pdf-delete-left">
            <label className="pdf-delete-upload">
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

            <div className="pdf-delete-actions">
              <div className="pdf-delete-control">
                <label>{t.rangeLabel}</label>
                <input
                  value={pageRange}
                  onChange={(e) => {
                    setPageRange(e.target.value);
                    clearOutput();
                  }}
                  placeholder={t.rangeHint}
                  disabled={!pdfFile}
                />
                <small>{t.rangeHint}</small>
              </div>

              <button onClick={deletePages} disabled={loading || !pdfFile}>
                <Trash2 />
                {loading ? t.deleting : t.delete}
              </button>

              <button onClick={downloadPDF} disabled={!outputBlob}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!pdfFile} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="pdf-delete-card">
            <div className="pdf-delete-card-head">
              <h3>{t.selectedFile}</h3>
              <span>{totalPages ? `${totalPages} Pages` : "0 Pages"}</span>
            </div>

            {pdfFile ? (
              <div className="pdf-delete-file">
                <div className="pdf-delete-file-icon">
                  <FileText />
                </div>

                <div>
                  <strong>{pdfFile.name}</strong>
                  <small>{formatBytes(pdfFile.size)}</small>
                  <small>
                    {t.totalPages}: {totalPages}
                  </small>
                  <small>Remaining Pages: {remainingPages}</small>
                </div>
              </div>
            ) : (
              <div className="pdf-delete-empty">
                <FileText />
                <p>{t.uploadDesc}</p>
              </div>
            )}

            {outputBlob && (
              <div className="pdf-delete-result">
                <CheckCircle />
                <strong>New PDF Ready</strong>
                <span>{formatBytes(outputBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}