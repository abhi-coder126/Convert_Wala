import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import {
  UploadCloud,
  Download,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Droplets,
} from "lucide-react";
import "../styles/PDFWatermark.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Watermark Online Free | Add Watermark to PDF",
    seoDesc:
      "Add text watermark to PDF online for free and download a high-quality PDF without converting pages to images.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Watermark",
    subtitle:
      "Upload a PDF, add custom text watermark and download a new PDF without quality loss.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to add watermark.",
    watermarkText: "Watermark Text",
    fontSize: "Font Size",
    opacity: "Opacity",
    rotation: "Rotation",
    position: "Position",
    add: "Add Watermark",
    adding: "Adding...",
    download: "Download PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF uploaded successfully.",
    textError: "Please enter watermark text.",
    success: "Watermark added successfully.",
    addFirst: "Please add watermark first.",
  },
  hi: {
    seoTitle: "PDF Watermark Online Free | PDF में Watermark जोड़ें",
    seoDesc:
      "PDF में free online text watermark add करें और बिना quality loss के high-quality PDF download करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Watermark",
    subtitle:
      "PDF upload करें, custom text watermark add करें और बिना quality loss के new PDF download करें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Watermark add करने के लिए एक PDF file select करें।",
    watermarkText: "Watermark Text",
    fontSize: "Font Size",
    opacity: "Opacity",
    rotation: "Rotation",
    position: "Position",
    add: "Watermark Add करें",
    adding: "Adding...",
    download: "PDF Download करें",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF successfully upload हो गई।",
    textError: "कृपया watermark text डालें।",
    success: "Watermark successfully add हो गया।",
    addFirst: "कृपया पहले watermark add करें।",
  },
  hinglish: {
    seoTitle: "PDF Watermark Online Free | Add Watermark to PDF",
    seoDesc:
      "PDF me free online text watermark add karo aur bina quality loss ke high-quality PDF download karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Watermark",
    subtitle:
      "PDF upload karo, custom text watermark add karo aur bina quality loss ke new PDF download karo.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Watermark add karne ke liye one PDF file select karo.",
    watermarkText: "Watermark Text",
    fontSize: "Font Size",
    opacity: "Opacity",
    rotation: "Rotation",
    position: "Position",
    add: "Add Watermark",
    adding: "Adding...",
    download: "Download PDF",
    clear: "Clear",
    selectedFile: "Selected PDF",
    totalPages: "Total Pages",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF successfully upload ho gayi.",
    textError: "Please watermark text enter karo.",
    success: "Watermark successfully add ho gaya.",
    addFirst: "Please pehle watermark add karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const hexToRgb = (hex) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
};

const getPosition = (position, pageWidth, pageHeight, textWidth, fontSize) => {
  const padding = Math.min(pageWidth, pageHeight) * 0.08;

  const positions = {
    center: {
      x: (pageWidth - textWidth) / 2,
      y: pageHeight / 2,
    },
    "top-left": {
      x: padding,
      y: pageHeight - padding - fontSize,
    },
    "top-center": {
      x: (pageWidth - textWidth) / 2,
      y: pageHeight - padding - fontSize,
    },
    "top-right": {
      x: pageWidth - textWidth - padding,
      y: pageHeight - padding - fontSize,
    },
    "bottom-left": {
      x: padding,
      y: padding,
    },
    "bottom-center": {
      x: (pageWidth - textWidth) / 2,
      y: padding,
    },
    "bottom-right": {
      x: pageWidth - textWidth - padding,
      y: padding,
    },
  };

  return positions[position] || positions.center;
};

export default function PDFWatermark() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [pdfFile, setPdfFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [watermarkText, setWatermarkText] = useState("Convert Wala");
  const [fontSize, setFontSize] = useState(52);
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(-35);
  const [position, setPosition] = useState("center");
  const [color, setColor] = useState("#64748B");
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

  const addWatermark = async () => {
    if (!pdfFile || !totalPages) {
      showToast("error", t.uploadError);
      return;
    }

    if (!watermarkText.trim()) {
      showToast("error", t.textError);
      return;
    }

    setLoading(true);
    clearOutput();

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const text = watermarkText.trim();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { x, y } = getPosition(position, width, height, textWidth, fontSize);

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: hexToRgb(color),
          opacity,
          rotate: degrees(rotation),
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
      showToast("error", "Watermark add failed. Please try another PDF.");
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
    link.download = "Convert Wala_watermarked_pdf.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearOutput();
    setPdfFile(null);
    setTotalPages(0);
    setWatermarkText("Convert Wala");
    setFontSize(52);
    setOpacity(0.25);
    setRotation(-35);
    setPosition("center");
    setColor("#64748B");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf watermark, add watermark to pdf, text watermark pdf, pdf editor, watermark pdf online"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/pdf-watermark" />
      </Helmet>

      <main className={`pdf-watermark-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-watermark-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-watermark-hero">
          <div className="pdf-watermark-badge">
            <Droplets />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-watermark-info">
          <FileText />
          <div>
            <h3>{t.title}</h3>
            <p>
              Watermark direct PDF pages par add hota hai. PDF image me convert
              nahi hoti, isliye original text, images, vectors aur print quality
              same rehti hai.
            </p>
          </div>
        </section>

        <section className="pdf-watermark-shell">
          <div className="pdf-watermark-left">
            <label className="pdf-watermark-upload">
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

            <div className="pdf-watermark-actions">
              <div className="pdf-watermark-control">
                <label>{t.watermarkText}</label>
                <input
                  value={watermarkText}
                  onChange={(e) => {
                    setWatermarkText(e.target.value);
                    clearOutput();
                  }}
                  placeholder="Convert Wala"
                />
              </div>

              <div className="pdf-watermark-control">
                <label>{t.position}</label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    clearOutput();
                  }}
                >
                  <option value="center">Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              <div className="pdf-watermark-control">
                <label>
                  {t.fontSize}: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="140"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    clearOutput();
                  }}
                />
              </div>

              <div className="pdf-watermark-control">
                <label>
                  {t.opacity}: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(Number(e.target.value));
                    clearOutput();
                  }}
                />
              </div>

              <div className="pdf-watermark-control">
                <label>
                  {t.rotation}: {rotation}°
                </label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotation}
                  onChange={(e) => {
                    setRotation(Number(e.target.value));
                    clearOutput();
                  }}
                />
              </div>

              <div className="pdf-watermark-control">
                <label>Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    clearOutput();
                  }}
                />
              </div>

              <button onClick={addWatermark} disabled={loading || !pdfFile}>
                <Droplets />
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

          <div className="pdf-watermark-card">
            <div className="pdf-watermark-card-head">
              <h3>{t.selectedFile}</h3>
              <span>{totalPages ? `${totalPages} Pages` : "0 Pages"}</span>
            </div>

            {pdfFile ? (
              <div className="pdf-watermark-file">
                <div className="pdf-watermark-file-icon">
                  <FileText />
                </div>

                <div>
                  <strong>{pdfFile.name}</strong>
                  <small>{formatBytes(pdfFile.size)}</small>
                  <small>
                    {t.totalPages}: {totalPages}
                  </small>
                  <small>Watermark: {watermarkText || "-"}</small>
                </div>
              </div>
            ) : (
              <div className="pdf-watermark-empty">
                <FileText />
                <p>{t.uploadDesc}</p>
              </div>
            )}

            {outputBlob && (
              <div className="pdf-watermark-result">
                <CheckCircle />
                <strong>Watermarked PDF Ready</strong>
                <span>{formatBytes(outputBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}