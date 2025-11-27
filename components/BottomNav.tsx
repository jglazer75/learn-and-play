'use client';

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter, usePathname } from 'next/navigation';

export default function SimpleBottomNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [value, setValue] = React.useState(pathname);

    React.useEffect(() => {
        setValue(pathname);
    }, [pathname]);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    router.push(newValue);
                }}
            >
                <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
                <BottomNavigationAction label="Learn" value="/curriculum" icon={<SchoolIcon />} />
                <BottomNavigationAction label="Games" value="/games" icon={<SportsEsportsIcon />} />
                <BottomNavigationAction label="Quests" value="/quests" icon={<MapIcon />} />
                <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} />
            </BottomNavigation>
        </Paper>
    );
}
