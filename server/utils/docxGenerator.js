import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

const splitLines = (value = "") => {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const sectionHeading = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
  });

const normalText = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: 21 })],
    spacing: { after: 80 },
  });

const bulletText = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: 21 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });

export const generateDocxBuffer = async (resumeData) => {
  const personal = resumeData.personal || {};
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: personal.fullName || "Your Name",
          bold: true,
          size: 34,
        }),
      ],
      spacing: { after: 120 },
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: [
            personal.email,
            personal.phone,
            personal.location,
            personal.linkedin,
            personal.portfolio,
          ]
            .filter(Boolean)
            .join(" | "),
          size: 19,
        }),
      ],
      spacing: { after: 220 },
    })
  );

  if (personal.summary) {
    children.push(sectionHeading("PROFESSIONAL SUMMARY"));
    children.push(normalText(personal.summary));
  }

  if (resumeData.skills) {
    children.push(sectionHeading("SKILLS"));
    children.push(normalText(resumeData.skills));
  }

  if (resumeData.experience?.length) {
    children.push(sectionHeading("EXPERIENCE"));

    resumeData.experience.forEach((exp) => {
      if (!exp.title && !exp.company) return;

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.title || ""}${exp.company ? ` - ${exp.company}` : ""}`,
              bold: true,
              size: 23,
            }),
          ],
          spacing: { after: 50 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: [exp.location, exp.startDate, exp.endDate]
                .filter(Boolean)
                .join(" | "),
              italics: true,
              size: 19,
            }),
          ],
          spacing: { after: 80 },
        })
      );

      splitLines(exp.bullets).forEach((line) => {
        children.push(bulletText(line));
      });
    });
  }

  if (resumeData.projects?.length) {
    children.push(sectionHeading("PROJECTS"));

    resumeData.projects.forEach((project) => {
      if (!project.name) return;

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 23,
            }),
          ],
          spacing: { after: 50 },
        })
      );

      if (project.tech) {
        children.push(normalText(project.tech));
      }

      splitLines(project.bullets).forEach((line) => {
        children.push(bulletText(line));
      });
    });
  }

  if (resumeData.education?.length) {
    children.push(sectionHeading("EDUCATION"));

    resumeData.education.forEach((edu) => {
      if (!edu.degree && !edu.institute) return;

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree || ""}${edu.institute ? ` - ${edu.institute}` : ""}`,
              bold: true,
              size: 23,
            }),
          ],
        })
      );

      children.push(
        normalText([edu.startDate, edu.endDate].filter(Boolean).join(" | "))
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
};