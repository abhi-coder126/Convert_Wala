import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Mic,
  Square,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const languages = [
  { label: "English India", value: "en-IN" },
  { label: "Hindi / हिन्दी", value: "hi-IN" },
  { label: "Punjabi / ਪੰਜਾਬੀ", value: "pa-IN" },
  { label: "Bengali / বাংলা", value: "bn-IN" },
  { label: "Gujarati / ગુજરાતી", value: "gu-IN" },
  { label: "Kannada / ಕನ್ನಡ", value: "kn-IN" },
  { label: "Malayalam / മലയാളം", value: "ml-IN" },
  { label: "Marathi / मराठी", value: "mr-IN" },
  { label: "Tamil / தமிழ்", value: "ta-IN" },
  { label: "Telugu / తెలుగు", value: "te-IN" },
  { label: "Urdu / اردو", value: "ur-IN" },
  { label: "English US", value: "en-US" },
  { label: "English UK", value: "en-GB" },
];

const pageText = {
  en: {
    eyebrow: "Convert Wala Voice Tool",
    title: "Voice to Text Converter",
    subtitle:
      "Speak through your microphone and convert voice into text instantly. Works best in Chrome. Your voice is not saved in this app.",
    listening: "Listening...",
    ready: "Ready to Listen",
    listeningText: "Speak clearly. Text will appear on the right side.",
    readyText: "Click Start and allow microphone permission.",
    voiceSettings: "Voice Settings",
    language: "Language",
    selectLanguage: "Select Language",
    searchLanguage: "Search language...",
    downloadFileName: "Download File Name",
    start: "Start",
    stop: "Stop",
    clear: "Clear",
    note:
      "Microphone permission is required. For Hindi, select “Hindi India” language.",
    convertedText: "Converted Text",
    words: "Words",
    characters: "Characters",
    copyText: "Copy Text",
    downloadTxt: "Download TXT",
    emptyText: "Your converted text will appear here.",
    notSupported: "Speech recognition is not supported. Use Chrome.",
    started: "Listening started. Speak now.",
    stopped: "Listening stopped.",
    permission: "Allow microphone permission.",
    noSpeech: "Voice was not detected. Try again.",
    recognitionError: "Voice recognition error. Try in Chrome.",
    noCopyText: "There is no text to copy.",
    copied: "Text copied.",
    copyFailed: "Copy failed.",
    noDownloadText: "There is no text to download.",
    downloaded: "Text file downloaded.",
    cleared: "Text cleared.",
    seoTitle:
      "Free Voice to Text Converter Online - Speech to Text Tool | Convert Wala",
    seoDescription:
      "Use Convert Wala free Voice to Text Converter to convert speech into editable text online. Speak through your microphone and download the converted text as TXT.",
    seoKeywords:
      "voice to text, speech to text, free voice to text converter, online speech to text, microphone to text, dictation tool, voice typing, Hindi speech to text, Convert Wala voice tools",
  },

  hi: {
    eyebrow: "Convert Wala वॉइस टूल",
    title: "वॉइस टू टेक्स्ट कन्वर्टर",
    subtitle:
      "Microphone से बोलें और voice को instantly text में convert करें। Chrome में best काम करता है। आपकी voice इस app में save नहीं होती।",
    listening: "Listening...",
    ready: "Ready to Listen",
    listeningText: "Clear बोलें। Text right side में दिखाई देगा।",
    readyText: "Start पर click करें और microphone permission allow करें।",
    voiceSettings: "Voice Settings",
    language: "Language",
    selectLanguage: "Language Select करें",
    searchLanguage: "Language search करें...",
    downloadFileName: "Download File Name",
    start: "Start",
    stop: "Stop",
    clear: "Clear",
    note:
      "Mic permission allow करना जरूरी है। Hindi के लिए “Hindi India” language select करें।",
    convertedText: "Converted Text",
    words: "Words",
    characters: "Characters",
    copyText: "Copy Text",
    downloadTxt: "Download TXT",
    emptyText: "आपका converted text यहां दिखाई देगा।",
    notSupported: "Speech recognition supported नहीं है। Chrome use करें।",
    started: "Listening started. अब बोलें।",
    stopped: "Listening stopped.",
    permission: "Mic permission allow करें।",
    noSpeech: "Voice detect नहीं हुई। Dobara try करें।",
    recognitionError: "Voice recognition error. Chrome में try करें।",
    noCopyText: "Copy करने के लिए text नहीं है।",
    copied: "Text copied.",
    copyFailed: "Copy failed.",
    noDownloadText: "Download करने के लिए text नहीं है।",
    downloaded: "Text file downloaded.",
    cleared: "Text cleared.",
    seoTitle:
      "Free Voice to Text Converter Online - Speech को Text में बदलें | Convert Wala",
    seoDescription:
      "Convert Wala free Voice to Text Converter से speech को editable text में convert करें। Microphone से बोलें और converted text को TXT file में download करें।",
    seoKeywords:
      "voice to text, speech to text, voice ko text me badle, Hindi speech to text, free voice to text converter, online dictation tool, Convert Wala voice tools",
  },

  hinglish: {
    eyebrow: "Convert Wala Voice Tool",
    title: "Voice to Text Converter",
    subtitle:
      "Microphone se bolo aur voice ko instantly text me convert karo. Chrome me best kaam karta hai. Tumhari voice app me save nahi hoti.",
    listening: "Listening...",
    ready: "Ready to Listen",
    listeningText: "Clear bolo. Text right side me appear hoga.",
    readyText: "Start par click karo aur microphone permission allow karo.",
    voiceSettings: "Voice Settings",
    language: "Language",
    selectLanguage: "Select Language",
    searchLanguage: "Search language...",
    downloadFileName: "Download File Name",
    start: "Start",
    stop: "Stop",
    clear: "Clear",
    note:
      "Mic permission allow karna zaruri hai. Hindi ke liye “Hindi India” language select karo.",
    convertedText: "Converted Text",
    words: "Words",
    characters: "Characters",
    copyText: "Copy Text",
    downloadTxt: "Download TXT",
    emptyText: "Tumhara converted text yahan appear hoga.",
    notSupported: "Speech recognition supported nahi hai. Chrome use karo.",
    started: "Listening started. Speak now.",
    stopped: "Listening stopped.",
    permission: "Mic permission allow karo.",
    noSpeech: "Voice detect nahi hui. Dobara try karo.",
    recognitionError: "Voice recognition error. Chrome me try karo.",
    noCopyText: "Copy karne ke liye text nahi hai.",
    copied: "Text copied.",
    copyFailed: "Copy failed.",
    noDownloadText: "Download karne ke liye text nahi hai.",
    downloaded: "Text file downloaded.",
    cleared: "Text cleared.",
    seoTitle:
      "Free Voice to Text Converter Online - Speech to Text Tool | Convert Wala",
    seoDescription:
      "Convert Wala free Voice to Text Converter se speech ko editable text me convert karo. Microphone se bolo aur converted text TXT file me download karo.",
    seoKeywords:
      "voice to text, speech to text, free voice to text converter, online speech to text, microphone to text, voice typing, Hindi speech to text, Convert Wala voice tools",
  },
};

const cleanFileName = (name = "voice_to_text") => {
  return name.replace(/[^a-z0-9-_]/gi, "_");
};

export default function VoiceToText() {
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const manualStopRef = useRef(false);
  const languageBoxRef = useRef(null);

  const [uiLanguage, setUiLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [speechLanguage, setSpeechLanguage] = useState("en-IN");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");

  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [fileName, setFileName] = useState("Convert Wala_voice_to_text");
  const [toast, setToast] = useState(null);

  const t = pageText[uiLanguage] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/voice-to-text";

  const selectedLanguage = languages.find(
    (item) => item.value === speechLanguage
  );

  const filteredLanguages = useMemo(() => {
    const search = languageSearch.toLowerCase().trim();

    if (!search) return languages;

    return languages.filter(
      (item) =>
        item.label.toLowerCase().includes(search) ||
        item.value.toLowerCase().includes(search)
    );
  }, [languageSearch]);

  const finalText = useMemo(() => {
    const text = `${transcript}${interim ? ` ${interim}` : ""}`.trim();
    return text;
  }, [transcript, interim]);

  const wordCount = finalText
    ? finalText.split(/\s+/).filter(Boolean).length
    : 0;

  const charCount = finalText.length;

  useEffect(() => {
    const syncSettings = () => {
      setUiLanguage(localStorage.getItem(STORAGE_LANGUAGE) || "en");
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

  const isSupported = () => {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  };

  const startListening = () => {
    if (!isSupported()) {
      showToast("error", t.notSupported);
      return;
    }

    if (listening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    manualStopRef.current = false;
    finalTranscriptRef.current = transcript ? `${transcript.trim()} ` : "";

    recognition.lang = speechLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      showToast("success", t.started);
    };

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";

        if (result.isFinal) {
          finalChunk += `${text} `;
        } else {
          interimChunk += text;
        }
      }

      if (finalChunk) {
        finalTranscriptRef.current += finalChunk;
        setTranscript(finalTranscriptRef.current.trim());
      }

      setInterim(interimChunk);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        showToast("error", t.permission);
      } else if (event.error === "no-speech") {
        showToast("error", t.noSpeech);
      } else {
        showToast("error", t.recognitionError);
      }
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");

      if (!manualStopRef.current) {
        showToast("success", t.stopped);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    manualStopRef.current = true;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
    setInterim("");
    showToast("success", t.stopped);
  };

  const copyText = async () => {
    if (!finalText) {
      showToast("error", t.noCopyText);
      return;
    }

    try {
      await navigator.clipboard.writeText(finalText);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadText = () => {
    if (!finalText) {
      showToast("error", t.noDownloadText);
      return;
    }

    const blob = new Blob([finalText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const name = cleanFileName(fileName || "Convert Wala_voice_to_text");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showToast("success", t.downloaded);
  };

  const clearText = () => {
    finalTranscriptRef.current = "";
    setTranscript("");
    setInterim("");
    showToast("success", t.cleared);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageBoxRef.current &&
        !languageBoxRef.current.contains(event.target)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  return (
    <main className={`vtt-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={uiLanguage === "hi" ? "hi" : "en"} />

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
        <meta
          property="og:locale"
          content={uiLanguage === "hi" ? "hi_IN" : "en_US"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Voice to Text Converter",
            url: canonicalUrl,
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Any",
            browserRequirements:
              "Requires a browser with SpeechRecognition support",
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
              "Convert voice to text online",
              "Speech recognition",
              "Multiple Indian languages",
              "Copy converted text",
              "Download text as TXT file",
              "Browser-based voice typing",
            ],
          })}
        </script>
      </Helmet>

      <style>{`
        .vtt-page,
        .vtt-page * {
          box-sizing: border-box;
        }

        .vtt-page {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
        }

        .vtt-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.28), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .vtt-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .vtt-page.dark .vtt-hero {
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 34%),
            #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .vtt-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vtt-page.dark .vtt-eyebrow {
          color: #93c5fd;
        }

        .vtt-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .vtt-page.dark .vtt-hero h1 {
          color: #f8fafc;
        }

        .vtt-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .vtt-page.dark .vtt-hero p,
        .vtt-page.dark .vtt-mic-card p,
        .vtt-page.dark .vtt-note,
        .vtt-page.dark .vtt-empty {
          color: #cbd5e1;
        }

        .vtt-shell {
          width: 100%;
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.85fr) minmax(420px, 1.15fr);
          gap: 30px;
          align-items: start;
        }

        .vtt-left,
        .vtt-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .vtt-card {
          max-width: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .vtt-page.dark .vtt-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
        }

        .vtt-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .vtt-page.dark .vtt-card h3,
        .vtt-page.dark .vtt-mic-card strong,
        .vtt-page.dark .vtt-field,
        .vtt-page.dark .vtt-output-head h3,
        .vtt-page.dark .vtt-lang-field > span {
          color: #f8fafc;
        }

        .vtt-mic-card {
          min-height: 270px;
          display: grid;
          place-items: center;
          text-align: center;
        }

        .vtt-mic-circle {
          width: 118px;
          height: 118px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          margin-bottom: 18px;
          position: relative;
        }

        .vtt-page.dark .vtt-mic-circle {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .vtt-mic-circle svg {
          width: 48px;
          height: 48px;
        }

        .vtt-mic-circle.listening {
          background: #dcfce7;
          color: #15803d;
          animation: vttPulse 1.4s ease-in-out infinite;
        }

        @keyframes vttPulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.34); }
          70% { box-shadow: 0 0 0 22px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .vtt-mic-card strong {
          display: block;
          color: #0f172a;
          font-size: 1.28rem;
        }

        .vtt-mic-card p,
        .vtt-note {
          color: #64748b;
          line-height: 1.6;
        }

        .vtt-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .vtt-field,
        .vtt-lang-field > span {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .vtt-field select,
        .vtt-field input,
        .vtt-lang-btn,
        .vtt-lang-search {
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

        .vtt-page.dark .vtt-field select,
        .vtt-page.dark .vtt-field input,
        .vtt-page.dark .vtt-lang-btn,
        .vtt-page.dark .vtt-lang-search {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vtt-lang-field {
          position: relative;
          z-index: 20;
        }

        .vtt-lang-field > span {
          display: block;
          margin-bottom: 8px;
        }

        .vtt-lang-btn {
          min-height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          text-align: left;
        }

        .vtt-lang-btn span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vtt-lang-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .vtt-lang-menu {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 10px);
          z-index: 999;
          background: #ffffff;
          border: 1px solid #dbe3ef;
          border-radius: 18px;
          padding: 12px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
        }

        .vtt-page.dark .vtt-lang-menu {
          background: #0f172a;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vtt-lang-search {
          min-height: 44px;
          border-radius: 14px;
          margin-bottom: 10px;
        }

        .vtt-lang-list {
          max-height: 260px;
          overflow-y: auto;
          display: grid;
          gap: 6px;
          padding-right: 4px;
        }

        .vtt-lang-list button {
          width: 100%;
          border: 0;
          background: transparent;
          color: #334155;
          border-radius: 12px;
          padding: 11px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          text-align: left;
          font-weight: 900;
        }

        .vtt-page.dark .vtt-lang-list button {
          color: #e2e8f0;
        }

        .vtt-lang-list button:hover,
        .vtt-lang-list button.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .vtt-page.dark .vtt-lang-list button:hover,
        .vtt-page.dark .vtt-lang-list button.active {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .vtt-lang-list small {
          color: #64748b;
          font-weight: 800;
        }

        .vtt-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .vtt-primary,
        .vtt-dark,
        .vtt-danger,
        .vtt-light {
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
        }

        .vtt-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .vtt-dark {
          background: #111827;
          color: #ffffff;
        }

        .vtt-page.dark .vtt-dark {
          background: #38bdf8;
          color: #020617;
        }

        .vtt-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .vtt-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .vtt-page.dark .vtt-light {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.18);
        }

        .vtt-output-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .vtt-output-head h3 {
          margin: 0;
        }

        .vtt-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .vtt-stats span {
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.82rem;
          font-weight: 900;
        }

        .vtt-page.dark .vtt-stats span {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
        }

        .vtt-textarea {
          width: 100%;
          max-width: 100%;
          min-height: 430px;
          resize: vertical;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          color: #111827;
          border-radius: 24px;
          padding: 20px;
          outline: none;
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.8;
        }

        .vtt-page.dark .vtt-textarea,
        .vtt-page.dark .vtt-empty {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .vtt-textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          background: #fff;
        }

        .vtt-page.dark .vtt-textarea:focus {
          background: #020617;
        }

        .vtt-interim {
          margin-top: 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 18px;
          padding: 14px;
          line-height: 1.7;
          font-weight: 800;
        }

        .vtt-empty {
          min-height: 430px;
          border-radius: 24px;
          border: 1px dashed #cbd5e1;
          background: #f8fafc;
          display: grid;
          place-items: center;
          text-align: center;
          color: #94a3b8;
          padding: 30px;
        }

        .vtt-empty svg {
          width: 68px;
          height: 68px;
          margin-bottom: 12px;
        }

        .vtt-toast {
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

        .vtt-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .vtt-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .vtt-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1200px) {
          .vtt-shell {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .vtt-left,
          .vtt-right {
            width: 100%;
          }

          .vtt-mic-card {
            min-height: 230px;
          }
        }

        @media (max-width: 768px) {
          .vtt-hero {
            padding: 54px 5% 34px;
          }

          .vtt-hero h1 {
            font-size: clamp(2.15rem, 12vw, 3.5rem);
            letter-spacing: -0.05em;
          }

          .vtt-hero p {
            font-size: 0.98rem;
            line-height: 1.7;
          }

          .vtt-shell {
            padding: 32px 5% 58px;
            gap: 20px;
          }

          .vtt-card {
            border-radius: 22px;
            padding: 20px;
          }

          .vtt-mic-card {
            min-height: 220px;
          }

          .vtt-mic-circle {
            width: 96px;
            height: 96px;
            margin-bottom: 14px;
          }

          .vtt-mic-circle svg {
            width: 40px;
            height: 40px;
          }

          .vtt-mic-card strong {
            font-size: 1.12rem;
          }

          .vtt-actions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .vtt-primary,
          .vtt-dark,
          .vtt-danger,
          .vtt-light {
            width: 100%;
            min-height: 48px;
            padding: 0 16px;
          }

          .vtt-output-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .vtt-stats {
            width: 100%;
          }

          .vtt-stats span {
            flex: 1;
            text-align: center;
          }

          .vtt-textarea,
          .vtt-empty {
            min-height: 320px;
            border-radius: 20px;
            padding: 16px;
            font-size: 0.95rem;
          }

          .vtt-field select,
          .vtt-field input,
          .vtt-lang-btn {
            min-height: 48px;
            border-radius: 14px;
          }

          .vtt-lang-menu {
            position: relative;
            top: auto;
            margin-top: 10px;
          }

          .vtt-lang-list {
            max-height: 230px;
          }

          .vtt-toast {
            left: 14px;
            right: 14px;
            top: 82px;
            min-width: unset;
            max-width: unset;
            border-radius: 16px;
          }
        }

        @media (max-width: 480px) {
          .vtt-hero {
            padding: 44px 4.5% 28px;
          }

          .vtt-eyebrow {
            font-size: 0.68rem;
            letter-spacing: 0.13em;
          }

          .vtt-hero h1 {
            font-size: 2.05rem;
            line-height: 1.05;
          }

          .vtt-hero p {
            font-size: 0.92rem;
          }

          .vtt-shell {
            padding: 24px 4.5% 48px;
          }

          .vtt-card {
            padding: 16px;
            border-radius: 18px;
          }

          .vtt-card h3 {
            font-size: 1.05rem;
          }

          .vtt-mic-card {
            min-height: 190px;
          }

          .vtt-mic-circle {
            width: 82px;
            height: 82px;
          }

          .vtt-mic-circle svg {
            width: 34px;
            height: 34px;
          }

          .vtt-mic-card p,
          .vtt-note {
            font-size: 0.9rem;
          }

          .vtt-textarea,
          .vtt-empty {
            min-height: 280px;
            font-size: 0.9rem;
            line-height: 1.65;
          }

          .vtt-stats {
            display: grid;
            grid-template-columns: 1fr;
          }

          .vtt-interim {
            font-size: 0.9rem;
            padding: 12px;
            border-radius: 14px;
          }
        }

        @media (max-width: 360px) {
          .vtt-hero h1 {
            font-size: 1.8rem;
          }

          .vtt-shell {
            padding-left: 10px;
            padding-right: 10px;
          }

          .vtt-card {
            padding: 14px;
          }

          .vtt-primary,
          .vtt-dark,
          .vtt-danger,
          .vtt-light {
            font-size: 0.86rem;
          }

          .vtt-textarea,
          .vtt-empty {
            min-height: 240px;
          }
        }
      `}</style>

      {toast && (
        <div className={`vtt-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="vtt-hero">
        <p className="vtt-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="vtt-shell">
        <div className="vtt-left">
          <div className="vtt-card vtt-mic-card">
            <div>
              <div className={`vtt-mic-circle ${listening ? "listening" : ""}`}>
                <Mic />
              </div>

              <strong>{listening ? t.listening : t.ready}</strong>

              <p>{listening ? t.listeningText : t.readyText}</p>
            </div>
          </div>

          <div className="vtt-card">
            <h3>{t.voiceSettings}</h3>

            <div className="vtt-form-grid">
              <div className="vtt-field vtt-lang-field" ref={languageBoxRef}>
                <span>{t.language}</span>

                <button
                  type="button"
                  className="vtt-lang-btn"
                  disabled={listening}
                  onClick={() => setLanguageMenuOpen((prev) => !prev)}
                >
                  <span>{selectedLanguage?.label || t.selectLanguage}</span>
                  <b>⌄</b>
                </button>

                {languageMenuOpen && (
                  <div className="vtt-lang-menu">
                    <input
                      type="text"
                      className="vtt-lang-search"
                      placeholder={t.searchLanguage}
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                    />

                    <div className="vtt-lang-list">
                      {filteredLanguages.map((item) => (
                        <button
                          type="button"
                          key={item.value}
                          className={
                            speechLanguage === item.value ? "active" : ""
                          }
                          onClick={() => {
                            setSpeechLanguage(item.value);
                            setLanguageMenuOpen(false);
                            setLanguageSearch("");
                          }}
                        >
                          <span>{item.label}</span>
                          <small>{item.value}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <label className="vtt-field">
                {t.downloadFileName}
                <input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Convert Wala_voice_to_text"
                />
              </label>
            </div>

            <div className="vtt-actions">
              {!listening ? (
                <button
                  type="button"
                  className="vtt-primary"
                  onClick={startListening}
                >
                  <Mic />
                  {t.start}
                </button>
              ) : (
                <button
                  type="button"
                  className="vtt-danger"
                  onClick={stopListening}
                >
                  <Square />
                  {t.stop}
                </button>
              )}

              <button type="button" className="vtt-light" onClick={clearText}>
                <Trash2 />
                {t.clear}
              </button>
            </div>

            <p className="vtt-note">{t.note}</p>
          </div>
        </div>

        <div className="vtt-right">
          <div className="vtt-card">
            <div className="vtt-output-head">
              <h3>{t.convertedText}</h3>

              <div className="vtt-stats">
                <span>
                  {wordCount} {t.words}
                </span>
                <span>
                  {charCount} {t.characters}
                </span>
              </div>
            </div>

            {finalText ? (
              <>
                <textarea
                  className="vtt-textarea"
                  value={finalText}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    finalTranscriptRef.current = e.target.value;
                  }}
                />

                {interim && <div className="vtt-interim">{interim}</div>}

                <div className="vtt-actions">
                  <button type="button" className="vtt-dark" onClick={copyText}>
                    <Copy />
                    {t.copyText}
                  </button>

                  <button
                    type="button"
                    className="vtt-primary"
                    onClick={downloadText}
                  >
                    <Download />
                    {t.downloadTxt}
                  </button>
                </div>
              </>
            ) : (
              <div className="vtt-empty">
                <div>
                  <FileText />
                  <p>{t.emptyText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}