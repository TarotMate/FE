// SelectedCards.tsx
import { Typography } from "@mui/material";
import EmptyCardSlot from './EmptyCardSlot';
import {TarotCard} from "../../../data/constants";

interface SelectedCardsProps {
    cardDescriptions: string[];
    selectedCards: string[];
    tarotCards: TarotCard[];
}

const SelectedCards: React.FC<SelectedCardsProps> = ({ cardDescriptions, selectedCards, tarotCards }) => {


    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[...Array(cardDescriptions.length)].map((_, index) => {
                const cardName = selectedCards.length > index ? selectedCards[index] : null;
                const card = cardName ? tarotCards.find(tarotCard => tarotCard.name === cardName) : null;
                const isCurrentPick = selectedCards.length === index;

                return (
                    <div key={`card-${index}`} style={{ margin: '10px', textAlign: 'center', width: '100px', height: '230px' }}>
                        <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {card ? (
                                <img
                                    src={card.image}
                                    alt={card.name}
                                    style={{
                                        width: '100px',
                                        height: '180px',
                                        border: '3px solid yellow'
                                    }}
                                />
                            ) : (
                                <EmptyCardSlot borderColor={isCurrentPick ? 'blue' : 'gray'} />
                            )}
                        </div>
                        <Typography variant="subtitle1" style={{ marginTop: '5px' }}>{cardDescriptions[index]}</Typography>
                    </div>
                );
            })}
        </div>
    );
};

export default SelectedCards;
