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
    const tarotCards = [
        "마법사", "여사제", "여황제", "황제", "교황", "연인들",
        "전차", "힘", "은둔자", "운명의 수레바퀴", "정의", "매달린 사람",
        "죽음", "절제", "악마", "탑", "별", "달", "태양", "심판", "세계"
    ];

    const toggleCardSelection = (card: string) => {
        if (selectedCards.includes(card)) {
            setSelectedCards(selectedCards.filter(c => c !== card));
        } else {
            if (selectedCards.length < 3) {
                setSelectedCards([...selectedCards, card]);
            }
        }
    };

    const handleButtonClick = async () => {
        if (selectedCards.length < 3) {
            alert('3장의 카드를 선택해야 합니다.');
            return;
        }
        const tarotPrompt = `첫번째 카드는 ${selectedCards[0]}, 두번째 카드는 ${selectedCards[1]}, 세번째 카드는 ${selectedCards[2]}를 뽑았다.`;
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

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '10px' }}>
                {tarotCards.map((card, index) => (
                    <Card
                        key={index}
                        style={{
                            cursor: 'pointer',
                            margin: '5px',
                            width: '120px', // 카드의 가로 크기
                            height: '168px', // 카드의 세로 크기, 포커 카드 비율에 근사하게 조정
                            borderRadius: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: selectedCards.includes(card) ? '#f0f0f0' : '#ffffff',
                            border: selectedCards.includes(card) ? '2px solid #1976d2' : '1px solid #ddd' // 선택 시 테두리 스타일 변경
                        }}
                        onClick={() => toggleCardSelection(card)}
                    >
                        <CardContent>
                            <Typography variant="body1" component="div" style={{ textAlign: 'center' }}>
                                {card}
                            </Typography>
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
            {isLoading ? (
                <CircularProgress />
            ) : (
                response && response.map((res, index) => (
                    <Card key={index} style={{ margin: '10px', maxWidth: 600 }}>
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
