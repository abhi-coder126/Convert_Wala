import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Boxes,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/SchemaGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Schema Generator Online Free | JSON-LD Schema Markup",
    seoDesc: "Generate JSON-LD schema markup online for Website, Article, FAQ, Product and Local Business.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Schema Generator",
    subtitle: "Generate SEO-friendly JSON-LD schema markup instantly.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool creates ready-to-use JSON-LD schema markup for websites, blogs, FAQs, products and businesses.",
    type: "Schema Type",
    name: "Name / Title",
    url: "Page URL",
    description: "Description",
    image: "Image URL",
    extra: "Extra Info",
    output: "Generated Schema",
    generate: "Generate Schema",
    copy: "Copy Schema",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    fields: "Fields",
    typeStat: "Type",
    copied: "Schema copied successfully.",
    generated: "Schema generated successfully.",
    noName: "Please enter name/title first.",
  },
  hi: {
    seoTitle: "Schema Generator Online Free | JSON-LD Schema Markup",
    seoDesc: "Website, Article, FAQ, Product और Local Business के लिए JSON-LD schema markup generate करें।",
    eyebrow: "Convert Wala SEO Tool",
    title: "Schema Generator",
    subtitle: "SEO-friendly JSON-LD schema markup instantly generate करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool websites, blogs, FAQs, products और businesses के लिए ready-to-use JSON-LD schema markup बनाता है।",
    type: "Schema Type",
    name: "Name / Title",
    url: "Page URL",
    description: "Description",
    image: "Image URL",
    extra: "Extra Info",
    output: "Generated Schema",
    generate: "Schema Generate करें",
    copy: "Schema Copy करें",
    download: "JSON Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    fields: "Fields",
    typeStat: "Type",
    copied: "Schema successfully copy हो गया।",
    generated: "Schema successfully generate हो गया।",
    noName: "कृपया पहले name/title enter करें।",
  },
  hinglish: {
    seoTitle: "Schema Generator Online Free | JSON-LD Schema Markup",
    seoDesc: "Website, Article, FAQ, Product aur Local Business ke liye JSON-LD schema markup generate karo.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Schema Generator",
    subtitle: "SEO-friendly JSON-LD schema markup instantly generate karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye websites, blogs, FAQs, products aur businesses ke liye ready-to-use JSON-LD schema markup banata hai.",
    type: "Schema Type",
    name: "Name / Title",
    url: "Page URL",
    description: "Description",
    image: "Image URL",
    extra: "Extra Info",
    output: "Generated Schema",
    generate: "Generate Schema",
    copy: "Copy Schema",
    download: "Download JSON",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    fields: "Fields",
    typeStat: "Type",
    copied: "Schema successfully copy ho gaya.",
    generated: "Schema successfully generate ho gaya.",
    noName: "Please pehle name/title enter karo.",
  },
};

const buildSchema = ({ schemaType, name, url, description, image, extra }) => {
  const base = {
    "@context": "https://schema.org",
    "@type": schemaType,
  };

  if (name) base.name = name;
  if (url) base.url = url;
  if (description) base.description = description;
  if (image) base.image = image;

  if (schemaType === "Article") {
    base.headline = name;
    base.author = {
      "@type": "Person",
      name: extra || "Author",
    };
    base.publisher = {
      "@type": "Organization",
      name: extra || name,
    };
  }

  if (schemaType === "FAQPage") {
    base.mainEntity = [
      {
        "@type": "Question",
        name: name || "Question",
        acceptedAnswer: {
          "@type": "Answer",
          text: description || "Answer",
        },
      },
    ];
  }

  if (schemaType === "Product") {
    base.offers = {
      "@type": "Offer",
      priceCurrency: "INR",
      price: extra || "0",
      availability: "https://schema.org/InStock",
    };
  }

  if (schemaType === "LocalBusiness") {
    base.telephone = extra || "";
    base.address = {
      "@type": "PostalAddress",
      addressCountry: "IN",
    };
  }

  if (schemaType === "BreadcrumbList") {
    base.itemListElement = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url || "https://example.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: name || "Page",
        item: url || "https://example.com/page",
      },
    ];
  }

  return JSON.stringify(base, null, 2);
};

export default function SchemaGenerator() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [schemaType, setSchemaType] = useState("WebSite");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [extra, setExtra] = useState("");
  const [outputText, setOutputText] = useState("");
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!name.trim()) return "";
    return buildSchema({ schemaType, name, url, description, image, extra });
  }, [schemaType, name, url, description, image, extra]);

  const currentOutput = outputText || livePreview;

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

  const generateSchema = () => {
    if (!name.trim()) {
      showToast("error", t.noName);
      return;
    }

    setOutputText(buildSchema({ schemaType, name, url, description, image, extra }));
    showToast("success", t.generated);
  };

  const copySchema = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noName);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadSchema = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noName);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "application/ld+json;charset=utf-8",
    });

    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "Convert Wala_schema.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const clearTool = () => {
    setName("");
    setUrl("");
    setDescription("");
    setImage("");
    setExtra("");
    setOutputText("");
  };

  const resetTool = () => {
    clearTool();
    setSchemaType("WebSite");
  };

  const filledFields = [name, url, description, image, extra].filter(Boolean).length;

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="schema generator, json ld generator, seo schema, structured data generator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/schema-generator" />
      </Helmet>

      <main className={`schema-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`schema-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="schema-hero">
          <div className="schema-badge">
            <Boxes />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="schema-info">
          <FileJson />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="schema-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{currentOutput.length}</strong>
          </div>
          <div>
            <span>{t.fields}</span>
            <strong>{filledFields}</strong>
          </div>
          <div>
            <span>{t.typeStat}</span>
            <strong>{schemaType}</strong>
          </div>
        </section>

        <section className="schema-shell">
          <div className="schema-card">
            <div className="schema-card-head">
              <h3>{t.type}</h3>
              <span>JSON-LD</span>
            </div>

            <div className="schema-form">
              <label>
                {t.type}
                <select
                  value={schemaType}
                  onChange={(e) => {
                    setSchemaType(e.target.value);
                    setOutputText("");
                  }}
                >
                  <option value="WebSite">Website</option>
                  <option value="Article">Article</option>
                  <option value="FAQPage">FAQ Page</option>
                  <option value="Product">Product</option>
                  <option value="LocalBusiness">Local Business</option>
                  <option value="BreadcrumbList">Breadcrumb</option>
                </select>
              </label>

              <label>
                {t.name}
                <input value={name} onChange={(e) => { setName(e.target.value); setOutputText(""); }} placeholder="Convert Wala" />
              </label>

              <label>
                {t.url}
                <input value={url} onChange={(e) => { setUrl(e.target.value); setOutputText(""); }} placeholder="https://www.convertwala.com" />
              </label>

              <label>
                {t.image}
                <input value={image} onChange={(e) => { setImage(e.target.value); setOutputText(""); }} placeholder="https://example.com/image.jpg" />
              </label>

              <label>
                {t.extra}
                <input value={extra} onChange={(e) => { setExtra(e.target.value); setOutputText(""); }} placeholder="Author / Price / Phone" />
              </label>

              <label>
                {t.description}
                <textarea value={description} onChange={(e) => { setDescription(e.target.value); setOutputText(""); }} placeholder="Enter schema description..." />
              </label>
            </div>

            <div className="schema-actions">
              <button onClick={generateSchema}>
                <Wand2 />
                {t.generate}
              </button>

              <button onClick={clearTool} disabled={!name && !outputText} className="danger">
                <Trash2 />
                {t.clear}
              </button>

              <button onClick={resetTool}>
                <RotateCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="schema-card">
            <div className="schema-card-head">
              <h3>{t.output}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              className="schema-output"
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Generated JSON-LD schema will appear here..."
              spellCheck="false"
            />

            <div className="schema-actions">
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