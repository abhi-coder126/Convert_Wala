import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ScrollText,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  RotateCcw,
} from "lucide-react";
import "../styles/LoremIpsumGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
  "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore",
  "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam",
  "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "reprehenderit",
  "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur",
];

const pageText = {
  en: {
    seoTitle: "Lorem Ipsum Generator Online Free | Dummy Text Generator",
    seoDesc:
      "Generate Lorem Ipsum dummy text online for free. Create paragraphs, sentences and words for websites, UI designs and mockups.",
    eyebrow: "Convert Wala Text Tool",
    title: "Lorem Ipsum Generator",
    subtitle:
      "Generate clean dummy text for websites, landing pages, UI designs, mockups and content placeholders.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool generates Lorem Ipsum placeholder text in words, sentences or paragraphs. Designers and developers use it to fill layouts before final content is ready.",
    type: "Generate Type",
    amount: "Amount",
    wordsPerSentence: "Words / Sentence",
    sentencesPerParagraph: "Sentences / Paragraph",
    startLorem: "Start with Lorem Ipsum",
    paragraphs: "Paragraphs",
    sentences: "Sentences",
    words: "Words",
    generate: "Generate Text",
    copy: "Copy Text",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    output: "Generated Text",
    outputPlaceholder: "Your generated Lorem Ipsum text will appear here...",
    copied: "Text copied successfully.",
    generated: "Lorem Ipsum generated successfully.",
    noText: "Please generate text first.",
  },
  hi: {
    seoTitle: "Lorem Ipsum Generator Online Free | Dummy Text Generator",
    seoDesc:
      "Lorem Ipsum dummy text free online generate करें। Websites, UI designs और mockups के लिए paragraphs, sentences और words बनाएं।",
    eyebrow: "Convert Wala टेक्स्ट टूल",
    title: "Lorem Ipsum Generator",
    subtitle:
      "Websites, landing pages, UI designs, mockups और content placeholders के लिए dummy text generate करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool words, sentences या paragraphs में Lorem Ipsum placeholder text generate करता है। Designers और developers layout fill करने के लिए इसे use करते हैं।",
    type: "Generate Type",
    amount: "Amount",
    wordsPerSentence: "Words / Sentence",
    sentencesPerParagraph: "Sentences / Paragraph",
    startLorem: "Lorem Ipsum से शुरू करें",
    paragraphs: "Paragraphs",
    sentences: "Sentences",
    words: "Words",
    generate: "Text Generate करें",
    copy: "Text Copy करें",
    download: "TXT Download करें",
    clear: "Clear",
    reset: "Reset",
    output: "Generated Text",
    outputPlaceholder: "Generated Lorem Ipsum text यहां दिखेगा...",
    copied: "Text successfully copy हो गया।",
    generated: "Lorem Ipsum successfully generate हो गया।",
    noText: "कृपया पहले text generate करें।",
  },
  hinglish: {
    seoTitle: "Lorem Ipsum Generator Online Free | Dummy Text Generator",
    seoDesc:
      "Lorem Ipsum dummy text free online generate karo. Websites, UI designs aur mockups ke liye paragraphs, sentences aur words banao.",
    eyebrow: "Convert Wala Text Tool",
    title: "Lorem Ipsum Generator",
    subtitle:
      "Websites, landing pages, UI designs, mockups aur content placeholders ke liye clean dummy text generate karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye words, sentences ya paragraphs me Lorem Ipsum placeholder text generate karta hai. Designers aur developers layout fill karne ke liye isko use karte hain.",
    type: "Generate Type",
    amount: "Amount",
    wordsPerSentence: "Words / Sentence",
    sentencesPerParagraph: "Sentences / Paragraph",
    startLorem: "Start with Lorem Ipsum",
    paragraphs: "Paragraphs",
    sentences: "Sentences",
    words: "Words",
    generate: "Generate Text",
    copy: "Copy Text",
    download: "Download TXT",
    clear: "Clear",
    reset: "Reset",
    output: "Generated Text",
    outputPlaceholder: "Generated Lorem Ipsum text yaha show hoga...",
    copied: "Text successfully copy ho gaya.",
    generated: "Lorem Ipsum successfully generate ho gaya.",
    noText: "Please pehle text generate karo.",
  },
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const getWord = (index) => loremWords[index % loremWords.length];

const generateSentence = (wordCount, offset = 0) => {
  const words = Array.from({ length: wordCount }, (_, index) =>
    getWord(index + offset)
  );

  return `${capitalize(words.join(" "))}.`;
};

const generateLorem = ({
  type,
  amount,
  wordsPerSentence,
  sentencesPerParagraph,
  startWithLorem,
}) => {
  let offset = startWithLorem ? 0 : Math.floor(Math.random() * loremWords.length);

  if (type === "words") {
    const words = Array.from({ length: amount }, (_, index) =>
      getWord(index + offset)
    );
    return startWithLorem ? words.join(" ") : capitalize(words.join(" "));
  }

  if (type === "sentences") {
    return Array.from({ length: amount }, (_, index) => {
      const sentence = generateSentence(wordsPerSentence, offset);
      offset += wordsPerSentence + index;
      return sentence;
    }).join(" ");
  }

  return Array.from({ length: amount }, (_, paragraphIndex) => {
    const paragraph = Array.from(
      { length: sentencesPerParagraph },
      (_, sentenceIndex) => {
        const sentence = generateSentence(
          wordsPerSentence,
          offset + paragraphIndex + sentenceIndex
        );
        offset += wordsPerSentence;
        return sentence;
      }
    ).join(" ");

    return paragraph;
  }).join("\n\n");
};

const getStats = (text) => {
  const words = text.trim() ? text.trim().match(/\S+/g)?.length || 0 : 0;
  const chars = text.length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((item) => item.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n+/).filter((item) => item.trim()).length
    : 0;

  return { words, chars, sentences, paragraphs };
};

export default function LoremIpsumGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [type, setType] = useState("paragraphs");
  const [amount, setAmount] = useState(3);
  const [wordsPerSentence, setWordsPerSentence] = useState(12);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(4);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [outputText, setOutputText] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const stats = useMemo(() => getStats(outputText), [outputText]);

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

  const showToast = (toastType, message) => {
    setToast({ type: toastType, message });
    setTimeout(() => setToast(null), 2600);
  };

  const handleGenerate = () => {
    const text = generateLorem({
      type,
      amount,
      wordsPerSentence,
      sentencesPerParagraph,
      startWithLorem,
    });

    setOutputText(text);
    showToast("success", t.generated);
  };

  const copyText = async () => {
    if (!outputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(outputText);
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!outputText.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_lorem_ipsum.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setOutputText("");
  };

  const resetTool = () => {
    setType("paragraphs");
    setAmount(3);
    setWordsPerSentence(12);
    setSentencesPerParagraph(4);
    setStartWithLorem(true);
    setOutputText("");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="lorem ipsum generator, dummy text generator, placeholder text, random text generator, website dummy content"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/lorem-ipsum-generator"
        />
      </Helmet>

      <main className={`lorem-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`lorem-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="lorem-hero">
          <div className="lorem-badge">
            <ScrollText />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="lorem-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="lorem-shell">
          <aside className="lorem-control-card">
            <div className="lorem-card-head">
              <h3>Generator Settings</h3>
              <span>Live</span>
            </div>

            <div className="lorem-control">
              <label>{t.type}</label>
              <div className="lorem-type-grid">
                <button
                  className={type === "paragraphs" ? "active" : ""}
                  onClick={() => setType("paragraphs")}
                >
                  {t.paragraphs}
                </button>
                <button
                  className={type === "sentences" ? "active" : ""}
                  onClick={() => setType("sentences")}
                >
                  {t.sentences}
                </button>
                <button
                  className={type === "words" ? "active" : ""}
                  onClick={() => setType("words")}
                >
                  {t.words}
                </button>
              </div>
            </div>

            <div className="lorem-control">
              <label>
                {t.amount}: {amount}
              </label>
              <input
                type="range"
                min="1"
                max={type === "words" ? "300" : "20"}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            {type !== "words" && (
              <div className="lorem-control">
                <label>
                  {t.wordsPerSentence}: {wordsPerSentence}
                </label>
                <input
                  type="range"
                  min="4"
                  max="28"
                  value={wordsPerSentence}
                  onChange={(e) => setWordsPerSentence(Number(e.target.value))}
                />
              </div>
            )}

            {type === "paragraphs" && (
              <div className="lorem-control">
                <label>
                  {t.sentencesPerParagraph}: {sentencesPerParagraph}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sentencesPerParagraph}
                  onChange={(e) =>
                    setSentencesPerParagraph(Number(e.target.value))
                  }
                />
              </div>
            )}

            <label className="lorem-toggle">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
              />
              <span>{t.startLorem}</span>
            </label>

            <div className="lorem-actions">
              <button onClick={handleGenerate}>
                <Sparkles />
                {t.generate}
              </button>

              <button onClick={copyText} disabled={!outputText.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadTxt} disabled={!outputText.trim()}>
                <Download />
                {t.download}
              </button>

              <button onClick={clearTool} disabled={!outputText} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </aside>

          <section className="lorem-output-card">
            <div className="lorem-card-head">
              <h3>{t.output}</h3>
              <span>{stats.words} words</span>
            </div>

            <div className="lorem-stats">
              <div>
                <span>{t.words}</span>
                <strong>{stats.words}</strong>
              </div>
              <div>
                <span>Chars</span>
                <strong>{stats.chars}</strong>
              </div>
              <div>
                <span>{t.sentences}</span>
                <strong>{stats.sentences}</strong>
              </div>
              <div>
                <span>{t.paragraphs}</span>
                <strong>{stats.paragraphs}</strong>
              </div>
            </div>

            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
            />
          </section>
        </section>
      </main>
    </>
  );
}