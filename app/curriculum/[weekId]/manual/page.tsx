import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { getOrCreateLessonContent, regenerateLessonContent } from '@/app/actions';
import { prisma } from '@/lib/db';
import MagazineView from '@/components/MagazineView';

export const dynamic = 'force-dynamic';

export default async function ManualPage({ params }: { params: Promise<{ weekId: string }> }) {
    const { weekId } = await params;
    const week = await prisma.week.findUnique({
        where: { id: weekId },
        include: { game: true }
    });

    if (!week) {
        return <Typography>Week not found</Typography>;
    }

    const content = await getOrCreateLessonContent(weekId);

    // Parse Markdown into sections
    const sections = [];
    const rawSections = content.split(/^# /gm); // Split by H1 headers

    // Map specific headers to IDs for layout
    const idMap: Record<string, string> = {
        "The Historian's Context": "context",
        "The Educational Angle": "educational",
        "The Time Machine": "timemachine",
        "Dad Tips": "tips",
        "Further Reading": "reading"
    };

    for (const raw of rawSections) {
        if (!raw.trim()) continue;
        const [titleLine, ...bodyLines] = raw.split('\n');
        const title = titleLine.trim();
        const body = bodyLines.join('\n').trim();

        if (title && body) {
            sections.push({
                title,
                content: body,
                id: idMap[title] || title.toLowerCase().replace(/\s+/g, '-')
            });
        }
    }

    async function handleRegenerate() {
        'use server';
        await regenerateLessonContent(weekId);
    }

    return (
        <Box>
            <Box sx={{ p: 2 }}>
                <Link href={`/curriculum?week=${weekId}`} style={{ textDecoration: 'none' }}>
                    <Button startIcon={<ArrowBackIcon />}>
                        Back to Curriculum
                    </Button>
                </Link>
            </Box>

            <MagazineView
                title={week.game?.title || week.title}
                subtitle={`Week ${week.weekNumber}: ${week.objective}`}
                heroImage={week.game?.coverUrl?.replace('t_thumb', 't_1080p')}
                sections={sections}
                onRegenerate={handleRegenerate}
            />
        </Box>
    );
}
