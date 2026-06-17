import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/chatbot.css"
import {
    Bot,
    X,
    Send,
    MessageCircle,
    Search,
    ExternalLink,
    Languages,
} from "lucide-react";

const toolsKnowledge = [
    {
        name: "Image Format Converter",
        path: "/image-converter",
        category: "Image Tools",
        desc: "Convert JPG, PNG, WEBP, AVIF, JPEG, JFIF and BMP image formats.",
        keywords: ["image", "photo", "converter", "jpg", "png", "webp", "avif", "jpeg", "format"],
    },
    {
        name: "Image Resizer & Cropper",
        path: "/image-resizer-cropper",
        category: "Image Tools",
        desc: "Resize, crop and download images.",
        keywords: ["image", "resize", "crop", "cropper", "photo size"],
    },
    {
        name: "Image to PDF",
        path: "/image-to-pdf",
        category: "PDF Tools",
        desc: "Convert multiple images into one PDF file.",
        keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photo pdf"],
    },
    {
        name: "Video Compressor",
        path: "/video-compressor",
        category: "Video Tools",
        desc: "Reduce video file size.",
        keywords: ["video", "compress", "reduce video size"],
    },
    {
        name: "Video to Audio",
        path: "/video-to-audio",
        category: "Video Tools",
        desc: "Extract audio from video files.",
        keywords: ["video to audio", "extract audio", "audio"],
    },
    {
        name: "Video Trimmer / Merger",
        path: "/video-trimmer-merger",
        category: "Video Tools",
        desc: "Trim videos and merge multiple clips.",
        keywords: ["trim", "merge", "video cutter", "video joiner"],
    },
    {
        name: "GIF Creator",
        path: "/gif-creator",
        category: "Video Tools",
        desc: "Convert video clips into GIF.",
        keywords: ["gif", "video to gif", "gif creator"],
    },
    {
        name: "Voice to Text",
        path: "/voice-to-text",
        category: "AI Tools",
        desc: "Convert speech into text.",
        keywords: ["voice", "speech", "mic", "transcript", "text"],
    },
    {
        name: "AI Text Generator",
        path: "/ai-text-generator",
        category: "AI Tools",
        desc: "Generate blogs, captions, emails and content ideas.",
        keywords: ["ai", "text", "blog", "caption", "content", "email"],
    },
    {
        name: "Direct Video Downloader",
        path: "/direct-video-downloader",
        category: "Video Tools",
        desc: "Download allowed direct MP4/WebM video links.",
        keywords: ["download video", "mp4", "webm", "direct video"],
    },
    {
        name: "YouTube Tools",
        path: "/youtube-tools",
        category: "SEO Tools",
        desc: "YouTube thumbnail, preview, title, description, tags and SEO tools.",
        keywords: ["youtube", "thumbnail", "tags", "description", "seo"],
    },
    {
        name: "PDF Compressor",
        path: "/pdf-compressor",
        category: "PDF Tools",
        desc: "Reduce PDF file size.",
        keywords: ["pdf", "compress", "reduce pdf", "small pdf"],
    },
    {
        name: "PDF to Word",
        path: "/pdf-to-word",
        category: "PDF Tools",
        desc: "Convert PDF text into editable DOCX Word file.",
        keywords: ["pdf to word", "pdf docx", "word"],
    },
    {
        name: "Word to PDF",
        path: "/word-to-pdf",
        category: "PDF Tools",
        desc: "Convert DOCX Word file into PDF.",
        keywords: ["word to pdf", "docx to pdf"],
    },
    {
        name: "PDF Password Remover",
        path: "/pdf-password-remover",
        category: "PDF Tools",
        desc: "Unlock your own PDF using the correct password.",
        keywords: ["unlock pdf", "pdf password remover", "remove password"],
    },
    {
        name: "PDF Password Protect",
        path: "/pdf-password-protect",
        category: "PDF Tools",
        desc: "Add open password protection to PDF.",
        keywords: ["lock pdf", "protect pdf", "pdf password"],
    },
    {
        name: "Invoice Generator",
        path: "/invoice-generator",
        category: "Business Tools",
        desc: "Create professional invoice with logo, signature, stamp and PDF download.",
        keywords: ["invoice", "bill", "business invoice", "signature", "stamp"],
    },
    {
        name: "Robots.txt Generator",
        path: "/robots-txt-generator",
        category: "SEO Tools",
        desc: "Create SEO-friendly robots.txt with sitemap and rules.",
        keywords: ["robots", "robots.txt", "crawler", "seo"],
    },
    {
        name: "Sitemap Generator",
        path: "/sitemap-generator",
        category: "SEO Tools",
        desc: "Create sitemap.xml with URLs, priority, lastmod and changefreq.",
        keywords: ["sitemap", "sitemap xml", "seo"],
    },
    {
        name: "Age Calculator",
        path: "/age-calculator",
        category: "Daily Tools",
        desc: "Calculate exact age in years, months, days and next birthday.",
        keywords: ["age", "birthday", "dob", "date of birth"],
    },
    {
        name: "EMI Calculator",
        path: "/emi-calculator",
        category: "Finance Tools",
        desc: "Calculate EMI, total interest and total loan payment.",
        keywords: ["emi", "loan", "interest", "home loan", "car loan"],
    },
    {
        name: "GST Calculator",
        path: "/gst-calculator",
        category: "Finance Tools",
        desc: "Calculate GST, taxable amount, CGST, SGST and IGST.",
        keywords: ["gst", "tax", "cgst", "sgst", "igst"],
    },
    {
        name: "Currency Converter",
        path: "/currency-converter",
        category: "Finance Tools",
        desc: "Convert currencies using live exchange rates.",
        keywords: ["currency", "converter", "usd", "inr", "exchange"],
    },
    {
        name: "Salary Calculator",
        path: "/salary-calculator",
        category: "Finance Tools",
        desc: "Calculate monthly in-hand salary, deductions, PF and annual salary.",
        keywords: ["salary", "in hand", "pf", "tds", "ctc"],
    },
];

const content = {
    en: {
        title: "Convert Wala Assistant",
        subtitle: "Search tools and get quick help",
        selectTitle: "Choose Language",
        selectDesc: "Select a language before starting the chat.",
        english: "English",
        hindi: "Hindi",
        intro:
            "Hello! I am your Convert Wala assistant. Search any tool name or category, and I will guide you to the right available tool.",
        input: "Search a tool...",
        typing: "Assistant is typing...",
        clickHint: "Click to open the tool",
        available: "is available",
        categoryAvailable: "Here are the available tools under",
        related: "related tool found. Available matching tool is shown below.",
        relatedMany: "related tools found. Available matching tools are shown below.",
        allTools: "Convert Wala currently has",
        allToolsEnd: "available tools. Here they are:",
        upcoming:
            "This tool is upcoming. It is not available right now, but it may be added in the future.",
        empty: "Please type a tool name or category.",
        goodMorning:
            "Good morning! How can I help you today? Please search a tool name or category.",
        goodAfternoon:
            "Good afternoon! I am ready to help. Please search a tool name or category.",
        goodEvening:
            "Good evening! Tell me which tool you are looking for.",
        goodNight:
            "Good night! You can search any tool name, and I will help you.",
        hello:
            "Hello! You can search tools like PDF Compressor, GST Calculator, Invoice Generator, or categories like PDF Tools and Finance Tools.",
        quick: ["PDF Tools", "Finance Tools", "SEO Tools", "Image Tools", "Video Tools", "AI Tools"],
    },

    hi: {
        title: "Convert Wala सहायक",
        subtitle: "टूल खोजें और तुरंत सहायता प्राप्त करें",
        selectTitle: "भाषा चुनें",
        selectDesc: "चैट शुरू करने से पहले अपनी भाषा चुनें।",
        english: "अंग्रेज़ी",
        hindi: "हिंदी",
        intro:
            "नमस्ते! मैं आपका Convert Wala सहायक हूँ। कृपया किसी टूल का नाम या श्रेणी लिखें, मैं आपको सही उपलब्ध टूल तक मार्गदर्शन दूँगा।",
        input: "टूल खोजें...",
        typing: "सहायक लिख रहा है...",
        clickHint: "टूल खोलने के लिए क्लिक करें",
        available: "उपलब्ध है",
        categoryAvailable: "इस श्रेणी में उपलब्ध टूल नीचे दिए गए हैं:",
        related: "संबंधित टूल मिला है। उपलब्ध मिलान टूल नीचे दिया गया है।",
        relatedMany: "संबंधित टूल मिले हैं। उपलब्ध मिलान टूल नीचे दिए गए हैं।",
        allTools: "Convert Wala में अभी",
        allToolsEnd: "टूल उपलब्ध हैं। वे नीचे दिए गए हैं:",
        upcoming:
            "यह टूल जल्द उपलब्ध होगा। अभी यह उपलब्ध नहीं है, लेकिन भविष्य में इसे जोड़ा जा सकता है।",
        empty: "कृपया किसी टूल का नाम या श्रेणी लिखें।",
        goodMorning:
            "सुप्रभात! आज मैं आपकी कैसे सहायता कर सकता हूँ? कृपया टूल का नाम या श्रेणी लिखें।",
        goodAfternoon:
            "नमस्कार! मैं आपकी सहायता के लिए तैयार हूँ। कृपया टूल का नाम या श्रेणी लिखें।",
        goodEvening:
            "शुभ संध्या! कृपया बताइए आप कौन-सा टूल खोज रहे हैं।",
        goodNight:
            "शुभ रात्रि! आप किसी भी टूल का नाम लिख सकते हैं, मैं आपकी सहायता करूँगा।",
        hello:
            "नमस्ते! आप PDF Compressor, GST Calculator, Invoice Generator जैसे टूल या PDF Tools, Finance Tools जैसी श्रेणी खोज सकते हैं।",
        quick: ["PDF टूल", "फाइनेंस टूल", "SEO टूल", "इमेज टूल", "वीडियो टूल", "AI टूल"],
    },
};
const normalize = (text = "") =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9\s.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const makeMessage = (sender, text, tools = [], typing = false) => ({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    sender,
    text,
    displayedText: sender === "bot" ? "" : text,
    tools,
    typing,
    showTools: sender === "user",
});

export default function ToolsChatbot() {
    const bodyRef = useRef(null);
    const typingTimerRef = useRef(null);
    const typingDelayRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState(null);
    const [query, setQuery] = useState("");
    const [botBusy, setBotBusy] = useState(false);
    const [messages, setMessages] = useState([]);

    const t = content[language || "en"];

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, open]);

    useEffect(() => {
        return () => {
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
            if (typingDelayRef.current) clearTimeout(typingDelayRef.current);
        };
    }, []);

    const typeBotMessage = useCallback((text, tools = []) => {
        const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

        setBotBusy(true);

        setMessages((prev) => [
            ...prev,
            {
                id,
                sender: "bot",
                text,
                displayedText: "",
                tools,
                typing: true,
                showTools: false,
            },
        ]);

        typingDelayRef.current = setTimeout(() => {
            let index = 0;

            typingTimerRef.current = setInterval(() => {
                index += 1;

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === id
                            ? {
                                ...msg,
                                displayedText: text.slice(0, index),
                                typing: index < text.length,
                                showTools: index >= text.length,
                            }
                            : msg
                    )
                );

                if (index >= text.length) {
                    clearInterval(typingTimerRef.current);
                    typingTimerRef.current = null;
                    setBotBusy(false);
                }
            }, 18);
        }, 650);
    }, []);

    const chooseLanguage = (selectedLang) => {
        if (botBusy) return;

        setLanguage(selectedLang);
        setMessages([]);
        setQuery("");

        setTimeout(() => {
            typeBotMessage(content[selectedLang].intro);
        }, 120);
    };

    const getGreetingReply = (text, lang) => {
        const raw = text.toLowerCase().trim();
        const lower = normalize(text);
        const tc = content[lang];

        if (
            lower.includes("good morning") ||
            raw.includes("सुप्रभात")
        ) {
            return tc.goodMorning;
        }

        if (
            lower.includes("good afternoon") ||
            raw.includes("नमस्कार")
        ) {
            return tc.goodAfternoon;
        }

        if (
            lower.includes("good evening") ||
            raw.includes("शुभ संध्या")
        ) {
            return tc.goodEvening;
        }

        if (
            lower.includes("good night") ||
            raw.includes("शुभ रात्रि")
        ) {
            return tc.goodNight;
        }

        const words = lower.split(" ");

        if (
            words.includes("hi") ||
            words.includes("hello") ||
            words.includes("hey") ||
            lower.includes("hii") ||
            raw.includes("नमस्ते") ||
            raw.includes("हेलो")
        ) {
            return tc.hello;
        }

        return "";
    };
    const getCategoryTools = (text) => {
        const lower = normalize(text);

        const categoryMap = [
            { words: ["pdf", "पीडीएफ"], category: "PDF Tools" },
            { words: ["finance", "money", "फाइनेंस", "वित्त", "emi", "gst", "salary"], category: "Finance Tools" },
            { words: ["seo", "एसईओ", "robots", "sitemap"], category: "SEO Tools" },
            { words: ["image", "photo", "इमेज", "फोटो"], category: "Image Tools" },
            { words: ["video", "वीडियो"], category: "Video Tools" },
            { words: ["ai", "एआई"], category: "AI Tools" },
            { words: ["business", "invoice", "बिजनेस", "इनवॉइस", "बिल"], category: "Business Tools" },
            { words: ["daily", "age", "दैनिक", "उम्र"], category: "Daily Tools" },
        ];

        const found = categoryMap.find((item) =>
            item.words.some((word) => lower.includes(word))
        );

        if (!found) return [];

        return toolsKnowledge.filter((tool) => tool.category === found.category);
    };

    const getExactTool = (text) => {
        const lower = normalize(text);

        return toolsKnowledge.find((tool) => {
            const toolName = normalize(tool.name);
            return lower === toolName || lower.includes(toolName);
        });
    };

    const searchTools = (text) => {
        const lower = normalize(text);
        const words = lower.split(" ").filter((word) => word.length > 2);

        return toolsKnowledge
            .map((tool) => {
                const data = normalize([
                    tool.name,
                    tool.category,
                    tool.desc,
                    ...tool.keywords,
                ].join(" "));

                let score = 0;

                if (data.includes(lower)) score += 10;

                words.forEach((word) => {
                    if (data.includes(word)) score += 2;
                });

                return { ...tool, score };
            })
            .filter((tool) => tool.score > 0)
            .sort((a, b) => b.score - a.score);
    };

    const buildReply = (text) => {
        const lower = normalize(text);
        const tc = content[language];

        const greeting = getGreetingReply(lower, language);
        if (greeting) {
            return { text: greeting, tools: [] };
        }

        if (
            lower === "all" ||
            lower === "all tools" ||
            lower === "show all tools" ||
            lower.includes("sab tools") ||
            lower.includes("tools list")
        ) {
            return {
                text: `${tc.allTools} ${toolsKnowledge.length} ${tc.allToolsEnd}`,
                tools: toolsKnowledge,
            };
        }

        const exactTool = getExactTool(lower);
        if (exactTool) {
            return {
                text:
                    language === "en"
                        ? `${exactTool.name} is available. ${exactTool.desc}`
                        : `${exactTool.name} ${tc.available}. ${exactTool.desc}`,
                tools: [exactTool],
            };
        }

        const categoryTools = getCategoryTools(lower);
        if (categoryTools.length) {
            return {
                text:
                    language === "en"
                        ? `${tc.categoryAvailable} ${categoryTools[0].category}.`
                        : `${categoryTools[0].category}: ${tc.categoryAvailable}`,
                tools: categoryTools,
            };
        }

        const results = searchTools(lower);
        if (results.length) {
            return {
                text:
                    language === "en"
                        ? `${results.length} ${results.length === 1 ? tc.related : tc.relatedMany}`
                        : `${results.length} ${results.length === 1 ? tc.related : tc.relatedMany}`,
                tools: results.slice(0, 8),
            };
        }

        return {
            text: tc.upcoming,
            tools: [],
        };
    };

    const sendMessage = (value = query) => {
        const clean = value.trim();
        if (!clean || botBusy || !language) return;

        const userMsg = makeMessage("user", clean);

        setMessages((prev) => [...prev, userMsg]);
        setQuery("");

        const reply = buildReply(clean);
        typeBotMessage(reply.text, reply.tools);
    };

    return (
        <>
            <style>{`
        .ath-chatbot * {
          box-sizing: border-box;
        }

        .ath-chat-toggle {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 99999;
          width: 64px;
          height: 64px;
          border: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 22px 55px rgba(37, 99, 235, 0.35);
        }

        .ath-chat-toggle svg {
          width: 30px;
          height: 30px;
        }

        .ath-chat-pulse {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 2px solid rgba(37, 99, 235, 0.35);
          animation: athPulse 1.8s infinite;
        }

        @keyframes athPulse {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        .ath-chat-window {
          position: fixed;
          right: 24px;
          bottom: 100px;
          z-index: 99999;
          width: 410px;
          max-width: calc(100vw - 32px);
          height: 600px;
          max-height: calc(100vh - 130px);
          background: #ffffff;
          border: 1px solid #dbe3ef;
          border-radius: 28px;
          box-shadow: 0 28px 90px rgba(15, 23, 42, 0.22);
          overflow: hidden;
          display: grid;
          grid-template-rows: auto 1fr auto auto;
        }

        .ath-chat-header {
          padding: 16px;
          background: linear-gradient(135deg, #2563eb, #0f172a);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .ath-chat-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .ath-chat-brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.16);
          flex: 0 0 auto;
        }

        .ath-chat-brand h3 {
          margin: 0;
          font-size: 1rem;
          line-height: 1.2;
        }

        .ath-chat-brand p {
          margin: 3px 0 0;
          font-size: 0.78rem;
          opacity: 0.86;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ath-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .ath-lang-mini {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          padding: 4px;
        }

        .ath-lang-mini button {
          border: 0;
          border-radius: 999px;
          padding: 6px 8px;
          color: #ffffff;
          background: transparent;
          font-size: 0.72rem;
          font-weight: 900;
          cursor: pointer;
        }

        .ath-lang-mini button.active {
          background: #ffffff;
          color: #2563eb;
        }

        .ath-chat-close {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 14px;
          background: rgba(255,255,255,0.14);
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .ath-chat-body {
          padding: 16px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .ath-language-screen {
          height: 100%;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 20px;
        }

        .ath-language-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,0.08);
        }

        .ath-language-icon {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          background: #eff6ff;
          color: #2563eb;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
        }

        .ath-language-card h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .ath-language-card p {
          margin: 8px 0 18px;
          color: #64748b;
          line-height: 1.6;
          font-weight: 700;
        }

        .ath-language-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .ath-language-actions button {
          min-height: 48px;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          background: #eff6ff;
          color: #2563eb;
          font-weight: 900;
          cursor: pointer;
        }

        .ath-language-actions button:first-child {
          background: #2563eb;
          color: #ffffff;
        }

        .ath-chat-message {
          display: flex;
          margin-bottom: 14px;
        }

        .ath-chat-message.user {
          justify-content: flex-end;
        }

        .ath-chat-bubble {
          max-width: 90%;
          border-radius: 18px;
          padding: 12px 13px;
          font-size: 0.9rem;
          line-height: 1.55;
          font-weight: 750;
          min-width: 56px;
          min-height: 42px;
        }

        .ath-chat-message.bot .ath-chat-bubble {
          background: #ffffff;
          color: #334155;
          border: 1px solid #e5e7eb;
          border-top-left-radius: 6px;
        }

        .ath-chat-message.user .ath-chat-bubble {
          background: #2563eb;
          color: #ffffff;
          border-top-right-radius: 6px;
        }

        .ath-typing {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 18px;
        }

        .ath-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #94a3b8;
          animation: athTyping 1s infinite ease-in-out;
        }

        .ath-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .ath-typing span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes athTyping {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.45;
          }
          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        .ath-chat-tools {
          display: grid;
          gap: 8px;
          margin-top: 10px;
        }

        .ath-chat-tool-card {
          width: 100%;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          border-radius: 15px;
          padding: 10px;
          text-align: left;
          cursor: pointer;
          transition: 0.22s ease;
          text-decoration: none;
          display: block;
        }

        .ath-chat-tool-card:hover {
          border-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.10);
        }

        .ath-chat-tool-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
        }

        .ath-chat-tool-top strong {
          color: #0f172a;
          font-size: 0.9rem;
        }

        .ath-chat-tool-top svg {
          color: #2563eb;
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
        }

        .ath-chat-tool-card p {
          margin: 0;
          color: #64748b;
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .ath-chat-tool-card span {
          display: inline-flex;
          margin-top: 7px;
          color: #2563eb;
          background: #eff6ff;
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 0.7rem;
          font-weight: 900;
        }

        .ath-chat-quick {
          padding: 12px 14px 0;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .ath-chat-chip {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 0.78rem;
          font-weight: 900;
          white-space: nowrap;
          cursor: pointer;
        }

        .ath-chat-chip:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .ath-chat-input-area {
          padding: 12px 14px 14px;
          background: #ffffff;
          display: grid;
          grid-template-columns: 1fr 46px;
          gap: 10px;
        }

        .ath-chat-input-wrap {
          position: relative;
        }

        .ath-chat-input-wrap svg {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          width: 18px;
          height: 18px;
        }

        .ath-chat-input {
          width: 100%;
          min-height: 46px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          border-radius: 999px;
          padding: 0 14px 0 40px;
          outline: none;
          color: #111827;
          font-weight: 850;
        }

        .ath-chat-input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.10);
        }

        .ath-chat-input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .ath-chat-send {
          width: 46px;
          height: 46px;
          border: 0;
          border-radius: 50%;
          background: #2563eb;
          color: #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .ath-chat-send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .ath-chat-hint {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 900;
        }

        @media (max-width: 640px) {
          .ath-chat-toggle {
            right: 16px;
            bottom: 16px;
            width: 58px;
            height: 58px;
          }

          .ath-chat-window {
            right: 12px;
            left: 12px;
            bottom: 86px;
            width: auto;
            height: min(580px, calc(100vh - 105px));
            border-radius: 22px;
          }

          .ath-chat-bubble {
            max-width: 94%;
          }

          .ath-language-actions {
            grid-template-columns: 1fr;
          }

          .ath-lang-mini {
            display: none;
          }
        }
      `}</style>

            <div className="ath-chatbot">
                {open && (
                    <div className="ath-chat-window">
                        <div className="ath-chat-header">
                            <div className="ath-chat-brand">
                                <div className="ath-chat-brand-icon">
                                    <Bot />
                                </div>

                                <div>
                                    <h3>{t.title}</h3>
                                    <p>{t.subtitle}</p>
                                </div>
                            </div>

                            <div className="ath-header-actions">
                                {language && (
                                    <div className="ath-lang-mini">
                                        <button
                                            type="button"
                                            className={language === "en" ? "active" : ""}
                                            onClick={() => chooseLanguage("en")}
                                        >
                                            EN
                                        </button>
                                        <button
                                            type="button"
                                            className={language === "hi" ? "active" : ""}
                                            onClick={() => chooseLanguage("hi")}
                                        >
                                            HI
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="ath-chat-close"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close chatbot"
                                >
                                    <X />
                                </button>
                            </div>
                        </div>

                        <div className="ath-chat-body" ref={bodyRef}>
                            {!language ? (
                                <div className="ath-language-screen">
                                    <div className="ath-language-card">
                                        <div className="ath-language-icon">
                                            <Languages />
                                        </div>

                                        <h3>{t.selectTitle}</h3>
                                        <p>{t.selectDesc}</p>

                                        <div className="ath-language-actions">
                                            <button type="button" onClick={() => chooseLanguage("en")}>
                                                {t.english}
                                            </button>
                                            <button type="button" onClick={() => chooseLanguage("hi")}>
                                                {t.hindi}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div className={`ath-chat-message ${message.sender}`} key={message.id}>
                                        <div className="ath-chat-bubble">
                                            {message.sender === "bot" && message.typing && !message.displayedText ? (
                                                <span className="ath-typing">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </span>
                                            ) : (
                                                message.displayedText
                                            )}

                                            {message.showTools && message.tools?.length > 0 && (
                                                <>
                                                    <div className="ath-chat-hint">{t.clickHint}</div>

                                                    <div className="ath-chat-tools">
                                                        {message.tools.slice(0, 12).map((tool) => (
                                                            <Link
                                                                to={tool.path}
                                                                className="ath-chat-tool-card"
                                                                key={tool.path}
                                                                onClick={() => setOpen(false)}
                                                            >
                                                                <div className="ath-chat-tool-top">
                                                                    <strong>{tool.name}</strong>
                                                                    <ExternalLink />
                                                                </div>

                                                                <p>{tool.desc}</p>
                                                                <span>{tool.category}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {language && (
                            <div className="ath-chat-quick">
                                {t.quick.map((item) => (
                                    <button
                                        type="button"
                                        className="ath-chat-chip"
                                        key={item}
                                        disabled={botBusy}
                                        onClick={() => sendMessage(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form
                            className="ath-chat-input-area"
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                        >
                            <div className="ath-chat-input-wrap">
                                <Search />
                                <input
                                    className="ath-chat-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={!language ? "Select language first..." : botBusy ? t.typing : t.input}
                                    disabled={!language || botBusy}
                                />
                            </div>

                            <button
                                type="submit"
                                className="ath-chat-send"
                                disabled={!query.trim() || botBusy || !language}
                                aria-label="Send message"
                            >
                                <Send />
                            </button>
                        </form>
                    </div>
                )}

                <button
                    type="button"
                    className="ath-chat-toggle"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Open chatbot"
                >
                    {!open && <span className="ath-chat-pulse"></span>}
                    {open ? <X /> : <MessageCircle />}
                </button>
            </div>
        </>
    );
}