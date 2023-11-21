import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import * as React from 'react';
import PropTypes from "prop-types"

const MainLayout = (props: any) => {
    return (
        <React.Fragment>
        <div>
            <MainHeader />
            <div style={{ display: 'flex' }}>
                    {props.children}
            </div>
            <MainFooter />
        </div>
            </React.Fragment>
    );
};

MainLayout.propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
}

export default MainLayout;
