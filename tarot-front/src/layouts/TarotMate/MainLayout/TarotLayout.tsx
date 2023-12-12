import TarotHeader from './TarotHeader';
import TarotFooter from './TarotFooter';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import React from 'react';

interface MainLayoutProps extends React.PropsWithChildren<Record<string, unknown>> {
    location?: Location;
}

const TarotLayout: React.FC<MainLayoutProps> = (props) => {
    return (
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
    );
};

TarotLayout.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
}

export default TarotLayout;
