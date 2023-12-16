// TarotFooterLessLayout.js
import { ThemeProvider, createTheme } from '@mui/material';
import TarotFooterLessHeader from './TarotFooterLessHeader';
import styles from './TarotFooterLessLayout.module.css';
import TarotFooterLessFooter from "./TarotFooterLessFooter";
import {FC, ReactNode} from "react";

const theme = createTheme({
    typography: {
        fontFamily: ['MyCustomFont', 'Arial', 'sans-serif'].join(','),
    },
});

interface TarotFooterLessLayoutProps {
    children?: ReactNode;
}

const TarotFooterLessLayout: FC<TarotFooterLessLayoutProps> = ({ children }) => {
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


export default TarotFooterLessLayout;