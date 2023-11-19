import { useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { gptTarot } from "../../../../utils/gptTarot/getTarot";

interface ResponseItem {
    message: {
        content: string;
    };
}

function TarotComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ResponseItem[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [selectedCardsText, setSelectedCardsText] = useState<string>(''); // 선택된 카드 텍스트 상태 추가
    const cardBackImage = "./backCard.png"; // 카드 뒷면 이미지 URL
    // 카드 선택 여부를 관리하는 상태 추가
    const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

    // 타로 카드와 Unsplash 이미지 URL 매핑
    const tarotCards = [
        { name: "마법사", image: "https://source.unsplash.com/1600x900/?magician" },
        { name: "여사제", image: "https://source.unsplash.com/1600x900/?high-priestess" },
        { name: "여황제", image: "https://source.unsplash.com/1600x900/?empress" },
        { name: "황제", image: "https://source.unsplash.com/1600x900/?emperor" },
        { name: "교황", image: "https://source.unsplash.com/1600x900/?pope" },
        { name: "연인들", image: "https://source.unsplash.com/1600x900/?lovers" },
        { name: "전차", image: "https://source.unsplash.com/1600x900/?chariot" },
        { name: "힘", image: "https://source.unsplash.com/1600x900/?strength" },
        { name: "은둔자", image: "https://source.unsplash.com/1600x900/?hermit" },
        { name: "운명의 수레바퀴", image: "https://source.unsplash.com/1600x900/?wheel-of-fortune" },
        { name: "정의", image: "https://source.unsplash.com/1600x900/?justice" },
        { name: "매달린 사람", image: "https://source.unsplash.com/1600x900/?hanged-man" },
        { name: "죽음", image: "https://source.unsplash.com/1600x900/?death" },
        { name: "절제", image: "https://source.unsplash.com/1600x900/?temperance" },
        { name: "악마", image: "https://source.unsplash.com/1600x900/?devil" },
        { name: "탑", image: "https://source.unsplash.com/1600x900/?tower" },
        { name: "별", image: "https://source.unsplash.com/1600x900/?star" },
        { name: "달", image: "https://source.unsplash.com/1600x900/?moon" },
        { name: "태양", image: "https://source.unsplash.com/1600x900/?sun" },
        { name: "심판", image: "https://source.unsplash.com/1600x900/?judgement" },
        { name: "세계", image: "https://source.unsplash.com/1600x900/?world" }
    ];





    const toggleCardSelection = (card: string) => {
        // 이미 3장의 카드가 선택되었고, 새로운 카드를 선택하려고 하는 경우 아무런 동작을 하지 않습니다.
        if (selectedCards.length >= 3 && !selectedCards.includes(card)) {
            return;
        }

        let newFlippedCards = new Set(flippedCards);
        if (flippedCards.has(card)) {
            newFlippedCards.delete(card);
        } else {
            newFlippedCards.add(card);
        }

        setFlippedCards(newFlippedCards);

        // 선택된 카드 목록 업데이트
        if (selectedCards.includes(card)) {
            setSelectedCards(selectedCards.filter(c => c !== card));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    };

    const handleButtonClick = async () => {
        if (selectedCards.length < 3) {
            alert('3장의 카드를 선택해야 합니다.');
            return;
        }
        const tarotPrompt = `첫번째 카드는 ${selectedCards[0]}, 두번째 카드는 ${selectedCards[1]}, 세번째 카드는 ${selectedCards[2]}를 뽑았다.`;
        setSelectedCardsText(`당신이 뽑은 타로카드는 ${selectedCards.join(', ')} 입니다.`);

        setIsLoading(true);
        try {
            const result: any = await gptTarot(tarotPrompt);
            setResponse(result.choices);
        } catch (error) {
            console.error('Error fetching GPT response:', error);
            setResponse([]);
        }
        setIsLoading(false);
    };


// 카드 컨테이너 스타일
    const cardContainerStyle = {
        cursor: 'pointer',
        margin: '5px',
        width: '120px',
        height: '168px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
        position: 'relative',
        ':hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            transform: 'scale(1.05)'
        },
        transition: 'transform 0.3s ease, border 0.3s ease' // 부드러운 전환 효과 추가
    };

    // 카드 전면 스타일
    const cardFaceStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backfaceVisibility: 'hidden',
    };

    // 응답 카드 스타일
    const responseCardStyle = {
        margin: '10px',
        maxWidth: '600px',
        backgroundColor: '#333', // 결과 카드의 배경색 변경
        color: 'white', // 결과 텍스트 색상을 밝게 변경
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)' // 결과 카드에 그림자 효과 추가
    };

    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1a1a2e', // 어두운 배경 색상 추가
            backgroundImage: 'url(./mystical-background.jpg)', // 신비로운 배경 이미지 추가
            backgroundSize: 'cover',
            color: 'white' // 텍스트 색상을 밝게 변경
        }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '10px' }}>
                {tarotCards.map((card, index) => (
                    <Card
                        key={index}
                        style={{
                            ...cardContainerStyle,
                            border: selectedCards.includes(card.name) ? '3px solid gold' : '', // 선택된 카드에 두꺼운 금색 테두리 추가
                            transform: flippedCards.has(card.name) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                        onClick={() => toggleCardSelection(card.name)}
                    >
                        {/* 카드 전면 */}
                        <CardContent style={{ ...cardFaceStyle,
                            border: selectedCards.includes(card.name) ? '2px solid #1976d2' : '1px solid #ddd',
                            transform: flippedCards.has(card.name) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            zIndex: flippedCards.has(card.name) ? 1 : 0 }}>
                        </CardContent>

                        {/* 카드 뒷면 */}
                        <CardContent style={{
                            width: '100%',
                            height: '100%',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundImage: `url(${flippedCards.has(card.name) ? card.image : cardBackImage})`
                        }}>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleButtonClick}
                disabled={selectedCards.length !== 3}
                style={{ marginBottom: '20px' }}
            >
                타로하기
            </Button>
            <Typography variant="h6" style={{ marginTop: '20px' }}>
                {selectedCardsText} {/* 로딩 중 선택된 카드 텍스트 표시 */}
            </Typography>
            {isLoading ? (
                <>
                <CircularProgress />
                <Typography style={{ marginLeft: '10px' }}>응답을 기다리는 중...</Typography>
                </>
                ) : (
                // 결과 표시 영역
                    response && response.map((res, index) => (
                    <Card key={index} style={responseCardStyle}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Response {index + 1}
                            </Typography>
                            <Typography variant="body2">
                                {res.message.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}

export default TarotComponent;
