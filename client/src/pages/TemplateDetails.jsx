import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { templates } from "../data/templates";
import ResumePreview from "../components/ResumePreview";
import "../styles/resumeBuilder.css";

const SETTINGS_EVENT = "convertwala-settings-change";
const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";

const pageText = {
  en: {
    template: "Template",
    title: "Preview your selected resume template",
    desc: "This template is clean, professional and ATS friendly. Check the real preview and start making your resume.",
    start: "Start making your ATS friendly resume",
    preview: "Actual Template Preview",
    ats: "ATS Friendly",
    professional: "Professional Layout",
    seoTitle: "ATS Friendly Resume Template Preview | Convert Wala",
    seoDescription:
      "Preview ATS friendly resume templates and create a professional resume online with Convert Wala Resume Builder.",
  },
  hi: {
    template: "टेम्पलेट",
    title: "अपना चुना हुआ रिज़्यूमे टेम्पलेट देखें",
    desc: "यह टेम्पलेट साफ़, प्रोफेशनल और ATS फ्रेंडली है। असली preview देखें और अपना रिज़्यूमे बनाना शुरू करें।",
    start: "ATS फ्रेंडली रिज़्यूमे बनाना शुरू करें",
    preview: "वास्तविक टेम्पलेट preview",
    ats: "ATS फ्रेंडली",
    professional: "प्रोफेशनल लेआउट",
    seoTitle: "ATS फ्रेंडली रिज़्यूमे टेम्पलेट preview | Convert Wala",
    seoDescription:
      "Convert Wala Resume Builder पर ATS फ्रेंडली रिज़्यूमे टेम्पलेट preview करें और प्रोफेशनल रिज़्यूमे बनाएं।",
  },
  hinglish: {
    template: "Template",
    title: "Apna selected resume template dekho",
    desc: "Ye template clean, professional aur ATS friendly hai. Real preview check karo aur resume banana start karo.",
    start: "Start making your ATS friendly resume",
    preview: "Actual Template Preview",
    ats: "ATS Friendly",
    professional: "Professional Layout",
    seoTitle: "ATS Friendly Resume Template Preview | Convert Wala",
    seoDescription:
      "Convert Wala Resume Builder par ATS friendly resume template preview karo aur professional resume online banao.",
  },
};
const sampleData = {
  personal: {
    fullName: "Abhishek Singh",
    jobTitle: "Frontend Developer",
    email: "abhishek@email.com",
    phone: "+91 98765 43210",
    location: "India",
    linkedin: "linkedin.com/in/abhishek",
    portfolio: "abhishek.dev",
    photo: "",
    summary:
      "Creative and detail-oriented professional with experience in building modern digital products, responsive web interfaces and user-focused applications.",
  },

  skills: [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "UI Design", level: 78 },
  ],

  languages: [
    { name: "English", level: 85 },
    { name: "Hindi", level: 95 },
  ],

  hobbies: [
    { name: "Reading" },
    { name: "Design" },
    { name: "Travel" },
  ],

  experience: [
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      location: "Remote",
      startDate: "2023",
      endDate: "",
      currentWorking: true,
      bullets:
        "Built responsive web interfaces using React.\nImproved website performance and user experience.\nWorked with REST APIs and reusable components.",
    },
    {
      title: "Web Designer",
      company: "Creative Studio",
      location: "Delhi",
      startDate: "2021",
      endDate: "2023",
      currentWorking: false,
      bullets:
        "Designed modern landing pages and dashboards.\nCreated reusable UI sections for client websites.",
    },
  ],

  education: [
    {
      degree: "Bachelor Degree",
      institute: "Your University",
      location: "India",
      startDate: "2020",
      endDate: "2023",
      currentStudying: false,
      details: "Completed graduation with strong focus on web development.",
    },
  ],

  projects: [
    {
      name: "Resume Builder App",
      tech: "React, Express, PDFKit, DOCX",
      bullets:
        "Created ATS friendly resume builder with premium templates.\nAdded PDF and Word download functionality.",
    },
  ],

  certifications: [
    {
      name: "Frontend Development Certification",
      issuer: "Online Academy",
      year: "2023",
    },
  ],

  awards: [
    {
      name: "Best Performer",
      organization: "Digital Agency",
      year: "2024",
    },
  ],

  references: [
    {
      name: "Rahul Sharma",
      position: "Project Manager",
      phone: "+91 99999 99999",
      email: "rahul@email.com",
    },
  ],

  socials: [
    {
      platform: "LinkedIn",
      url: "linkedin.com/in/abhishek",
    },
  ],

  customSections: [
    {
      title: "Additional Information",
      content: "Available for full-time and freelance opportunities.",
    },
  ],
};
export default function TemplateDetails() {
  const { templateId } = useParams();
  const template = templates.find((item) => item.id === templateId);

  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );

  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

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

  const t = pageText[language] || pageText.en;

  const schemaData = useMemo(() => {
    if (!template) return null;

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${template.name} - ${t.seoTitle}`,
      description: t.seoDescription,
      url: `https://www.convertwala.com/resume-builder/template/${template.id}`,
      isPartOf: {
        "@type": "WebSite",
        name: "Convert Wala",
        url: "https://www.convertwala.com/",
      },
    };
  }, [template, t.seoTitle, t.seoDescription]);

  if (!template) {
    return <Navigate to="/resume-builder/templates" />;
  }

  const categoryName =
    template.category.charAt(0).toUpperCase() + template.category.slice(1);

  return (
    <main className={`rb-page rb-theme-page ${theme === "dark" ? "dark" : "light"}`}>
      <Helmet>
        <html lang={language === "hi" ? "hi" : "en"} />
        <title>{`${template.name} - ${t.seoTitle}`}</title>
        <meta name="description" content={t.seoDescription} />
        <meta
          name="keywords"
          content={`${template.name}, ATS resume template, professional resume template, free resume builder, online resume builder, Convert Wala`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Convert Wala" />
        <meta name="publisher" content="Convert Wala" />
        <link
          rel="canonical"
          href={`https://www.convertwala.com/resume-builder/template/${template.id}`}
        />

        <meta property="og:title" content={`${template.name} - ${t.seoTitle}`} />
        <meta property="og:description" content={t.seoDescription} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://www.convertwala.com/resume-builder/template/${template.id}`}
        />
        <meta property="og:site_name" content="Convert Wala" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${template.name} - ${t.seoTitle}`} />
        <meta name="twitter:description" content={t.seoDescription} />

        {schemaData && (
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        )}
      </Helmet>

      <section className="rb-details-layout">
        <div className="rb-details-content">
          <p className="rb-eyebrow">
            {categoryName} {t.template}
          </p>

          <h1>{template.name}</h1>

          <p>{t.desc}</p>

          <div className="rb-detail-badges">
            <span>{t.ats}</span>
            <span>{t.professional}</span>
            <span>{template.badge}</span>
            <span>#{template.number}</span>
          </div>

          <Link
            to={`/resume-builder/build/${template.id}`}
            className="rb-primary-btn"
          >
            {t.start}
          </Link>
        </div>

        <div className="rb-details-preview">
          <div className="rb-preview-panel">
            <div className="rb-preview-toolbar">
              <div>
                <p className="rb-eyebrow">{t.preview}</p>
                <h2>{template.name}</h2>
              </div>

              <span>{template.badge}</span>
            </div>

            <div className="rb-real-preview-frame">
              <ResumePreview resumeData={sampleData} template={template} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}