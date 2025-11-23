import { GoogleGenAI, Type } from "@google/genai";

const systemInstruction = `
You are a Cantonese language expert. 
Your task is to translate Mandarin terms into authentic Hong Kong Cantonese (Traditional Chinese).
Provide standard Jyutping (e.g. nei5 hou2) for pronunciation.
Provide a relevant, natural example sentence in Cantonese with its Jyutping and Mandarin meaning.
`;

export const generateCardContent = async (mandarinTerm: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate this Mandarin term to Cantonese: "${mandarinTerm}". If it's a phrase, provide the closest Cantonese equivalent idiom or phrase.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cantonese: { type: Type.STRING, description: "The Cantonese term in Traditional Chinese" },
            jyutping: { type: Type.STRING, description: "Jyutping romanization" },
            mandarin_meaning: { type: Type.STRING, description: "Brief meaning in Mandarin" },
            example_sentence: { type: Type.STRING, description: "A natural example sentence using the term" },
            example_jyutping: { type: Type.STRING, description: "Jyutping for the example sentence" },
            example_meaning: { type: Type.STRING, description: "Mandarin translation of the example sentence" },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "2-3 relevant tags (e.g. Slang, Greetings, Food)" 
            }
          },
          required: ["cantonese", "jyutping", "mandarin_meaning", "example_sentence", "example_jyutping", "example_meaning", "tags"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};