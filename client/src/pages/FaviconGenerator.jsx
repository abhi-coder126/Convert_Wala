import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  BadgeIcon,
  RefreshCcw,
  Image as ImageIcon,
} from "lucide-react";
import "../styles/FaviconGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const faviconSizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];

const pageText = {
  en: {
    seoTitle: "Favicon Generator Online Free | Create Website Favicons",
    seoDesc:
      "Generate favicon icons from image online for free. Upload logo or image and download favicon sizes for website, browser tab and app icons.",
    eyebrow: "Convert Wala Image Tool",
    title: "Favicon Generator",
    subtitle:
      "Upload your logo or image and generate multiple favicon sizes for website browser tab, app icons and PWA use.",
    workTitle: "What does this tool do?",
    workDesc:
      "This tool converts your image or logo into favicon PNG sizes like 16x16, 32x32, 180x180, 192x192 and 512x512 for websites and apps.",
    uploadTitle: "Upload Logo / Image",
    uploadDesc: "Use a square logo for best favicon result.",
    generate: "Generate Favicons",
    downloadAll: "Download All",
    clear: "Clear",
    preview: "Generated Favicons",
    empty: "Upload image and generate favicon icons.",
    uploadError: "Please upload a valid image file.",
    uploaded: "Image uploaded successfully.",
    generated: "Favicons generated successfully.",
    generateFirst: "Please generate favicons first.",
  },
  hi: {
    seoTitle: "Favicon Generator Online Free | Website Favicon बनाएं",
    seoDesc:
      "Image से free online favicon icons generate करें। Logo upload करें और website, browser tab और app icons के favicon sizes download करें।",
    eyebrow: "Convert Wala इमेज टूल",
    title: "Favicon Generator",
    subtitle:
      "Logo या image upload करें और website browser tab, app icons और PWA के लिए multiple favicon sizes generate करें।",
    workTitle: "यह tool क्या करता है?",
    workDesc:
      "यह आपकी image या logo को 16x16, 32x32, 180x180, 192x192 और 512x512 favicon PNG sizes में convert करता है।",
    uploadTitle: "Logo / Image Upload करें",
    uploadDesc: "Best favicon result के लिए square logo use करें।",
    generate: "Favicons Generate करें",
    downloadAll: "Download All",
    clear: "Clear",
    preview: "Generated Favicons",
    empty: "Favicon icons generate करने के लिए image upload करें।",
    uploadError: "कृपया valid image file upload करें।",
    uploaded: "Image successfully upload हो गई।",
    generated: "Favicons successfully generate हो गए।",
    generateFirst: "कृपया पहले favicons generate करें।",
  },
  hinglish: {
    seoTitle: "Favicon Generator Online Free | Create Website Favicons",
    seoDesc:
      "Image se free online favicon icons generate karo. Logo upload karo aur website, browser tab aur app icons ke favicon sizes download karo.",
    eyebrow: "Convert Wala Image Tool",
    title: "Favicon Generator",
    subtitle:
      "Logo ya image upload karo aur website browser tab, app icons aur PWA ke liye multiple favicon sizes generate karo.",
    workTitle: "Ye tool kya kaam karta hai?",
    workDesc:
      "Ye image/logo ko 16x16, 32x32, 180x180, 192x192 aur 512x512 favicon PNG sizes me convert karta hai.",
    uploadTitle: "Logo / Image Upload Karo",
    uploadDesc: "Best favicon result ke liye square logo use karo.",
    generate: "Generate Favicons",
    downloadAll: "Download All",
    clear: "Clear",
    preview: "Generated Favicons",
    empty: "Favicon icons generate karne ke liye image upload karo.",
    uploadError: "Please valid image file upload karo.",
    uploaded: "Image successfully upload ho gayi.",
    generated: "Favicons successfully generate ho gaye.",
    generateFirst: "Please pehle favicons generate karo.",
  },
};

export default function FaviconGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [favicons, setFavicons] = useState([]);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const hasFavicons = useMemo(() => favicons.length > 0, [favicons]);

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

  const clearGenerated = () => {
    favicons.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    setFavicons([]);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      showToast("error", t.uploadError);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    clearGenerated();

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    showToast("success", t.uploaded);
    e.target.value = "";
  };

  const generateFavicons = () => {
    if (!previewUrl) {
      showToast("error", t.uploadError);
      return;
    }

    const img = new Image();

    img.onload = async () => {
      clearGenerated();

      const generated = faviconSizes
        .map((size) => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          const sourceSize = Math.min(img.naturalWidth, img.naturalHeight);
          const sx = (img.naturalWidth - sourceSize) / 2;
          const sy = (img.naturalHeight - sourceSize) / 2;

          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, size, size);

          const dataUrl = canvas.toDataURL("image/png", 1);

          return {
            size,
            dataUrl,
            url: dataUrl,
            name: `favicon-${size}x${size}.png`,
          };
        });

      setFavicons(generated);
      showToast("success", t.generated);
    };

    img.src = previewUrl;
  };

  const downloadOne = (item) => {
    const link = document.createElement("a");
    link.href = item.dataUrl;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadAll = () => {
    if (!favicons.length) {
      showToast("error", t.generateFirst);
      return;
    }

    favicons.forEach((item, index) => {
      setTimeout(() => downloadOne(item), index * 200);
    });
  };

  const clearTool = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    clearGenerated();

    setImageFile(null);
    setPreviewUrl("");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="favicon generator, logo to favicon, website favicon, favicon maker, app icon generator, browser icon generator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/favicon-generator" />
      </Helmet>

      <main className={`favicon-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`favicon-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="favicon-hero">
          <div className="favicon-badge">
            <BadgeIcon />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="favicon-info">
          <ImageIcon />
          <div>
            <h3>{t.workTitle}</h3>
            <p>{t.workDesc}</p>
          </div>
        </section>

        <section className="favicon-shell">
          <div className="favicon-left">
            <label className="favicon-upload">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            {previewUrl && (
              <div className="favicon-source">
                <img src={previewUrl} alt="Source Preview" />
                <strong>{imageFile?.name}</strong>
              </div>
            )}

            <div className="favicon-actions">
              <button onClick={generateFavicons} disabled={!previewUrl}>
                <RefreshCcw />
                {t.generate}
              </button>

              <button onClick={downloadAll} disabled={!hasFavicons}>
                <Download />
                {t.downloadAll}
              </button>

              <button onClick={clearTool} disabled={!previewUrl} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="favicon-preview-card">
            <div className="favicon-card-head">
              <h3>{t.preview}</h3>
              <span>{favicons.length} sizes</span>
            </div>

            {favicons.length ? (
              <div className="favicon-grid">
                {favicons.map((item) => (
                  <div className="favicon-item" key={item.size}>
                    <div className="favicon-img-box">
                      <img src={item.dataUrl} alt={item.name} />
                    </div>

                    <strong>
                      {item.size} × {item.size}
                    </strong>

                    <button onClick={() => downloadOne(item)}>
                      <Download />
                      PNG
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="favicon-empty">
                <BadgeIcon />
                <p>{t.empty}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}