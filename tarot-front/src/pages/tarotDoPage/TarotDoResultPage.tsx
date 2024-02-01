import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

// 타입 정의
type SelectedCard = {
    name: string;
    image: string; // 이전 예제에서는 string | null이었지만, 여기서는 항상 이미지 URL을 기대합니다.
};

type Fortune = {
    cardDescription: string;
    cardName: string;
    starRating: number;
    hashTags: string[];
    shortComment: string;
    detail: string;
    cardImage: string | null; // 카드 이미지가 없을 수도 있으므로 null 가능성 포함
};

type TarotResult = {
    success: boolean;
    response: {
        fortune: Fortune[];
    };
    error: any;
};

const TarotDoResultPage: React.FC = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { resultData, selectedCards } = location.state as { resultData: TarotResult; selectedCards: SelectedCard[] };

    useEffect(() => {
        if (!resultData) {
            navigate('/'); // 또는 사용자를 안내하는 페이지로 리다이렉트
        }
    }, [navigate, resultData]);

    // resultData가 유효한지 확인하고, 그렇지 않다면 로딩 중이거나 에러 메시지를 표시
    if (!resultData || !resultData.response) {
        return <div>결과를 불러오는 중이거나 결과 데이터가 없습니다.</div>;
    }

    const { fortune } = resultData.response;




    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">타로 결과</h1>
            {fortune.map((card, index) => (
                <div key={index} className="mb-4 p-4 rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-semibold">{card.cardName} - {card.cardDescription}</h2>
                    <p className="text-sm">{card.shortComment}</p>
                    <div className="text-gray-600">
                        {card.hashTags.map((tag, idx) => (
                            <span key={idx} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#{tag}</span>
                        ))}
                    </div>
                    <p className="mt-2">{card.detail}</p>
                    {/* 이미지가 있을 경우에만 표시, 없으면 selectedCards에서 찾아 대체 이미지 사용 */}
                    <img src={card.cardImage || selectedCards.find(sc => sc.name === card.cardName)?.image || cardBackImage} alt={card.cardName} className="mt-2 max-w-xs" />
                    <div className="mt-2">총점: {'★'.repeat(card.starRating)}</div>
                </div>
            ))}
        </div>
    );
};

export default TarotDoResultPage;
