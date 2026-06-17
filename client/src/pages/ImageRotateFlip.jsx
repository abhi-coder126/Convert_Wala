import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
    UploadCloud,
    Download,
    RotateCcw,
    RotateCw,
    FlipHorizontal,
    FlipVertical,
    Trash2,
    CheckCircle,
    AlertCircle,
    RefreshCcw,
} from "lucide-react";
import "../styles/ImageRotateFlip.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
    en: {
        seoTitle: "Image Rotate & Flip Online Free | Rotate Image Tool",
        seoDesc:
            "Rotate and flip images online for free. Upload image, rotate left or right, flip horizontal or vertical and download high quality PNG.",
        eyebrow: "Convert Wala Image Tool",
        title: "Image Rotate & Flip",
        subtitle:
            "Upload an image, rotate left/right, flip horizontal/vertical and download high-quality image instantly.",
        uploadTitle: "Upload Image",
        uploadDesc: "Supports JPG, PNG, JPEG, WEBP and more.",
        rotateLeft: "Rotate Left",
        rotateRight: "Rotate Right",
        flipH: "Flip Horizontal",
        flipV: "Flip Vertical",
        reset: "Reset",
        download: "Download PNG",
        preview: "Preview",
        empty: "Upload image to start rotate & flip.",
        uploadError: "Please upload a valid image file.",
        uploaded: "Image uploaded successfully.",
        downloadFirst: "Please upload image first.",
    },
    hi: {
        seoTitle: "Image Rotate & Flip Online Free | Rotate Image Tool",
        seoDesc:
            "Image को free में rotate और flip करें। Image upload करें, left/right rotate करें, horizontal/vertical flip करें और PNG download करें।",
        eyebrow: "Convert Wala इमेज टूल",
        title: "Image Rotate & Flip",
        subtitle:
            "Image upload करें, left/right rotate करें, horizontal/vertical flip करें और high-quality image download करें।",
        uploadTitle: "Image Upload करें",
        uploadDesc: "JPG, PNG, JPEG, WEBP और अन्य formats support हैं।",
        rotateLeft: "Left Rotate",
        rotateRight: "Right Rotate",
        flipH: "Horizontal Flip",
        flipV: "Vertical Flip",
        reset: "Reset",
        download: "Download PNG",
        preview: "Preview",
        empty: "Rotate & flip शुरू करने के लिए image upload करें।",
        uploadError: "कृपया valid image file upload करें।",
        uploaded: "Image successfully upload हो गई।",
        downloadFirst: "कृपया पहले image upload करें।",
    },
    hinglish: {
        seoTitle: "Image Rotate & Flip Online Free | Rotate Image Tool",
        seoDesc:
            "Image ko free me rotate aur flip karo. Upload karo, left/right rotate karo, horizontal/vertical flip karo aur PNG download karo.",
        eyebrow: "Convert Wala Image Tool",
        title: "Image Rotate & Flip",
        subtitle:
            "Image upload karo, left/right rotate karo, horizontal/vertical flip karo aur high-quality image instantly download karo.",
        uploadTitle: "Image Upload Karo",
        uploadDesc: "JPG, PNG, JPEG, WEBP aur more formats support karta hai.",
        rotateLeft: "Rotate Left",
        rotateRight: "Rotate Right",
        flipH: "Flip Horizontal",
        flipV: "Flip Vertical",
        reset: "Reset",
        download: "Download PNG",
        preview: "Preview",
        empty: "Rotate & flip start karne ke liye image upload karo.",
        uploadError: "Please valid image file upload karo.",
        uploaded: "Image successfully upload ho gayi.",
        downloadFirst: "Please pehle image upload karo.",
    },
};

const cleanName = (name = "image") =>
    name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");

export default function ImageRotateFlip() {
    const [language, setLanguage] = useState(
        localStorage.getItem(STORAGE_LANGUAGE) || "en"
    );
    const [theme, setTheme] = useState(
        localStorage.getItem(STORAGE_THEME) || "light"
    );

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [rotation, setRotation] = useState(0);
    const [flipX, setFlipX] = useState(1);
    const [flipY, setFlipY] = useState(1);
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
        setRotation(0);
        setFlipX(1);
        setFlipY(1);
        showToast("success", t.uploaded);
        e.target.value = "";
    };

    const resetTool = () => {
        setRotation(0);
        setFlipX(1);
        setFlipY(1);
    };

    const clearImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setImageFile(null);
        setPreviewUrl("");
        setRotation(0);
        setFlipX(1);
        setFlipY(1);
    };

    const downloadImage = () => {
        if (!previewUrl) {
            showToast("error", t.downloadFirst);
            return;
        }

        const img = new Image();

        img.onload = () => {
            const isSideways = Math.abs(rotation % 180) === 90;
            const canvas = document.createElement("canvas");

            const scaleFactor = 2;

            canvas.width = (isSideways ? img.naturalHeight : img.naturalWidth) * scaleFactor;
            canvas.height = (isSideways ? img.naturalWidth : img.naturalHeight) * scaleFactor;

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
           ctx.imageSmoothingQuality = "high";

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(flipX, flipY);
            ctx.drawImage(
                img,
                -(img.naturalWidth * scaleFactor) / 2,
                -(img.naturalHeight * scaleFactor) / 2,
                img.naturalWidth * scaleFactor,
                img.naturalHeight * scaleFactor
            );

            canvas.toBlob(
                (blob) => {
                    if (!blob) return;

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");

                    link.href = url;
                    link.download = `Convert Wala_${cleanName(
                        imageFile?.name || "rotated-image"
                    )}_rotate_flip.png`;

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    URL.revokeObjectURL(url);
                },
                "image/png",
                1
            );
        };

        img.src = previewUrl;
    };

    return (
        <>
            <Helmet>
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.seoDesc} />
                <meta
                    name="keywords"
                    content="image rotate, image flip, rotate image online, flip image online, rotate photo, flip photo, image editor"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.convertwala.com/image-rotate-flip" />

                <meta property="og:title" content={t.seoTitle} />
                <meta property="og:description" content={t.seoDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.convertwala.com/image-rotate-flip" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t.seoTitle} />
                <meta name="twitter:description" content={t.seoDesc} />
            </Helmet>

            <main className={`rotate-page ${theme === "dark" ? "dark" : "light"}`}>
                {toast && (
                    <div className={`rotate-toast ${toast.type}`}>
                        {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
                        <span>{toast.message}</span>
                    </div>
                )}

                <section className="rotate-hero">
                    <div className="rotate-badge">
                        <RefreshCcw />
                        <span>{t.eyebrow}</span>
                    </div>

                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </section>

                <section className="rotate-shell">
                    <div className="rotate-left">
                        <label className="rotate-upload">
                            <input type="file" accept="image/*" onChange={handleUpload} />
                            <span>
                                <UploadCloud />
                            </span>
                            <strong>{t.uploadTitle}</strong>
                            <small>{t.uploadDesc}</small>
                        </label>

                        <div className="rotate-actions">
                            <button onClick={() => setRotation((prev) => prev - 90)} disabled={!previewUrl}>
                                <RotateCcw />
                                {t.rotateLeft}
                            </button>

                            <button onClick={() => setRotation((prev) => prev + 90)} disabled={!previewUrl}>
                                <RotateCw />
                                {t.rotateRight}
                            </button>

                            <button onClick={() => setFlipX((prev) => prev * -1)} disabled={!previewUrl}>
                                <FlipHorizontal />
                                {t.flipH}
                            </button>

                            <button onClick={() => setFlipY((prev) => prev * -1)} disabled={!previewUrl}>
                                <FlipVertical />
                                {t.flipV}
                            </button>

                            <button onClick={resetTool} disabled={!previewUrl}>
                                <RefreshCcw />
                                {t.reset}
                            </button>

                            <button onClick={downloadImage} disabled={!previewUrl}>
                                <Download />
                                {t.download}
                            </button>

                            <button onClick={clearImage} disabled={!previewUrl} className="danger">
                                <Trash2 />
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="rotate-preview-card">
                        <div className="rotate-preview-head">
                            <h3>{t.preview}</h3>
                            <span>{rotation}°</span>
                        </div>

                        <div className="rotate-preview-box">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Rotate Preview"
                                    style={{
                                        transform: `rotate(${rotation}deg) scale(${flipX}, ${flipY})`,
                                    }}
                                />
                            ) : (
                                <div className="rotate-empty">
                                    <RefreshCcw />
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