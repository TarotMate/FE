const API_URL = import.meta.env.VITE_TAROT_API_URL;

type RequestData = {
    fortuneType: string;
    theme: string;
    selectedCardNumbers: number[];
    cardDescriptions: string[];
};


export async function gptTarotNew(requestData: RequestData) {
    try {
        const response = await fetch(`${API_URL}/tarot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fortuneType: requestData.fortuneType,
                theme: requestData.theme,
                selectedCardNumbers: requestData.selectedCardNumbers,
                cardDescriptions: requestData.cardDescriptions
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during fetch operation:', error.message);
        throw new Error('Error fetching tarot data');
    }
}
