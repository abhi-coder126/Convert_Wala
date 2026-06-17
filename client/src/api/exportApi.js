import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const exportResumeFile = async ({ type, resumeData, templateId }) => {
  const endpoint = type === "pdf" ? "/api/export/pdf" : "/api/export/docx";

  const response = await axios.post(
    `${API_BASE}${endpoint}`,
    {
      resumeData,
      templateId,
    },
    {
      responseType: "blob",
    }
  );

  return response.data;
};