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
    const state = location.state as { resultData?: TarotResult; selectedCards?: SelectedCard[] } | undefined;

    useEffect(() => {
        if (!state || !state.resultData || !state.selectedCards) {
            // 사용자에게 안내 메시지 후 리다이렉션
            setTimeout(() => navigate('/tarot'), 3000); // 3초 후 타로 선택 페이지로 이동
        }
    }, [navigate, state]);

    if (!state || !state.resultData || !state.selectedCards) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#FFF8F0]">
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4 text-[#333333]">안내 메시지</h1>
                        <p className="text-lg text-gray-700">결과를 보려면 먼저 타로를 선택해주세요. 잠시 후 타로 선택 페이지로 이동합니다.</p>
                    </div>
                </div>
            </div>
        );
    }

    const { resultData, selectedCards } = state;

    if (!resultData.response) {
        return <div>결과를 불러오는 중이거나 결과 데이터가 없습니다.</div>;
    }

    const { fortune } = resultData.response;

    return (
        <div className="container mx-auto px-4 py-8 bg-[#FFF8F0]">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#333333]">타로 결과</h1>
            {fortune.map((card, index) => (
                <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden md:flex md:h-auto">
                    {/* 이미지 컨테이너 정렬 조정 */}
                    <div className="flex-shrink-0 w-full md:w-48 h-64 relative mx-auto">
                        <img
                            src={card.cardImage || selectedCards.find(sc => sc.name === card.cardName)?.image || cardBackImage}
                            alt={card.cardName} className="w-full h-full object-contain rounded-l-lg"/>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-[#333333] mb-2">{card.cardName}</h2>
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
