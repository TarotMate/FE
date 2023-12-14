import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const defaultTheme = createTheme();
export default function TarotFooter() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'grey',
                    zIndex: -1000,
                    minHeight: {
                        xs: '5vh', // smaller height on extra-small devices
                        sm: '10vh', // default height on small devices and up
                    },
                }}
            >
                <CssBaseline />
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        mt: 'auto',

                    }}
                >
                    <Container maxWidth="sm">
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
