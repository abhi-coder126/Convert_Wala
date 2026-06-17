import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Images,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import "../styles/BulkImageConverter.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const formats = [
  { label: "PNG", value: "png", mime: "image/png", ext: "png" },
  { label: "JPG", value: "jpg", mime: "image/jpeg", ext: "jpg" },
  { label: "JPEG", value: "jpeg", mime: "image/jpeg", ext: "jpeg" },
  { label: "WEBP", value: "webp", mime: "image/webp", ext: "webp" },
];

const pageText = {
  en: {
    seoTitle: "Bulk Image Converter Online Free | Convert Multiple Images",
    seoDesc:
      "Convert multiple images online into PNG, JPG, JPEG and WEBP format with high quality. Fast, secure and free bulk image converter.",
    eyebrow: "Convert Wala Image Tool",
    title: "Bulk Image Converter",
    subtitle:
      "Upload multiple images, choose output format, convert all images together and download them instantly with high quality.",
    uploadTitle: "Upload Bulk Images",
    uploadDesc: "Supports JPG, PNG, JPEG, WEBP and more image formats.",
    convertTo: "Convert To",
    quality: "Quality",
    convertAll: "Convert All",
    converting: "Converting...",
    downloadAll: "Download All",
    clear: "Clear",
    original: "Original",
    converted: "Converted",
    noImage: "No images uploaded yet",
    noImageDesc: "Upload multiple images to start bulk conversion.",
    uploadError: "Please upload valid image files.",
    uploaded: "images added successfully.",
    uploadFirst: "Please upload images first.",
    convertedSuccess: "All images converted successfully.",
    convertError: "Some images could not be converted. Please try again.",
    convertFirst: "Please convert images first.",
    downloadStarted: "Bulk download started.",
    secure: "Browser Based",
    secureDesc: "Images are processed in your browser.",
    qualityCard: "High Quality",
    qualityDesc: "Default quality is set to 95%.",
    fast: "Bulk Convert",
    fastDesc: "Convert many images in one click.",
  },
  hi: {
    seoTitle: "Bulk Image Converter Online Free | Multiple Images Convert करें",
    seoDesc:
      "Multiple images को PNG, JPG, JPEG और WEBP format में high quality के साथ free convert करें। Fast और secure bulk image converter.",
    eyebrow: "Convert Wala इमेज टूल",
    title: "Bulk Image Converter",
    subtitle:
      "Multiple images upload करें, output format select करें, सभी images को एक साथ convert करें और high quality में download करें।",
    uploadTitle: "Bulk Images Upload करें",
    uploadDesc: "JPG, PNG, JPEG, WEBP और अन्य image formats support हैं।",
    convertTo: "Convert To",
    quality: "Quality",
    convertAll: "Convert All",
    converting: "Converting...",
    downloadAll: "Download All",
    clear: "Clear",
    original: "Original",
    converted: "Converted",
    noImage: "अभी कोई image upload नहीं हुई",
    noImageDesc: "Bulk conversion शुरू करने के लिए multiple images upload करें।",
    uploadError: "कृपया valid image files upload करें।",
    uploaded: "images successfully add हो गई।",
    uploadFirst: "कृपया पहले images upload करें।",
    convertedSuccess: "सभी images successfully convert हो गई।",
    convertError: "कुछ images convert नहीं हुई। Please try again.",
    convertFirst: "कृपया पहले images convert करें।",
    downloadStarted: "Bulk download start हो गया।",
    secure: "Browser Based",
    secureDesc: "Images आपके browser में process होती हैं।",
    qualityCard: "High Quality",
    qualityDesc: "Default quality 95% set है।",
    fast: "Bulk Convert",
    fastDesc: "एक click में कई images convert करें।",
  },
  hinglish: {
    seoTitle: "Bulk Image Converter Online Free | Multiple Images Convert Karo",
    seoDesc:
      "Multiple images ko PNG, JPG, JPEG aur WEBP format me high quality ke sath free convert karo. Fast aur secure bulk image converter.",
    eyebrow: "Convert Wala Image Tool",
    title: "Bulk Image Converter",
    subtitle:
      "Multiple images upload karo, output format select karo, sab images ek sath convert karo aur high quality me download karo.",
    uploadTitle: "Bulk Images Upload Karo",
    uploadDesc: "JPG, PNG, JPEG, WEBP aur more image formats support karta hai.",
    convertTo: "Convert To",
    quality: "Quality",
    convertAll: "Convert All",
    converting: "Converting...",
    downloadAll: "Download All",
    clear: "Clear",
    original: "Original",
    converted: "Converted",
    noImage: "Abhi koi image upload nahi hui",
    noImageDesc: "Bulk conversion start karne ke liye multiple images upload karo.",
    uploadError: "Please valid image files upload karo.",
    uploaded: "images successfully add ho gayi.",
    uploadFirst: "Pehle images upload karo.",
    convertedSuccess: "All images successfully convert ho gayi.",
    convertError: "Kuch images convert nahi hui. Please try again.",
    convertFirst: "Pehle images convert karo.",
    downloadStarted: "Bulk download started.",
    secure: "Browser Based",
    secureDesc: "Images browser ke andar process hoti hain.",
    qualityCard: "High Quality",
    qualityDesc: "Default quality 95% rakhi gayi hai.",
    fast: "Bulk Convert",
    fastDesc: "One click me multiple images convert karo.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

const cleanName = (name = "image") =>
  name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");

export default function BulkImageConverter() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(0.95);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const selectedFormat = useMemo(
    () => formats.find((item) => item.value === format),
    [format]
  );

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

  const handleUpload = (e) => {
    const selected = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!selected.length) {
      showToast("error", t.uploadError);
      return;
    }

    const mapped = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      convertedBlob: null,
      convertedUrl: "",
    }));

    setFiles((prev) => [...prev, ...mapped]);
    showToast("success", `${selected.length} ${t.uploaded}`);
    e.target.value = "";
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((item) => item.id === id);

      if (target?.preview) URL.revokeObjectURL(target.preview);
      if (target?.convertedUrl) URL.revokeObjectURL(target.convertedUrl);

      return prev.filter((item) => item.id !== id);
    });
  };

  const convertOne = (item) =>
    new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");

        if (selectedFormat.mime === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Conversion failed"));
              return;
            }

            const url = URL.createObjectURL(blob);
            resolve({ ...item, convertedBlob: blob, convertedUrl: url });
          },
          selectedFormat.mime,
          selectedFormat.mime === "image/png" ? undefined : quality
        );
      };

      img.onerror = reject;
      img.src = item.preview;
    });

  const convertAll = async () => {
    if (!files.length) {
      showToast("error", t.uploadFirst);
      return;
    }

    setLoading(true);

    try {
      files.forEach((item) => {
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      });

      const converted = await Promise.all(files.map(convertOne));
      setFiles(converted);
      showToast("success", t.convertedSuccess);
    } catch {
      showToast("error", t.convertError);
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    const convertedFiles = files.filter((item) => item.convertedBlob);

    if (!convertedFiles.length) {
      showToast("error", t.convertFirst);
      return;
    }

    convertedFiles.forEach((item, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = item.convertedUrl;
        link.download = `Convert Wala_${cleanName(item.name)}.${selectedFormat.ext}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, index * 250);
    });

    showToast("success", t.downloadStarted);
  };

  const clearAll = () => {
    files.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });

    setFiles([]);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="bulk image converter, image converter, convert images online, jpg to png, png to webp, jpg to webp, multiple image converter, batch image converter"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/bulk-image-converter" />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertwala.com/bulk-image-converter" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Bulk Image Converter",
            url: "https://www.convertwala.com/bulk-image-converter",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "All",
            description: t.seoDesc,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <main className={`bulk-img-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`bulk-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="bulk-hero">
          <div className="bulk-hero-badge">
            <Images />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>

          <div className="bulk-feature-row">
            <div>
              <ShieldCheck />
              <strong>{t.secure}</strong>
              <span>{t.secureDesc}</span>
            </div>

            <div>
              <Sparkles />
              <strong>{t.qualityCard}</strong>
              <span>{t.qualityDesc}</span>
            </div>

            <div>
              <RefreshCcw />
              <strong>{t.fast}</strong>
              <span>{t.fastDesc}</span>
            </div>
          </div>
        </section>

        <section className="bulk-panel">
          <label className="bulk-upload">
            <input type="file" accept="image/*" multiple onChange={handleUpload} />

            <span>
              <UploadCloud />
            </span>

            <strong>{t.uploadTitle}</strong>
            <small>{t.uploadDesc}</small>
          </label>

          <div className="bulk-settings">
            <div className="bulk-control">
              <label>{t.convertTo}</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                {formats.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {format !== "png" && (
              <div className="bulk-control">
                <label>
                  {t.quality}: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.85"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
              </div>
            )}

            <button onClick={convertAll} disabled={loading || !files.length}>
              <RefreshCcw />
              {loading ? t.converting : t.convertAll}
            </button>

            <button
              onClick={downloadAll}
              disabled={!files.some((file) => file.convertedBlob)}
            >
              <Download />
              {t.downloadAll}
            </button>

            <button onClick={clearAll} disabled={!files.length} className="danger">
              <Trash2 />
              {t.clear}
            </button>
          </div>
        </section>

        {!files.length ? (
          <section className="bulk-empty">
            <Images />
            <h3>{t.noImage}</h3>
            <p>{t.noImageDesc}</p>
          </section>
        ) : (
          <section className="bulk-grid">
            {files.map((item) => (
              <div className="bulk-card" key={item.id}>
                <div className="bulk-img-wrap">
                  <img src={item.convertedUrl || item.preview} alt={item.name} />
                </div>

                <div className="bulk-card-body">
                  <strong>{item.name}</strong>

                  <small>
                    {t.original}: {formatBytes(item.size)}
                  </small>

                  {item.convertedBlob && (
                    <small className="success-text">
                      {t.converted}: {formatBytes(item.convertedBlob.size)}
                    </small>
                  )}
                </div>

                <button className="bulk-remove" onClick={() => removeFile(item.id)}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}