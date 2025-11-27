import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getGames() {
    return await prisma.game.findMany({
        orderBy: { title: 'asc' }
    });
}

export default async function GamesPage() {
    const games = await getGames();

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Game Library
            </Typography>

            <TextField
                fullWidth
                placeholder="Search games..."
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Grid container spacing={2}>
                {games.map((game: any) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={game.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={game.coverUrl || "https://placehold.co/600x400?text=No+Cover"}
                                alt={game.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" component="div" sx={{ lineHeight: 1.2, mb: 1, fontWeight: 'bold' }}>
                                    {game.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {game.platform || 'Unknown Platform'} • {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
