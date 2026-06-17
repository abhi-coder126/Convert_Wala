import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Music,
  Video,
  Square,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const audioFormats = [
  {
    label: "WEBM Audio",
    value: "webm",
    ext: "webm",
    candidates: ["audio/webm;codecs=opus", "audio/webm"],
  },
  {
    label: "OGG Audio",
    value: "ogg",
    ext: "ogg",
    candidates: ["audio/ogg;codecs=opus", "audio/ogg"],
  },
];

const pageText = {
  en: {
    eyebrow: "Convert Wala Audio Tool",
    title: "Video to Audio Converter",
    subtitle:
      "Upload video and extract audio directly in browser. Your file is not uploaded anywhere.",
    uploadTitle: "Upload Video",
    changeVideo: "Change Video",
    uploadText: "Supports MP4, WEBM, MOV and browser playable video files.",
    videoDetails: "Video Details",
    fileName: "File Name",
    videoSize: "Video Size",
    resolution: "Resolution",
    duration: "Duration",
    audioSettings: "Audio Settings",
    outputFormat: "Output Format",
    audioQuality: "Audio Quality",
    extractAudio: "Extract Audio",
    stop: "Stop",
    downloadAudio: "Download Audio",
    note:
      "Audio extraction video ki duration ke hisaab se chalega. 30 sec video me around 30 sec lag sakte hain.",
    preview: "Preview",
    uploadPreview: "Upload video to preview",
    extractionProgress: "Extraction Progress",
    originalVideoSize: "Original Video Size",
    audioSize: "Audio Size",
    outputFile: "Output File",
    invalidFile: "Please upload a valid video file.",
    uploadSuccess: "Video uploaded successfully.",
    uploadFirst: "Please upload video first.",
    browserNotSupport:
      "Your browser does not support audio extraction. Use Chrome.",
    formatNotSupport: "not supported in this browser.",
    extractionFailed: "Audio extraction failed.",
    blankAudio: "Blank audio bana. Dusra video try karo.",
    extractFailed: "Audio extract nahi ho paya. Chrome me try karo.",
    stopped: "Extraction stopped.",
    extractFirst: "Please extract audio first.",
    downloadStarted: "Download started.",
    unknown: "Unknown",
    sec: "sec",
    seoTitle:
      "Free Video to Audio Converter Online - Extract Audio from Video | Convert Wala",
    seoDescription:
      "Use Convert Wala free Video to Audio Converter to extract audio from MP4, WEBM, MOV and browser playable videos directly in your browser. Convert video to WEBM or OGG audio online.",
    seoKeywords:
      "video to audio converter, extract audio from video, free video to audio converter, online audio extractor, MP4 to audio, video audio converter, WEBM audio converter, OGG audio converter, Convert Wala audio tools",
  },

  hi: {
    eyebrow: "Convert Wala ऑडियो टूल",
    title: "वीडियो से ऑडियो कन्वर्टर",
    subtitle:
      "वीडियो अपलोड करें और audio directly browser में extract करें। आपकी file कहीं upload नहीं होती।",
    uploadTitle: "वीडियो अपलोड करें",
    changeVideo: "वीडियो बदलें",
    uploadText: "MP4, WEBM, MOV और browser playable video files supported हैं।",
    videoDetails: "वीडियो जानकारी",
    fileName: "File Name",
    videoSize: "Video Size",
    resolution: "Resolution",
    duration: "Duration",
    audioSettings: "Audio Settings",
    outputFormat: "Output Format",
    audioQuality: "Audio Quality",
    extractAudio: "Audio Extract करें",
    stop: "Stop",
    downloadAudio: "Audio Download करें",
    note:
      "Audio extraction video की duration के हिसाब से चलेगा। 30 sec video में around 30 sec लग सकते हैं।",
    preview: "Preview",
    uploadPreview: "Preview देखने के लिए video upload करें",
    extractionProgress: "Extraction Progress",
    originalVideoSize: "Original Video Size",
    audioSize: "Audio Size",
    outputFile: "Output File",
    invalidFile: "कृपया valid video file upload करें।",
    uploadSuccess: "Video successfully upload हो गई।",
    uploadFirst: "कृपया पहले video upload करें।",
    browserNotSupport:
      "आपका browser audio extraction support नहीं करता। Chrome use करें।",
    formatNotSupport: "इस browser में supported नहीं है।",
    extractionFailed: "Audio extraction failed.",
    blankAudio: "Blank audio बना। दूसरी video try करें।",
    extractFailed: "Audio extract नहीं हो पाया। Chrome में try करें।",
    stopped: "Extraction stopped.",
    extractFirst: "कृपया पहले audio extract करें।",
    downloadStarted: "Download started.",
    unknown: "Unknown",
    sec: "sec",
    seoTitle:
      "Free Video to Audio Converter Online - Video से Audio Extract करें | Convert Wala",
    seoDescription:
      "Convert Wala free Video to Audio Converter से MP4, WEBM, MOV और browser playable videos से audio directly browser में extract करें। Video को WEBM या OGG audio में convert करें।",
    seoKeywords:
      "video to audio converter, video se audio extract, free audio extractor, online video to audio, MP4 to audio, WEBM audio converter, OGG audio converter, Convert Wala audio tools",
  },

  hinglish: {
    eyebrow: "Convert Wala Audio Tool",
    title: "Video to Audio Converter",
    subtitle:
      "Video upload karo aur audio directly browser me extract karo. Tumhari file kahin upload nahi hoti.",
    uploadTitle: "Upload Video",
    changeVideo: "Change Video",
    uploadText: "MP4, WEBM, MOV aur browser playable video files support karta hai.",
    videoDetails: "Video Details",
    fileName: "File Name",
    videoSize: "Video Size",
    resolution: "Resolution",
    duration: "Duration",
    audioSettings: "Audio Settings",
    outputFormat: "Output Format",
    audioQuality: "Audio Quality",
    extractAudio: "Extract Audio",
    stop: "Stop",
    downloadAudio: "Download Audio",
    note:
      "Audio extraction video ki duration ke hisaab se chalega. 30 sec video me around 30 sec lag sakte hain.",
    preview: "Preview",
    uploadPreview: "Preview dekhne ke liye video upload karo",
    extractionProgress: "Extraction Progress",
    originalVideoSize: "Original Video Size",
    audioSize: "Audio Size",
    outputFile: "Output File",
    invalidFile: "Please valid video file upload karo.",
    uploadSuccess: "Video successfully upload ho gayi.",
    uploadFirst: "Please pehle video upload karo.",
    browserNotSupport:
      "Tumhara browser audio extraction support nahi karta. Chrome use karo.",
    formatNotSupport: "is browser me supported nahi hai.",
    extractionFailed: "Audio extraction failed.",
    blankAudio: "Blank audio bana. Dusra video try karo.",
    extractFailed: "Audio extract nahi ho paya. Chrome me try karo.",
    stopped: "Extraction stopped.",
    extractFirst: "Please pehle audio extract karo.",
    downloadStarted: "Download started.",
    unknown: "Unknown",
    sec: "sec",
    seoTitle:
      "Free Video to Audio Converter Online - Extract Audio from Video | Convert Wala",
    seoDescription:
      "Convert Wala free Video to Audio Converter se MP4, WEBM, MOV aur browser playable videos se audio directly browser me extract karo. Video ko WEBM ya OGG audio me convert karo.",
    seoKeywords:
      "video to audio converter, extract audio from video, free video to audio converter, online audio extractor, MP4 to audio, video audio converter, WEBM audio converter, OGG audio converter, Convert Wala audio tools",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "audio") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

const getSupportedMime = (formatValue) => {
  if (!window.MediaRecorder) return "";

  const item = audioFormats.find((f) => f.value === formatValue);

  if (!item) return "";

  return item.candidates.find((mime) => MediaRecorder.isTypeSupported(mime)) || "";
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

export default function VideoToAudio() {
  const navigate = useNavigate();

  const previewVideoRef = useRef(null);
  const tempVideoRef = useRef(null);
  const recorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);

  const [videoInfo, setVideoInfo] = useState(null);
  const [format, setFormat] = useState("webm");
  const [bitrate, setBitrate] = useState(128000);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const selectedFormat = audioFormats.find((item) => item.value === format);
  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/video-to-audio";

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

  const clearAudio = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setAudioBlob(null);
    setProgress(0);
  };

  const resetAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    if (timerRef.current) clearInterval(timerRef.current);

    tempVideoRef.current?.pause();
    audioContextRef.current?.close?.();

    setFile(null);
    setVideoUrl("");
    setAudioUrl("");
    setAudioBlob(null);
    setVideoInfo(null);
    setProgress(0);
    setProcessing(false);
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
    const video = previewVideoRef.current;

    if (!video || !file) return;

    setVideoInfo({
      name: file.name,
      size: file.size,
      type: file.type || t.unknown,
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
    });
  };

  const extractAudio = async () => {
    if (!file || !videoUrl) {
      showToast("error", t.uploadFirst);
      return;
    }

    if (!window.MediaRecorder) {
      showToast("error", t.browserNotSupport);
      return;
    }

    const mimeType = getSupportedMime(format);

    if (!mimeType) {
      showToast(
        "error",
        `${selectedFormat?.label || "Selected format"} ${t.formatNotSupport}`
      );
      return;
    }

    try {
      clearAudio();
      chunksRef.current = [];

      setProcessing(true);
      setProgress(0);

      const tempVideo = document.createElement("video");
      tempVideo.src = videoUrl;
      tempVideo.crossOrigin = "anonymous";
      tempVideo.preload = "auto";
      tempVideo.playsInline = true;

      tempVideoRef.current = tempVideo;

      await waitForMetadata(tempVideo);

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        throw new Error("AudioContext not supported");
      }

      const audioContext = new AudioContext();
      await audioContext.resume();

      audioContextRef.current = audioContext;

      const source = audioContext.createMediaElementSource(tempVideo);
      const destination = audioContext.createMediaStreamDestination();

      source.connect(destination);

      const audioTracks = destination.stream.getAudioTracks();

      if (!audioTracks.length) {
        throw new Error("No audio track found");
      }

      const recorder = new MediaRecorder(destination.stream, {
        mimeType,
        audioBitsPerSecond: Number(bitrate),
      });

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setProcessing(false);
        showToast("error", t.extractionFailed);
      };

      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (!blob.size) {
          setProcessing(false);
          showToast("error", t.blankAudio);
          return;
        }

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        setProgress(100);
        setProcessing(false);

        tempVideo.pause();
        tempVideo.src = "";

        try {
          await audioContext.close();
        } catch {}

        showToast("success", "Audio extracted successfully.");
      };

      tempVideo.onended = () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };

      timerRef.current = setInterval(() => {
        if (tempVideo.duration) {
          const percent = Math.min(
            (tempVideo.currentTime / tempVideo.duration) * 100,
            100
          );
          setProgress(percent);
        }
      }, 250);

      recorder.start(500);
      await tempVideo.play();
    } catch (error) {
      setProcessing(false);

      if (timerRef.current) clearInterval(timerRef.current);

      try {
        audioContextRef.current?.close?.();
      } catch {}

      showToast("error", t.extractFailed);
    }
  };

  const stopExtraction = () => {
    const recorder = recorderRef.current;

    tempVideoRef.current?.pause();

    if (timerRef.current) clearInterval(timerRef.current);

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setProcessing(false);
    showToast("success", t.stopped);
  };

  const downloadAudio = () => {
    if (!audioBlob || !audioUrl || !file || !selectedFormat) {
      showToast("error", t.extractFirst);
      return;
    }

    const name = cleanFileName(file.name);
    const fileName = `Convert Wala_${name}_audio.${selectedFormat.ext}`;

    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);

    setTimeout(() => {
      resetAll();
      navigate("/tools");
    }, 1200);
  };

  return (
    <main className={`vta-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Video to Audio Converter",
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
              "Extract audio from video",
              "Convert video to audio online",
              "WEBM audio output",
              "OGG audio output",
              "Browser-based audio extraction",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .vta-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .vta-page * {
          box-sizing: border-box;
        }

        .vta-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .vta-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .vta-page.dark .vta-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .vta-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vta-page.dark .vta-eyebrow {
          color: #93c5fd;
        }

        .vta-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .vta-page.dark .vta-hero h1 {
          color: #f8fafc;
        }

        .vta-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .vta-page.dark .vta-hero p,
        .vta-page.dark .vta-upload p,
        .vta-page.dark .vta-note,
        .vta-page.dark .vta-info-grid span,
        .vta-page.dark .vta-result-grid span {
          color: #cbd5e1;
        }

        .vta-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .vta-left,
        .vta-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .vta-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .vta-page.dark .vta-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .vta-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
        }

        .vta-upload input {
          display: none;
        }

        .vta-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .vta-page.dark .vta-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .vta-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .vta-upload strong,
        .vta-card h3,
        .vta-info-grid strong,
        .vta-result-grid strong {
          color: #0f172a;
        }

        .vta-page.dark .vta-upload strong,
        .vta-page.dark .vta-card h3,
        .vta-page.dark .vta-info-grid strong,
        .vta-page.dark .vta-result-grid strong,
        .vta-page.dark .vta-field,
        .vta-page.dark .vta-progress-head {
          color: #f8fafc;
        }

        .vta-upload p,
        .vta-note {
          color: #64748b;
          line-height: 1.6;
        }

        .vta-card h3 {
          margin: 0 0 16px;
          font-size: 1.2rem;
        }

        .vta-info-grid,
        .vta-result-grid,
        .vta-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .vta-info-grid div,
        .vta-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .vta-page.dark .vta-info-grid div,
        .vta-page.dark .vta-result-grid div,
        .vta-page.dark .vta-audio-box {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .vta-info-grid span,
        .vta-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .vta-info-grid strong,
        .vta-result-grid strong {
          font-size: 0.95rem;
          word-break: break-word;
        }

        .vta-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .vta-field select,
        .vta-field input {
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

        .vta-page.dark .vta-field select,
        .vta-page.dark .vta-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vta-page.dark .vta-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .vta-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .vta-primary,
        .vta-dark,
        .vta-danger {
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

        .vta-primary {
          background: #2563eb;
          color: #fff;
        }

        .vta-dark {
          background: #111827;
          color: #fff;
        }

        .vta-page.dark .vta-dark {
          background: #38bdf8;
          color: #020617;
        }

        .vta-danger {
          background: #dc2626;
          color: #fff;
        }

        .vta-primary:disabled,
        .vta-dark:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .vta-video-box {
          background: #020617;
          border-radius: 24px;
          overflow: hidden;
        }

        .vta-video-box video {
          width: 100%;
          max-height: 520px;
          display: block;
          background: #020617;
        }

        .vta-empty-preview {
          padding: 80px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .vta-empty-preview svg {
          margin-bottom: 10px;
        }

        .vta-audio-box {
          margin-top: 20px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
        }

        .vta-audio-box svg {
          color: #2563eb;
          margin-bottom: 12px;
        }

        .vta-page.dark .vta-audio-box svg {
          color: #38bdf8;
        }

        .vta-audio-box audio {
          width: 100%;
        }

        .vta-progress-wrap {
          margin-top: 20px;
        }

        .vta-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .vta-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .vta-page.dark .vta-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .vta-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
        }

        .vta-page.dark .vta-progress span {
          background: #38bdf8;
        }

        .vta-toast {
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

        .vta-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .vta-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .vta-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .vta-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .vta-hero {
            padding: 56px 5% 34px;
          }

          .vta-shell {
            padding: 34px 5% 60px;
          }

          .vta-info-grid,
          .vta-result-grid,
          .vta-form-grid {
            grid-template-columns: 1fr;
          }

          .vta-actions {
            flex-direction: column;
          }

          .vta-toast {
            left: 16px;
            right: 16px;
            top: 88px;
            min-width: unset;
          }
        }
      `}</style>

      {toast && (
        <div className={`vta-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="vta-hero">
        <p className="vta-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="vta-shell">
        <div className="vta-left">
          <label className="vta-card vta-upload">
            <input type="file" accept="video/*" onChange={handleUpload} />
            <span className="vta-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changeVideo : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {videoInfo && (
            <div className="vta-card">
              <h3>{t.videoDetails}</h3>

              <div className="vta-info-grid">
                <div>
                  <span>{t.fileName}</span>
                  <strong>{videoInfo.name}</strong>
                </div>

                <div>
                  <span>{t.videoSize}</span>
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

          <div className="vta-card">
            <h3>{t.audioSettings}</h3>

            <div className="vta-form-grid">
              <label className="vta-field">
                {t.outputFormat}
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    clearAudio();
                  }}
                >
                  <option value="webm">WEBM Audio</option>
                  <option value="ogg">OGG Audio</option>
                </select>
              </label>

              <label className="vta-field">
                {t.audioQuality}
                <select
                  value={bitrate}
                  onChange={(e) => {
                    setBitrate(Number(e.target.value));
                    clearAudio();
                  }}
                >
                  <option value="64000">64 kbps Small</option>
                  <option value="96000">96 kbps Balanced</option>
                  <option value="128000">128 kbps Good</option>
                  <option value="192000">192 kbps High</option>
                </select>
              </label>
            </div>

            <div className="vta-actions">
              {!processing ? (
                <button
                  type="button"
                  className="vta-primary"
                  onClick={extractAudio}
                  disabled={!file}
                >
                  <RefreshCcw />
                  {t.extractAudio}
                </button>
              ) : (
                <button
                  type="button"
                  className="vta-danger"
                  onClick={stopExtraction}
                >
                  <Square />
                  {t.stop}
                </button>
              )}

              <button
                type="button"
                className="vta-dark"
                onClick={downloadAudio}
                disabled={!audioBlob}
              >
                <Download />
                {t.downloadAudio}
              </button>
            </div>

            <p className="vta-note">{t.note}</p>
          </div>
        </div>

        <div className="vta-right">
          <div className="vta-card">
            <h3>{t.preview}</h3>

            <div className="vta-video-box">
              {videoUrl ? (
                <video
                  ref={previewVideoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                />
              ) : (
                <div className="vta-empty-preview">
                  <Video size={64} />
                  <p>{t.uploadPreview}</p>
                </div>
              )}
            </div>

            {(processing || progress > 0) && (
              <div className="vta-progress-wrap">
                <div className="vta-progress-head">
                  <span>{t.extractionProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="vta-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {audioBlob && (
              <>
                <div className="vta-audio-box">
                  <Music />
                  <audio src={audioUrl} controls />
                </div>

                <div className="vta-result-grid" style={{ marginTop: 16 }}>
                  <div>
                    <span>{t.originalVideoSize}</span>
                    <strong>{formatBytes(file?.size)}</strong>
                  </div>

                  <div>
                    <span>{t.audioSize}</span>
                    <strong>{formatBytes(audioBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.outputFormat}</span>
                    <strong>{selectedFormat?.label}</strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "audio")}_audio.
                      {selectedFormat?.ext}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}