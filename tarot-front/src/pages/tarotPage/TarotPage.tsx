import React from 'react';
// 필요한 추가 컴포넌트를 임포트
import TarotReadingSection from '../../components/TarotReadingSection';
import TarotMateBanner from "./components/organisms/TarotMateBanner";
import LuckyNumbersSection from "../../components/LuckyNumbersSection";


const TarotPage: React.FC = () => {
    return (
        <div className="tarot-page">
            {/* 타로 메이트 메인 배너 */}
            <TarotMateBanner />
            {/* 타로 카드 읽기 섹션 */}
            <TarotReadingSection />
            {/* 럭키 숫자 */}
            <LuckyNumbersSection />
        </div>
    );
};

export default TarotPage;
