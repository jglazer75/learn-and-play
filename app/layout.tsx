import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import SimpleBottomNavigation from "@/components/BottomNav";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
    title: "Learn.Play",
    description: "Player 1 & Player 2 Chronicles",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'background.default' }}>
                        {children}
                    </Box>
                    <SimpleBottomNavigation />
                </ThemeRegistry>
            </body>
        </html>
    );
}
