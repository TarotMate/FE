import { useState } from 'react';
import {Button, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {gptTarot} from "../../../../utils/gptTarot/getTarot";

function TarotComponent() {
    // 상태 정의: 로딩 상태와 응답 데이터
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const tarotCards = [
        "마법사", "여사제", "여황제", "황제", "교황", "연인들",
        "전차", "힘", "은둔자", "운명의 수레바퀴", "정의", "매달린 사람",
        "죽음", "절제", "악마", "탑", "별", "달", "태양", "심판", "세계"
    ];
    function selectRandomTarotCards() {
        const selectedCards = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * tarotCards.length);
            selectedCards.push(tarotCards[randomIndex]);
        }
        return selectedCards;
    }
    const selectedCards = selectRandomTarotCards();
    const tarotPrompt = `첫번째 카드는 ${selectedCards[0]}, 두번째 카드는 ${selectedCards[1]}, 세번째 카드는 ${selectedCards[2]}를 뽑았다.`;


    // 버튼 클릭 핸들러
    const handleButtonClick = async () => {
        setIsLoading(true); // 로딩 상태 시작
        try {
            const result = await gptTarot(tarotPrompt); // API 호출
            setResponse(result.choices); // 응답 데이터 설정
        } catch (error) {
            console.error('Error fetching GPT response:', error);
            setResponse(null); // 에러 발생시 응답 데이터 초기화
        }
        setIsLoading(false); // 로딩 상태 종료
    };


    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleButtonClick} style={{ marginBottom: '20px' }}>
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
