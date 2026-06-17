import express from "express";

const router = express.Router();

router.post("/generate-text", async (req, res) => {
  try {
    const {
      topic,
      type,
      tone,
      language,
      keywords,
      useLiveData = true,
    } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY missing in server .env",
      });
    }

    const prompt = `
You are an advanced professional content generator.

Create highly accurate, useful and smart content.

Content Type: ${type}
Topic: ${topic}
Tone: ${tone}
Language: ${language}
Keywords: ${keywords || "Not provided"}

Rules:
1. Write natural human-like content.
2. Do not write fake facts.
3. If live/current data is needed, use grounded information.
4. Include real examples where useful.
5. Keep content practical and conversion-focused.
6. Use headings, bullets and clear structure.
7. If data is uncertain, clearly say it is uncertain.
8. Do not hallucinate statistics.
9. Do not mention that you are an AI.
10. Output only final content.

For blogs:
- Add SEO title
- Meta description
- Introduction
- Main sections
- Key points
- Conclusion
- FAQs

For captions:
- Add hook
- Main caption
- CTA
- Hashtags

For product description:
- Add benefits, features and CTA.

For YouTube description:
- Add summary, timestamps, keywords and hashtags.
`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.45,
        topP: 0.9,
        maxOutputTokens: 3500,
      },
    };

    if (useLiveData) {
      body.tools = [
        {
          google_search: {},
        },
      ];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          data?.error?.message || "Gemini API request failed",
        error: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "";

    const groundingChunks =
      data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = groundingChunks
      .map((chunk) => ({
        title: chunk?.web?.title || "Source",
        url: chunk?.web?.uri || "",
      }))
      .filter((item) => item.url);

    return res.json({
      success: true,
      text,
      sources,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "AI generation failed",
    });
  }
});

export default router;