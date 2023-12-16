// constants.ts

// 타로 카드에 관한 정보를 담고 있는 배열
export interface TarotCard {
    number: number;
    name: string;
    image: string;
}

export const tarotCards: TarotCard[] = [
    { number: 0, name: "광대", image: "../images/major_arcana_fool.png" },
    { number: 1, name: "마법사", image: "../images/major_arcana_magician.png" },
    { number: 2, name: "여사제", image: "../images/major_arcana_priestess.png" },
    { number: 3, name: "여황제", image: "../images/major_arcana_empress.png" },
    { number: 4, name: "황제", image: "../images/major_arcana_emperor.png" },
    { number: 5, name: "교황", image: "../images/major_arcana_hierophant.png" },
    { number: 6, name: "연인들", image: "../images/major_arcana_lovers.png" },
    { number: 7, name: "전차", image: "../images/major_arcana_chariot.png" },
    { number: 8, name: "힘", image: "../images/major_arcana_strength.png" },
    { number: 9, name: "은둔자", image: "../images/major_arcana_hermit.png" },
    { number: 10, name: "운명의 수레바퀴", image: "../images/major_arcana_fortune.png" },
    { number: 11, name: "정의", image: "../images/major_arcana_justice.png" },
    { number: 12, name: "매달린 사람", image: "../images/major_arcana_hanged.png" },
    { number: 13, name: "죽음", image: "../images/major_arcana_death.png" },
    { number: 14, name: "절제", image: "../images/major_arcana_temperance.png" },
    { number: 15, name: "악마", image: "../images/major_arcana_devil.png" },
    { number: 16, name: "탑", image: "../images/major_arcana_tower.png" },
    { number: 17, name: "별", image: "../images/major_arcana_star.png" },
    { number: 18, name: "달", image: "../images/major_arcana_moon.png" },
    { number: 19, name: "태양", image: "../images/major_arcana_sun.png" },
    { number: 20, name: "심판", image: "../images/major_arcana_judgement.png" },
    { number: 21, name: "세계", image: "../images/major_arcana_world.png" }
];


// 운세 타입에 관한 정보를 담고 있는 배열
export const fortunes = [
    { label: "오늘의 운세", value: "오늘의 운세" },
    { label: "연애운", value: "연애운" },
    { label: "이번달 운세", value: "이번달 운세" }
];

export const cardBackImage = "../images/bcard.png"; // 카드 뒷면 이미지
export const cardDescriptions  = ["애정운", "재물운", "학업&취업운"];