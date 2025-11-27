import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { prisma } from '@/lib/db';
import WeekTracker from '@/components/WeekTracker';

export const dynamic = 'force-dynamic';

async function getCurriculum() {
    const blocks = await prisma.block.findMany({
        orderBy: { order: 'asc' },
        include: {
            weeks: {
                orderBy: { weekNumber: 'asc' },
                include: { game: true }
            }
        }
    });
    return blocks;
}

export default async function CurriculumPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
    const blocks = await getCurriculum();
    const { week: targetWeekId } = await searchParams;

    // Find which block contains the target week to auto-expand
    let defaultExpandedBlockId = blocks[0]?.id;
    if (targetWeekId) {
        const foundBlock = blocks.find((b: any) => b.weeks.some((w: any) => w.id === targetWeekId));
        if (foundBlock) {
            defaultExpandedBlockId = foundBlock.id;
        }
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Curriculum
            </Typography>

            {blocks.map((block: any) => (
                <Accordion key={block.id} defaultExpanded={block.id === defaultExpandedBlockId} sx={{ mb: 2, bgcolor: 'background.paper' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box>
                            <Typography variant="h6">{block.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{block.description}</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <List>
                            {block.weeks.map((week: any) => (
                                <Box key={week.id}>
                                    <ListItem disablePadding divider sx={{ display: 'block' }}>
                                        <Link href={`/curriculum?week=${week.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItemButton selected={week.id === targetWeekId}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={week.game?.coverUrl}
                                                        alt={week.game?.title || "Game"}
                                                        sx={{
                                                            bgcolor: week.isCompleted ? 'secondary.main' : 'grey.700',
                                                            border: week.isCompleted ? '2px solid #00e676' : 'none'
                                                        }}
                                                    >
                                                        {!week.game?.coverUrl && (week.isCompleted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Week ${week.weekNumber}: ${week.game?.title || week.title}`}
                                                    secondary={week.title !== (week.game?.title) ? week.title : null}
                                                />
                                            </ListItemButton>
                                        </Link>
                                        {week.id === targetWeekId && (
                                            <Box sx={{ p: 2, bgcolor: 'action.hover', pl: { xs: 2, sm: 9 } }}>
                                                <Typography variant="body2" gutterBottom><strong>Activity:</strong> {week.activity}</Typography>
                                                <Typography variant="body2" gutterBottom><strong>Objective:</strong> {week.objective}</Typography>
                                                <Typography variant="body2" gutterBottom><strong>Historian Lesson:</strong> {week.historianLesson}</Typography>

                                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                                    <Link href={`/curriculum/${week.id}/manual`} style={{ textDecoration: 'none' }}>
                                                        <Button variant="contained" color="secondary" size="small">
                                                            📖 Read Historian's Manual
                                                        </Button>
                                                    </Link>
                                                </Box>

                                                <WeekTracker
                                                    weekId={week.id}
                                                    isCompleted={week.isCompleted}
                                                    highScore={week.highScore}
                                                    notes={week.notes}
                                                />
                                            </Box>
                                        )}
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
