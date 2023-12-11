import TarotHeader from './TarotHeader';
import TarotFooter from './TarotFooter';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import React from 'react';

interface MainLayoutProps extends React.PropsWithChildren<{}> {
    location?: any; // Add any other props you expect
}

const TarotLayout: React.FC<MainLayoutProps> = (props) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <TarotHeader />
            <Box component="main" sx={{ flexGrow: 1 }}>
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
