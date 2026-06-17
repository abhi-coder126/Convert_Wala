import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  UploadCloud,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Hash,
} from "lucide-react";
import "../styles/PDFPageNumberAdder.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Page Number Adder Online Free | Add Page Numbers to PDF",
    seoDesc:
      "Add page numbers to PDF online for free. Choose position, font size, color and download high-quality PDF without quality loss.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Number Adder",
    subtitle:
      "Upload a PDF, add page numbers and download a new PDF without quality loss.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to add page numbers.",
    position: "Position",
    format: "Number Format",
    fontSize: "Font Size",
    startFrom: "Start Number From",
    color: "Color",
    add: "Add Page Numbers",
    adding: "Adding...",
    download: "Download PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF uploaded successfully.",
    success: "Page numbers added successfully.",
    addFirst: "Please add page numbers first.",
  },
  hi: {
    seoTitle: "PDF Page Number Adder Online Free | PDF में Page Numbers जोड़ें",
    seoDesc:
      "PDF में free online page numbers add करें। Position, font size, color choose करें और high-quality PDF download करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Page Number Adder",
    subtitle:
      "PDF upload करें, page numbers add करें और बिना quality loss के new PDF download करें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Page numbers add करने के लिए एक PDF file select करें।",
    position: "Position",
    format: "Number Format",
    fontSize: "Font Size",
    startFrom: "Start Number From",
    color: "Color",
    add: "Page Numbers Add करें",
    adding: "Adding...",
    download: "PDF Download करें",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF successfully upload हो गई।",
    success: "Page numbers successfully add हो गए।",
    addFirst: "कृपया पहले page numbers add करें।",
  },
  hinglish: {
    seoTitle: "PDF Page Number Adder Online Free | Add Page Numbers to PDF",
    seoDesc:
      "PDF me free online page numbers add karo. Position, font size, color choose karo aur high-quality PDF download karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Page Number Adder",
    subtitle:
      "PDF upload karo, page numbers add karo aur bina quality loss ke new PDF download karo.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Page numbers add karne ke liye one PDF file select karo.",
    position: "Position",
    format: "Number Format",
    fontSize: "Font Size",
    startFrom: "Start Number From",
    color: "Color",
    add: "Add Page Numbers",
    adding: "Adding...",
    download: "Download PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF successfully upload ho gayi.",
    success: "Page numbers successfully add ho gaye.",
    addFirst: "Please pehle page numbers add karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  return rgb(
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255
  );
};

const getNumberText = (format, current, total) => {
  if (format === "page-x") return `Page ${current}`;
  if (format === "x-of-y") return `${current} of ${total}`;
  if (format === "page-x-of-y") return `Page ${current} of ${total}`;
  return `${current}`;
};

const getPosition = (position, width, height, textWidth, fontSize) => {
  const padding = Math.min(width, height) * 0.05;

  const positions = {
    "bottom-center": {
      x: (width - textWidth) / 2,
      y: padding,
    },
    "bottom-left": {
      x: padding,
      y: padding,
    },
    "bottom-right": {
      x: width - textWidth - padding,
      y: padding,
    },
    "top-center": {
      x: (width - textWidth) / 2,
      y: height - padding - fontSize,
    },
    "top-left": {
      x: padding,
      y: height - padding - fontSize,
    },
    "top-right": {
      x: width - textWidth - padding,
      y: height - padding - fontSize,
    },
  };

  return positions[position] || positions["bottom-center"];
};

export default function PDFPageNumberAdder() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [position, setPosition] = useState("bottom-center");
  const [numberFormat, setNumberFormat] = useState("page-x-of-y");
  const [fontSize, setFontSize] = useState(12);
  const [startFrom, setStartFrom] = useState(1);
  const [color, setColor] = useState("#111827");
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

      setPdfFile(file);
      setTotalPages(pdf.getPageCount());
      showToast("success", t.uploaded);
    } catch {
      showToast(
        "error",
        "PDF read failed. Password-protected ya damaged PDF ho sakti hai."
      );
    }

    e.target.value = "";
  };

  const addPageNumbers = async () => {
    if (!pdfFile || !totalPages) {
      showToast("error", t.uploadError);
      return;
    }

    setLoading(true);
    clearOutput();

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      pages.forEach((page, index) => {
        const pageNumber = startFrom + index;
        const text = getNumberText(numberFormat, pageNumber, totalPages);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { x, y } = getPosition(position, width, height, textWidth, fontSize);

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: hexToRgb(color),
        });
      });

      const pdfBytes = await pdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      showToast("success", t.success);
    } catch {
      showToast("error", "Page numbers add failed. Please try another PDF.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!outputUrl || !outputBlob) {
      showToast("error", t.addFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = "Convert Wala_page_numbered_pdf.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearOutput();
    setPdfFile(null);
    setTotalPages(0);
    setPosition("bottom-center");
    setNumberFormat("page-x-of-y");
    setFontSize(12);
    setStartFrom(1);
    setColor("#111827");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf page number adder, add page numbers to pdf, pdf page numbering, pdf editor, page numbers pdf"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/pdf-page-number-adder"
        />
      </Helmet>

      <main className={`pdf-number-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-number-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-number-hero">
          <div className="pdf-number-badge">
            <Hash />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-number-info">
          <FileText />
          <div>
            <h3>{t.title}</h3>
            <p>
              Page numbers direct PDF pages par add hote hain. PDF image me
              convert nahi hoti, isliye original quality same rehti hai.
            </p>
          </div>
        </section>

        <section className="pdf-number-shell">
          <div className="pdf-number-left">
            <label className="pdf-number-upload">
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

            <div className="pdf-number-actions">
              <div className="pdf-number-control">
                <label>{t.position}</label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    clearOutput();
                  }}
                >
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>

              <div className="pdf-number-control">
                <label>{t.format}</label>
                <select
                  value={numberFormat}
                  onChange={(e) => {
                    setNumberFormat(e.target.value);
                    clearOutput();
                  }}
                >
                  <option value="number">1</option>
                  <option value="page-x">Page 1</option>
                  <option value="x-of-y">1 of 10</option>
                  <option value="page-x-of-y">Page 1 of 10</option>
                </select>
              </div>

              <div className="pdf-number-control">
                <label>
                  {t.fontSize}: {fontSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="40"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    clearOutput();
                  }}
                />
              </div>

              <div className="pdf-number-control">
                <label>{t.startFrom}</label>
                <input
                  type="number"
                  min="1"
                  value={startFrom}
                  onChange={(e) => {
                    setStartFrom(Math.max(1, Number(e.target.value) || 1));
                    clearOutput();
                  }}
                />
              </div>

              <div className="pdf-number-control">
                <label>{t.color}</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    clearOutput();
                  }}
                />
              </div>

              <button onClick={addPageNumbers} disabled={loading || !pdfFile}>
                <Hash />
                {loading ? t.adding : t.add}
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

          <div className="pdf-number-card">
            <div className="pdf-number-card-head">
              <h3>{t.selectedFile}</h3>
              <span>{totalPages ? `${totalPages} Pages` : "0 Pages"}</span>
            </div>

            {pdfFile ? (
              <div className="pdf-number-file">
                <div className="pdf-number-file-icon">
                  <FileText />
                </div>

                <div>
                  <strong>{pdfFile.name}</strong>
                  <small>{formatBytes(pdfFile.size)}</small>
                  <small>
                    {t.totalPages}: {totalPages}
                  </small>
                  <small>
                    Preview: {getNumberText(numberFormat, startFrom, totalPages)}
                  </small>
                </div>
              </div>
            ) : (
              <div className="pdf-number-empty">
                <FileText />
                <p>{t.uploadDesc}</p>
              </div>
            )}

            {outputBlob && (
              <div className="pdf-number-result">
                <CheckCircle />
                <strong>Page Numbered PDF Ready</strong>
                <span>{formatBytes(outputBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}