import { GoogleGenAI } from "@google/genai";
import { PLAN_TEXT } from "../constants";

let ai: GoogleGenAI | null = null;

export const initializeGenAI = () => {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const getDailyAdvice = async (
  userStatus: string,
  dayOfWeek: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  if (!ai) {
    initializeGenAI();
    if (!ai) return "Error: API Key not found. Please check your environment variables.";
  }

  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert fitness coach specifically for a client with Familial Mediterranean Fever (FMF).
    You have strict access to their "Plan" (provided below).
    
    Current Context:
    - Today is: ${dayOfWeek}
    - User Status: "${userStatus}"

    Your Goal:
    Based *only* on the provided plan, tell the user exactly what to do today.
    
    Rules:
    1. Check for red flags in User Status (e.g., "flare", "pain", "fever", "bad sleep").
    2. If "flare" or "fever" -> apply "Flare-day modifications" immediately.
    3. If "bad sleep" (<6h) -> apply "Low-sleep day modifications".
    4. If normal status -> Prescribe the workout for the day (Mon=A, Wed=B, Fri=C) or Rest/Walking if it's another day.
    5. Always remind them of the daily targets (Protein 135g, Water 2.5L).
    6. Be encouraging but firm on safety guardrails.
    7. Format your response with clear headings or bullet points. Markdown is supported.

    THE PLAN:
    ${PLAN_TEXT}
  `;

  // Convert history to compatible format if needed, but for generateContent we usually just send the prompt if we aren't using chat history object.
  // We will concatenate history for context or just use a single prompt for simplicity in this specific "daily check-in" use case.
  // To keep it simple and robust, we will construct a prompt chain.

  try {
    const response = await ai!.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: userStatus }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error checking your plan. Please try again.";
  }
};
