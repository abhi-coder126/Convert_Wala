import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  Copy,
  Trash2,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "../styles/QRCodeGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "QR Code Generator Online Free | Create High Quality QR",
    seoDesc:
      "Generate high quality QR codes online for free. Create QR code for URL, text, email, phone, WhatsApp and download PNG.",
    eyebrow: "Convert Wala Generator Tool",
    title: "QR Code Generator",
    subtitle:
      "Create high-quality QR codes for links, text, email, phone numbers, WhatsApp and more.",
    workTitle: "What does this tool do?",
    workDesc:
      "This tool converts your text, URL or contact info into a scannable QR code. You can download it as high-quality PNG.",
    inputLabel: "Enter Text / URL",
    placeholder: "https://example.com",
    size: "QR Size",
    fgColor: "QR Color",
    bgColor: "Background",
    generate: "Generate QR",
    download: "Download PNG",
    copy: "Copy Text",
    clear: "Clear",
    preview: "QR Preview",
    empty: "Enter text or URL and generate QR code.",
    generated: "QR code generated successfully.",
    copied: "Text copied successfully.",
    inputError: "Please enter text or URL first.",
  },
  hi: {
    seoTitle: "QR Code Generator Online Free | High Quality QR बनाएं",
    seoDesc:
      "Free online high quality QR code generate करें। URL, text, email, phone और WhatsApp के लिए QR code बनाएं।",
    eyebrow: "Convert Wala Generator Tool",
    title: "QR Code Generator",
    subtitle:
      "Links, text, email, phone numbers, WhatsApp और अन्य चीजों के लिए high-quality QR code बनाएं।",
    workTitle: "यह tool क्या करता है?",
    workDesc:
      "यह tool आपके text, URL या contact info को scannable QR code में convert करता है। आप इसे high-quality PNG में download कर सकते हैं।",
    inputLabel: "Text / URL डालें",
    placeholder: "https://example.com",
    size: "QR Size",
    fgColor: "QR Color",
    bgColor: "Background",
    generate: "QR Generate करें",
    download: "Download PNG",
    copy: "Copy Text",
    clear: "Clear",
    preview: "QR Preview",
    empty: "Text या URL डालें और QR code generate करें।",
    generated: "QR code successfully generate हो गया।",
    copied: "Text successfully copy हो गया।",
    inputError: "कृपया पहले text या URL डालें।",
  },
  hinglish: {
    seoTitle: "QR Code Generator Online Free | Create High Quality QR",
    seoDesc:
      "Free online high quality QR code generate karo. URL, text, email, phone aur WhatsApp ke liye QR code banao.",
    eyebrow: "Convert Wala Generator Tool",
    title: "QR Code Generator",
    subtitle:
      "Links, text, email, phone numbers, WhatsApp aur more ke liye high-quality QR code banao.",
    workTitle: "Ye tool kya kaam karta hai?",
    workDesc:
      "Ye tool text, URL ya contact info ko scannable QR code me convert karta hai. Aap isko high-quality PNG me download kar sakte ho.",
    inputLabel: "Text / URL Enter Karo",
    placeholder: "https://example.com",
    size: "QR Size",
    fgColor: "QR Color",
    bgColor: "Background",
    generate: "Generate QR",
    download: "Download PNG",
    copy: "Copy Text",
    clear: "Clear",
    preview: "QR Preview",
    empty: "Text ya URL enter karo aur QR code generate karo.",
    generated: "QR code successfully generate ho gaya.",
    copied: "Text successfully copy ho gaya.",
    inputError: "Please pehle text ya URL enter karo.",
  },
};

export default function QRCodeGenerator() {
  const canvasRef = useRef(null);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState(1024);
  const [fgColor, setFgColor] = useState("#111827");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isGenerated, setIsGenerated] = useState(false);
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

  const generateQRCode = async () => {
    if (!qrText.trim()) {
      showToast("error", t.inputError);
      return;
    }

    try {
      await QRCode.toCanvas(canvasRef.current, qrText.trim(), {
        width: qrSize,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      setIsGenerated(true);
      showToast("success", t.generated);
    } catch {
      showToast("error", "QR generation failed.");
    }
  };

  const downloadQRCode = () => {
    if (!isGenerated || !canvasRef.current) {
      showToast("error", t.inputError);
      return;
    }

    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png", 1);
    link.download = "Convert Wala_qr_code.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const copyText = async () => {
    if (!qrText.trim()) {
      showToast("error", t.inputError);
      return;
    }

    await navigator.clipboard.writeText(qrText);
    showToast("success", t.copied);
  };

  const clearTool = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setQrText("");
    setQrSize(1024);
    setFgColor("#111827");
    setBgColor("#ffffff");
    setIsGenerated(false);
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="qr code generator, free qr code, high quality qr code, url qr code, text qr code, whatsapp qr code, qr maker"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/qr-code-generator" />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertwala.com/qr-code-generator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "QR Code Generator",
            url: "https://www.convertwala.com/qr-code-generator",
            applicationCategory: "UtilityApplication",
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

      <main className={`qr-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`qr-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="qr-hero">
          <div className="qr-badge">
            <QrCode />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="qr-info">
          <QrCode />
          <div>
            <h3>{t.workTitle}</h3>
            <p>{t.workDesc}</p>
          </div>
        </section>

        <section className="qr-shell">
          <div className="qr-controls-card">
            <div className="qr-control">
              <label>{t.inputLabel}</label>
              <textarea
                value={qrText}
                onChange={(e) => {
                  setQrText(e.target.value);
                  setIsGenerated(false);
                }}
                placeholder={t.placeholder}
              />
            </div>

            <div className="qr-control">
              <label>
                {t.size}: {qrSize}px
              </label>
              <input
                type="range"
                min="512"
                max="2048"
                step="128"
                value={qrSize}
                onChange={(e) => {
                  setQrSize(Number(e.target.value));
                  setIsGenerated(false);
                }}
              />
            </div>

            <div className="qr-color-grid">
              <div className="qr-control">
                <label>{t.fgColor}</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    setFgColor(e.target.value);
                    setIsGenerated(false);
                  }}
                />
              </div>

              <div className="qr-control">
                <label>{t.bgColor}</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setIsGenerated(false);
                  }}
                />
              </div>
            </div>

            <div className="qr-actions">
              <button onClick={generateQRCode}>
                <RefreshCcw />
                {t.generate}
              </button>

              <button onClick={downloadQRCode} disabled={!isGenerated}>
                <Download />
                {t.download}
              </button>

              <button onClick={copyText} disabled={!qrText.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={clearTool} className="danger">
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          <div className="qr-preview-card">
            <div className="qr-preview-head">
              <h3>{t.preview}</h3>
              <span>{qrSize}px PNG</span>
            </div>

            <div className="qr-preview-box">
              <canvas ref={canvasRef} />

              {!isGenerated && (
                <div className="qr-empty">
                  <QrCode />
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