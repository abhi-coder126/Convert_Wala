import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { jsPDF } from "jspdf";
import {
  UploadCloud,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Password Remover",
    subtitle:
      "Upload your own locked PDF, enter the correct password and create a new unlocked PDF file in high quality. No password cracking, no brute-force.",
    uploadTitle: "Upload Locked PDF",
    changePdf: "Change PDF",
    uploadText: "Select your own PDF file. Processing happens inside browser.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    pages: "Pages",
    fileType: "File Type",
    passwordSettings: "Password & Settings",
    passwordLabel: "PDF Open Password",
    passwordPlaceholder: "Enter PDF password",
    outputQuality: "Output Quality",
    pageScale: "Page Scale",
    confirmText:
      "I confirm this PDF is my own file or I have permission to unlock it.",
    warning:
      "Note: This tool does not crack passwords. Correct password is required. Output PDF will be image-based, so text will not remain selectable.",
    checkPassword: "Check Password",
    unlocking: "Unlocking...",
    removePassword: "Remove Password",
    downloadPdf: "Download PDF",
    clear: "Clear",
    unlockProgress: "Unlock Progress",
    unlockedResult: "Unlocked PDF Result",
    unlockedReady: "Unlocked PDF Ready",
    originalSize: "Original Size",
    unlockedSize: "Unlocked Size",
    totalPages: "Total Pages",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    emptyResult: "Unlocked PDF result will appear here.",
    note:
      "High quality output may increase file size. Best for personal PDFs where you know the password.",
    passwordRequired: "Password required",
    invalidPdf: "Please upload valid PDF file.",
    uploaded: "PDF uploaded. Enter password if PDF is locked.",
    uploadFirst: "Please upload PDF first.",
    passwordCorrect: "Password is correct. PDF is ready.",
    wrongPassword: "Wrong password or password required.",
    openFailed: "PDF could not be opened.",
    confirmOwn: "Please confirm that this is your own or allowed PDF file.",
    unlockSuccess: "Unlocked PDF created successfully.",
    passwordWrongMissing: "Password is wrong or missing.",
    unlockFailed: "Password could not be removed. Check password and try again.",
    createFirst: "Please create unlocked PDF first.",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free PDF Password Remover Online - Unlock PDF with Password | Convert Wala",
    seoDescription:
      "Use Convert Wala PDF Password Remover to unlock your own password-protected PDF by entering the correct password. Create and download a high quality unlocked PDF directly in your browser.",
    seoKeywords:
      "PDF password remover, unlock PDF, remove PDF password, PDF unlocker, password protected PDF, unlock PDF online, free PDF password remover, Convert Wala PDF tools",
  },

  hi: {
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Password Remover",
    subtitle:
      "अपनी locked PDF upload करें, correct password डालें और high quality unlocked PDF file बनाएं। No password cracking, no brute-force.",
    uploadTitle: "Locked PDF Upload करें",
    changePdf: "PDF बदलें",
    uploadText: "अपनी PDF file select करें। Processing browser के अंदर होती है।",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    pages: "Pages",
    fileType: "File Type",
    passwordSettings: "Password & Settings",
    passwordLabel: "PDF Open Password",
    passwordPlaceholder: "PDF password enter करें",
    outputQuality: "Output Quality",
    pageScale: "Page Scale",
    confirmText:
      "मैं confirm करता हूं कि यह PDF मेरी own file है या मेरे पास इसे unlock करने की permission है।",
    warning:
      "Note: यह tool password crack नहीं करता। Correct password required है। Output PDF image-based होगी, इसलिए text selectable नहीं रहेगा।",
    checkPassword: "Password Check करें",
    unlocking: "Unlocking...",
    removePassword: "Password Remove करें",
    downloadPdf: "Download PDF",
    clear: "Clear",
    unlockProgress: "Unlock Progress",
    unlockedResult: "Unlocked PDF Result",
    unlockedReady: "Unlocked PDF Ready",
    originalSize: "Original Size",
    unlockedSize: "Unlocked Size",
    totalPages: "Total Pages",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    emptyResult: "Unlocked PDF result यहां दिखाई देगा।",
    note:
      "High quality output में file size बढ़ सकता है। Personal PDFs के लिए best है जहां password आपको पता हो।",
    passwordRequired: "Password required",
    invalidPdf: "कृपया valid PDF file upload करें।",
    uploaded: "PDF upload हो गई। अगर PDF locked है तो password enter करें।",
    uploadFirst: "कृपया पहले PDF upload करें।",
    passwordCorrect: "Password correct है। PDF ready है।",
    wrongPassword: "Wrong password या password required है।",
    openFailed: "PDF open नहीं हो पाया।",
    confirmOwn: "Please confirm करें कि यह आपकी own/allowed PDF file है।",
    unlockSuccess: "Unlocked PDF successfully create हो गई।",
    passwordWrongMissing: "Password wrong है या missing है।",
    unlockFailed: "Password remove नहीं हुआ। Password check करके try करें।",
    createFirst: "कृपया पहले unlocked PDF create करें।",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free PDF Password Remover Online - Password से PDF Unlock करें | Convert Wala",
    seoDescription:
      "Convert Wala PDF Password Remover से अपनी password-protected PDF को correct password डालकर unlock करें। Browser में high quality unlocked PDF create और download करें।",
    seoKeywords:
      "PDF password remover, unlock PDF, remove PDF password, PDF unlocker, PDF password remove kare, protected PDF unlock, Convert Wala PDF tools",
  },

  hinglish: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Password Remover",
    subtitle:
      "Apni locked PDF upload karo, correct password enter karo aur high quality unlocked PDF file create karo. No password cracking, no brute-force.",
    uploadTitle: "Upload Locked PDF",
    changePdf: "Change PDF",
    uploadText: "Apni PDF file select karo. Processing browser ke andar hoti hai.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    pages: "Pages",
    fileType: "File Type",
    passwordSettings: "Password & Settings",
    passwordLabel: "PDF Open Password",
    passwordPlaceholder: "Enter PDF password",
    outputQuality: "Output Quality",
    pageScale: "Page Scale",
    confirmText:
      "Main confirm karta hu ki ye PDF meri own file hai ya mere paas unlock karne ki permission hai.",
    warning:
      "Note: Ye tool password crack nahi karta. Correct password required hai. Output PDF image-based hogi, isliye text selectable nahi rahega.",
    checkPassword: "Check Password",
    unlocking: "Unlocking...",
    removePassword: "Remove Password",
    downloadPdf: "Download PDF",
    clear: "Clear",
    unlockProgress: "Unlock Progress",
    unlockedResult: "Unlocked PDF Result",
    unlockedReady: "Unlocked PDF Ready",
    originalSize: "Original Size",
    unlockedSize: "Unlocked Size",
    totalPages: "Total Pages",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    emptyResult: "Unlocked PDF result yahan appear hoga.",
    note:
      "High quality output me file size badh sakta hai. Personal PDFs ke liye best hai jaha password tumhe pata ho.",
    passwordRequired: "Password required",
    invalidPdf: "Please valid PDF file upload karo.",
    uploaded: "PDF uploaded. Agar PDF locked hai to password enter karo.",
    uploadFirst: "Pehle PDF upload karo.",
    passwordCorrect: "Password correct hai. PDF ready hai.",
    wrongPassword: "Wrong password ya password required hai.",
    openFailed: "PDF open nahi ho paya.",
    confirmOwn: "Please confirm karo ki ye file tumhari own/allowed PDF file hai.",
    unlockSuccess: "Unlocked PDF created successfully.",
    passwordWrongMissing: "Password wrong hai ya missing hai.",
    unlockFailed: "Password remove nahi hua. Password check karke try karo.",
    createFirst: "Pehle unlocked PDF create karo.",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free PDF Password Remover Online - Unlock PDF with Password | Convert Wala",
    seoDescription:
      "Convert Wala PDF Password Remover se apni password-protected PDF ko correct password enter karke unlock karo. Browser me high quality unlocked PDF create aur download karo.",
    seoKeywords:
      "PDF password remover, unlock PDF, remove PDF password, PDF unlocker, password protected PDF, unlock PDF online, Convert Wala PDF tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "unlocked_pdf") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

export default function PDFPasswordRemover() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [quality, setQuality] = useState(0.98);
  const [scale, setScale] = useState(2.2);
  const [confirmOwn, setConfirmOwn] = useState(false);

  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/pdf-password-remover";

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
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl("");
    setProgress(0);
  };

  const resetAll = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setFileInfo(null);
    setPassword("");
    setShowPassword(false);
    setQuality(0.98);
    setScale(2.2);
    setConfirmOwn(false);
    setResultBlob(null);
    setResultUrl("");
    setProcessing(false);
    setProgress(0);
  };

  const handleUpload = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      showToast("error", t.invalidPdf);
      e.target.value = "";
      return;
    }

    resetAll();

    setFile(selectedFile);
    setFileInfo({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      pages: t.passwordRequired,
    });

    showToast("success", t.uploaded);
    e.target.value = "";
  };

  const loadPDF = async () => {
    if (!file) {
      throw new Error("No PDF file selected");
    }

    const buffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      password: password || undefined,
      useWorkerFetch: true,
      isEvalSupported: false,
      disableFontFace: false,
    });

    return loadingTask.promise;
  };

  const checkPDF = async () => {
    if (!file) {
      showToast("error", t.uploadFirst);
      return;
    }

    try {
      const pdf = await loadPDF();

      setFileInfo((prev) => ({
        ...prev,
        pages: pdf.numPages,
      }));

      showToast("success", t.passwordCorrect);
    } catch (error) {
      if (error?.name === "PasswordException") {
        showToast("error", t.wrongPassword);
      } else {
        showToast("error", t.openFailed);
      }
    }
  };

  const removePassword = async () => {
    if (!file) {
      showToast("error", t.uploadFirst);
      return;
    }

    if (!confirmOwn) {
      showToast("error", t.confirmOwn);
      return;
    }

    try {
      clearResult();
      setProcessing(true);
      setProgress(0);

      const pdf = await loadPDF();

      setFileInfo((prev) => ({
        ...prev,
        pages: pdf.numPages,
      }));

      let outputPdf = null;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const originalViewport = page.getViewport({ scale: 1 });
        const renderViewport = page.getViewport({ scale: Number(scale) });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });

        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: renderViewport,
        }).promise;

        const imgData = canvas.toDataURL("image/jpeg", Number(quality));

        const pageWidth = originalViewport.width;
        const pageHeight = originalViewport.height;
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

      if (!outputPdf) {
        throw new Error("PDF output was not created");
      }

      const blob = outputPdf.output("blob");
      const url = URL.createObjectURL(blob);

      setResultBlob(blob);
      setResultUrl(url);
      setProcessing(false);
      setProgress(100);

      showToast("success", t.unlockSuccess);
    } catch (error) {
      setProcessing(false);

      if (error?.name === "PasswordException") {
        showToast("error", t.passwordWrongMissing);
      } else {
        showToast("error", t.unlockFailed);
      }
    }
  };

  const downloadPDF = () => {
    if (!resultBlob || !resultUrl || !file) {
      showToast("error", t.createFirst);
      return;
    }

    const outputName = `Convert Wala_${cleanFileName(file.name)}_unlocked.pdf`;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  return (
    <main className={`ppr-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala PDF Password Remover",
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
              "Unlock password-protected PDF with correct password",
              "Create high quality unlocked PDF file",
              "Check PDF password",
              "Browser-based PDF processing",
              "No password cracking",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .ppr-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .ppr-page * {
          box-sizing: border-box;
        }

        .ppr-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .ppr-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .ppr-page.dark .ppr-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .ppr-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ppr-page.dark .ppr-eyebrow {
          color: #93c5fd;
        }

        .ppr-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .ppr-page.dark .ppr-hero h1 {
          color: #f8fafc;
        }

        .ppr-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .ppr-page.dark .ppr-hero p,
        .ppr-page.dark .ppr-upload p,
        .ppr-page.dark .ppr-note,
        .ppr-page.dark .ppr-info-grid span,
        .ppr-page.dark .ppr-result-grid span,
        .ppr-page.dark .ppr-empty {
          color: #cbd5e1;
        }

        .ppr-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .ppr-left,
        .ppr-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .ppr-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .ppr-page.dark .ppr-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .ppr-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .ppr-page.dark .ppr-card h3,
        .ppr-page.dark .ppr-upload strong,
        .ppr-page.dark .ppr-info-grid strong,
        .ppr-page.dark .ppr-result-grid strong,
        .ppr-page.dark .ppr-field,
        .ppr-page.dark .ppr-check,
        .ppr-page.dark .ppr-progress-head {
          color: #f8fafc;
        }

        .ppr-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .ppr-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
        }

        .ppr-upload input {
          display: none;
        }

        .ppr-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .ppr-page.dark .ppr-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .ppr-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .ppr-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .ppr-upload p,
        .ppr-note {
          color: #64748b;
          line-height: 1.6;
        }

        .ppr-info-grid,
        .ppr-form-grid,
        .ppr-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .ppr-info-grid div,
        .ppr-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .ppr-page.dark .ppr-info-grid div,
        .ppr-page.dark .ppr-result-grid div,
        .ppr-page.dark .ppr-check,
        .ppr-page.dark .ppr-empty {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .ppr-info-grid span,
        .ppr-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .ppr-info-grid strong,
        .ppr-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .ppr-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
          display: block;
        }

        .ppr-field input,
        .ppr-field select {
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

        .ppr-page.dark .ppr-field input,
        .ppr-page.dark .ppr-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ppr-page.dark .ppr-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .ppr-password-wrap {
          position: relative;
        }

        .ppr-password-wrap input {
          padding-right: 50px;
        }

        .ppr-eye {
          position: absolute;
          right: 10px;
          bottom: 8px;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 12px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .ppr-page.dark .ppr-eye {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .ppr-check {
          margin-top: 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          color: #334155;
          font-weight: 800;
          line-height: 1.6;
        }

        .ppr-check input {
          margin-top: 5px;
          accent-color: #2563eb;
        }

        .ppr-warning {
          padding: 16px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.7;
          font-weight: 800;
          margin-top: 16px;
        }

        .ppr-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .ppr-primary,
        .ppr-dark,
        .ppr-light,
        .ppr-danger {
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

        .ppr-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .ppr-dark {
          background: #111827;
          color: #ffffff;
        }

        .ppr-page.dark .ppr-dark {
          background: #38bdf8;
          color: #020617;
        }

        .ppr-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .ppr-page.dark .ppr-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .ppr-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .ppr-primary:disabled,
        .ppr-dark:disabled,
        .ppr-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .ppr-progress-wrap {
          margin-top: 20px;
        }

        .ppr-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .ppr-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .ppr-page.dark .ppr-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .ppr-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
          transition: width 0.22s ease;
        }

        .ppr-page.dark .ppr-progress span {
          background: #38bdf8;
        }

        .ppr-empty {
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

        .ppr-empty svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .ppr-result-box {
          text-align: center;
          padding: 30px;
          border-radius: 24px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          margin-bottom: 16px;
        }

        .ppr-result-box svg {
          width: 72px;
          height: 72px;
          margin-bottom: 12px;
        }

        .ppr-result-box strong {
          display: block;
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        .ppr-toast {
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

        .ppr-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .ppr-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ppr-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .ppr-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .ppr-hero {
            padding: 56px 5% 34px;
          }

          .ppr-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .ppr-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .ppr-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .ppr-card {
            padding: 20px;
            border-radius: 22px;
          }

          .ppr-info-grid,
          .ppr-form-grid,
          .ppr-result-grid {
            grid-template-columns: 1fr;
          }

          .ppr-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ppr-primary,
          .ppr-dark,
          .ppr-light,
          .ppr-danger {
            width: 100%;
          }

          .ppr-empty {
            min-height: 300px;
          }

          .ppr-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .ppr-hero {
            padding: 44px 4.5% 28px;
          }

          .ppr-hero h1 {
            font-size: 2rem;
          }

          .ppr-shell {
            padding: 24px 4.5% 48px;
          }

          .ppr-card {
            padding: 16px;
            border-radius: 18px;
          }
        }
      `}</style>

      {toast && (
        <div className={`ppr-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="ppr-hero">
        <p className="ppr-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="ppr-shell">
        <div className="ppr-left">
          <label className="ppr-card ppr-upload">
            <input type="file" accept="application/pdf" onChange={handleUpload} />
            <span className="ppr-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changePdf : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {fileInfo && (
            <div className="ppr-card">
              <h3>{t.pdfDetails}</h3>

              <div className="ppr-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{fileInfo.name}</strong>
                </div>

                <div>
                  <span>{t.fileSize}</span>
                  <strong>{formatBytes(fileInfo.size)}</strong>
                </div>

                <div>
                  <span>{t.pages}</span>
                  <strong>{fileInfo.pages}</strong>
                </div>

                <div>
                  <span>{t.fileType}</span>
                  <strong>PDF</strong>
                </div>
              </div>
            </div>
          )}

          <div className="ppr-card">
            <h3>{t.passwordSettings}</h3>

            <label className="ppr-field ppr-password-wrap">
              {t.passwordLabel}
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearResult();
                }}
                placeholder={t.passwordPlaceholder}
              />

              <button
                type="button"
                className="ppr-eye"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <div className="ppr-form-grid" style={{ marginTop: 16 }}>
              <label className="ppr-field">
                {t.outputQuality}
                <select
                  value={quality}
                  onChange={(e) => {
                    setQuality(Number(e.target.value));
                    clearResult();
                  }}
                >
                  <option value="0.82">Small Size</option>
                  <option value="0.92">Balanced HD</option>
                  <option value="0.98">Recommended High Quality</option>
                  <option value="1">Maximum Quality Large Size</option>
                </select>
              </label>

              <label className="ppr-field">
                {t.pageScale}
                <select
                  value={scale}
                  onChange={(e) => {
                    setScale(Number(e.target.value));
                    clearResult();
                  }}
                >
                  <option value="1.5">Good Quality</option>
                  <option value="2.2">Recommended HD</option>
                  <option value="3">Best Quality</option>
                  <option value="4">Ultra Quality Large Size</option>
                </select>
              </label>
            </div>

            <label className="ppr-check">
              <input
                type="checkbox"
                checked={confirmOwn}
                onChange={(e) => setConfirmOwn(e.target.checked)}
              />
              <span>{t.confirmText}</span>
            </label>

            <div className="ppr-warning">{t.warning}</div>

            <div className="ppr-actions">
              <button
                type="button"
                className="ppr-light"
                onClick={checkPDF}
                disabled={!file}
              >
                <Lock />
                {t.checkPassword}
              </button>

              <button
                type="button"
                className="ppr-primary"
                onClick={removePassword}
                disabled={!file || processing}
              >
                <Unlock />
                {processing ? t.unlocking : t.removePassword}
              </button>
            </div>

            <div className="ppr-actions">
              <button
                type="button"
                className="ppr-dark"
                onClick={downloadPDF}
                disabled={!resultBlob}
              >
                <Download />
                {t.downloadPdf}
              </button>

              <button type="button" className="ppr-danger" onClick={resetAll}>
                <Trash2 />
                {t.clear}
              </button>
            </div>

            {(processing || progress > 0) && (
              <div className="ppr-progress-wrap">
                <div className="ppr-progress-head">
                  <span>{t.unlockProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="ppr-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ppr-right">
          <div className="ppr-card">
            <h3>{t.unlockedResult}</h3>

            {resultBlob ? (
              <>
                <div className="ppr-result-box">
                  <Unlock />
                  <strong>{t.unlockedReady}</strong>
                  <span>{formatBytes(resultBlob.size)}</span>
                </div>

                <div className="ppr-result-grid">
                  <div>
                    <span>{t.originalSize}</span>
                    <strong>{formatBytes(file?.size)}</strong>
                  </div>

                  <div>
                    <span>{t.unlockedSize}</span>
                    <strong>{formatBytes(resultBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.totalPages}</span>
                    <strong>{fileInfo?.pages}</strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "pdf")}_unlocked.pdf
                    </strong>
                  </div>
                </div>

                <div className="ppr-actions">
                  <a
                    className="ppr-light"
                    href={resultUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText />
                    {t.previewPdf}
                  </a>

                  <button type="button" className="ppr-primary" onClick={downloadPDF}>
                    <Download />
                    {t.downloadPdf}
                  </button>
                </div>
              </>
            ) : (
              <div className="ppr-empty">
                <div>
                  <Lock />
                  <p>{t.emptyResult}</p>
                </div>
              </div>
            )}

            <p className="ppr-note">{t.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}