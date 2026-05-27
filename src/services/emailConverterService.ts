import { GoogleGenAI } from "@google/genai";

export async function convertToEmailSafeHtml(html: string, css: string): Promise<string> {
  console.log('Initiating conversion with Gemini...');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is missing');
    throw new Error('AI Configuration Error: Missing API Key');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are an expert Email HTML converter.

Your task is to convert standard web HTML and CSS into a single, production-ready HTML email template fully compatible with major email clients such as Gmail, Outlook, Apple Mail, and Yahoo Mail.

IMPORTANT:
The final email template must preserve the ORIGINAL DESIGN, LAYOUT, VISUAL STRUCTURE, SPACING, TYPOGRAPHY, COLORS, IMAGES, AND OVERALL APPEARANCE as closely as possible to the uploaded files.

Do NOT redesign, simplify, or change the UI unless required for email compatibility.
The goal is to make the email look almost identical to the original HTML/CSS version while converting it into email-safe code.

Requirements:
1. Output must be a SINGLE HTML FILE only. No external CSS, no JS, no frameworks.
2. Preserve original layout, spacing, colors, and visual hierarchy.
3. Use email-safe structure (tables where needed).
4. Inline ALL CSS into style attributes.
5. Ensure compatibility with Gmail, Outlook, Apple Mail, and Yahoo Mail. Avoid flexbox, grid, and absolute positioning.
6. Provide Outlook-safe fallbacks.
7. Return ONLY the final converted HTML code. No markdown, no explanations, no comments outside the HTML.`;

  const prompt = `
Convert the following HTML and CSS into a production-ready email-safe HTML template.

HTML:
${html}

CSS:
${css}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    if (!response.text) {
      console.warn('Gemini returned an empty response');
    }
    console.log('Conversion successful');
    return response.text || "";
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
