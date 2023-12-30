// CardDeck.tsx
import React, {useState} from 'react';
import { Card, CardContent } from "@mui/material";
import styles from '../../TarotDetailPage.module.css'; // 스타일 시트 임포트

interface CardDeckProps {
    handleDeckClick: () => void;
    isCardMoving: boolean;
    cardBackImage: string;
}

const CardDeck: React.FC<CardDeckProps> = ({ handleDeckClick, cardBackImage }) => {
    const [isCardMoving, setIsCardMoving] = useState(false);

    const triggerAnimation = () => {
        setIsCardMoving(true);
        setTimeout(() => {
            setIsCardMoving(false);
        }, 2000); // 회전 1초 + 사라짐 1초, 총 2초 후에 애니메이션 상태를 리셋
    };



    const cardStyle = {
        perspective: '1000px',
        cursor: 'pointer',
        margin: '10px',
        width: '120px',
        height: '180px',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transformStyle: 'preserve-3d',
        transform: isCardMoving ? 'scale(1.5)' : 'none',
        transition: 'transform 0.7s ease, box-shadow 0.7s ease'
    };

    return (
        <Card
            style={cardStyle}
            onClick={() => {
                handleDeckClick();
                triggerAnimation();
            }}
            className={isCardMoving ? styles.spinAndGrowAnimation : ''}
        >
            <CardContent style={{
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${cardBackImage})`,
                borderRadius: '15px'
            }}>
            </CardContent>
        </Card>
    );
};

export default CardDeck;
