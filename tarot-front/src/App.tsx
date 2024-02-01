import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import TarotPage from './pages/TarotPage/TarotPage';
import TarotDoPage from "./pages/tarotDoPage/tarotDoPage";
import TarotDoResultPage from "./pages/tarotDoPage/TarotDoResultPage";


const App = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<TarotPage />} />
                    <Route path="/tarot" element={<TarotDoPage />} />
                    <Route path="/tarot/result" element={<TarotDoResultPage />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;
