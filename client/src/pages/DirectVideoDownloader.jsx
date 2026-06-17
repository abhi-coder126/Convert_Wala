import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Download,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  X,
  Video,
  Copy,
  Trash2,
  ExternalLink,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala Video Tool",
    title: "Direct Video Downloader",
    subtitle:
      "Paste a direct video file URL and download it. Works for allowed MP4, WEBM, MOV or other direct video links.",
    pasteTitle: "Paste Direct Video URL",
    videoUrl: "Video URL",
    placeholder: "https://example.com/video.mp4",
    blockedWarning:
      "YouTube, Instagram, Facebook, TikTok or social media links are not supported. Use only direct video file URLs.",
    checking: "Checking...",
    checkLink: "Check Link",
    downloading: "Downloading...",
    download: "Download",
    copyUrl: "Copy URL",
    clear: "Clear",
    detectedDetails: "Detected File Details",
    fileName: "File Name",
    extension: "Extension",
    fileType: "File Type",
    fileSize: "File Size",
    corsSuccess:
      "This server allows browser download. Download button should work.",
    corsWarning:
      "This server blocked browser fetch using CORS. Use Open Direct Link button, then browser save option.",
    examples: "Examples",
    sampleMp4: "Sample MP4 Video",
    sampleWebm: "Sample WEBM Video",
    preview: "Preview",
    previewEmpty: "Paste direct video link to preview.",
    openDirect: "Open Direct Link",
    browserDownload: "Browser Download",
    note:
      "Note: Some servers block browser download using CORS. In that case, use “Open Direct Link” and save the video manually.",
    unknown: "Unknown",
    defaultName: "Convert Wala_direct_video.mp4",
    pasteFirst: "Paste direct video URL first.",
    pasteVideoFirst: "Paste video URL first.",
    validHttp: "Paste a valid http/https URL.",
    validVideoUrl: "Paste a valid video URL.",
    validDirectUrl: "Paste a valid direct video URL.",
    blockedCheck:
      "YouTube/Instagram/Facebook links are not supported. Use only direct video file URL.",
    blockedDownload:
      "Restricted platform links cannot be downloaded. Use only direct video file URL.",
    checkedSuccess: "Video link checked successfully.",
    corsBlocked:
      "Server is blocking CORS. Use Open Direct Link button.",
    downloadStarted: "Video download started.",
    downloadBlocked:
      "Direct download blocked by server CORS. Use Open Direct Link button.",
    noCopyUrl: "There is no URL to copy.",
    copied: "URL copied.",
    copyFailed: "Copy failed.",
    cleared: "Cleared.",
    seoTitle:
      "Free Direct Video Downloader Online - Download Direct Video URLs | Convert Wala",
    seoDescription:
      "Use Convert Wala Direct Video Downloader to download direct MP4, WEBM, MOV and video file URLs online. Paste a direct video link, preview it and download from your browser.",
    seoKeywords:
      "direct video downloader, download video from URL, MP4 downloader, WEBM downloader, video URL downloader, direct file downloader, browser video downloader, Convert Wala video tools",
  },

  hi: {
    eyebrow: "Convert Wala वीडियो टूल",
    title: "Direct Video Downloader",
    subtitle:
      "Direct video file URL paste करें और video download करें। यह allowed MP4, WEBM, MOV या direct video links के लिए काम करता है।",
    pasteTitle: "Direct Video URL Paste करें",
    videoUrl: "Video URL",
    placeholder: "https://example.com/video.mp4",
    blockedWarning:
      "YouTube, Instagram, Facebook, TikTok या social media links supported नहीं हैं। सिर्फ direct video file URL use करें।",
    checking: "Checking...",
    checkLink: "Link Check करें",
    downloading: "Downloading...",
    download: "Download",
    copyUrl: "URL Copy करें",
    clear: "Clear",
    detectedDetails: "Detected File Details",
    fileName: "File Name",
    extension: "Extension",
    fileType: "File Type",
    fileSize: "File Size",
    corsSuccess:
      "यह server browser download allow करता है। Download button काम करना चाहिए।",
    corsWarning:
      "इस server ने browser fetch को CORS से block किया है। Open Direct Link button use करें और browser save option use करें।",
    examples: "Examples",
    sampleMp4: "Sample MP4 Video",
    sampleWebm: "Sample WEBM Video",
    preview: "Preview",
    previewEmpty: "Preview देखने के लिए direct video link paste करें।",
    openDirect: "Open Direct Link",
    browserDownload: "Browser Download",
    note:
      "Note: कुछ servers browser download को CORS से block कर देते हैं। उस case में “Open Direct Link” use करें और video manually save करें।",
    unknown: "Unknown",
    defaultName: "Convert Wala_direct_video.mp4",
    pasteFirst: "पहले direct video URL paste करें।",
    pasteVideoFirst: "पहले video URL paste करें।",
    validHttp: "Valid http/https URL paste करें।",
    validVideoUrl: "Valid video URL paste करें।",
    validDirectUrl: "Valid direct video URL paste करें।",
    blockedCheck:
      "YouTube/Instagram/Facebook links supported नहीं हैं। सिर्फ direct video file URL use करें।",
    blockedDownload:
      "Restricted platform links download नहीं होंगे। सिर्फ direct video file URL use करें।",
    checkedSuccess: "Video link successfully check हो गया।",
    corsBlocked:
      "Server CORS block कर रहा है। Open Direct Link button use करें।",
    downloadStarted: "Video download started.",
    downloadBlocked:
      "Direct download server CORS से blocked है। Open Direct Link button use करें।",
    noCopyUrl: "Copy करने के लिए URL नहीं है।",
    copied: "URL copied.",
    copyFailed: "Copy failed.",
    cleared: "Cleared.",
    seoTitle:
      "Free Direct Video Downloader Online - Direct Video URL Download करें | Convert Wala",
    seoDescription:
      "Convert Wala Direct Video Downloader से direct MP4, WEBM, MOV और video file URLs online download करें। Direct video link paste करें, preview करें और browser से download करें।",
    seoKeywords:
      "direct video downloader, video URL downloader, MP4 downloader, WEBM downloader, direct video download, browser video downloader, Convert Wala video tools",
  },

  hinglish: {
    eyebrow: "Convert Wala Video Tool",
    title: "Direct Video Downloader",
    subtitle:
      "Direct video file URL paste karo aur video download karo. Allowed MP4, WEBM, MOV ya direct video links ke liye kaam karta hai.",
    pasteTitle: "Paste Direct Video URL",
    videoUrl: "Video URL",
    placeholder: "https://example.com/video.mp4",
    blockedWarning:
      "YouTube, Instagram, Facebook, TikTok ya social media links supported nahi hain. Sirf direct video file URL use karo.",
    checking: "Checking...",
    checkLink: "Check Link",
    downloading: "Downloading...",
    download: "Download",
    copyUrl: "Copy URL",
    clear: "Clear",
    detectedDetails: "Detected File Details",
    fileName: "File Name",
    extension: "Extension",
    fileType: "File Type",
    fileSize: "File Size",
    corsSuccess:
      "Ye server browser download allow karta hai. Download button work karna chahiye.",
    corsWarning:
      "Ye server browser fetch ko CORS se block kar raha hai. Open Direct Link button use karo, phir browser save option use karo.",
    examples: "Examples",
    sampleMp4: "Sample MP4 Video",
    sampleWebm: "Sample WEBM Video",
    preview: "Preview",
    previewEmpty: "Preview ke liye direct video link paste karo.",
    openDirect: "Open Direct Link",
    browserDownload: "Browser Download",
    note:
      "Note: Kuch servers browser download ko CORS se block kar dete hain. Us case me “Open Direct Link” use karo aur video manually save karo.",
    unknown: "Unknown",
    defaultName: "Convert Wala_direct_video.mp4",
    pasteFirst: "Pehle direct video URL paste karo.",
    pasteVideoFirst: "Pehle video URL paste karo.",
    validHttp: "Valid http/https URL paste karo.",
    validVideoUrl: "Valid video URL paste karo.",
    validDirectUrl: "Valid direct video URL paste karo.",
    blockedCheck:
      "YouTube/Instagram/Facebook links supported nahi hain. Sirf direct video file URL use karo.",
    blockedDownload:
      "Restricted platform links download nahi honge. Sirf direct video file URL use karo.",
    checkedSuccess: "Video link checked successfully.",
    corsBlocked:
      "Server CORS block kar raha hai. Open Direct Link button use karo.",
    downloadStarted: "Video download started.",
    downloadBlocked:
      "Direct download server CORS se blocked hai. Open Direct Link button use karo.",
    noCopyUrl: "Copy karne ke liye URL nahi hai.",
    copied: "URL copied.",
    copyFailed: "Copy failed.",
    cleared: "Cleared.",
    seoTitle:
      "Free Direct Video Downloader Online - Download Direct Video URLs | Convert Wala",
    seoDescription:
      "Convert Wala Direct Video Downloader se direct MP4, WEBM, MOV aur video file URLs online download karo. Direct video link paste karo, preview karo aur browser se download karo.",
    seoKeywords:
      "direct video downloader, download video from URL, MP4 downloader, WEBM downloader, video URL downloader, browser video downloader, Convert Wala video tools",
  },
};

const blockedSites = [
  "youtube.com",
  "youtu.be",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com",
  "tiktok.com",
];

const formatBytes = (bytes = 0, unknown = "Unknown") => {
  if (!bytes) return unknown;
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const getFileNameFromUrl = (url = "", fallback = "Convert Wala_direct_video.mp4") => {
  try {
    const cleanUrl = url.split("?")[0];
    const name = cleanUrl.split("/").pop();

    if (!name || !name.includes(".")) {
      return fallback;
    }

    return `Convert Wala_${name.replace(/[^a-z0-9._-]/gi, "_")}`;
  } catch {
    return fallback;
  }
};

const getExtension = (url = "") => {
  try {
    const cleanUrl = url.split("?")[0].toLowerCase();
    return cleanUrl.split(".").pop() || "unknown";
  } catch {
    return "unknown";
  }
};

export default function DirectVideoDownloader() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [videoUrl, setVideoUrl] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/direct-video-downloader";

  const trimmedUrl = videoUrl.trim();

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

  const isBlockedPlatform = useMemo(() => {
    return blockedSites.some((site) => trimmedUrl.toLowerCase().includes(site));
  }, [trimmedUrl]);

  const extension = useMemo(() => {
    return getExtension(trimmedUrl);
  }, [trimmedUrl]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2800);
  };

  const isValidUrl = () => {
    try {
      const url = new URL(trimmedUrl);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const checkVideo = async () => {
    if (!trimmedUrl) {
      showToast("error", t.pasteFirst);
      return;
    }

    if (!isValidUrl()) {
      showToast("error", t.validHttp);
      return;
    }

    if (isBlockedPlatform) {
      showToast("error", t.blockedCheck);
      return;
    }

    try {
      setChecking(true);
      setFileInfo(null);

      const response = await fetch(trimmedUrl, {
        method: "HEAD",
      });

      const contentType = response.headers.get("content-type") || t.unknown;
      const size = response.headers.get("content-length");

      setFileInfo({
        name: getFileNameFromUrl(trimmedUrl, t.defaultName),
        type: contentType,
        size: size ? Number(size) : 0,
        extension,
        corsAllowed: true,
      });

      showToast("success", t.checkedSuccess);
    } catch {
      setFileInfo({
        name: getFileNameFromUrl(trimmedUrl, t.defaultName),
        type: t.unknown,
        size: 0,
        extension,
        corsAllowed: false,
      });

      showToast("error", t.corsBlocked);
    } finally {
      setChecking(false);
    }
  };

  const downloadVideo = async () => {
    if (!trimmedUrl) {
      showToast("error", t.pasteVideoFirst);
      return;
    }

    if (!isValidUrl()) {
      showToast("error", t.validVideoUrl);
      return;
    }

    if (isBlockedPlatform) {
      showToast("error", t.blockedDownload);
      return;
    }

    try {
      setDownloading(true);

      const response = await fetch(trimmedUrl);

      if (!response.ok) {
        throw new Error("Video download failed");
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("Empty video file");
      }

      const blobUrl = URL.createObjectURL(blob);
      const fileName = getFileNameFromUrl(trimmedUrl, t.defaultName);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);

      showToast("success", t.downloadStarted);
    } catch {
      showToast("error", t.downloadBlocked);
    } finally {
      setDownloading(false);
    }
  };

  const copyUrl = async () => {
    if (!trimmedUrl) {
      showToast("error", t.noCopyUrl);
      return;
    }

    try {
      await navigator.clipboard.writeText(trimmedUrl);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const clearAll = () => {
    setVideoUrl("");
    setFileInfo(null);
    showToast("success", t.cleared);
  };

  return (
    <main className={`dvd-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />

        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDescription} />
        <meta name="keywords" content={t.seoKeywords} />

        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <meta name="application-name" content="Convert Wala" />
        <meta
          name="theme-color"
          content={theme === "dark" ? "#020617" : "#2563eb"}
        />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Convert Wala" />
        <meta property="og:locale" content={language === "hi" ? "hi_IN" : "en_US"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Direct Video Downloader",
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
            featureList: [
              "Download direct video URLs",
              "Preview direct video links",
              "Check video file details",
              "Copy video URL",
              "Open direct video link",
              "Browser-based video download",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .dvd-page {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .dvd-page * {
          box-sizing: border-box;
        }

        .dvd-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .dvd-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .dvd-page.dark .dvd-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .dvd-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .dvd-page.dark .dvd-eyebrow {
          color: #93c5fd;
        }

        .dvd-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .dvd-page.dark .dvd-hero h1 {
          color: #f8fafc;
        }

        .dvd-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .dvd-page.dark .dvd-hero p,
        .dvd-page.dark .dvd-info-grid span,
        .dvd-page.dark .dvd-empty {
          color: #cbd5e1;
        }

        .dvd-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .dvd-left,
        .dvd-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .dvd-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .dvd-page.dark .dvd-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .dvd-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .dvd-page.dark .dvd-card h3,
        .dvd-page.dark .dvd-label,
        .dvd-page.dark .dvd-info-grid strong {
          color: #f8fafc;
        }

        .dvd-input-box {
          display: grid;
          gap: 12px;
        }

        .dvd-label {
          color: #334155;
          font-weight: 900;
          font-size: 0.92rem;
        }

        .dvd-url-input {
          width: 100%;
          min-height: 56px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 18px;
          padding: 0 16px;
          outline: none;
          font-weight: 800;
          font-size: 1rem;
        }

        .dvd-page.dark .dvd-url-input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .dvd-url-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          background: #ffffff;
        }

        .dvd-page.dark .dvd-url-input:focus {
          background: #020617;
        }

        .dvd-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .dvd-primary,
        .dvd-dark,
        .dvd-light,
        .dvd-danger {
          min-height: 50px;
          border: 0;
          border-radius: 999px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-weight: 900;
          cursor: pointer;
          transition: 0.22s ease;
          flex: 1;
          text-decoration: none;
        }

        .dvd-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .dvd-dark {
          background: #111827;
          color: #ffffff;
        }

        .dvd-page.dark .dvd-dark {
          background: #38bdf8;
          color: #020617;
        }

        .dvd-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .dvd-page.dark .dvd-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .dvd-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .dvd-primary:disabled,
        .dvd-dark:disabled,
        .dvd-light:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .dvd-primary:hover,
        .dvd-dark:hover,
        .dvd-light:hover,
        .dvd-danger:hover {
          transform: translateY(-2px);
        }

        .dvd-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .dvd-info-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .dvd-page.dark .dvd-info-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .dvd-info-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .dvd-info-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .dvd-warning {
          padding: 16px;
          border-radius: 18px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.7;
          font-weight: 800;
        }

        .dvd-success {
          padding: 16px;
          border-radius: 18px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #047857;
          line-height: 1.7;
          font-weight: 800;
        }

        .dvd-preview-box {
          background: #020617;
          border-radius: 24px;
          overflow: hidden;
          min-height: 360px;
          display: grid;
          place-items: center;
        }

        .dvd-preview-box video {
          width: 100%;
          max-height: 520px;
          display: block;
          background: #020617;
        }

        .dvd-empty {
          text-align: center;
          color: #94a3b8;
          padding: 60px 24px;
        }

        .dvd-empty svg {
          width: 72px;
          height: 72px;
          margin-bottom: 12px;
        }

        .dvd-example-list {
          display: grid;
          gap: 10px;
        }

        .dvd-example-list button {
          width: 100%;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 16px;
          padding: 13px 14px;
          text-align: left;
          font-weight: 900;
          cursor: pointer;
        }

        .dvd-page.dark .dvd-example-list button {
          background: #020617;
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .dvd-example-list button:hover {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .dvd-page.dark .dvd-example-list button:hover {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .dvd-toast {
          position: fixed;
          right: 24px;
          top: 92px;
          z-index: 9999;
          min-width: 280px;
          max-width: 430px;
          min-height: 54px;
          padding: 14px 16px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
        }

        .dvd-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .dvd-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .dvd-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .dvd-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .dvd-hero {
            padding: 56px 5% 34px;
          }

          .dvd-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .dvd-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .dvd-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .dvd-card {
            padding: 20px;
            border-radius: 22px;
          }

          .dvd-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .dvd-primary,
          .dvd-dark,
          .dvd-light,
          .dvd-danger {
            width: 100%;
          }

          .dvd-info-grid {
            grid-template-columns: 1fr;
          }

          .dvd-preview-box {
            min-height: 260px;
          }

          .dvd-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .dvd-hero {
            padding: 44px 4.5% 28px;
          }

          .dvd-hero h1 {
            font-size: 2rem;
          }

          .dvd-shell {
            padding: 24px 4.5% 48px;
          }

          .dvd-card {
            padding: 16px;
            border-radius: 18px;
          }

          .dvd-preview-box {
            min-height: 220px;
          }
        }
      `}</style>

      {toast && (
        <div className={`dvd-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="dvd-hero">
        <p className="dvd-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="dvd-shell">
        <div className="dvd-left">
          <div className="dvd-card">
            <h3>{t.pasteTitle}</h3>

            <div className="dvd-input-box">
              <label className="dvd-label">{t.videoUrl}</label>

              <input
                className="dvd-url-input"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setFileInfo(null);
                }}
                placeholder={t.placeholder}
              />
            </div>

            {isBlockedPlatform && (
              <div className="dvd-warning" style={{ marginTop: 16 }}>
                {t.blockedWarning}
              </div>
            )}

            <div className="dvd-actions">
              <button
                type="button"
                className="dvd-primary"
                onClick={checkVideo}
                disabled={checking || !trimmedUrl}
              >
                <LinkIcon />
                {checking ? t.checking : t.checkLink}
              </button>

              <button
                type="button"
                className="dvd-dark"
                onClick={downloadVideo}
                disabled={downloading || !trimmedUrl || isBlockedPlatform}
              >
                <Download />
                {downloading ? t.downloading : t.download}
              </button>
            </div>

            <div className="dvd-actions">
              <button type="button" className="dvd-light" onClick={copyUrl}>
                <Copy />
                {t.copyUrl}
              </button>

              <button type="button" className="dvd-danger" onClick={clearAll}>
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </div>

          {fileInfo && (
            <div className="dvd-card">
              <h3>{t.detectedDetails}</h3>

              <div className="dvd-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{fileInfo.name}</strong>
                </div>

                <div>
                  <span>{t.extension}</span>
                  <strong>{fileInfo.extension}</strong>
                </div>

                <div>
                  <span>{t.fileType}</span>
                  <strong>{fileInfo.type}</strong>
                </div>

                <div>
                  <span>{t.fileSize}</span>
                  <strong>{formatBytes(fileInfo.size, t.unknown)}</strong>
                </div>
              </div>

              {fileInfo.corsAllowed ? (
                <div className="dvd-success" style={{ marginTop: 16 }}>
                  {t.corsSuccess}
                </div>
              ) : (
                <div className="dvd-warning" style={{ marginTop: 16 }}>
                  {t.corsWarning}
                </div>
              )}
            </div>
          )}

          <div className="dvd-card">
            <h3>{t.examples}</h3>

            <div className="dvd-example-list">
              <button
                type="button"
                onClick={() =>
                  setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4")
                }
              >
                {t.sampleMp4}
              </button>

              <button
                type="button"
                onClick={() =>
                  setVideoUrl(
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
                  )
                }
              >
                {t.sampleWebm}
              </button>
            </div>
          </div>
        </div>

        <div className="dvd-right">
          <div className="dvd-card">
            <h3>{t.preview}</h3>

            <div className="dvd-preview-box">
              {trimmedUrl && isValidUrl() && !isBlockedPlatform ? (
                <video src={trimmedUrl} controls playsInline />
              ) : (
                <div className="dvd-empty">
                  <Video />
                  <p>{t.previewEmpty}</p>
                </div>
              )}
            </div>

            <div className="dvd-actions">
              <a
                className="dvd-light"
                href={trimmedUrl || "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!trimmedUrl || !isValidUrl() || isBlockedPlatform) {
                    e.preventDefault();
                    showToast("error", t.validDirectUrl);
                  }
                }}
              >
                <ExternalLink />
                {t.openDirect}
              </a>

              <a
                className="dvd-primary"
                href={trimmedUrl || "#"}
                download={getFileNameFromUrl(trimmedUrl, t.defaultName)}
                onClick={(e) => {
                  if (!trimmedUrl || !isValidUrl() || isBlockedPlatform) {
                    e.preventDefault();
                    showToast("error", t.validDirectUrl);
                  }
                }}
              >
                <Download />
                {t.browserDownload}
              </a>
            </div>

            <div className="dvd-warning" style={{ marginTop: 16 }}>
              {t.note}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}