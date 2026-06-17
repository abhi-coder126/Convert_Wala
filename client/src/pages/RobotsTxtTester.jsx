import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Bot,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Wand2,
} from "lucide-react";
import "../styles/RobotsTxtTester.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Robots.txt Tester Online Free",
    seoDesc: "Test robots.txt rules online and check if a URL is allowed or blocked for search bots.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Robots.txt Tester",
    subtitle: "Check whether your URL is allowed or blocked by robots.txt rules.",
    infoTitle: "What does this tool do?",
    infoDesc: "This tool tests robots.txt rules for a specific URL path and user-agent.",
    robots: "Robots.txt Content",
    result: "Test Result",
    url: "URL / Path to Test",
    userAgent: "User Agent",
    placeholder: "User-agent: *\nDisallow: /admin/\nAllow: /blog/\nSitemap: https://example.com/sitemap.xml",
    urlPlaceholder: "https://example.com/admin/page",
    outputPlaceholder: "Robots.txt test result will appear here...",
    test: "Test URL",
    sample: "Sample",
    copy: "Copy Result",
    download: "Download Report",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rules: "Rules",
    status: "Status",
    allowed: "Allowed",
    blocked: "Blocked",
    neutral: "Not Tested",
    copied: "Result copied successfully.",
    tested: "Robots.txt tested successfully.",
    sampleLoaded: "Sample loaded successfully.",
    noText: "Please enter robots.txt content first.",
    noUrl: "Please enter URL or path first.",
  },
  hi: {
    seoTitle: "Robots.txt Tester Online Free",
    seoDesc: "Robots.txt rules online test करें और URL search bots के लिए allowed या blocked है check करें।",
    eyebrow: "Convert Wala SEO Tool",
    title: "Robots.txt Tester",
    subtitle: "Check करें कि आपका URL robots.txt rules से allowed है या blocked.",
    infoTitle: "यह tool क्या करता है?",
    infoDesc: "यह tool specific URL path और user-agent के लिए robots.txt rules test करता है।",
    robots: "Robots.txt Content",
    result: "Test Result",
    url: "Test करने वाला URL / Path",
    userAgent: "User Agent",
    placeholder: "User-agent: *\nDisallow: /admin/\nAllow: /blog/\nSitemap: https://example.com/sitemap.xml",
    urlPlaceholder: "https://example.com/admin/page",
    outputPlaceholder: "Robots.txt test result यहां दिखेगा...",
    test: "URL Test करें",
    sample: "Sample",
    copy: "Result Copy करें",
    download: "Report Download करें",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rules: "Rules",
    status: "Status",
    allowed: "Allowed",
    blocked: "Blocked",
    neutral: "Not Tested",
    copied: "Result successfully copy हो गया।",
    tested: "Robots.txt successfully test हो गया।",
    sampleLoaded: "Sample successfully load हो गया।",
    noText: "कृपया पहले robots.txt content enter करें।",
    noUrl: "कृपया पहले URL या path enter करें।",
  },
  hinglish: {
    seoTitle: "Robots.txt Tester Online Free",
    seoDesc: "Robots.txt rules online test karo aur URL search bots ke liye allowed ya blocked hai check karo.",
    eyebrow: "Convert Wala SEO Tool",
    title: "Robots.txt Tester",
    subtitle: "Check karo ki URL robots.txt rules se allowed hai ya blocked.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc: "Ye specific URL path aur user-agent ke liye robots.txt rules test karta hai.",
    robots: "Robots.txt Content",
    result: "Test Result",
    url: "URL / Path to Test",
    userAgent: "User Agent",
    placeholder: "User-agent: *\nDisallow: /admin/\nAllow: /blog/\nSitemap: https://example.com/sitemap.xml",
    urlPlaceholder: "https://example.com/admin/page",
    outputPlaceholder: "Robots.txt test result yaha show hoga...",
    test: "Test URL",
    sample: "Sample",
    copy: "Copy Result",
    download: "Download Report",
    clear: "Clear",
    reset: "Reset",
    chars: "Characters",
    rules: "Rules",
    status: "Status",
    allowed: "Allowed",
    blocked: "Blocked",
    neutral: "Not Tested",
    copied: "Result successfully copy ho gaya.",
    tested: "Robots.txt successfully test ho gaya.",
    sampleLoaded: "Sample successfully load ho gaya.",
    noText: "Please pehle robots.txt content enter karo.",
    noUrl: "Please pehle URL ya path enter karo.",
  },
};

const sampleRobots = `User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /blog/
Allow: /private/public-page
Sitemap: https://www.example.com/sitemap.xml`;

const normalizePath = (value) => {
  if (!value.trim()) return "/";

  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const parsed = new URL(value);
      return parsed.pathname || "/";
    }

    return value.startsWith("/") ? value : `/${value}`;
  } catch {
    return value.startsWith("/") ? value : `/${value}`;
  }
};

const wildcardToRegex = (rulePath) => {
  const escaped = rulePath
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\$/g, "$");

  return new RegExp(`^${escaped}`);
};

const parseRobots = (robotsText) => {
  const lines = robotsText.split(/\r\n|\r|\n/);
  const groups = [];
  const sitemaps = [];
  let currentGroup = null;

  lines.forEach((rawLine) => {
    const line = rawLine.split("#")[0].trim();

    if (!line || !line.includes(":")) return;

    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "sitemap") {
      sitemaps.push(value);
      return;
    }

    if (key === "user-agent") {
      currentGroup = {
        agents: [value.toLowerCase()],
        rules: [],
      };
      groups.push(currentGroup);
      return;
    }

    if ((key === "allow" || key === "disallow") && currentGroup) {
      currentGroup.rules.push({
        type: key,
        path: value,
      });
    }
  });

  return { groups, sitemaps };
};

const testRobotsRule = (robotsText, testUrl, userAgent) => {
  const path = normalizePath(testUrl);
  const agent = userAgent.trim().toLowerCase() || "*";
  const { groups, sitemaps } = parseRobots(robotsText);

  const matchedGroups = groups.filter((group) =>
    group.agents.some((groupAgent) => groupAgent === "*" || agent.includes(groupAgent))
  );

  const rules = matchedGroups.flatMap((group) => group.rules);

  const matchedRules = rules
    .filter((rule) => {
      if (!rule.path) return false;
      return wildcardToRegex(rule.path).test(path);
    })
    .sort((a, b) => b.path.length - a.path.length);

  const bestRule = matchedRules[0];

  const allowed = !bestRule || bestRule.type === "allow";

  return {
    path,
    allowed,
    bestRule,
    matchedRules,
    totalRules: groups.flatMap((group) => group.rules).length,
    sitemaps,
  };
};

export default function RobotsTxtTester() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE_LANGUAGE) || "en");
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_THEME) || "light");

  const [robotsText, setRobotsText] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [userAgent, setUserAgent] = useState("*");
  const [outputText, setOutputText] = useState("");
  const [status, setStatus] = useState("neutral");
  const [ruleCount, setRuleCount] = useState(0);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const livePreview = useMemo(() => {
    if (!robotsText.trim() || !testUrl.trim()) return "";

    try {
      const result = testRobotsRule(robotsText, testUrl, userAgent);
      return `Robots.txt Test Result

URL Path: ${result.path}
User-agent: ${userAgent || "*"}
Status: ${result.allowed ? t.allowed : t.blocked}

Matched Rule:
${result.bestRule ? `${result.bestRule.type.toUpperCase()}: ${result.bestRule.path}` : "No matching rule found. Default allowed."}

Total Rules: ${result.totalRules}
Sitemaps:
${result.sitemaps.length ? result.sitemaps.join("\n") : "No sitemap found."}`;
    } catch {
      return outputText;
    }
  }, [robotsText, testUrl, userAgent, outputText, t.allowed, t.blocked]);

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

  const runTest = () => {
    if (!robotsText.trim()) {
      showToast("error", t.noText);
      return;
    }

    if (!testUrl.trim()) {
      showToast("error", t.noUrl);
      return;
    }

    const result = testRobotsRule(robotsText, testUrl, userAgent);

    const report = `Robots.txt Test Result

URL Path: ${result.path}
User-agent: ${userAgent || "*"}
Status: ${result.allowed ? t.allowed : t.blocked}

Matched Rule:
${result.bestRule ? `${result.bestRule.type.toUpperCase()}: ${result.bestRule.path}` : "No matching rule found. Default allowed."}

Matched Rules Count: ${result.matchedRules.length}
Total Rules: ${result.totalRules}

Sitemaps:
${result.sitemaps.length ? result.sitemaps.join("\n") : "No sitemap found."}`;

    setOutputText(report);
    setStatus(result.allowed ? "allowed" : "blocked");
    setRuleCount(result.totalRules);
    showToast("success", t.tested);
  };

  const loadSample = () => {
    setRobotsText(sampleRobots);
    setTestUrl("https://www.example.com/admin/dashboard");
    setUserAgent("*");
    setOutputText("");
    setStatus("neutral");
    setRuleCount(0);
    showToast("success", t.sampleLoaded);
  };

  const copyResult = async () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    await navigator.clipboard.writeText(currentOutput);
    showToast("success", t.copied);
  };

  const downloadReport = () => {
    if (!currentOutput.trim()) {
      showToast("error", t.noText);
      return;
    }

    const blob = new Blob([currentOutput], {
      type: "text/plain;charset=utf-8",
    });

    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = "Convert Wala_robots_txt_report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const clearTool = () => {
    setRobotsText("");
    setTestUrl("");
    setOutputText("");
    setStatus("neutral");
    setRuleCount(0);
  };

  const resetTool = () => {
    clearTool();
    setUserAgent("*");
  };

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="robots.txt tester, robots txt checker, robots txt validator, seo robots tester"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.convertwala.com/robots-txt-tester" />
      </Helmet>

      <main className={`robotstxt-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`robotstxt-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="robotstxt-hero">
          <div className="robotstxt-badge">
            <Bot />
            <span>{t.eyebrow}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="robotstxt-info">
          <FileText />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="robotstxt-stats">
          <div>
            <span>{t.chars}</span>
            <strong>{robotsText.length}</strong>
          </div>
          <div>
            <span>{t.rules}</span>
            <strong>{ruleCount || parseRobots(robotsText).groups.flatMap((g) => g.rules).length}</strong>
          </div>
          <div>
            <span>{t.status}</span>
            <strong
              className={
                status === "allowed"
                  ? "robotstxt-valid"
                  : status === "blocked"
                  ? "robotstxt-invalid"
                  : ""
              }
            >
              {status === "allowed"
                ? t.allowed
                : status === "blocked"
                ? t.blocked
                : t.neutral}
            </strong>
          </div>
        </section>

        <section className="robotstxt-options">
          <div className="robotstxt-control">
            <label>{t.url}</label>
            <input
              value={testUrl}
              onChange={(e) => {
                setTestUrl(e.target.value);
                setOutputText("");
                setStatus("neutral");
              }}
              placeholder={t.urlPlaceholder}
            />
          </div>

          <div className="robotstxt-control">
            <label>{t.userAgent}</label>
            <input
              value={userAgent}
              onChange={(e) => {
                setUserAgent(e.target.value);
                setOutputText("");
                setStatus("neutral");
              }}
              placeholder="*"
            />
          </div>
        </section>

        <section className="robotstxt-shell">
          <div className="robotstxt-card">
            <div className="robotstxt-card-head">
              <h3>{t.robots}</h3>
              <span>{robotsText.length} chars</span>
            </div>

            <textarea
              value={robotsText}
              onChange={(e) => {
                setRobotsText(e.target.value);
                setOutputText("");
                setStatus("neutral");
                setRuleCount(0);
              }}
              placeholder={t.placeholder}
              spellCheck="false"
            />

            <div className="robotstxt-actions">
              <button onClick={runTest}>
                <Wand2 />
                {t.test}
              </button>

              <button onClick={loadSample}>
                <FileText />
                {t.sample}
              </button>

              <button
                onClick={clearTool}
                disabled={!robotsText && !outputText}
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

          <div className="robotstxt-card">
            <div className="robotstxt-card-head">
              <h3>{t.result}</h3>
              <span>{currentOutput.length} chars</span>
            </div>

            <textarea
              value={currentOutput}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder={t.outputPlaceholder}
              spellCheck="false"
            />

            <div className="robotstxt-actions">
              <button onClick={copyResult} disabled={!currentOutput.trim()}>
                <Copy />
                {t.copy}
              </button>

              <button onClick={downloadReport} disabled={!currentOutput.trim()}>
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