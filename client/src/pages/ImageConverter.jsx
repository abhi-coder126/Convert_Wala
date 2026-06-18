import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Download,
  Image as ImageIcon,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import "../styles/imageConverter.css"
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const outputFormats = [
  { label: "PNG", value: "png", mime: "image/png", ext: "png", quality: false },
  { label: "JPG", value: "jpg", mime: "image/jpeg", ext: "jpg", quality: true },
  { label: "JPEG", value: "jpeg", mime: "image/jpeg", ext: "jpeg", quality: true },
  { label: "WEBP", value: "webp", mime: "image/webp", ext: "webp", quality: true },
  { label: "AVIF", value: "avif", mime: "image/avif", ext: "avif", quality: true },
  { label: "JFIF", value: "jfif", mime: "image/jpeg", ext: "jfif", quality: true },
  { label: "BMP", value: "bmp", mime: "image/bmp", ext: "bmp", quality: false },
];

const pageText = {
  en: {
    eyebrow: "Convert Wala Image Tool",
    title: "Image Format Converter",
    subtitle:
      "Upload image, auto-detect current extension, convert into PNG, JPG, JPEG, WEBP, AVIF, JFIF or BMP and download instantly. No data is saved.",
    uploadTitle: "Upload Image",
    changeImage: "Change Image",
    uploadText: "Supports JPG, JPEG, PNG, WEBP, AVIF, JFIF, BMP and more.",
    detailsTitle: "Detected Image Details",
    currentExtension: "Current Extension",
    originalSize: "Original Size",
    dimensions: "Dimensions",
    detectedType: "Detected Type",
    convertTo: "Convert To",
    quality: "Quality",
    convertImage: "Convert Image",
    converting: "Converting...",
    download: "Download",
    preview: "Preview",
    noImage: "No Image",
    emptyPreview: "Upload image to see preview",
    convertedFormat: "Converted Format",
    convertedSize: "Converted Size",
    downloadFileName: "Download File Name",
    invalidFile: "Please upload a valid image file.",
    uploadSuccess: "Image uploaded successfully.",
    previewFailed: "Image preview failed. Try another image.",
    uploadFirst: "Please upload image first.",
    notSupported: "is not supported by your browser. Try PNG, JPG or WEBP.",
    conversionFailed: "Conversion failed. Please try another image.",
    convertedBmp: "Image converted to BMP.",
    convertedTo: "Image converted to",
    convertFirst: "Please convert image first.",
    downloadComplete: "Download complete. Data cleared.",
  },

  hi: {
    eyebrow: "Convert Wala इमेज टूल",
    title: "इमेज फॉर्मेट कन्वर्टर",
    subtitle:
      "इमेज अपलोड करें, current extension auto-detect करें, PNG, JPG, JPEG, WEBP, AVIF, JFIF या BMP में convert करें और तुरंत download करें। कोई data save नहीं होता।",
    uploadTitle: "इमेज अपलोड करें",
    changeImage: "इमेज बदलें",
    uploadText: "JPG, JPEG, PNG, WEBP, AVIF, JFIF, BMP और अन्य formats supported हैं।",
    detailsTitle: "इमेज की जानकारी",
    currentExtension: "Current Extension",
    originalSize: "Original Size",
    dimensions: "Dimensions",
    detectedType: "Detected Type",
    convertTo: "Convert To",
    quality: "Quality",
    convertImage: "Image Convert करें",
    converting: "Converting...",
    download: "Download",
    preview: "Preview",
    noImage: "No Image",
    emptyPreview: "Preview देखने के लिए image upload करें",
    convertedFormat: "Converted Format",
    convertedSize: "Converted Size",
    downloadFileName: "Download File Name",
    invalidFile: "कृपया valid image file upload करें।",
    uploadSuccess: "Image successfully upload हो गई।",
    previewFailed: "Image preview failed. दूसरी image try करें।",
    uploadFirst: "कृपया पहले image upload करें।",
    notSupported: "आपके browser में supported नहीं है। PNG, JPG या WEBP try करें।",
    conversionFailed: "Conversion failed. कृपया दूसरी image try करें।",
    convertedBmp: "Image BMP में convert हो गई।",
    convertedTo: "Image convert हो गई",
    convertFirst: "कृपया पहले image convert करें।",
    downloadComplete: "Download complete. Data clear कर दिया गया।",
  },

  hinglish: {
    eyebrow: "Convert Wala Image Tool",
    title: "Image Format Converter",
    subtitle:
      "Image upload karo, current extension auto-detect karo, PNG, JPG, JPEG, WEBP, AVIF, JFIF ya BMP me convert karo aur instantly download karo. Data save nahi hota.",
    uploadTitle: "Upload Image",
    changeImage: "Change Image",
    uploadText: "JPG, JPEG, PNG, WEBP, AVIF, JFIF, BMP aur more formats support karta hai.",
    detailsTitle: "Detected Image Details",
    currentExtension: "Current Extension",
    originalSize: "Original Size",
    dimensions: "Dimensions",
    detectedType: "Detected Type",
    convertTo: "Convert To",
    quality: "Quality",
    convertImage: "Convert Image",
    converting: "Converting...",
    download: "Download",
    preview: "Preview",
    noImage: "No Image",
    emptyPreview: "Preview dekhne ke liye image upload karo",
    convertedFormat: "Converted Format",
    convertedSize: "Converted Size",
    downloadFileName: "Download File Name",
    invalidFile: "Please valid image file upload karo.",
    uploadSuccess: "Image successfully upload ho gayi.",
    previewFailed: "Image preview failed. Dusri image try karo.",
    uploadFirst: "Please pehle image upload karo.",
    notSupported: "browser me supported nahi hai. PNG, JPG ya WEBP try karo.",
    conversionFailed: "Conversion failed. Please dusri image try karo.",
    convertedBmp: "Image BMP me convert ho gayi.",
    convertedTo: "Image converted to",
    convertFirst: "Please pehle image convert karo.",
    downloadComplete: "Download complete. Data clear ho gaya.",
  },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const getExtension = (file) => {
  const fromName = file?.name?.split(".").pop()?.toLowerCase();

  if (fromName) return fromName;

  const fromType = file?.type?.split("/").pop()?.toLowerCase();

  return fromType || "unknown";
};

const getCleanFileName = (name = "image") => {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]/gi, "_");
};

const encodeBMP = (canvas) => {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  let offset = 0;

  const writeString = (value) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset++, value.charCodeAt(i));
    }
  };

  writeString("BM");
  view.setUint32(offset, fileSize, true);
  offset += 4;
  view.setUint32(offset, 0, true);
  offset += 4;
  view.setUint32(offset, 54, true);
  offset += 4;

  view.setUint32(offset, 40, true);
  offset += 4;
  view.setInt32(offset, width, true);
  offset += 4;
  view.setInt32(offset, height, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 24, true);
  offset += 2;
  view.setUint32(offset, 0, true);
  offset += 4;
  view.setUint32(offset, pixelArraySize, true);
  offset += 4;
  view.setInt32(offset, 2835, true);
  offset += 4;
  view.setInt32(offset, 2835, true);
  offset += 4;
  view.setUint32(offset, 0, true);
  offset += 4;
  view.setUint32(offset, 0, true);
  offset += 4;

  const data = imageData.data;
  let pos = 54;

  for (let y = height - 1; y >= 0; y--) {
    let rowPos = pos;

    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      view.setUint8(rowPos++, data[index + 2]);
      view.setUint8(rowPos++, data[index + 1]);
      view.setUint8(rowPos++, data[index]);
    }

    pos += rowSize;
  }

  return new Blob([buffer], { type: "image/bmp" });
};

export default function ImageConverter() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [convertedUrl, setConvertedUrl] = useState("");
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [quality, setQuality] = useState(0.92);
  const [imageInfo, setImageInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const selectedFormatInfo = useMemo(() => {
    return outputFormats.find((item) => item.value === selectedFormat);
  }, [selectedFormat]);

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const clearConvertedOnly = () => {
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }

    setConvertedUrl("");
    setConvertedBlob(null);
  };

  const resetTool = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }

    setImageFile(null);
    setPreviewUrl("");
    setConvertedUrl("");
    setConvertedBlob(null);
    setImageInfo(null);
    setSelectedFormat("png");
    setQuality(0.92);
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", t.invalidFile);
      return;
    }

    resetTool();

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImageFile(file);
      setPreviewUrl(url);

      setImageInfo({
        extension: getExtension(file),
        size: file.size,
        type: file.type || "Unknown",
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      showToast("success", t.uploadSuccess);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast("error", t.previewFailed);
    };

    img.src = url;
  };

  const convertImage = () => {
    if (!imageFile || !previewUrl || !selectedFormatInfo) {
      showToast("error", t.uploadFirst);
      return;
    }

    setLoading(true);

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (
        selectedFormatInfo.mime === "image/jpeg" ||
        selectedFormatInfo.mime === "image/bmp"
      ) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      if (selectedFormatInfo.value === "bmp") {
        const bmpBlob = encodeBMP(canvas);

        clearConvertedOnly();

        const bmpUrl = URL.createObjectURL(bmpBlob);
        setConvertedBlob(bmpBlob);
        setConvertedUrl(bmpUrl);
        setLoading(false);

        showToast("success", t.convertedBmp);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setLoading(false);
            showToast("error", `${selectedFormatInfo.label} ${t.notSupported}`);
            return;
          }

          clearConvertedOnly();

          const newUrl = URL.createObjectURL(blob);
          setConvertedBlob(blob);
          setConvertedUrl(newUrl);
          setLoading(false);

          showToast("success", `${t.convertedTo} ${selectedFormatInfo.label}.`);
        },
        selectedFormatInfo.mime,
        selectedFormatInfo.quality ? quality : undefined
      );
    };

    img.onerror = () => {
      setLoading(false);
      showToast("error", t.conversionFailed);
    };

    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!convertedBlob || !convertedUrl || !selectedFormatInfo) {
      showToast("error", t.convertFirst);
      return;
    }

    const originalName = getCleanFileName(imageFile?.name || "image");
    const fileName = `Convert Wala_${originalName}_converted.${selectedFormatInfo.ext}`;

    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("success", t.downloadComplete);

    setTimeout(() => {
      resetTool();
      navigate("/tools");
    }, 1300);
  };

  return (
    <main className={`img-converter-page ${theme === "dark" ? "dark" : "light"}`}>
      {toast && (
        <div className={`img-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>

          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="img-converter-hero">
        <p className="rb-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="img-converter-shell">
        <div className="img-converter-left">
          <label className="img-upload-card">
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <span className="img-upload-icon">
              <UploadCloud />
            </span>

            <strong>{imageFile ? t.changeImage : t.uploadTitle}</strong>
            <p>{t.uploadText}</p>
          </label>

          {imageInfo && (
            <div className="img-info-card">
              <h3>{t.detailsTitle}</h3>

              <div className="img-info-grid">
                <div>
                  <span>{t.currentExtension}</span>
                  <strong>{imageInfo.extension}</strong>
                </div>

                <div>
                  <span>{t.originalSize}</span>
                  <strong>{formatBytes(imageInfo.size)}</strong>
                </div>

                <div>
                  <span>{t.dimensions}</span>
                  <strong>
                    {imageInfo.width} × {imageInfo.height}
                  </strong>
                </div>

                <div>
                  <span>{t.detectedType}</span>
                  <strong>{imageInfo.type}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="img-format-card">
            <h3>{t.convertTo}</h3>

            <div className="img-format-grid">
              {outputFormats.map((format) => (
                <button
                  key={format.value}
                  type="button"
                  className={selectedFormat === format.value ? "active" : ""}
                  onClick={() => {
                    setSelectedFormat(format.value);
                    clearConvertedOnly();
                  }}
                >
                  {format.label}
                </button>
              ))}
            </div>

            {selectedFormatInfo?.quality && (
              <div className="img-quality-box">
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
                    clearConvertedOnly();
                  }}
                />
              </div>
            )}

            <div className="img-action-row">
              <button
                type="button"
                className="img-primary-btn"
                onClick={convertImage}
                disabled={loading || !imageFile}
              >
                <RefreshCcw />
                {loading ? t.converting : t.convertImage}
              </button>

              <button
                type="button"
                className="img-download-btn"
                onClick={downloadImage}
                disabled={!convertedBlob}
              >
                <Download />
                {t.download}
              </button>
            </div>
          </div>
        </div>

        <div className="img-converter-right">
          <div className="img-preview-card">
            <div className="img-preview-head">
              <h3>{t.preview}</h3>

              {convertedBlob ? (
                <span>{formatBytes(convertedBlob.size)}</span>
              ) : imageInfo ? (
                <span>{formatBytes(imageInfo.size)}</span>
              ) : (
                <span>{t.noImage}</span>
              )}
            </div>

            <div className="img-preview-box">
              {convertedUrl || previewUrl ? (
                <img src={convertedUrl || previewUrl} alt="Preview" />
              ) : (
                <div className="img-empty-preview">
                  <ImageIcon />
                  <p>{t.emptyPreview}</p>
                </div>
              )}
            </div>

            {convertedBlob && (
              <div className="img-result-details">
                <div>
                  <span>{t.convertedFormat}</span>
                  <strong>{selectedFormatInfo.label}</strong>
                </div>

                <div>
                  <span>{t.convertedSize}</span>
                  <strong>{formatBytes(convertedBlob.size)}</strong>
                </div>

                <div>
                  <span>{t.downloadFileName}</span>
                  <strong>
                    Convert Wala_{getCleanFileName(imageFile?.name || "image")}
                    _converted.{selectedFormatInfo.ext}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
