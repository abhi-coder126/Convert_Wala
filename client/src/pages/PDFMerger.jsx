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
  RefreshCcw,
  GripVertical,
} from "lucide-react";
import "../styles/PDFMerger.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "PDF Merger Online Free | Merge PDF Files",
    seoDesc:
      "Merge multiple PDF files into one PDF online for free. Fast, secure and high-quality PDF merger tool.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Merger",
    subtitle:
      "Upload multiple PDF files, arrange order and merge them into one high-quality PDF.",
    uploadTitle: "Upload PDF Files",
    uploadDesc: "Select multiple PDF files to merge.",
    workTitle: "What does this tool do?",
    workDesc:
      "This tool joins multiple PDF files into one PDF. It keeps pages clear because it copies original PDF pages instead of converting them into images.",
    merge: "Merge PDFs",
    merging: "Merging...",
    download: "Download Merged PDF",
    clear: "Clear",
    files: "Selected PDFs",
    empty: "Upload PDF files to start merging.",
    uploaded: "PDF files added successfully.",
    invalid: "Please upload valid PDF files.",
    mergeFirst: "Please merge PDF files first.",
    merged: "PDF files merged successfully.",
    needTwo: "Please upload at least two PDF files.",
  },
  hi: {
    seoTitle: "PDF Merger Online Free | PDF Files Merge करें",
    seoDesc:
      "कई PDF files को एक PDF में free online merge करें। Fast, secure और high-quality PDF merger tool.",
    eyebrow: "Convert Wala PDF टूल",
    title: "PDF Merger",
    subtitle:
      "Multiple PDF files upload करें, order set करें और उन्हें एक high-quality PDF में merge करें।",
    uploadTitle: "PDF Files Upload करें",
    uploadDesc: "Merge करने के लिए multiple PDF files select करें।",
    workTitle: "यह tool क्या करता है?",
    workDesc:
      "यह tool multiple PDF files को एक PDF में join करता है। यह pages को image में convert नहीं करता, इसलिए quality clear रहती है।",
    merge: "PDFs Merge करें",
    merging: "Merging...",
    download: "Merged PDF Download करें",
    clear: "Clear",
    files: "Selected PDFs",
    empty: "PDF merge शुरू करने के लिए PDF files upload करें।",
    uploaded: "PDF files successfully add हो गई।",
    invalid: "कृपया valid PDF files upload करें।",
    mergeFirst: "कृपया पहले PDF files merge करें।",
    merged: "PDF files successfully merge हो गई।",
    needTwo: "कृपया कम से कम दो PDF files upload करें।",
  },
  hinglish: {
    seoTitle: "PDF Merger Online Free | Merge PDF Files",
    seoDesc:
      "Multiple PDF files ko ek PDF me free online merge karo. Fast, secure aur high-quality PDF merger tool.",
    eyebrow: "Convert Wala PDF Tool",
    title: "PDF Merger",
    subtitle:
      "Multiple PDF files upload karo, order set karo aur unko ek high-quality PDF me merge karo.",
    uploadTitle: "PDF Files Upload Karo",
    uploadDesc: "Merge karne ke liye multiple PDF files select karo.",
    workTitle: "Ye tool kya kaam karta hai?",
    workDesc:
      "Ye multiple PDF files ko ek PDF me join karta hai. Ye pages ko image me convert nahi karta, isliye quality clear rehti hai.",
    merge: "Merge PDFs",
    merging: "Merging...",
    download: "Download Merged PDF",
    clear: "Clear",
    files: "Selected PDFs",
    empty: "PDF merge start karne ke liye PDF files upload karo.",
    uploaded: "PDF files successfully add ho gayi.",
    invalid: "Please valid PDF files upload karo.",
    mergeFirst: "Please pehle PDF files merge karo.",
    merged: "PDF files successfully merge ho gayi.",
    needTwo: "Please kam se kam two PDF files upload karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

export default function PDFMerger() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [files, setFiles] = useState([]);
  const [mergedUrl, setMergedUrl] = useState("");
  const [mergedBlob, setMergedBlob] = useState(null);
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

  const clearMerged = () => {
    if (mergedUrl) URL.revokeObjectURL(mergedUrl);
    setMergedUrl("");
    setMergedBlob(null);
  };

  const handleUpload = (e) => {
    const selected = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );

    if (!selected.length) {
      showToast("error", t.invalid);
      return;
    }

    clearMerged();

    const mapped = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...mapped]);
    showToast("success", t.uploaded);
    e.target.value = "";
  };

  const removeFile = (id) => {
    clearMerged();
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const moveFile = (index, direction) => {
    clearMerged();

    setFiles((prev) => {
      const newFiles = [...prev];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= newFiles.length) return prev;

      [newFiles[index], newFiles[targetIndex]] = [
        newFiles[targetIndex],
        newFiles[index],
      ];

      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      showToast("error", t.needTwo);
      return;
    }

    setLoading(true);
    clearMerged();

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });

        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save({
        useObjectStreams: true,
      });

      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedBlob(blob);
      setMergedUrl(url);
      showToast("success", t.merged);
    } catch {
      showToast(
        "error",
        "PDF merge failed. Password-protected ya damaged PDF ho sakti hai."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedUrl || !mergedBlob) {
      showToast("error", t.mergeFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = mergedUrl;
    link.download = "Convert Wala_merged_pdf.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearTool = () => {
    clearMerged();
    setFiles([]);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="pdf merger, merge pdf, combine pdf, join pdf files, pdf tool, online pdf merger"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/pdf-merger" />
      </Helmet>

      <main className={`pdf-merge-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`pdf-merge-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="pdf-merge-hero">
          <div className="pdf-merge-badge">
            <FileText />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="pdf-merge-info">
          <FileText />
          <div>
            <h3>{t.workTitle}</h3>
            <p>{t.workDesc}</p>
          </div>
        </section>

        <section className="pdf-merge-shell">
          <div className="pdf-merge-left">
            <label className="pdf-merge-upload">
              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={handleUpload}
              />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            <div className="pdf-merge-actions">
              <button onClick={mergePDFs} disabled={loading || files.length < 2}>
                <RefreshCcw />
                {loading ? t.merging : t.merge}
              </button>

              <button onClick={downloadMerged} disabled={!mergedBlob}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!files.length} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="pdf-merge-card">
            <div className="pdf-merge-card-head">
              <h3>{t.files}</h3>
              <span>{files.length} PDFs</span>
            </div>

            {files.length ? (
              <div className="pdf-merge-list">
                {files.map((item, index) => (
                  <div className="pdf-merge-item" key={item.id}>
                    <div className="pdf-merge-drag">
                      <GripVertical />
                    </div>

                    <div className="pdf-merge-file-icon">
                      <FileText />
                    </div>

                    <div className="pdf-merge-file-info">
                      <strong>{item.name}</strong>
                      <small>{formatBytes(item.size)}</small>
                    </div>

                    <div className="pdf-merge-order">
                      <button
                        onClick={() => moveFile(index, -1)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveFile(index, 1)}
                        disabled={index === files.length - 1}
                      >
                        ↓
                      </button>
                    </div>

                    <button
                      className="pdf-merge-remove"
                      onClick={() => removeFile(item.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pdf-merge-empty">
                <FileText />
                <p>{t.empty}</p>
              </div>
            )}

            {mergedBlob && (
              <div className="pdf-merge-result">
                <CheckCircle />
                <strong>Merged PDF Ready</strong>
                <span>{formatBytes(mergedBlob.size)}</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}