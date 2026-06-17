import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
  Pipette,
  Palette,
} from "lucide-react";
import "../styles/ColorPickerFromImage.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Color Picker from Image Online Free | Image Color Picker",
    seoDesc:
      "Pick color from image online for free. Upload image, click any pixel and get HEX, RGB and HSL color codes instantly.",
    eyebrow: "Convert Wala Image Tool",
    title: "Color Picker from Image",
    subtitle:
      "Upload an image and click anywhere to pick exact color codes in HEX, RGB and HSL.",
    workTitle: "What does this tool do?",
    workDesc:
      "This tool reads the clicked pixel color from your uploaded image and shows HEX, RGB and HSL values. Useful for designers, developers, branding and UI work.",
    uploadTitle: "Upload Image",
    uploadDesc: "Supports JPG, PNG, JPEG, WEBP and more.",
    preview: "Click Image to Pick Color",
    pickedColor: "Picked Color",
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    copy: "Copy",
    clear: "Clear",
    empty: "Upload image and click on any color.",
    copied: "Color copied successfully.",
    uploadError: "Please upload a valid image file.",
    uploaded: "Image uploaded successfully.",
    pickFirst: "Please click image to pick color.",
  },
  hi: {
    seoTitle: "Color Picker from Image Online Free | Image Color Picker",
    seoDesc:
      "Image से color pick करें। Image upload करें, किसी भी pixel पर click करें और HEX, RGB, HSL color codes पाएं।",
    eyebrow: "Convert Wala इमेज टूल",
    title: "Color Picker from Image",
    subtitle:
      "Image upload करें और कहीं भी click करके exact HEX, RGB और HSL color code पाएं।",
    workTitle: "यह tool क्या करता है?",
    workDesc:
      "यह tool uploaded image के clicked pixel का color read करता है और HEX, RGB, HSL values दिखाता है। Designers, developers और branding work के लिए useful है।",
    uploadTitle: "Image Upload करें",
    uploadDesc: "JPG, PNG, JPEG, WEBP और अन्य formats support हैं।",
    preview: "Color Pick करने के लिए Image पर Click करें",
    pickedColor: "Picked Color",
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    copy: "Copy",
    clear: "Clear",
    empty: "Image upload करें और किसी भी color पर click करें।",
    copied: "Color successfully copy हो गया।",
    uploadError: "कृपया valid image file upload करें।",
    uploaded: "Image successfully upload हो गई।",
    pickFirst: "कृपया color pick करने के लिए image पर click करें।",
  },
  hinglish: {
    seoTitle: "Color Picker from Image Online Free | Image Color Picker",
    seoDesc:
      "Image se color pick karo. Image upload karo, kisi bhi pixel par click karo aur HEX, RGB, HSL color codes pao.",
    eyebrow: "Convert Wala Image Tool",
    title: "Color Picker from Image",
    subtitle:
      "Image upload karo aur kahi bhi click karke exact HEX, RGB aur HSL color code pao.",
    workTitle: "Ye tool kya kaam karta hai?",
    workDesc:
      "Ye uploaded image ke clicked pixel ka color read karta hai aur HEX, RGB, HSL values show karta hai. Designers, developers aur branding work ke liye useful hai.",
    uploadTitle: "Image Upload Karo",
    uploadDesc: "JPG, PNG, JPEG, WEBP aur more formats support karta hai.",
    preview: "Color Pick Karne ke Liye Image Par Click Karo",
    pickedColor: "Picked Color",
    hex: "HEX",
    rgb: "RGB",
    hsl: "HSL",
    copy: "Copy",
    clear: "Clear",
    empty: "Image upload karo aur kisi bhi color par click karo.",
    copied: "Color successfully copy ho gaya.",
    uploadError: "Please valid image file upload karo.",
    uploaded: "Image successfully upload ho gayi.",
    pickFirst: "Please color pick karne ke liye image par click karo.",
  },
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;

    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
};

export default function ColorPickerFromImage() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [pickedColor, setPickedColor] = useState(null);
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

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPickedColor(null);
    showToast("success", t.uploaded);
    e.target.value = "";
  };

  const drawImageToCanvas = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const pickColor = (e) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas) {
      showToast("error", t.pickFirst);
      return;
    }

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = pixel[3];

    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
    const hsl = rgbToHsl(r, g, b);

    setPickedColor({ hex, rgb, rgba, hsl });
  };

  const copyText = async (value) => {
    if (!value) {
      showToast("error", t.pickFirst);
      return;
    }

    await navigator.clipboard.writeText(value);
    showToast("success", t.copied);
  };

  const clearTool = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImageFile(null);
    setPreviewUrl("");
    setPickedColor(null);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="color picker from image, image color picker, pick color from image, hex color picker, rgb color picker, hsl color picker"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/color-picker-from-image"
        />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.convertwala.com/color-picker-from-image"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Color Picker from Image",
            url: "https://www.convertwala.com/color-picker-from-image",
            applicationCategory: "DesignApplication",
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

      <main className={`color-picker-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`color-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <canvas ref={canvasRef} hidden />

        <section className="color-hero">
          <div className="color-badge">
            <Pipette />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="color-info">
          <Palette />
          <div>
            <h3>{t.workTitle}</h3>
            <p>{t.workDesc}</p>
          </div>
        </section>

        <section className="color-shell">
          <div className="color-left">
            <label className="color-upload">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <span>
                <UploadCloud />
              </span>
              <strong>{t.uploadTitle}</strong>
              <small>{t.uploadDesc}</small>
            </label>

            <div className="color-result-card">
              <div className="color-card-head">
                <h3>{t.pickedColor}</h3>
                <button onClick={clearTool} disabled={!previewUrl}>
                  <Trash2 />
                  {t.clear}
                </button>
              </div>

              {pickedColor ? (
                <div className="color-result-body">
                  <div
                    className="color-swatch"
                    style={{ background: pickedColor.hex }}
                  />

                  <div className="color-code-row">
                    <span>{t.hex}</span>
                    <strong>{pickedColor.hex}</strong>
                    <button onClick={() => copyText(pickedColor.hex)}>
                      <Copy />
                    </button>
                  </div>

                  <div className="color-code-row">
                    <span>{t.rgb}</span>
                    <strong>{pickedColor.rgb}</strong>
                    <button onClick={() => copyText(pickedColor.rgb)}>
                      <Copy />
                    </button>
                  </div>

                  <div className="color-code-row">
                    <span>RGBA</span>
                    <strong>{pickedColor.rgba}</strong>
                    <button onClick={() => copyText(pickedColor.rgba)}>
                      <Copy />
                    </button>
                  </div>

                  <div className="color-code-row">
                    <span>{t.hsl}</span>
                    <strong>{pickedColor.hsl}</strong>
                    <button onClick={() => copyText(pickedColor.hsl)}>
                      <Copy />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="color-empty-small">
                  <Pipette />
                  <p>{t.empty}</p>
                </div>
              )}
            </div>
          </div>

          <div className="color-preview-card">
            <div className="color-card-head">
              <h3>{t.preview}</h3>
              <span>{imageFile?.name || "Image"}</span>
            </div>

            <div className="color-preview-box">
              {previewUrl ? (
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Color Picker Preview"
                  onLoad={drawImageToCanvas}
                  onClick={pickColor}
                />
              ) : (
                <div className="color-empty">
                  <Pipette />
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