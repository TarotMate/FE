/* TarotDetailPage.tsx */
import {useCallback, useEffect, useState} from "react";
import { gptTarot, CallGptResponse } from "../../utils/gptTarot/getTarot";
import {useNavigate} from "react-router-dom";
import DisplayTextForSelectedTab from "./components/DisplayTextForSelectedTab";
import ControlButtons from "./components/ControlButtons";
import CardDeck from "./components/molecules/CardDeck";
import FortuneTabs from "./components/FortuneTabs";
import SelectedCards from "./components/SelectedCards";
import LoadingComponent from "./components/LoadingComponent";
import styles from './TarotDetailPage.module.css';
import tarotData from '../../data/TarotData.json';
import {Fortune, TarotCard} from "../../data/TarotTypes";
import {Card, Modal, Tooltip, Typography} from "@mui/material";
import {gptTarotNew} from "../../utils/gptTarot/gptTarotNew";

function TarotDetailPage() {
    const [tarotCards, setTarotCards] = useState<TarotCard[]>([]);
    const [fortunes, setFortunes] = useState<Fortune[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedFortune, setSelectedFortune] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 창 표시 상태
    // "+" 버튼 클릭 시 모달 창을 띄우는 함수
    const openModal = () => {
        setShowModal(true);
    };
    const handleDescriptionSelect = (index: number) => {
        setSelectedFortuneDetails(prev => ({
            ...prev,
            activeDescriptionIndex: index
        }));
        setSelectedCards([]); // Reset selected cards when a new description is chosen
        setShowModal(false);
    };
    const defaultFortuneDetails: Fortune = {
        label: "",
        value: "",
        descriptions: [{
            title: "",
            subtitle: "",
            cardDescriptions: []
        }],
        activeDescriptionIndex: 0 // Initialize with 0
    };
    const [selectedFortuneDetails, setSelectedFortuneDetails] = useState<Fortune>(defaultFortuneDetails);
    const activeDescription = selectedFortuneDetails.activeDescriptionIndex !== undefined
        ? selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
        : selectedFortuneDetails.descriptions[0];
    const [cardBackImage] = useState(tarotData.cardBackImage);
    // 기존 상태
    const [isLoading, setIsLoading] = useState(false);
    // 상태 정의 부분
    const [error, setError] = useState<string | null>(null);



    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [isCardMoving, setIsCardMoving] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = import.meta.env.VITE_TAROT_API_URL+"/init";
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("서버에서 데이터를 가져오는 데 실패했습니다.");
                }
                const data = await response.json();
                setTarotCards(data.response.tarotCards);
                setFortunes(data.response.fortunes);

                // API 호출 완료 후 초기 타로 및 상세 정보 설정
                if (data.response.fortunes && data.response.fortunes.length > 0) {
                    const initialFortune = data.response.fortunes[0];
                    setSelectedFortune(initialFortune.value);
                    setSelectedFortuneDetails(initialFortune);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setFetchError(error.message);
                } else {
                    setFetchError('알 수 없는 오류가 발생했습니다.');
                }
            }
        };
        fetchData();
    }, []);

    const handleFortuneChange = useCallback((newValue: string) => {
        const selected = fortunes.find(fortune => fortune.value === newValue);
        setSelectedFortune(newValue);
        setSelectedFortuneDetails(selected || fortunes[0]);
        setSelectedCards([]);
    }, [fortunes]);
    // 다시하기 버튼 클릭 핸들러
    const handleReset = useCallback(() => {
        setSelectedCards([]);
    }, []);

// 공통 로직: 타로 카드 번호 추출 및 요청 보내기

    const processTarotRequest = async (selectedCards: string[]) => {
        // 요청에 필요한 카드 번호 추출
        const selectedCardNumbers = selectedCards.map(cardName => {
            const card = tarotCards.find(tarotCard => tarotCard.name === cardName);
            return card ? card.number : null;
        }).filter(number => number !== null);
        //
        // // 요청 객체 구성
        const tarotRequest = {
            fortuneType: selectedFortuneDetails.label,
            theme: activeDescription.title,
            selectedCardNumbers,
            cardDescriptions: activeDescription.cardDescriptions
        };

        const testRequestData = {
            fortuneType: "연애타로",
            theme: "사랑의 길을 밝혀주는 별빛",
            selectedCardNumbers: [7, 15, 21],
            cardDescriptions: ["심장의 메시지", "새로운 인연", "애정의 조화와 갈등"]
        };
        console.log(testRequestData);
        console.log(tarotRequest);

        try {
            // gptTarotNew 함수를 사용하여 서버 요청
            const result = await gptTarotNew(tarotRequest);
            console.log(result)
            return result;
        } catch (error) {
            // 오류 처리
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('알 수 없는 오류가 발생했습니다.');
            }
        }
    };


    const handleButtonClick = useCallback(async () => {
        if (selectedCards.length === activeDescription.cardDescriptions.length) {
            setIsLoading(true);
            setError(null);
            try {
                const result = await processTarotRequest(selectedCards);
                if (result) {
                    navigate('/result', { state: { resultData: result.response } });
                } else {
                    // result가 없는 경우 처리 로직
                    setError('결과를 가져오는 데 실패했습니다.');
                }
            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching GPT response:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedCards, activeDescription, navigate]);


    const handleDeckClick = useCallback(() => {
        // 이미 애니메이션이 진행 중인 경우 추가 동작을 방지
        if (isCardMoving) return;

        const currentDescription = selectedFortuneDetails.activeDescriptionIndex !== undefined
            ? selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
            : selectedFortuneDetails.descriptions[0];
        if (selectedCards.length >= currentDescription.cardDescriptions.length) {
            return;
        }

        let randomCard;
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * tarotCards.length);
            randomCard = tarotCards[randomIndex];
        } while (selectedCards.includes(randomCard.name));

        setSelectedCards([...selectedCards, randomCard.name]);
        setIsCardMoving(true);
        setTimeout(() => {
            setIsCardMoving(false);
        }, 3000); // 애니메이션 지속 시간을 3초로 설정
    }, [selectedCards, tarotCards, selectedFortuneDetails, isCardMoving]);




    const isButtonDisabled = useCallback(() => {
        const currentDescription = selectedFortuneDetails.activeDescriptionIndex !== undefined
            ? selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
            : selectedFortuneDetails.descriptions[0];
        return selectedCards.length !== currentDescription.cardDescriptions.length;
    }, [selectedCards, selectedFortuneDetails]);

    const retryData = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await processTarotRequest(selectedCards);
            if (result) {
                navigate('/result', { state: { resultData: result.choices } });
            } else {
                setError('결과를 가져오는 데 실패했습니다.');
            }
        } catch (error: any) {
            setError(error.message);
            console.error('Error fetching GPT response:', error);
        } finally {
            setIsLoading(false);
        }
    };


    // "다시 시도하기" 버튼 클릭 핸들러
    const handleRetry = () => {
        retryData();
    };
    const currentCardIndex = selectedCards.length;
    const isAllCardsSelected = currentCardIndex === activeDescription.cardDescriptions.length;
    const currentCardDescription = isAllCardsSelected ?
        "모든 카드를 선택하셨습니다." :
        activeDescription.cardDescriptions[currentCardIndex];

    return (
        <div className={styles.pageContainer}>
            {isLoading && (
                <div className={styles.loadingContainer}>
                    <LoadingComponent /> {/* 로딩 인디케이터 컴포넌트 */}
                </div>
            )}
            {fetchError && (
                <div className="error-message">{fetchError}</div>
            )}
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                    <button onClick={handleRetry}>다시 시도하기</button>
                </div>
            )}


            <div className={styles.contentContainer}>
                <FortuneTabs
                    selectedFortune={selectedFortune}
                    handleFortuneChange={handleFortuneChange}
                    fortunes={fortunes}
                />

                {showModal && (
                    <Modal open={showModal} onClose={() => setShowModal(false)}>
                        <div className={styles.modalStyle}>
                            {selectedFortuneDetails.descriptions.map((description, index) => (
                                <button key={index} onClick={() => handleDescriptionSelect(index)}>
                                    {description.title}
                                </button>
                            ))}
                        </div>
                    </Modal>
                )}
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>

                <DisplayTextForSelectedTab title={activeDescription.title} subtitle={activeDescription.subtitle} />
                </div>
                <div className={styles.cardDeckArea}>
                    <CardDeck
                        handleDeckClick={handleDeckClick}
                        isCardMoving={isCardMoving}
                        cardBackImage={cardBackImage}
                    />
                </div>
                {!isAllCardsSelected && (
                    <>
                        <h3>카드를 눌러주세요</h3>
                        <span>{currentCardDescription}에 대한 카드를 뽑겠습니다.</span>
                    </>
                )}
                {isAllCardsSelected && (
                    <span>{currentCardDescription}</span>
                )}
                {selectedFortuneDetails.descriptions.length > 1 && (
                    <Tooltip title="더 많은 타로 설명 보기" placement="right">
                        <button
                            onClick={openModal}
                            style={{
                                backgroundColor: '#fff', // 배경색
                                color: '#1976d2', // 텍스트 색상
                                border: 'none', // 테두리 없음
                                borderRadius: '4px', // 둥근 모서리
                                padding: '10px 20px', // 내부 패딩
                                margin: '5px', // 여백
                                boxShadow: '0px 2px 4px rgba(0,0,0,0.2)', // 그림자 효과
                                cursor: 'pointer', // 마우스 커서 변경
                                transition: 'background-color 0.3s ease', // 배경색 변경시 부드러운 전환 효과
                            }}
                        >
                            <span style={{ marginLeft: '5px' }}>다른 운세 보기</span>
                        </button>
                    </Tooltip>
                )}
                <div className={styles.cardSelectionArea}>
                    <SelectedCards
                        cardDescriptions={activeDescription.cardDescriptions}
                        selectedCards={selectedCards}
                        tarotCards={tarotCards}
                    />
                </div>
                <Card
                    style={{
                        backgroundColor: '#424242', // 짙은 회색 배경
                        color: '#fff', // 텍스트 색상을 흰색으로 설정
                        margin: '20px 0', // 상하 여백
                        padding: '10px', // 내부 패딩
                        width: '360px', // 가로 길이 100%
                        boxSizing: 'border-box', // 박스 크기 설정
                        borderRadius: '4px', // 모서리 둥글게
                    }}
                >
                    <Typography
                        variant="body2"
                        style={{
                            fontSize: '0.875rem', // 폰트 사이즈 설정
                            textAlign: 'center', // 중앙 정렬
                            fontWeight: 'lighter', // 글씨 무게
                        }}
                    >
                        입력하신 정보는 타로메이트 서비스 이용 외 별도 동의없이 공유되지 않으며,
                        개인정보보호정책에 의해 보호받고 있습니다
                    </Typography>
                </Card>
                <div className={styles.controlButtonArea}>
                <ControlButtons
                        handleReset={handleReset}
                        handleButtonClick={handleButtonClick}
                        isLoading={isLoading}
                        selectedCards={selectedCards}
                        isButtonDisabled={isButtonDisabled()}
                    />
                </div>
            </div>
        </div>
    );
}


export default TarotDetailPage;