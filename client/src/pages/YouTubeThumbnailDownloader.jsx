import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaYoutube } from "react-icons/fa";
import {
    Download,
    Link2,
    Image,
    Copy,
    CheckCircle,
    AlertCircle,
    Trash2,
} from "lucide-react";

import "../styles/YouTubeThumbnailDownloader.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
    en: {
        eyebrow: "Convert Wala Video Tool",
        title: "YouTube Thumbnail Downloader",
        subtitle:
            "Paste any YouTube video URL and instantly download HD, SD and default thumbnail images.",
        inputLabel: "YouTube Video URL",
        placeholder: "Paste YouTube URL here...",
        getThumb: "Get Thumbnail",
        clear: "Clear",
        copy: "Copy Image URL",
        download: "Download",
        preview: "Thumbnail Preview",
        details: "Available Sizes",
        invalid: "Please enter a valid YouTube video URL.",
        copied: "Thumbnail URL copied.",
        ready: "Thumbnail generated successfully.",
        empty: "Your YouTube thumbnail preview will appear here.",
        seoTitle:
            "Free YouTube Thumbnail Downloader Online | Download HD YouTube Thumbnail - Convert Wala",
        seoDescription:
            "Download YouTube video thumbnails online for free. Paste YouTube URL and get HD, SD, medium and default thumbnails instantly.",
        seoKeywords:
            "youtube thumbnail downloader, download youtube thumbnail, youtube thumbnail grabber, HD thumbnail downloader, youtube image downloader",
    },
    hi: {
        eyebrow: "Convert Wala वीडियो टूल",
        title: "YouTube Thumbnail Downloader",
        subtitle:
            "YouTube वीडियो URL paste करें और HD, SD और default thumbnail images तुरंत download करें।",
        inputLabel: "YouTube Video URL",
        placeholder: "YouTube URL यहां paste करें...",
        getThumb: "Thumbnail निकालें",
        clear: "Clear",
        copy: "Image URL Copy करें",
        download: "Download",
        preview: "Thumbnail Preview",
        details: "Available Sizes",
        invalid: "कृपया valid YouTube video URL डालें।",
        copied: "Thumbnail URL copied.",
        ready: "Thumbnail successfully generate हो गया।",
        empty: "YouTube thumbnail preview यहां दिखाई देगा।",
        seoTitle:
            "Free YouTube Thumbnail Downloader Online | HD YouTube Thumbnail Download - Convert Wala",
        seoDescription:
            "YouTube video thumbnails free में download करें। URL paste करें और HD, SD, medium thumbnails instantly पाएं।",
        seoKeywords:
            "youtube thumbnail downloader, youtube thumbnail download, HD thumbnail, youtube image downloader",
    },
    hinglish: {
        eyebrow: "Convert Wala Video Tool",
        title: "YouTube Thumbnail Downloader",
        subtitle:
            "YouTube video URL paste karo aur HD, SD aur default thumbnail images instantly download karo.",
        inputLabel: "YouTube Video URL",
        placeholder: "YouTube URL yahan paste karo...",
        getThumb: "Get Thumbnail",
        clear: "Clear",
        copy: "Copy Image URL",
        download: "Download",
        preview: "Thumbnail Preview",
        details: "Available Sizes",
        invalid: "Please valid YouTube video URL enter karo.",
        copied: "Thumbnail URL copied.",
        ready: "Thumbnail successfully generate ho gaya.",
        empty: "YouTube thumbnail preview yahan appear hoga.",
        seoTitle:
            "Free YouTube Thumbnail Downloader Online | Download HD YouTube Thumbnail - Convert Wala",
        seoDescription:
            "YouTube video thumbnails free me download karo. URL paste karo aur HD, SD, medium thumbnails instantly pao.",
        seoKeywords:
            "youtube thumbnail downloader, download youtube thumbnail, youtube thumbnail grabber, HD thumbnail downloader",
    },
};

const extractYouTubeId = (url = "") => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&]+)/,
        /(?:youtu\.be\/)([^?&]+)/,
        /(?:youtube\.com\/embed\/)([^?&]+)/,
        /(?:youtube\.com\/shorts\/)([^?&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match?.[1]) return match[1];
    }

    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

    return "";
};

export default function YouTubeThumbnailDownloader() {
    const [language, setLanguage] = useState(
        localStorage.getItem(STORAGE_LANGUAGE) || "en"
    );
    const [theme, setTheme] = useState(
        localStorage.getItem(STORAGE_THEME) || "light"
    );

    const [url, setUrl] = useState("");
    const [videoId, setVideoId] = useState("");
    const [toast, setToast] = useState(null);

    const t = pageText[language] || pageText.en;
    const canonicalUrl = "https://www.convertwala.com/youtube-thumbnail-downloader";

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
        setTimeout(() => setToast(null), 2500);
    };

    const thumbnails = useMemo(() => {
        if (!videoId) return [];

        const base = `https://img.youtube.com/vi/${videoId}`;

        return [
            { label: "Max Resolution", size: "1280 × 720", url: `${base}/maxresdefault.jpg` },
            { label: "HD Quality", size: "480 × 360", url: `${base}/hqdefault.jpg` },
            { label: "Medium Quality", size: "320 × 180", url: `${base}/mqdefault.jpg` },
            { label: "Standard Quality", size: "640 × 480", url: `${base}/sddefault.jpg` },
            { label: "Default", size: "120 × 90", url: `${base}/default.jpg` },
        ];
    }, [videoId]);

    const mainThumb = thumbnails[0];

    const handleGenerate = () => {
        const id = extractYouTubeId(url);

        if (!id) {
            showToast("error", t.invalid);
            return;
        }

        setVideoId(id);
        showToast("success", t.ready);
    };

    const handleClear = () => {
        setUrl("");
        setVideoId("");
    };

    const copyUrl = async (imageUrl) => {
        try {
            await navigator.clipboard.writeText(imageUrl);
            showToast("success", t.copied);
        } catch {
            showToast("error", "Copy failed.");
        }
    };

    const downloadImage = async (imageUrl, label) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `youtube-thumbnail-${videoId}-${label
                .toLowerCase()
                .replace(/\s+/g, "-")}.jpg`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(blobUrl);
        } catch {
            window.open(imageUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <main className={`yt-page ${theme === "dark" ? "dark" : "light"}`}>
            <Helmet>
                <html lang={language === "hi" ? "hi" : "en"} />
                <title>{t.seoTitle}</title>
                <meta name="description" content={t.seoDescription} />
                <meta name="keywords" content={t.seoKeywords} />
                <meta name="robots" content="index, follow, max-image-preview:large" />
                <meta name="author" content="Convert Wala" />
                <meta name="publisher" content="Convert Wala" />
                <link rel="canonical" href={canonicalUrl} />

                <meta property="og:title" content={t.seoTitle} />
                <meta property="og:description" content={t.seoDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:site_name" content="Convert Wala" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t.seoTitle} />
                <meta name="twitter:description" content={t.seoDescription} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        name: "Convert Wala YouTube Thumbnail Downloader",
                        url: canonicalUrl,
                        applicationCategory: "MultimediaApplication",
                        operatingSystem: "Any",
                        description: t.seoDescription,
                        offers: {
                            "@type": "Offer",
                            price: "0",
                            priceCurrency: "USD",
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "Convert Wala",
                            url: "https://www.convertwala.com/",
                        },
                    })}
                </script>
            </Helmet>

            {toast && (
                <div className={`yt-toast ${toast.type}`}>
                    {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
                    {toast.message}
                </div>
            )}

            <section className="yt-hero">
                <div className="yt-badge">
                    <FaYoutube />
                    {t.eyebrow}
                </div>
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>
            </section>

            <section className="yt-info">
                <Image />
                <div>
                    <h3>Free YouTube Thumbnail Grabber</h3>
                    <p>
                        Video ka thumbnail HD quality me nikaalo. Ye tool browser based hai,
                        koi account ya signup ki zarurat nahi.
                    </p>
                </div>
            </section>

            <section className="yt-shell">
                <div className="yt-card yt-input-card">
                    <div className="yt-card-head">
                        <h3>{t.inputLabel}</h3>
                        <span>Fast & Free</span>
                    </div>

                    <div className="yt-input-box">
                        <Link2 />
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t.placeholder}
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        />
                    </div>

                    <div className="yt-actions">
                        <button onClick={handleGenerate}>
                            <FaYoutube />
                            {t.getThumb}
                        </button>

                        <button className="danger" onClick={handleClear}>
                            <Trash2 />
                            {t.clear}
                        </button>
                    </div>
                </div>

                <div className="yt-card yt-preview-card">
                    <div className="yt-card-head">
                        <h3>{t.preview}</h3>
                        {videoId && <span>ID: {videoId}</span>}
                    </div>

                    {mainThumb ? (
                        <div className="yt-preview">
                            <img src={mainThumb.url} alt="YouTube thumbnail preview" />
                            <div className="yt-preview-actions">
                                <button onClick={() => copyUrl(mainThumb.url)}>
                                    <Copy />
                                    {t.copy}
                                </button>
                                <button onClick={() => downloadImage(mainThumb.url, mainThumb.label)}>
                                    <Download />
                                    {t.download}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="yt-empty">
                            <FaYoutube />
                            <p>{t.empty}</p>
                        </div>
                    )}
                </div>

                {thumbnails.length > 0 && (
                    <div className="yt-card yt-sizes-card">
                        <div className="yt-card-head">
                            <h3>{t.details}</h3>
                            <span>{thumbnails.length} Sizes</span>
                        </div>

                        <div className="yt-size-grid">
                            {thumbnails.map((item) => (
                                <div className="yt-size-item" key={item.label}>
                                    <img src={item.url} alt={item.label} />

                                    <div>
                                        <strong>{item.label}</strong>
                                        <span>{item.size}</span>
                                    </div>

                                    <div className="yt-mini-actions">
                                        <button onClick={() => copyUrl(item.url)} title="Copy URL">
                                            <Copy />
                                        </button>
                                        <button
                                            onClick={() => downloadImage(item.url, item.label)}
                                            title="Download"
                                        >
                                            <Download />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}