// CardDeck.tsx
import React from 'react';
import { Card, CardContent } from "@mui/material";
import '../../TarotDetailPage.module.css'; // 스타일 시트 임포트

interface CardDeckProps {
    handleDeckClick: () => void;
    isCardMoving: boolean;
    cardBackImage: string;
}

const CardDeck: React.FC<CardDeckProps> = ({ handleDeckClick, isCardMoving, cardBackImage }) => {
    const cardStyle = {
        cursor: 'pointer',
        margin: '10px',
        width: '120px',
        height: '180px',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease, border 0.3s ease',
    };

    const movingCardStyle = {
        ...cardStyle,
        transform: 'translateX(100px)',
        transition: 'transform 0.5s ease-in-out'
    };

    return (
        <Card style={isCardMoving ? movingCardStyle : cardStyle} onClick={handleDeckClick}>
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
