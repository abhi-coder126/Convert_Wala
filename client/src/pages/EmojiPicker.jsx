import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import EmojiPickerReact from "emoji-picker-react";
import { Smile, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import "../styles/EmojiPicker.css";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const pageText = {
  en: {
    eyebrow: "Convert Wala Emoji Tool",
    title: "Emoji Picker",
    subtitle:
      "Search, pick and copy all emojis instantly for captions, chats, social media, websites and designs.",
    copied: "Emoji copied successfully!",
    failed: "Failed to copy emoji.",
    seoTitle: "Free Emoji Picker Online | Copy Emojis Instantly - Convert Wala",
    seoDescription:
      "Search, pick and copy emojis online instantly for captions, chats, websites and social media.",
    seoKeywords:
      "emoji picker, copy emoji, emoji search, emoji keyboard, online emoji picker",
  },
  hi: {
    eyebrow: "Convert Wala इमोजी टूल",
    title: "Emoji Picker",
    subtitle:
      "Captions, chats, social media, websites और designs के लिए emojis search, pick और copy करें।",
    copied: "Emoji copy हो गया!",
    failed: "Emoji copy नहीं हो पाया।",
    seoTitle: "Free Emoji Picker Online | Emojis Copy करें - Convert Wala",
    seoDescription:
      "Captions, chats, websites और social media के लिए emojis online search, pick और copy करें।",
    seoKeywords:
      "emoji picker, emoji copy, emoji search, emoji keyboard, online emoji picker",
  },
  hinglish: {
    eyebrow: "Convert Wala Emoji Tool",
    title: "Emoji Picker",
    subtitle:
      "Captions, chats, social media, websites aur designs ke liye emojis search, pick aur copy karo.",
    copied: "Emoji copied ho gaya!",
    failed: "Emoji copy nahi ho paya.",
    seoTitle: "Free Emoji Picker Online | Copy Emojis Instantly - Convert Wala",
    seoDescription:
      "Captions, chats, websites aur social media ke liye emojis online search, pick aur copy karo.",
    seoKeywords:
      "emoji picker, copy emoji, emoji search, emoji keyboard, online emoji picker",
  },
};

export default function EmojiPicker() {
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [toast, setToast] = useState(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/emoji-picker";

  useEffect(() => {
    const syncSettings = () => {
      setTheme(localStorage.getItem(STORAGE_THEME) || "light");
      setLanguage(localStorage.getItem(STORAGE_LANGUAGE) || "en");
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

    setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const copyEmoji = async (emojiData) => {
    const selectedEmoji = emojiData?.emoji || emojiData?.unified || "";

    try {
      await navigator.clipboard.writeText(selectedEmoji);

      setToast({
        type: "success",
        message: `🎉 ${selectedEmoji} copied ho gaya!`,
      });

      setTimeout(() => setToast(null), 2500);
    } catch {
      setToast({
        type: "error",
        message: "Copy nahi ho paya.",
      });

      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <main className={`emoji-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />

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
          content={theme === "dark" ? "#020617" : "#f59e0b"}
        />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={t.seoTitle} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Convert Wala" />
        <meta
          property="og:locale"
          content={language === "hi" ? "hi_IN" : "en_US"}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Convert Wala Emoji Picker",
            url: canonicalUrl,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
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
              "Search emojis online",
              "Copy emojis instantly",
              "Emoji keyboard",
              "Emoji picker for captions",
              "Emoji picker for social media",
              "Browser-based emoji tool",
            ],
          })}
        </script>
      </Helmet>

      {toast && (
        <div className={`emoji-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <section className="emoji-hero">
        <div className="emoji-badge">
          <Smile />
          {t.eyebrow}
        </div>

        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="emoji-info">
        <Sparkles />
        <div>
          <h3>All Emojis In One Place</h3>
          <p>
            Smileys, people, animals, food, travel, activities, objects,
            symbols and flags — sab emojis yahan se search aur copy kar sakte
            ho.
          </p>
        </div>
      </section>

      <section className="emoji-shell emoji-picker-shell">
        <EmojiPickerReact
          onEmojiClick={(emojiData) => copyEmoji(emojiData)}
          width="100%"
          height={620}
          theme={theme === "dark" ? "dark" : "light"}
        />
      </section>
    </main>
  );
}