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

    const handleButtonClick = () => {
        // 카드가 선택되지 않았거나 중분류가 선택되었지만 카드가 아직 선택되지 않은 경우, 카드 선택하기
        if (selectedCards.length === 0 && selectedMinor) {
            handleSelectCards();
        } else if (selectedCards.length > 0) {
            // 선택된 카드가 있으면, 타로 결과 보기
            processTarotRequest();
        }
    };



    const buttonLabel = selectedCards.length > 0 ? "타로 결과 보기" : (selectedMinor ? "타로 카드 선택하기" : "테마를 선택하세요");


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
    const resetSelections = () => {
        // 초기 상태에서 대분류의 첫 번째 항목 선택
        if (fortunes.length > 0) {
            const firstMajor = fortunes[0].label;
            setSelectedMajor(firstMajor);

            // 대분류에 따른 중분류의 첫 번째 항목 선택
            if (fortunes[0].descriptions.length > 0) {
                const firstMinor = fortunes[0].descriptions[0].title;
                setSelectedMinor(firstMinor);
            } else {
                setSelectedMinor(''); // 중분류 데이터가 없는 경우
            }
        } else {
            setSelectedMajor(''); // 대분류 데이터가 없는 경우
            setSelectedMinor('');
        }

        setSelectedCards([]); // 선택된 카드 초기화
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



    if (isLoading) {
        // 로딩 중일 때 로딩 컴포넌트만 표시
        return <LoadingComponent />;
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-[#FFF8F0]">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#333333]">타로하기</h1>
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            {/* UI Components directly defined in return */}
            <div className="bg-gray-200 p-4 rounded-lg flex items-center mb-4">
                <p className="text-sm text-gray-700">타로 카테고리를 선택하여 시작하세요. 각 카테고리는 다양한 타로 테마와 카드를 제공합니다!<br />타로 테마를 선택하여 보고싶은 타로를 제공합니다</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4 text-left">타로 카테고리</h2>
                <div className="flex flex-wrap justify-start">
                    {fortunes.map((fortune, index) => (
                        <button key={index} onClick={() => handleMajorSelect(fortune.label)} className={`m-2 p-2 rounded hover:bg-blue-700 text-white ${selectedMajor === fortune.label ? 'bg-blue-700' : 'bg-blue-500'}`}>{fortune.label}</button>
                    ))}
                </div>
            </div>
            {selectedMajor && (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-left">타로테마</h2>
                    <div className="flex flex-wrap justify-start">
                        {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.map((desc, index) => (
                            <button key={index} onClick={() => handleMinorSelect(desc.title)} className={`m-2 p-2 rounded hover:bg-green-700 text-white ${selectedMinor === desc.title ? 'bg-green-700' : 'bg-green-500'}`}>{desc.title}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* 카드 표시 영역 스타일 조정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCards.length > 0 ? selectedCards.map((card, index) => (
                    <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#333333] mb-2">{index + 1}번째 카드</h2>
                            <h2 className="text-2xl font-bold text-[#333333] mb-2">{card.description}</h2>
                        </div>
                        <div className="flex-shrink-0 w-full h-64 relative mb-8 mx-auto">
                            <img src={card.image || cardBackImage} alt={card.name}
                                 className="w-full h-full object-contain rounded-l-lg"/>
                        </div>
                    </div>
                )) : (
                    <>
                        {fortunes.find(fortune => fortune.label === selectedMajor)?.descriptions.find(desc => desc.title === selectedMinor)?.cardDescriptions.map((desc, index) => (
                            <div key={index} className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-[#333333] mb-2">{index + 1}번째 카드</h2>
                                    <h2 className="text-2xl font-bold text-[#333333] mb-2">{desc}</h2>
                                </div>
                                <div className="flex-shrink-0 w-full h-64 relative mb-8 mx-auto">
                                    <img src={cardBackImage} alt="Card Back"
                                         className="w-full h-full object-contain rounded-l-lg"/>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
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
                                {/* 타로 결과 보기 상태일 때만 타로 초기화 버튼을 보여주기 */}
                                {selectedCards.length > 0 && (
                                    <button onClick={resetSelections} className="w-full mb-4 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition ease-in-out">
                                        타로 초기화
                                    </button>
                                )}
                                <button
                                    onClick={handleButtonClick}
                                    className={`w-full px-6 py-2 ${selectedCards.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-lg transition ease-in-out`}
                                    disabled={isLoading || (!selectedMinor && selectedCards.length === 0)}
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