import TarotFooterLessHeader from './TarotFooterLessHeader';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TarotFooter from "../TarotLayout/TarotFooter";
import TarotFooterLessFooter from "./TarotFooterLessFooter";

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


const TarotFooterLessLayout: React.FC<MainLayoutProps> = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Full viewport height
        }}>
            <TarotFooterLessHeader />
            <Box component="main" sx={{
                flexGrow: 1, // Allows this box to grow and fill available space
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Spread out children
            }}>
                {props.children}
            </Box>
                <TarotFooterLessFooter />
        </Box>
        </ThemeProvider>

    );
};

TarotFooterLessLayout.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
}

export default TarotFooterLessLayout;
