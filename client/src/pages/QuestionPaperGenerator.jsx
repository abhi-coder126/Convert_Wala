import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  FileText,
  Mic,
  MicOff,
  Copy,
  Download,
  RefreshCcw,
  Printer,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2,
  ImagePlus,
  Wand2,
  Settings,
  Layers,
} from "lucide-react";

const STORAGE_LANGUAGE = "ath_language";
const STORAGE_THEME = "ath_theme";
const SETTINGS_EVENT = "convertwala-settings-change";

const classOptions = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Govt Exam",
];

const subjectOptions = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Social Science",
  "Computer",
  "Physics",
  "Chemistry",
  "Biology",
  "Accountancy",
  "Business Studies",
  "Economics",
  "General Knowledge",
  "Reasoning",
  "Quantitative Aptitude",
  "Current Affairs",
];

const paperThemes = [
  { key: "classic", label: "Classic University Paper" },
  { key: "board", label: "CBSE / Board Paper" },
  { key: "premium", label: "Premium Academic Paper" },
  { key: "govt", label: "Govt Exam Paper" },
  { key: "minimal", label: "Minimal White Paper" },
];

const pageText = {
  en: {
    seoTitle:
      "Free Question Paper Generator Online - Class Wise Paper Maker | Convert Wala",
    seoDescription:
      "Generate class-wise question papers with school logo, formal exam layout, sections, government exam patterns, printable themes and mic-based topic input.",
    seoKeywords:
      "question paper generator, class wise question paper, exam paper maker, school paper generator, CBSE question paper, government exam paper, Convert Wala",

    eyebrow: "Convert Wala Education Tool",
    heading: "Question Paper Generator",
    subtitle:
      "Create proper exam-style question papers with logo, class-wise pattern, formal sections, marks, time and exact printable paper design.",

    paperInfo: "Paper Header Details",
    logo: "School / College Logo",
    institutionName: "School / College / University Name",
    examTitle: "Exam Title",
    paperTitle: "Paper / Course Title",
    subject: "Subject",
    classLevel: "Class / Exam Level",
    time: "Time",
    marks: "Marks / Weightage",
    paperTheme: "Paper Theme",
    syllabusInput: "Topic / Syllabus Input",
    micStart: "Start Mic",
    micStop: "Stop Mic",
    generate: "Generate From Topics",
    sections: "Question Sections",
    addSection: "Add Section",
    addQuestion: "Add Question",
    sectionTitle: "Section Title",
    instruction: "Instruction",
    sectionMarks: "Section Marks",
    question: "Question",
    preview: "Fixed Paper Preview",
    exportTools: "Export Options",
    copy: "Copy Paper",
    downloadTxt: "Download TXT",
    downloadPdf: "Download Exact UI PDF",
    downloadingPdf: "Creating PDF...",
    print: "Print Paper",
    reset: "Reset",
    copied: "Question paper copied.",
    downloaded: "Question paper TXT downloaded.",
    pdfDownloaded: "Exact paper UI PDF downloaded.",
    pdfFailed: "PDF download failed.",
    resetDone: "Question paper reset.",
    copyFailed: "Copy failed.",
    micNotSupported: "Mic is not supported in this browser.",
    micStarted: "Mic started. Speak now.",
    micStopped: "Mic stopped.",
    micError: "Mic permission denied or speech not detected.",
  },

  hi: {
    seoTitle:
      "Free Question Paper Generator Online - Class Wise Paper बनाएं | Convert Wala",
    seoDescription:
      "School logo, formal exam layout, sections, government exam patterns, printable themes और mic-based topic input के साथ question paper generate करें।",
    seoKeywords:
      "question paper generator, class wise question paper, exam paper maker, school paper generator, CBSE question paper, government exam paper",

    eyebrow: "Convert Wala Education टूल",
    heading: "Question Paper Generator",
    subtitle:
      "Logo, class-wise pattern, formal sections, marks, time और exact printable paper design के साथ proper exam-style question paper बनाएं।",

    paperInfo: "Paper Header Details",
    logo: "School / College Logo",
    institutionName: "School / College / University Name",
    examTitle: "Exam Title",
    paperTitle: "Paper / Course Title",
    subject: "Subject",
    classLevel: "Class / Exam Level",
    time: "Time",
    marks: "Marks / Weightage",
    paperTheme: "Paper Theme",
    syllabusInput: "Topic / Syllabus Input",
    micStart: "Mic Start करें",
    micStop: "Mic Stop करें",
    generate: "Topics से Generate करें",
    sections: "Question Sections",
    addSection: "Section Add करें",
    addQuestion: "Question Add करें",
    sectionTitle: "Section Title",
    instruction: "Instruction",
    sectionMarks: "Section Marks",
    question: "Question",
    preview: "Fixed Paper Preview",
    exportTools: "Export Options",
    copy: "Paper Copy करें",
    downloadTxt: "TXT Download करें",
    downloadPdf: "Exact UI PDF Download करें",
    downloadingPdf: "PDF बन रहा है...",
    print: "Print करें",
    reset: "Reset करें",
    copied: "Question paper copy हो गया।",
    downloaded: "Question paper TXT download हो गया।",
    pdfDownloaded: "Exact paper UI PDF download हो गया।",
    pdfFailed: "PDF download failed.",
    resetDone: "Question paper reset हो गया।",
    copyFailed: "Copy failed.",
    micNotSupported: "इस browser में mic support नहीं है।",
    micStarted: "Mic start हो गया। अब बोलें।",
    micStopped: "Mic stop हो गया।",
    micError: "Mic permission denied या speech detect नहीं हुई।",
  },

  hinglish: {
    seoTitle:
      "Free Question Paper Generator Online - Class Wise Paper Maker | Convert Wala",
    seoDescription:
      "School logo, formal exam layout, sections, government exam patterns, printable themes aur mic-based topic input ke saath question paper generate karo.",
    seoKeywords:
      "question paper generator, class wise question paper, exam paper maker, school paper generator, CBSE question paper, government exam paper",

    eyebrow: "Convert Wala Education Tool",
    heading: "Question Paper Generator",
    subtitle:
      "Logo, class-wise pattern, formal sections, marks, time aur exact printable paper design ke saath proper exam-style question paper banao.",

    paperInfo: "Paper Header Details",
    logo: "School / College Logo",
    institutionName: "School / College / University Name",
    examTitle: "Exam Title",
    paperTitle: "Paper / Course Title",
    subject: "Subject",
    classLevel: "Class / Exam Level",
    time: "Time",
    marks: "Marks / Weightage",
    paperTheme: "Paper Theme",
    syllabusInput: "Topic / Syllabus Input",
    micStart: "Start Mic",
    micStop: "Stop Mic",
    generate: "Generate From Topics",
    sections: "Question Sections",
    addSection: "Add Section",
    addQuestion: "Add Question",
    sectionTitle: "Section Title",
    instruction: "Instruction",
    sectionMarks: "Section Marks",
    question: "Question",
    preview: "Fixed Paper Preview",
    exportTools: "Export Options",
    copy: "Copy Paper",
    downloadTxt: "Download TXT",
    downloadPdf: "Download Exact UI PDF",
    downloadingPdf: "Creating PDF...",
    print: "Print Paper",
    reset: "Reset",
    copied: "Question paper copied.",
    downloaded: "Question paper TXT downloaded.",
    pdfDownloaded: "Exact paper UI PDF downloaded.",
    pdfFailed: "PDF download failed.",
    resetDone: "Question paper reset ho gaya.",
    copyFailed: "Copy failed.",
    micNotSupported: "Is browser me mic support nahi hai.",
    micStarted: "Mic started. Ab boliye.",
    micStopped: "Mic stopped.",
    micError: "Mic permission denied ya speech detect nahi hui.",
  },
};

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const getSpeechLang = (language) => {
  if (language === "hi" || language === "hinglish") return "hi-IN";
  return "en-IN";
};

const splitTopics = (value) => {
  const clean = String(value || "").trim();

  if (!clean) {
    return [
      "Important definitions",
      "Short notes",
      "Main concepts",
      "Examples",
      "Applications",
    ];
  }

  return clean
    .split(/[\n,;.]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
};

const defaultSections = () => [
  {
    id: makeId(),
    title: "I. Answer all the following questions in a word, phrase or sentence:",
    instruction: "",
    marks: "4 x 1/2 = 2",
    questions: [
      { id: makeId(), text: "Who is the author of the prescribed lesson / poem?" },
      { id: makeId(), text: "What is the central idea of the chapter?" },
      { id: makeId(), text: "Define the important term from the lesson." },
      { id: makeId(), text: "Answer the following in one sentence." },
    ],
  },
];

const generateSectionsByClass = ({ selectedClass, subject, syllabus }) => {
  const topics = splitTopics(syllabus);
  const isGovt = selectedClass === "Govt Exam";

  if (isGovt) {
    return [
      {
        id: makeId(),
        title: "I. Objective Type Questions",
        instruction: "Choose the correct answer from the given options:",
        marks: "20 x 1 = 20",
        questions: Array.from({ length: 10 }, (_, i) => ({
          id: makeId(),
          text: `${subject} question based on ${topics[i % topics.length]}.`,
        })),
      },
      {
        id: makeId(),
        title: "II. Short Answer Questions",
        instruction: "Answer any five questions:",
        marks: "5 x 4 = 20",
        questions: Array.from({ length: 7 }, (_, i) => ({
          id: makeId(),
          text: `Explain briefly: ${topics[(i + 2) % topics.length]}.`,
        })),
      },
    ];
  }

  const classNumber = Number(String(selectedClass).replace("Class", "").trim());

  if (classNumber <= 5) {
    return [
      {
        id: makeId(),
        title: "I. Answer the following questions:",
        instruction: "Write short answers:",
        marks: "10 x 1 = 10",
        questions: Array.from({ length: 8 }, (_, i) => ({
          id: makeId(),
          text: `Write about ${topics[i % topics.length]}.`,
        })),
      },
      {
        id: makeId(),
        title: "II. Fill in the blanks:",
        instruction: "Fill the correct answer:",
        marks: "5 x 1 = 5",
        questions: Array.from({ length: 5 }, (_, i) => ({
          id: makeId(),
          text: `${topics[(i + 2) % topics.length]} is __________.`,
        })),
      },
    ];
  }

  if (classNumber <= 8) {
    return [
      {
        id: makeId(),
        title: "I. Answer all questions in one sentence:",
        instruction: "",
        marks: "8 x 1 = 8",
        questions: Array.from({ length: 8 }, (_, i) => ({
          id: makeId(),
          text: `Define / explain briefly: ${topics[i % topics.length]}.`,
        })),
      },
      {
        id: makeId(),
        title: "II. Answer any five questions in 50 words:",
        instruction: "",
        marks: "5 x 3 = 15",
        questions: Array.from({ length: 7 }, (_, i) => ({
          id: makeId(),
          text: `Write a short note on ${topics[(i + 3) % topics.length]}.`,
        })),
      },
    ];
  }

  return [
    {
      id: makeId(),
      title: "I. Answer all the following questions in a word, phrase or sentence:",
      instruction: "",
      marks: "4 x 1/2 = 2",
      questions: Array.from({ length: 4 }, (_, i) => ({
        id: makeId(),
        text: `Answer briefly about ${topics[i % topics.length]}.`,
      })),
    },
    {
      id: makeId(),
      title: "II. Answer any three of the following in a paragraph of 150 words each:",
      instruction: "",
      marks: "3 x 2 = 6",
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: makeId(),
        text: `Explain ${topics[(i + 4) % topics.length]} in detail.`,
      })),
    },
    {
      id: makeId(),
      title: "III. Annotate any three of the following:",
      instruction: "",
      marks: "3 x 4 = 12",
      questions: Array.from({ length: 4 }, (_, i) => ({
        id: makeId(),
        text: `Annotate / analyze the given extract based on ${topics[(i + 8) % topics.length]}.`,
      })),
    },
  ];
};

const downloadTextFile = (content, filename) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

export default function QuestionPaperGenerator() {
  const [language, setLanguage] = useState(
    localStorage.getItem(STORAGE_LANGUAGE) || "en"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem(STORAGE_THEME) || "light"
  );

  const [toast, setToast] = useState(null);
  const [logo, setLogo] = useState("");

  const [institutionName, setInstitutionName] = useState(
    "University / School Name"
  );
  const [examTitle, setExamTitle] = useState("Second Semester Model Examination");
  const [paperTitle, setPaperTitle] = useState("Question Paper");
  const [selectedClass, setSelectedClass] = useState("Class 12");
  const [subject, setSubject] = useState("English");
  const [time, setTime] = useState("3 Hrs.");
  const [marks, setMarks] = useState("36");
  const [paperTheme, setPaperTheme] = useState("classic");
  const [syllabus, setSyllabus] = useState(
    "Prose, Poetry, Grammar, Reading Comprehension, Writing Skills"
  );
  const [sections, setSections] = useState(defaultSections);
  const [listening, setListening] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const recognitionRef = useRef(null);
  const paperRef = useRef(null);

  const t = pageText[language] || pageText.en;
  const canonicalUrl = "https://www.convertwala.com/question-paper-generator";

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

  const numberedSections = useMemo(() => {
    let questionNo = 1;

    return sections.map((section) => ({
      ...section,
      questions: section.questions.map((question) => ({
        ...question,
        number: questionNo++,
      })),
    }));
  }, [sections]);

  const plainPaperText = useMemo(() => {
    const lines = [];

    lines.push(institutionName);
    lines.push(examTitle);
    lines.push(`${selectedClass} - ${subject}`);
    lines.push(paperTitle);
    lines.push(`Time: ${time}                                      Weightage / Marks: ${marks}`);
    lines.push("");

    numberedSections.forEach((section) => {
      lines.push(section.title);
      if (section.instruction) lines.push(section.instruction);

      section.questions.forEach((q) => {
        lines.push(`${q.number}. ${q.text.replace(/^\d+\.\s*/, "")}`);
      });

      if (section.marks) lines.push(`(${section.marks})`);
      lines.push("");
    });

    return lines.join("\n");
  }, [
    institutionName,
    examTitle,
    selectedClass,
    subject,
    paperTitle,
    time,
    marks,
    numberedSections,
  ]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const updateSection = (sectionId, key, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [key]: value } : section
      )
    );
  };

  const updateQuestion = (sectionId, questionId, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? { ...question, text: value } : question
              ),
            }
          : section
      )
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: makeId(),
        title: `${String.fromCharCode(73 + prev.length)}. New Section`,
        instruction: "Answer the following questions:",
        marks: "",
        questions: [{ id: makeId(), text: "Write your question here." }],
      },
    ]);
  };

  const removeSection = (sectionId) => {
    setSections((prev) =>
      prev.length === 1 ? prev : prev.filter((section) => section.id !== sectionId)
    );
  };

  const addQuestion = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                { id: makeId(), text: "Write your question here." },
              ],
            }
          : section
      )
    );
  };

  const removeQuestion = (sectionId, questionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions:
                section.questions.length === 1
                  ? section.questions
                  : section.questions.filter((question) => question.id !== questionId),
            }
          : section
      )
    );
  };

  const generateFromTopics = () => {
    setSections(
      generateSectionsByClass({
        selectedClass,
        subject,
        syllabus,
      })
    );
    showToast("success", t.generate);
  };

  const startMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("error", t.micNotSupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLang(language);
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      showToast("success", t.micStarted);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ");

      setSyllabus((prev) => `${prev ? `${prev}\n` : ""}${transcript}`.trim());
    };

    recognition.onerror = () => {
      setListening(false);
      showToast("error", t.micError);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
    setListening(false);
    showToast("success", t.micStopped);
  };

  const copyPaper = async () => {
    try {
      await navigator.clipboard.writeText(plainPaperText);
      showToast("success", t.copied);
    } catch {
      showToast("error", t.copyFailed);
    }
  };

  const downloadPaperTxt = () => {
    downloadTextFile(plainPaperText, "Convert Wala_Question_Paper.txt");
    showToast("success", t.downloaded);
  };

  const downloadExactPdf = async () => {
    if (!paperRef.current) return;

    try {
      setPdfLoading(true);

      const canvas = await html2canvas(paperRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        compress: true,
      });

      pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("Convert Wala_Question_Paper_Exact_UI.pdf");

      setPdfLoading(false);
      showToast("success", t.pdfDownloaded);
    } catch {
      setPdfLoading(false);
      showToast("error", t.pdfFailed);
    }
  };

  const resetAll = () => {
    setLogo("");
    setInstitutionName("University / School Name");
    setExamTitle("Second Semester Model Examination");
    setPaperTitle("Question Paper");
    setSelectedClass("Class 12");
    setSubject("English");
    setTime("3 Hrs.");
    setMarks("36");
    setPaperTheme("classic");
    setSyllabus("Prose, Poetry, Grammar, Reading Comprehension, Writing Skills");
    setSections(defaultSections());
    showToast("success", t.resetDone);
  };

  return (
    <main className={`qpg-page ${theme === "dark" ? "dark" : "light"}`}>
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
          content={language === "hi" ? "hi_IN" : "en_US"}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDescription} />
      </Helmet>

      <style>{`
        .qpg-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 34%),
            linear-gradient(180deg, #f8fafc, #eef4ff);
          color: #0f172a;
          overflow-x: hidden;
        }

        .qpg-page * {
          box-sizing: border-box;
        }

        .qpg-page.dark {
          background:
            radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.25), transparent 34%),
            linear-gradient(180deg, #020617, #0f172a);
          color: #f8fafc;
        }

        .qpg-hero {
          padding: 64px 6% 34px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .qpg-page.dark .qpg-hero {
          background: #020617;
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .qpg-eyebrow {
          margin: 0 0 12px;
          color: #2563eb;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .qpg-page.dark .qpg-eyebrow {
          color: #93c5fd;
        }

        .qpg-hero h1 {
          margin: 0;
          color: inherit;
          font-size: clamp(2.2rem, 5vw, 4.8rem);
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .qpg-hero p {
          max-width: 900px;
          color: #64748b;
          line-height: 1.8;
          font-size: 1.02rem;
        }

        .qpg-page.dark .qpg-hero p {
          color: #cbd5e1;
        }

        .qpg-shell {
          width: 100%;
          padding: 28px 5% 72px;
          display: grid;
          grid-template-columns: minmax(360px, 0.9fr) minmax(0, 1.1fr);
          gap: 24px;
          align-items: start;
        }

        .qpg-left,
        .qpg-right {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .qpg-right {
          position: sticky;
          top: 14px;
          align-self: start;
          max-height: calc(100vh - 28px);
        }

        .qpg-card {
          min-width: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
        }

        .qpg-page.dark .qpg-card {
          background: rgba(15, 23, 42, 0.92);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .qpg-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .qpg-card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .qpg-card-title span {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
          flex: 0 0 auto;
        }

        .qpg-page.dark .qpg-card-title span {
          background: rgba(37, 99, 235, 0.16);
          color: #93c5fd;
        }

        .qpg-card h3 {
          margin: 0;
          color: inherit;
          font-size: 1.05rem;
        }

        .qpg-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .qpg-field {
          display: block;
          color: #334155;
          font-size: 0.86rem;
          font-weight: 900;
          min-width: 0;
        }

        .qpg-page.dark .qpg-field {
          color: #f8fafc;
        }

        .qpg-field input,
        .qpg-field select,
        .qpg-field textarea {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          margin-top: 7px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          color: #111827;
          border-radius: 13px;
          padding: 11px 12px;
          outline: none;
          font-weight: 800;
          font-family: inherit;
        }

        .qpg-field textarea {
          min-height: 105px;
          resize: vertical;
          line-height: 1.55;
        }

        .qpg-page.dark .qpg-field input,
        .qpg-page.dark .qpg-field select,
        .qpg-page.dark .qpg-field textarea {
          background: #020617;
          color: #f8fafc;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .qpg-page.dark .qpg-field select option {
          background: #0f172a;
          color: #f8fafc;
        }

        .qpg-field input:focus,
        .qpg-field select:focus,
        .qpg-field textarea:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .qpg-page.dark .qpg-field input:focus,
        .qpg-page.dark .qpg-field select:focus,
        .qpg-page.dark .qpg-field textarea:focus {
          background: #020617;
        }

        .span-2 {
          grid-column: 1 / -1;
        }

        .qpg-logo-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #f8fafc, #eff6ff);
          border: 1px dashed #bfdbfe;
          border-radius: 18px;
          padding: 14px;
          margin-bottom: 14px;
        }

        .qpg-page.dark .qpg-logo-box {
          background: rgba(255,255,255,0.05);
          border-color: rgba(147,197,253,0.25);
        }

        .qpg-logo-preview {
          width: 68px;
          height: 68px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          display: grid;
          place-items: center;
          overflow: hidden;
          flex: 0 0 auto;
          color: #2563eb;
        }

        .qpg-logo-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .qpg-section-stack {
          display: grid;
          gap: 14px;
        }

        .qpg-section-card {
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          background: #f8fafc;
          padding: 14px;
          display: grid;
          gap: 12px;
        }

        .qpg-page.dark .qpg-section-card {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
        }

        .qpg-section-top {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 120px 42px;
          gap: 10px;
          align-items: end;
        }

        .qpg-question-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 42px;
          gap: 10px;
          align-items: end;
        }

        .qpg-icon-btn {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 12px;
          background: #fee2e2;
          color: #dc2626;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .qpg-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        .qpg-export-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .qpg-primary,
        .qpg-dark,
        .qpg-light,
        .qpg-danger,
        .qpg-mic {
          min-height: 48px;
          border: 0;
          border-radius: 999px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 900;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
        }

        .qpg-primary {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 16px 34px rgba(37, 99, 235, 0.22);
        }

        .qpg-dark {
          background: #111827;
          color: #ffffff;
        }

        .qpg-page.dark .qpg-dark {
          background: #f8fafc;
          color: #111827;
        }

        .qpg-light {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .qpg-page.dark .qpg-light {
          background: rgba(37,99,235,0.14);
          color: #93c5fd;
          border-color: rgba(147,197,253,0.28);
        }

        .qpg-danger {
          background: #dc2626;
          color: #ffffff;
        }

        .qpg-mic {
          background: #16a34a;
          color: #ffffff;
          flex: 1;
        }

        .qpg-mic.listening {
          background: #dc2626;
          animation: qpgPulse 1s infinite;
        }

        @keyframes qpgPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        .qpg-preview-card {
          height: calc(100vh - 28px);
          display: flex;
          flex-direction: column;
          padding: 18px;
        }

        .qpg-preview-wrap {
          flex: 1;
          border-radius: 20px;
          padding: 18px;
          background: #dce3ee;
          overflow: auto;
          border: 1px solid #cbd5e1;
        }

        .qpg-page.dark .qpg-preview-wrap {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
        }

        .qpg-paper {
          width: 794px;
          min-height: 1123px;
          margin: 0 auto;
          background: #ffffff;
          color: #111827;
          padding: 54px 66px;
          font-family: "Times New Roman", Times, serif;
          font-size: 16px;
          line-height: 1.42;
          box-shadow: 0 20px 70px rgba(15,23,42,0.18);
          border: 1px solid #d1d5db;
          flex: 0 0 auto;
        }

        .qpg-paper.classic {
          border-top: 9px solid #111827;
        }

        .qpg-paper.board {
          border: 3px solid #111827;
        }

        .qpg-paper.premium {
          border: 9px double #a16207;
          background: linear-gradient(180deg, #fffdf5, #ffffff);
        }

        .qpg-paper.govt {
          border: 4px solid #111827;
          background: #fffdf7;
        }

        .qpg-paper.minimal {
          border: 1px solid #e5e7eb;
          box-shadow: none;
        }

        .paper-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .paper-logo {
          width: 64px;
          height: 64px;
          object-fit: contain;
          margin: 0 auto 8px;
          display: block;
        }

        .paper-institution {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.15;
          margin: 0;
        }

        .paper-exam {
          font-size: 17px;
          font-weight: 700;
          margin: 2px 0;
        }

        .paper-title {
          font-size: 15px;
          font-weight: 700;
          margin: 2px 0;
        }

        .paper-subject {
          font-size: 15px;
          font-weight: 700;
          margin: 2px 0;
        }

        .paper-meta {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin: 24px 0;
          font-size: 15px;
          font-weight: 700;
        }

        .paper-section {
          margin-top: 20px;
          page-break-inside: avoid;
        }

        .paper-section-title {
          font-weight: 700;
          margin-bottom: 8px;
        }

        .paper-instruction {
          font-style: italic;
          margin-bottom: 8px;
        }

        .paper-question {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 4px;
          margin: 8px 0;
        }

        .paper-section-marks {
          text-align: right;
          font-weight: 700;
          margin-top: 5px;
        }

        .qpg-toast {
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
          box-shadow: 0 24px 70px rgba(15,23,42,0.18);
        }

        .qpg-toast.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .qpg-toast.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .qpg-toast button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        @media (max-width: 1180px) {
          .qpg-shell {
            grid-template-columns: 1fr;
          }

          .qpg-right {
            position: static;
            max-height: none;
          }

          .qpg-preview-card {
            height: 760px;
          }
        }

        @media (max-width: 760px) {
          .qpg-hero {
            padding: 50px 5% 30px;
          }

          .qpg-hero h1 {
            font-size: clamp(2.1rem, 11vw, 3.2rem);
            letter-spacing: -0.045em;
          }

          .qpg-shell {
            padding: 24px 5% 56px;
          }

          .qpg-grid,
          .qpg-section-top,
          .qpg-question-row,
          .qpg-export-grid {
            grid-template-columns: 1fr;
          }

          .span-2 {
            grid-column: auto;
          }

          .qpg-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .qpg-primary,
          .qpg-dark,
          .qpg-light,
          .qpg-danger,
          .qpg-mic {
            width: 100%;
          }

          .qpg-preview-card {
            height: 680px;
          }

          .qpg-preview-wrap {
            padding: 10px;
          }

          .qpg-paper {
            width: 794px;
            min-height: 1123px;
            padding: 54px 66px;
            font-size: 16px;
          }

          .qpg-toast {
            left: 14px;
            right: 14px;
            top: 84px;
            min-width: unset;
            max-width: unset;
          }
        }

        @media (max-width: 420px) {
          .qpg-card {
            padding: 16px;
            border-radius: 18px;
          }

          .qpg-logo-box {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }

          .qpg-paper,
          .qpg-paper * {
            visibility: visible;
          }

          .qpg-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 794px;
            min-height: 1123px;
            box-shadow: none;
            border: none;
            margin: 0;
          }
        }
      `}</style>

      {toast && (
        <div className={`qpg-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X />
          </button>
        </div>
      )}

      <section className="qpg-hero">
        <p className="qpg-eyebrow">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="qpg-shell">
        <div className="qpg-left">
          <div className="qpg-card">
            <div className="qpg-card-head">
              <div className="qpg-card-title">
                <span>
                  <Settings size={20} />
                </span>
                <h3>{t.paperInfo}</h3>
              </div>
            </div>

            <div className="qpg-logo-box">
              <div className="qpg-logo-preview">
                {logo ? <img src={logo} alt="Paper logo" /> : <ImagePlus />}
              </div>

              <label className="qpg-field" style={{ flex: 1 }}>
                {t.logo}
                <input type="file" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>

            <div className="qpg-grid">
              <label className="qpg-field">
                {t.institutionName}
                <input
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                />
              </label>

              <label className="qpg-field">
                {t.examTitle}
                <input
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                />
              </label>

              <label className="qpg-field">
                {t.classLevel}
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classOptions.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="qpg-field">
                {t.subject}
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {subjectOptions.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="qpg-field">
                {t.paperTitle}
                <input
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                />
              </label>

              <label className="qpg-field">
                {t.paperTheme}
                <select
                  value={paperTheme}
                  onChange={(e) => setPaperTheme(e.target.value)}
                >
                  {paperThemes.map((item) => (
                    <option value={item.key} key={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="qpg-field">
                {t.time}
                <input value={time} onChange={(e) => setTime(e.target.value)} />
              </label>

              <label className="qpg-field">
                {t.marks}
                <input value={marks} onChange={(e) => setMarks(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="qpg-card">
            <div className="qpg-card-head">
              <div className="qpg-card-title">
                <span>
                  <Mic size={20} />
                </span>
                <h3>{t.syllabusInput}</h3>
              </div>
            </div>

            <label className="qpg-field">
              <textarea
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Chapter names, topics, syllabus..."
              />
            </label>

            <div className="qpg-actions">
              <button
                type="button"
                className={`qpg-mic ${listening ? "listening" : ""}`}
                onClick={listening ? stopMic : startMic}
              >
                {listening ? <MicOff /> : <Mic />}
                {listening ? t.micStop : t.micStart}
              </button>

              <button
                type="button"
                className="qpg-primary"
                onClick={generateFromTopics}
              >
                <Wand2 />
                {t.generate}
              </button>
            </div>
          </div>

          <div className="qpg-card">
            <div className="qpg-card-head">
              <div className="qpg-card-title">
                <span>
                  <Download size={20} />
                </span>
                <h3>{t.exportTools}</h3>
              </div>
            </div>

            <div className="qpg-export-grid">
              <button type="button" className="qpg-dark" onClick={copyPaper}>
                <Copy />
                {t.copy}
              </button>

              <button type="button" className="qpg-light" onClick={downloadPaperTxt}>
                <Download />
                {t.downloadTxt}
              </button>

              <button
                type="button"
                className="qpg-primary"
                onClick={downloadExactPdf}
                disabled={pdfLoading}
              >
                <FileText />
                {pdfLoading ? t.downloadingPdf : t.downloadPdf}
              </button>

              <button type="button" className="qpg-light" onClick={() => window.print()}>
                <Printer />
                {t.print}
              </button>
            </div>

            <div className="qpg-actions">
              <button type="button" className="qpg-danger" onClick={resetAll}>
                <RefreshCcw />
                {t.reset}
              </button>
            </div>
          </div>

          <div className="qpg-card">
            <div className="qpg-card-head">
              <div className="qpg-card-title">
                <span>
                  <Layers size={20} />
                </span>
                <h3>{t.sections}</h3>
              </div>
            </div>

            <div className="qpg-section-stack">
              {sections.map((section) => (
                <div className="qpg-section-card" key={section.id}>
                  <div className="qpg-section-top">
                    <label className="qpg-field">
                      {t.sectionTitle}
                      <input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, "title", e.target.value)
                        }
                      />
                    </label>

                    <label className="qpg-field">
                      {t.sectionMarks}
                      <input
                        value={section.marks}
                        onChange={(e) =>
                          updateSection(section.id, "marks", e.target.value)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      className="qpg-icon-btn"
                      onClick={() => removeSection(section.id)}
                      aria-label="Remove section"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <label className="qpg-field">
                    {t.instruction}
                    <input
                      value={section.instruction}
                      onChange={(e) =>
                        updateSection(section.id, "instruction", e.target.value)
                      }
                    />
                  </label>

                  {section.questions.map((question) => (
                    <div className="qpg-question-row" key={question.id}>
                      <label className="qpg-field">
                        {t.question}
                        <input
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(section.id, question.id, e.target.value)
                          }
                        />
                      </label>

                      <button
                        type="button"
                        className="qpg-icon-btn"
                        onClick={() => removeQuestion(section.id, question.id)}
                        aria-label="Remove question"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <div className="qpg-actions">
                    <button
                      type="button"
                      className="qpg-light"
                      onClick={() => addQuestion(section.id)}
                    >
                      <Plus />
                      {t.addQuestion}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="qpg-actions">
              <button type="button" className="qpg-primary" onClick={addSection}>
                <Plus />
                {t.addSection}
              </button>
            </div>
          </div>
        </div>

        <div className="qpg-right">
          <div className="qpg-card qpg-preview-card">
            <div className="qpg-card-head">
              <div className="qpg-card-title">
                <span>
                  <FileText size={20} />
                </span>
                <h3>{t.preview}</h3>
              </div>
            </div>

            <div className="qpg-preview-wrap">
              <div className={`qpg-paper ${paperTheme}`} ref={paperRef}>
                <div className="paper-header">
                  {logo && <img src={logo} alt="Logo" className="paper-logo" />}
                  <p className="paper-institution">{institutionName}</p>
                  <p className="paper-exam">{examTitle}</p>
                  <p className="paper-title">{selectedClass} - {subject}</p>
                  <p className="paper-subject">{paperTitle}</p>
                </div>

                <div className="paper-meta">
                  <span>Time: {time}</span>
                  <span>Weightage / Marks: {marks}</span>
                </div>

                {numberedSections.map((section) => (
                  <div className="paper-section" key={section.id}>
                    <div className="paper-section-title">{section.title}</div>

                    {section.instruction && (
                      <div className="paper-instruction">{section.instruction}</div>
                    )}

                    {section.questions.map((question) => (
                      <div className="paper-question" key={question.id}>
                        <span>{question.number}.</span>
                        <span>{question.text.replace(/^\d+\.\s*/, "")}</span>
                      </div>
                    ))}

                    {section.marks && (
                      <div className="paper-section-marks">({section.marks})</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}