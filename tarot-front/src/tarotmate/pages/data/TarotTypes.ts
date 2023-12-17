export interface TarotCard {
    number: number;
    name: string;
    image: string;
}

export interface FortuneDescription {
    title: string;
    subtitle: string;
    cardDescriptions: string[];
}

export interface Fortune {
    label: string;
    value: string;
    descriptions: FortuneDescription[]; // 변경된 부분
}

export interface TarotData {
    tarotCards: TarotCard[];
    fortunes: Fortune[];
    cardBackImage: string;
}
