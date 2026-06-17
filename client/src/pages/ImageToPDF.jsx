import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { jsPDF } from "jspdf";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  FileText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala PDF Tool",
    title: "Image to PDF Converter",
    subtitle:
      "Upload JPG, PNG, WEBP or other images, arrange order and convert them into one clean PDF file.",
    uploadTitle: "Upload Images",
    changeImages: "Add More Images",
    uploadText: "Select one or multiple images. Files stay inside your browser.",
    pdfSettings: "PDF Settings",
    pageSize: "Page Size",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    fitMode: "Fit Mode",
    fitFullImage: "Fit Full Image",
    fillPage: "Fill Page",
    margin: "Margin",
    noMargin: "No Margin",
    smallMargin: "Small Margin",
    recommended: "Recommended",
    largeMargin: "Large Margin",
    imageQuality: "Image Quality",
    creatingPdf: "Creating PDF...",
    createPdf: "Create PDF",
    downloadPdf: "Download PDF",
    clearAll: "Clear All",
    pdfProgress: "PDF Progress",
    imagesPreview: "Images Preview",
    uploadedImagesEmpty: "Uploaded images will appear here.",
    pdfResult: "PDF Result",
    pdfReady: "PDF Ready",
    totalImages: "Total Images",
    pdfSize: "PDF Size",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    createdPdfEmpty: "Created PDF result will appear here.",
    invalidImages: "Please upload valid image files.",
    uploadSuccess: "image uploaded.",
    uploadFailed: "Some images could not be loaded.",
    uploadFirst: "Please upload images first.",
    createSuccess: "PDF created successfully.",
    createFailed: "PDF could not be created. Try images again.",
    createFirst: "Please create PDF first.",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free Image to PDF Converter Online - Convert JPG PNG to PDF | Convert Wala",
    seoDescription:
      "Convert images to PDF online for free with Convert Wala Image to PDF Converter. Upload JPG, PNG, WEBP and other images, arrange order and download one clean PDF file.",
    seoKeywords:
      "image to PDF, JPG to PDF, PNG to PDF, convert images to PDF, free image to PDF converter, online image to PDF, multiple images to PDF, photo to PDF, Convert Wala PDF tools",
  },

  hi: {
    eyebrow: "Convert Wala PDF टूल",
    title: "Image to PDF Converter",
    subtitle:
      "JPG, PNG, WEBP या अन्य images upload करें, order arrange करें और उन्हें एक clean PDF file में convert करें।",
    uploadTitle: "Images Upload करें",
    changeImages: "और Images Add करें",
    uploadText: "एक या multiple images select करें। Files browser के अंदर ही रहती हैं।",
    pdfSettings: "PDF Settings",
    pageSize: "Page Size",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    fitMode: "Fit Mode",
    fitFullImage: "Fit Full Image",
    fillPage: "Fill Page",
    margin: "Margin",
    noMargin: "No Margin",
    smallMargin: "Small Margin",
    recommended: "Recommended",
    largeMargin: "Large Margin",
    imageQuality: "Image Quality",
    creatingPdf: "PDF बन रहा है...",
    createPdf: "PDF Create करें",
    downloadPdf: "Download PDF",
    clearAll: "Clear All",
    pdfProgress: "PDF Progress",
    imagesPreview: "Images Preview",
    uploadedImagesEmpty: "Uploaded images यहां दिखाई देंगी।",
    pdfResult: "PDF Result",
    pdfReady: "PDF Ready",
    totalImages: "Total Images",
    pdfSize: "PDF Size",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    createdPdfEmpty: "Created PDF result यहां दिखाई देगा।",
    invalidImages: "कृपया valid image files upload करें।",
    uploadSuccess: "image upload हो गई।",
    uploadFailed: "कुछ images load नहीं हो पाईं।",
    uploadFirst: "कृपया पहले images upload करें।",
    createSuccess: "PDF successfully create हो गया।",
    createFailed: "PDF create नहीं हुआ। Images दोबारा try करें।",
    createFirst: "कृपया पहले PDF create करें।",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free Image to PDF Converter Online - JPG PNG को PDF में बदलें | Convert Wala",
    seoDescription:
      "Convert Wala Image to PDF Converter से JPG, PNG, WEBP और अन्य images को online free PDF में convert करें। Images upload करें, order arrange करें और clean PDF download करें।",
    seoKeywords:
      "image to PDF, JPG to PDF, PNG to PDF, images ko PDF me badle, free image to PDF converter, online PDF converter, photo to PDF, Convert Wala PDF tools",
  },

  hinglish: {
    eyebrow: "Convert Wala PDF Tool",
    title: "Image to PDF Converter",
    subtitle:
      "JPG, PNG, WEBP ya other images upload karo, order arrange karo aur unhe one clean PDF file me convert karo.",
    uploadTitle: "Upload Images",
    changeImages: "Add More Images",
    uploadText: "One ya multiple images select karo. Files browser ke andar hi rehti hain.",
    pdfSettings: "PDF Settings",
    pageSize: "Page Size",
    orientation: "Orientation",
    portrait: "Portrait",
    landscape: "Landscape",
    fitMode: "Fit Mode",
    fitFullImage: "Fit Full Image",
    fillPage: "Fill Page",
    margin: "Margin",
    noMargin: "No Margin",
    smallMargin: "Small Margin",
    recommended: "Recommended",
    largeMargin: "Large Margin",
    imageQuality: "Image Quality",
    creatingPdf: "Creating PDF...",
    createPdf: "Create PDF",
    downloadPdf: "Download PDF",
    clearAll: "Clear All",
    pdfProgress: "PDF Progress",
    imagesPreview: "Images Preview",
    uploadedImagesEmpty: "Uploaded images yahan appear hongi.",
    pdfResult: "PDF Result",
    pdfReady: "PDF Ready",
    totalImages: "Total Images",
    pdfSize: "PDF Size",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    createdPdfEmpty: "Created PDF result yahan appear hoga.",
    invalidImages: "Please valid image files upload karo.",
    uploadSuccess: "image uploaded.",
    uploadFailed: "Kuch images load nahi ho payi.",
    uploadFirst: "Pehle images upload karo.",
    createSuccess: "PDF created successfully.",
    createFailed: "PDF create nahi hua. Images dobara try karo.",
    createFirst: "Pehle PDF create karo.",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free Image to PDF Converter Online - Convert JPG PNG to PDF | Convert Wala",
    seoDescription:
      "Convert Wala Image to PDF Converter se JPG, PNG, WEBP aur other images ko PDF me online free convert karo. Images upload karo, order arrange karo aur clean PDF download karo.",
    seoKeywords:
      "image to PDF, JPG to PDF, PNG to PDF, convert images to PDF, free image to PDF converter, online image to PDF, photo to PDF, Convert Wala PDF tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "image_to_pdf") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export default function ImageToPDF() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState(10);
  const [fitMode, setFitMode] = useState("contain");
  const [quality, setQuality] = useState(0.9);

  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/image-to-pdf";

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
    setProgress(0);
  };

  const resetAll = () => {
    images.forEach((item) => URL.revokeObjectURL(item.url));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    setImages([]);
    setPdfBlob(null);
    setPdfUrl("");
    setProcessing(false);
    setProgress(0);
    setPageSize("a4");
    setOrientation("portrait");
    setMargin(10);
    setFitMode("contain");
    setQuality(0.9);
  };

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (!validImages.length) {
      showToast("error", t.invalidImages);
      return;
    }

    try {
      clearPDF();

      const prepared = await Promise.all(
        validImages.map(async (file) => {
          const url = URL.createObjectURL(file);
          const img = await loadImage(url);

          return {
            id: crypto.randomUUID(),
            file,
            url,
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
        })
      );

      setImages((prev) => [...prev, ...prepared]);
      showToast("success", `${prepared.length} ${t.uploadSuccess}`);
    } catch {
      showToast("error", t.uploadFailed);
    }

    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((img) => img.id !== id);
    });

    clearPDF();
  };

  const moveImage = (index, direction) => {
    setImages((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= next.length) return prev;

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });

    clearPDF();
  };

  const getImageData = async (imageItem) => {
    const img = await loadImage(imageItem.url);

    const maxSide = 2200;
    let canvasWidth = img.naturalWidth;
    let canvasHeight = img.naturalHeight;

    if (canvasWidth > maxSide || canvasHeight > maxSide) {
      const ratio = Math.min(maxSide / canvasWidth, maxSide / canvasHeight);
      canvasWidth = Math.round(canvasWidth * ratio);
      canvasHeight = Math.round(canvasHeight * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", Number(quality));

    canvas.width = 0;
    canvas.height = 0;

    return {
      dataUrl,
      width: canvasWidth,
      height: canvasHeight,
    };
  };

  const getPlacement = (imgW, imgH, pageW, pageH, safeMargin) => {
    const contentW = pageW - safeMargin * 2;
    const contentH = pageH - safeMargin * 2;

    const imgRatio = imgW / imgH;
    const boxRatio = contentW / contentH;

    let drawW = contentW;
    let drawH = contentH;

    if (fitMode === "contain") {
      if (imgRatio > boxRatio) {
        drawW = contentW;
        drawH = contentW / imgRatio;
      } else {
        drawH = contentH;
        drawW = contentH * imgRatio;
      }
    }

    const x = (pageW - drawW) / 2;
    const y = (pageH - drawH) / 2;

    return { x, y, drawW, drawH };
  };

  const createPDF = async () => {
    if (!images.length) {
      showToast("error", t.uploadFirst);
      return;
    }

    try {
      clearPDF();
      setProcessing(true);
      setProgress(0);

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
        compress: true,
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const safeMargin = Number(margin);

      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          pdf.addPage(pageSize, orientation);
        }

        const imageData = await getImageData(images[i]);

        const { x, y, drawW, drawH } = getPlacement(
          imageData.width,
          imageData.height,
          pageW,
          pageH,
          safeMargin
        );

        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageW, pageH, "F");

        pdf.addImage(
          imageData.dataUrl,
          "JPEG",
          x,
          y,
          drawW,
          drawH,
          undefined,
          "FAST"
        );

        setProgress(Math.round(((i + 1) / images.length) * 100));
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(url);
      setProcessing(false);
      setProgress(100);

      showToast("success", t.createSuccess);
    } catch {
      setProcessing(false);
      showToast("error", t.createFailed);
    }
  };

  const downloadPDF = () => {
    if (!pdfBlob || !pdfUrl) {
      showToast("error", t.createFirst);
      return;
    }

    const firstName = cleanFileName(images[0]?.name || "images");
    const outputName = `Convert Wala_${firstName}_images.pdf`;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  return (
    <main className={`itp-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Image to PDF Converter",
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
              "Convert images to PDF",
              "Convert JPG to PDF",
              "Convert PNG to PDF",
              "Arrange image order",
              "Choose PDF page size",
              "Browser-based PDF creation",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .itp-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .itp-page * {
          box-sizing: border-box;
        }

        .itp-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .itp-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .itp-page.dark .itp-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .itp-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .itp-page.dark .itp-eyebrow {
          color: #93c5fd;
        }

        .itp-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .itp-page.dark .itp-hero h1 {
          color: #f8fafc;
        }

        .itp-hero p {
          max-width: 880px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .itp-page.dark .itp-hero p,
        .itp-page.dark .itp-upload p,
        .itp-page.dark .itp-note,
        .itp-page.dark .itp-image-info span,
        .itp-page.dark .itp-result-grid span,
        .itp-page.dark .itp-empty {
          color: #cbd5e1;
        }

        .itp-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .itp-left,
        .itp-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .itp-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .itp-page.dark .itp-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .itp-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .itp-page.dark .itp-card h3,
        .itp-page.dark .itp-upload strong,
        .itp-page.dark .itp-field,
        .itp-page.dark .itp-quality div,
        .itp-page.dark .itp-progress-head,
        .itp-page.dark .itp-image-info strong,
        .itp-page.dark .itp-result-grid strong {
          color: #f8fafc;
        }

        .itp-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .itp-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
        }

        .itp-upload input {
          display: none;
        }

        .itp-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .itp-page.dark .itp-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .itp-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .itp-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .itp-upload p,
        .itp-note {
          color: #64748b;
          line-height: 1.6;
        }

        .itp-form-grid,
        .itp-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .itp-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .itp-field select,
        .itp-field input {
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

        .itp-page.dark .itp-field select,
        .itp-page.dark .itp-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .itp-page.dark .itp-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .itp-quality {
          margin-top: 16px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
        }

        .itp-page.dark .itp-quality {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .itp-quality div {
          display: flex;
          justify-content: space-between;
          font-weight: 900;
          color: #334155;
          margin-bottom: 10px;
        }

        .itp-quality input {
          width: 100%;
          accent-color: #2563eb;
        }

        .itp-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .itp-primary,
        .itp-dark,
        .itp-light,
        .itp-danger {
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

        .itp-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .itp-dark {
          background: #111827;
          color: #ffffff;
        }

        .itp-page.dark .itp-dark {
          background: #38bdf8;
          color: #020617;
        }

        .itp-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .itp-page.dark .itp-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .itp-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .itp-primary:disabled,
        .itp-dark:disabled,
        .itp-light:disabled,
        .itp-icon-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .itp-list {
          display: grid;
          gap: 14px;
        }

        .itp-image-item {
          display: grid;
          grid-template-columns: 90px 1fr auto;
          gap: 14px;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 12px;
        }

        .itp-page.dark .itp-image-item,
        .itp-page.dark .itp-result-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .itp-image-item img {
          width: 90px;
          height: 72px;
          object-fit: cover;
          border-radius: 14px;
          background: #e5e7eb;
        }

        .itp-image-info strong {
          color: #111827;
          display: block;
          margin-bottom: 5px;
          word-break: break-word;
        }

        .itp-image-info span {
          color: #64748b;
          font-size: 0.86rem;
          font-weight: 800;
        }

        .itp-small-actions {
          display: flex;
          gap: 6px;
        }

        .itp-icon-btn {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 12px;
          background: #ffffff;
          color: #2563eb;
          display: grid;
          place-items: center;
          cursor: pointer;
          border: 1px solid #dbe3ef;
        }

        .itp-page.dark .itp-icon-btn {
          background: #020617;
          color: #7dd3fc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .itp-icon-btn.danger {
          color: #dc2626;
        }

        .itp-progress-wrap {
          margin-top: 20px;
        }

        .itp-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .itp-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .itp-page.dark .itp-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .itp-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
          transition: width 0.22s ease;
        }

        .itp-page.dark .itp-progress span {
          background: #38bdf8;
        }

        .itp-empty {
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

        .itp-page.dark .itp-empty {
          background: #020617;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .itp-empty svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .itp-result-box {
          text-align: center;
          padding: 30px;
          border-radius: 24px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          margin-bottom: 16px;
        }

        .itp-result-box svg {
          width: 72px;
          height: 72px;
          margin-bottom: 12px;
        }

        .itp-result-box strong {
          display: block;
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        .itp-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .itp-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .itp-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .itp-toast {
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

        .itp-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .itp-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .itp-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .itp-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .itp-hero {
            padding: 56px 5% 34px;
          }

          .itp-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .itp-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .itp-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .itp-card {
            padding: 20px;
            border-radius: 22px;
          }

          .itp-form-grid,
          .itp-result-grid {
            grid-template-columns: 1fr;
          }

          .itp-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .itp-primary,
          .itp-dark,
          .itp-light,
          .itp-danger {
            width: 100%;
          }

          .itp-image-item {
            grid-template-columns: 76px 1fr;
          }

          .itp-image-item img {
            width: 76px;
            height: 64px;
          }

          .itp-small-actions {
            grid-column: 1 / -1;
            justify-content: flex-end;
          }

          .itp-empty {
            min-height: 300px;
          }

          .itp-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .itp-hero {
            padding: 44px 4.5% 28px;
          }

          .itp-hero h1 {
            font-size: 2rem;
          }

          .itp-shell {
            padding: 24px 4.5% 48px;
          }

          .itp-card {
            padding: 16px;
            border-radius: 18px;
          }
        }
      `}</style>

      {toast && (
        <div className={`itp-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="itp-hero">
        <p className="itp-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="itp-shell">
        <div className="itp-left">
          <label className="itp-card itp-upload">
            <input type="file" accept="image/*" multiple onChange={handleUpload} />
            <span className="itp-upload-icon">
              <UploadCloud />
            </span>
            <strong>{images.length ? t.changeImages : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          <div className="itp-card">
            <h3>{t.pdfSettings}</h3>

            <div className="itp-form-grid">
              <label className="itp-field">
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

              <label className="itp-field">
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

              <label className="itp-field">
                {t.fitMode}
                <select
                  value={fitMode}
                  onChange={(e) => {
                    setFitMode(e.target.value);
                    clearPDF();
                  }}
                >
                  <option value="contain">{t.fitFullImage}</option>
                  <option value="cover">{t.fillPage}</option>
                </select>
              </label>

              <label className="itp-field">
                {t.margin}
                <select
                  value={margin}
                  onChange={(e) => {
                    setMargin(Number(e.target.value));
                    clearPDF();
                  }}
                >
                  <option value="0">{t.noMargin}</option>
                  <option value="5">{t.smallMargin}</option>
                  <option value="10">{t.recommended}</option>
                  <option value="18">{t.largeMargin}</option>
                </select>
              </label>
            </div>

            <div className="itp-quality">
              <div>
                <span>{t.imageQuality}</span>
                <strong>{Math.round(quality * 100)}%</strong>
              </div>

              <input
                type="range"
                min="0.35"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => {
                  setQuality(Number(e.target.value));
                  clearPDF();
                }}
              />
            </div>

            <div className="itp-actions">
              <button
                type="button"
                className="itp-primary"
                onClick={createPDF}
                disabled={!images.length || processing}
              >
                <RefreshCcw />
                {processing ? t.creatingPdf : t.createPdf}
              </button>

              <button
                type="button"
                className="itp-dark"
                onClick={downloadPDF}
                disabled={!pdfBlob}
              >
                <Download />
                {t.downloadPdf}
              </button>
            </div>

            <div className="itp-actions">
              <button type="button" className="itp-danger" onClick={resetAll}>
                <Trash2 />
                {t.clearAll}
              </button>
            </div>

            {(processing || progress > 0) && (
              <div className="itp-progress-wrap">
                <div className="itp-progress-head">
                  <span>{t.pdfProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="itp-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="itp-right">
          <div className="itp-card">
            <h3>{t.imagesPreview}</h3>

            {images.length ? (
              <div className="itp-list">
                {images.map((item, index) => (
                  <div className="itp-image-item" key={item.id}>
                    <img src={item.url} alt={item.name} />

                    <div className="itp-image-info">
                      <strong>
                        {index + 1}. {item.name}
                      </strong>
                      <span>
                        {item.width} × {item.height} • {formatBytes(item.size)}
                      </span>
                    </div>

                    <div className="itp-small-actions">
                      <button
                        type="button"
                        className="itp-icon-btn"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        aria-label="Move image up"
                      >
                        <ArrowUp size={17} />
                      </button>

                      <button
                        type="button"
                        className="itp-icon-btn"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                        aria-label="Move image down"
                      >
                        <ArrowDown size={17} />
                      </button>

                      <button
                        type="button"
                        className="itp-icon-btn danger"
                        onClick={() => removeImage(item.id)}
                        aria-label="Remove image"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="itp-empty">
                <div>
                  <ImageIcon />
                  <p>{t.uploadedImagesEmpty}</p>
                </div>
              </div>
            )}
          </div>

          <div className="itp-card">
            <h3>{t.pdfResult}</h3>

            {pdfBlob ? (
              <>
                <div className="itp-result-box">
                  <FileText />
                  <strong>{t.pdfReady}</strong>
                  <span>{formatBytes(pdfBlob.size)}</span>
                </div>

                <div className="itp-result-grid">
                  <div>
                    <span>{t.totalImages}</span>
                    <strong>{images.length}</strong>
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
                      Convert Wala_{cleanFileName(images[0]?.name || "images")}
                      _images.pdf
                    </strong>
                  </div>
                </div>

                <div className="itp-actions">
                  <a
                    className="itp-light"
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText />
                    {t.previewPdf}
                  </a>

                  <button type="button" className="itp-primary" onClick={downloadPDF}>
                    <Download />
                    {t.downloadPdf}
                  </button>
                </div>
              </>
            ) : (
              <div className="itp-empty">
                <div>
                  <FileText />
                  <p>{t.createdPdfEmpty}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}