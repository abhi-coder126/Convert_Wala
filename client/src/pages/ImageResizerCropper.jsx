import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
  Crop,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const outputFormats = [
  { label: "PNG", value: "png", mime: "image/png", ext: "png", quality: false },
  { label: "JPG", value: "jpg", mime: "image/jpeg", ext: "jpg", quality: true },
  { label: "JPEG", value: "jpeg", mime: "image/jpeg", ext: "jpeg", quality: true },
  { label: "WEBP", value: "webp", mime: "image/webp", ext: "webp", quality: true },
  { label: "AVIF", value: "avif", mime: "image/avif", ext: "avif", quality: true },
];

const pageText = {
  en: {
    eyebrow: "Convert Wala Image Tool",
    title: "Image Resizer & Cropper",
    subtitle:
      "Upload image, drag crop area, resize width and height, choose format, then download. Nothing is saved anywhere.",
    uploadTitle: "Upload Image",
    changeImage: "Change Image",
    uploadText: "Supports JPG, PNG, WEBP, AVIF, JPEG and more.",
    imageDetails: "Image Details",
    extension: "Extension",
    originalSize: "Original Size",
    dimensions: "Dimensions",
    type: "Type",
    resizeSettings: "Resize Settings",
    width: "Width",
    height: "Height",
    useCropSize: "Use Crop Size",
    useOriginalSize: "Use Original Size",
    outputFormat: "Output Format",
    quality: "Quality",
    cropResize: "Crop & Resize",
    processing: "Processing...",
    download: "Download",
    cropPreview: "Crop Preview",
    dragToCrop: "Drag to crop",
    emptyPreview: "Upload image to crop and resize",
    finalOutput: "Final Output",
    format: "Format",
    finalSize: "Final Size",
    fileName: "File Name",
    cropHint: "Drag crop area",
    invalidFile: "Please upload a valid image file.",
    uploadSuccess: "Image uploaded successfully.",
    loadFailed: "Image load failed. Please try another image.",
    uploadFirst: "Please upload an image first.",
    invalidSize: "Please enter valid width and height.",
    notSupported: "is not supported by your browser. Try PNG, JPG or WEBP.",
    processSuccess: "Image cropped and resized successfully.",
    processFirst: "Please process image first.",
    downloadComplete: "Download completed. Data cleared.",
  },

  hi: {
    eyebrow: "Convert Wala इमेज टूल",
    title: "इमेज Resizer और Cropper",
    subtitle:
      "इमेज अपलोड करें, crop area drag करें, width और height resize करें, format चुनें और download करें। कोई data save नहीं होता।",
    uploadTitle: "इमेज अपलोड करें",
    changeImage: "इमेज बदलें",
    uploadText: "JPG, PNG, WEBP, AVIF, JPEG और अन्य formats supported हैं।",
    imageDetails: "इमेज जानकारी",
    extension: "Extension",
    originalSize: "Original Size",
    dimensions: "Dimensions",
    type: "Type",
    resizeSettings: "Resize Settings",
    width: "Width",
    height: "Height",
    useCropSize: "Crop Size इस्तेमाल करें",
    useOriginalSize: "Original Size इस्तेमाल करें",
    outputFormat: "Output Format",
    quality: "Quality",
    cropResize: "Crop & Resize",
    processing: "Processing...",
    download: "Download",
    cropPreview: "Crop Preview",
    dragToCrop: "Crop करने के लिए drag करें",
    emptyPreview: "Crop और resize के लिए image upload करें",
    finalOutput: "Final Output",
    format: "Format",
    finalSize: "Final Size",
    fileName: "File Name",
    cropHint: "Crop area drag करें",
    invalidFile: "कृपया valid image file upload करें।",
    uploadSuccess: "Image successfully upload हो गई।",
    loadFailed: "Image load failed. कृपया दूसरी image try करें।",
    uploadFirst: "कृपया पहले image upload करें।",
    invalidSize: "कृपया valid width और height डालें।",
    notSupported: "आपके browser में supported नहीं है। PNG, JPG या WEBP try करें।",
    processSuccess: "Image successfully crop और resize हो गई।",
    processFirst: "कृपया पहले image process करें।",
    downloadComplete: "Download complete. Data clear कर दिया गया।",
  },

  hinglish: {
    eyebrow: "Convert Wala Image Tool",
    title: "Image Resizer & Cropper",
    subtitle:
      "Image upload karo, crop area drag karo, width aur height resize karo, format choose karo aur download karo. Data save nahi hota.",
    uploadTitle: "Upload Image",
    changeImage: "Change Image",
    uploadText: "JPG, PNG, WEBP, AVIF, JPEG aur more formats support karta hai.",
    imageDetails: "Image Details",
    extension: "Extension",
    originalSize: "Original Size",
    dimensions: "Dimensions",
    type: "Type",
    resizeSettings: "Resize Settings",
    width: "Width",
    height: "Height",
    useCropSize: "Use Crop Size",
    useOriginalSize: "Use Original Size",
    outputFormat: "Output Format",
    quality: "Quality",
    cropResize: "Crop & Resize",
    processing: "Processing...",
    download: "Download",
    cropPreview: "Crop Preview",
    dragToCrop: "Drag to crop",
    emptyPreview: "Crop aur resize ke liye image upload karo",
    finalOutput: "Final Output",
    format: "Format",
    finalSize: "Final Size",
    fileName: "File Name",
    cropHint: "Drag crop area",
    invalidFile: "Please valid image file upload karo.",
    uploadSuccess: "Image successfully upload ho gayi.",
    loadFailed: "Image load failed. Dusri image try karo.",
    uploadFirst: "Please pehle image upload karo.",
    invalidSize: "Please valid width aur height enter karo.",
    notSupported: "browser me supported nahi hai. PNG, JPG ya WEBP try karo.",
    processSuccess: "Image successfully crop aur resize ho gayi.",
    processFirst: "Please pehle image process karo.",
    downloadComplete: "Download complete. Data clear ho gaya.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const cleanFileName = (name = "image") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
};

export default function ImageResizerCropper() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef(null);
  const scaleRef = useRef(1);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileInfo, setFileInfo] = useState(null);

  const [cropRect, setCropRect] = useState(null);
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");

  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(0.92);

  const [resultBlob, setResultBlob] = useState(null);
  const [resultUrl, setResultUrl] = useState("");

  const [toast, setToast] = useState(null);
  const [processing, setProcessing] = useState(false);

  const selectedFormat = outputFormats.find((item) => item.value === format);
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
    setResultBlob(null);
    setResultUrl("");
  };

  const resetAll = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setFileUrl("");
    setFileInfo(null);
    setCropRect(null);
    setResizeWidth("");
    setResizeHeight("");
    setFormat("png");
    setQuality(0.92);
    setResultBlob(null);
    setResultUrl("");
    setProcessing(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img || !cropRect) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const { x, y, w, h } = cropRect;

    ctx.fillStyle = "rgba(2, 6, 23, 0.58)";
    ctx.fillRect(0, 0, canvas.width, y);
    ctx.fillRect(0, y + h, canvas.width, canvas.height - y - h);
    ctx.fillRect(0, y, x, h);
    ctx.fillRect(x + w, y, canvas.width - x - w, h);

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#2563eb";
    ctx.fillRect(x + w - 11, y + h - 11, 22, 22);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 13px Arial";
    ctx.fillText(t.cropHint, x + 12, y + 24);
  };

  useEffect(() => {
    drawCanvas();
  }, [cropRect, language]);

  const handleUpload = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showToast("error", t.invalidFile);
      return;
    }

    resetAll();

    const url = URL.createObjectURL(selectedFile);
    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      const maxW = 860;
      const maxH = 560;

      const scale = Math.min(
        maxW / img.naturalWidth,
        maxH / img.naturalHeight,
        1
      );

      scaleRef.current = scale;
      imageRef.current = img;

      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);

      const defaultCrop = {
        x: Math.round(canvas.width * 0.08),
        y: Math.round(canvas.height * 0.08),
        w: Math.round(canvas.width * 0.84),
        h: Math.round(canvas.height * 0.84),
      };

      setFile(selectedFile);
      setFileUrl(url);
      setCropRect(defaultCrop);

      setResizeWidth(Math.round(defaultCrop.w / scale));
      setResizeHeight(Math.round(defaultCrop.h / scale));

      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        extension: selectedFile.name.split(".").pop()?.toLowerCase() || "unknown",
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      showToast("success", t.uploadSuccess);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast("error", t.loadFailed);
    };

    img.src = url;
  };

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const box = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - box.left) * (canvas.width / box.width),
      y: (clientY - box.top) * (canvas.height / box.height),
    };
  };

  const isInside = (point, rect) => {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.w &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.h
    );
  };

  const isResizeHandle = (point, rect) => {
    return (
      point.x >= rect.x + rect.w - 26 &&
      point.x <= rect.x + rect.w + 26 &&
      point.y >= rect.y + rect.h - 26 &&
      point.y <= rect.y + rect.h + 26
    );
  };

  const startDrag = (e) => {
    if (!cropRect) return;

    e.preventDefault();

    const point = getPoint(e);

    if (isResizeHandle(point, cropRect)) {
      dragRef.current = {
        mode: "resize",
        startX: point.x,
        startY: point.y,
        rect: { ...cropRect },
      };
      return;
    }

    if (isInside(point, cropRect)) {
      dragRef.current = {
        mode: "move",
        startX: point.x,
        startY: point.y,
        rect: { ...cropRect },
      };
      return;
    }

    dragRef.current = {
      mode: "new",
      startX: point.x,
      startY: point.y,
      rect: { x: point.x, y: point.y, w: 1, h: 1 },
    };

    setCropRect({ x: point.x, y: point.y, w: 1, h: 1 });
    clearResult();
  };

  const moveDrag = (e) => {
    const drag = dragRef.current;
    const canvas = canvasRef.current;

    if (!drag || !canvas) return;

    e.preventDefault();

    const point = getPoint(e);

    if (drag.mode === "move") {
      const dx = point.x - drag.startX;
      const dy = point.y - drag.startY;

      const next = {
        ...drag.rect,
        x: clamp(drag.rect.x + dx, 0, canvas.width - drag.rect.w),
        y: clamp(drag.rect.y + dy, 0, canvas.height - drag.rect.h),
      };

      setCropRect(next);
      clearResult();
      return;
    }

    if (drag.mode === "resize") {
      const nextW = clamp(
        drag.rect.w + (point.x - drag.startX),
        40,
        canvas.width - drag.rect.x
      );

      const nextH = clamp(
        drag.rect.h + (point.y - drag.startY),
        40,
        canvas.height - drag.rect.y
      );

      const next = {
        ...drag.rect,
        w: nextW,
        h: nextH,
      };

      setCropRect(next);
      setResizeWidth(Math.round(next.w / scaleRef.current));
      setResizeHeight(Math.round(next.h / scaleRef.current));
      clearResult();
      return;
    }

    if (drag.mode === "new") {
      const x = Math.min(drag.startX, point.x);
      const y = Math.min(drag.startY, point.y);
      const w = Math.abs(point.x - drag.startX);
      const h = Math.abs(point.y - drag.startY);

      const next = {
        x: clamp(x, 0, canvas.width),
        y: clamp(y, 0, canvas.height),
        w: clamp(w, 40, canvas.width - x),
        h: clamp(h, 40, canvas.height - y),
      };

      setCropRect(next);
      setResizeWidth(Math.round(next.w / scaleRef.current));
      setResizeHeight(Math.round(next.h / scaleRef.current));
      clearResult();
    }
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const useOriginalSize = () => {
    if (!fileInfo) return;

    setResizeWidth(fileInfo.width);
    setResizeHeight(fileInfo.height);
    clearResult();
  };

  const useCropSize = () => {
    if (!cropRect) return;

    setResizeWidth(Math.round(cropRect.w / scaleRef.current));
    setResizeHeight(Math.round(cropRect.h / scaleRef.current));
    clearResult();
  };

  const processImage = () => {
    const img = imageRef.current;

    if (!img || !cropRect || !selectedFormat) {
      showToast("error", t.uploadFirst);
      return;
    }

    const outputW = Number(resizeWidth);
    const outputH = Number(resizeHeight);

    if (!outputW || !outputH || outputW <= 0 || outputH <= 0) {
      showToast("error", t.invalidSize);
      return;
    }

    setProcessing(true);

    const scale = scaleRef.current;

    const sx = Math.round(cropRect.x / scale);
    const sy = Math.round(cropRect.y / scale);
    const sw = Math.round(cropRect.w / scale);
    const sh = Math.round(cropRect.h / scale);

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = outputW;
    outputCanvas.height = outputH;

    const ctx = outputCanvas.getContext("2d");

    if (selectedFormat.mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputW, outputH);
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outputW, outputH);

    outputCanvas.toBlob(
      (blob) => {
        setProcessing(false);

        if (!blob) {
          showToast("error", `${selectedFormat.label} ${t.notSupported}`);
          return;
        }

        clearResult();

        const url = URL.createObjectURL(blob);

        setResultBlob(blob);
        setResultUrl(url);

        showToast("success", t.processSuccess);
      },
      selectedFormat.mime,
      selectedFormat.quality ? quality : undefined
    );
  };

  const downloadImage = () => {
    if (!resultUrl || !resultBlob || !selectedFormat) {
      showToast("error", t.processFirst);
      return;
    }

    const name = cleanFileName(file?.name || "image");
    const outputName = `Convert Wala_${name}_resized_cropped.${selectedFormat.ext}`;

    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadComplete);

    setTimeout(() => {
      resetAll();
      navigate("/tools");
    }, 1300);
  };

  return (
    <main className={`irc-page ${theme === "dark" ? "dark" : "light"}`}>
      <style>{`
        .irc-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .irc-page * {
          box-sizing: border-box;
        }

        .irc-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .irc-hero {
          padding: 82px 6% 46px;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.15), transparent 34%),
            #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .irc-page.dark .irc-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .irc-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .irc-page.dark .irc-eyebrow {
          color: #93c5fd;
        }

        .irc-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .irc-page.dark .irc-hero h1 {
          color: #f8fafc;
        }

        .irc-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .irc-page.dark .irc-hero p {
          color: #cbd5e1;
        }

        .irc-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .irc-left,
        .irc-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .irc-card {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .irc-page.dark .irc-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .irc-upload {
          min-height: 230px;
          display: grid;
          place-items: center;
          text-align: center;
          cursor: pointer;
          border: 1px dashed #94a3b8;
          transition: 0.25s ease;
        }

        .irc-upload:hover {
          border-color: #2563eb;
          transform: translateY(-3px);
          box-shadow: 0 30px 80px rgba(37, 99, 235, 0.12);
        }

        .irc-upload input {
          display: none;
        }

        .irc-upload-icon {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 16px;
        }

        .irc-page.dark .irc-upload-icon {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .irc-upload-icon svg {
          width: 36px;
          height: 36px;
        }

        .irc-upload strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .irc-page.dark .irc-upload strong,
        .irc-page.dark .irc-card h3,
        .irc-page.dark .irc-info-grid strong,
        .irc-page.dark .irc-result-grid strong,
        .irc-page.dark .irc-resize-grid label,
        .irc-page.dark .irc-quality div {
          color: #f8fafc;
        }

        .irc-upload p,
        .irc-muted {
          color: #64748b;
          line-height: 1.6;
        }

        .irc-page.dark .irc-upload p,
        .irc-page.dark .irc-empty,
        .irc-page.dark .irc-info-grid span,
        .irc-page.dark .irc-result-grid span {
          color: #cbd5e1;
        }

        .irc-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .irc-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .irc-info-grid div,
        .irc-result-grid div {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 14px;
          min-width: 0;
        }

        .irc-page.dark .irc-info-grid div,
        .irc-page.dark .irc-result-grid div,
        .irc-page.dark .irc-quality {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .irc-info-grid span,
        .irc-result-grid span {
          display: block;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .irc-info-grid strong,
        .irc-result-grid strong {
          color: #111827;
          font-size: 0.95rem;
          word-break: break-word;
        }

        .irc-resize-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .irc-resize-grid label {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .irc-resize-grid input {
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

        .irc-page.dark .irc-resize-grid input {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .irc-small-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 16px 0 24px;
        }

        .irc-small-actions button {
          border: 1px solid #dbe3ef;
          background: #fff;
          color: #2563eb;
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .irc-page.dark .irc-small-actions button {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .irc-format-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .irc-format-grid button {
          min-height: 46px;
          border: 1px solid #dbe3ef;
          background: #fff;
          border-radius: 16px;
          color: #334155;
          font-weight: 900;
          cursor: pointer;
        }

        .irc-page.dark .irc-format-grid button {
          background: #020617;
          color: #e2e8f0;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .irc-format-grid button.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.18);
        }

        .irc-page.dark .irc-format-grid button.active {
          background: #38bdf8;
          color: #020617;
          border-color: #38bdf8;
        }

        .irc-quality {
          margin-top: 18px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
        }

        .irc-quality div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #334155;
          font-weight: 900;
        }

        .irc-quality input {
          width: 100%;
          accent-color: #2563eb;
        }

        .irc-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .irc-primary,
        .irc-dark {
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
          transition: 0.24s ease;
          flex: 1;
        }

        .irc-primary {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 16px 32px rgba(37, 99, 235, 0.22);
        }

        .irc-dark {
          background: #111827;
          color: #fff;
        }

        .irc-page.dark .irc-dark {
          background: #38bdf8;
          color: #020617;
        }

        .irc-primary:disabled,
        .irc-dark:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .irc-preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .irc-preview-head h3 {
          margin: 0;
        }

        .irc-preview-head span {
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 0.85rem;
          font-weight: 900;
        }

        .irc-page.dark .irc-preview-head span {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .irc-canvas-wrap {
          min-height: 520px;
          background:
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
          background-size: 28px 28px;
          background-position: 0 0, 0 14px, 14px -14px, -14px 0;
          border-radius: 24px;
          border: 1px solid #e5e7eb;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 20px;
          touch-action: none;
        }

        .irc-page.dark .irc-canvas-wrap {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .irc-canvas {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.22);
          cursor: crosshair;
          background: #fff;
        }

        .irc-canvas.hidden {
          display: none;
        }

        .irc-empty {
          text-align: center;
          color: #64748b;
        }

        .irc-empty svg {
          width: 64px;
          height: 64px;
          color: #94a3b8;
        }

        .irc-final {
          margin-top: 22px;
        }

        .irc-final img {
          width: 100%;
          max-height: 460px;
          object-fit: contain;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          padding: 14px;
        }

        .irc-page.dark .irc-final img {
          background: #020617;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .irc-result-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .irc-toast {
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
          animation: ircToastIn 0.25s ease both;
        }

        .irc-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .irc-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .irc-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .irc-toast svg {
          width: 22px;
          height: 22px;
          flex: 0 0 auto;
        }

        @keyframes ircToastIn {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1100px) {
          .irc-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .irc-hero {
            padding: 56px 5% 34px;
          }

          .irc-shell {
            padding: 34px 5% 60px;
          }

          .irc-info-grid,
          .irc-resize-grid,
          .irc-format-grid {
            grid-template-columns: 1fr;
          }

          .irc-actions {
            flex-direction: column;
          }

          .irc-canvas-wrap {
            min-height: 330px;
            padding: 12px;
          }

          .irc-small-actions button,
          .irc-primary,
          .irc-dark {
            width: 100%;
          }

          .irc-toast {
            left: 16px;
            right: 16px;
            top: 88px;
            min-width: unset;
          }
        }
      `}</style>

      {toast && (
        <div className={`irc-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="irc-hero">
        <p className="irc-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="irc-shell">
        <div className="irc-left">
          <label className="irc-card irc-upload">
            <input type="file" accept="image/*" onChange={handleUpload} />
            <span className="irc-upload-icon">
              <UploadCloud />
            </span>
            <strong>{file ? t.changeImage : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {fileInfo && (
            <div className="irc-card">
              <h3>{t.imageDetails}</h3>
              <div className="irc-info-grid">
                <div>
                  <span>{t.extension}</span>
                  <strong>{fileInfo.extension}</strong>
                </div>
                <div>
                  <span>{t.originalSize}</span>
                  <strong>{formatBytes(fileInfo.size)}</strong>
                </div>
                <div>
                  <span>{t.dimensions}</span>
                  <strong>
                    {fileInfo.width} × {fileInfo.height}
                  </strong>
                </div>
                <div>
                  <span>{t.type}</span>
                  <strong>{fileInfo.type}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="irc-card">
            <h3>{t.resizeSettings}</h3>

            <div className="irc-resize-grid">
              <label>
                {t.width}
                <input
                  type="number"
                  min="1"
                  value={resizeWidth}
                  onChange={(e) => {
                    setResizeWidth(e.target.value);
                    clearResult();
                  }}
                />
              </label>

              <label>
                {t.height}
                <input
                  type="number"
                  min="1"
                  value={resizeHeight}
                  onChange={(e) => {
                    setResizeHeight(e.target.value);
                    clearResult();
                  }}
                />
              </label>
            </div>

            <div className="irc-small-actions">
              <button type="button" onClick={useCropSize}>
                {t.useCropSize}
              </button>
              <button type="button" onClick={useOriginalSize}>
                {t.useOriginalSize}
              </button>
            </div>

            <h3>{t.outputFormat}</h3>

            <div className="irc-format-grid">
              {outputFormats.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={format === item.value ? "active" : ""}
                  onClick={() => {
                    setFormat(item.value);
                    clearResult();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {selectedFormat?.quality && (
              <div className="irc-quality">
                <div>
                  <span>{t.quality}</span>
                  <strong>{Math.round(quality * 100)}%</strong>
                </div>

                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(e) => {
                    setQuality(Number(e.target.value));
                    clearResult();
                  }}
                />
              </div>
            )}

            <div className="irc-actions">
              <button
                type="button"
                className="irc-primary"
                onClick={processImage}
                disabled={!file || processing}
              >
                <RefreshCcw />
                {processing ? t.processing : t.cropResize}
              </button>

              <button
                type="button"
                className="irc-dark"
                onClick={downloadImage}
                disabled={!resultBlob}
              >
                <Download />
                {t.download}
              </button>
            </div>
          </div>
        </div>

        <div className="irc-right">
          <div className="irc-card">
            <div className="irc-preview-head">
              <h3>{t.cropPreview}</h3>
              <span>{resultBlob ? formatBytes(resultBlob.size) : t.dragToCrop}</span>
            </div>

            <div className="irc-canvas-wrap">
              {!file && (
                <div className="irc-empty">
                  <Crop />
                  <p>{t.emptyPreview}</p>
                </div>
              )}

              <canvas
                ref={canvasRef}
                className={`irc-canvas ${!file ? "hidden" : ""}`}
                onMouseDown={startDrag}
                onMouseMove={moveDrag}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onTouchStart={startDrag}
                onTouchMove={moveDrag}
                onTouchEnd={endDrag}
              />
            </div>

            {resultUrl && (
              <div className="irc-final">
                <h3>{t.finalOutput}</h3>
                <img src={resultUrl} alt="Final output" />

                <div className="irc-result-grid">
                  <div>
                    <span>{t.format}</span>
                    <strong>{selectedFormat.label}</strong>
                  </div>
                  <div>
                    <span>{t.finalSize}</span>
                    <strong>{formatBytes(resultBlob?.size)}</strong>
                  </div>
                  <div>
                    <span>{t.fileName}</span>
                    <strong>
                      Convert Wala_{cleanFileName(file?.name || "image")}
                      _resized_cropped.{selectedFormat.ext}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}