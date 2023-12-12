import {
    Button, Card, CardContent, CircularProgress, Tab, Tabs, Typography, Snackbar
} from "@mui/material";
import {ChangeEvent, CSSProperties, FC, SyntheticEvent, useState} from "react";
import { gptTarot, CallGptResponse } from "../../../../utils/gptTarot/getTarot";

interface ResponseItem {
    message: {
        content: string;
    };
}

interface TarotCard {
    number: number;
    name: string;
    image: string;
}

interface FortuneTabProps {
    fortunes: { label: string, value: string }[];
    selectedFortune: string;
    onChange: (event: ChangeEvent<HTMLDivElement>, newValue: string) => void;
}

// FortuneTabs 컴포넌트
const FortuneTabs: FC<FortuneTabProps> = ({ fortunes, selectedFortune, onChange }) => (
    <Tabs value={selectedFortune} onChange={onChange} variant="scrollable" scrollButtons="auto" indicatorColor="primary" textColor="primary" aria-label="fortune selection tabs" style={{ backgroundColor: 'white', width: '500px', maxWidth: '500px' }}>
        {fortunes.map((fortune, index) => (
            <Tab key={index} label={fortune.label} value={fortune.value} />
        ))}
    </Tabs>
);

// 기존 cardStyle에 React.CSSProperties 타입을 명시적으로 적용
const cardStyle: CSSProperties = {
    cursor: 'pointer',
    margin: '3px',
    width: '50px',
    height: '90px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.3s ease, border 0.3s ease',
};

function TarotDetail() {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ResponseItem[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [selectedCardsText, setSelectedCardsText] = useState<string>('');
    const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const fortunes = [
        { label: "오늘의 운세", value: "오늘의 운세" },
        { label: "연애운", value: "연애운" },
        { label: "이번달 운세", value: "이번달 운세" },
    ];

    const [selectedFortune, setSelectedFortune] = useState<string>(fortunes[0].value);
    const [fortuneType, setFortuneType] = useState<string>(fortunes[0].value);

    const handleFortuneChange = (event: SyntheticEvent<Element, Event>, newValue: string) => {
        setSelectedFortune(newValue);
        setFortuneType(newValue);
    };
    const cardBackImage = "../images/bcard.png"; // 카드 뒷면 이미

    const tarotCards: TarotCard[] = [
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


    const toggleCardSelection = (cardName: string) => {
        if (flippedCards.has(cardName)) {
            alert("다시 뒤집을 수는 없습니다.");
            return;
        }

        if (selectedCards.length >= 3 && !selectedCards.includes(cardName)) {
            setOpenSnackbar(true);
            return;
        }

        const newFlippedCards = new Set(flippedCards);
        newFlippedCards.add(cardName);

        setFlippedCards(newFlippedCards);

        if (!selectedCards.includes(cardName)) {
            setSelectedCards([...selectedCards, cardName]);
        }
    };

    const handleButtonClick = async () => {
        if (selectedCards.length < 3) {
            alert('3장의 카드를 선택해야 합니다.');
            return;
        }

        // 선택된 카드의 번호를 찾습니다
        const selectedCardNumbers = selectedCards.map(cardName => {
            const card = tarotCards.find(tarotCard => tarotCard.name === cardName);
            return card ? card.number : null;
        });

        // 선택된 카드의 이름과 번호를 포함하여 문자열 생성
        let tarotPrompt = `첫번째 카드는 ${selectedCardNumbers[0]}번 카드, 두번째 카드는 ${selectedCardNumbers[1]}번 카드, 세번째 카드는 ${selectedCardNumbers[2]}번 카드를 뽑았다.`;

        // 선택된 운세 유형에 따라 프롬프트를 조정
        if (fortuneType === '오늘의 운세') {
            tarotPrompt += " 오늘의 운세를 알려주세요.";
        } else if (fortuneType === '연애운') {
            tarotPrompt += " 연애운을 알려주세요.";
        } else if (fortuneType === '이번달 운세') {
            tarotPrompt += " 이번달 운세를 알려주세요.";
        }
        setSelectedCardsText(`${tarotPrompt}`);

        setIsLoading(true);
        try {
            const result: CallGptResponse = await gptTarot(tarotPrompt);
            setResponse(result.choices);
            setShowResults(true); // 결과를 표시하도록 설정
        } catch (error) {
            console.error('Error fetching GPT response:', error);
            setResponse([]);
        }
        setIsLoading(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const renderResponse = (responseContent: string) => {
        try {
            const responseObj = JSON.parse(responseContent);
            return (
                <div style={{ margin: '10px' }}>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{responseObj.title}</Typography>
                    <Typography variant="body1">{responseObj.summary}</Typography>
                    <Typography variant="body1">{responseObj.detail}</Typography>
                    {/* 기타 필요한 정보를 렌더링 */}
                </div>
            );
        } catch (error) {
            console.error('Error parsing response:', error);
            return <Typography variant="body1">응답을 불러오는 데 문제가 발생했습니다.</Typography>;
        }
    };

    const getDisplayTextForSelectedTab = (): JSX.Element => {
        switch (selectedFortune) {
            case '오늘의 운세':
                return (
                    <>
                        <Typography variant="h5" style={{ fontWeight: 'bold' }}>당신의 하루는 어떨까요?</Typography>
                        <Typography variant="subtitle2">오늘을 생각하며 카드를 뽑으세요</Typography>
                    </>
                );
            case '연애운':
                return (
                    <>
                        <Typography variant="h5" style={{ fontWeight: 'bold' }}>나의 애정운</Typography>
                        <Typography variant="subtitle2">이달을 생각하며 카드를 뽑아주세요</Typography>
                    </>
                );
            case '이번달 운세':
                return (
                    <>
                        <Typography variant="h5" style={{ fontWeight: 'bold' }}>이번달 운세</Typography>
                        <Typography variant="subtitle2">이번달 당신의 기운은 어떨까요?</Typography>
                    </>
                );
            default:
                return <></>;
        }
    };

    const renderCard = (card: TarotCard, index: number): JSX.Element => (
        <Card
            key={index}
            style={selectedCards.includes(card.name) ? { ...cardStyle, border: '3px solid black' } : cardStyle}
            onClick={() => toggleCardSelection(card.name)}
        >
            {/* 카드 전면 */}
            <CardContent style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backfaceVisibility: 'hidden',
                border: selectedCards.includes(card.name) ? '2px solid #1976d2' : '1px solid #ddd',
                transform: flippedCards.has(card.name) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                zIndex: flippedCards.has(card.name) ? 1 : 0
            }}>
                {/* 카드 전면 내용 (예: 카드 이름 표시) */}
                <Typography variant="subtitle1">{card.name}</Typography>
            </CardContent>

            {/* 카드 뒷면 */}
            <CardContent style={{
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${flippedCards.has(card.name) ? card.image : cardBackImage})`,
                transform: flippedCards.has(card.name) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                zIndex: flippedCards.has(card.name) ? 1 : 0
            }}>
                {/* 뒷면은 이미지만 표시 */}
            </CardContent>
        </Card>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {isLoading ? (
                <CircularProgress style={{ color: 'blue' }} />
            ) : (
                <div style={{ width: '500px', display: 'flex', backgroundColor: '#eeeeee', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', color: "black" }}>
                    {!showResults && (
                        <>
                            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="3장의 카드를 모두 선택하셨습니다." />
                            <FortuneTabs fortunes={fortunes} selectedFortune={selectedFortune} onChange={handleFortuneChange} />
                            <br /><br />
                            {getDisplayTextForSelectedTab()}
                            <br />
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {tarotCards.map(renderCard)}
                            </div>
                            <Typography variant="h5" style={{ marginBottom: '20px', marginTop: '20px' }}>{`남은 카드 선택 가능 수: ${3 - selectedCards.length}`}</Typography>
                            <Button variant="contained" color="primary" onClick={handleButtonClick} disabled={selectedCards.length !== 3 || isLoading} style={{ width: '360px', height: '48px', marginTop: '20px', marginBottom: '20px', padding: '15px 30px', fontSize: '1rem', borderRadius: '25px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', backgroundColor: selectedCards.length !== 3 || isLoading ? '#bdbdbd' : '', color: selectedCards.length !== 3 || isLoading ? '#757575' : '' }}>타로하기</Button>
                            <Typography variant="h6" style={{ marginTop: '20px' }}>{selectedCardsText}</Typography>
                        </>
                    )}
                    {showResults && response.map((res, index) => (
                        <Card key={index} style={{ margin: '10px', maxWidth: 600 }}>
                            <CardContent>{renderResponse(res.message.content)}</CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TarotDetail;
