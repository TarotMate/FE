import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const LuckyNumbersSection: React.FC = () => {
    const navigate = useNavigate(); // React Router v6 사용
    const [numbers, setNumbers] = useState<number[]>([]);
    const [amount, setAmount] = useState<number>(1);
    const [minValue, setMinValue] = useState<number>(1);
    const [maxValue, setMaxValue] = useState<number>(45);
    const [error, setError] = useState<string>('');

    const generateNumbers = () => {
        if (maxValue - minValue + 1 < amount) {
            setError('선택 가능한 숫자의 범위가 요청된 개수보다 적습니다.');
            return;
        }

        setError('');
        let generatedNumbers: number[] = [];
        while (generatedNumbers.length < amount) {
            const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
            if (!generatedNumbers.includes(randomNumber)) {
                generatedNumbers.push(randomNumber);
            }
        }
        generatedNumbers = generatedNumbers.sort((a, b) => a - b);
        setNumbers(generatedNumbers);
    };

    useEffect(() => {
        generateNumbers();
    }, [amount, minValue, maxValue]);

    const navigateToRandomNumberCard = () => navigate('/random-number-card'); // 이동 함수


    return (
        <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6" onClick={navigateToRandomNumberCard} style={{ cursor: 'pointer' }}>랜덤 숫자 카드</h2>
            {error && <p className="text-center text-red-600">{error}</p>}
            <div className="flex justify-around mb-4 p-4 bg-gradient-to-r from-blue-700 to-blue-300 text-white rounded-lg shadow">
                <div className="flex flex-col items-center">
                    <label htmlFor="number-amount" className="mb-2">숫자 개수</label>
                    <select
                        id="number-amount"
                        className="text-gray-800 bg-white rounded px-3 py-2 outline-none"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    >
                        {[...Array(10).keys()].map(n => (
                            <option key={n+1} value={n+1}>{n+1}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="min-value" className="mb-2">최소값</label>
                    <input
                        id="min-value"
                        type="range"
                        className="w-full cursor-pointer"
                        value={minValue}
                        onChange={(e) => setMinValue(Number(e.target.value))}
                        min="1"
                        max={maxValue}
                    />
                    <span>{minValue}</span>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="max-value" className="mb-2">최대값</label>
                    <input
                        id="max-value"
                        type="range"
                        className="w-full cursor-pointer"
                        value={maxValue}
                        onChange={(e) => setMaxValue(Number(e.target.value))}
                        min={minValue}
                        max="100"
                    />
                    <span>{maxValue}</span>
                </div>
            </div>
            <div className="flex flex-wrap justify-center mt-4 gap-4">
                {numbers.map((number, index) => (
                    <div key={index} className="w-24 h-32 bg-gradient-to-br from-blue-700 to-blue-300 text-white flex flex-col items-center justify-center rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                        <span className="text-lg font-bold">숫자 카드</span>
                        <span className="text-3xl font-bold">{number}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-center space-x-4 mt-8">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={generateNumbers}
                >
                    생성하기
                </button>
            </div>
        </div>
    );
};

export default LuckyNumbersSection;
