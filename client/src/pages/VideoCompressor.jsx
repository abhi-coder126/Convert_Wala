import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Video,
  Square,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala Video Tool",
    title: "Video Compressor",
    subtitle:
      "Upload video, reduce size and download compressed WEBM video. Use Chrome for best result.",
    uploadTitle: "Upload Video",
    changeVideo: "Change Video",
    uploadText: "MP4, WEBM, MOV and browser playable video files.",
    videoDetails: "Video Details",
    fileName: "File Name",
    originalSize: "Original Size",
    resolution: "Resolution",
    duration: "Duration",
    compressionSettings: "Compression Settings",
    maxWidth: "Max Width",
    fps: "FPS",
    bitrate: "Bitrate",
    output: "Output",
    includeAudio: "Include audio",
    compressVideo: "Compress Video",
    stop: "Stop",
    download: "Download",
    note: "Output will be WEBM. Browser-only MP4 compression is not stable.",
    preview: "Preview",
    uploadPreview: "Upload video to preview",
    progress: "Compression Progress",
    compressedSize: "Compressed Size",
    reduced: "Reduced",
    outputFile: "Output File",
    invalidFile: "Please upload a valid video file.",
    uploadSuccess: "Video uploaded successfully.",
    uploadFirst: "Please upload a video first.",
    browserNotSupport: "Your browser does not support this compressor. Use Chrome.",
    webmNotSupport: "WEBM recording is not supported in this browser.",
    audioFailed: "Audio could not be added, video will compress without audio.",
    compressionFailed: "Compression failed.",
    outputBlank: "Output is blank. Try another video or use Chrome.",
    compressedSuccess: "Video compressed successfully.",
    startFailed: "Video compression could not start. Try in Chrome.",
    compressFirst: "Please compress video first.",
    downloadStarted: "Download started.",
    unknown: "Unknown",
  },

  hi: {
    eyebrow: "Convert Wala वीडियो टूल",
    title: "वीडियो Compressor",
    subtitle:
      "वीडियो अपलोड करें, size कम करें और compressed WEBM वीडियो download करें। Best result के लिए Chrome use करें।",
    uploadTitle: "वीडियो अपलोड करें",
    changeVideo: "वीडियो बदलें",
    uploadText: "MP4, WEBM, MOV और browser playable video files supported हैं।",
    videoDetails: "वीडियो जानकारी",
    fileName: "File Name",
    originalSize: "Original Size",
    resolution: "Resolution",
    duration: "Duration",
    compressionSettings: "Compression Settings",
    maxWidth: "Max Width",
    fps: "FPS",
    bitrate: "Bitrate",
    output: "Output",
    includeAudio: "Audio शामिल करें",
    compressVideo: "Video Compress करें",
    stop: "Stop",
    download: "Download",
    note: "Output WEBM में आएगा। Browser-only MP4 compression stable नहीं होता।",
    preview: "Preview",
    uploadPreview: "Preview देखने के लिए video upload करें",
    progress: "Compression Progress",
    compressedSize: "Compressed Size",
    reduced: "Reduced",
    outputFile: "Output File",
    invalidFile: "कृपया valid video file upload करें।",
    uploadSuccess: "Video successfully upload हो गई।",
    uploadFirst: "कृपया पहले video upload करें।",
    browserNotSupport: "आपका browser इस compressor को support नहीं करता। Chrome use करें।",
    webmNotSupport: "इस browser में WEBM recording supported नहीं है।",
    audioFailed: "Audio add नहीं हो पाया, video without audio compress होगी।",
    compressionFailed: "Compression failed.",
    outputBlank: "Output blank बना। दूसरी video try करें या Chrome use करें।",
    compressedSuccess: "Video successfully compress हो गई।",
    startFailed: "Video compression start नहीं हो पाई। Chrome में try करें।",
    compressFirst: "कृपया पहले video compress करें।",
    downloadStarted: "Download started.",
    unknown: "Unknown",
  },

  hinglish: {
    eyebrow: "Convert Wala Video Tool",
    title: "Video Compressor",
    subtitle:
      "Video upload karo, size reduce karo aur compressed WEBM video download karo. Best result ke liye Chrome use karo.",
    uploadTitle: "Upload Video",
    changeVideo: "Change Video",
    uploadText: "MP4, WEBM, MOV aur browser playable video files support karta hai.",
    videoDetails: "Video Details",
    fileName: "File Name",
    originalSize: "Original Size",
    resolution: "Resolution",
    duration: "Duration",
    compressionSettings: "Compression Settings",
    maxWidth: "Max Width",
    fps: "FPS",
    bitrate: "Bitrate",
    output: "Output",
    includeAudio: "Include audio",
    compressVideo: "Compress Video",
    stop: "Stop",
    download: "Download",
    note: "Output WEBM me aayega. Browser-only MP4 compression stable nahi hota.",
    preview: "Preview",
    uploadPreview: "Preview dekhne ke liye video upload karo",
    progress: "Compression Progress",
    compressedSize: "Compressed Size",
    reduced: "Reduced",
    outputFile: "Output File",
    invalidFile: "Please valid video file upload karo.",
    uploadSuccess: "Video successfully upload ho gayi.",
    uploadFirst: "Please pehle video upload karo.",
    browserNotSupport: "Ye browser compressor support nahi karta. Chrome use karo.",
    webmNotSupport: "Is browser me WEBM recording supported nahi hai.",
    audioFailed: "Audio add nahi ho paya, video without audio compress hogi.",
    compressionFailed: "Compression failed.",
    outputBlank: "Output blank bana. Dusra video try karo ya Chrome use karo.",
    compressedSuccess: "Video successfully compress ho gayi.",
    startFailed: "Video compression start nahi ho payi. Chrome me try karo.",
    compressFirst: "Please pehle video compress karo.",
    downloadStarted: "Download started.",
    unknown: "Unknown",
  },
};
const seoText = {
  en: {
    title:
      "Free Video Compressor Online - Compress Video Files in Browser | Convert Wala",
    description:
      "Compress video files online for free with Convert Wala Video Compressor. Reduce MP4, WEBM, MOV and browser playable videos into smaller WEBM files directly in your browser.",
    keywords:
      "video compressor, free video compressor, online video compressor, compress video online, reduce video size, MP4 compressor, WEBM compressor, MOV compressor, video size reducer, browser video compressor, Convert Wala video tools",
  },

  hi: {
    title:
      "फ्री वीडियो Compressor Online - Video Size कम करें | Convert Wala",
    description:
      "Convert Wala Video Compressor से video files online free में compress करें। MP4, WEBM, MOV और browser playable videos का size कम करें और compressed WEBM download करें।",
    keywords:
      "वीडियो compressor, free video compressor, online video compressor, video size कम करें, MP4 compressor, WEBM compressor, MOV compressor, video size reducer, Convert Wala video tools",
  },

  hinglish: {
    title:
      "Free Video Compressor Online - Video Size Reduce Karo | Convert Wala",
    description:
      "Convert Wala Video Compressor se video files online free me compress karo. MP4, WEBM, MOV aur browser playable videos ka size reduce karke compressed WEBM download karo.",
    keywords:
      "video compressor, free video compressor, online video compressor, video size reduce karo, MP4 compressor, WEBM compressor, MOV compressor, Convert Wala video tools",
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

const getSupportedMime = () => {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

export default function VideoCompressor() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const animationRef = useRef(null);
  const recordingRef = useRef(false);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultBlob, setResultBlob] = useState(null);

  const [videoInfo, setVideoInfo] = useState(null);
  const [maxWidth, setMaxWidth] = useState(720);
  const [fps, setFps] = useState(24);
  const [bitrate, setBitrate] = useState(1200000);
  const [includeAudio, setIncludeAudio] = useState(true);

  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
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
    setTimeout(() => setToast(null), 2800);
  };

  const clearResult = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    setResultBlob(null);
    setProgress(0);
  };

  const resetAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    recordingRef.current = false;

    setFile(null);
    setVideoUrl("");
    setResultUrl("");
    setResultBlob(null);
    setVideoInfo(null);
    setProgress(0);
    setCompressing(false);
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
    const video = videoRef.current;

    if (!video || !file) return;

    setVideoInfo({
      name: file.name,
      size: file.size,
      type: file.type || t.unknown,
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
    });

    setMaxWidth(video.videoWidth > 720 ? 720 : video.videoWidth);
  };

  const drawLoop = (video, canvas, ctx) => {
    if (!recordingRef.current) return;

    if (!video.paused && !video.ended) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (video.duration) {
        const percent = Math.min((video.currentTime / video.duration) * 100, 100);
        setProgress(percent);
      }
    }

    animationRef.current = requestAnimationFrame(() => {
      drawLoop(video, canvas, ctx);
    });
  };

  const waitForSeek = (video) => {
    return new Promise((resolve) => {
      const done = () => {
        video.removeEventListener("seeked", done);
        resolve();
      };

      video.addEventListener("seeked", done, { once: true });

      setTimeout(resolve, 400);
    });
  };

  const compressVideo = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!file || !video || !canvas) {
      showToast("error", t.uploadFirst);
      return;
    }

    if (!window.MediaRecorder || !canvas.captureStream) {
      showToast("error", t.browserNotSupport);
      return;
    }

    const mimeType = getSupportedMime();

    if (!mimeType) {
      showToast("error", t.webmNotSupport);
      return;
    }

    try {
      clearResult();

      chunksRef.current = [];
      recordingRef.current = true;
      setCompressing(true);
      setProgress(0);

      const originalWidth = video.videoWidth || 1280;
      const originalHeight = video.videoHeight || 720;

      const targetWidth = Math.min(Number(maxWidth), originalWidth);
      const targetHeight = Math.round((targetWidth / originalWidth) * originalHeight);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d", { alpha: false });

      video.pause();

      if (video.currentTime !== 0) {
        video.currentTime = 0;
        await waitForSeek(video);
      }

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const canvasStream = canvas.captureStream(Number(fps));

      if (includeAudio && video.captureStream) {
        try {
          const videoStream = video.captureStream();
          const audioTracks = videoStream.getAudioTracks();

          audioTracks.forEach((track) => {
            canvasStream.addTrack(track);
          });
        } catch {
          showToast("error", t.audioFailed);
        }
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: Number(bitrate),
      });

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        recordingRef.current = false;
        setCompressing(false);
        showToast("error", t.compressionFailed);
      };

      recorder.onstop = () => {
        recordingRef.current = false;

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        const blob = new Blob(chunksRef.current, { type: "video/webm" });

        if (!blob.size) {
          setCompressing(false);
          showToast("error", t.outputBlank);
          return;
        }

        const url = URL.createObjectURL(blob);

        setResultBlob(blob);
        setResultUrl(url);
        setCompressing(false);
        setProgress(100);

        showToast("success", t.compressedSuccess);
      };

      video.onended = () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };

      recorder.start(300);
      drawLoop(video, canvas, ctx);

      await video.play();
    } catch (error) {
      recordingRef.current = false;
      setCompressing(false);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      showToast("error", t.startFailed);
    }
  };
  const seo = seoText[language] || seoText.en;
  const canonicalUrl = "https://www.convertwala.com/video-compressor";
  const stopCompression = () => {
    const video = videoRef.current;
    const recorder = recorderRef.current;

    recordingRef.current = false;

    if (video) video.pause();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setCompressing(false);
  };

  const downloadVideo = () => {
    if (!resultBlob || !resultUrl || !file) {
      showToast("error", t.compressFirst);
      return;
    }

    const name = cleanFileName(file.name);
    const finalName = `Convert Wala_${name}_compressed.webm`;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  const reduction =
    file?.size && resultBlob?.size
      ? Math.max(0, 100 - (resultBlob.size / file.size) * 100).toFixed(1)
      : null;

  return (
    <main className={`vc-page ${theme === "dark" ? "dark" : "light"}`}>

      <style>{`
        .vc-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .vc-page * {
          box-sizing: border-box;
        }

        .vc-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .vc-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .vc-page.dark .vc-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .vc-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vc-page.dark .vc-eyebrow {
          color: #93c5fd;
        }

        .vc-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .vc-page.dark .vc-hero h1 {
          color: #f8fafc;
        }

        .vc-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .vc-page.dark .vc-hero p,
        .vc-page.dark .vc-upload p,
        .vc-page.dark .vc-note,
        .vc-page.dark .vc-info-grid span,
        .vc-page.dark .vc-result-grid span {
          color: #cbd5e1;
        }

        .vc-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .vc-left,
        .vc-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .vc-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .vc-page.dark .vc-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .vc-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
        }

        .vc-upload input {
          display: none;
        }

        .vc-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .vc-page.dark .vc-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .vc-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .vc-upload strong,
        .vc-card h3,
        .vc-info-grid strong,
        .vc-result-grid strong {
          color: #0f172a;
        }

        .vc-page.dark .vc-upload strong,
        .vc-page.dark .vc-card h3,
        .vc-page.dark .vc-info-grid strong,
        .vc-page.dark .vc-result-grid strong,
        .vc-page.dark .vc-field,
        .vc-page.dark .vc-check,
        .vc-page.dark .vc-progress-head {
          color: #f8fafc;
        }

        .vc-upload p,
        .vc-note {
          color: #64748b;
          line-height: 1.6;
        }

        .vc-card h3 {
          margin: 0 0 16px;
          font-size: 1.2rem;
        }

        .vc-info-grid,
        .vc-result-grid,
        .vc-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .vc-info-grid div,
        .vc-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .vc-page.dark .vc-info-grid div,
        .vc-page.dark .vc-result-grid div {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .vc-info-grid span,
        .vc-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .vc-info-grid strong,
        .vc-result-grid strong {
          font-size: 0.95rem;
          word-break: break-word;
        }

        .vc-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .vc-field select,
        .vc-field input {
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

        .vc-page.dark .vc-field select,
        .vc-page.dark .vc-field input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vc-page.dark .vc-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .vc-check {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #334155;
          font-weight: 900;
        }

        .vc-check input {
          width: 18px;
          height: 18px;
          accent-color: #2563eb;
        }

        .vc-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .vc-primary,
        .vc-dark,
        .vc-danger {
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

        .vc-primary {
          background: #2563eb;
          color: #fff;
        }

        .vc-dark {
          background: #111827;
          color: #fff;
        }

        .vc-page.dark .vc-dark {
          background: #38bdf8;
          color: #020617;
        }

        .vc-danger {
          background: #dc2626;
          color: #fff;
        }

        .vc-primary:disabled,
        .vc-dark:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .vc-video-box {
          background: #020617;
          border-radius: 24px;
          overflow: hidden;
        }

        .vc-video-box video,
        .vc-result-video video {
          width: 100%;
          max-height: 520px;
          display: block;
          background: #020617;
        }

        .vc-empty-preview {
          padding: 80px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .vc-empty-preview svg {
          margin-bottom: 10px;
        }

        .vc-canvas {
          display: none;
        }

        .vc-progress-wrap {
          margin-top: 20px;
        }

        .vc-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .vc-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .vc-page.dark .vc-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .vc-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
        }

        .vc-page.dark .vc-progress span {
          background: #38bdf8;
        }

        .vc-result-video {
          margin-top: 20px;
          background: #020617;
          border-radius: 22px;
          overflow: hidden;
        }

        .vc-toast {
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

        .vc-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .vc-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .vc-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .vc-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .vc-hero {
            padding: 56px 5% 34px;
          }

          .vc-shell {
            padding: 34px 5% 60px;
          }

          .vc-info-grid,
          .vc-result-grid,
          .vc-form-grid {
            grid-template-columns: 1fr;
          }

          .vc-actions {
            flex-direction: column;
          }

          .vc-toast {
            left: 16px;
            right: 16px;
            top: 88px;
            min-width: unset;
          }
        }
      `}</style>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />

        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />

        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <meta name="application-name" content="Convert Wala" />
        <meta name="theme-color" content={theme === "dark" ? "#020617" : "#2563eb"} />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Convert Wala" />
        <meta property="og:locale" content={language === "hi" ? "hi_IN" : "en_US"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Video Compressor",
            url: canonicalUrl,
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires a modern browser with MediaRecorder support",
            description: seo.description,
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
              "Compress video online",
              "Reduce video file size",
              "Browser-based video compression",
              "WEBM output download",
              "Optional audio compression",
              "No software installation required",
            ],
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is this video compressor free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, Convert Wala Video Compressor is free to use online.",
                },
              },
              {
                "@type": "Question",
                name: "Which video formats are supported?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can upload browser playable video files such as MP4, WEBM, MOV and similar formats.",
                },
              },
              {
                "@type": "Question",
                name: "What is the output format?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The compressed video is downloaded in WEBM format for better browser compatibility.",
                },
              },
              {
                "@type": "Question",
                name: "Does this tool save my video?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The tool works in the browser and does not require uploading your video to a server.",
                },
              },
            ],
          })}
        </script>
      </Helmet>
      {toast && (
        <div className={`vc-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="vc-hero">
        <p className="vc-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="vc-shell">
        <div className="vc-left">
          <label className="vc-card vc-upload">
            <input type="file" accept="video/*" onChange={handleUpload} />
            <span className="vc-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changeVideo : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {videoInfo && (
            <div className="vc-card">
              <h3>{t.videoDetails}</h3>
              <div className="vc-info-grid">
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
                      ? `${videoInfo.duration.toFixed(1)} sec`
                      : videoInfo.duration}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="vc-card">
            <h3>{t.compressionSettings}</h3>

            <div className="vc-form-grid">
              <label className="vc-field">
                {t.maxWidth}
                <select
                  value={maxWidth}
                  onChange={(e) => {
                    setMaxWidth(Number(e.target.value));
                    clearResult();
                  }}
                >
                  <option value="360">360px Small</option>
                  <option value="480">480px Low</option>
                  <option value="720">720px Recommended</option>
                  <option value="1080">1080px High</option>
                </select>
              </label>

              <label className="vc-field">
                {t.fps}
                <select
                  value={fps}
                  onChange={(e) => {
                    setFps(Number(e.target.value));
                    clearResult();
                  }}
                >
                  <option value="15">15 FPS Small</option>
                  <option value="24">24 FPS Balanced</option>
                  <option value="30">30 FPS Smooth</option>
                </select>
              </label>

              <label className="vc-field">
                {t.bitrate}
                <select
                  value={bitrate}
                  onChange={(e) => {
                    setBitrate(Number(e.target.value));
                    clearResult();
                  }}
                >
                  <option value="500000">500 kbps Very Small</option>
                  <option value="900000">900 kbps Small</option>
                  <option value="1200000">1.2 Mbps Balanced</option>
                  <option value="2000000">2 Mbps Better</option>
                  <option value="3500000">3.5 Mbps High</option>
                </select>
              </label>

              <label className="vc-field">
                {t.output}
                <input value="WEBM" disabled readOnly />
              </label>
            </div>

            <label className="vc-check">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => {
                  setIncludeAudio(e.target.checked);
                  clearResult();
                }}
              />
              {t.includeAudio}
            </label>

            <div className="vc-actions">
              {!compressing ? (
                <button
                  type="button"
                  className="vc-primary"
                  onClick={compressVideo}
                  disabled={!file}
                >
                  <RefreshCcw />
                  {t.compressVideo}
                </button>
              ) : (
                <button type="button" className="vc-danger" onClick={stopCompression}>
                  <Square />
                  {t.stop}
                </button>
              )}

              <button
                type="button"
                className="vc-dark"
                onClick={downloadVideo}
                disabled={!resultBlob}
              >
                <Download />
                {t.download}
              </button>
            </div>

            <p className="vc-note">{t.note}</p>
          </div>
        </div>

        <div className="vc-right">
          <div className="vc-card">
            <h3>{t.preview}</h3>

            <div className="vc-video-box">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                />
              ) : (
                <div className="vc-empty-preview">
                  <Video size={64} />
                  <p>{t.uploadPreview}</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="vc-canvas" />

            {(compressing || progress > 0) && (
              <div className="vc-progress-wrap">
                <div className="vc-progress-head">
                  <span>{t.progress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>
                <div className="vc-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {resultBlob && (
              <>
                <div className="vc-result-video">
                  <video src={resultUrl} controls playsInline />
                </div>

                <div className="vc-result-grid" style={{ marginTop: 16 }}>
                  <div>
                    <span>{t.originalSize}</span>
                    <strong>{formatBytes(file?.size)}</strong>
                  </div>
                  <div>
                    <span>{t.compressedSize}</span>
                    <strong>{formatBytes(resultBlob.size)}</strong>
                  </div>
                  <div>
                    <span>{t.reduced}</span>
                    <strong>{reduction}%</strong>
                  </div>
                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "video")}_compressed.webm
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