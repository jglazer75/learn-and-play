import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getBadges() {
    // Logic: A badge is earned for each completed Block.
    // We can also add badges for streaks, etc. later.
    const blocks = await prisma.block.findMany({
        include: {
            weeks: true
        }
    });

    const badges = blocks.map(block => {
        const isCompleted = block.weeks.every(w => w.isCompleted);
        return {
            id: block.id,
            title: `${block.title} Master`,
            description: `Complete all weeks in Block ${block.order}`,
            isEarned: isCompleted,
            icon: <EmojiEventsIcon />
        };
    });

    return badges;
}

export default async function BadgesPage() {
    const badges = await getBadges();
    const earnedCount = badges.filter(b => b.isEarned).length;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Badges
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Earn badges by completing blocks and mastering skills!
            </Typography>

            <Typography variant="h6" gutterBottom>
                Collection ({earnedCount}/{badges.length})
            </Typography>

            <Grid container spacing={2}>
                {badges.map((badge: any) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={badge.id}>
                        <Card sx={{
                            height: '100%',
                            textAlign: 'center',
                            opacity: badge.isEarned ? 1 : 0.6,
                            bgcolor: badge.isEarned ? 'background.paper' : 'action.disabledBackground'
                        }}>
                            <CardContent>
                                <Avatar sx={{
                                    width: 60,
                                    height: 60,
                                    margin: '0 auto',
                                    mb: 2,
                                    bgcolor: badge.isEarned ? 'secondary.main' : 'grey.500'
                                }}>
                                    {badge.isEarned ? badge.icon : <LockIcon />}
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {badge.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {badge.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
