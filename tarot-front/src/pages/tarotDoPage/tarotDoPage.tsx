import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gptTarotNew } from "../../utils/gptTarot/gptTarotNew";
import LoadingComponent from "../detailPage/components/LoadingComponent";
import {cardBackImage} from "../../data/constants";

interface TarotCard {
    name: string;
    number?: number;
    image?: string;
    description?: string;
}

interface Fortune {
    label: string;
    value: string;
    descriptions: FortuneDescription[]; // 변경된 부분
    activeDescriptionIndex?: number; // 현재 활성화된 설명의 인덱스

}

interface FortuneDescription {
    title: string;
    cardDescriptions: string[];
}

const TarotDoPage = () => {


    const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
    const [fortunes, setFortunes] = useState<Fortune[]>([]);
    const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);



    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedMinor, setSelectedMinor] = useState('');

    const [fetchError, setFetchError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태 추가

    const [buttonLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        // 로딩 시작
        try {
            const url = `${import.meta.env.VITE_TAROT_API_URL}/init`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("서버에서 데이터를 가져오는 데 실패했습니다.");
            const data = await response.json();

            // 데이터 설정
            setTarotCards(data.response.tarotCards as TarotCard[]);
            setFortunes(data.response.fortunes as Fortune[]);


            // 자동으로 첫 번째 대분류 선택
            if (data.response.fortunes.length > 0) {
                const firstMajor = data.response.fortunes[0].label;
                setSelectedMajor(firstMajor);

                // 첫 번째 대분류의 첫 번째 중분류 선택
                const firstMinor = data.response.fortunes[0].descriptions.length > 0 ? data.response.fortunes[0].descriptions[0].title : '';
                setSelectedMinor(firstMinor);
            }
        } catch (error) {
            setFetchError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    useEffect(() => { fetchData(); }, []);
    const handleSelectCards = () => {
        const selectedDescriptions = fortunes
            .find(fortune => fortune.label === selectedMajor)?.descriptions
            .find(desc => desc.title === selectedMinor)?.cardDescriptions;

        if (!selectedDescriptions) return;

        // 랜덤으로 타로 카드 선택
        const shuffledCards = tarotCards.sort(() => 0.5 - Math.random());
        const selected = shuffledCards.slice(0, selectedDescriptions.length).map((card, index) => ({
            ...card,
            description: selectedDescriptions[index]
        }));
        setSelectedCards(selected);
    };

    const processTarotRequest = async () => {
        if (selectedCards.length === 0) return;

        setIsLoading(true); // 사용자가 결과 보기를 클릭하면 로딩 시작
        setError(''); // 기존 에러 메시지 초기화

        // selectedCards 배열에서 카드의 번호를 추출하는 로직
        const selectedCardNumbers: number[] = selectedCards.map(card => {
            const foundCard = tarotCards.find(tarotCard => tarotCard.name === card.name);
            return foundCard ? foundCard.number : null;
        }).filter((number): number is number => number !== null) as number[];

        if (selectedCardNumbers.length === 0) {
            console.error("No valid card numbers found.");
            setIsLoading(false); // 유효한 카드 번호가 없으면 로딩 종료
            return;
        }

        // fortunes가 undefined가 아니라면 선택적 체이닝과 논리 연산자를 사용하여 activeDescription 값을 설정
        const activeDescription = fortunes
            ?.find(fortune => fortune.label === selectedMajor)?.descriptions
            .find(desc => desc.title === selectedMinor)?.cardDescriptions || []; // 찾고자 하는 값이 없을 경우 기본값으로 []

        // tarotRequest 객체에 activeDescription 사용
        const tarotRequest = {
            fortuneType: selectedMajor,
            theme: selectedMinor,
            selectedCardNumbers: selectedCardNumbers,
            cardDescriptions: activeDescription
        };



        try {
            const result = await gptTarotNew(tarotRequest);

            navigate('/tarot/result', {
                state: {
                    resultData: result,
                    selectedCards: selectedCards.map(card => ({ name: card.name, image: card.image || cardBackImage })) // card.image가 없을 경우 대체 이미지 사용
                }
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false); // 요청이 완료되면 로딩 종료
        }
    };
    // 초기화 함수
    const resetSelections = () => {
        setSelectedCards([]);
        // 필요하다면, 여기에 추가적인 상태 초기화 로직을 추가하세요.
    };
    return (
        <div className="container mx-auto px-4 py-8 bg-[#FFF8F0]">
            {isLoading && <LoadingComponent/>}
            {fetchError && <p className="text-red-500">{fetchError}</p>}


            {/* 카드 표시 영역 스타일 조정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCards.length > 0 ? selectedCards.map((card, index) => (
                    <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="flex-shrink-0 w-full h-64 relative mx-auto">
                            <img src={card.image || cardBackImage} alt={card.name}
                                 className="w-full h-full object-contain rounded-l-lg"/>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#333333] mb-2">{card.name}</h2>
                            <p className="text-md text-[#555555]">{card.description}</p>
                        </div>
                    </div>
                )) : (
                    <>
                        {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.find(desc => desc.title === selectedMinor)?.cardDescriptions.map((desc, index) => (
                            <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="flex-shrink-0 w-full h-64 relative mx-auto">
                                    <img src={cardBackImage} alt="Card Back"
                                         className="w-full h-full object-contain rounded-l-lg"/>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-[#333333] mb-2">{index + 1}번째 카드</h2>
                                    <p className="text-md text-[#555555]">{desc} 설명을 나타냅니다.</p>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 flex-grow">
                    <select
                        className="flex-grow p-2 border border-gray-300 rounded text-gray-700 bg-white shadow hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={selectedMajor}
                        onChange={(e) => {
                            setSelectedMajor(e.target.value);
                            setSelectedMinor('');
                        }}
                    >
                        <option value="">대분류 선택</option>
                        {fortunes.map((fortune, index) => (
                            <option key={index} value={fortune.label}>
                                {fortune.label}
                            </option>
                        ))}
                    </select>
                    <select
                        className="flex-grow p-2 border border-gray-300 rounded text-gray-700 bg-white shadow hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={selectedMinor}
                        onChange={(e) => setSelectedMinor(e.target.value)}
                        disabled={!selectedMajor}
                    >
                        <option value="">중분류 선택</option>
                        {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.map((desc, index) => (
                            <option key={index} value={desc.title}>
                                {desc.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSelectCards}
                        disabled={!selectedMinor}
                        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition duration-300 ease-in-out shadow hover:shadow-md"
                    >
                        타로 카드 선택하기
                    </button>
                    <button
                        onClick={resetSelections}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300 ease-in-out shadow hover:shadow-md"
                    >
                        선택 초기화
                    </button>
                    <button
                        className={`mt-4 px-6 py-3 ${buttonLoading ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'} focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-white font-bold rounded-full w-full block text-center`}
                        onClick={processTarotRequest}
                        disabled={buttonLoading || selectedCards.length === 0}
                    >
                        {buttonLoading ? '로딩 중...' : '타로 결과 보기'}
                    </button>
                </div>

            </div>
            <div>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    )
        ;
};

export default TarotDoPage;



