import './App.css'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';

import TarotDoPage from "./pages/tarotDoPage/tarotDoPage";
import TarotDoResultPage from "./pages/tarotDoPage/TarotDoResultPage";
import TarotPage from "./pages/tarotPage/TarotPage";
import LuckyNumbers from "./pages/tarotDoPage/LuckyNumbers";
import {useEffect} from "react";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <MainLayout>
                <Routes>
                    <Route path="/" element={<TarotPage />} />
                    <Route path="/tarot" element={<TarotDoPage />} />
                    <Route path="/tarot/result" element={<TarotDoResultPage />} />
                    <Route path="/random-number-card" element={<LuckyNumbers />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;
