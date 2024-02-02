import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {cardBackImage} from "../../data/constants";

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
        <div className="container mx-auto px-4 py-8 bg-[#FFF8F0]">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#333333]">타로 결과</h1>
            {fortune.map((card, index) => (
                <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden md:flex md:h-auto">
                    {/* 이미지 컨테이너에 고정된 비율을 적용하고, 이미지가 컨테이너를 꽉 채우도록 설정 */}
                    <div className="md:flex-shrink-0 md:w-48 relative">
                        <img src={card.cardImage || selectedCards.find(sc => sc.name === card.cardName)?.image || cardBackImage} alt={card.cardName} className="absolute inset-0 w-full h-full object-scale-down rounded-l-lg" />
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-[#333333] mb-2">당신이 뽑은 카드이름은 {card.cardName} 입니다.</h2>
                            <p className="text-md text-[#555555] mb-4">타로 점 : {card.cardDescription}</p>
                            <p className="text-sm text-[#666666] mb-2">요약: {card.shortComment}</p>
                            <p className="text-sm text-[#666666]">내용: {card.detail}</p>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center mb-4">
                                <span className="text-lg font-medium mr-2">평점:</span>
                                <span className="text-yellow-500">{Array(card.starRating).fill('★').join('')}</span>
                                <span className="text-gray-300">{Array(5 - card.starRating).fill('★').join('')}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="text-lg font-medium mr-2 mb-2">키워드:</span>
                                {card.hashTags.map((tag, idx) => (
                                    <span key={idx} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2 mb-2">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>





    );
};

export default TarotDoResultPage;
