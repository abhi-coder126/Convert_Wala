import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Download,
  Type,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  AlertCircle,
  Droplets,
} from "lucide-react";
import "../styles/ImageWatermark.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Image Watermark Online Free | Add Text Watermark",
    seoDesc:
      "Add watermark to images online for free. Upload image, add text watermark, adjust opacity, position and download high quality PNG.",
    eyebrow: "Convert Wala Image Tool",
    title: "Image Watermark",
    subtitle:
      "Upload image, add custom text watermark, adjust opacity and download high-quality image instantly.",
    uploadTitle: "Upload Image",
    uploadDesc: "Supports JPG, PNG, JPEG, WEBP and more.",
    watermarkText: "Watermark Text",
    fontSize: "Font Size",
    opacity: "Opacity",
    position: "Position",
    color: "Text Color",
    create: "Create Watermark",
    download: "Download PNG",
    reset: "Reset",
    preview: "Preview",
    empty: "Upload image to add watermark.",
    uploadError: "Please upload a valid image file.",
    uploaded: "Image uploaded successfully.",
    downloadFirst: "Please create watermark first.",
  },
  hi: {
    seoTitle: "Image Watermark Online Free | Text Watermark जोड़ें",
    seoDesc:
      "Images में free online watermark add करें। Text watermark, opacity, position adjust करें और high quality PNG download करें।",
    eyebrow: "Convert Wala इमेज टूल",
    title: "Image Watermark",
    subtitle:
      "Image upload करें, custom text watermark add करें, opacity adjust करें और high-quality image download करें।",
    uploadTitle: "Image Upload करें",
    uploadDesc: "JPG, PNG, JPEG, WEBP और अन्य formats support हैं।",
    watermarkText: "Watermark Text",
    fontSize: "Font Size",
    opacity: "Opacity",
    position: "Position",
    color: "Text Color",
    create: "Watermark बनाएं",
    download: "Download PNG",
    reset: "Reset",
    preview: "Preview",
    empty: "Watermark add करने के लिए image upload करें।",
    uploadError: "कृपया valid image file upload करें।",
    uploaded: "Image successfully upload हो गई।",
    downloadFirst: "कृपया पहले watermark बनाएं।",
  },
  hinglish: {
    seoTitle: "Image Watermark Online Free | Add Text Watermark",
    seoDesc:
      "Images me free online watermark add karo. Text watermark, opacity, position adjust karo aur high quality PNG download karo.",
    eyebrow: "Convert Wala Image Tool",
    title: "Image Watermark",
    subtitle:
      "Image upload karo, custom text watermark add karo, opacity adjust karo aur high-quality image instantly download karo.",
    uploadTitle: "Image Upload Karo",
    uploadDesc: "JPG, PNG, JPEG, WEBP aur more formats support karta hai.",
    watermarkText: "Watermark Text",
    fontSize: "Font Size",
    opacity: "Opacity",
    position: "Position",
    color: "Text Color",
    create: "Create Watermark",
    download: "Download PNG",
    reset: "Reset",
    preview: "Preview",
    empty: "Watermark add karne ke liye image upload karo.",
    uploadError: "Please valid image file upload karo.",
    uploaded: "Image successfully upload ho gayi.",
    downloadFirst: "Please pehle watermark create karo.",
  },
};

const cleanName = (name = "image") =>
  name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");

export default function ImageWatermark() {
  const canvasRef = useRef(null);

  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [watermarkText, setWatermarkText] = useState("Convert Wala");
  const [fontSize, setFontSize] = useState(54);
  const [opacity, setOpacity] = useState(0.35);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState("bottom-right");
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

  const revokeResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      showToast("error", t.uploadError);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl("");
    showToast("success", t.uploaded);
    e.target.value = "";
  };

  const getTextPosition = (ctx, canvas, text) => {
    const padding = Math.max(canvas.width * 0.04, 40);
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    const map = {
      "top-left": [padding, padding + textHeight],
      "top-center": [(canvas.width - textWidth) / 2, padding + textHeight],
      "top-right": [canvas.width - textWidth - padding, padding + textHeight],
      center: [(canvas.width - textWidth) / 2, canvas.height / 2],
      "bottom-left": [padding, canvas.height - padding],
      "bottom-center": [(canvas.width - textWidth) / 2, canvas.height - padding],
      "bottom-right": [canvas.width - textWidth - padding, canvas.height - padding],
    };

    return map[position] || map["bottom-right"];
  };

  const createWatermark = () => {
    if (!previewUrl) {
      showToast("error", t.uploadError);
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const finalFontSize = Math.max(fontSize, Math.round(canvas.width * 0.035));
      ctx.font = `900 ${finalFontSize}px Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const [x, y] = getTextPosition(ctx, canvas, watermarkText || "Watermark");
      ctx.fillText(watermarkText || "Watermark", x, y);

      ctx.globalAlpha = 1;
      ctx.shadowColor = "transparent";

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          revokeResult();
          setResultUrl(URL.createObjectURL(blob));
          showToast("success", "Watermark created successfully.");
        },
        "image/png",
        1
      );
    };

    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!resultUrl) {
      showToast("error", t.downloadFirst);
      return;
    }

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `Convert Wala_${cleanName(imageFile?.name || "watermark")}_watermark.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resetTool = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setImageFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setWatermarkText("Convert Wala");
    setFontSize(54);
    setOpacity(0.35);
    setColor("#ffffff");
    setPosition("bottom-right");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="image watermark, add watermark to image, text watermark, watermark photo online, image editor, photo watermark"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/image-watermark" />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertwala.com/image-watermark" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />
      </Helmet>

      <main className={`watermark-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`watermark-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <canvas ref={canvasRef} hidden />

        <section className="watermark-hero">
          <div className="watermark-badge">
            <Droplets />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="watermark-shell">
          <div className="watermark-left">
            <label className="watermark-upload">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            <div className="watermark-controls">
              <div className="watermark-control">
                <label>{t.watermarkText}</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => {
                    setWatermarkText(e.target.value);
                    revokeResult();
                  }}
                  placeholder="Enter watermark text"
                />
              </div>

              <div className="watermark-control">
                <label>{t.position}</label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    revokeResult();
                  }}
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="center">Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              <div className="watermark-control">
                <label>
                  {t.fontSize}: {fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="160"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    revokeResult();
                  }}
                />
              </div>

              <div className="watermark-control">
                <label>
                  {t.opacity}: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(Number(e.target.value));
                    revokeResult();
                  }}
                />
              </div>

              <div className="watermark-control">
                <label>{t.color}</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    revokeResult();
                  }}
                />
              </div>

              <button onClick={createWatermark} disabled={!previewUrl}>
                <Type />
                {t.create}
              </button>

              <button onClick={downloadImage} disabled={!resultUrl}>
                <Download />
                {t.download}
              </button>

              <button onClick={resetTool} disabled={!previewUrl} className="danger">
                <Trash2 />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="watermark-preview-card">
            <div className="watermark-preview-head">
              <h3>{t.preview}</h3>
              <span>PNG</span>
            </div>

            <div className="watermark-preview-box">
              {previewUrl ? (
                <img src={resultUrl || previewUrl} alt="Watermark Preview" />
              ) : (
                <div className="watermark-empty">
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