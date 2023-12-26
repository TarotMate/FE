import {CSSProperties, useCallback, useEffect, useState} from "react";
import { gptTarot, CallGptResponse } from "../../../utils/gptTarot/getTarot";
import {useNavigate} from "react-router-dom";
import DisplayTextForSelectedTab from "./components/DisplayTextForSelectedTab";
import ControlButtons from "./components/ControlButtons";
import CardDeck from "./components/molecules/CardDeck";
import FortuneTabs from "./components/FortuneTabs";
import SelectedCards from "./components/SelectedCards";
import LoadingComponent from "./components/LoadingComponent";
import styles from './TarotDetailPage.module.css';
import tarotData from '../../../data/TarotData.json';
import {Fortune, TarotData} from "../../../data/TarotTypes";
import {Modal} from "@mui/material";


// 카드 스타일
const cardStyle: CSSProperties = {
    cursor: 'pointer',
    margin: '10px',
    width: '120px', // 모바일 환경에서 크기 증가
    height: '180px', // 모바일 환경에서 크기 증가
    borderRadius: '15px', // 모서리를 둥글게
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)', // 그림자 효과 강화
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.3s ease, border 0.3s ease',
};

// 카드 이동 스타일
const movingCardStyle: CSSProperties = {
    cursor: 'pointer',
    margin: '10px',
    width: '120px', // 모바일 환경에서 크기 증가
    height: '180px', // 모바일 환경에서 크기 증가
    borderRadius: '15px', // 모서리를 둥글게
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)', // 그림자 효과 강화
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transformStyle: 'preserve-3d',
    transform: 'translateX(100px)', // 예시로 100px 오른쪽으로 이동
    transition: 'transform 0.5s ease-in-out' // 부드러운 이동 효과
};

function TarotDetailPage() {
    const [tarotCards, setTarotCards] = useState<TarotData['tarotCards']>(tarotData.tarotCards);
    const [fortunes, setFortunes] = useState<TarotData['fortunes']>(tarotData.fortunes);
    const [selectedFortune, setSelectedFortune] = useState(fortunes[0]?.value || '');

    const [showModal, setShowModal] = useState(false); // 모달 창 표시 상태
    // "+" 버튼 클릭 시 모달 창을 띄우는 함수
    const openModal = () => {
        setShowModal(true);
    };
    // 모달에서 설명을 선택했을 때 실행하는 함수
    // const handleDescriptionSelect = (description) => {
    //     // 선택된 설명을 포함하는 새 Fortune 객체를 생성
    //     const newSelectedFortuneDetails = {
    //         ...selectedFortuneDetails,
    //         descriptions: [description]
    //     };
    //     setSelectedFortuneDetails(newSelectedFortuneDetails);
    //     setShowModal(false);
    // };
    const handleDescriptionSelect = (index: number) => {
        setSelectedFortuneDetails(prev => ({
            ...prev,
            activeDescriptionIndex: index
        }));
        setSelectedCards([]); // Reset selected cards when a new description is chosen
        setShowModal(false);
    };


    // 수정된 Fortune 인터페이스에 맞춰 기본값 설정
    // Initialize selectedFortuneDetails with an activeDescriptionIndex
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
    // const activeDescription = selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
    //     ? selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
    //     : { title: '', subtitle: '', cardDescriptions: [] };
    //

    const activeDescription = selectedFortuneDetails.activeDescriptionIndex !== undefined
        ? selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
        : selectedFortuneDetails.descriptions[0];


    const [cardBackImage, setCardBackImage] = useState(tarotData.cardBackImage);
    // 기존 상태

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [isCardMoving, setIsCardMoving] = useState(false);
    const navigate = useNavigate();

// TarotData 타입에서 fortunes 배열 원소의 타입에 맞는 기본값


    useEffect(() => {
        // JSON 데이터 로딩
        setTarotCards(tarotCards);
        setFortunes(fortunes);
        setCardBackImage(cardBackImage);

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
    // const activeDescription = selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex] || selectedFortuneDetails.descriptions[0];

    const handleButtonClick = useCallback(async () => {
        // 선택된 카드의 번호를 찾습니다
        const selectedCardNumbers = selectedCards.map(cardName => {
            const card = tarotCards.find(tarotCard => tarotCard.name === cardName);
            return card ? card.number : null;
        });

        // 타로 프롬프트 생성
        let tarotPrompt = `
    운세 유형: ${selectedFortuneDetails.value}
    제목: ${activeDescription.title}
    부제: ${activeDescription.subtitle}
    카드 설명: ${activeDescription.cardDescriptions.join(", ")}
    선택된 카드 번호: ${selectedCardNumbers.join(", ")}
    `;

        if (selectedCards.length === activeDescription.cardDescriptions.length) {
            setIsLoading(true);
            try {
                const result: CallGptResponse = await gptTarot(tarotPrompt);
                console.log(result); // 디버깅을 위한 로그

                navigate('/result', {state: {resultData: result.choices}});
            } catch (error) {
                console.error('Error fetching GPT response:', error);
            }
            setIsLoading(false);
        }
    }, [selectedCards, selectedFortuneDetails, activeDescription]);



    const handleDeckClick = useCallback(() => {
        // const currentDescription = selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex] || selectedFortuneDetails.descriptions[0];
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
        } while (selectedCards.includes(randomCard.name)); // 이미 선택된 카드가 아닐 때까지 반복
        setSelectedCards([...selectedCards, randomCard.name]);
        setIsCardMoving(true); // 카드 이동 시작
        // 이동이 완료되면 카드 이미지 변경
        setTimeout(() => {
            setIsCardMoving(false);
            // 카드 뒷면 이미지를 숨기고, 선택된 카드 이미지를 표시하는 로직 추가
        }, 500); // 0.5초 후에 실행 (애니메이션 시간과 일치)
    }, [selectedCards, tarotCards, selectedFortuneDetails, selectedFortuneDetails.activeDescriptionIndex]);
// TarotDetailPage 컴포넌트 내에서 isButtonDisabled 계산
    const isButtonDisabled = useCallback(() => {
        const currentDescription = selectedFortuneDetails.activeDescriptionIndex !== undefined
            ? selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex]
            : selectedFortuneDetails.descriptions[0];
        // const currentDescription = selectedFortuneDetails.descriptions[selectedFortuneDetails.activeDescriptionIndex] || selectedFortuneDetails.descriptions[0];
        return selectedCards.length !== currentDescription.cardDescriptions.length;
    }, [selectedCards, selectedFortuneDetails, selectedFortuneDetails.activeDescriptionIndex]);


    return (
        <div className={styles.pageContainer}>
            {isLoading && <LoadingComponent/>}
            <div className={styles.contentContainer}>
                <FortuneTabs
                    selectedFortune={selectedFortune}
                    handleFortuneChange={handleFortuneChange}
                    fortunes={fortunes}
                />
                <br/><br/>
                {selectedFortuneDetails.descriptions.length > 1 && (
                    <button onClick={openModal}>+</button>
                )}
                {showModal && (
                    <Modal open={showModal} onClose={() => setShowModal(false)}>
                        <div style={{ /* 모달 스타일 지정 */ }}>
                            {selectedFortuneDetails.descriptions.map((description, index) => (
                                <button key={index} onClick={() => handleDescriptionSelect(index)}>
                                    {description.title}
                                </button>
                            ))}

                        </div>
                    </Modal>
                )}
                <DisplayTextForSelectedTab title={activeDescription.title} subtitle={activeDescription.subtitle} />
                <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                    {/* descriptions 배열의 첫 번째 요소 사용 */}
                    <SelectedCards
                        cardDescriptions={activeDescription.cardDescriptions}
                        selectedCards={selectedCards}
                        tarotCards={tarotCards}
                    />
                </div>
                <br/>
                <CardDeck
                    handleDeckClick={handleDeckClick}
                    isCardMoving={isCardMoving}
                    cardBackImage={cardBackImage}
                    cardStyle={cardStyle}
                    movingCardStyle={movingCardStyle}
                />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}>
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