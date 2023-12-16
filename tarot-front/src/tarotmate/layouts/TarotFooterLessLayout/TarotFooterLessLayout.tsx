// TarotFooterLessLayout.js
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material';
import TarotFooterLessHeader from './TarotFooterLessHeader';
import styles from './TarotFooterLessLayout.module.css';
import TarotFooterLessFooter from "./TarotFooterLessFooter";

const theme = createTheme({
    typography: {
        fontFamily: ['MyCustomFont', 'Arial', 'sans-serif'].join(','),
    },
});

const TarotFooterLessLayout = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <div className={styles.pageContainer}>
                <TarotFooterLessHeader />
                <main className={styles.mainContent}>
                    {children}
                </main>
                <TarotFooterLessFooter />
            </div>
         </ThemeProvider>
    );
};

TarotFooterLessLayout.propTypes = {
    children: PropTypes.node,
};

export default TarotFooterLessLayout;