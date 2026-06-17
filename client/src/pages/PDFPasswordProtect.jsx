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
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Password Protect",
    subtitle:
      "Upload PDF, set an open password and download a password-protected PDF. Best for personal documents, forms and private files.",
    uploadTitle: "Upload PDF",
    changePdf: "Change PDF",
    uploadText: "Select PDF file. Processing happens inside browser.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    pages: "Pages",
    fileType: "File Type",
    passwordSettings: "Password Settings",
    currentPassword: "Current PDF Password",
    currentPasswordPlaceholder: "Only if PDF is already locked",
    openPassword: "Open Password",
    openPasswordPlaceholder: "Password required to open PDF",
    ownerPassword: "Owner Password",
    ownerPasswordPlaceholder: "Optional",
    outputQuality: "Output Quality",
    pageScale: "Page Scale",
    allowedPermissions: "Allowed Permissions",
    allowPrinting: "Allow Printing",
    allowCopy: "Allow Copy Text / Content",
    allowModify: "Allow Modify PDF",
    allowForms: "Allow Forms / Annotations",
    warning:
      "Note: Browser-based protection creates image-based PDF pages, so text will not remain selectable. The open password will be required to open the PDF.",
    protecting: "Protecting...",
    protectPdf: "Protect PDF",
    downloadPdf: "Download PDF",
    clear: "Clear",
    protectionProgress: "Protection Progress",
    protectedResult: "Protected PDF Result",
    protectedReady: "Password Protected PDF Ready",
    originalSize: "Original Size",
    protectedSize: "Protected Size",
    totalPages: "Total Pages",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    emptyResult: "Password protected PDF result will appear here.",
    note:
      "Use the same password entered in Open Password to open the protected PDF.",
    checking: "Checking...",
    currentPasswordRequired: "Current password required",
    invalidPdf: "Please upload valid PDF file.",
    uploadSuccess: "PDF uploaded successfully.",
    alreadyLocked: "PDF is already locked. Enter current password.",
    loadFailed: "PDF could not be loaded.",
    uploadFirst: "Please upload PDF first.",
    openPasswordRequired: "Open password is required.",
    passwordMin: "Password must be at least 4 characters.",
    protectedSuccess: "Password protected PDF created.",
    currentWrong: "Current PDF password is wrong or missing.",
    protectFailed: "PDF could not be protected. Try another file.",
    createFirst: "Please create protected PDF first.",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free PDF Password Protect Online - Add Password to PDF | Convert Wala",
    seoDescription:
      "Use Convert Wala PDF Password Protect to add an open password to your PDF online. Upload PDF, set permissions and download a password-protected PDF from your browser.",
    seoKeywords:
      "PDF password protect, add password to PDF, protect PDF online, PDF encryption, secure PDF, lock PDF, password protected PDF, Convert Wala PDF tools",
  },

  hi: {
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Password Protect",
    subtitle:
      "PDF upload करें, open password set करें और password-protected PDF download करें। Personal documents, forms और private files के लिए best है।",
    uploadTitle: "PDF Upload करें",
    changePdf: "PDF बदलें",
    uploadText: "PDF file select करें। Processing browser के अंदर होती है।",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    pages: "Pages",
    fileType: "File Type",
    passwordSettings: "Password Settings",
    currentPassword: "Current PDF Password",
    currentPasswordPlaceholder: "अगर PDF पहले से locked है तभी",
    openPassword: "Open Password",
    openPasswordPlaceholder: "PDF open करने के लिए password",
    ownerPassword: "Owner Password",
    ownerPasswordPlaceholder: "Optional",
    outputQuality: "Output Quality",
    pageScale: "Page Scale",
    allowedPermissions: "Allowed Permissions",
    allowPrinting: "Allow Printing",
    allowCopy: "Allow Copy Text / Content",
    allowModify: "Allow Modify PDF",
    allowForms: "Allow Forms / Annotations",
    warning:
      "Note: Browser-based protection में PDF pages image-based output बनेंगे, इसलिए text selectable नहीं रहेगा। PDF open करने के लिए password required होगा।",
    protecting: "Protecting...",
    protectPdf: "PDF Protect करें",
    downloadPdf: "Download PDF",
    clear: "Clear",
    protectionProgress: "Protection Progress",
    protectedResult: "Protected PDF Result",
    protectedReady: "Password Protected PDF Ready",
    originalSize: "Original Size",
    protectedSize: "Protected Size",
    totalPages: "Total Pages",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    emptyResult: "Password protected PDF result यहां दिखाई देगा।",
    note:
      "Protected PDF open करने के लिए वही password use होगा जो Open Password में set किया है।",
    checking: "Checking...",
    currentPasswordRequired: "Current password required",
    invalidPdf: "कृपया valid PDF file upload करें।",
    uploadSuccess: "PDF successfully upload हो गई।",
    alreadyLocked: "PDF already locked है। Current password enter करें।",
    loadFailed: "PDF load नहीं हो पाया।",
    uploadFirst: "कृपया पहले PDF upload करें।",
    openPasswordRequired: "Open password जरूरी है।",
    passwordMin: "Password minimum 4 characters का रखें।",
    protectedSuccess: "Password protected PDF create हो गई।",
    currentWrong: "Current PDF password wrong है या missing है।",
    protectFailed: "PDF protect नहीं हुआ। दूसरी file try करें।",
    createFirst: "कृपया पहले protected PDF create करें।",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free PDF Password Protect Online - PDF में Password लगाएं | Convert Wala",
    seoDescription:
      "Convert Wala PDF Password Protect से PDF में online password add करें। PDF upload करें, permissions set करें और password-protected PDF browser से download करें।",
    seoKeywords:
      "PDF password protect, PDF me password lagaye, lock PDF, protect PDF online, PDF encryption, secure PDF, Convert Wala PDF tools",
  },

  hinglish: {
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Password Protect",
    subtitle:
      "PDF upload karo, open password set karo aur password-protected PDF download karo. Personal documents, forms aur private files ke liye best hai.",
    uploadTitle: "Upload PDF",
    changePdf: "Change PDF",
    uploadText: "PDF file select karo. Processing browser ke andar hoti hai.",
    pdfDetails: "PDF Details",
    fileName: "File Name",
    fileSize: "File Size",
    pages: "Pages",
    fileType: "File Type",
    passwordSettings: "Password Settings",
    currentPassword: "Current PDF Password",
    currentPasswordPlaceholder: "Only if PDF is already locked",
    openPassword: "Open Password",
    openPasswordPlaceholder: "Password required to open PDF",
    ownerPassword: "Owner Password",
    ownerPasswordPlaceholder: "Optional",
    outputQuality: "Output Quality",
    pageScale: "Page Scale",
    allowedPermissions: "Allowed Permissions",
    allowPrinting: "Allow Printing",
    allowCopy: "Allow Copy Text / Content",
    allowModify: "Allow Modify PDF",
    allowForms: "Allow Forms / Annotations",
    warning:
      "Note: Browser-based protection me PDF pages image-based output banenge, isliye text selectable nahi rahega. Password open karne ke liye required hoga.",
    protecting: "Protecting...",
    protectPdf: "Protect PDF",
    downloadPdf: "Download PDF",
    clear: "Clear",
    protectionProgress: "Protection Progress",
    protectedResult: "Protected PDF Result",
    protectedReady: "Password Protected PDF Ready",
    originalSize: "Original Size",
    protectedSize: "Protected Size",
    totalPages: "Total Pages",
    outputFile: "Output File",
    previewPdf: "Preview PDF",
    emptyResult: "Password protected PDF result yahan appear hoga.",
    note:
      "Protected PDF ko open karne ke liye wahi password use hoga jo Open Password me set kiya hai.",
    checking: "Checking...",
    currentPasswordRequired: "Current password required",
    invalidPdf: "Please valid PDF file upload karo.",
    uploadSuccess: "PDF uploaded successfully.",
    alreadyLocked: "PDF already locked hai. Current password enter karo.",
    loadFailed: "PDF load nahi ho paya.",
    uploadFirst: "Pehle PDF upload karo.",
    openPasswordRequired: "Open password zaroori hai.",
    passwordMin: "Password minimum 4 characters ka rakho.",
    protectedSuccess: "Password protected PDF created.",
    currentWrong: "Current PDF password wrong hai ya missing hai.",
    protectFailed: "PDF protect nahi hua. Dusri file try karo.",
    createFirst: "Pehle protected PDF create karo.",
    downloadStarted: "PDF download started.",
    seoTitle:
      "Free PDF Password Protect Online - Add Password to PDF | Convert Wala",
    seoDescription:
      "Convert Wala PDF Password Protect se PDF me online password add karo. PDF upload karo, permissions set karo aur password-protected PDF browser se download karo.",
    seoKeywords:
      "PDF password protect, add password to PDF, protect PDF online, PDF encryption, secure PDF, lock PDF, Convert Wala PDF tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "protected_pdf") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

export default function PDFPasswordProtect() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [openPassword, setOpenPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showOpenPassword, setShowOpenPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  const [quality, setQuality] = useState(0.98);
  const [scale, setScale] = useState(2.2);

  const [permissions, setPermissions] = useState({
    print: true,
    copy: false,
    modify: false,
    annotForms: false,
  });

  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/pdf-password-protect";

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
    setCurrentPassword("");
    setOpenPassword("");
    setOwnerPassword("");
    setShowCurrentPassword(false);
    setShowOpenPassword(false);
    setShowOwnerPassword(false);
    setQuality(0.98);
    setScale(2.2);
    setPermissions({
      print: true,
      copy: false,
      modify: false,
      annotForms: false,
    });
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
      pages: t.checking,
    });

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useWorkerFetch: true,
        isEvalSupported: false,
        disableFontFace: false,
      }).promise;

      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        pages: pdf.numPages,
      });

      showToast("success", t.uploadSuccess);
    } catch (error) {
      if (error?.name === "PasswordException") {
        setFileInfo({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          pages: t.currentPasswordRequired,
        });
        showToast("error", t.alreadyLocked);
      } else {
        showToast("error", t.loadFailed);
      }
    }

    e.target.value = "";
  };

  const loadPDF = async () => {
    if (!file) {
      throw new Error("No PDF file selected");
    }

    const buffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      password: currentPassword || undefined,
      useWorkerFetch: true,
      isEvalSupported: false,
      disableFontFace: false,
    });

    return loadingTask.promise;
  };

  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    clearResult();
  };

  const createProtectedPDF = async () => {
    if (!file) {
      showToast("error", t.uploadFirst);
      return;
    }

    if (!openPassword.trim()) {
      showToast("error", t.openPasswordRequired);
      return;
    }

    if (openPassword.trim().length < 4) {
      showToast("error", t.passwordMin);
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

      const allowedPermissions = [];

      if (permissions.print) allowedPermissions.push("print");
      if (permissions.copy) allowedPermissions.push("copy");
      if (permissions.modify) allowedPermissions.push("modify");
      if (permissions.annotForms) allowedPermissions.push("annot-forms");

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
        const pageOrientation = pageWidth > pageHeight ? "landscape" : "portrait";

        if (!outputPdf) {
          outputPdf = new jsPDF({
            orientation: pageOrientation,
            unit: "pt",
            format: [pageWidth, pageHeight],
            compress: true,
            encryption: {
              userPassword: openPassword.trim(),
              ownerPassword:
                ownerPassword.trim() || `${openPassword.trim()}_owner`,
              userPermissions: allowedPermissions,
            },
          });
        } else {
          outputPdf.addPage([pageWidth, pageHeight], pageOrientation);
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

      showToast("success", t.protectedSuccess);
    } catch (error) {
      setProcessing(false);

      if (error?.name === "PasswordException") {
        showToast("error", t.currentWrong);
      } else {
        showToast("error", t.protectFailed);
      }
    }
  };

  const downloadPDF = () => {
    if (!resultBlob || !resultUrl || !file) {
      showToast("error", t.createFirst);
      return;
    }

    const outputName = `Convert Wala_${cleanFileName(file.name)}_protected.pdf`;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  return (
    <main className={`ppp-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala PDF Password Protect",
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
              "Add password to PDF",
              "Protect PDF online",
              "Set PDF permissions",
              "High quality browser-based PDF protection",
              "Download password-protected PDF",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .ppp-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
          color: #0f172a;
        }

        .ppp-page * {
          box-sizing: border-box;
        }

        .ppp-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .ppp-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .ppp-page.dark .ppp-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .ppp-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ppp-page.dark .ppp-eyebrow {
          color: #93c5fd;
        }

        .ppp-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .ppp-page.dark .ppp-hero h1 {
          color: #f8fafc;
        }

        .ppp-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .ppp-page.dark .ppp-hero p,
        .ppp-page.dark .ppp-upload p,
        .ppp-page.dark .ppp-note,
        .ppp-page.dark .ppp-info-grid span,
        .ppp-page.dark .ppp-result-grid span,
        .ppp-page.dark .ppp-empty {
          color: #cbd5e1;
        }

        .ppp-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .ppp-left,
        .ppp-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .ppp-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .ppp-page.dark .ppp-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .ppp-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .ppp-page.dark .ppp-card h3,
        .ppp-page.dark .ppp-upload strong,
        .ppp-page.dark .ppp-info-grid strong,
        .ppp-page.dark .ppp-result-grid strong,
        .ppp-page.dark .ppp-field,
        .ppp-page.dark .ppp-check,
        .ppp-page.dark .ppp-progress-head {
          color: #f8fafc;
        }

        .ppp-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .ppp-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
        }

        .ppp-upload input {
          display: none;
        }

        .ppp-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .ppp-page.dark .ppp-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .ppp-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .ppp-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .ppp-upload p,
        .ppp-note {
          color: #64748b;
          line-height: 1.6;
        }

        .ppp-info-grid,
        .ppp-form-grid,
        .ppp-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .ppp-info-grid div,
        .ppp-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .ppp-page.dark .ppp-info-grid div,
        .ppp-page.dark .ppp-result-grid div,
        .ppp-page.dark .ppp-check,
        .ppp-page.dark .ppp-empty {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .ppp-info-grid span,
        .ppp-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .ppp-info-grid strong,
        .ppp-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .ppp-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
          display: block;
        }

        .ppp-field input,
        .ppp-field select {
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

        .ppp-page.dark .ppp-field input,
        .ppp-page.dark .ppp-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ppp-page.dark .ppp-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .ppp-password-wrap {
          position: relative;
        }

        .ppp-password-wrap input {
          padding-right: 50px;
        }

        .ppp-eye {
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

        .ppp-page.dark .ppp-eye {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .ppp-permissions {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        .ppp-check {
          display: flex;
          gap: 10px;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 13px;
          color: #334155;
          font-weight: 900;
        }

        .ppp-check input {
          accent-color: #2563eb;
        }

        .ppp-warning {
          padding: 16px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.7;
          font-weight: 800;
          margin-top: 16px;
        }

        .ppp-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .ppp-primary,
        .ppp-dark,
        .ppp-light,
        .ppp-danger {
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

        .ppp-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .ppp-dark {
          background: #111827;
          color: #ffffff;
        }

        .ppp-page.dark .ppp-dark {
          background: #38bdf8;
          color: #020617;
        }

        .ppp-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .ppp-page.dark .ppp-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .ppp-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .ppp-primary:disabled,
        .ppp-dark:disabled,
        .ppp-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .ppp-progress-wrap {
          margin-top: 20px;
        }

        .ppp-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .ppp-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .ppp-page.dark .ppp-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .ppp-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
          transition: width 0.22s ease;
        }

        .ppp-page.dark .ppp-progress span {
          background: #38bdf8;
        }

        .ppp-empty {
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

        .ppp-empty svg {
          width: 78px;
          height: 78px;
          margin-bottom: 14px;
        }

        .ppp-result-box {
          text-align: center;
          padding: 30px;
          border-radius: 24px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          margin-bottom: 16px;
        }

        .ppp-result-box svg {
          width: 72px;
          height: 72px;
          margin-bottom: 12px;
        }

        .ppp-result-box strong {
          display: block;
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        .ppp-toast {
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

        .ppp-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .ppp-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ppp-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .ppp-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .ppp-hero {
            padding: 56px 5% 34px;
          }

          .ppp-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .ppp-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .ppp-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .ppp-card {
            padding: 20px;
            border-radius: 22px;
          }

          .ppp-info-grid,
          .ppp-form-grid,
          .ppp-result-grid {
            grid-template-columns: 1fr;
          }

          .ppp-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ppp-primary,
          .ppp-dark,
          .ppp-light,
          .ppp-danger {
            width: 100%;
          }

          .ppp-empty {
            min-height: 300px;
          }

          .ppp-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .ppp-hero {
            padding: 44px 4.5% 28px;
          }

          .ppp-hero h1 {
            font-size: 2rem;
          }

          .ppp-shell {
            padding: 24px 4.5% 48px;
          }

          .ppp-card {
            padding: 16px;
            border-radius: 18px;
          }
        }
      `}</style>

      {toast && (
        <div className={`ppp-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="ppp-hero">
        <p className="ppp-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="ppp-shell">
        <div className="ppp-left">
          <label className="ppp-card ppp-upload">
            <input type="file" accept="application/pdf" onChange={handleUpload} />
            <span className="ppp-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changePdf : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {fileInfo && (
            <div className="ppp-card">
              <h3>{t.pdfDetails}</h3>

              <div className="ppp-info-grid">
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

          <div className="ppp-card">
            <h3>{t.passwordSettings}</h3>

            <label className="ppp-field ppp-password-wrap">
              {t.currentPassword}
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  clearResult();
                }}
                placeholder={t.currentPasswordPlaceholder}
              />
              <button
                type="button"
                className="ppp-eye"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                aria-label={
                  showCurrentPassword ? "Hide current password" : "Show current password"
                }
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <div className="ppp-form-grid" style={{ marginTop: 16 }}>
              <label className="ppp-field ppp-password-wrap">
                {t.openPassword}
                <input
                  type={showOpenPassword ? "text" : "password"}
                  value={openPassword}
                  onChange={(e) => {
                    setOpenPassword(e.target.value);
                    clearResult();
                  }}
                  placeholder={t.openPasswordPlaceholder}
                />
                <button
                  type="button"
                  className="ppp-eye"
                  onClick={() => setShowOpenPassword((prev) => !prev)}
                  aria-label={
                    showOpenPassword ? "Hide open password" : "Show open password"
                  }
                >
                  {showOpenPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>

              <label className="ppp-field ppp-password-wrap">
                {t.ownerPassword}
                <input
                  type={showOwnerPassword ? "text" : "password"}
                  value={ownerPassword}
                  onChange={(e) => {
                    setOwnerPassword(e.target.value);
                    clearResult();
                  }}
                  placeholder={t.ownerPasswordPlaceholder}
                />
                <button
                  type="button"
                  className="ppp-eye"
                  onClick={() => setShowOwnerPassword((prev) => !prev)}
                  aria-label={
                    showOwnerPassword ? "Hide owner password" : "Show owner password"
                  }
                >
                  {showOwnerPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
            </div>

            <div className="ppp-form-grid" style={{ marginTop: 16 }}>
              <label className="ppp-field">
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

              <label className="ppp-field">
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

            <h3 style={{ marginTop: 22 }}>{t.allowedPermissions}</h3>

            <div className="ppp-permissions">
              <label className="ppp-check">
                <input
                  type="checkbox"
                  checked={permissions.print}
                  onChange={() => togglePermission("print")}
                />
                {t.allowPrinting}
              </label>

              <label className="ppp-check">
                <input
                  type="checkbox"
                  checked={permissions.copy}
                  onChange={() => togglePermission("copy")}
                />
                {t.allowCopy}
              </label>

              <label className="ppp-check">
                <input
                  type="checkbox"
                  checked={permissions.modify}
                  onChange={() => togglePermission("modify")}
                />
                {t.allowModify}
              </label>

              <label className="ppp-check">
                <input
                  type="checkbox"
                  checked={permissions.annotForms}
                  onChange={() => togglePermission("annotForms")}
                />
                {t.allowForms}
              </label>
            </div>

            <div className="ppp-warning">{t.warning}</div>

            <div className="ppp-actions">
              <button
                type="button"
                className="ppp-primary"
                onClick={createProtectedPDF}
                disabled={!file || processing}
              >
                <ShieldCheck />
                {processing ? t.protecting : t.protectPdf}
              </button>

              <button
                type="button"
                className="ppp-dark"
                onClick={downloadPDF}
                disabled={!resultBlob}
              >
                <Download />
                {t.downloadPdf}
              </button>
            </div>

            <div className="ppp-actions">
              <button type="button" className="ppp-danger" onClick={resetAll}>
                <Trash2 />
                {t.clear}
              </button>
            </div>

            {(processing || progress > 0) && (
              <div className="ppp-progress-wrap">
                <div className="ppp-progress-head">
                  <span>{t.protectionProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="ppp-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ppp-right">
          <div className="ppp-card">
            <h3>{t.protectedResult}</h3>

            {resultBlob ? (
              <>
                <div className="ppp-result-box">
                  <Lock />
                  <strong>{t.protectedReady}</strong>
                  <span>{formatBytes(resultBlob.size)}</span>
                </div>

                <div className="ppp-result-grid">
                  <div>
                    <span>{t.originalSize}</span>
                    <strong>{formatBytes(file?.size)}</strong>
                  </div>

                  <div>
                    <span>{t.protectedSize}</span>
                    <strong>{formatBytes(resultBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.totalPages}</span>
                    <strong>{fileInfo?.pages}</strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "pdf")}_protected.pdf
                    </strong>
                  </div>
                </div>

                <div className="ppp-actions">
                  <a
                    className="ppp-light"
                    href={resultUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText />
                    {t.previewPdf}
                  </a>

                  <button type="button" className="ppp-primary" onClick={downloadPDF}>
                    <Download />
                    {t.downloadPdf}
                  </button>
                </div>
              </>
            ) : (
              <div className="ppp-empty">
                <div>
                  <Lock />
                  <p>{t.emptyResult}</p>
                </div>
              </div>
            )}

            <p className="ppp-note">{t.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}