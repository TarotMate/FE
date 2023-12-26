// CardDeck.tsx
import React from 'react';
import { Card, CardContent } from "@mui/material";

interface CardDeckProps {
    handleDeckClick: () => void;
    isCardMoving: boolean;
    cardBackImage: string;
}

const CardDeck: React.FC<CardDeckProps> = ({ handleDeckClick, isCardMoving, cardBackImage }) => {
    // Define the static card style inside the component
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
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease, border 0.3s ease',
    };

    // Define the moving card style inside the component
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
