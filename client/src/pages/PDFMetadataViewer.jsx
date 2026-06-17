import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PDFDocument } from "pdf-lib";
import {
  UploadCloud,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
} from "lucide-react";
import "../styles/PDFMetadataViewer.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Metadata Viewer Online Free | View PDF Properties",
    seoDesc:
      "View PDF metadata online for free. Check PDF title, author, subject, keywords, creator, producer, dates and page count.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Metadata Viewer",
    subtitle:
      "Upload a PDF and view its metadata, properties, page count and file information instantly.",
    uploadTitle: "Upload PDF",
    uploadDesc: "Select one PDF file to view metadata.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool reads PDF metadata like title, author, subject, creator, producer, creation date, modification date and page count. It does not change your PDF quality.",
    selectedFile: "Selected PDF",
    metadata: "PDF Metadata",
    copy: "Copy Metadata",
    clear: "Clear",
    uploadError: "Please upload a valid PDF file.",
    uploaded: "PDF metadata loaded successfully.",
    copied: "Metadata copied successfully.",
    noData: "Upload PDF to view metadata.",
  },
  hi: {
    seoTitle: "PDF Metadata Viewer Online Free | PDF Properties देखें",
    seoDesc:
      "PDF metadata free online देखें। PDF title, author, subject, keywords, creator, producer, dates और page count check करें।",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Metadata Viewer",
    subtitle:
      "PDF upload करें और metadata, properties, page count और file information तुरंत देखें।",
    uploadTitle: "PDF Upload करें",
    uploadDesc: "Metadata देखने के लिए एक PDF file select करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool PDF metadata जैसे title, author, subject, creator, producer, creation date, modification date और page count read करता है। यह PDF quality change नहीं करता।",
    selectedFile: "Selected PDF",
    metadata: "PDF Metadata",
    copy: "Metadata Copy करें",
    clear: "Clear",
    uploadError: "कृपया valid PDF file upload करें।",
    uploaded: "PDF metadata successfully load हो गया।",
    copied: "Metadata successfully copy हो गया।",
    noData: "Metadata देखने के लिए PDF upload करें।",
  },
  hinglish: {
    seoTitle: "PDF Metadata Viewer Online Free | View PDF Properties",
    seoDesc:
      "PDF metadata free online dekho. PDF title, author, subject, keywords, creator, producer, dates aur page count check karo.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Metadata Viewer",
    subtitle:
      "PDF upload karo aur metadata, properties, page count aur file information instantly dekho.",
    uploadTitle: "PDF Upload Karo",
    uploadDesc: "Metadata dekhne ke liye one PDF file select karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye PDF metadata jaise title, author, subject, creator, producer, creation date, modification date aur page count read karta hai. Ye PDF quality change nahi karta.",
    selectedFile: "Selected PDF",
    metadata: "PDF Metadata",
    copy: "Copy Metadata",
    clear: "Clear",
    uploadError: "Please valid PDF file upload karo.",
    uploaded: "PDF metadata successfully load ho gaya.",
    copied: "Metadata successfully copy ho gaya.",
    noData: "Metadata dekhne ke liye PDF upload karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const formatDate = (date) => {
  if (!date) return "Not available";

  try {
    return new Date(date).toLocaleString();
  } catch {
    return "Not available";
  }
};

const safeValue = (value) => {
  if (!value) return "Not available";
  return String(value);
};

export default function PDFMetadataViewer() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [pdfFile, setPdfFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
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
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      const data = {
        fileName: file.name,
        fileSize: formatBytes(file.size),
        pageCount: pdf.getPageCount(),
        title: safeValue(pdf.getTitle()),
        author: safeValue(pdf.getAuthor()),
        subject: safeValue(pdf.getSubject()),
        keywords: safeValue(pdf.getKeywords()),
        creator: safeValue(pdf.getCreator()),
        producer: safeValue(pdf.getProducer()),
        creationDate: formatDate(pdf.getCreationDate()),
        modificationDate: formatDate(pdf.getModificationDate()),
      };

      setPdfFile(file);
      setMetadata(data);
      showToast("success", t.uploaded);
    } catch {
      showToast(
        "error",
        "PDF read failed. Password-protected ya damaged PDF ho sakti hai."
      );
    }

    e.target.value = "";
  };

  const copyMetadata = async () => {
    if (!metadata) return;

    const text = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    await navigator.clipboard.writeText(text);
    showToast("success", t.copied);
  };

  const clearTool = () => {
    setPdfFile(null);
    setMetadata(null);
  };

  const rows = metadata
    ? [
        ["File Name", metadata.fileName],
        ["File Size", metadata.fileSize],
        ["Page Count", metadata.pageCount],
        ["Title", metadata.title],
        ["Author", metadata.author],
        ["Subject", metadata.subject],
        ["Keywords", metadata.keywords],
        ["Creator", metadata.creator],
        ["Producer", metadata.producer],
        ["Creation Date", metadata.creationDate],
        ["Modification Date", metadata.modificationDate],
      ]
    : [];

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf metadata viewer, pdf properties, pdf info, pdf title, pdf author, pdf creator, pdf page count"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/pdf-metadata-viewer"
        />
      </Helmet>

      <main className={`pdf-meta-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-meta-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-meta-hero">
          <div className="pdf-meta-badge">
            <Info />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-meta-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="pdf-meta-shell">
          <div className="pdf-meta-left">
            <label className="pdf-meta-upload">
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

            <div className="pdf-meta-actions">
              <button onClick={copyMetadata} disabled={!metadata}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={clearTool} disabled={!metadata} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="pdf-meta-card">
            <div className="pdf-meta-card-head">
              <h3>{t.metadata}</h3>
              <span>{pdfFile ? pdfFile.name : "No PDF"}</span>
            </div>

            {metadata ? (
              <div className="pdf-meta-table">
                {rows.map(([label, value]) => (
                  <div className="pdf-meta-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pdf-meta-empty">
                <FileText />
                <p>{t.noData}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}