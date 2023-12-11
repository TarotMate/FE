import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

function SocialLinks() {
    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item>
                <IconButton aria-label="Facebook" color="inherit">
                    <FacebookIcon />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton aria-label="Instagram" color="inherit">
                    <InstagramIcon />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton aria-label="Twitter" color="inherit">
                    <TwitterIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="/about">
                TarotMate
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const defaultTheme = createTheme();

export default function TarotFooter() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '10vh',
                }}
            >
                <CssBaseline />
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        mt: 'auto',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography variant="body1" align="center">
                            tarotas
                        </Typography>
                        <SocialLinks />
                        <Typography variant="body2" sx={{ mt: 2 }} align="center">
                            Contact us: info@아직테스트
                        </Typography>
                        <Copyright />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
