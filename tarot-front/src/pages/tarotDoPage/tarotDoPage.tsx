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

    const [flippedCards, setFlippedCards] = useState<string[]>([]); // 뒤집힌 카드 이름들을 저장하는 상태


    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedMinor, setSelectedMinor] = useState('');

    const [fetchError, setFetchError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태 추가
    const [isImageLoading, setIsImageLoading] = useState(false); // 데이터 로딩 상태 추가

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

    const isAllCardsFlipped = () => {
        // Ensure displayedCards and flippedCards are defined and not null
        if (!displayedCards || !flippedCards) {
            return false; // Default to false if data isn't ready
        }
        return flippedCards.length === displayedCards.length;
    };

    const handleButtonClick = () => {
        if (isAllCardsFlipped()) {
            // Logic to execute when all cards are flipped
            processTarotRequest();
        } else {
            // Optionally handle the case when not all cards are flipped
        }
    };




    const buttonLabel = "타로 결과 보기";

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

    const handleMajorSelect = (major: string) => {
        setSelectedMajor(major);
        // 중분류와 선택된 카드 초기화
        setSelectedMinor('');
        setSelectedCards([]);

        // 새로 선택된 대분류에 따라 첫 번째 중분류를 자동으로 설정
        const selectedFortune = fortunes.find(fortune => fortune.label === major);
        if (selectedFortune && selectedFortune.descriptions.length > 0) {
            const firstMinor = selectedFortune.descriptions[0].title; // 첫 번째 중분류의 제목을 가져옴
            setSelectedMinor(firstMinor); // 첫 번째 중분류를 선택된 중분류로 설정
        }
    };


// 중분류를 선택했을 때 실행되는 함수
    const handleMinorSelect = (minor: string) => {
        setSelectedMinor(minor);
        // 선택된 카드만 초기화
        setSelectedCards([]);
    };

// 타로 카드 선택/해제 기능을 추가합니다.
    const toggleCardSelection = (card: TarotCard) => {
        const isSelected = selectedCards.find(selected => selected.name === card.name);
        if (isSelected) {
            // 이미 선택된 카드를 다시 클릭하면 선택 해제
            setSelectedCards(selectedCards.filter(selected => selected.name !== card.name));
        } else {
            // 카드 선택
            setSelectedCards([...selectedCards, card]);
        }
    };

    const toggleFlipCard = (cardName: string) => {
        setFlippedCards(current => {
            if (current.includes(cardName)) {
                // 이미 뒤집힌 카드를 다시 클릭하면 뒤집기 상태에서 제거
                return current.filter(name => name !== cardName);
            } else {
                // 카드를 뒤집기 상태에 추가
                return [...current, cardName];
            }
        });
    };


    // 필요한 useState 추가
    const [availableCardDescriptions, setAvailableCardDescriptions] = useState<string[]>([]);

    const [displayedCards, setDisplayedCards] = useState<TarotCard[]>([]);
// useEffect 내에서 displayedCards 상태 업데이트 로직 수정
    useEffect(() => {
        const descriptions = fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.find(desc => desc.title === selectedMinor)?.cardDescriptions || [];
        setAvailableCardDescriptions(descriptions);

        // TarotCards 상태를 직접 수정하지 않도록 복사본 사용
        const shuffledCards = [...tarotCards].sort(() => 0.5 - Math.random());
        // descriptions 길이만큼 카드를 표시하도록 설정
        setDisplayedCards(shuffledCards.slice(0, descriptions.length));
        // 뒤집힌 카드 상태 초기화
        setFlippedCards([]);
    }, [selectedMajor, selectedMinor, tarotCards]);


    const handleCardClick = (card: TarotCard) => {
        setIsImageLoading(true);
        // 카드 뒤집기
        toggleCardSelection(card);
        // 카드를 뒤집기 상태에 추가하거나 제거하는 로직을 실행합니다.
        toggleFlipCard(card.name);
    };

    if (isLoading) {
        // 로딩 중일 때 로딩 컴포넌트만 표시
        return <LoadingComponent />;
    }

    const shuffleTarotCards = () => {
        // Creating a copy of the tarotCards array to shuffle
        let shuffledCards = [...tarotCards];

        // Fisher-Yates shuffle algorithm
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]]; // Swap elements
        }

        // Updating the tarotCards state with the shuffled array
        setTarotCards(shuffledCards);

        // Optional: Reset selected cards and flipped cards if necessary
        setSelectedCards([]);
        setFlippedCards([]);
    };

    const selectAllTarotCards = () => {
        setIsImageLoading(true)
        // Assuming 'displayedCards' contains the cards currently shown to the user
        // and you want to select all these cards for the reading

        // Update the state to include all displayed cards as selected
        setSelectedCards(displayedCards);

        // Assuming selecting a card also means flipping it, update the state to mark all displayed cards as flipped
        const allFlippedCardNames = displayedCards.map(card => card.name);
        setFlippedCards(allFlippedCardNames);
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-[#FFF8F0]">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#333333]">타로하기</h1>
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            {/* UI Components directly defined in return */}
            <div className="bg-gray-200 p-4 rounded-lg flex items-center mb-4">
                <p className="text-sm text-gray-700">
                    1.타로 카테고리를 선택하여 시작하세요.
                    <br />2.타로 테마를 선택하여 보고싶은 타로를 제공합니다
                    <br />3.타로점을 보기 위해 카드를 선택한후 타로 결과보기를 클릭하세요
                </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4 text-left">타로 카테고리</h2>
                <div className="flex flex-wrap justify-start">
                    {fortunes.map((fortune, index) => (
                        <button key={index} onClick={() => handleMajorSelect(fortune.label)}
                                className={`m-2 p-2 rounded hover:bg-blue-700 text-white ${selectedMajor === fortune.label ? 'bg-blue-700 border-4 border-blue-300' : 'bg-blue-500'} transition ease-in-out`}
                        >
                            {fortune.label}</button>
                    ))}
                </div>
            </div>
            {selectedMajor && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-left">타로테마</h2>
                    <div className="flex flex-wrap justify-start">
                        {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.map((desc, index) => (
                            <button key={index} onClick={() => handleMinorSelect(desc.title)}
                                    className={`m-2 p-2 rounded hover:bg-green-700 text-white ${selectedMinor === desc.title ? 'bg-green-700 border-4 border-green-300' : 'bg-green-500'} transition ease-in-out`}
                            >
                                {desc.title}</button>
                        ))}
                    </div>
                </div>
            )}
            {selectedMinor && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-left">타로점</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedCards.map((card, index) => (
                <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#333333] mb-2">{availableCardDescriptions[index]}</h2>
                    </div>
                    <div className="flex-shrink-0 w-full h-64 relative mb-8 mx-auto cursor-pointer">
                        {flippedCards.includes(card.name) || selectedCards.includes(card) ? (
                            <>
                                {isImageLoading && <div className="absolute inset-0 flex justify-center items-center">로딩중...</div>}
                                <img
                                    src={card.image || cardBackImage}
                                    alt={card.name}
                                    onClick={() => handleCardClick(card)}
                                    style={{ display: isLoading ? 'none' : 'block' }}
                                    onLoad={() => setIsImageLoading(false)}
                                    className="w-full h-full object-contain"
                                />
                            {/*<img src={card.image || cardBackImage} alt={card.name} onClick={() => handleCardClick(card)} className="w-full h-full object-contain"/>*/}
                            <p className="text-lg text-[#333333] mb-1 text-center">{`선택완료`}</p>
                            </>
                        ) : (
                            <>
                            <img src={cardBackImage} alt="Card Back" onClick={() => handleCardClick(card)} className="w-full h-full object-contain"/>
                            <p className="text-lg text-[#333333] mb-1 text-center">{`타로를 선택해주세요`}</p>
                            </>
                        )}
                    </div>
                </div>
                    ))}
            </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={shuffleTarotCards}
                            className="mb-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md"
                        >
                            다시섞기
                        </button>
                        <button
                            onClick={selectAllTarotCards}
                            className="mb-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md"
                        >
                            일괄선택
                        </button>
                    </div>
            </div>
            )}
            {/* 카드 표시 영역 스타일 조정 */}
            {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">*/}
            {/*    {selectedCards.length > 0 ? selectedCards.map((card, index) => (*/}
            {/*        <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">*/}
            {/*            <div className="p-6">*/}
            {/*                <h2 className="text-2xl font-bold text-[#333333] mb-2">{index + 1}번째 카드</h2>*/}
            {/*                <h2 className="text-2xl font-bold text-[#333333] mb-2">{card.description}</h2>*/}
            {/*            </div>*/}
            {/*            <div className="flex-shrink-0 w-full h-64 relative mb-8 mx-auto">*/}
            {/*                <img src={card.image || cardBackImage} alt={card.name}*/}
            {/*                     className="w-full h-full object-contain rounded-l-lg"/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )) : (*/}
            {/*        <>*/}
            {/*            {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.find(desc => desc.title === selectedMinor)?.cardDescriptions.map((desc, index) => (*/}
            {/*                <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">*/}
            {/*                    <div className="p-6">*/}
            {/*                        <h2 className="text-2xl font-bold text-[#333333] mb-2">{index + 1}번째 카드</h2>*/}
            {/*                        <h2 className="text-2xl font-bold text-[#333333] mb-2">{desc}</h2>*/}
            {/*                    </div>*/}
            {/*                    <div className="flex-shrink-0 w-full h-64 relative mb-8 mx-auto">*/}
            {/*                        <img src={cardBackImage} alt="Card Back"*/}
            {/*                             className="w-full h-full object-contain rounded-l-lg"/>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</div>*/}
            <div>
                {error && <p className="text-red-500">{error}</p>}
            </div>
            {/* 페이지 하단에 고정된 컨트롤 컨테이너 */}
            <div className="fixed inset-x-0 bottom-0 bg-white py-4 shadow-lg">
                <div className="max-w-screen-md mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        {/* 버튼 그룹 */}
                        <div className="fixed inset-x-0 bottom-0 bg-white py-4 shadow-lg">
                            <div className="max-w-screen-md mx-auto px-4">
                                <button
                                    onClick={handleButtonClick}
                                    className={`w-full px-6 py-2 ${isAllCardsFlipped() ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500'} text-white rounded-lg transition ease-in-out`}
                                    disabled={!isAllCardsFlipped() || isLoading}
                                >
                                    {buttonLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};
export default TarotDoPage;