// CardDeck.tsx
import React from 'react';
import { Card, CardContent } from "@mui/material";
import styles from '../../TarotDetailPage.module.css'; // 스타일 시트 임포트

interface CardDeckProps {
    handleDeckClick: () => void;
    isCardMoving: boolean; // 이 상태는 외부에서 관리되며, 여기서는 사용만 합니다.
    cardBackImage: string;
}

const CardDeck: React.FC<CardDeckProps> = ({ handleDeckClick, isCardMoving, cardBackImage }) => {

    const cardStyle = {

        perspective: '1000px',
        cursor: 'pointer',
        margin: '10px',
        width: '150px', // 너비 조정
        height: '260px', // 높이 조정
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: isCardMoving ? 'scale(1.5)' : 'none', // isCardMoving 상태에 따라 transform 스타일이 결정됩니다.
        transition: 'transform 0.7s ease, box-shadow 0.7s ease'
    };






    return (
        <Card
            style={cardStyle}
            onClick={() => {
                handleDeckClick()
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
