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
    title: "Video Trimmer / Merger",
    subtitle:
      "Upload video files, trim selected video or merge multiple videos into one WEBM file. Files stay inside your browser.",
    uploadTitle: "Upload Video Files",
    changeUpload: "Change Video Files",
    uploadText: "Single video for trimming, multiple videos for merging.",
    selectTool: "Select Tool",
    trimVideo: "Trim Video",
    mergeVideos: "Merge Videos",
    uploadedVideos: "Uploaded Videos",
    trimSettings: "Trim Settings",
    selectVideo: "Select Video",
    duration: "Duration",
    startTime: "Start Time",
    endTime: "End Time",
    outputSettings: "Output Settings",
    maxWidth: "Max Width",
    fps: "FPS",
    bitrate: "Bitrate",
    output: "Output",
    includeAudio: "Include audio",
    stop: "Stop",
    download: "Download",
    note:
      "Output will be WEBM. MP4 trimming/merging requires an FFmpeg backend.",
    preview: "Preview",
    uploadPreview: "Upload video to preview",
    processingProgress: "Processing Progress",
    mode: "Mode",
    trimmedVideo: "Trimmed Video",
    mergedVideo: "Merged Video",
    outputSize: "Output Size",
    reduced: "Reduced",
    outputFile: "Output File",
    sec: "sec",
    unknown: "Unknown",
    validVideos: "Please upload valid video files.",
    uploadTrimSuccess: "Video uploaded. You can trim it.",
    uploadMergeSuccess: "Videos uploaded. You can merge them.",
    metadataFailed: "Some video metadata could not be loaded.",
    uploadFirst: "Please upload video first.",
    browserNotSupport: "Your browser does not support this tool. Use Chrome.",
    webmNotSupport: "WEBM recording not supported in this browser.",
    validTime: "Please enter valid start and end time.",
    mergeMinimum: "For merge, upload at least 2 videos.",
    invalidDuration: "Invalid video duration.",
    blankOutput: "Blank output created. Try again in Chrome.",
    trimSuccess: "Video trimmed successfully.",
    mergeSuccess: "Videos merged successfully.",
    processingFailed: "Processing failed.",
    startFailed: "Processing could not start. Try in Chrome.",
    processFirst: "Please process video first.",
    downloadStarted: "Download started.",
    seoTitle:
      "Free Video Trimmer & Merger Online - Trim and Merge Videos | Convert Wala",
    seoDescription:
      "Use Convert Wala free Video Trimmer and Merger to trim video clips or merge multiple video files into one WEBM video directly in your browser. No software installation required.",
    seoKeywords:
      "video trimmer, video merger, free video trimmer, online video trimmer, merge videos online, trim video online, video cutter, WEBM video merger, browser video editor, Convert Wala video tools",
  },

  hi: {
    eyebrow: "Convert Wala वीडियो टूल",
    title: "वीडियो Trimmer / Merger",
    subtitle:
      "वीडियो files upload करें, selected video trim करें या multiple videos को एक WEBM file में merge करें। Files आपके browser में ही रहती हैं।",
    uploadTitle: "वीडियो Files Upload करें",
    changeUpload: "वीडियो Files बदलें",
    uploadText: "Trimming के लिए single video, merging के लिए multiple videos.",
    selectTool: "Tool चुनें",
    trimVideo: "Video Trim करें",
    mergeVideos: "Videos Merge करें",
    uploadedVideos: "Uploaded Videos",
    trimSettings: "Trim Settings",
    selectVideo: "Video चुनें",
    duration: "Duration",
    startTime: "Start Time",
    endTime: "End Time",
    outputSettings: "Output Settings",
    maxWidth: "Max Width",
    fps: "FPS",
    bitrate: "Bitrate",
    output: "Output",
    includeAudio: "Audio शामिल करें",
    stop: "Stop",
    download: "Download",
    note:
      "Output WEBM में आएगा। MP4 trimming/merging के लिए FFmpeg backend चाहिए।",
    preview: "Preview",
    uploadPreview: "Preview देखने के लिए video upload करें",
    processingProgress: "Processing Progress",
    mode: "Mode",
    trimmedVideo: "Trimmed Video",
    mergedVideo: "Merged Video",
    outputSize: "Output Size",
    reduced: "Reduced",
    outputFile: "Output File",
    sec: "sec",
    unknown: "Unknown",
    validVideos: "कृपया valid video files upload करें।",
    uploadTrimSuccess: "Video upload हो गई। आप इसे trim कर सकते हैं।",
    uploadMergeSuccess: "Videos upload हो गईं। आप इन्हें merge कर सकते हैं।",
    metadataFailed: "कुछ video metadata load नहीं हो पाया।",
    uploadFirst: "कृपया पहले video upload करें।",
    browserNotSupport: "आपका browser इस tool को support नहीं करता। Chrome use करें।",
    webmNotSupport: "इस browser में WEBM recording supported नहीं है।",
    validTime: "कृपया valid start और end time डालें।",
    mergeMinimum: "Merge के लिए कम से कम 2 videos upload करें।",
    invalidDuration: "Invalid video duration.",
    blankOutput: "Blank output बना। Chrome में फिर try करें।",
    trimSuccess: "Video successfully trim हो गई।",
    mergeSuccess: "Videos successfully merge हो गईं।",
    processingFailed: "Processing failed.",
    startFailed: "Processing start नहीं हो पाया। Chrome में try करें।",
    processFirst: "कृपया पहले video process करें।",
    downloadStarted: "Download started.",
    seoTitle:
      "Free Video Trimmer & Merger Online - Video Trim और Merge करें | Convert Wala",
    seoDescription:
      "Convert Wala free Video Trimmer और Merger से videos को online trim करें या multiple video files को एक WEBM video में merge करें। यह tool browser में काम करता है।",
    seoKeywords:
      "video trimmer, video merger, video trim kare, video merge kare, free video trimmer, online video cutter, merge videos online, WEBM video merger, Convert Wala video tools",
  },

  hinglish: {
    eyebrow: "Convert Wala Video Tool",
    title: "Video Trimmer / Merger",
    subtitle:
      "Video files upload karo, selected video trim karo ya multiple videos ko one WEBM file me merge karo. Files browser ke andar hi rehti hain.",
    uploadTitle: "Upload Video Files",
    changeUpload: "Change Video Files",
    uploadText: "Trimming ke liye single video, merging ke liye multiple videos.",
    selectTool: "Select Tool",
    trimVideo: "Trim Video",
    mergeVideos: "Merge Videos",
    uploadedVideos: "Uploaded Videos",
    trimSettings: "Trim Settings",
    selectVideo: "Select Video",
    duration: "Duration",
    startTime: "Start Time",
    endTime: "End Time",
    outputSettings: "Output Settings",
    maxWidth: "Max Width",
    fps: "FPS",
    bitrate: "Bitrate",
    output: "Output",
    includeAudio: "Include audio",
    stop: "Stop",
    download: "Download",
    note:
      "Output WEBM me aayega. MP4 trimming/merging ke liye FFmpeg backend chahiye.",
    preview: "Preview",
    uploadPreview: "Preview dekhne ke liye video upload karo",
    processingProgress: "Processing Progress",
    mode: "Mode",
    trimmedVideo: "Trimmed Video",
    mergedVideo: "Merged Video",
    outputSize: "Output Size",
    reduced: "Reduced",
    outputFile: "Output File",
    sec: "sec",
    unknown: "Unknown",
    validVideos: "Please valid video files upload karo.",
    uploadTrimSuccess: "Video upload ho gayi. Aap ise trim kar sakte ho.",
    uploadMergeSuccess: "Videos upload ho gayi. Aap inhe merge kar sakte ho.",
    metadataFailed: "Kuch video metadata load nahi ho paya.",
    uploadFirst: "Please pehle video upload karo.",
    browserNotSupport: "Ye browser tool support nahi karta. Chrome use karo.",
    webmNotSupport: "Is browser me WEBM recording supported nahi hai.",
    validTime: "Please valid start aur end time enter karo.",
    mergeMinimum: "Merge ke liye kam se kam 2 videos upload karo.",
    invalidDuration: "Invalid video duration.",
    blankOutput: "Blank output bana. Chrome me dobara try karo.",
    trimSuccess: "Video successfully trim ho gayi.",
    mergeSuccess: "Videos successfully merge ho gayi.",
    processingFailed: "Processing failed.",
    startFailed: "Processing start nahi ho paya. Chrome me try karo.",
    processFirst: "Please pehle video process karo.",
    downloadStarted: "Download started.",
    seoTitle:
      "Free Video Trimmer & Merger Online - Trim and Merge Videos | Convert Wala",
    seoDescription:
      "Convert Wala free Video Trimmer aur Merger se video clips trim karo ya multiple video files ko one WEBM video me merge karo directly browser me.",
    seoKeywords:
      "video trimmer, video merger, free video trimmer, online video trimmer, merge videos online, trim video online, video cutter, WEBM video merger, Convert Wala video tools",
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

const drawContain = (ctx, video, canvas) => {
  const canvasRatio = canvas.width / canvas.height;
  const videoRatio = video.videoWidth / video.videoHeight;

  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let x = 0;
  let y = 0;

  if (videoRatio > canvasRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / videoRatio;
    y = (canvas.height - drawHeight) / 2;
  } else {
    drawHeight = canvas.height;
    drawWidth = canvas.height * videoRatio;
    x = (canvas.width - drawWidth) / 2;
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, x, y, drawWidth, drawHeight);
};

export default function VideoTrimmerMerger() {
  const previewRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);
  const activeVideoRef = useRef(null);
  const animationRef = useRef(null);
  const runningRef = useRef(false);
  const chunksRef = useRef([]);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [infos, setInfos] = useState([]);

  const [mode, setMode] = useState("trim");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState("");

  const [maxWidth, setMaxWidth] = useState(720);
  const [fps, setFps] = useState(24);
  const [bitrate, setBitrate] = useState(1200000);
  const [includeAudio, setIncludeAudio] = useState(true);

  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/video-trimmer-merger";

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
    setResultBlob(null);
    setResultUrl("");
    setProgress(0);
  };

  const resetAll = () => {
    urls.forEach((url) => URL.revokeObjectURL(url));
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    activeVideoRef.current?.pause();

    runningRef.current = false;

    setFiles([]);
    setUrls([]);
    setInfos([]);
    setSelectedIndex(0);
    setStartTime(0);
    setEndTime("");
    setResultBlob(null);
    setResultUrl("");
    setProgress(0);
    setProcessing(false);
  };

  const getVideoInfo = (file, url) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.src = url;
      video.preload = "metadata";
      video.playsInline = true;

      video.onloadedmetadata = () => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type || t.unknown,
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration || 0,
        });
      };

      video.onerror = reject;
    });
  };

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const validVideos = selectedFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    if (!validVideos.length) {
      showToast("error", t.validVideos);
      return;
    }

    resetAll();

    const objectUrls = validVideos.map((file) => URL.createObjectURL(file));

    setFiles(validVideos);
    setUrls(objectUrls);

    try {
      const metadata = await Promise.all(
        validVideos.map((file, index) => getVideoInfo(file, objectUrls[index]))
      );

      setInfos(metadata);

      const first = metadata[0];
      setEndTime(first.duration ? Number(first.duration.toFixed(2)) : "");
      setMaxWidth(first.width > 720 ? 720 : first.width);

      showToast(
        "success",
        validVideos.length > 1 ? t.uploadMergeSuccess : t.uploadTrimSuccess
      );
    } catch {
      showToast("error", t.metadataFailed);
    }

    e.target.value = "";
  };

  const handleSelectedChange = (index) => {
    const current = infos[index];

    setSelectedIndex(index);
    setStartTime(0);
    setEndTime(current?.duration ? Number(current.duration.toFixed(2)) : "");
    clearResult();
  };

  const renderClip = ({
    video,
    canvas,
    ctx,
    start,
    end,
    totalDone,
    totalDuration,
  }) => {
    return new Promise((resolve) => {
      const loop = () => {
        if (!runningRef.current) {
          resolve();
          return;
        }

        if (video.ended || video.currentTime >= end) {
          video.pause();
          resolve();
          return;
        }

        drawContain(ctx, video, canvas);

        const clipProgress = Math.max(0, video.currentTime - start);
        const percent = Math.min(
          ((totalDone + clipProgress) / totalDuration) * 100,
          100
        );

        setProgress(percent);

        animationRef.current = requestAnimationFrame(loop);
      };

      loop();
    });
  };

  const processVideos = async () => {
    if (!files.length || !urls.length || !infos.length) {
      showToast("error", t.uploadFirst);
      return;
    }

    if (!window.MediaRecorder || !canvasRef.current?.captureStream) {
      showToast("error", t.browserNotSupport);
      return;
    }

    const mimeType = getSupportedMime();

    if (!mimeType) {
      showToast("error", t.webmNotSupport);
      return;
    }

    let clips = [];

    if (mode === "trim") {
      const info = infos[selectedIndex];
      const start = Number(startTime);
      const end = Number(endTime);

      if (!info || start < 0 || end <= start || end > info.duration) {
        showToast("error", t.validTime);
        return;
      }

      clips = [
        {
          file: files[selectedIndex],
          url: urls[selectedIndex],
          info,
          start,
          end,
        },
      ];
    } else {
      clips = infos.map((info, index) => ({
        file: files[index],
        url: urls[index],
        info,
        start: 0,
        end: info.duration,
      }));

      if (clips.length < 2) {
        showToast("error", t.mergeMinimum);
        return;
      }
    }

    const totalDuration = clips.reduce(
      (sum, clip) => sum + Math.max(0, clip.end - clip.start),
      0
    );

    if (!totalDuration) {
      showToast("error", t.invalidDuration);
      return;
    }

    try {
      clearResult();
      chunksRef.current = [];
      runningRef.current = true;
      setProcessing(true);
      setProgress(0);

      const firstInfo = clips[0].info;
      const targetWidth = Math.min(Number(maxWidth), firstInfo.width || 720);
      const targetHeight = Math.round(
        (targetWidth / (firstInfo.width || 1280)) * (firstInfo.height || 720)
      );

      const canvas = canvasRef.current;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const canvasStream = canvas.captureStream(Number(fps));

      let audioContext = null;
      let destination = null;

      if (includeAudio) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;

        if (AudioContext) {
          audioContext = new AudioContext();
          await audioContext.resume();
          destination = audioContext.createMediaStreamDestination();

          destination.stream.getAudioTracks().forEach((track) => {
            canvasStream.addTrack(track);
          });
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

      const recorderFinished = new Promise((resolve) => {
        recorder.onstop = async () => {
          runningRef.current = false;

          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }

          try {
            await audioContext?.close?.();
          } catch {}

          const blob = new Blob(chunksRef.current, { type: "video/webm" });

          if (!blob.size) {
            setProcessing(false);
            showToast("error", t.blankOutput);
            resolve();
            return;
          }

          const outputUrl = URL.createObjectURL(blob);

          setResultBlob(blob);
          setResultUrl(outputUrl);
          setProgress(100);
          setProcessing(false);

          showToast(
            "success",
            mode === "trim" ? t.trimSuccess : t.mergeSuccess
          );

          resolve();
        };
      });

      recorder.onerror = () => {
        runningRef.current = false;
        setProcessing(false);
        showToast("error", t.processingFailed);
      };

      recorder.start(300);

      let totalDone = 0;

      for (const clip of clips) {
        if (!runningRef.current) break;

        const tempVideo = document.createElement("video");
        tempVideo.src = clip.url;
        tempVideo.preload = "auto";
        tempVideo.playsInline = true;
        tempVideo.crossOrigin = "anonymous";

        activeVideoRef.current = tempVideo;

        await waitForMetadata(tempVideo);

        let audioSource = null;

        if (includeAudio && audioContext && destination) {
          try {
            audioSource = audioContext.createMediaElementSource(tempVideo);
            audioSource.connect(destination);
          } catch {}
        }

        tempVideo.pause();
        tempVideo.currentTime = clip.start;
        await waitForSeek(tempVideo);

        drawContain(ctx, tempVideo, canvas);

        await tempVideo.play();

        await renderClip({
          video: tempVideo,
          canvas,
          ctx,
          start: clip.start,
          end: clip.end,
          totalDone,
          totalDuration,
        });

        tempVideo.pause();

        try {
          audioSource?.disconnect();
        } catch {}

        totalDone += Math.max(0, clip.end - clip.start);
      }

      if (recorder.state !== "inactive") {
        recorder.stop();
      }

      await recorderFinished;
    } catch {
      runningRef.current = false;
      setProcessing(false);

      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      showToast("error", t.startFailed);
    }
  };

  const stopProcessing = () => {
    runningRef.current = false;

    activeVideoRef.current?.pause();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setProcessing(false);
  };

  const downloadVideo = () => {
    if (!resultBlob || !resultUrl) {
      showToast("error", t.processFirst);
      return;
    }

    const baseName =
      mode === "trim"
        ? cleanFileName(files[selectedIndex]?.name || "video")
        : "merged_video";

    const outputName =
      mode === "trim"
        ? `Convert Wala_${baseName}_trimmed.webm`
        : `Convert Wala_${baseName}.webm`;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadStarted);
  };

  const resultReduction =
    mode === "trim" && files[selectedIndex]?.size && resultBlob?.size
      ? Math.max(
          0,
          100 - (resultBlob.size / files[selectedIndex].size) * 100
        ).toFixed(1)
      : null;

  return (
    <main className={`vtm-page ${theme === "dark" ? "dark" : "light"}`}>
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
            name: "Convert Wala Video Trimmer and Merger",
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
              "Trim video online",
              "Merge videos online",
              "Browser-based video processing",
              "WEBM video output",
              "Optional audio support",
              "No software installation required",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .vtm-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .vtm-page * {
          box-sizing: border-box;
        }

        .vtm-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .vtm-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .vtm-page.dark .vtm-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .vtm-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vtm-page.dark .vtm-eyebrow {
          color: #93c5fd;
        }

        .vtm-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .vtm-page.dark .vtm-hero h1 {
          color: #f8fafc;
        }

        .vtm-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .vtm-page.dark .vtm-hero p,
        .vtm-page.dark .vtm-upload p,
        .vtm-page.dark .vtm-note,
        .vtm-page.dark .vtm-info-grid span,
        .vtm-page.dark .vtm-result-grid span,
        .vtm-page.dark .vtm-list-item {
          color: #cbd5e1;
        }

        .vtm-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .vtm-left,
        .vtm-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .vtm-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .vtm-page.dark .vtm-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .vtm-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
        }

        .vtm-upload input {
          display: none;
        }

        .vtm-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .vtm-page.dark .vtm-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .vtm-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .vtm-upload strong,
        .vtm-card h3,
        .vtm-info-grid strong,
        .vtm-result-grid strong {
          color: #0f172a;
        }

        .vtm-page.dark .vtm-upload strong,
        .vtm-page.dark .vtm-card h3,
        .vtm-page.dark .vtm-info-grid strong,
        .vtm-page.dark .vtm-result-grid strong,
        .vtm-page.dark .vtm-field,
        .vtm-page.dark .vtm-check,
        .vtm-page.dark .vtm-progress-head {
          color: #f8fafc;
        }

        .vtm-upload p,
        .vtm-note {
          color: #64748b;
          line-height: 1.6;
        }

        .vtm-card h3 {
          margin: 0 0 16px;
          font-size: 1.2rem;
        }

        .vtm-mode {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .vtm-mode button,
        .vtm-small-btn {
          min-height: 46px;
          border: 1px solid #dbe3ef;
          background: #fff;
          color: #334155;
          border-radius: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .vtm-page.dark .vtm-mode button,
        .vtm-page.dark .vtm-small-btn {
          background: #020617;
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vtm-mode button.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }

        .vtm-page.dark .vtm-mode button.active {
          background: #38bdf8;
          color: #020617;
          border-color: #38bdf8;
        }

        .vtm-info-grid,
        .vtm-form-grid,
        .vtm-result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .vtm-info-grid div,
        .vtm-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .vtm-page.dark .vtm-info-grid div,
        .vtm-page.dark .vtm-result-grid div,
        .vtm-page.dark .vtm-list-item {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .vtm-info-grid span,
        .vtm-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .vtm-info-grid strong,
        .vtm-result-grid strong {
          font-size: 0.95rem;
          word-break: break-word;
        }

        .vtm-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .vtm-field input,
        .vtm-field select {
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

        .vtm-page.dark .vtm-field input,
        .vtm-page.dark .vtm-field select {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vtm-page.dark .vtm-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .vtm-check {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #334155;
          font-weight: 900;
        }

        .vtm-check input {
          width: 18px;
          height: 18px;
          accent-color: #2563eb;
        }

        .vtm-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .vtm-primary,
        .vtm-dark,
        .vtm-danger {
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

        .vtm-primary {
          background: #2563eb;
          color: #fff;
        }

        .vtm-dark {
          background: #111827;
          color: #fff;
        }

        .vtm-page.dark .vtm-dark {
          background: #38bdf8;
          color: #020617;
        }

        .vtm-danger {
          background: #dc2626;
          color: #fff;
        }

        .vtm-primary:disabled,
        .vtm-dark:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .vtm-video-box,
        .vtm-result-video {
          background: #020617;
          border-radius: 24px;
          overflow: hidden;
        }

        .vtm-video-box video,
        .vtm-result-video video {
          width: 100%;
          max-height: 520px;
          display: block;
          background: #020617;
        }

        .vtm-empty-preview {
          padding: 80px 20px;
          text-align: center;
          color: #94a3b8;
        }

        .vtm-empty-preview svg {
          margin-bottom: 10px;
        }

        .vtm-canvas {
          display: none;
        }

        .vtm-progress-wrap {
          margin-top: 20px;
        }

        .vtm-progress-head {
          display: flex;
          justify-content: space-between;
          color: #334155;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .vtm-progress {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .vtm-page.dark .vtm-progress {
          background: rgba(255, 255, 255, 0.1);
        }

        .vtm-progress span {
          display: block;
          height: 100%;
          background: #2563eb;
        }

        .vtm-page.dark .vtm-progress span {
          background: #38bdf8;
        }

        .vtm-list {
          display: grid;
          gap: 10px;
        }

        .vtm-list-item {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 12px;
          color: #334155;
          font-weight: 800;
        }

        .vtm-toast {
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

        .vtm-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .vtm-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .vtm-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .vtm-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .vtm-hero {
            padding: 56px 5% 34px;
          }

          .vtm-shell {
            padding: 34px 5% 60px;
          }

          .vtm-info-grid,
          .vtm-form-grid,
          .vtm-result-grid,
          .vtm-mode {
            grid-template-columns: 1fr;
          }

          .vtm-actions {
            flex-direction: column;
          }

          .vtm-toast {
            left: 16px;
            right: 16px;
            top: 88px;
            min-width: unset;
          }
        }
      `}</style>

      {toast && (
        <div className={`vtm-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="vtm-hero">
        <p className="vtm-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="vtm-shell">
        <div className="vtm-left">
          <label className="vtm-card vtm-upload">
            <input type="file" accept="video/*" multiple onChange={handleUpload} />
            <span className="vtm-upload-icon">
              <UploadCloud />
            </span>
            <strong>{files.length ? t.changeUpload : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          <div className="vtm-card">
            <h3>{t.selectTool}</h3>

            <div className="vtm-mode">
              <button
                type="button"
                className={mode === "trim" ? "active" : ""}
                onClick={() => {
                  setMode("trim");
                  clearResult();
                }}
              >
                {t.trimVideo}
              </button>

              <button
                type="button"
                className={mode === "merge" ? "active" : ""}
                onClick={() => {
                  setMode("merge");
                  clearResult();
                }}
              >
                {t.mergeVideos}
              </button>
            </div>
          </div>

          {infos.length > 0 && (
            <div className="vtm-card">
              <h3>{t.uploadedVideos}</h3>

              <div className="vtm-list">
                {infos.map((info, index) => (
                  <div className="vtm-list-item" key={`${info.name}-${index}`}>
                    {index + 1}. {info.name} — {formatBytes(info.size)} —{" "}
                    {info.duration ? info.duration.toFixed(1) : "0"} {t.sec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === "trim" && infos.length > 0 && (
            <div className="vtm-card">
              <h3>{t.trimSettings}</h3>

              <div className="vtm-form-grid">
                <label className="vtm-field">
                  {t.selectVideo}
                  <select
                    value={selectedIndex}
                    onChange={(e) => handleSelectedChange(Number(e.target.value))}
                  >
                    {infos.map((info, index) => (
                      <option key={index} value={index}>
                        {index + 1}. {info.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="vtm-field">
                  {t.duration}
                  <input
                    value={`${
                      infos[selectedIndex]?.duration
                        ? infos[selectedIndex].duration.toFixed(2)
                        : 0
                    } ${t.sec}`}
                    disabled
                    readOnly
                  />
                </label>

                <label className="vtm-field">
                  {t.startTime}
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      clearResult();
                    }}
                  />
                </label>

                <label className="vtm-field">
                  {t.endTime}
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      clearResult();
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="vtm-card">
            <h3>{t.outputSettings}</h3>

            <div className="vtm-form-grid">
              <label className="vtm-field">
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

              <label className="vtm-field">
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

              <label className="vtm-field">
                {t.bitrate}
                <select
                  value={bitrate}
                  onChange={(e) => {
                    setBitrate(Number(e.target.value));
                    clearResult();
                  }}
                >
                  <option value="700000">700 kbps Small</option>
                  <option value="1200000">1.2 Mbps Balanced</option>
                  <option value="2000000">2 Mbps Better</option>
                  <option value="3500000">3.5 Mbps High</option>
                </select>
              </label>

              <label className="vtm-field">
                {t.output}
                <input value="WEBM" disabled readOnly />
              </label>
            </div>

            <label className="vtm-check">
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

            <div className="vtm-actions">
              {!processing ? (
                <button
                  type="button"
                  className="vtm-primary"
                  onClick={processVideos}
                  disabled={!files.length}
                >
                  <RefreshCcw />
                  {mode === "trim" ? t.trimVideo : t.mergeVideos}
                </button>
              ) : (
                <button
                  type="button"
                  className="vtm-danger"
                  onClick={stopProcessing}
                >
                  <Square />
                  {t.stop}
                </button>
              )}

              <button
                type="button"
                className="vtm-dark"
                onClick={downloadVideo}
                disabled={!resultBlob}
              >
                <Download />
                {t.download}
              </button>
            </div>

            <p className="vtm-note">{t.note}</p>
          </div>
        </div>

        <div className="vtm-right">
          <div className="vtm-card">
            <h3>{t.preview}</h3>

            <div className="vtm-video-box">
              {urls[selectedIndex] ? (
                <video
                  ref={previewRef}
                  src={urls[selectedIndex]}
                  controls
                  playsInline
                />
              ) : (
                <div className="vtm-empty-preview">
                  <Video size={64} />
                  <p>{t.uploadPreview}</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="vtm-canvas" />

            {(processing || progress > 0) && (
              <div className="vtm-progress-wrap">
                <div className="vtm-progress-head">
                  <span>{t.processingProgress}</span>
                  <strong>{Math.round(progress)}%</strong>
                </div>

                <div className="vtm-progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {resultBlob && (
              <>
                <div className="vtm-result-video" style={{ marginTop: 20 }}>
                  <video src={resultUrl} controls playsInline />
                </div>

                <div className="vtm-result-grid" style={{ marginTop: 16 }}>
                  <div>
                    <span>{t.mode}</span>
                    <strong>
                      {mode === "trim" ? t.trimmedVideo : t.mergedVideo}
                    </strong>
                  </div>

                  <div>
                    <span>{t.outputSize}</span>
                    <strong>{formatBytes(resultBlob.size)}</strong>
                  </div>

                  <div>
                    <span>{t.reduced}</span>
                    <strong>{resultReduction ? `${resultReduction}%` : "-"}</strong>
                  </div>

                  <div>
                    <span>{t.outputFile}</span>
                    <strong>
                      {mode === "trim"
                        ? `Convert Wala_${cleanFileName(
                            files[selectedIndex]?.name || "video"
                          )}_trimmed.webm`
                        : "Convert Wala_merged_video.webm"}
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