import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function MainHeader() {
    return (
        <React.Fragment>
            <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography
                    component="h2"
                    variant="h5"
                    color="inherit"
                    align="center"
                    noWrap
                    sx={{ flex: 1 }}
                >
                    타로메이트
                </Typography>
            </Toolbar>
        </React.Fragment>
    );
}

export default MainHeader;