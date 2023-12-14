import TarotHeader from './TarotHeader';
import TarotFooter from './TarotFooter';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface MainLayoutProps {
    children?: React.ReactNode;
    location?: any; // Add any other props you expect
}

// MUI 테마 생성
const theme = createTheme({
    typography: {
        fontFamily: [
            'MyCustomFont',
            'Arial',
            'sans-serif'
        ].join(','),
    },
});


const TarotLayout: React.FC<MainLayoutProps> = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Full viewport height
        }}>
            <TarotHeader />
            <Box component="main" sx={{
                flexGrow: 1, // Allows this box to grow and fill available space
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Spread out children
            }}>
                {props.children}
            </Box>
            <TarotFooter />
        </Box>
        </ThemeProvider>

    );
};

TarotLayout.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
}

export default TarotLayout;
