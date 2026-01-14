import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flashcard, QuizQuestion, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Study Plan Generation ---
export const generateStudyPlan = async (
  examName: string,
  daysUntilExam: number,
  weaknesses: string
): Promise<StudyPlan | null> => {
  try {
    const prompt = `
      Create a study plan for the ${examName} exam which is in ${daysUntilExam} days.
      My weak areas are: ${weaknesses}.
      Create a day-by-day plan (up to 7 days for this preview) that balances review and practice.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        examName: { type: Type.STRING },
        targetDate: { type: Type.STRING },
        schedule: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              topic: { type: Type.STRING },
              focus: { type: Type.STRING },
              activities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["day", "topic", "focus", "activities"],
          },
        },
      },
      required: ["examName", "targetDate", "schedule"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert academic tutor. Create realistic, actionable study plans.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyPlan;
    }
    return null;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw error;
  }
};

// --- Flashcards Generation ---
export const generateFlashcards = async (
  topic: string,
  count: number = 5
): Promise<Flashcard[]> => {
  try {
    const prompt = `Generate ${count} flashcards for the topic: "${topic}". keep definitions concise.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          front: { type: Type.STRING, description: "The term or question" },
          back: { type: Type.STRING, description: "The definition or answer" },
          category: { type: Type.STRING },
        },
        required: ["id", "front", "back", "category"],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a helpful study assistant. Create high-quality flashcards.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Flashcard[];
    }
    return [];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

// --- Quiz Generation ---
export const generateQuiz = async (
  topic: string,
  difficulty: string,
  count: number = 5
): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Generate a ${count}-question multiple choice quiz on "${topic}" at ${difficulty} level.`;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of 4 possible answers",
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
          explanation: { type: Type.STRING, description: "Short explanation of why the answer is correct" },
        },
        required: ["id", "question", "options", "correctAnswerIndex", "explanation"],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a test-prep expert. Ensure distractors are plausible.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
