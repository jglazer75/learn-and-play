import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.appSettings.findUnique({ where: { id: 'settings' } });
    if (!settings?.geminiApiKey) {
        console.error("No API Key found");
        return;
    }

    console.log("Using API Key:", settings.geminiApiKey.substring(0, 5) + "...");

    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);

    // There isn't a direct listModels method on the client instance in the node SDK easily accessible 
    // without using the model manager, but we can try to just instantiate a few common ones and see if they throw.
    // Actually, checking the docs/SDK, usually we just try to generate content.

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.0-pro",
        "gemini-pro"
    ];

    for (const modelName of modelsToTry) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`✅ SUCCESS: ${modelName}`);
            console.log(result.response.text());
            break; // Found one!
        } catch (error: any) {
            console.log(`❌ FAILED: ${modelName}`);
            console.log(`   Error: ${error.message}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
