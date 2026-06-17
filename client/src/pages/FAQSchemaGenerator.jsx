import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  HelpCircle,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  RotateCcw,
  Wand2,
  Plus,
  Minus,
} from "lucide-react";
import "../styles/FaqSchemaGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "FAQ Schema Generator Online Free | JSON-LD FAQ Markup",
    seoDesc: "Generate FAQPage JSON-LD schema markup online for free.",
    eyebrow: "Convert Wala SEO Tool",
    title: "FAQ Schema Generator",
    subtitle: "Generate SEO-friendly FAQPage JSON-LD schema instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool creates ready-to-use FAQ schema markup for blogs, service pages and websites.",
    question: "Question",
    answer: "Answer",
    output: "Generated FAQ Schema",
    generate: "Generate Schema",
    addFaq: "Add FAQ",
    remove: "Remove",
    copy: "Copy Schema",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    faqs: "FAQs",
    chars: "Characters",
    status: "Status",
    ready: "Ready",
    empty: "Empty",
    copied: "FAQ schema copied successfully.",
    generated: "FAQ schema generated successfully.",
    noFaq: "Please enter at least one question and answer.",
  },
  hi: {
    seoTitle: "FAQ Schema Generator Online Free | JSON-LD FAQ Markup",
    seoDesc: "FAQPage JSON-LD schema markup free online generate करें।",
    eyebrow: "Convert Wala SEO Tool",
    title: "FAQ Schema Generator",
    subtitle: "SEO-friendly FAQPage JSON-LD schema instantly generate करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool blogs, service pages और websites के लिए ready-to-use FAQ schema markup बनाता है।",
    question: "Question",
    answer: "Answer",
    output: "Generated FAQ Schema",
    generate: "Schema Generate करें",
    addFaq: "FAQ Add करें",
    remove: "Remove",
    copy: "Schema Copy करें",
    download: "JSON Download करें",
    clear: "Clear",
    reset: "Reset",
    faqs: "FAQs",
    chars: "Characters",
    status: "Status",
    ready: "Ready",
    empty: "Empty",
    copied: "FAQ schema successfully copy हो गया।",
    generated: "FAQ schema successfully generate हो गया।",
    noFaq: "कृपया कम से कम एक question और answer enter करें।",
  },
  hinglish: {
    seoTitle: "FAQ Schema Generator Online Free | JSON-LD FAQ Markup",
    seoDesc: "FAQPage JSON-LD schema markup free online generate karo.",
    eyebrow: "Convert Wala SEO Tool",
    title: "FAQ Schema Generator",
    subtitle: "SEO-friendly FAQPage JSON-LD schema instantly generate karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye blogs, service pages aur websites ke liye ready-to-use FAQ schema markup banata hai.",
    question: "Question",
    answer: "Answer",
    output: "Generated FAQ Schema",
    generate: "Generate Schema",
    addFaq: "Add FAQ",
    remove: "Remove",
    copy: "Copy Schema",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    faqs: "FAQs",
    chars: "Characters",
    status: "Status",
    ready: "Ready",
    empty: "Empty",
    copied: "FAQ schema successfully copy ho gaya.",
    generated: "FAQ schema successfully generate ho gaya.",
    noFaq: "Please kam se kam ek question aur answer enter karo.",
  },
};

const defaultFaqs = [
  {
    question: "",
    answer: "",
  },
];

const sampleFaqs = [
  {
    question: "What is FAQ schema?",
    answer:
      "FAQ schema is structured data that helps search engines understand questions and answers on a webpage.",
  },
  {
    question: "Does FAQ schema help SEO?",
    answer:
      "FAQ schema can improve search engine understanding and may help pages become eligible for rich results when supported.",
  },
];

const buildFaqSchema = (faqs) => {
  const validFaqs = faqs.filter(
    (item) => item.question.trim() && item.answer.trim()
  );

  if (!validFaqs.length) return "";

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: validFaqs.map((item) => ({
        "@type": "Question",
        name: item.question.trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer.trim(),
        },
      })),
    },
    null,
    2
  );
};

export default function FaqSchemaGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [faqs, setFaqs] = useState(defaultFaqs);
  const [outputText, setOutputText] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => buildFaqSchema(faqs), [faqs]);
  const currentOutput = outputText || livePreview;

  const validFaqCount = faqs.filter(
    (item) => item.question.trim() && item.answer.trim()
  ).length;

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
    setTimeout(() => setToast(null), 2600);
  };

  const updateFaq = (index, field, value) => {
    setFaqs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setOutputText("");
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setOutputText("");
  };

  const removeFaq = (index) => {
    setFaqs((prev) =>
      prev.length === 1 ? defaultFaqs : prev.filter((_, i) => i !== index)
    );
    setOutputText("");
  };

  const generateSchema = () => {
    const schema = buildFaqSchema(faqs);

    if (!schema) {
      showToast("error", t.noFaq);
      return;
    }

    setOutputText(schema);
    showToast("success", t.generated);
  };

  const copySchema = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noFaq);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadSchema = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noFaq);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "application/ld+json;charset=utf-8",
    });

    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "Convert Wala_faq_schema.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const loadSample = () => {
    setFaqs(sampleFaqs);
    setOutputText("");
    showToast("success", t.generated);
  };

  const clearTool = () => {
    setFaqs(defaultFaqs);
    setOutputText("");
  };

  const resetTool = () => {
    clearTool();
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="faq schema generator, faq json ld generator, faqpage schema, seo faq schema"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/faq-schema-generator"
        />
      </Helmet>

      <main className={`faqschema-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`faqschema-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="faqschema-hero">
          <div className="faqschema-badge">
            <HelpCircle />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="faqschema-info">
          <FileJson />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="faqschema-stats">
          <div>
            <span>{t.faqs}</span>
            <strong>{validFaqCount}</strong>
          </div>
          <div>
            <span>{t.chars}</span>
            <strong>{currentOutput.length}</strong>
          </div>
          <div>
            <span>{t.status}</span>
            <strong className={validFaqCount ? "faqschema-valid" : ""}>
              {validFaqCount ? t.ready : t.empty}
            </strong>
          </div>
        </section>

        <section className="faqschema-shell">
          <div className="faqschema-card">
            <div className="faqschema-card-head">
              <h3>FAQ Details</h3>
              <span>{validFaqCount} FAQs</span>
            </div>

            <div className="faqschema-form">
              {faqs.map((item, index) => (
                <div className="faqschema-item" key={index}>
                  <div className="faqschema-item-head">
                    <strong>FAQ #{index + 1}</strong>
                    <button type="button" onClick={() => removeFaq(index)}>
                      <Minus />
                      {t.remove}
                    </button>
                  </div>

                  <label>
                    {t.question}
                    <input
                      value={item.question}
                      onChange={(e) =>
                        updateFaq(index, "question", e.target.value)
                      }
                      placeholder="What is your question?"
                    />
                  </label>

                  <label>
                    {t.answer}
                    <textarea
                      value={item.answer}
                      onChange={(e) =>
                        updateFaq(index, "answer", e.target.value)
                      }
                      placeholder="Write answer here..."
                    />
                  </label>
                </div>
              ))}

              <button className="faqschema-add-btn" type="button" onClick={addFaq}>
                <Plus />
                {t.addFaq}
              </button>
            </div>

            <div className="faqschema-actions">
              <button onClick={generateSchema}>
                <Wand2 />
                {t.generate}
              </button>

              <button onClick={loadSample}>
                <FileJson />
                Sample
              </button>

              <button
                onClick={clearTool}
                disabled={!validFaqCount && !outputText}
                className="danger"
              >
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="faqschema-card">
            <div className="faqschema-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              className="faqschema-output"
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Generated FAQPage JSON-LD schema will appear here..."
              spellCheck="false"
            />

            <div className="faqschema-actions">
              <button onClick={copySchema} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadSchema} disabled={!currentOutput.trim()}>
                <Download />
                {t.download}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}