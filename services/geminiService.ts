
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const askNYCStreetRules = async (prompt: string, location?: string) => {
  try {
    const fullPrompt = location 
      ? `User is currently at or asking about: ${location}. \n\nQuestion: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: "You are an expert NYC parking and street rules assistant. Provide clear, concise answers to questions about NYC parking regulations, alternate side parking (ASP), parking tickets, and traffic. Always warn users to verify with physical signs. Use the provided location context if available to give more relevant answers.",
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the NYC rules database. Please try again later.";
  }
};

export const scanSignRules = async (imageBase64: string) => {
  try {
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
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text || "I couldn't read the rules from this sign image.";
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return "Failed to analyze sign. Please ensure the image is clear and well-lit.";
  }
};
