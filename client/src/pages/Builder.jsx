import { useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { templates } from "../data/templates";
import ResumePreview from "../components/ResumePreview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
const emptyForm = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
    photo: "",
  },

  skills: [{ name: "", level: 80 }],
  languages: [{ name: "", level: 70 }],
  hobbies: [{ name: "" }],

  experience: [
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentWorking: false,
      bullets: "",
    },
  ],

  education: [
    {
      degree: "",
      institute: "",
      location: "",
      startDate: "",
      endDate: "",
      currentStudying: false,
      details: "",
    },
  ],

  projects: [
    {
      name: "",
      tech: "",
      bullets: "",
    },
  ],

  certifications: [
    {
      name: "",
      issuer: "",
      year: "",
    },
  ],

  awards: [
    {
      name: "",
      organization: "",
      year: "",
    },
  ],

  references: [
    {
      name: "",
      position: "",
      phone: "",
      email: "",
    },
  ],

  socials: [
    {
      platform: "",
      url: "",
    },
  ],

  customSections: [],
};

const sectionOptions = [
  ["personal", "Personal Details"],
  ["skills", "Skills"],
  ["languages", "Languages"],
  ["hobbies", "Hobbies"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["projects", "Projects"],
  ["certifications", "Certifications"],
  ["awards", "Awards"],
  ["references", "References"],
  ["socials", "Social Links"],
  ["customSections", "Custom Sections"],
];

const defaultActiveSections = {
  personal: true,
  skills: true,
  languages: true,
  hobbies: true,
  experience: true,
  education: true,
  projects: true,
  certifications: true,
  awards: true,
  references: true,
  socials: true,
  customSections: true,
};

const cloneEmptyForm = () => JSON.parse(JSON.stringify(emptyForm));

const prepareResumeDataForExport = (data, activeSections) => {
  const cleanedData = JSON.parse(JSON.stringify(data));

  if (!activeSections.personal) {
    cleanedData.personal = {};
  }

  Object.keys(defaultActiveSections).forEach((section) => {
    if (section !== "personal" && !activeSections[section]) {
      cleanedData[section] = [];
    }
  });

  return cleanedData;
};

export default function Builder() {
  const { templateId } = useParams();
  const template = templates.find((item) => item.id === templateId);

  const [form, setForm] = useState(cloneEmptyForm());
  const [activeSections, setActiveSections] = useState({
    ...defaultActiveSections,
  });
  const [loading, setLoading] = useState("");
  const previewRef = useRef(null);

  if (!template) {
    return <Navigate to="/resume-builder/templates" />;
  }

  const toggleSection = (section) => {
    setActiveSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updatePersonal = (field, value) => {
    setForm((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      updatePersonal("photo", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const updateArrayField = (section, index, field, value) => {
    setForm((prev) => {
      const updated = [...prev[section]];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        [section]: updated,
      };
    });
  };

  const addItem = (section, item) => {
    setForm((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  const removeItem = (section, index) => {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const cleanFileName = (name = "resume") => {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "resume";
  };

  const resetResumeData = () => {
    setForm(cloneEmptyForm());
    setActiveSections({ ...defaultActiveSections });
  };

  const getResumePreviewNode = () => {
    return previewRef.current?.querySelector(".premium-resume, .resume-preview");
  };

  const getAllPageStyles = () => {
    const cssText = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (error) {
          return "";
        }
      })
      .join("\n");

    return `
      ${cssText}
      body {
        margin: 0;
        padding: 0;
        background: #111827;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .premium-resume,
      .resume-preview {
        margin: 0 auto;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    `;
  };

  const createExportClone = (resumeNode) => {
    const wrapper = document.createElement("div");
    wrapper.className = "art-export-root";
    wrapper.style.position = "fixed";
    wrapper.style.left = "-100000px";
    wrapper.style.top = "0";
    wrapper.style.width = "794px";
    wrapper.style.zIndex = "-1";
    wrapper.style.opacity = "1";
    wrapper.style.pointerEvents = "none";

    const clone = resumeNode.cloneNode(true);
    clone.classList.add("art-export-resume");

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    return { wrapper, clone };
  };

  const getCanvasBackground = (node) => {
    const style = window.getComputedStyle(node);
    const bg = style.backgroundColor;

    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      return bg;
    }

    if (node.classList.contains("premium-dark-gold")) return "#1d1f22";
    if (node.classList.contains("premium-orange-pro")) return "#08231f";
    if (node.classList.contains("premium-blue-sidebar")) return "#ffffff";
    if (node.classList.contains("premium-navy-timeline")) return "#ffffff";

    return "#ffffff";
  };

  const cssColorToRgb = (color = "#ffffff") => {
    if (color.startsWith("#")) {
      const clean = color.replace("#", "");
      const full =
        clean.length === 3
          ? clean
            .split("")
            .map((char) => char + char)
            .join("")
          : clean;

      return [
        parseInt(full.slice(0, 2), 16),
        parseInt(full.slice(2, 4), 16),
        parseInt(full.slice(4, 6), 16),
      ];
    }

    const channels = color.match(/\d+(\.\d+)?/g);

    if (channels?.length >= 3) {
      return channels.slice(0, 3).map((channel) => Number(channel));
    }

    return [255, 255, 255];
  };

  const fillPageBackground = (pdf, color) => {
    const [r, g, b] = cssColorToRgb(color);

    pdf.setFillColor(r, g, b);
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      "F"
    );
  };

  const getSmartPageBreaks = (clone, canvas, pageHeightPx) => {
    const cloneRect = clone.getBoundingClientRect();
    const scaleFactor = canvas.width / cloneRect.width;
    const pageHeightCss = pageHeightPx / scaleFactor;
    const contentHeightCss = cloneRect.height;

    const sections = Array.from(
      clone.querySelectorAll(".premium-top-header, .premium-section, .resume-paper section")
    ).map((element) => {
      const rect = element.getBoundingClientRect();

      return {
        top: rect.top - cloneRect.top,
        bottom: rect.bottom - cloneRect.top,
      };
    });

    const breaksCss = [0];
    let currentTop = 0;

    while (currentTop + pageHeightCss < contentHeightCss - 4) {
      const idealCut = currentTop + pageHeightCss;
      let smartCut = idealCut;

      const crossingSection = sections.find((section) => {
        return (
          section.top > currentTop + 80 &&
          section.top < idealCut &&
          section.bottom > idealCut
        );
      });

      if (crossingSection) {
        const beforeSectionCut = crossingSection.top - 18;

        if (beforeSectionCut > currentTop + pageHeightCss * 0.45) {
          smartCut = beforeSectionCut;
        }
      }

      if (smartCut <= currentTop + 20) {
        smartCut = idealCut;
      }

      breaksCss.push(smartCut);
      currentTop = smartCut;
    }

    breaksCss.push(contentHeightCss);

    return breaksCss.map((value) =>
      Math.max(0, Math.min(canvas.height, Math.round(value * scaleFactor)))
    );
  };

  const downloadPdfAsDisplayed = async () => {
    const resumeNode = getResumePreviewNode();

    if (!resumeNode) {
      alert("Resume preview not found.");
      return;
    }

    let exportWrapper = null;

    try {
      setLoading("pdf");

      const { wrapper, clone } = createExportClone(resumeNode);
      exportWrapper = wrapper;

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const pageBg = getCanvasBackground(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        backgroundColor: pageBg,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidthMm = pdf.internal.pageSize.getWidth();
      const pageHeightMm = pdf.internal.pageSize.getHeight();

      const pageHeightPx = Math.floor((canvas.width * pageHeightMm) / pageWidthMm);
      const pageBreaks = getSmartPageBreaks(clone, canvas, pageHeightPx);

      for (let pageIndex = 0; pageIndex < pageBreaks.length - 1; pageIndex += 1) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        fillPageBackground(pdf, pageBg);

        const sliceCanvas = document.createElement("canvas");
        const sliceContext = sliceCanvas.getContext("2d");
        const sourceY = pageBreaks[pageIndex];
        const nextY = pageBreaks[pageIndex + 1];
        const sliceHeight = Math.max(1, nextY - sourceY);

        sliceCanvas.width = canvas.width;
        sliceCanvas.height = pageHeightPx;

        sliceContext.fillStyle = pageBg;
        sliceContext.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);

        sliceContext.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        const pageImage = sliceCanvas.toDataURL("image/jpeg", 0.95);

        pdf.addImage(pageImage, "JPEG", 0, 0, pageWidthMm, pageHeightMm);
      }

      const fileName = `Convert Wala_${cleanFileName(
        form.personal?.fullName || "resume"
      )}_same_design_resume.pdf`;

      pdf.save(fileName);

      resetResumeData();
      alert(
        "Resume downloaded with the same visible design. Your entered data has been cleared."
      );
    } catch (error) {
      console.error(error);
      alert("PDF download failed. Please check html2canvas and jspdf installation.");
    } finally {
      if (exportWrapper) {
        exportWrapper.remove();
      }
      setLoading("");
    }
  };

  const downloadWordAsDisplayed = async () => {
    const resumeNode = getResumePreviewNode();

    if (!resumeNode) {
      alert("Resume preview not found.");
      return;
    }

    try {
      setLoading("doc");

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Convert Wala Resume</title>
            <style>${getAllPageStyles()}</style>
          </head>
          <body>
            <div class="art-export-root">
              ${resumeNode.outerHTML}
            </div>
          </body>
        </html>
      `;

      const blob = new Blob(["\ufeff", html], {
        type: "application/msword;charset=utf-8",
      });

      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = `Convert Wala_${cleanFileName(
        form.personal?.fullName || "resume"
      )}_same_design_resume.doc`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);

      resetResumeData();
      alert("Word file downloaded. PDF gives the closest exact visual match.");
    } catch (error) {
      console.error(error);
      alert("Word download failed.");
    } finally {
      setLoading("");
    }
  };
  const SETTINGS_EVENT = "convertwala-settings-change";
  const STORAGE_LANGUAGE = "ath_language";
  const STORAGE_THEME = "ath_theme";

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
  return (

    <main className={`art-builder-page ${theme === "dark" ? "dark" : "light"}`}><Helmet>
      <html lang={language === "hi" ? "hi" : "en"} />
      <title>Resume Builder - Create ATS Friendly Resume | Convert Wala</title>
      <meta
        name="description"
        content="Create an ATS friendly resume online with Convert Wala free resume builder. Fill details, preview live and download PDF or Word resume."
      />
      <meta
        name="keywords"
        content="resume builder, ATS resume builder, free resume builder, online resume maker, CV maker, professional resume template, Convert Wala"
      />
      <meta name="robots" content="index, follow" />
      <link
        rel="canonical"
        href="https://www.convertwala.com/resume-builder/build"
      />
    </Helmet>
      <section className="rb-builder-head">
        <div>
          <p className="rb-eyebrow">Resume Builder</p>
          <h1>{template.name}</h1>
          <p>Fill your details and preview will update live.</p>
        </div>

        <div className="rb-download-actions">
          <button
            className="rb-primary-btn"
            onClick={downloadPdfAsDisplayed}
            disabled={loading}
          >
            {loading === "pdf" ? "Downloading..." : "Download PDF"}
          </button>

          <button
            className="rb-secondary-dark-btn"
            onClick={downloadWordAsDisplayed}
            disabled={loading}
          >
            {loading === "doc" ? "Downloading..." : "Download Word"}
          </button>
        </div>
      </section>

      <section className="rb-builder-layout">
        <div className="rb-form-panel">
          <div className="rb-section-control">
            <div className="rb-section-control-head">
              <h2>Resume Sections</h2>
              <p>
                Uncheck any section you do not want. Hidden sections will also
                be removed from preview and download.
              </p>
            </div>

            <div className="rb-section-toggle-grid">
              {sectionOptions.map(([key, label]) => (
                <label className="rb-section-toggle" key={key}>
                  <input
                    type="checkbox"
                    checked={activeSections[key]}
                    onChange={() => toggleSection(key)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {activeSections.personal && (
            <>
              <h2>Personal Details</h2>

              <label className="rb-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <span>
                  {form.personal.photo
                    ? "Change Profile Photo"
                    : "Upload Profile Photo"}
                </span>
              </label>

              <div className="rb-form-grid">
                <input
                  placeholder="Full Name"
                  value={form.personal.fullName}
                  onChange={(e) => updatePersonal("fullName", e.target.value)}
                />
                <input
                  placeholder="Job Title / Tagline"
                  value={form.personal.jobTitle}
                  onChange={(e) => updatePersonal("jobTitle", e.target.value)}
                />
                <input
                  placeholder="Email"
                  value={form.personal.email}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                />
                <input
                  placeholder="Phone"
                  value={form.personal.phone}
                  onChange={(e) => updatePersonal("phone", e.target.value)}
                />
                <input
                  placeholder="Location"
                  value={form.personal.location}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                />
                <input
                  placeholder="LinkedIn"
                  value={form.personal.linkedin}
                  onChange={(e) => updatePersonal("linkedin", e.target.value)}
                />
                <input
                  placeholder="Portfolio / Website"
                  value={form.personal.portfolio}
                  onChange={(e) => updatePersonal("portfolio", e.target.value)}
                />
              </div>

              <textarea
                placeholder="About Me / Profile Summary"
                value={form.personal.summary}
                onChange={(e) => updatePersonal("summary", e.target.value)}
              />
            </>
          )}

          {activeSections.skills && (
            <>
              <h2>Skills</h2>
              {form.skills.map((item, index) => (
                <div className="rb-mini-row" key={index}>
                  <input
                    placeholder="Skill Name"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayField("skills", index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Level"
                    value={item.level}
                    onChange={(e) =>
                      updateArrayField("skills", index, "level", e.target.value)
                    }
                  />
                  {form.skills.length > 1 && (
                    <button onClick={() => removeItem("skills", index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() => addItem("skills", { name: "", level: 80 })}
              >
                + Add Skill
              </button>
            </>
          )}

          {activeSections.languages && (
            <>
              <h2>Languages</h2>
              {form.languages.map((item, index) => (
                <div className="rb-mini-row" key={index}>
                  <input
                    placeholder="Language"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayField("languages", index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Level"
                    value={item.level}
                    onChange={(e) =>
                      updateArrayField("languages", index, "level", e.target.value)
                    }
                  />
                  {form.languages.length > 1 && (
                    <button onClick={() => removeItem("languages", index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() => addItem("languages", { name: "", level: 70 })}
              >
                + Add Language
              </button>
            </>
          )}

          {activeSections.experience && (
            <>
              <h2>Experience</h2>
              {form.experience.map((item, index) => (
                <div className="rb-repeat-card" key={index}>
                  <div className="rb-form-grid">
                    <input
                      placeholder="Job Title"
                      value={item.title}
                      onChange={(e) =>
                        updateArrayField(
                          "experience",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Company"
                      value={item.company}
                      onChange={(e) =>
                        updateArrayField(
                          "experience",
                          index,
                          "company",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Location"
                      value={item.location}
                      onChange={(e) =>
                        updateArrayField(
                          "experience",
                          index,
                          "location",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Start Date"
                      value={item.startDate}
                      onChange={(e) =>
                        updateArrayField(
                          "experience",
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="End Date"
                      value={item.endDate}
                      disabled={item.currentWorking}
                      onChange={(e) =>
                        updateArrayField(
                          "experience",
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <label className="rb-checkbox">
                    <input
                      type="checkbox"
                      checked={item.currentWorking}
                      onChange={(e) =>
                        updateArrayField(
                          "experience",
                          index,
                          "currentWorking",
                          e.target.checked
                        )
                      }
                    />
                    Currently working here
                  </label>

                  <textarea
                    placeholder={
                      "Bullet points - one per line\nManaged team\nImproved revenue"
                    }
                    value={item.bullets}
                    onChange={(e) =>
                      updateArrayField(
                        "experience",
                        index,
                        "bullets",
                        e.target.value
                      )
                    }
                  />

                  {form.experience.length > 1 && (
                    <button
                      className="rb-remove-btn"
                      onClick={() => removeItem("experience", index)}
                    >
                      Remove Experience
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("experience", {
                    title: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    currentWorking: false,
                    bullets: "",
                  })
                }
              >
                + Add Experience
              </button>
            </>
          )}

          {activeSections.education && (
            <>
              <h2>Education</h2>
              {form.education.map((item, index) => (
                <div className="rb-repeat-card" key={index}>
                  <div className="rb-form-grid">
                    <input
                      placeholder="Degree"
                      value={item.degree}
                      onChange={(e) =>
                        updateArrayField(
                          "education",
                          index,
                          "degree",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Institute"
                      value={item.institute}
                      onChange={(e) =>
                        updateArrayField(
                          "education",
                          index,
                          "institute",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Location"
                      value={item.location}
                      onChange={(e) =>
                        updateArrayField(
                          "education",
                          index,
                          "location",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Start Date"
                      value={item.startDate}
                      onChange={(e) =>
                        updateArrayField(
                          "education",
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="End Date"
                      value={item.endDate}
                      disabled={item.currentStudying}
                      onChange={(e) =>
                        updateArrayField(
                          "education",
                          index,
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <label className="rb-checkbox">
                    <input
                      type="checkbox"
                      checked={item.currentStudying}
                      onChange={(e) =>
                        updateArrayField(
                          "education",
                          index,
                          "currentStudying",
                          e.target.checked
                        )
                      }
                    />
                    Currently studying here
                  </label>

                  <textarea
                    placeholder="Education details / marks / achievements"
                    value={item.details}
                    onChange={(e) =>
                      updateArrayField(
                        "education",
                        index,
                        "details",
                        e.target.value
                      )
                    }
                  />

                  {form.education.length > 1 && (
                    <button
                      className="rb-remove-btn"
                      onClick={() => removeItem("education", index)}
                    >
                      Remove Education
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("education", {
                    degree: "",
                    institute: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    currentStudying: false,
                    details: "",
                  })
                }
              >
                + Add Education
              </button>
            </>
          )}

          {activeSections.projects && (
            <>
              <h2>Projects</h2>
              {form.projects.map((item, index) => (
                <div className="rb-repeat-card" key={index}>
                  <input
                    placeholder="Project Name"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayField("projects", index, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Tech Stack"
                    value={item.tech}
                    onChange={(e) =>
                      updateArrayField("projects", index, "tech", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Project bullet points - one per line"
                    value={item.bullets}
                    onChange={(e) =>
                      updateArrayField(
                        "projects",
                        index,
                        "bullets",
                        e.target.value
                      )
                    }
                  />

                  {form.projects.length > 1 && (
                    <button
                      className="rb-remove-btn"
                      onClick={() => removeItem("projects", index)}
                    >
                      Remove Project
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("projects", { name: "", tech: "", bullets: "" })
                }
              >
                + Add Project
              </button>
            </>
          )}

          {activeSections.certifications && (
            <>
              <h2>Certifications</h2>
              {form.certifications.map((item, index) => (
                <div className="rb-mini-row" key={index}>
                  <input
                    placeholder="Certification"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayField(
                        "certifications",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <input
                    placeholder="Issuer"
                    value={item.issuer}
                    onChange={(e) =>
                      updateArrayField(
                        "certifications",
                        index,
                        "issuer",
                        e.target.value
                      )
                    }
                  />
                  <input
                    placeholder="Year"
                    value={item.year}
                    onChange={(e) =>
                      updateArrayField(
                        "certifications",
                        index,
                        "year",
                        e.target.value
                      )
                    }
                  />
                  {form.certifications.length > 1 && (
                    <button onClick={() => removeItem("certifications", index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("certifications", { name: "", issuer: "", year: "" })
                }
              >
                + Add Certification
              </button>
            </>
          )}

          {activeSections.awards && (
            <>
              <h2>Awards</h2>
              {form.awards.map((item, index) => (
                <div className="rb-mini-row" key={index}>
                  <input
                    placeholder="Award"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayField("awards", index, "name", e.target.value)
                    }
                  />
                  <input
                    placeholder="Organization"
                    value={item.organization}
                    onChange={(e) =>
                      updateArrayField(
                        "awards",
                        index,
                        "organization",
                        e.target.value
                      )
                    }
                  />
                  <input
                    placeholder="Year"
                    value={item.year}
                    onChange={(e) =>
                      updateArrayField("awards", index, "year", e.target.value)
                    }
                  />
                  {form.awards.length > 1 && (
                    <button onClick={() => removeItem("awards", index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("awards", { name: "", organization: "", year: "" })
                }
              >
                + Add Award
              </button>
            </>
          )}

          {activeSections.references && (
            <>
              <h2>References</h2>
              {form.references.map((item, index) => (
                <div className="rb-repeat-card" key={index}>
                  <div className="rb-form-grid">
                    <input
                      placeholder="Reference Name"
                      value={item.name}
                      onChange={(e) =>
                        updateArrayField(
                          "references",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Position"
                      value={item.position}
                      onChange={(e) =>
                        updateArrayField(
                          "references",
                          index,
                          "position",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Phone"
                      value={item.phone}
                      onChange={(e) =>
                        updateArrayField(
                          "references",
                          index,
                          "phone",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Email"
                      value={item.email}
                      onChange={(e) =>
                        updateArrayField(
                          "references",
                          index,
                          "email",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {form.references.length > 1 && (
                    <button
                      className="rb-remove-btn"
                      onClick={() => removeItem("references", index)}
                    >
                      Remove Reference
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("references", {
                    name: "",
                    position: "",
                    phone: "",
                    email: "",
                  })
                }
              >
                + Add Reference
              </button>
            </>
          )}

          {activeSections.socials && (
            <>
              <h2>Social Links</h2>
              {form.socials.map((item, index) => (
                <div className="rb-mini-row" key={index}>
                  <input
                    placeholder="Platform"
                    value={item.platform}
                    onChange={(e) =>
                      updateArrayField(
                        "socials",
                        index,
                        "platform",
                        e.target.value
                      )
                    }
                  />
                  <input
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) =>
                      updateArrayField("socials", index, "url", e.target.value)
                    }
                  />
                  {form.socials.length > 1 && (
                    <button onClick={() => removeItem("socials", index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() => addItem("socials", { platform: "", url: "" })}
              >
                + Add Social Link
              </button>
            </>
          )}

          {activeSections.hobbies && (
            <>
              <h2>Hobbies</h2>
              {form.hobbies.map((item, index) => (
                <div className="rb-mini-row" key={index}>
                  <input
                    placeholder="Hobby"
                    value={item.name}
                    onChange={(e) =>
                      updateArrayField("hobbies", index, "name", e.target.value)
                    }
                  />
                  {form.hobbies.length > 1 && (
                    <button onClick={() => removeItem("hobbies", index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() => addItem("hobbies", { name: "" })}
              >
                + Add Hobby
              </button>
            </>
          )}

          {activeSections.customSections && (
            <>
              <h2>Custom Sections</h2>
              {form.customSections.map((item, index) => (
                <div className="rb-repeat-card" key={index}>
                  <input
                    placeholder="Section Title"
                    value={item.title}
                    onChange={(e) =>
                      updateArrayField(
                        "customSections",
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />
                  <textarea
                    placeholder="Section Content"
                    value={item.content}
                    onChange={(e) =>
                      updateArrayField(
                        "customSections",
                        index,
                        "content",
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="rb-remove-btn"
                    onClick={() => removeItem("customSections", index)}
                  >
                    Remove Section
                  </button>
                </div>
              ))}

              <button
                className="rb-add-btn"
                onClick={() =>
                  addItem("customSections", { title: "", content: "" })
                }
              >
                + Add Custom Section
              </button>
            </>
          )}
        </div>

        <div className="rb-live-preview" ref={previewRef}>
          <ResumePreview
            resumeData={form}
            template={template}
            activeSections={activeSections}
          />
        </div>
      </section>
    </main>
  );
}
