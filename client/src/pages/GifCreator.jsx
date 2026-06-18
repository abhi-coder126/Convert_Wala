import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala GIF Tool",
    title: "Video to GIF Creator",
    subtitle:
      "Upload a video clip, select start/end time, FPS and size, then create a real GIF file directly in browser.",
    uploadTitle: "Upload Video",
    changeVideo: "Change Video",
    uploadText: "Best for short clips like 3 to 12 seconds.",
    videoDetails: "Video Details",
    fileName: "File Name",
    originalSize: "Original Size",
    resolution: "Resolution",
    duration: "Duration",
    gifSettings: "GIF Settings",
    startTime: "Start Time",
    endTime: "End Time",
    gifWidth: "GIF Width",
    fps: "FPS",
    colors: "Colors",
    output: "Output",
    creatingGif: "Creating GIF...",
    createGif: "Create GIF",
    downloadGif: "Download GIF",
    note:
      "GIF does not include audio. Long videos can create very heavy GIF files, so use short clips.",
    preview: "Preview",
    uploadPreview: "Upload video to preview",
    progress: "GIF Creation Progress",
    gifSize: "GIF Size",
    width: "Width",
    outputFile: "Output File",
    emptyGif: "Your generated GIF will appear here",
    invalidFile: "Please upload a valid video file.",
    uploadSuccess: "Video uploaded successfully.",
    uploadFirst: "Please upload video first.",
    validTime: "Please enter valid start and end time.",
    tooLarge:
      "GIF will become too large. Reduce duration or FPS.",
    createSuccess: "GIF created successfully.",
    createFailed: "GIF could not be created. Try a short clip.",
    createFirst: "Please create GIF first.",
    downloadStarted: "Download started.",
    unknown: "Unknown",
    sec: "sec",
    seoTitle:
      "Free Video to GIF Creator Online - Make GIF from Video | Convert Wala",
    seoDescription:
      "Create GIFs from videos online for free with Convert Wala Video to GIF Creator. Upload video, choose start time, end time, FPS, size and generate GIF directly in your browser.",
    seoKeywords:
      "video to gif, gif creator, free gif maker, online gif creator, video to gif converter, make gif from video, create gif online, browser gif maker, Convert Wala GIF tool",
  },

  hi: {
    eyebrow: "Convert Wala GIF टूल",
    title: "वीडियो से GIF Creator",
    subtitle:
      "वीडियो clip upload करें, start/end time, FPS और size select करें, फिर browser में real GIF file create करें।",
    uploadTitle: "वीडियो अपलोड करें",
    changeVideo: "वीडियो बदलें",
    uploadText: "3 से 12 seconds जैसे short clips के लिए best.",
    videoDetails: "वीडियो जानकारी",
    fileName: "File Name",
    originalSize: "Original Size",
    resolution: "Resolution",
    duration: "Duration",
    gifSettings: "GIF Settings",
    startTime: "Start Time",
    endTime: "End Time",
    gifWidth: "GIF Width",
    fps: "FPS",
    colors: "Colors",
    output: "Output",
    creatingGif: "GIF बन रहा है...",
    createGif: "GIF Create करें",
    downloadGif: "GIF Download करें",
    note:
      "GIF में audio नहीं होता। Long video से GIF file बहुत heavy बन सकती है, इसलिए short clip use करें।",
    preview: "Preview",
    uploadPreview: "Preview देखने के लिए video upload करें",
    progress: "GIF Creation Progress",
    gifSize: "GIF Size",
    width: "Width",
    outputFile: "Output File",
    emptyGif: "आपका generated GIF यहां दिखेगा",
    invalidFile: "कृपया valid video file upload करें।",
    uploadSuccess: "Video successfully upload हो गई।",
    uploadFirst: "कृपया पहले video upload करें।",
    validTime: "कृपया valid start और end time डालें।",
    tooLarge:
      "GIF बहुत बड़ा हो जाएगा। Duration कम करें या FPS reduce करें।",
    createSuccess: "GIF successfully create हो गया।",
    createFailed: "GIF create नहीं हो पाया। Short clip try करें।",
    createFirst: "कृपया पहले GIF create करें।",
    downloadStarted: "Download started.",
    unknown: "Unknown",
    sec: "sec",
    seoTitle:
      "Free Video to GIF Creator Online - Video से GIF बनाएं | Convert Wala",
    seoDescription:
      "Convert Wala Video to GIF Creator से video को online GIF में convert करें। Start time, end time, FPS और size choose करके browser में GIF generate करें।",
    seoKeywords:
      "video to gif, gif creator, free gif maker, video se gif, online gif creator, video to gif converter, gif maker online, Convert Wala GIF tool",
  },

  hinglish: {
    eyebrow: "Convert Wala GIF Tool",
    title: "Video to GIF Creator",
    subtitle:
      "Video clip upload karo, start/end time, FPS aur size select karo, phir browser me real GIF file create karo.",
    uploadTitle: "Upload Video",
    changeVideo: "Change Video",
    uploadText: "3 se 12 seconds jaise short clips ke liye best.",
    videoDetails: "Video Details",
    fileName: "File Name",
    originalSize: "Original Size",
    resolution: "Resolution",
    duration: "Duration",
    gifSettings: "GIF Settings",
    startTime: "Start Time",
    endTime: "End Time",
    gifWidth: "GIF Width",
    fps: "FPS",
    colors: "Colors",
    output: "Output",
    creatingGif: "Creating GIF...",
    createGif: "Create GIF",
    downloadGif: "Download GIF",
    note:
      "GIF me audio nahi hota. Long video se GIF file bahut heavy ban sakti hai, isliye short clip use karo.",
    preview: "Preview",
    uploadPreview: "Preview dekhne ke liye video upload karo",
    progress: "GIF Creation Progress",
    gifSize: "GIF Size",
    width: "Width",
    outputFile: "Output File",
    emptyGif: "Tumhara generated GIF yahan show hoga",
    invalidFile: "Please valid video file upload karo.",
    uploadSuccess: "Video successfully upload ho gayi.",
    uploadFirst: "Please pehle video upload karo.",
    validTime: "Please valid start aur end time enter karo.",
    tooLarge:
      "GIF bahut bada ho jayega. Duration kam karo ya FPS reduce karo.",
    createSuccess: "GIF successfully create ho gaya.",
    createFailed: "GIF create nahi ho paya. Short clip try karo.",
    createFirst: "Please pehle GIF create karo.",
    downloadStarted: "Download started.",
    unknown: "Unknown",
    sec: "sec",
    seoTitle:
      "Free Video to GIF Creator Online - Make GIF from Video | Convert Wala",
    seoDescription:
      "Convert Wala Video to GIF Creator se video ko GIF me convert karo. Start time, end time, FPS aur size choose karke directly browser me GIF generate karo.",
    seoKeywords:
      "video to gif, gif creator, free gif maker, online gif creator, video to gif converter, make gif from video, create gif online, Convert Wala GIF tool",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "video") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

const waitForMetadata = (video) => {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 1) {
      resolve();
      return;
    }

    video.onloadedmetadata = resolve;
    video.onerror = reject;
  });
};

const waitForSeek = (video) => {
  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener("seeked", done);
      resolve();
    };

    video.addEventListener("seeked", done, { once: true });
    setTimeout(resolve, 450);
  });
};

export default function GifCreator() {
  const previewRef = useRef(null);
  const canvasRef = useRef(null);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [gifBlob, setGifBlob] = useState(null);

  const [videoInfo, setVideoInfo] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState("");
  const [width, setWidth] = useState(360);
  const [fps, setFps] = useState(8);
  const [quality, setQuality] = useState(128);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/gif-creator";

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
    setTimeout(() => setToast(null), 2800);
  };

  const clearGif = () => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl("");
    setGifBlob(null);
    setProgress(0);
  };

  const resetAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);

    setFile(null);
    setVideoUrl("");
    setGifUrl("");
    setGifBlob(null);
    setVideoInfo(null);
    setStartTime(0);
    setEndTime("");
    setWidth(360);
    setFps(8);
    setQuality(128);
    setProcessing(false);
    setProgress(0);
  };

  const handleUpload = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      showToast("error", t.invalidFile);
      return;
    }

    resetAll();

    const url = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setVideoUrl(url);

    setVideoInfo({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type || t.unknown,
      width: "-",
      height: "-",
      duration: "-",
    });

    showToast("success", t.uploadSuccess);
    e.target.value = "";
  };

  const handleLoadedMetadata = () => {
    const video = previewRef.current;

    if (!video || !file) return;

    const duration = video.duration || 0;

    setVideoInfo({
      name: file.name,
      size: file.size,
      type: file.type || t.unknown,
      width: video.videoWidth,
      height: video.videoHeight,
      duration,
    });

    const defaultEnd = Math.min(duration, 5);
    setEndTime(Number(defaultEnd.toFixed(2)));

    if (video.videoWidth <= 360) {
      setWidth(video.videoWidth);
    }
  };

  const createGif = async () => {
    if (!file || !videoUrl) {
      showToast("error", t.uploadFirst);
      return;
    }

    const start = Number(startTime);
    const end = Number(endTime);

    if (!end || end <= start) {
      showToast("error", t.validTime);
      return;
    }

    const clipDuration = end - start;
    const totalFrames = Math.ceil(clipDuration * Number(fps));

    if (totalFrames > 180) {
      showToast("error", t.tooLarge);
      return;
    }

    try {
      clearGif();
      setProcessing(true);
      setProgress(0);

      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;

      await waitForMetadata(video);

      const outputWidth = Number(width);
      const outputHeight = Math.round(
        (outputWidth / video.videoWidth) * video.videoHeight
      );

      const canvas = canvasRef.current;
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const gif = GIFEncoder();
      const delay = Math.round(1000 / Number(fps));

      for (let i = 0; i < totalFrames; i++) {
        const currentTime = start + i / Number(fps);

        video.currentTime = currentTime;
        await waitForSeek(video);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, outputWidth, outputHeight);
        ctx.drawImage(video, 0, 0, outputWidth, outputHeight);

        const imageData = ctx.getImageData(0, 0, outputWidth, outputHeight);
        const palette = quantize(imageData.data, Number(quality));
        const index = applyPalette(imageData.data, palette);

        gif.writeFrame(index, outputWidth, outputHeight, {
          palette,
          delay,
        });

        setProgress(Math.round(((i + 1) / totalFrames) * 100));

        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      gif.finish();

      const bytes = gif.bytes();
      const blob = new Blob([bytes], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      setGifBlob(blob);
      setGifUrl(url);
      setProcessing(false);
      setProgress(100);

      showToast("success", t.createSuccess);
    } catch (error) {
      setProcessing(false);
      showToast("error", t.createFailed);
    }
  };

  const downloadGif = () => {
    if (!gifBlob || !gifUrl || !file) {
      showToast("error", t.createFirst);
      return;
    }

    const name = cleanFileName(file.name);
    const outputName = `Convert Wala_${name}_gif.gif`;

    const link = document.createElement("a");
    link.href = gifUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  return (
    <main className={`gc-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Video to GIF Creator",
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
              "Convert video to GIF",
              "Create GIF from video online",
              "Choose start and end time",
              "Adjust GIF FPS",
              "Adjust GIF width",
              "Browser-based GIF creation",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .gc-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .gc-page * {
          box-sizing: border-box;
        }

        .gc-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .gc-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .gc-page.dark .gc-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .gc-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .gc-page.dark .gc-eyebrow {
          color: #93c5fd;
        }

        .gc-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .gc-page.dark .gc-hero h1 {
          color: #f8fafc;
        }

        .gc-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .gc-page.dark .gc-hero p,
        .gc-page.dark .gc-upload p,
        .gc-page.dark .gc-note,
        .gc-page.dark .gc-info-grid span,
        .gc-page.dark .gc-result-grid span,
        .gc-page.dark .gc-empty {
          color: #cbd5e1;
        }

        .gc-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .gc-left,
        .gc-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .gc-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .gc-page.dark .gc-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .gc-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
        }

        .gc-upload input {
          display: none;
        }

        .gc-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .gc-page.dark .gc-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .gc-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .gc-upload strong,
        .gc-card h3,
        .gc-info-grid strong,
        .gc-result-grid strong {
          color: #0f172a;
        }

        .gc-page.dark .gc-upload strong,
        .gc-page.dark .gc-card h3,
        .gc-page.dark .gc-info-grid strong,
        .gc-page.dark .gc-result-grid strong,
        .gc-page.dark .gc-field,
        .gc-page.dark .gc-progress-head {
          color: #f8fafc;
        }

        .gc-upload p,
        .gc-note {
          color: #64748b;
          line-height: 1.6;
        }

        .gc-card h3 {
          margin: 0 0 16px;
          font-size: 1.2rem;
        }

        .gc-info-grid,
        .gc-form-grid,
        .gc-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .gc-info-grid div,
        .gc-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .gc-page.dark .gc-info-grid div,
        .gc-page.dark .gc-result-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .gc-info-grid span,
        .gc-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .gc-info-grid strong,
        .gc-result-grid strong {
          font-size: 0.95rem;
          word-break: break-word;
        }

        .gc-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .gc-field input,
        .gc-field select {
          width: 100%;
          margin-top: 8px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 16px;
          padding: 13px 15px;
          outline: none;
          font-weight: 800;
        }

        .gc-page.dark .gc-field input,
        .gc-page.dark .gc-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .gc-page.dark .gc-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .gc-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .gc-primary,
        .gc-dark {
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
          flex: 1;
        }

        .gc-primary {
          background: #2563eb;
          color: #fff;
        }

        .gc-dark {
          background: #111827;
          color: #fff;
        }

        .gc-page.dark .gc-dark {
          background: #38bdf8;
          color: #020617;
        }

        .gc-primary:disabled,
        .gc-dark:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .gc-video-box {
          background: #020617;
          border-radius: 24px;
          overflow: hidden;
        }

        .gc-video-box video {
          width: 100%;
          max-height: 520px;
          display: block;
          background: #020617;
        }

        .gc-canvas {
          display: none;
        }

        .gc-progress-wrap {
          margin-top: 20px;
        }

        .gc-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .gc-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .gc-page.dark .gc-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .gc-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
        }

        .gc-page.dark .gc-progress span {
          background: #38bdf8;
        }

        .gc-gif-preview {
          margin-top: 20px;
          background:
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
          background-size: 28px 28px;
          background-position: 0 0, 0 14px, 14px -14px, -14px 0;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 20px;
          display: grid;
          place-items: center;
        }

        .gc-page.dark .gc-gif-preview {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .gc-gif-preview img {
          max-width: 100%;
          max-height: 520px;
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);
        }

        .gc-empty {
          padding: 80px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .gc-empty svg {
          width: 64px;
          height: 64px;
        }

        .gc-toast {
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

        .gc-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .gc-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .gc-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .gc-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .gc-hero {
            padding: 56px 5% 34px;
          }

          .gc-shell {
            padding: 34px 5% 60px;
          }

          .gc-info-grid,
          .gc-form-grid,
          .gc-result-grid {
            grid-template-columns: 1fr;
          }

          .gc-actions {
            flex-direction: column;
          }

          .gc-toast {
            left: 16px;
            right: 16px;
            top: 88px;
            min-width: unset;
          }
        }
      `}</style>

      {toast && (
        <div className={`gc-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="gc-hero">
        <p className="gc-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="gc-shell">
        <div className="gc-left">
          <label className="gc-card gc-upload">
            <input type="file" accept="video/*" onChange={handleUpload} />
            <span className="gc-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changeVideo : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {videoInfo && (
            <div className="gc-card">
              <h3>{t.videoDetails}</h3>

              <div className="gc-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{videoInfo.name}</strong>
                </div>

                <div>
                  <span>{t.originalSize}</span>
                  <strong>{formatBytes(videoInfo.size)}</strong>
                </div>

                <div>
                  <span>{t.resolution}</span>
                  <strong>
                    {videoInfo.width} × {videoInfo.height}
                  </strong>
                </div>

                <div>
                  <span>{t.duration}</span>
                  <strong>
                    {typeof videoInfo.duration === "number"
                      ? `${videoInfo.duration.toFixed(1)} ${t.sec}`
                      : videoInfo.duration}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="gc-card">
            <h3>{t.gifSettings}</h3>

            <div className="gc-form-grid">
              <label className="gc-field">
                {t.startTime}
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    clearGif();
                  }}
                />
              </label>

              <label className="gc-field">
                {t.endTime}
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    clearGif();
                  }}
                />
              </label>

              <label className="gc-field">
                {t.gifWidth}
                <select
                  value={width}
                  onChange={(e) => {
                    setWidth(Number(e.target.value));
                    clearGif();
                  }}
                >
                  <option value="240">240px Small</option>
                  <option value="320">320px</option>
                  <option value="360">360px Recommended</option>
                  <option value="480">480px Large</option>
                  <option value="640">640px HD</option>
                </select>
              </label>

              <label className="gc-field">
                {t.fps}
                <select
                  value={fps}
                  onChange={(e) => {
                    setFps(Number(e.target.value));
                    clearGif();
                  }}
                >
                  <option value="5">5 FPS Small</option>
                  <option value="8">8 FPS Recommended</option>
                  <option value="10">10 FPS Smooth</option>
                  <option value="12">12 FPS High</option>
                  <option value="15">15 FPS Very Smooth</option>
                </select>
              </label>

              <label className="gc-field">
                {t.colors}
                <select
                  value={quality}
                  onChange={(e) => {
                    setQuality(Number(e.target.value));
                    clearGif();
                  }}
                >
                  <option value="64">64 Colors Small Size</option>
                  <option value="128">128 Colors Balanced</option>
                  <option value="256">256 Colors Better Quality</option>
                </select>
              </label>

              <label className="gc-field">
                {t.output}
                <input value="GIF" disabled readOnly />
              </label>
            </div>

            <div className="gc-actions">
              <button
                type="button"
                className="gc-primary"
                onClick={createGif}
                disabled={!file || processing}
              >
                <RefreshCcw />
                {processing ? t.creatingGif : t.createGif}
              </button>

              <button
                type="button"
                className="gc-dark"
                onClick={downloadGif}
                disabled={!gifBlob}
              >
                <Download />
                {t.downloadGif}
              </button>
            </div>

            <p className="gc-note">{t.note}</p>
          </div>
        </div>

        <div className="gc-right">
          <div className="gc-card">
            <h3>{t.preview}</h3>

            <div className="gc-video-box">
              {videoUrl ? (
                <video
                  ref={previewRef}
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                />
              ) : (
                <div className="gc-empty">
                  <Video />
                  <p>{t.uploadPreview}</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="gc-canvas" />

            {(processing || progress > 0) && (
              <div className="gc-progress-wrap">
                <div className="gc-progress-head">
                  <span>{t.progress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="gc-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {gifBlob && (
              <>
                <div className="gc-gif-preview">
                  <img src={gifUrl} alt="Generated GIF" />
                </div>

                <div className="gc-result-grid" style={{ marginTop: 16 }}>
                  <div>
                    <span>{t.gifSize}</span>
                    <strong>{formatBytes(gifBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.fps}</span>
                    <strong>{fps} FPS</strong>
                  </div>

                  <div>
                    <span>{t.width}</span>
                    <strong>{width}px</strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "video")}_gif.gif
                    </strong>
                  </div>
                </div>
              </>
            )}

            {!gifBlob && !processing && (
              <div className="gc-empty">
                <ImageIcon />
                <p>{t.emptyGif}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
