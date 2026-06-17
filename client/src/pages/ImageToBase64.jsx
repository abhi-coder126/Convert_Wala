import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Code2,
  FileText,
} from "lucide-react";
import "../styles/ImageToBase64.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Image to Base64 Converter Online Free",
    seoDesc:
      "Convert images to Base64 Data URL online for free. Upload JPG, PNG, WEBP or JPEG and copy Base64 code instantly.",
    eyebrow: "Convert Wala Image Tool",
    title: "Image to Base64 Converter",
    subtitle:
      "Convert your image into Base64 text format. Useful for HTML, CSS, JSON, API payloads and embedding images without separate files.",
    uploadTitle: "Upload Image",
    uploadDesc: "Supports JPG, PNG, JPEG, WEBP and more.",
    workTitle: "What does this tool do?",
    workDesc:
      "It reads your image in the browser and converts it into a Base64 Data URL. You can paste this code directly inside img src, CSS background-image, JSON or API requests.",
    preview: "Preview",
    output: "Base64 Output",
    copy: "Copy Base64",
    download: "Download TXT",
    clear: "Clear",
    copied: "Base64 copied successfully.",
    uploaded: "Image converted to Base64 successfully.",
    uploadError: "Please upload a valid image file.",
    empty: "Upload image to generate Base64 code.",
  },
  hi: {
    seoTitle: "Image to Base64 Converter Online Free",
    seoDesc:
      "Images को free online Base64 Data URL में convert करें। JPG, PNG, WEBP या JPEG upload करें और Base64 code copy करें।",
    eyebrow: "Convert Wala इमेज टूल",
    title: "Image to Base64 Converter",
    subtitle:
      "Image को Base64 text format में convert करें। इसे HTML, CSS, JSON, API payload और image embed करने में use कर सकते हैं।",
    uploadTitle: "Image Upload करें",
    uploadDesc: "JPG, PNG, JPEG, WEBP और अन्य formats support हैं।",
    workTitle: "यह tool क्या करता है?",
    workDesc:
      "यह आपकी image को browser में read करके Base64 Data URL में convert करता है। इस code को img src, CSS background-image, JSON या API requests में paste कर सकते हैं।",
    preview: "Preview",
    output: "Base64 Output",
    copy: "Copy Base64",
    download: "Download TXT",
    clear: "Clear",
    copied: "Base64 successfully copy हो गया।",
    uploaded: "Image successfully Base64 में convert हो गई।",
    uploadError: "कृपया valid image file upload करें।",
    empty: "Base64 code generate करने के लिए image upload करें।",
  },
  hinglish: {
    seoTitle: "Image to Base64 Converter Online Free",
    seoDesc:
      "Images ko free online Base64 Data URL me convert karo. JPG, PNG, WEBP ya JPEG upload karo aur Base64 code copy karo.",
    eyebrow: "Convert Wala Image Tool",
    title: "Image to Base64 Converter",
    subtitle:
      "Image ko Base64 text format me convert karo. Isko HTML, CSS, JSON, API payload aur image embed karne me use kar sakte ho.",
    uploadTitle: "Image Upload Karo",
    uploadDesc: "JPG, PNG, JPEG, WEBP aur more formats support karta hai.",
    workTitle: "Ye tool kya kaam karta hai?",
    workDesc:
      "Ye image ko browser ke andar read karke Base64 Data URL me convert karta hai. Is code ko img src, CSS background-image, JSON ya API request me paste kar sakte ho.",
    preview: "Preview",
    output: "Base64 Output",
    copy: "Copy Base64",
    download: "Download TXT",
    clear: "Clear",
    copied: "Base64 successfully copy ho gaya.",
    uploaded: "Image successfully Base64 me convert ho gayi.",
    uploadError: "Please valid image file upload karo.",
    empty: "Base64 code generate karne ke liye image upload karo.",
  },
};

const cleanName = (name = "image") =>
  name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");

export default function ImageToBase64() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [base64, setBase64] = useState("");
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

  const handleUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      showToast("error", t.uploadError);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const reader = new FileReader();

    reader.onload = () => {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setBase64(reader.result);
      showToast("success", t.uploaded);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const copyBase64 = async () => {
    if (!base64) return;

    await navigator.clipboard.writeText(base64);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!base64) return;

    const blob = new Blob([base64], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `Convert Wala_${cleanName(imageFile?.name || "image")}_base64.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImageFile(null);
    setPreviewUrl("");
    setBase64("");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="image to base64, base64 image converter, convert image to base64, image data url, jpg to base64, png to base64, webp to base64"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/image-to-base64" />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertwala.com/image-to-base64" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Image to Base64 Converter",
            url: "https://www.convertwala.com/image-to-base64",
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

      <main className={`base64-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`base64-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="base64-hero">
          <div className="base64-badge">
            <Code2 />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="base64-info">
          <FileText />
          <div>
            <h3>{t.workTitle}</h3>
            <p>{t.workDesc}</p>
          </div>
        </section>

        <section className="base64-shell">
          <div className="base64-left">
            <label className="base64-upload">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            <div className="base64-preview-card">
              <h3>{t.preview}</h3>

              <div className="base64-preview-box">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" />
                ) : (
                  <p>{t.empty}</p>
                )}
              </div>
            </div>
          </div>

          <div className="base64-output-card">
            <div className="base64-output-head">
              <h3>{t.output}</h3>
              <span>{base64 ? `${base64.length} chars` : "0 chars"}</span>
            </div>

            <textarea value={base64} readOnly placeholder={t.empty} />

            <div className="base64-actions">
              <button onClick={copyBase64} disabled={!base64}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadTxt} disabled={!base64}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!base64} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}