import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  KeyRound,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCcw,
  FileText,
} from "lucide-react";
import "../styles/RandomPasswordGenerator.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    seoTitle: "Random Password Generator Online Free | Secure Password Maker",
    seoDesc:
      "Generate strong secure random passwords online for free with custom length, symbols, numbers, uppercase and lowercase options.",
    eyebrow: "Convert Wala Security Tool",
    title: "Random Password Generator",
    subtitle:
      "Generate secure random passwords with custom length, symbols, numbers and advanced options.",
    infoTitle: "What does this tool do?",
    infoDesc:
      "This tool creates strong random passwords in your browser. You can choose length, character types and generate multiple passwords instantly.",
    length: "Password Length",
    count: "Password Count",
    uppercase: "Uppercase A-Z",
    lowercase: "Lowercase a-z",
    numbers: "Numbers 0-9",
    symbols: "Symbols !@#",
    excludeSimilar: "Exclude Similar Characters",
    excludeAmbiguous: "Exclude Ambiguous Characters",
    generate: "Generate Passwords",
    copyAll: "Copy All",
    download: "Download TXT",
    clear: "Clear",
    generated: "Generated Passwords",
    strength: "Strength",
    entropy: "Entropy Score",
    copied: "Copied successfully.",
    generatedSuccess: "Passwords generated successfully.",
    noPassword: "Please generate password first.",
    optionError: "Please select at least one character option.",
  },
  hi: {
    seoTitle: "Random Password Generator Online Free | Secure Password Maker",
    seoDesc:
      "Custom length, symbols, numbers, uppercase और lowercase options के साथ secure random passwords generate करें।",
    eyebrow: "Convert Wala Security Tool",
    title: "Random Password Generator",
    subtitle:
      "Custom length, symbols, numbers और advanced options के साथ secure random passwords generate करें।",
    infoTitle: "यह tool क्या करता है?",
    infoDesc:
      "यह tool browser में strong random passwords बनाता है। Length, character types choose करके multiple passwords instantly generate कर सकते हैं।",
    length: "Password Length",
    count: "Password Count",
    uppercase: "Uppercase A-Z",
    lowercase: "Lowercase a-z",
    numbers: "Numbers 0-9",
    symbols: "Symbols !@#",
    excludeSimilar: "Similar Characters हटाएं",
    excludeAmbiguous: "Ambiguous Characters हटाएं",
    generate: "Passwords Generate करें",
    copyAll: "Copy All",
    download: "TXT Download करें",
    clear: "Clear",
    generated: "Generated Passwords",
    strength: "Strength",
    entropy: "Entropy Score",
    copied: "Successfully copy हो गया।",
    generatedSuccess: "Passwords successfully generate हो गए।",
    noPassword: "कृपया पहले password generate करें।",
    optionError: "कृपया कम से कम one character option select करें।",
  },
  hinglish: {
    seoTitle: "Random Password Generator Online Free | Secure Password Maker",
    seoDesc:
      "Custom length, symbols, numbers, uppercase aur lowercase options ke saath secure random passwords generate karo.",
    eyebrow: "Convert Wala Security Tool",
    title: "Random Password Generator",
    subtitle:
      "Custom length, symbols, numbers aur advanced options ke saath secure random passwords generate karo.",
    infoTitle: "Ye tool kya kaam karta hai?",
    infoDesc:
      "Ye browser me strong random passwords banata hai. Length, character types choose karke multiple passwords instantly generate kar sakte ho.",
    length: "Password Length",
    count: "Password Count",
    uppercase: "Uppercase A-Z",
    lowercase: "Lowercase a-z",
    numbers: "Numbers 0-9",
    symbols: "Symbols !@#",
    excludeSimilar: "Exclude Similar Characters",
    excludeAmbiguous: "Exclude Ambiguous Characters",
    generate: "Generate Passwords",
    copyAll: "Copy All",
    download: "Download TXT",
    clear: "Clear",
    generated: "Generated Passwords",
    strength: "Strength",
    entropy: "Entropy Score",
    copied: "Successfully copy ho gaya.",
    generatedSuccess: "Passwords successfully generate ho gaye.",
    noPassword: "Please pehle password generate karo.",
    optionError: "Please kam se kam one character option select karo.",
  },
};

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const similarChars = /[0Oo1lI]/g;
const ambiguousChars = /[{}[\]()/\\'"`]/g;

const getRandomChar = (chars) => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
};

const getStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: "Weak", className: "weak", percent: 25 };
  if (score <= 4) return { label: "Medium", className: "medium", percent: 55 };
  if (score <= 6) return { label: "Strong", className: "strong", percent: 78 };
  return { label: "Very Strong", className: "very-strong", percent: 100 };
};

const calculateEntropy = (length, poolSize) => {
  if (!length || !poolSize) return 0;
  return Math.round(length * Math.log2(poolSize));
};

export default function RandomPasswordGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [length, setLength] = useState(18);
  const [count, setCount] = useState(5);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;

  const charPool = useMemo(() => {
    let chars = "";

    if (includeUpper) chars += CHARSETS.upper;
    if (includeLower) chars += CHARSETS.lower;
    if (includeNumbers) chars += CHARSETS.numbers;
    if (includeSymbols) chars += CHARSETS.symbols;

    if (excludeSimilar) chars = chars.replace(similarChars, "");
    if (excludeAmbiguous) chars = chars.replace(ambiguousChars, "");

    return chars;
  }, [
    includeUpper,
    includeLower,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    excludeAmbiguous,
  ]);

  const firstPassword = passwords[0] || "";
  const strength = getStrength(firstPassword);
  const entropy = calculateEntropy(length, charPool.length);

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

  const createPassword = () => {
    if (!charPool.length) return "";

    let password = "";
    for (let i = 0; i < length; i += 1) {
      password += getRandomChar(charPool);
    }

    return password;
  };

  const generatePasswords = () => {
    if (!charPool.length) {
      showToast("error", t.optionError);
      return;
    }

    const generated = Array.from({ length: count }, () => createPassword());
    setPasswords(generated);
    showToast("success", t.generatedSuccess);
  };

  const copyText = async (text) => {
    if (!text) {
      showToast("error", t.noPassword);
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast("success", t.copied);
  };

  const copyAll = async () => {
    if (!passwords.length) {
      showToast("error", t.noPassword);
      return;
    }

    await navigator.clipboard.writeText(passwords.join("\n"));
    showToast("success", t.copied);
  };

  const downloadTxt = () => {
    if (!passwords.length) {
      showToast("error", t.noPassword);
      return;
    }

    const blob = new Blob([passwords.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Convert Wala_secure_passwords.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const clearTool = () => {
    setPasswords([]);
  };

  const optionItems = [
    {
      label: t.uppercase,
      value: includeUpper,
      setValue: setIncludeUpper,
    },
    {
      label: t.lowercase,
      value: includeLower,
      setValue: setIncludeLower,
    },
    {
      label: t.numbers,
      value: includeNumbers,
      setValue: setIncludeNumbers,
    },
    {
      label: t.symbols,
      value: includeSymbols,
      setValue: setIncludeSymbols,
    },
    {
      label: t.excludeSimilar,
      value: excludeSimilar,
      setValue: setExcludeSimilar,
    },
    {
      label: t.excludeAmbiguous,
      value: excludeAmbiguous,
      setValue: setExcludeAmbiguous,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta
          name="keywords"
          content="password generator, random password generator, secure password, strong password maker, password creator"
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://www.convertwala.com/random-password-generator"
        />
      </Helmet>

      <main className={`password-page ${theme === "dark" ? "dark" : "light"}`}>
        {toast && (
          <div className={`password-toast ${toast.type}`}>
            {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
            <span>{toast.message}</span>
          </div>
        )}

        <section className="password-hero">
          <div className="password-badge">
            <KeyRound />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </section>

        <section className="password-info">
          <ShieldCheck />
          <div>
            <h3>{t.infoTitle}</h3>
            <p>{t.infoDesc}</p>
          </div>
        </section>

        <section className="password-stats">
          <div>
            <span>{t.length}</span>
            <strong>{length}</strong>
          </div>

          <div>
            <span>{t.count}</span>
            <strong>{count}</strong>
          </div>

          <div>
            <span>{t.strength}</span>
            <strong className={strength.className}>
              {firstPassword ? strength.label : "—"}
            </strong>
          </div>

          <div>
            <span>{t.entropy}</span>
            <strong>{entropy} bit</strong>
          </div>
        </section>

        <section className="password-shell">
          <aside className="password-control-card">
            <div className="password-card-head">
              <h3>Generator Settings</h3>
              <span>Secure</span>
            </div>

            <div className="password-control">
              <label>
                {t.length}: {length}
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>

            <div className="password-control">
              <label>
                {t.count}: {count}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>

            <div className="password-options">
              {optionItems.map((item) => (
                <label key={item.label}>
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(e) => item.setValue(e.target.checked)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="password-strength">
              <div>
                <span>{t.strength}</span>
                <strong className={strength.className}>
                  {firstPassword ? strength.label : "Generate first"}
                </strong>
              </div>

              <div className="password-strength-bar">
                <i
                  className={strength.className}
                  style={{ width: `${firstPassword ? strength.percent : 0}%` }}
                />
              </div>
            </div>

            <div className="password-actions">
              <button onClick={generatePasswords}>
                <RefreshCcw />
                {t.generate}
              </button>

              <button onClick={copyAll} disabled={!passwords.length}>
                <Copy />
                {t.copyAll}
              </button>

              <button onClick={downloadTxt} disabled={!passwords.length}>
                <Download />
                {t.download}
              </button>

              <button
                onClick={clearTool}
                disabled={!passwords.length}
                className="danger"
              >
                <Trash2 />
                {t.clear}
              </button>
            </div>
          </aside>

          <section className="password-output-card">
            <div className="password-card-head">
              <h3>{t.generated}</h3>
              <span>{passwords.length} items</span>
            </div>

            {passwords.length ? (
              <div className="password-list">
                {passwords.map((password, index) => (
                  <div className="password-item" key={`${password}-${index}`}>
                    <span>{index + 1}</span>
                    <code>{password}</code>
                    <button onClick={() => copyText(password)}>
                      <Copy />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="password-empty">
                <FileText />
                <p>Generate secure passwords to show them here.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}