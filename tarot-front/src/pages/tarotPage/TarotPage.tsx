import React from 'react';
// 필요한 추가 컴포넌트를 임포트
import TarotReadingSection from '../../components/TarotReadingSection';
import TarotMateBanner from "./components/organisms/TarotMateBanner";


const TarotPage: React.FC = () => {
    return (
        <div className="tarot-page">
            <TarotMateBanner />
            {/* 타로 메이트 메인 배너 */}
            <TarotReadingSection />
            {/* 타로 카드 읽기 섹션 */}
        </div>
    );
};

export default TarotPage;
