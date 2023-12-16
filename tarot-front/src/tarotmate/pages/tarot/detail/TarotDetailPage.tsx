import {CSSProperties, useCallback, useState} from "react";
import { gptTarot, CallGptResponse } from "../../../utils/gptTarot/getTarot";
import {useNavigate} from "react-router-dom";
import DisplayTextForSelectedTab from "./components/DisplayTextForSelectedTab";
import ControlButtons from "./components/ControlButtons";
import CardDeck from "./components/molecules/CardDeck";
import FortuneTabs from "./components/FortuneTabs";
import SelectedCards from "./components/SelectedCards";
import LoadingComponent from "./components/LoadingComponent";
import styles from './TarotDetailPage.module.css';
import { tarotCards, fortunes } from './constants';

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
    const cardBackImage = "../images/bcard.png"; // 카드 뒷면 이미지
    const [selectedFortune, setSelectedFortune] = useState<string>(fortunes[0].value);


    const [isLoading, setIsLoading] = useState(false);

    const [selectedCards, setSelectedCards] = useState<string[]>([]);

    const [isCardMoving, setIsCardMoving] = useState(false);

    const navigate = useNavigate();


    const handleFortuneChange = useCallback((newValue: string) => {
        setSelectedFortune(newValue);
        setSelectedCards([]);
    }, []);

    // 다시하기 버튼 클릭 핸들러
    const handleReset = useCallback(() => {
        setSelectedCards([]);
    }, []);


    const handleButtonClick = useCallback(async () => {
        // 선택된 카드의 번호를 찾습니다
        const selectedCardNumbers = selectedCards.map(cardName => {
            const card = tarotCards.find(tarotCard => tarotCard.name === cardName);
            return card ? card.number : null;
        });
        let tarotPrompt = `첫번째 카드는 ${selectedCardNumbers[0]}번 카드, 두번째 카드는 ${selectedCardNumbers[1]}번 카드, 세번째 카드는 ${selectedCardNumbers[2]}번 카드를 뽑았다.`;

        if (selectedCards.length === 3) {
            setIsLoading(true);
            try {
                const result: CallGptResponse = await gptTarot(tarotPrompt);
                navigate('/result', { state: { resultData: result.choices } }); // 결과 페이지로 이동하면서 데이터 전달
            } catch (error) {
                console.error('Error fetching GPT response:', error);
            }
            setIsLoading(false);
        }
    }, [selectedCards]);


    // 카드 덱을 클릭했을 때 호출되는 함수
    const handleDeckClick = useCallback(() => {
        if (selectedCards.length >= 3) {
            // 이미 3장의 카드가 선택되었다면 추가 선택 방지
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
    }, [selectedCards, isCardMoving]);


    return (
        <div className={styles.pageContainer}>
            {isLoading && <LoadingComponent />}
            <div className={styles.contentContainer}>
                <FortuneTabs
                    selectedFortune={selectedFortune}
                    handleFortuneChange={handleFortuneChange}
                    fortunes={fortunes}
                />
                            <br /><br />
                            <DisplayTextForSelectedTab selectedFortune={selectedFortune} />
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <SelectedCards selectedCards={selectedCards} tarotCards={tarotCards} />
                            </div>
                            <br />
                    <CardDeck
                        handleDeckClick={handleDeckClick}
                        isCardMoving={isCardMoving}
                        cardBackImage={cardBackImage}
                        cardStyle={cardStyle}
                        movingCardStyle={movingCardStyle}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <ControlButtons
                                    handleReset={handleReset}
                                    handleButtonClick={handleButtonClick}
                                    isLoading={isLoading}
                                    isButtonDisabled={selectedCards.length !== 3}
                                />
                    </div>
                </div>
        </div>
    );
}

export default TarotDetailPage;