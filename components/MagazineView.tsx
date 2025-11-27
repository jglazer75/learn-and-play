'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ReactMarkdown from 'react-markdown';
import { useRef } from 'react';

interface Section {
    title: string;
    content: string;
    id: string;
}

interface MagazineViewProps {
    title: string;
    subtitle: string;
    heroImage?: string;
    sections: Section[];
    onRegenerate: () => Promise<void>;
}

export default function MagazineView({ title, subtitle, heroImage, sections, onRegenerate }: MagazineViewProps) {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Helper to render markdown with consistent styling
    const MarkdownRenderer = ({ content }: { content: string }) => (
        <ReactMarkdown
            components={{
                h1: () => null, // We handle titles separately
                h2: ({ node, ...props }) => <Typography variant="h5" gutterBottom sx={{ mt: 2, mb: 1, color: 'primary.main', fontWeight: 'bold' }} {...props} />,
                h3: ({ node, ...props }) => <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }} {...props} />,
                p: ({ node, ...props }) => <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem' }} {...props} />,
                li: ({ node, ...props }) => (
                    <Box component="li" sx={{ mb: 1, typography: 'body1' }}>
                        <span {...props} />
                    </Box>
                ),
                strong: ({ node, ...props }) => <Box component="strong" sx={{ color: 'secondary.main', fontWeight: 'bold' }} {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    );

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
            {/* Hero Section */}
            <Box sx={{ position: 'relative', mb: 6, borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
                {heroImage && (
                    <Box
                        component="img"
                        src={heroImage}
                        alt={title}
                        sx={{
                            width: '100%',
                            height: { xs: 300, md: 500 },
                            objectFit: 'cover',
                            filter: 'brightness(0.6)'
                        }}
                    />
                )}
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    p: 4,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                }}>
                    <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 3, fontWeight: 'bold' }}>
                        THE HISTORIAN'S MANUAL
                    </Typography>
                    <Typography variant="h2" component="h1" sx={{
                        fontFamily: '"Press Start 2P", cursive',
                        color: 'white',
                        fontSize: { xs: '1.5rem', md: '3rem' },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {title}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            {/* Navigation Bar */}
            <Box sx={{
                position: 'sticky',
                top: 16,
                zIndex: 100,
                bgcolor: 'background.paper',
                borderRadius: 99,
                p: 1,
                mb: 6,
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                flexWrap: 'wrap',
                boxShadow: 4,
                border: 1,
                borderColor: 'divider'
            }}>
                {sections.map((section) => (
                    <Chip
                        key={section.id}
                        label={section.title}
                        onClick={() => scrollToSection(section.id)}
                        clickable
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                ))}
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={async () => {
                        if (confirm('Are you sure you want to regenerate this manual? It will replace the current content.')) {
                            await onRegenerate();
                            window.location.reload(); // Force reload to fetch new content
                        }
                    }}
                    sx={{ borderRadius: 99 }}
                >
                    Regenerate
                </Button>
            </Box>

            {/* Content Grid */}
            <Grid container spacing={4}>
                {/* Main Column */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {sections.filter(s => ['context', 'educational'].includes(s.id)).map((section) => (
                        <Box key={section.id} id={section.id} sx={{ mb: 6 }}>
                            <Typography variant="h4" gutterBottom sx={{
                                color: 'primary.main',
                                borderBottom: 2,
                                borderColor: 'primary.main',
                                pb: 1,
                                mb: 3,
                                fontFamily: 'serif',
                                fontWeight: 'bold'
                            }}>
                                {section.title}
                            </Typography>
                            <MarkdownRenderer content={section.content} />
                        </Box>
                    ))}
                </Grid>

                {/* Sidebar Column */}
                <Grid size={{ xs: 12, md: 4 }}>
                    {sections.filter(s => !['context', 'educational'].includes(s.id)).map((section) => (
                        <Card key={section.id} id={section.id} sx={{ mb: 4, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{
                                    color: 'secondary.main',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    fontWeight: 'bold',
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    pb: 1,
                                    mb: 2
                                }}>
                                    {section.title}
                                </Typography>
                                <MarkdownRenderer content={section.content} />
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
}
