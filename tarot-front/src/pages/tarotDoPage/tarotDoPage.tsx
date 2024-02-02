import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gptTarotNew } from "../../utils/gptTarot/gptTarotNew";
import LoadingComponent from "../detailPage/components/LoadingComponent";
import {cardBackImage} from "../../data/constants";

const TarotDoPage = () => {

    interface TarotCard {
        name: string;
        number?: number;
        image?: string;
        description?: string;
    }

    interface Fortune {
        label: string;
        descriptions: Description[];
    }

    interface Description {
        title: string;
        cardDescriptions?: string[]; // Adjust based on your actual data structure
    }


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
        const selectedCardNumbers = selectedCards.map(card => {
            const foundCard = tarotCards.find(tarotCard => tarotCard.name === card.name);
            return foundCard ? foundCard.number : null;
        }).filter(number => number !== null);

        if (selectedCardNumbers.length === 0) {
            console.error("No valid card numbers found.");
            setIsLoading(false); // 유효한 카드 번호가 없으면 로딩 종료
            return;
        }

        try {
            const result = await gptTarotNew({
                fortuneType: selectedMajor,
                theme: selectedMinor,
                selectedCardNumbers: selectedCardNumbers,
                cardDescriptions: fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.find(desc => desc.title === selectedMinor)?.cardDescriptions || [],
            });
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




    return (
        <div className="container mx-auto p-4">
            {isLoading && <LoadingComponent />} {/* 데이터 로딩 중 로더 표시 */}
            {fetchError && <p className="text-red-500">{fetchError}</p>}

            <div className="flex flex-wrap items-end gap-4 mb-4">
                {/* 대분류 선택 */}
                <select
                    className="p-2 border rounded"
                    value={selectedMajor}
                    onChange={(e) => {
                        setSelectedMajor(e.target.value);
                        setSelectedMinor(''); // 대분류를 변경하면 중분류 선택 초기화
                    }}
                >
                    <option value="">대분류 선택</option>
                    {fortunes.map((fortune, index) => (
                        <option key={index} value={fortune.label}>
                            {fortune.label}
                        </option>
                    ))}
                </select>

                {/* 중분류 선택 */}
                <select
                    className="p-2 border rounded"
                    value={selectedMinor}
                    onChange={(e) => setSelectedMinor(e.target.value)}
                    disabled={!selectedMajor} // 대분류가 선택되지 않으면 중분류 선택 비활성화
                >
                    <option value="">중분류 선택</option>
                    {fortunes
                        .find(fortune => fortune.label === selectedMajor)?.descriptions
                        .map((desc, index) => (
                            <option key={index} value={desc.title}>
                                {desc.title}
                            </option>
                        ))}
                </select>

                {/* 중분류에 대한 설명 (선택된 경우) */}
                {selectedMinor && fortunes
                    .find(fortune => fortune.label === selectedMajor)?.descriptions
                    .find(desc => desc.title === selectedMinor) && (
                        <></>
                )
                }

                {/* 타로 카드 선택하기 버튼 (항상 보이되, 중분류가 선택되지 않았다면 비활성화) */}
                <button
                    onClick={handleSelectCards}
                    disabled={!selectedMinor} // 중분류가 선택되지 않으면 비활성화
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:bg-green-300 transition duration-300"
                >
                    타로 카드 선택하기
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedCards.length > 0 ? selectedCards.map((card, index) => (
                    <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
                        <img className="w-full" src={card.image} alt={card.name} />
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{card.name}</div>
                            <p>{card.description}</p>
                        </div>
                    </div>
                )) : (
                    <>
                        {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.find(desc => desc.title === selectedMinor)?.cardDescriptions.map((_, index) => (
                            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg p-4 flex justify-center items-center">
                                <img src={cardBackImage} alt="Card Back" className="w-full" /> {/* '/path/to/bcard.png'를 이미지의 실제 경로로 바꿔주세요. */}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* 타로 결과 보기 버튼 */}
            <div>
                <button
                    className={`px-6 py-3 ${buttonLoading ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'} focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-white font-bold rounded-full w-full block text-center`}
                    onClick={processTarotRequest}
                    disabled={buttonLoading || selectedCards.length === 0}
                >
                    {buttonLoading ? '로딩 중...' : '타로 결과 보기'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </div>

        </div>
    );
};

export default TarotDoPage;

