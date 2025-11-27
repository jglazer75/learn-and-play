import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./db";

export async function getGeminiClient() {
    const settings = await prisma.appSettings.findUnique({ where: { id: 'settings' } });
    if (!settings?.geminiApiKey) {
        throw new Error("Gemini API Key not configured");
    }
    return new GoogleGenerativeAI(settings.geminiApiKey);
}

export async function generateLessonContent(weekTitle: string, gameTitle: string, objective: string, activity: string) {
    const genAI = await getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert Video Game Historian and Early Childhood Educator writing a "Manual" for a father and son playing through a video game curriculum.
    
    Current Lesson:
    - Game: ${gameTitle}
    - Week Title: ${weekTitle}
    - Objective: ${objective}
    - Activity: ${activity}

    Please generate a rich, magazine-style article in Markdown format with the following sections:
    
    # The Historian's Context
    Explain the history of ${gameTitle}, its cultural impact, and why it matters. Keep it engaging for a dad but accessible for a child.
    
    # The Educational Angle
    Explain the specific educational value of this week's objective ("${objective}"). How does playing this game help build this skill?
    
    # The Time Machine
    Give a snapshot of the world when this game was released. What else was happening in pop culture, technology, or sports?
    
    # Dad Tips
    3-4 bullet points on how the father can best support the son during this specific activity ("${activity}").
    
    # Further Reading
    A list of 2-3 related books, movies, or other games that explore similar themes.
    
    Use bolding, lists, and clear headings. Keep the tone fun, encouraging, and educational.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Strip markdown code blocks if present
    if (text.startsWith('```markdown')) {
        text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
        text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return text;
}
