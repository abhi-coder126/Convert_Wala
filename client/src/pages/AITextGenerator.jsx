import { useMemo, useState } from "react";
import {
  Sparkles,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";

const generatorTypes = [
  "Blog Post",
  "Instagram Caption",
  "Product Description",
  "Ad Copy",
  "Email",
  "YouTube Description",
  "Social Media Post",
  "Business Bio",
  "Paragraph",
  "Title Ideas",
];

const tones = [
  "Professional",
  "Friendly",
  "Creative",
  "Luxury",
  "Simple",
  "Marketing",
  "Motivational",
];

const languages = ["English", "Hindi", "Hinglish"];

const cleanFileName = (name = "ai_text") => {
  return name.replace(/[^a-z0-9-_]/gi, "_");
};

export default function AITextGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("Blog Post");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [keywords, setKeywords] = useState("");
  const [output, setOutput] = useState("");
  const [toast, setToast] = useState(null);

  const wordCount = useMemo(() => {
    return output ? output.split(/\s+/).filter(Boolean).length : 0;
  }, [output]);

  const showToast = (toastType, message) => {
    setToast({ type: toastType, message });
    setTimeout(() => setToast(null), 2600);
  };

  const getKeywordLine = () => {
    if (!keywords.trim()) return "";
    return keywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  };

  const generateEnglish = () => {
    const keyLine = getKeywordLine();
    const baseTopic = topic.trim();

    if (type === "Blog Post") {
      return `Title: ${baseTopic}: A Complete Guide

Introduction:
${baseTopic} is becoming an important topic for people who want faster, smarter and more practical results. With the right approach, it can help improve productivity, save time and create better outcomes.

Why ${baseTopic} Matters:
In today’s digital world, users want simple solutions that work quickly. ${baseTopic} helps people understand the process, make better decisions and take action with confidence.

Key Benefits:
1. Saves time and effort.
2. Improves clarity and planning.
3. Helps users get better results.
4. Makes the process more organized.
5. Supports faster decision-making.

Best Practices:
Start with a clear goal, understand your audience and use simple steps. Avoid overcomplicating the process. Focus on useful information and practical results.

${keyLine ? `Keywords to include: ${keyLine}` : ""}

Conclusion:
${baseTopic} can become much easier when you use the right tools and strategy. A clear plan, useful content and consistent action can help you achieve better results.`;
    }

    if (type === "Instagram Caption") {
      return `✨ ${baseTopic}

Simple idea. Strong impact. Real results.

${tone} content works best when it feels clear, useful and easy to connect with.

What do you think? Drop your thoughts below 👇

${keyLine ? keyLine.split(", ").map((k) => `#${k.replace(/\s+/g, "")}`).join(" ") : "#Convert Wala #Growth #Creative #Trending"}`;
    }

    if (type === "Product Description") {
      return `${baseTopic} is designed for people who want quality, simplicity and reliable performance. It helps users save time, improve their workflow and get a smooth experience.

Key Highlights:
• Easy to use
• Clean and practical design
• Built for everyday needs
• Reliable performance
• Great value for users

${keyLine ? `Related keywords: ${keyLine}` : ""}

Choose ${baseTopic} for a smarter and more convenient experience.`;
    }

    if (type === "Ad Copy") {
      return `Ready to upgrade your experience with ${baseTopic}?

Get a smarter, faster and easier way to achieve better results. Built for users who value quality, clarity and convenience.

Why choose it?
✅ Simple to use
✅ Saves time
✅ Professional results
✅ Better experience

Start today and see the difference.`;
    }

    if (type === "Email") {
      return `Subject: Introducing ${baseTopic}

Hi,

I hope you are doing well.

I wanted to share something useful about ${baseTopic}. It can help improve productivity, simplify the process and deliver better results with less effort.

Here are a few key benefits:
• Easy to understand
• Practical for daily use
• Helps save time
• Supports better outcomes

${keyLine ? `Important points: ${keyLine}` : ""}

Let me know if you would like to explore this further.

Best regards,`;
    }

    if (type === "YouTube Description") {
      return `In this video, we are talking about ${baseTopic} and how it can help you get better results.

What you will learn:
00:00 Introduction
01:00 Why ${baseTopic} matters
02:30 Key benefits
04:00 Practical tips
06:00 Final thoughts

${keyLine ? `Topics covered: ${keyLine}` : ""}

Like, share and subscribe for more useful content.

#Convert Wala #YouTube #DigitalTools`;
    }

    if (type === "Social Media Post") {
      return `${baseTopic} is not just a topic, it is an opportunity to grow smarter.

When you use the right approach, you save time, improve quality and get better results.

Focus on clarity. Keep it simple. Stay consistent.

${keyLine ? keyLine : "#Convert Wala #Productivity #Growth"}`;
    }

    if (type === "Business Bio") {
      return `${baseTopic} helps people and businesses create smarter digital experiences. With a focus on quality, clarity and practical results, we make every solution simple, useful and growth-focused.`;
    }

    if (type === "Paragraph") {
      return `${baseTopic} is a useful concept for people who want simple, effective and practical results. With the right strategy, it can help save time, improve planning and make the overall process smoother. A clear approach and consistent execution can make ${baseTopic} more valuable for users.`;
    }

    return `1. Best Guide to ${baseTopic}
2. How ${baseTopic} Can Help You Grow
3. Top Benefits of ${baseTopic}
4. Why ${baseTopic} Matters Today
5. Simple Ways to Use ${baseTopic}
6. ${baseTopic}: Complete Beginner Guide
7. Smart Tips for ${baseTopic}
8. How to Get Better Results with ${baseTopic}
9. The Future of ${baseTopic}
10. ${baseTopic} Made Simple`;
  };

  const generateHindi = () => {
    const baseTopic = topic.trim();

    return `शीर्षक: ${baseTopic}

${baseTopic} आज के समय में एक उपयोगी विषय है। सही तरीके से इसका इस्तेमाल करने पर यह समय बचाने, बेहतर परिणाम पाने और काम को आसान बनाने में मदद कर सकता है।

मुख्य फायदे:
1. काम को आसान बनाता है।
2. समय की बचत करता है।
3. बेहतर योजना बनाने में मदद करता है।
4. परिणामों को अधिक प्रभावी बनाता है।
5. यूजर के अनुभव को बेहतर करता है।

${keywords.trim() ? `मुख्य शब्द: ${keywords}` : ""}

निष्कर्ष:
${baseTopic} को सही रणनीति और सही टूल्स के साथ इस्तेमाल किया जाए तो यह बहुत उपयोगी साबित हो सकता है।`;
  };

  const generateHinglish = () => {
    const baseTopic = topic.trim();

    return `Title: ${baseTopic}

${baseTopic} aaj ke time me kaafi useful topic hai. Agar isko sahi strategy ke saath use kiya jaye, to ye time save karta hai, work ko simple banata hai aur better results dene me help karta hai.

Key Points:
1. Process simple hota hai.
2. Time save hota hai.
3. Planning better hoti hai.
4. Results professional lagte hain.
5. Users ko better experience milta hai.

${keywords.trim() ? `Keywords: ${keywords}` : ""}

Conclusion:
${baseTopic} ko smart tareeke se use karna important hai. Right tools aur clear approach ke saath aap better output generate kar sakte ho.`;
  };

const generateText = async () => {
  if (!topic.trim()) {
    showToast("error", "Pehle topic ya keyword likho.");
    return;
  }

  try {
    setOutput("Generating smart content...");
    showToast("success", "AI content generate ho raha hai...");

    const res = await fetch("http://localhost:5000/api/ai/generate-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type,
        tone,
        language,
        keywords,
        useLiveData: true,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "AI generation failed");
    }

    let finalText = data.text;

    if (data.sources?.length) {
      finalText += "\n\nSources:\n";
      finalText += data.sources
        .map((source, index) => `${index + 1}. ${source.title}\n${source.url}`)
        .join("\n\n");
    }

    setOutput(finalText);
    showToast("success", "Smart AI content generated.");
  } catch (error) {
    setOutput("");
    showToast("error", error.message || "AI content generate nahi hua.");
  }
};

  const copyText = async () => {
    if (!output) {
      showToast("error", "Copy karne ke liye text nahi hai.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      showToast("success", "Text copied.");
    } catch {
      showToast("error", "Copy failed.");
    }
  };

  const downloadText = () => {
    if (!output) {
      showToast("error", "Download karne ke liye text nahi hai.");
      return;
    }

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const name = cleanFileName(`Convert Wala_${type}_${topic || "ai_text"}`);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    showToast("success", "Text file downloaded.");
  };

  const clearAll = () => {
    setTopic("");
    setKeywords("");
    setOutput("");
    showToast("success", "Cleared.");
  };

  return (
    <main className="ait-page">
      <style>{`
        .ait-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          overflow-x: hidden;
        }

        .ait-page * {
          box-sizing: border-box;
        }

        .ait-hero {
          padding: 82px 6% 46px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .ait-eyebrow {
          margin: 0 0 14px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .ait-hero h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(2.4rem, 5vw, 5.4rem);
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .ait-hero p {
          max-width: 850px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.08rem;
        }

        .ait-shell {
          padding: 48px 6% 80px;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(420px, 1.1fr);
          gap: 30px;
          align-items: start;
        }

        .ait-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.08);
        }

        .ait-card h3 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 1.2rem;
        }

        .ait-left,
        .ait-right {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .ait-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .ait-field.full {
          grid-column: 1 / -1;
        }

        .ait-field {
          color: #334155;
          font-weight: 900;
          font-size: 0.9rem;
        }

        .ait-field input,
        .ait-field select,
        .ait-field textarea {
          width: 100%;
          margin-top: 8px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 16px;
          padding: 13px 15px;
          outline: none;
          font-weight: 800;
          font-family: inherit;
        }

        .ait-field textarea {
          min-height: 110px;
          resize: vertical;
          line-height: 1.7;
        }

        .ait-field input:focus,
        .ait-field select:focus,
        .ait-field textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          background: #ffffff;
        }

        .ait-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .ait-primary,
        .ait-dark,
        .ait-light,
        .ait-danger {
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

        .ait-primary {
          background: #2563eb;
          color: #ffffff;
        }

        .ait-dark {
          background: #111827;
          color: #ffffff;
        }

        .ait-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .ait-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .ait-primary:hover,
        .ait-dark:hover,
        .ait-light:hover,
        .ait-danger:hover {
          transform: translateY(-2px);
        }

        .ait-output-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }

        .ait-output-head h3 {
          margin: 0;
        }

        .ait-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ait-stats span {
          background: #eff6ff;
          color: #2563eb;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.82rem;
          font-weight: 900;
        }

        .ait-output {
          min-height: 520px;
          white-space: pre-wrap;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 22px;
          color: #111827;
          line-height: 1.8;
          font-size: 1rem;
        }

        .ait-empty {
          min-height: 520px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #94a3b8;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 24px;
          padding: 30px;
        }

        .ait-empty svg {
          width: 70px;
          height: 70px;
          margin-bottom: 12px;
        }

        .ait-suggestions {
          display: grid;
          gap: 10px;
        }

        .ait-chip {
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #334155;
          border-radius: 999px;
          padding: 11px 14px;
          text-align: left;
          font-weight: 900;
          cursor: pointer;
        }

        .ait-chip:hover {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .ait-toast {
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

        .ait-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .ait-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .ait-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1100px) {
          .ait-shell {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .ait-hero {
            padding: 56px 5% 34px;
          }

          .ait-hero h1 {
            font-size: clamp(2.1rem, 12vw, 3.6rem);
            letter-spacing: -0.05em;
          }

          .ait-hero p {
            font-size: 0.96rem;
            line-height: 1.7;
          }

          .ait-shell {
            padding: 34px 5% 60px;
            gap: 22px;
          }

          .ait-card {
            padding: 20px;
            border-radius: 22px;
          }

          .ait-form-grid {
            grid-template-columns: 1fr;
          }

          .ait-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .ait-primary,
          .ait-dark,
          .ait-light,
          .ait-danger {
            width: 100%;
          }

          .ait-output-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .ait-output,
          .ait-empty {
            min-height: 360px;
            border-radius: 20px;
            padding: 18px;
            font-size: 0.94rem;
          }

          .ait-stats {
            width: 100%;
          }

          .ait-stats span {
            flex: 1;
            text-align: center;
          }

          .ait-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .ait-hero {
            padding: 44px 4.5% 28px;
          }

          .ait-hero h1 {
            font-size: 2rem;
          }

          .ait-shell {
            padding: 24px 4.5% 48px;
          }

          .ait-card {
            padding: 16px;
            border-radius: 18px;
          }

          .ait-output,
          .ait-empty {
            min-height: 300px;
          }
        }
      `}</style>

      {toast && (
        <div className={`ait-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="ait-hero">
        <p className="ait-eyebrow">Convert Wala AI Tool</p>
        <h1>AI Text Generator</h1>
        <p>
          Generate blogs, captions, emails, product descriptions, ads, bios and
          content ideas instantly.
        </p>
      </section>

      <section className="ait-shell">
        <div className="ait-left">
          <div className="ait-card">
            <h3>Generator Settings</h3>

            <div className="ait-form-grid">
              <label className="ait-field full">
                Topic / Keyword
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: Benefits of digital marketing for small businesses"
                />
              </label>

              <label className="ait-field">
                Content Type
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {generatorTypes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="ait-field">
                Tone
                <select value={tone} onChange={(e) => setTone(e.target.value)}>
                  {tones.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="ait-field">
                Language
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="ait-field">
                Keywords
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="seo, marketing, growth"
                />
              </label>
            </div>

            <div className="ait-actions">
              <button type="button" className="ait-primary" onClick={generateText}>
                <Sparkles />
                Generate Text
              </button>

              <button type="button" className="ait-danger" onClick={clearAll}>
                <Trash2 />
                Clear
              </button>
            </div>
          </div>

          <div className="ait-card">
            <h3>Quick Ideas</h3>

            <div className="ait-suggestions">
              {[
                "Benefits of AI tools for business",
                "Digital marketing strategy for startups",
                "How to grow Instagram page",
                "Best resume tips for freshers",
                "Why websites need SEO",
              ].map((item) => (
                <button
                  type="button"
                  className="ait-chip"
                  key={item}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ait-right">
          <div className="ait-card">
            <div className="ait-output-head">
              <h3>Generated Output</h3>

              <div className="ait-stats">
                <span>{wordCount} Words</span>
                <span>{output.length} Characters</span>
              </div>
            </div>

            {output ? (
              <>
                <div className="ait-output">{output}</div>

                <div className="ait-actions">
                  <button type="button" className="ait-dark" onClick={copyText}>
                    <Copy />
                    Copy Text
                  </button>

                  <button
                    type="button"
                    className="ait-primary"
                    onClick={downloadText}
                  >
                    <Download />
                    Download TXT
                  </button>
                </div>
              </>
            ) : (
              <div className="ait-empty">
                <div>
                  <FileText />
                  <p>Your generated content will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}