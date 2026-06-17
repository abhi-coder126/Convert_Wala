import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Image as ImageIcon,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Code2,
  RefreshCcw,
} from "lucide-react";
import "../styles/Base64ToImage.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const formats = [
  { label: "PNG", value: "png", mime: "image/png", ext: "png" },
  { label: "JPG", value: "jpg", mime: "image/jpeg", ext: "jpg" },
  { label: "WEBP", value: "webp", mime: "image/webp", ext: "webp" },
];

const pageText = {
  en: {
    seoTitle: "Base64 to Image Converter Online Free",
    seoDesc:
      "Convert Base64 Data URL to image online for free. Paste Base64 code, preview image and download as PNG, JPG or WEBP.",
    eyebrow: "Convert Wala Image Tool",
    title: "Base64 to Image Converter",
    subtitle:
      "Paste Base64 image code, preview it instantly and download it as PNG, JPG or WEBP.",
    workTitle: "What does this tool do?",
    workDesc:
      "This tool converts Base64/Data URL text back into an image. It is useful when you receive image data from APIs, JSON, HTML img src or database text.",
    input: "Paste Base64 / Data URL",
    placeholder: "Paste Base64 code here...",
    format: "Download Format",
    convert: "Convert to Image",
    download: "Download Image",
    clear: "Clear",
    preview: "Preview",
    empty: "Paste Base64 code to generate image preview.",
    invalid: "Please paste a valid Base64 image code.",
    success: "Base64 converted to image successfully.",
    downloadFirst: "Please convert Base64 first.",
  },
  hi: {
    seoTitle: "Base64 to Image Converter Online Free",
    seoDesc:
      "Base64 Data URL को free online image में convert करें। Base64 code paste करें, preview देखें और PNG, JPG या WEBP download करें।",
    eyebrow: "Convert Wala इमेज टूल",
    title: "Base64 to Image Converter",
    subtitle:
      "Base64 image code paste करें, image preview देखें और PNG, JPG या WEBP में download करें।",
    workTitle: "यह tool क्या करता है?",
    workDesc:
      "यह Base64/Data URL text को वापस image में convert करता है। APIs, JSON, HTML img src या database text से मिले image data को image file बनाने में useful है।",
    input: "Base64 / Data URL Paste करें",
    placeholder: "Base64 code यहां paste करें...",
    format: "Download Format",
    convert: "Image में Convert करें",
    download: "Download Image",
    clear: "Clear",
    preview: "Preview",
    empty: "Image preview बनाने के लिए Base64 code paste करें।",
    invalid: "कृपया valid Base64 image code paste करें।",
    success: "Base64 successfully image में convert हो गया।",
    downloadFirst: "कृपया पहले Base64 convert करें।",
  },
  hinglish: {
    seoTitle: "Base64 to Image Converter Online Free",
    seoDesc:
      "Base64 Data URL ko free online image me convert karo. Base64 code paste karo, preview dekho aur PNG, JPG ya WEBP download karo.",
    eyebrow: "Convert Wala Image Tool",
    title: "Base64 to Image Converter",
    subtitle:
      "Base64 image code paste karo, image preview dekho aur PNG, JPG ya WEBP me download karo.",
    workTitle: "Ye tool kya kaam karta hai?",
    workDesc:
      "Ye Base64/Data URL text ko wapas image me convert karta hai. APIs, JSON, HTML img src ya database text se mile image data ko image file banane me useful hai.",
    input: "Base64 / Data URL Paste Karo",
    placeholder: "Base64 code yaha paste karo...",
    format: "Download Format",
    convert: "Convert to Image",
    download: "Download Image",
    clear: "Clear",
    preview: "Preview",
    empty: "Image preview generate karne ke liye Base64 code paste karo.",
    invalid: "Please valid Base64 image code paste karo.",
    success: "Base64 successfully image me convert ho gaya.",
    downloadFirst: "Please pehle Base64 convert karo.",
  },
};

export default function Base64ToImage() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [base64, setBase64] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [format, setFormat] = useState("png");
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

  const selectedFormat =
    formats.find((item) => item.value === format) || formats[0];

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const normalizeBase64 = (value) => {
    const cleanValue = value.trim();

    if (!cleanValue) return "";

    if (cleanValue.startsWith("data:image/")) {
      return cleanValue;
    }

    return `data:image/png;base64,${cleanValue}`;
  };

  const convertBase64ToImage = () => {
    const dataUrl = normalizeBase64(base64);

    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      showToast("error", t.invalid);
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImageUrl(dataUrl);
      showToast("success", t.success);
    };

    img.onerror = () => {
      setImageUrl("");
      showToast("error", t.invalid);
    };

    img.src = dataUrl;
  };

  const downloadImage = () => {
    if (!imageUrl) {
      showToast("error", t.downloadFirst);
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (selectedFormat.mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download = `Convert Wala_base64_image.${selectedFormat.ext}`;

          document.body.appendChild(link);
          link.click();
          link.remove();

          URL.revokeObjectURL(url);
        },
        selectedFormat.mime,
        selectedFormat.mime === "image/png" ? undefined : 1
      );
    };

    img.src = imageUrl;
  };

  const clearTool = () => {
    setBase64("");
    setImageUrl("");
    setFormat("png");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="base64 to image, base64 image converter, data url to image, convert base64 to png, base64 to jpg, base64 decoder image"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/base64-to-image" />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertwala.com/base64-to-image" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Base64 to Image Converter",
            url: "https://www.convertwala.com/base64-to-image",
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

      <main className={`b64-img-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`b64-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="b64-hero">
          <div className="b64-badge">
            <Code2 />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="b64-info">
          <ImageIcon />
          <div>
            <h3>{t.workTitle}</h3>
            <p>{t.workDesc}</p>
          </div>
        </section>

        <section className="b64-shell">
          <div className="b64-input-card">
            <div className="b64-card-head">
              <h3>{t.input}</h3>
              <span>{base64.length} chars</span>
            </div>

            <textarea
              value={base64}
              onChange={(e) => {
                setBase64(e.target.value);
                setImageUrl("");
              }}
              placeholder={t.placeholder}
            />

            <div className="b64-control-row">
              <div>
                <label>{t.format}</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  {formats.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={convertBase64ToImage} disabled={!base64.trim()}>
                <RefreshCcw />
                {t.convert}
              </button>

              <button onClick={downloadImage} disabled={!imageUrl}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!base64 && !imageUrl} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="b64-preview-card">
            <div className="b64-card-head">
              <h3>{t.preview}</h3>
              <span>{imageUrl ? selectedFormat.label : "Image"}</span>
            </div>

            <div className="b64-preview-box">
              {imageUrl ? (
                <img src={imageUrl} alt="Base64 Preview" />
              ) : (
                <div className="b64-empty">
                  <ImageIcon />
                  <p>{t.empty}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}