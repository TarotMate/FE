import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import React from 'react';

interface MainLayoutProps extends React.PropsWithChildren<{}> {
    location?: any; // Add any other props you expect
}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <MainHeader />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {props.children}
            </Box>
            <MainFooter />
        </Box>
    );
};


MainLayout.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
}

export default MainLayout;
