'use client';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

export default function SettingsPage() {
    const [dataSource, setDataSource] = React.useState('WIKIPEDIA');
    const [igdbClientId, setIgdbClientId] = React.useState('');
    const [igdbClientSecret, setIgdbClientSecret] = React.useState('');

    const handleSave = () => {
        // Save to DB (mock for now)
        alert('Settings saved!');
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Settings
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Data Source</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={dataSource === 'IGDB'}
                                onChange={(e) => setDataSource(e.target.checked ? 'IGDB' : 'WIKIPEDIA')}
                                color="secondary"
                            />
                        }
                        label={dataSource === 'IGDB' ? "Using IGDB (Rich Data)" : "Using Wikipedia (Free Data)"}
                    />

                    {dataSource === 'IGDB' && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="IGDB Client ID"
                                fullWidth
                                margin="normal"
                                value={igdbClientId}
                                onChange={(e) => setIgdbClientId(e.target.value)}
                            />
                            <TextField
                                label="IGDB Client Secret"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={igdbClientSecret}
                                onChange={(e) => setIgdbClientSecret(e.target.value)}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Database Management</Typography>
                    <Button variant="outlined" color="warning" fullWidth sx={{ mb: 2 }}>
                        Re-Seed Database
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                        Warning: This will reset all curriculum data to the defaults from the markdown files.
                    </Typography>
                </CardContent>
            </Card>

            <Button variant="contained" color="primary" fullWidth size="large" onClick={handleSave}>
                Save Settings
            </Button>
        </Box>
    );
}
