'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateWeekProgress(weekId: string, isCompleted: boolean, highScore: string, notes: string) {
    await prisma.week.update({
        where: { id: weekId },
        data: {
            isCompleted,
            highScore,
            notes
        }
    });
    revalidatePath('/curriculum');
    revalidatePath('/'); // Update dashboard too
}

export async function saveSettings(settings: { dataSource: string, igdbClientId: string, igdbClientSecret: string, geminiApiKey: string }) {
    await prisma.appSettings.upsert({
        where: { id: 'settings' },
        update: {
            dataSource: settings.dataSource,
            igdbClientId: settings.igdbClientId,
            igdbClientSecret: settings.igdbClientSecret,
            geminiApiKey: settings.geminiApiKey
        },
        create: {
            id: 'settings',
            dataSource: settings.dataSource,
            igdbClientId: settings.igdbClientId,
            igdbClientSecret: settings.igdbClientSecret,
            geminiApiKey: settings.geminiApiKey
        }
    });
    revalidatePath('/settings');
}

export async function syncGameData() {
    const settings = await prisma.appSettings.findUnique({ where: { id: 'settings' } });
    const dataSource = settings?.dataSource || 'WIKIPEDIA';

    const games = await prisma.game.findMany({
        where: { coverUrl: null } // Only update games without covers
    });

    console.log(`Syncing ${games.length} games using ${dataSource}...`);

    for (const game of games) {
        try {
            let coverUrl = null;
            let description = null;
            let releaseDate = null;

            if (dataSource === 'WIKIPEDIA') {
                // Basic Wikipedia Summary API
                const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(game.title)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.thumbnail && data.thumbnail.source) {
                        coverUrl = data.thumbnail.source;
                    }
                    if (data.extract) {
                        description = data.extract;
                    }
                }
            } else if (dataSource === 'IGDB' && settings?.igdbClientId && settings?.igdbClientSecret) {
                // 1. Get Access Token
                const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${settings.igdbClientId}&client_secret=${settings.igdbClientSecret}&grant_type=client_credentials`, {
                    method: 'POST'
                });

                if (tokenResponse.ok) {
                    const tokenData = await tokenResponse.json();
                    const accessToken = tokenData.access_token;

                    // 2. Search Game
                    const gameResponse = await fetch('https://api.igdb.com/v4/games', {
                        method: 'POST',
                        headers: {
                            'Client-ID': settings.igdbClientId,
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: `fields name, cover.url, summary, first_release_date; search "${game.title}"; limit 1;`
                    });

                    if (gameResponse.ok) {
                        const gamesData = await gameResponse.json();
                        if (gamesData.length > 0) {
                            const igdbGame = gamesData[0];
                            if (igdbGame.cover && igdbGame.cover.url) {
                                coverUrl = igdbGame.cover.url.replace('t_thumb', 't_cover_big').replace('//', 'https://');
                            }
                            if (igdbGame.summary) {
                                description = igdbGame.summary;
                            }
                            if (igdbGame.first_release_date) {
                                releaseDate = new Date(igdbGame.first_release_date * 1000);
                            }
                        }
                    }
                } else {
                    console.error('Failed to get IGDB token');
                }
            }

            if (coverUrl || description || releaseDate) {
                await prisma.game.update({
                    where: { id: game.id },
                    data: {
                        coverUrl: coverUrl || undefined,
                        description: description || undefined,
                        releaseDate: releaseDate || undefined
                    }
                });
                console.log(`Updated ${game.title}`);
            }
        } catch (error) {
            console.error(`Failed to sync game ${game.title}:`, error);
        }
    }

    revalidatePath('/games');
    revalidatePath('/curriculum');
}

export async function getOrCreateLessonContent(weekId: string) {
    const week = await prisma.week.findUnique({
        where: { id: weekId },
        include: { game: true, lessonContent: true }
    });

    if (!week) throw new Error("Week not found");

    // Return cached content if it exists
    if (week.lessonContent) {
        return week.lessonContent.content;
    }

    // Generate new content
    const { generateLessonContent } = await import('@/lib/ai');
    const content = await generateLessonContent(
        week.title,
        week.game?.title || "Unknown Game",
        week.objective,
        week.activity
    );

    // Save to DB
    await prisma.lessonContent.create({
        data: {
            weekId: week.id,
            content: content
        }
    });

    return content;
}

export async function regenerateLessonContent(weekId: string) {
    // Delete existing content
    await prisma.lessonContent.deleteMany({
        where: { weekId: weekId }
    });

    // Generate new content
    return getOrCreateLessonContent(weekId);
}
