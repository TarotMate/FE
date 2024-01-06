// SelectedCards.tsx
import { Typography } from "@mui/material";
import EmptyCardSlot from './EmptyCardSlot';
import { TarotCard } from "../../../data/constants";

interface SelectedCardsProps {
    cardDescriptions: string[];
    selectedCards: string[];
    tarotCards: TarotCard[];
}

const SelectedCards: React.FC<SelectedCardsProps> = ({ cardDescriptions, selectedCards, tarotCards }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{margin: '10px'}}><h3>선택된 카드 미리보기</h3></div>
            {[...Array(cardDescriptions.length)].map((_, index) => {
                const cardName = selectedCards.length > index ? selectedCards[index] : null;
                const card = cardName ? tarotCards.find(tarotCard => tarotCard.name === cardName) : null;
                const isCurrentPick = selectedCards.length === index;

                return (
                    <div key={`card-${index}`} style={{ margin: '10px', textAlign: 'center', width: '100%' }}>
                        <div style={{ height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {card ? (
                                <img
                                    src={card.image}
                                    alt={card.name}
                                    style={{
                                        width: '150px', // 이미지 너비 조정
                                        height: '270px', // 이미지 높이 조정
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