import express from "express";
import { generatePdfBuffer } from "../utils/pdfGenerator.js";
import { generateDocxBuffer } from "../utils/docxGenerator.js";

const router = express.Router();

const cleanFileName = (name = "resume") => {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

router.post("/pdf", async (req, res) => {
  try {
    const { resumeData, templateId, activeSections } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    const buffer = await generatePdfBuffer(resumeData, templateId, activeSections);

    const fileName = cleanFileName(resumeData.personal?.fullName || "resume");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}_ats_resume.pdf"`
    );

    return res.send(buffer);
  } catch (error) {
    console.error("PDF export error:", error);
    return res.status(500).json({ message: "PDF generation failed" });
  }
});

router.post("/docx", async (req, res) => {
  try {
    const { resumeData, templateId, activeSections } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    const buffer = await generateDocxBuffer(resumeData, templateId, activeSections);

    const fileName = cleanFileName(resumeData.personal?.fullName || "resume");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}_ats_resume.docx"`
    );

    return res.send(buffer);
  } catch (error) {
    console.error("DOCX export error:", error);
    return res.status(500).json({ message: "Word generation failed" });
  }
});

export default router;