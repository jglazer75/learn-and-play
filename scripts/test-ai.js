const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.appSettings.findUnique({ where: { id: 'settings' } });
    if (!settings?.geminiApiKey) {
        console.error("No API Key found");
        return;
    }

    console.log("Using API Key:", settings.geminiApiKey.substring(0, 5) + "...");
    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);

    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-2.0-flash-lite",
        "gemini-3-pro-preview"
    ];

    for (const modelName of modelsToTry) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`✅ SUCCESS: ${modelName}`);
            // console.log(result.response.text());
            break; // Found one!
        } catch (error) {
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
