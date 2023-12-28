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
import {Fortune, TarotData} from "../../data/TarotTypes";
import {Modal} from "@mui/material";

function TarotDetailPage() {
    const [tarotCards] = useState<TarotData['tarotCards']>(tarotData.tarotCards);
    const [fortunes] = useState<TarotData['fortunes']>(tarotData.fortunes);
    const [selectedFortune, setSelectedFortune] = useState(fortunes[0]?.value || '');
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
    const [error, setError] = useState<string | null>(null);

    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [isCardMoving, setIsCardMoving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 초기 선택된 운세 및 상세 정보 설정
        if (fortunes && fortunes.length > 0) {
            setSelectedFortune(fortunes[0]?.value || '');
            setSelectedFortuneDetails(fortunes[0] || defaultFortuneDetails);
        }
    }, [fortunes]);




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
        const selectedCardNumbers = selectedCards.map((cardName: string) => {
            const card = tarotCards.find(tarotCard => tarotCard.name === cardName);
            return card ? card.number : null;
        }).join(", ");

        const tarotPrompt = `
        운세 유형: ${selectedFortuneDetails.value}
        제목: ${activeDescription.title}
        부제: ${activeDescription.subtitle}
        카드 설명: ${activeDescription.cardDescriptions.join(", ")}
        선택된 카드 번호: ${selectedCardNumbers}
    `;

        try {
            const result: CallGptResponse = await gptTarot(tarotPrompt);
            return result;
        } catch (error) {
            throw new Error("타로 읽기를 가져오는 데 실패했습니다.");
        }
    };

    const handleButtonClick = useCallback(async () => {
        if (selectedCards.length === activeDescription.cardDescriptions.length) {
            setIsLoading(true);
            setError(null);
            try {
                const result = await processTarotRequest(selectedCards);
                navigate('/result', { state: { resultData: result.choices } });
            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching GPT response:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedCards, activeDescription, navigate]);


    const handleDeckClick = useCallback(() => {
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
        }, 500);
    }, [selectedCards, tarotCards, selectedFortuneDetails]);

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
            navigate('/result', { state: { resultData: result.choices } });
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

    return (
        <div className={styles.pageContainer}>
            {isLoading && (
                <div className={styles.loadingContainer}>
                    <LoadingComponent /> {/* 로딩 인디케이터 컴포넌트 */}
                </div>
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

                {selectedFortuneDetails.descriptions.length > 1 && (
                    <button onClick={openModal}>+</button>
                )}
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

                <DisplayTextForSelectedTab title={activeDescription.title} subtitle={activeDescription.subtitle} />
                <div className={styles.cardSelectionArea}>
                    <SelectedCards
                        cardDescriptions={activeDescription.cardDescriptions}
                        selectedCards={selectedCards}
                        tarotCards={tarotCards}
                    />
                </div>
                <div className={styles.cardDeckArea}>
                <CardDeck
                    handleDeckClick={handleDeckClick}
                    isCardMoving={isCardMoving}
                    cardBackImage={cardBackImage}
                />
                </div>
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