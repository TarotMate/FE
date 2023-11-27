import { useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { gptTarot } from "../../../../utils/gptTarot/getTarot";
import Snackbar from '@mui/material/Snackbar';


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
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar 상태 추가


    // 타로 카드와 Unsplash 이미지 URL 매핑
    const tarotCards = [
        { name: "광대", image: "../images/major_arcana_fool.png" },
        { name: "마법사", image: "../images/major_arcana_magician.png" },
        { name: "여사제", image: "../images/major_arcana_priestess.png" },
        { name: "여황제", image: "../images/major_arcana_empress.png" },
        { name: "황제", image: "../images/major_arcana_emperor.png" },
        { name: "교황", image: "../images/major_arcana_hierophant.png" },
        { name: "연인들", image: "../images/major_arcana_lovers.png" },
        { name: "전차", image: "../images/major_arcana_chariot.png" },
        { name: "힘", image: "../images/major_arcana_strength.png" },
        { name: "은둔자", image: "../images/major_arcana_hermit.png" },
        { name: "운명의 수레바퀴", image: "../images/major_arcana_fortune.png" },
        { name: "정의", image: "../images/major_arcana_justice.png" },
        { name: "매달린 사람", image: "../images/major_arcana_hanged.png" },
        { name: "죽음", image: "../images/major_arcana_death.png" },
        { name: "절제", image: "../images/major_arcana_temperance.png" },
        { name: "악마", image: "../images/major_arcana_devil.png" },
        { name: "탑", image: "../images/major_arcana_tower.png" },
        { name: "별", image: "../images/major_arcana_star.png" },
        { name: "달", image: "../images/major_arcana_moon.png" },
        { name: "태양", image: "../images/major_arcana_sun.png" },
        { name: "심판", image: "../images/major_arcana_judgement.png" },
        { name: "세계", image: "../images/major_arcana_world.png" }
    ];

// Replace "../images/" with the actual path to the directory where the images are stored.





    const toggleCardSelection = (card: string) => {
        // 이미 뒤집힌 카드를 다시 선택하려고 하는 경우 아무런 동작을 하지 않습니다.
        if (flippedCards.has(card)) {
            alert("다시 뒤집을 수는 없습니다.")
            return;
        }

        // 이미 3장의 카드가 선택되었고, 새로운 카드를 선택하려고 하는 경우 아무런 동작을 하지 않습니다.
        if (selectedCards.length >= 3 && !selectedCards.includes(card)) {
            setOpenSnackbar(true); // 사용자가 3장의 카드를 모두 선택했을 때 Snackbar를 열어줍니다.
            return;
        }

        let newFlippedCards = new Set(flippedCards);
        newFlippedCards.add(card);

        setFlippedCards(newFlippedCards);

        // 선택된 카드 목록 업데이트
        if (!selectedCards.includes(card)) {
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

    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const renderResponse = (responseContent: any) => {
        // JSON 문자열을 객체로 변환
        const responseObj = JSON.parse(responseContent);

        return (
            <div style={{ margin: '10px' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{responseObj.title}</Typography>
                <Typography variant="body1">{responseObj.fortune_telling}</Typography>
                <Typography variant="body1">{responseObj.emotion_result}</Typography>
                <Typography variant="body1">{responseObj.analysis}</Typography>
                <Typography variant="body1">{responseObj.action_list}</Typography>
            </div>
        );
    };





    return (
        <div style={{
            backgroundColor: '#1a1a2e', // 전체 배경색
            color: 'white',
        }}>
            <div style={{
                padding: '20px',
                margin: 'auto', // 자동 마진을 사용하여 좌우 중앙 정렬
                maxWidth: '70%', // 최대 너비를 90%로 설정하여 여백 유지
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#1a1a2e', // 어두운 배경 색상 추가
                color: 'white' // 텍스트 색상을 밝게 변경
            }}>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="3장의 카드를 모두 선택하셨습니다."
            />
            <Typography variant="h5" style={{ color: 'gold', marginBottom: '20px' }}>
                선택한 카드를 통해 운세를 점쳐드립니다.
            </Typography>
                <Typography variant="body1" style={{ marginBottom: '20px', color: 'gold' }}>

                    {selectedCards.length === 3 ? "카드를 다시 고를 수 없습니다. " :
                        `${3 - selectedCards.length}장의 카드를 신중하게 선택해 주세요.`
                    }
                </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '10px' }}>

                <div style={{ textAlign: 'center', padding: '20px 0' }}> {/* 버튼을 중앙에 정렬 */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleButtonClick}
                        disabled={selectedCards.length !== 3 || isLoading}
                        style={{
                            marginBottom: '20px',
                            padding: '15px 30px',
                            fontSize: '1rem',
                            borderRadius: '25px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                            backgroundColor: selectedCards.length !== 3 || isLoading ? '#bdbdbd' : '', // 비활성화 시 회색으로 변경
                            color: selectedCards.length !== 3 || isLoading ? '#757575' : '' // 비활성화 시 텍스트 색 변경
                        }}
                    >
                        타로하기
                    </Button>

                </div>



                <p>
                    라이더-웨이트 타로 덱의 메이저 아르카나(Major Arcana) 카드는 총 22장입니다. 메이저 아르카나는 타로 덱의 주요 카드들로 구성되어 있으며, 일반적으로 0부터 21까지 번호가 매겨져 있습니다. 이 카드들은 각각 다른 상징과 의미를 지니며, 타로 카드 읽기에서 중요한 역할을 합니다.
                </p>


                {tarotCards.map((card, index) => (
                    <Card
                        key={index}
                        style={{
                            cursor: 'pointer',
                            margin: '5px',
                            width: '90px',
                            height: '120px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.3s ease, border 0.3s ease',
                            border: selectedCards.includes(card.name) ? '3px solid gold' : '', // 선택된 카드에 두꺼운 금색 테두리 추가
                            transform: flippedCards.has(card.name) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
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
                            zIndex: flippedCards.has(card.name) ? 1 : 0 }}>
                        </CardContent>

                        {/* 카드 뒷면 */}
                        <CardContent style={{
                            width: '100%',
                            height: '100%',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundImage: `url(${flippedCards.has(card.name) ? card.image : cardBackImage})`,
                            transform: flippedCards.has(card.name) ? 'rotateY(180deg)' : 'rotateY(0deg)', // 뒤집힌 카드는 뒷면을 보여줌
                            zIndex: flippedCards.has(card.name) ? 1 : 0 // 뒤집힌 카드는 뒷면을 보여줌
                        }}>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Typography variant="h5" style={{ color: 'gold', marginBottom: '20px' }}>
                {`남은 카드 선택 가능 수: ${3 - selectedCards.length}`}
            </Typography>

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
                        <Card key={index} style={{ margin: '10px', maxWidth: 600 }}>
                        <CardContent>
                            {renderResponse(res.message.content)}
                        </CardContent>
                    </Card>
                ))
            )}
            </div>
        </div>
    );
}

export default TarotComponent;
