// CardDeck.tsx
import React from 'react';
import { Card, CardContent } from "@mui/material";
import { CSSProperties } from 'react';

interface CardDeckProps {
    handleDeckClick: () => void;
    isCardMoving: boolean;
    cardBackImage: string;
    cardStyle: CSSProperties;
    movingCardStyle: CSSProperties;
}

const CardDeck: React.FC<CardDeckProps> = ({ handleDeckClick, isCardMoving, cardBackImage, cardStyle, movingCardStyle }) => {
    return (
        <Card style={isCardMoving ? movingCardStyle : cardStyle} onClick={handleDeckClick}>
            <CardContent style={{
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${cardBackImage})`,
                borderRadius: '15px' // 모서리 둥글게
            }}>
            </CardContent>
        </Card>
    );
};

export default CardDeck;
