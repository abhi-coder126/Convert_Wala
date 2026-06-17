import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import {
  UploadCloud,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Shuffle,
  RotateCcw,
} from "lucide-react";
import "../styles/PDFPageReorder.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Page Reorder Online Free | Rearrange PDF Pages",
    seoDesc:
      "Reorder PDF pages online for free. Upload PDF, rearrange pages and download a new high-quality PDF without quality loss.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Reorder",
    subtitle:
      "Upload a PDF, rearrange page order and download a new PDF without quality loss.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to reorder pages.",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    pageOrder: "Page Order",
    customOrder: "Custom Order",
    customHint: "Example: 3,1,2,5,4",
    applyOrder: "Apply Custom Order",
    generate: "Generate Reordered PDF",
    generating: "Generating...",
    download: "Download New PDF",
    reset: "Reset Order",
    clear: "Clear",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF uploaded successfully.",
    orderError: "Please enter a valid page order.",
    reorderSuccess: "PDF pages reordered successfully.",
    generateFirst: "Please generate reordered PDF first.",
    empty: "Upload PDF to start reordering pages.",
  },
  hi: {
    seoTitle: "PDF Page Reorder Online Free | PDF Pages Rearrange करें",
    seoDesc:
      "PDF pages को free online reorder करें। PDF upload करें, pages rearrange करें और बिना quality loss के new PDF download करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Page Reorder",
    subtitle:
      "PDF upload करें, page order rearrange करें और बिना quality loss के new PDF download करें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Pages reorder करने के लिए एक PDF file select करें।",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    pageOrder: "Page Order",
    customOrder: "Custom Order",
    customHint: "Example: 3,1,2,5,4",
    applyOrder: "Custom Order Apply करें",
    generate: "Reordered PDF बनाएं",
    generating: "Generating...",
    download: "New PDF Download करें",
    reset: "Reset Order",
    clear: "Clear",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF successfully upload हो गई।",
    orderError: "कृपया valid page order डालें।",
    reorderSuccess: "PDF pages successfully reorder हो गए।",
    generateFirst: "कृपया पहले reordered PDF generate करें।",
    empty: "Pages reorder करने के लिए PDF upload करें।",
  },
  hinglish: {
    seoTitle: "PDF Page Reorder Online Free | Rearrange PDF Pages",
    seoDesc:
      "PDF pages ko free online reorder karo. PDF upload karo, pages rearrange karo aur bina quality loss ke new PDF download karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Reorder",
    subtitle:
      "PDF upload karo, page order rearrange karo aur bina quality loss ke new PDF download karo.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Pages reorder karne ke liye one PDF file select karo.",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    pageOrder: "Page Order",
    customOrder: "Custom Order",
    customHint: "Example: 3,1,2,5,4",
    applyOrder: "Apply Custom Order",
    generate: "Generate Reordered PDF",
    generating: "Generating...",
    download: "Download New PDF",
    reset: "Reset Order",
    clear: "Clear",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF successfully upload ho gayi.",
    orderError: "Please valid page order enter karo.",
    reorderSuccess: "PDF pages successfully reorder ho gaye.",
    generateFirst: "Please pehle reordered PDF generate karo.",
    empty: "Pages reorder karne ke liye PDF upload karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const createInitialOrder = (totalPages) =>
  Array.from({ length: totalPages }, (_, index) => index + 1);

const parseCustomOrder = (value, totalPages) => {
  const order = value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter(Boolean);

  if (order.length !== totalPages) {
    throw new Error("Invalid order");
  }

  const unique = new Set(order);

  if (unique.size !== totalPages) {
    throw new Error("Invalid order");
  }

  for (const page of order) {
    if (page < 1 || page > totalPages) {
      throw new Error("Invalid order");
    }
  }

  return order;
};

export default function PDFPageReorder() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageOrder, setPageOrder] = useState([]);
  const [customOrder, setCustomOrder] = useState("");
  const [outputBlob, setOutputBlob] = useState(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const orderText = useMemo(() => pageOrder.join(", "), [pageOrder]);

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
      const initialOrder = createInitialOrder(pageCount);

      setPdfFile(file);
      setTotalPages(pageCount);
      setPageOrder(initialOrder);
      setCustomOrder(initialOrder.join(","));
      showToast("success", t.uploaded);
    } catch {
      showToast(
        "error",
        "PDF read failed. Password-protected ya damaged PDF ho sakti hai."
      );
    }

    e.target.value = "";
  };

  const movePage = (index, direction) => {
    clearOutput();

    setPageOrder((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= next.length) return prev;

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      setCustomOrder(next.join(","));

      return next;
    });
  };

  const applyCustomOrder = () => {
    if (!pdfFile || !totalPages) {
      showToast("error", t.uploadError);
      return;
    }

    try {
      const nextOrder = parseCustomOrder(customOrder, totalPages);
      clearOutput();
      setPageOrder(nextOrder);
      setCustomOrder(nextOrder.join(","));
    } catch {
      showToast("error", t.orderError);
    }
  };

  const resetOrder = () => {
    if (!totalPages) return;

    clearOutput();

    const initialOrder = createInitialOrder(totalPages);
    setPageOrder(initialOrder);
    setCustomOrder(initialOrder.join(","));
  };

  const generateReorderedPDF = async () => {
    if (!pdfFile || !totalPages || !pageOrder.length) {
      showToast("error", t.uploadError);
      return;
    }

    setLoading(true);
    clearOutput();

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const newPdf = await PDFDocument.create();
      const pageIndexes = pageOrder.map((pageNumber) => pageNumber - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndexes);

      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      showToast("success", t.reorderSuccess);
    } catch {
      showToast("error", t.orderError);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!outputUrl || !outputBlob) {
      showToast("error", t.generateFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "Convert Wala_reordered_pages.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearOutput();
    setPdfFile(null);
    setTotalPages(0);
    setPageOrder([]);
    setCustomOrder("");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf page reorder, rearrange pdf pages, reorder pdf, organize pdf pages, pdf editor, pdf tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/pdf-page-reorder" />
      </Helmet>

      <main className={`pdf-reorder-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-reorder-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-reorder-hero">
          <div className="pdf-reorder-badge">
            <Shuffle />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-reorder-info">
          <FileText />
          <div>
            <h3>{t.title}</h3>
            <p>
              Pages direct copy hote hain, image conversion nahi hoti. Isliye PDF
              text, image, vector aur print quality same rehti hai.
            </p>
          </div>
        </section>

        <section className="pdf-reorder-shell">
          <div className="pdf-reorder-left">
            <label className="pdf-reorder-upload">
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

            <div className="pdf-reorder-actions">
              <div className="pdf-reorder-control">
                <label>{t.customOrder}</label>
                <input
                  value={customOrder}
                  onChange={(e) => {
                    setCustomOrder(e.target.value);
                    clearOutput();
                  }}
                  placeholder={t.customHint}
                  disabled={!pdfFile}
                />
                <small>{t.customHint}</small>
              </div>

              <button onClick={applyCustomOrder} disabled={!pdfFile}>
                <Shuffle />
                {t.applyOrder}
              </button>

              <button onClick={generateReorderedPDF} disabled={loading || !pdfFile}>
                <FileText />
                {loading ? t.generating : t.generate}
              </button>

              <button onClick={downloadPDF} disabled={!outputBlob}>
                <Download />
                {t.download}
              </button>

              <button onClick={resetOrder} disabled={!pdfFile}>
                <RotateCcw />
                {t.reset}
              </button>

              <button onClick={clearTool} disabled={!pdfFile} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="pdf-reorder-card">
            <div className="pdf-reorder-card-head">
              <h3>{t.selectedFile}</h3>
              <span>{totalPages ? `${totalPages} Pages` : "0 Pages"}</span>
            </div>

            {pdfFile ? (
              <>
                <div className="pdf-reorder-file">
                  <div className="pdf-reorder-file-icon">
                    <FileText />
                  </div>

                  <div>
                    <strong>{pdfFile.name}</strong>
                    <small>{formatBytes(pdfFile.size)}</small>
                    <small>
                      {t.totalPages}: {totalPages}
                    </small>
                    <small>
                      {t.pageOrder}: {orderText}
                    </small>
                  </div>
                </div>

                <div className="pdf-reorder-list">
                  {pageOrder.map((pageNumber, index) => (
                    <div className="pdf-reorder-item" key={`${pageNumber}-${index}`}>
                      <div className="pdf-reorder-page-number">
                        Page {pageNumber}
                      </div>

                      <div className="pdf-reorder-item-actions">
                        <button
                          onClick={() => movePage(index, -1)}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp />
                        </button>

                        <button
                          onClick={() => movePage(index, 1)}
                          disabled={index === pageOrder.length - 1}
                          title="Move down"
                        >
                          <ArrowDown />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="pdf-reorder-empty">
                <FileText />
                <p>{t.empty}</p>
              </div>
            )}

            {outputBlob && (
              <div className="pdf-reorder-result">
                <CheckCircle />
                <strong>Reordered PDF Ready</strong>
                <span>{formatBytes(outputBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}