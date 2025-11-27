import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getQuests() {
    return await prisma.sideQuest.findMany({
        orderBy: { title: 'asc' }
    });
}

export default async function QuestsPage() {
    const quests = await getQuests();

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Side Quests
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Field trips and extra credit missions!
            </Typography>

            <Grid container spacing={2}>
                {quests.map((quest: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quest.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            {quest.isCompleted && (
                                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                    <CheckCircleIcon color="success" />
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {quest.title}
                                </Typography>
                                <Chip
                                    label={quest.type}
                                    size="small"
                                    color={quest.type === 'LOCAL' ? 'info' : quest.type === 'REGIONAL' ? 'warning' : 'error'}
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Location:</strong> {quest.location}
                                </Typography>
                                <Typography variant="body2">
                                    {quest.mission}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
