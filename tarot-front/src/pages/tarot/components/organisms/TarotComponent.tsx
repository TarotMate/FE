import { useState } from 'react';
import {
    Button,
    Card,
    Typography
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

function TarotComponent() {
    const navigate = useNavigate();
    const [showTarotCards, setShowTarotCards] = useState(false); // State to toggle visibility of tarot cards
    const handleShowTarotCards = () => {
        setShowTarotCards(true);
        navigate('/detail'); // '/tarot/detail' 경로로 이동
    };
    return (
        <div style={{
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // 수직 중앙 정렬
            alignItems: 'center', // 수평 중앙 정렬
        }}>
            <div style={{
                padding: '20px',
                width: '400px', // 너비
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white'
            }}>
                {!showTarotCards && (
               <>
                   <img src="/images/fortune-teller.png" alt="점성술사" width="360" height="360" />
                       <Card
                           style={{
                               width: '360px', // 너비
                               height: '180px', // 높이
                               display: 'flex',
                               justifyContent: 'center',
                               alignItems: 'center',
                               backgroundColor: '#1a1a1a', // 회색 배경
                               margin: '20px 0' // 상하 여백
                           }}
                       >
                           <Typography variant="h5" style={{ padding: '20px', textAlign: 'center', color: 'gold', fontSize: '16px', fontWeight:600,  }}>
                               선택한 카드를 통해
                               운세를 점쳐드립니다.
                           </Typography>
                       </Card>
                {/* 선택된 운세 유형에 따른 텍스트 표시 */}

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
                   <Button
                       variant="contained"
                       onClick={handleShowTarotCards}
                       style={{
                           marginBottom: '20px',
                           width: '360px', // 버튼의 가로 길이 설정
                           height: '48px',
                           backgroundColor: '#7758af', // 버튼 색상 설정
                           color: 'white', // 텍스트 색상을 흰색으로 설정
                           fontSize: '18px',
                           fontWeight: 600,
                           borderRadius: '5px'
                       }}
                   >
                       타로 카드 보기
                   </Button>
               </>
                )}
                </div>
            </div>
    );
}

export default TarotComponent;
