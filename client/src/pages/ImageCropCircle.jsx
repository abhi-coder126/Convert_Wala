import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
    UploadCloud,
    Download,
    RefreshCcw,
    Trash2,
    CheckCircle,
    AlertCircle,
    Circle,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import "../styles/ImageCropCircle.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
    en: {
        seoTitle: "Image Crop Circle Online Free | Circle Image Cropper",
        seoDesc:
            "Crop your image into a perfect circle online for free. Upload image, adjust size and download circular PNG image instantly.",
        eyebrow: "Convert Wala Image Tool",
        title: "Image Crop Circle",
        subtitle:
            "Upload any image, crop it into a perfect circle and download high-quality transparent PNG instantly.",
        uploadTitle: "Upload Image",
        uploadDesc: "Supports JPG, PNG, JPEG, WEBP and more image formats.",
        cropSize: "Circle Size",
        zoom: "Zoom",
        crop: "Create Circle Image",
        download: "Download PNG",
        reset: "Reset",
        preview: "Circle Preview",
        emptyTitle: "No image uploaded yet",
        emptyDesc: "Upload an image to create a circular profile photo or avatar.",
        uploadError: "Please upload a valid image file.",
        uploaded: "Image uploaded successfully.",
        cropFirst: "Please create circle image first.",
        cropSuccess: "Circle image created successfully.",
        secure: "Browser Based",
        secureDesc: "Image is processed in your browser.",
        quality: "Transparent PNG",
        qualityDesc: "Downloads clean circular PNG.",
        fast: "Easy Crop",
        fastDesc: "Upload, adjust and download.",
    },
    hi: {
        seoTitle: "Image Crop Circle Online Free | Circle Image Cropper",
        seoDesc:
            "अपनी image को perfect circle में free crop करें। Image upload करें, size adjust करें और circular PNG instantly download करें।",
        eyebrow: "Convert Wala इमेज टूल",
        title: "Image Crop Circle",
        subtitle:
            "Image upload करें, उसे perfect circle में crop करें और high-quality transparent PNG तुरंत download करें।",
        uploadTitle: "Image Upload करें",
        uploadDesc: "JPG, PNG, JPEG, WEBP और अन्य image formats support हैं।",
        cropSize: "Circle Size",
        zoom: "Zoom",
        crop: "Circle Image बनाएं",
        download: "Download PNG",
        reset: "Reset",
        preview: "Circle Preview",
        emptyTitle: "अभी कोई image upload नहीं हुई",
        emptyDesc: "Circular profile photo या avatar बनाने के लिए image upload करें।",
        uploadError: "कृपया valid image file upload करें।",
        uploaded: "Image successfully upload हो गई।",
        cropFirst: "कृपया पहले circle image बनाएं।",
        cropSuccess: "Circle image successfully बन गई।",
        secure: "Browser Based",
        secureDesc: "Image आपके browser में process होती है।",
        quality: "Transparent PNG",
        qualityDesc: "Clean circular PNG download होती है।",
        fast: "Easy Crop",
        fastDesc: "Upload, adjust और download करें।",
    },
    hinglish: {
        seoTitle: "Image Crop Circle Online Free | Circle Image Cropper",
        seoDesc:
            "Image ko perfect circle me free crop karo. Image upload karo, size adjust karo aur circular PNG instantly download karo.",
        eyebrow: "Convert Wala Image Tool",
        title: "Image Crop Circle",
        subtitle:
            "Image upload karo, usko perfect circle me crop karo aur high-quality transparent PNG instantly download karo.",
        uploadTitle: "Image Upload Karo",
        uploadDesc: "JPG, PNG, JPEG, WEBP aur more image formats support karta hai.",
        cropSize: "Circle Size",
        zoom: "Zoom",
        crop: "Create Circle Image",
        download: "Download PNG",
        reset: "Reset",
        preview: "Circle Preview",
        emptyTitle: "Abhi koi image upload nahi hui",
        emptyDesc: "Circular profile photo ya avatar banane ke liye image upload karo.",
        uploadError: "Please valid image file upload karo.",
        uploaded: "Image successfully upload ho gayi.",
        cropFirst: "Please pehle circle image create karo.",
        cropSuccess: "Circle image successfully create ho gayi.",
        secure: "Browser Based",
        secureDesc: "Image browser ke andar process hoti hai.",
        quality: "Transparent PNG",
        qualityDesc: "Clean circular PNG download hoti hai.",
        fast: "Easy Crop",
        fastDesc: "Upload, adjust aur download karo.",
    },
};

const cleanName = (name = "image") =>
    name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");

export default function ImageCropCircle() {
    const [language, setLanguage] = useState(
        localStorage.getItem(STORAGE_LANGUAGE) || "en"
    );
    const [theme, setTheme] = useState(
        localStorage.getItem(STORAGE_THEME) || "light"
    );

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [resultUrl, setResultUrl] = useState("");
    const [circleSize, setCircleSize] = useState(1080);
    const [zoom, setZoom] = useState(1);
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

        const url = URL.createObjectURL(file);

        setImageFile(file);
        setPreviewUrl(url);
        setResultUrl("");
        setZoom(1);
        showToast("success", t.uploaded);
        e.target.value = "";
    };

    const createCircleImage = () => {
        if (!previewUrl) {
            showToast("error", t.uploadError);
            return;
        }

        const img = new Image();

        img.onload = () => {
            const exportSize = circleSize;
            const canvas = document.createElement("canvas");

            canvas.width = exportSize;
            canvas.height = exportSize;

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            const sourceSize = Math.min(img.naturalWidth, img.naturalHeight);
            const sx = (img.naturalWidth - sourceSize) / 2;
            const sy = (img.naturalHeight - sourceSize) / 2;

            ctx.clearRect(0, 0, exportSize, exportSize);

            ctx.save();
            ctx.beginPath();
            ctx.arc(exportSize / 2, exportSize / 2, exportSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            const drawSize = exportSize * zoom;
            const offset = (exportSize - drawSize) / 2;

            ctx.drawImage(
                img,
                sx,
                sy,
                sourceSize,
                sourceSize,
                offset,
                offset,
                drawSize,
                drawSize
            );

            ctx.restore();

            canvas.toBlob(
                (blob) => {
                    if (!blob) return;

                    revokeResult();
                    setResultUrl(URL.createObjectURL(blob));
                    showToast("success", t.cropSuccess);
                },
                "image/png",
                1
            );
        };

        img.src = previewUrl;
    };
    const downloadImage = () => {
        if (!resultUrl) {
            showToast("error", t.cropFirst);
            return;
        }

        const link = document.createElement("a");
        link.href = resultUrl;
        link.download = `Convert Wala_${cleanName(imageFile?.name || "circle-image")}_circle.png`;
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
        setCircleSize(420);
        setZoom(1);
    };

    return (
        <>
            <Helmet>
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.seoDesc} />
                <meta
                    name="keywords"
                    content="image crop circle, circle image cropper, crop image online, round image maker, profile picture cropper, circular image png"
                />
                <meta name="robots" content="index, follow" />
                <link
                    rel="canonical"
                    href="https://www.convertwala.com/image-crop-circle"
                />

                <meta property="og:title" content={t.seoTitle} />
                <meta property="og:description" content={t.seoDesc} />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://www.convertwala.com/image-crop-circle"
                />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t.seoTitle} />
                <meta name="twitter:description" content={t.seoDesc} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        name: "Image Crop Circle",
                        url: "https://www.convertwala.com/image-crop-circle",
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

            <main className={`circle-crop-page ${theme === "dark" ? "dark" : "light"}`}>
                {toast && (
                    <div className={`circle-toast ${toast.type}`}>
                        {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
                        <span>{toast.message}</span>
                    </div>
                )}

                <section className="circle-hero">
                    <div className="circle-hero-badge">
                        <Circle />
                        <span>{t.eyebrow}</span>
                    </div>

                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>

                    <div className="circle-feature-row">
                        <div>
                            <ShieldCheck />
                            <strong>{t.secure}</strong>
                            <span>{t.secureDesc}</span>
                        </div>

                        <div>
                            <Sparkles />
                            <strong>{t.quality}</strong>
                            <span>{t.qualityDesc}</span>
                        </div>

                        <div>
                            <RefreshCcw />
                            <strong>{t.fast}</strong>
                            <span>{t.fastDesc}</span>
                        </div>
                    </div>
                </section>

                <section className="circle-shell">
                    <div className="circle-left">
                        <label className="circle-upload">
                            <input type="file" accept="image/*" onChange={handleUpload} />
                            <span>
                                <UploadCloud />
                            </span>
                            <strong>{t.uploadTitle}</strong>
                            <small>{t.uploadDesc}</small>
                        </label>

                        <div className="circle-controls">
                            <div>
                                <label>
                                    {t.cropSize}: {circleSize}px
                                </label>
                                <input
                                    type="range"
                                    min="512"
                                    max="2000"
                                    step="10"
                                    value={circleSize}
                                    onChange={(e) => {
                                        setCircleSize(Number(e.target.value));
                                        revokeResult();
                                    }}
                                />
                            </div>

                            <div>
                                <label>
                                    {t.zoom}: {zoom.toFixed(2)}x
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="2"
                                    step="0.01"
                                    value={zoom}
                                    onChange={(e) => {
                                        setZoom(Number(e.target.value));
                                        revokeResult();
                                    }}
                                />
                            </div>

                            <button onClick={createCircleImage} disabled={!previewUrl}>
                                <RefreshCcw />
                                {t.crop}
                            </button>

                            <button onClick={downloadImage} disabled={!resultUrl}>
                                <Download />
                                {t.download}
                            </button>

                            <button onClick={resetTool} className="danger" disabled={!previewUrl}>
                                <Trash2 />
                                {t.reset}
                            </button>
                        </div>
                    </div>

                    <div className="circle-preview-card">
                        <div className="circle-preview-head">
                            <h3>{t.preview}</h3>
                            <span>PNG</span>
                        </div>

                        <div className="circle-preview-box">
                            {previewUrl ? (
                                <div
                                    className="circle-frame"
                                    style={{
                                        width: `${Math.min(circleSize / 2.5, 420)}px`,
                                        height: `${Math.min(circleSize / 2.5, 420)}px`,
                                    }}
                                >
                                    <img
                                        src={resultUrl || previewUrl}
                                        alt="Circle Preview"
                                        style={{
                                            transform: resultUrl ? "scale(1)" : `scale(${zoom})`,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="circle-empty">
                                    <Circle />
                                    <h3>{t.emptyTitle}</h3>
                                    <p>{t.emptyDesc}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}