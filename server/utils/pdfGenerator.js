import PDFDocument from "pdfkit";

const isActive = (activeSections = {}, section) => {
  return activeSections?.[section] !== false;
};

const hasText = (value) => {
  return String(value || "").trim().length > 0;
};

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const splitLines = (value = "") => {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const addSectionTitle = (doc, title) => {
  doc.moveDown(0.8);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text(title.toUpperCase());

  doc
    .moveTo(50, doc.y + 4)
    .lineTo(545, doc.y + 4)
    .strokeColor("#d1d5db")
    .stroke();

  doc.moveDown(0.6);
};

const addBullet = (doc, text) => {
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(`• ${text}`, {
      width: 490,
      indent: 12,
      lineGap: 2,
    });
};

export const generatePdfBuffer = (resumeData, templateId, activeSections = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const personal = resumeData.personal || {};

      if (isActive(activeSections, "personal")) {
        doc
          .font("Helvetica-Bold")
          .fontSize(22)
          .fillColor("#111827")
          .text(personal.fullName || "Your Name", { align: "center" });

        if (hasText(personal.jobTitle)) {
          doc
            .font("Helvetica")
            .fontSize(11)
            .fillColor("#374151")
            .text(personal.jobTitle, { align: "center" });
        }

        doc.moveDown(0.3);

        const contact = [
          personal.email,
          personal.phone,
          personal.location,
          personal.linkedin,
          personal.portfolio,
        ]
          .filter(Boolean)
          .join(" | ");

        if (contact) {
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#4b5563")
            .text(contact, { align: "center" });
        }

        if (hasText(personal.summary)) {
          addSectionTitle(doc, "Profile Summary");

          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#374151")
            .text(personal.summary, { lineGap: 2 });
        }
      }

      if (
        isActive(activeSections, "skills") &&
        safeArray(resumeData.skills).some((skill) => hasText(skill.name))
      ) {
        addSectionTitle(doc, "Skills");

        const skillsText = safeArray(resumeData.skills)
          .filter((skill) => hasText(skill.name))
          .map((skill) => skill.name)
          .join(", ");

        doc.font("Helvetica").fontSize(10).fillColor("#374151").text(skillsText);
      }

      if (
        isActive(activeSections, "languages") &&
        safeArray(resumeData.languages).some((lang) => hasText(lang.name))
      ) {
        addSectionTitle(doc, "Languages");

        safeArray(resumeData.languages)
          .filter((lang) => hasText(lang.name))
          .forEach((lang) => {
            doc
              .font("Helvetica")
              .fontSize(10)
              .fillColor("#374151")
              .text(`${lang.name}${lang.level ? ` - ${lang.level}%` : ""}`);
          });
      }

      if (
        isActive(activeSections, "experience") &&
        safeArray(resumeData.experience).some(
          (exp) => hasText(exp.title) || hasText(exp.company) || hasText(exp.bullets)
        )
      ) {
        addSectionTitle(doc, "Work Experience");

        safeArray(resumeData.experience).forEach((exp) => {
          if (!hasText(exp.title) && !hasText(exp.company) && !hasText(exp.bullets)) {
            return;
          }

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(`${exp.title || ""}${exp.company ? ` - ${exp.company}` : ""}`);

          const dateText = [
            exp.location,
            exp.startDate,
            exp.currentWorking ? "Present" : exp.endDate,
          ]
            .filter(Boolean)
            .join(" | ");

          if (dateText) {
            doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(dateText);
          }

          splitLines(exp.bullets).forEach((line) => addBullet(doc, line));
          doc.moveDown(0.4);
        });
      }

      if (
        isActive(activeSections, "education") &&
        safeArray(resumeData.education).some(
          (edu) => hasText(edu.degree) || hasText(edu.institute) || hasText(edu.details)
        )
      ) {
        addSectionTitle(doc, "Education");

        safeArray(resumeData.education).forEach((edu) => {
          if (!hasText(edu.degree) && !hasText(edu.institute) && !hasText(edu.details)) {
            return;
          }

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(`${edu.degree || ""}${edu.institute ? ` - ${edu.institute}` : ""}`);

          const dateText = [
            edu.location,
            edu.startDate,
            edu.currentStudying ? "Present" : edu.endDate,
          ]
            .filter(Boolean)
            .join(" | ");

          if (dateText) {
            doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(dateText);
          }

          if (hasText(edu.details)) {
            doc.font("Helvetica").fontSize(10).fillColor("#374151").text(edu.details);
          }

          doc.moveDown(0.4);
        });
      }

      if (
        isActive(activeSections, "projects") &&
        safeArray(resumeData.projects).some(
          (project) =>
            hasText(project.name) || hasText(project.tech) || hasText(project.bullets)
        )
      ) {
        addSectionTitle(doc, "Projects");

        safeArray(resumeData.projects).forEach((project) => {
          if (!hasText(project.name) && !hasText(project.tech) && !hasText(project.bullets)) {
            return;
          }

          if (hasText(project.name)) {
            doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(project.name);
          }

          if (hasText(project.tech)) {
            doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text(project.tech);
          }

          splitLines(project.bullets).forEach((line) => addBullet(doc, line));
          doc.moveDown(0.4);
        });
      }

      if (
        isActive(activeSections, "certifications") &&
        safeArray(resumeData.certifications).some(
          (item) => hasText(item.name) || hasText(item.issuer)
        )
      ) {
        addSectionTitle(doc, "Certifications");

        safeArray(resumeData.certifications).forEach((item) => {
          if (!hasText(item.name) && !hasText(item.issuer)) return;

          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor("#111827")
            .text(item.name || "Certification");

          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#6b7280")
            .text([item.issuer, item.year].filter(Boolean).join(" | "));
        });
      }

      if (
        isActive(activeSections, "awards") &&
        safeArray(resumeData.awards).some(
          (item) => hasText(item.name) || hasText(item.organization)
        )
      ) {
        addSectionTitle(doc, "Awards");

        safeArray(resumeData.awards).forEach((item) => {
          if (!hasText(item.name) && !hasText(item.organization)) return;

          doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(item.name);

          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#6b7280")
            .text([item.organization, item.year].filter(Boolean).join(" | "));
        });
      }

      if (
        isActive(activeSections, "hobbies") &&
        safeArray(resumeData.hobbies).some((item) => hasText(item.name))
      ) {
        addSectionTitle(doc, "Hobbies");

        const hobbies = safeArray(resumeData.hobbies)
          .filter((item) => hasText(item.name))
          .map((item) => item.name)
          .join(", ");

        doc.font("Helvetica").fontSize(10).fillColor("#374151").text(hobbies);
      }

      if (
        isActive(activeSections, "customSections") &&
        safeArray(resumeData.customSections).some(
          (item) => hasText(item.title) || hasText(item.content)
        )
      ) {
        safeArray(resumeData.customSections).forEach((section) => {
          if (!hasText(section.title) && !hasText(section.content)) return;

          addSectionTitle(doc, section.title || "Custom Section");

          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#374151")
            .text(section.content || "");
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};