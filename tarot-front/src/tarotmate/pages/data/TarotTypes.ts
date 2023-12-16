// TarotTypes.ts

export interface TarotCard {
    number: number;
    name: string;
    image: string;
}

export interface Fortune {
    label: string;
    value: string;
    description: {
        title: string;
        subtitle: string;
        cardDescriptions: string[];
    };
}

export interface TarotData {
    tarotCards: TarotCard[];
    fortunes: Fortune[];
    cardBackImage: string;
}
