import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Image as ImageIcon,
  Download,
  RefreshCcw,
  Scissors,
  Copy,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  FileImage,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const pageText = {
  en: {
    seoTitle: "Free Image Background Remover Online | Convert Wala",
    seoDescription:
      "Remove image background online for free with Convert Wala Image Background Remover. Upload JPG, PNG or WEBP and download transparent PNG without API.",
    seoKeywords:
      "image background remover, remove bg, background remover online, transparent png maker, photo background remover, free image tools",

    eyebrow: "Convert Wala Image Tool",
    heading: "Image Background Remover",
    subtitle:
      "Upload an image, remove the background directly in your browser and download a clean transparent PNG.",

    uploadTitle: "Upload Image",
    uploadText: "Drop your image here or click to browse",
    uploadHint: "Supports JPG, PNG, WEBP. Max file size 20MB.",
    chooseImage: "Choose Image",
    removeBg: "Remove Background",
    removing: "Removing...",
    downloadPng: "Download PNG",
    copyImage: "Copy Image",
    reset: "Reset",

    original: "Original Image",
    removed: "Background Removed",
    previewBg: "Preview Background",
    transparent: "Transparent",
    white: "White",
    dark: "Dark",

    noteTitle: "No API Required",
    note:
      "This tool removes background in the browser. For very complex images, edges may need manual editing in a professional editor.",

    selectFirst: "Please upload an image first.",
    invalidFile: "Please upload a valid image file.",
    largeFile: "Image file is too large. Please upload under 20MB.",
    bgRemoved: "Background removed successfully.",
    copied: "Image copied.",
    copyFailed: "Copy image is not supported in this browser.",
    downloaded: "Transparent PNG downloaded.",
    resetDone: "Tool reset successfully.",
    failed: "Background removal failed. Try another image.",
  },

  hi: {
    seoTitle: "Free Image Background Remover Online | Convert Wala",
    seoDescription:
      "Convert Wala Image Background Remover से JPG, PNG या WEBP image का background remove करें और transparent PNG download करें।",
    seoKeywords:
      "image background remover, remove bg, background remover online, transparent png maker, photo background remover, free image tools",

    eyebrow: "Convert Wala Image टूल",
    heading: "Image Background Remover",
    subtitle:
      "Image upload करें, background browser में remove करें और clean transparent PNG download करें।",

    uploadTitle: "Image Upload करें",
    uploadText: "Image यहां drop करें या browse करने के लिए click करें",
    uploadHint: "JPG, PNG, WEBP support है। Max file size 20MB.",
    chooseImage: "Image चुनें",
    removeBg: "Background Remove करें",
    removing: "Removing...",
    downloadPng: "PNG Download करें",
    copyImage: "Image Copy करें",
    reset: "Reset करें",

    original: "Original Image",
    removed: "Background Removed",
    previewBg: "Preview Background",
    transparent: "Transparent",
    white: "White",
    dark: "Dark",

    noteTitle: "No API Required",
    note:
      "यह tool browser में background remove करता है। बहुत complex images में edges के लिए manual editing की जरूरत हो सकती है।",

    selectFirst: "पहले image upload करें।",
    invalidFile: "Valid image file upload करें।",
    largeFile: "Image बहुत बड़ी है। 20MB से कम upload करें।",
    bgRemoved: "Background successfully remove हो गया।",
    copied: "Image copy हो गई।",
    copyFailed: "इस browser में copy image support नहीं है।",
    downloaded: "Transparent PNG download हो गई।",
    resetDone: "Tool reset हो गया।",
    failed: "Background removal failed. दूसरी image try करें।",
  },

  hinglish: {
    seoTitle: "Free Image Background Remover Online | Convert Wala",
    seoDescription:
      "Convert Wala Image Background Remover se JPG, PNG ya WEBP image ka background remove karo aur transparent PNG download karo.",
    seoKeywords:
      "image background remover, remove bg, background remover online, transparent png maker, photo background remover, free image tools",

    eyebrow: "Convert Wala Image Tool",
    heading: "Image Background Remover",
    subtitle:
      "Image upload karo, background browser me remove karo aur clean transparent PNG download karo.",

    uploadTitle: "Upload Image",
    uploadText: "Image yahan drop karo ya browse ke liye click karo",
    uploadHint: "JPG, PNG, WEBP support hai. Max file size 20MB.",
    chooseImage: "Choose Image",
    removeBg: "Remove Background",
    removing: "Removing...",
    downloadPng: "Download PNG",
    copyImage: "Copy Image",
    reset: "Reset",

    original: "Original Image",
    removed: "Background Removed",
    previewBg: "Preview Background",
    transparent: "Transparent",
    white: "White",
    dark: "Dark",

    noteTitle: "No API Required",
    note:
      "Ye tool browser me background remove karta hai. Complex images me edges ke liye manual editing ki zarurat ho sakti hai.",

    selectFirst: "Pehle image upload karo.",
    invalidFile: "Valid image file upload karo.",
    largeFile: "Image bahut large hai. 20MB se kam upload karo.",
    bgRemoved: "Background successfully remove ho gaya.",
    copied: "Image copied.",
    copyFailed: "Is browser me copy image support nahi hai.",
    downloaded: "Transparent PNG downloaded.",
    resetDone: "Tool reset ho gaya.",
    failed: "Background removal failed. Dusri image try karo.",
  },
};

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${sizes[index]}`;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export default function ImageBackgroundRemover() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [previewBg, setPreviewBg] = useState("transparent");
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/image-background-remover";

  const fileInfo = useMemo(() => {
    if (!file) return null;

    return {
      name: file.name,
      size: formatBytes(file.size),
      type: file.type || "image",
    };
  }, [file]);

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

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const setImageFile = (selectedFile) => {
    setError("");

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError(t.invalidFile);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(t.largeFile);
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setResultBlob(null);
    setResultUrl("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    setImageFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files?.[0];
    setImageFile(selectedFile);
  };

  const removeBackgroundNow = async () => {
    if (!file) {
      setError(t.selectFirst);
      return;
    }

    try {
      setIsRemoving(true);
      setError("");

      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file);

      if (resultUrl) URL.revokeObjectURL(resultUrl);

      const nextUrl = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(nextUrl);
      setIsRemoving(false);
      showToast("success", t.bgRemoved);
    } catch (err) {
      console.error(err);
      setIsRemoving(false);
      setError(t.failed);
      showToast("error", t.failed);
    }
  };

  const downloadResult = () => {
    if (!resultBlob) return;

    const baseName = file?.name?.replace(/\.[^.]+$/, "") || "image";
    downloadBlob(resultBlob, `${baseName}_bg_removed.png`);
    showToast("success", t.downloaded);
  };

  const copyResult = async () => {
    if (!resultBlob) return;

    try {
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error("Clipboard image not supported");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": resultBlob,
        }),
      ]);

      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const resetAll = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setOriginalUrl("");
    setResultBlob(null);
    setResultUrl("");
    setPreviewBg("transparent");
    setIsRemoving(false);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    showToast("success", t.resetDone);
  };

  return (
    <main className={`ibr-page ${theme === "dark" ? "dark" : "light"}`}>
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
        <meta
          property="og:locale"
          content={language === "hi" ? "hi_IN" : "en_US"}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Image Background Remover",
            url: canonicalUrl,
            applicationCategory: "MultimediaApplication",
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
              "Remove image background",
              "Transparent PNG download",
              "Browser based image background removal",
              "JPG PNG WEBP support",
              "No backend API required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .ibr-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
          overflow-x: hidden;
        }

        .ibr-page * {
          box-sizing: border-box;
        }

        .ibr-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .ibr-hero {
          padding: 76px 6% 42px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .ibr-page.dark .ibr-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .ibr-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .ibr-page.dark .ibr-eyebrow {
          color: #93c5fd;
        }

        .ibr-hero h1 {
          margin: 0;
          color: inherit;
          font-size: clamp(2.25rem, 5vw, 5rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .ibr-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .ibr-page.dark .ibr-hero p {
          color: #cbd5e1;
        }

        .ibr-shell {
          width: 100%;
          padding: 42px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.82fr) minmax(420px, 1.18fr);
          gap: 28px;
          align-items: start;
        }

        .ibr-left,
        .ibr-right {
          display: grid;
          gap: 20px;
          min-width: 0;
        }

        @media (min-width: 1101px) {
          .ibr-right {
            position: sticky;
            top: 18px;
          }
        }

        .ibr-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .ibr-page.dark .ibr-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .ibr-card h3 {
          margin: 0 0 16px;
          color: inherit;
          font-size: 1.12rem;
        }

        .ibr-upload {
          min-height: 260px;
          border: 2px dashed #bfdbfe;
          background:
            radial-gradient(circle at 20% 10%, rgba(37, 99, 235, 0.12), transparent 34%),
            #f8fafc;
          border-radius: 24px;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 28px;
          cursor: pointer;
          transition: 0.22s ease;
        }

        .ibr-upload:hover {
          border-color: #2563eb;
          transform: translateY(-2px);
        }

        .ibr-page.dark .ibr-upload {
          background:
            radial-gradient(circle at 20% 10%, rgba(37, 99, 235, 0.18), transparent 34%),
            rgba(255, 255, 255, 0.05);
          border-color: rgba(147, 197, 253, 0.28);
        }

        .ibr-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
          margin: 0 auto 18px;
        }

        .ibr-page.dark .ibr-upload-icon {
          background: rgba(37, 99, 235, 0.18);
          color: #93c5fd;
        }

        .ibr-upload-icon svg {
          width: 34px;
          height: 34px;
        }

        .ibr-upload strong {
          display: block;
          color: inherit;
          font-size: 1.05rem;
          margin-bottom: 8px;
        }

        .ibr-upload span {
          color: #64748b;
          font-weight: 800;
          line-height: 1.6;
        }

        .ibr-page.dark .ibr-upload span,
        .ibr-page.dark .ibr-file-box span,
        .ibr-page.dark .ibr-preview-head p {
          color: #cbd5e1;
        }

        .ibr-hidden-input {
          display: none;
        }

        .ibr-file-box {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          padding: 14px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
        }

        .ibr-page.dark .ibr-file-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .ibr-file-icon {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }

        .ibr-file-box strong {
          display: block;
          color: inherit;
          overflow-wrap: anywhere;
          line-height: 1.4;
        }

        .ibr-file-box span {
          display: block;
          color: #64748b;
          margin-top: 4px;
          font-size: 0.88rem;
          font-weight: 800;
        }

        .ibr-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .ibr-primary,
        .ibr-dark,
        .ibr-light,
        .ibr-danger {
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
          flex: 1;
          text-align: center;
        }

        .ibr-primary {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.22);
        }

        .ibr-dark {
          background: #111827;
          color: #ffffff;
        }

        .ibr-page.dark .ibr-dark {
          background: #f8fafc;
          color: #111827;
        }

        .ibr-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .ibr-page.dark .ibr-light {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .ibr-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .ibr-primary:disabled,
        .ibr-dark:disabled,
        .ibr-light:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ibr-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 16px;
          line-height: 1.7;
          font-weight: 800;
        }

        .ibr-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 18px;
          padding: 16px;
          font-weight: 900;
          line-height: 1.6;
          margin-top: 14px;
        }

        .ibr-preview-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .ibr-preview-box {
          min-width: 0;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          overflow: hidden;
          background: #f8fafc;
        }

        .ibr-page.dark .ibr-preview-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .ibr-preview-head {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        .ibr-page.dark .ibr-preview-head {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .ibr-preview-head strong {
          color: inherit;
        }

        .ibr-preview-head p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .ibr-preview-area {
          height: 390px;
          display: grid;
          place-items: center;
          padding: 18px;
          overflow: hidden;
        }

        .ibr-preview-area.checker {
          background-color: #ffffff;
          background-image:
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
          background-size: 22px 22px;
          background-position: 0 0, 0 11px, 11px -11px, -11px 0px;
        }

        .ibr-preview-area.white {
          background: #ffffff;
        }

        .ibr-preview-area.darkbg {
          background: #111827;
        }

        .ibr-preview-area.empty {
          background: #f8fafc;
        }

        .ibr-page.dark .ibr-preview-area.empty {
          background: rgba(255, 255, 255, 0.04);
        }

        .ibr-preview-area img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 18px 35px rgba(15, 23, 42, 0.18));
        }

        .ibr-empty-preview {
          text-align: center;
          color: #64748b;
          font-weight: 900;
          line-height: 1.6;
        }

        .ibr-page.dark .ibr-empty-preview {
          color: #cbd5e1;
        }

        .ibr-empty-preview svg {
          width: 52px;
          height: 52px;
          color: #2563eb;
          margin-bottom: 10px;
        }

        .ibr-bg-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 0 0 18px;
        }

        .ibr-bg-tabs button {
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .ibr-bg-tabs button.active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .ibr-page.dark .ibr-bg-tabs button {
          background: rgba(37, 99, 235, 0.14);
          color: #93c5fd;
          border-color: rgba(147, 197, 253, 0.28);
        }

        .ibr-toast {
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

        .ibr-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .ibr-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ibr-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .ibr-shell {
            grid-template-columns: 1fr;
          }

          .ibr-right {
            position: static;
          }
        }

        @media (max-width: 760px) {
          .ibr-hero {
            padding: 52px 5% 34px;
          }

          .ibr-hero h1 {
            font-size: clamp(2.1rem, 11vw, 3.2rem);
            letter-spacing: -0.045em;
          }

          .ibr-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .ibr-shell {
            padding: 32px 5% 60px;
          }

          .ibr-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ibr-primary,
          .ibr-dark,
          .ibr-light,
          .ibr-danger {
            width: 100%;
          }

          .ibr-preview-grid {
            grid-template-columns: 1fr;
          }

          .ibr-preview-area {
            height: 310px;
          }

          .ibr-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .ibr-card {
            padding: 16px;
            border-radius: 18px;
          }

          .ibr-shell {
            padding: 24px 4.5% 48px;
          }

          .ibr-upload {
            min-height: 230px;
            padding: 20px;
          }

          .ibr-file-box {
            align-items: flex-start;
          }

          .ibr-preview-area {
            height: 260px;
          }
        }
      `}</style>

      {toast && (
        <div className={`ibr-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="ibr-hero">
        <p className="ibr-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="ibr-shell">
        <div className="ibr-left">
          <div className="ibr-card">
            <h3>{t.uploadTitle}</h3>

            <div
              className="ibr-upload"
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
              onKeyDown={(event) => {
                if (event.key === "Enter") inputRef.current?.click();
              }}
            >
              <div>
                <div className="ibr-upload-icon">
                  <UploadCloud />
                </div>
                <strong>{t.uploadText}</strong>
                <span>{t.uploadHint}</span>
              </div>
            </div>

            <input
              ref={inputRef}
              className="ibr-hidden-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />

            {fileInfo && (
              <div className="ibr-file-box">
                <span className="ibr-file-icon">
                  <FileImage />
                </span>
                <div>
                  <strong>{fileInfo.name}</strong>
                  <span>
                    {fileInfo.size} • {fileInfo.type}
                  </span>
                </div>
              </div>
            )}

            {error && <div className="ibr-error">{error}</div>}

            <div className="ibr-actions">
              <button
                type="button"
                className="ibr-primary"
                onClick={removeBackgroundNow}
                disabled={!file || isRemoving}
              >
                <Scissors />
                {isRemoving ? t.removing : t.removeBg}
              </button>

              <button
                type="button"
                className="ibr-dark"
                onClick={() => inputRef.current?.click()}
              >
                <ImageIcon />
                {t.chooseImage}
              </button>
            </div>

            <div className="ibr-actions">
              <button
                type="button"
                className="ibr-light"
                onClick={downloadResult}
                disabled={!resultBlob}
              >
                <Download />
                {t.downloadPng}
              </button>

              <button
                type="button"
                className="ibr-light"
                onClick={copyResult}
                disabled={!resultBlob}
              >
                <Copy />
                {t.copyImage}
              </button>
            </div>

            <div className="ibr-actions">
              <button type="button" className="ibr-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="ibr-card">
            <h3>{t.noteTitle}</h3>
            <div className="ibr-note">
              <ShieldCheck size={18} /> {t.note}
            </div>
          </div>
        </div>

        <div className="ibr-right">
          <div className="ibr-card">
            <h3>{t.previewBg}</h3>

            <div className="ibr-bg-tabs">
              <button
                type="button"
                className={previewBg === "transparent" ? "active" : ""}
                onClick={() => setPreviewBg("transparent")}
              >
                {t.transparent}
              </button>

              <button
                type="button"
                className={previewBg === "white" ? "active" : ""}
                onClick={() => setPreviewBg("white")}
              >
                {t.white}
              </button>

              <button
                type="button"
                className={previewBg === "dark" ? "active" : ""}
                onClick={() => setPreviewBg("dark")}
              >
                {t.dark}
              </button>
            </div>

            <div className="ibr-preview-grid">
              <div className="ibr-preview-box">
                <div className="ibr-preview-head">
                  <div>
                    <strong>{t.original}</strong>
                    <p>{fileInfo?.name || t.chooseImage}</p>
                  </div>
                </div>

                <div className="ibr-preview-area empty">
                  {originalUrl ? (
                    <img src={originalUrl} alt="Original preview" />
                  ) : (
                    <div className="ibr-empty-preview">
                      <ImageIcon />
                      <div>{t.original}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="ibr-preview-box">
                <div className="ibr-preview-head">
                  <div>
                    <strong>{t.removed}</strong>
                    <p>{resultBlob ? "PNG Transparent" : t.removeBg}</p>
                  </div>
                  <Sparkles size={20} />
                </div>

                <div
                  className={`ibr-preview-area ${
                    previewBg === "transparent"
                      ? "checker"
                      : previewBg === "white"
                      ? "white"
                      : "darkbg"
                  }`}
                >
                  {resultUrl ? (
                    <img src={resultUrl} alt="Background removed preview" />
                  ) : (
                    <div className="ibr-empty-preview">
                      <Scissors />
                      <div>{isRemoving ? t.removing : t.removed}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}