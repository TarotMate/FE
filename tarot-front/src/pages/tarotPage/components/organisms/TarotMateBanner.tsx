import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트합니다.

const TarotMateBanner: React.FC = () => {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

    const navigateToTarot = () => navigate('/tarot'); // navigate 함수를 사용하여 /tarot 경로로 이동하는 함수를 정의합니다.

    return (
        <div className="tarot-mate-banner bg-indigo-500 text-white text-center p-12">
            <h1 className="text-4xl font-bold mb-2">타로메이트에 오신 것을 환영합니다!</h1>
            <p className="text-xl mb-4">당신의 운명을 탐험해보세요.</p>
            <button onClick={navigateToTarot} className="py-2 px-4 bg-white text-indigo-500 font-semibold rounded hover:bg-indigo-100 transition duration-300 mb-6">
                탐험 시작하기
            </button>
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-300 leading-relaxed">
                    타로 카드는 심오한 상징과 의미를 담고 있는 고대의 도구로, 자기 성찰과 미래 예측에 널리 사용됩니다.<br />
                    각 카드는 독특한 이미지와 상징을 가지며, 이를 통해 사용자의 질문에 대한 답을 탐색할 수 있습니다.
                </p>
            </div>
        </div>
    );
};

export default TarotMateBanner;
