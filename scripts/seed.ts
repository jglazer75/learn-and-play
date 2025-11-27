import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Reset Database
    await prisma.review.deleteMany({});
    await prisma.week.deleteMany({});
    await prisma.block.deleteMany({});
    await prisma.sideQuest.deleteMany({});
    await prisma.resource.deleteMany({});
    await prisma.game.deleteMany({});
    // await prisma.user.deleteMany({}); // Optional: Clear users if needed
    console.log('Database reset.');

    // --- 1. Seed Curriculum ---
    const curriculumPath = path.join(process.cwd(), 'content', 'curriculum.md');
    if (fs.existsSync(curriculumPath)) {
        const content = fs.readFileSync(curriculumPath, 'utf-8');
        const lines = content.split('\n');

        let currentBlockId = null;
        let blockOrder = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Detect Block
            if (line.startsWith('### **Block')) {
                blockOrder++;
                // Format: ### **Block 1: The Arcade Roots & The 8-Bit Era (Weeks 1–10)**
                const titleMatch = line.match(/Block \d+: (.*) \(Weeks/);
                const title = titleMatch ? titleMatch[1] : line;

                // Description is usually the next few lines? 
                // Looking at file:
                // *Objective: Joystick mastery...*
                let description = "";
                let j = i + 1;
                while (j < lines.length && !lines[j].trim().startsWith('* **Week')) {
                    if (lines[j].trim().startsWith('*Objective:')) {
                        description = lines[j].trim().replace('*Objective:', '').replace(/\*/g, '').trim();
                    }
                    j++;
                }

                const block = await prisma.block.create({
                    data: {
                        order: blockOrder,
                        title: title,
                        description: description,
                    }
                });
                currentBlockId = block.id;
                console.log(`Created Block: ${title}`);
            }

            // Detect Week
            // * **Week 1: The Maze Chase**
            if (line.startsWith('* **Week') && currentBlockId) {
                const titleMatch = line.match(/Week (\d+): (.*)\*\*/);
                if (titleMatch) {
                    const weekNum = parseInt(titleMatch[1]);
                    const weekTitle = titleMatch[2];

                    // Parse details from subsequent lines
                    let game = "";
                    let activity = "";
                    let objective = "";
                    let lesson = "";

                    let j = i + 1;
                    while (j < lines.length && lines[j].trim().startsWith('*')) {
                        const subLine = lines[j].trim();
                        // Stop if we hit the next week
                        if (subLine.startsWith('* **Week')) break;

                        if (subLine.includes('**Game:**')) game = subLine.split('**Game:**')[1].trim();
                        if (subLine.includes('**Activity:**')) activity = subLine.split('**Activity:**')[1].trim();
                        if (subLine.includes('**Objective:**')) objective = subLine.split('**Objective:**')[1].trim();
                        if (subLine.includes('**Historian Lesson:**')) lesson = subLine.split('**Historian Lesson:**')[1].trim();
                        j++;
                    }

                    // Create Game if not exists
                    let gameId = null;
                    if (game) {
                        // Simple cleanup of game title (remove platform info in parens if needed, but keeping it simple for now)
                        // e.g. *Pac-Man* (Retro Handheld/Arcade) -> Pac-Man
                        const cleanGameTitle = game.replace(/\*|_/g, '').split('(')[0].trim();

                        const dbGame = await prisma.game.upsert({
                            where: { title: cleanGameTitle },
                            update: {},
                            create: {
                                title: cleanGameTitle,
                                description: game // Store full string as description for now
                            }
                        });
                        gameId = dbGame.id;
                    }

                    await prisma.week.create({
                        data: {
                            blockId: currentBlockId,
                            weekNumber: weekNum,
                            title: weekTitle,
                            gameId: gameId,
                            activity: activity,
                            objective: objective,
                            historianLesson: lesson
                        }
                    });
                    console.log(`Created Week ${weekNum}: ${weekTitle}`);
                }
            }
        }
    }

    // --- 2. Seed Side Quests ---
    const sideQuestPath = path.join(process.cwd(), 'content', 'sidequests.md');
    if (fs.existsSync(sideQuestPath)) {
        const content = fs.readFileSync(sideQuestPath, 'utf-8');
        const lines = content.split('\n');
        let currentType = "LOCAL"; // Default

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.includes('Local Quests')) currentType = "LOCAL";
            if (line.includes('Regional Quests')) currentType = "REGIONAL";
            if (line.includes('National Quest')) currentType = "NATIONAL";

            // 1. **Geeks Mania Arcade**
            if (/^\d+\.\s\*\*/.test(line)) {
                const title = line.split('**')[1];

                let location = "";
                let mission = "";

                let j = i + 1;
                while (j < lines.length && lines[j].trim().startsWith('*')) {
                    const subLine = lines[j].trim();
                    if (subLine.includes('**Location:**')) location = subLine.split('**Location:**')[1].trim();
                    if (subLine.includes('**Mission:**')) mission = subLine.split('**Mission:**')[1].trim();
                    j++;
                }

                await prisma.sideQuest.create({
                    data: {
                        title,
                        location,
                        mission,
                        type: currentType
                    }
                });
                console.log(`Created Quest: ${title}`);
            }
        }
    }

    // --- 3. Seed Readlist ---
    const readlistPath = path.join(process.cwd(), 'content', 'readlist.md');
    if (fs.existsSync(readlistPath)) {
        const content = fs.readFileSync(readlistPath, 'utf-8');
        const lines = content.split('\n');
        let currentAudience = "DAD";

        for (const line of lines) {
            if (line.includes('For the Historian')) currentAudience = "DAD";
            if (line.includes('For the Apprentice')) currentAudience = "SON";

            // * **Book:** *Blood, Sweat, and Pixels*
            if (line.trim().startsWith('* **')) {
                const parts = line.split('**');
                if (parts.length >= 3) {
                    const typeRaw = parts[1].replace(':', '').trim(); // Book, YouTube Channel
                    const rest = parts[2]; // *Blood, Sweat...* by Jason...

                    let type = "BOOK";
                    if (typeRaw.includes('YouTube')) type = "VIDEO";
                    if (typeRaw.includes('TV')) type = "TV";

                    await prisma.resource.create({
                        data: {
                            title: rest.trim(),
                            type: type,
                            audience: currentAudience,
                            url: null // Would need regex to extract URL
                        }
                    });
                    console.log(`Created Resource: ${rest.trim()}`);
                }
            }
        }
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
