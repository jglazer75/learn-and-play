import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getUser() {
    let user = await prisma.user.findFirst({
        where: { role: 'LEARNER' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Player 1",
                role: "LEARNER",
                xp: 0,
                level: 1,
            }
        });
    }
    return user;
}

async function getNextMission() {
    const nextWeek = await prisma.week.findFirst({
        where: { isCompleted: false },
        orderBy: { weekNumber: 'asc' },
        include: { game: true }
    });
    return nextWeek;
}

async function getStats() {
    const activeQuests = await prisma.sideQuest.count({ where: { isCompleted: false } });
    // Badges logic to be implemented, placeholder for now
    const earnedBadges = 0;
    return { activeQuests, earnedBadges };
}

export default async function Home() {
    const user = await getUser();
    const nextMission = await getNextMission();
    const stats = await getStats();

    // Calculate XP for next level (simple formula: level * 100)
    const nextLevelXp = user.level * 100;

    return (
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: '"Press Start 2P", cursive', color: 'secondary.main', fontSize: '1.5rem' }}>
                    PLAYER 1 & PLAYER 2
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    CHRONICLES
                </Typography>
            </Box>

            {/* User Stats */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6200EA 0%, #3700B3 100%)' }}>
                <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid size={8}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {user.name}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Level {user.level} Pilot
                            </Typography>
                        </Grid>
                        <Grid size={4} sx={{ textAlign: 'right' }}>
                            <Chip label={`0 Day Streak`} color="secondary" size="small" />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">XP</Typography>
                            <Typography variant="caption">{user.xp} / {nextLevelXp}</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={(user.xp / nextLevelXp) * 100}
                            color="secondary"
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* Next Mission */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Next Mission
            </Typography>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {nextMission ? (
                        <>
                            <Typography color="secondary" gutterBottom variant="overline">
                                Week {nextMission.weekNumber}
                            </Typography>
                            <Typography variant="h5" component="div" gutterBottom>
                                {nextMission.game?.title || nextMission.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {nextMission.objective}
                            </Typography>
                            <Link href={`/curriculum?week=${nextMission.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Start Mission
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Typography variant="body1">All missions completed! Great job!</Typography>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Link href="/quests" style={{ textDecoration: 'none' }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">Quest Log</Typography>
                                <Typography variant="body2" color="text.secondary">{stats.activeQuests} Active</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
                <Grid size={6}>
                    <Link href="/badges" style={{ textDecoration: 'none' }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">Badges</Typography>
                                <Typography variant="body2" color="text.secondary">{stats.earnedBadges} Earned</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
}
