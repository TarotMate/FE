import React, { useState } from 'react';

const tarotCards = [
    { number: 0, name: "광대", image: "../images/major_arcana_fool.png" },
    { number: 1, name: "마법사", image: "../images/major_arcana_magician.png" },
    { number: 2, name: "여사제", image: "../images/major_arcana_priestess.png" },
    { number: 3, name: "여황제", image: "../images/major_arcana_empress.png" },
    { number: 4, name: "황제", image: "../images/major_arcana_emperor.png" },
    { number: 5, name: "교황", image: "../images/major_arcana_hierophant.png" },
    { number: 6, name: "연인들", image: "../images/major_arcana_lovers.png" },
    { number: 7, name: "전차", image: "../images/major_arcana_chariot.png" },
    { number: 8, name: "힘", image: "../images/major_arcana_strength.png" },
    { number: 9, name: "은둔자", image: "../images/major_arcana_hermit.png" },
    { number: 10, name: "운명의 수레바퀴", image: "../images/major_arcana_fortune.png" },
    { number: 11, name: "정의", image: "../images/major_arcana_justice.png" },
    { number: 12, name: "매달린 사람", image: "../images/major_arcana_hanged.png" },
    { number: 13, name: "죽음", image: "../images/major_arcana_death.png" },
    { number: 14, name: "절제", image: "../images/major_arcana_temperance.png" },
    { number: 15, name: "악마", image: "../images/major_arcana_devil.png" },
    { number: 16, name: "탑", image: "../images/major_arcana_tower.png" },
    { number: 17, name: "별", image: "../images/major_arcana_star.png" },
    { number: 18, name: "달", image: "../images/major_arcana_moon.png" },
    { number: 19, name: "태양", image: "../images/major_arcana_sun.png" },
    { number: 20, name: "심판", image: "../images/major_arcana_judgement.png" },
    { number: 21, name: "세계", image: "../images/major_arcana_world.png" }
];

const TarotReadingSection: React.FC = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
        }
    };

    const handleNextCard = () => {
        if (currentCardIndex < tarotCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    return (
        <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800">오늘의 타로 읽기: 아르카나 카드</h2>
            <div className="flex flex-col items-center justify-center mt-4">
                <img
                    src={tarotCards[currentCardIndex].image}
                    alt={tarotCards[currentCardIndex].name}
                    className="w-64 h-64 object-contain rounded-lg border-none mb-4"
                />
                <p className="text-center text-lg font-semibold text-gray-700">{tarotCards[currentCardIndex].name}</p>
            </div>
            <div className="tarot-card-controller flex justify-center space-x-4 mt-4">
                <button onClick={handlePrevCard} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    이전 카드
                </button>
                <button onClick={handleNextCard} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    다음 카드
                </button>
            </div>
        </div>

    );
};

export default TarotReadingSection;