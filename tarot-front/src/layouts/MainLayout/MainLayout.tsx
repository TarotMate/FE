import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import logo from '../../assets/TarotMate_logo.png';

type MainLayoutProps = {
    children: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <MainHeader logo={logo} onMenuClick={handleMenuClick} />
            <main className="flex-grow" style={{ marginTop: '60px' }}>{children}</main>
            <MainFooter />
        </div>
    );
};

export default MainLayout;
