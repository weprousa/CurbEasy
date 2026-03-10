
import { GoogleGenAI } from "@google/genai";

export const askNYCStreetRules = async (prompt: string, location?: string) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return "Error: Gemini API key is not configured. Please check your environment settings.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const now = new Date();
    const nycTimeStr = now.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const fullPrompt = `Current NYC Date/Time: ${nycTimeStr}.
${location ? `User Location: ${location}.` : ''}

Question: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: "You are an expert NYC parking and street rules assistant. Provide clear, concise answers to questions about NYC parking regulations, alternate side parking (ASP), parking tickets, and traffic. Always warn users to verify with physical signs. Use the provided location context and CURRENT DATE/TIME to give accurate answers. IMPORTANT: DO NOT use any hashtags (#) in your response. Use bold text or bullet points for structure instead.",
      },
    });

    if (!response.text) {
      console.warn("Gemini returned empty response", response);
      return "I'm sorry, I couldn't process that request. The assistant returned an empty response.";
    }

    // Fallback: Remove hashtags if AI ignores instructions
    return response.text.replace(/#/g, '');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the NYC rules assistant. Please try again later.";
  }
};

export const scanSignRules = async (imageBase64: string) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return "Error: Gemini API key is not configured.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    };
    const textPart = {
      text: "Analyze this NYC parking sign. Explain exactly what the rules are for the current day and time. Be very specific about hours and days mentioned on the sign."
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [imagePart, textPart] }],
      config: {
        systemInstruction: "You are an expert NYC parking sign analyzer. Explain the rules clearly. DO NOT use any hashtags (#) in your response. Use bold text for emphasis instead.",
      },
    });
    
    if (!response.text) {
      return "I couldn't read the rules from this sign image. Please try a clearer photo.";
    }

    return response.text.replace(/#/g, '');
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return "Failed to analyze sign. Please ensure the image is clear and well-lit.";
  }
};
