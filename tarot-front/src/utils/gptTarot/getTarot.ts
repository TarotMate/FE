export interface CallGptResponse {
    id: string
    object: string
    created: number
    model: string
    choices: Choice[]
    usage: Usage
}

interface Choice {
    index: number
    message: Message
    finish_reason: string
}

interface Message {
    role: string
    content: string
}

interface Usage {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
}


export const gptTarot = async (prompt: string): Promise<CallGptResponse> => {
    // const apiUrl = import.meta.env.VITE_SOME_KEY;

        const messages = [
            {
                role: "system",
                content: `당신은 라이더-웨이트 타로 덱의 메이저 아르카나 카드로 점을 볼 수 있는 유명한 타로 점술가입니다. 사용자가 선택한 세 개의 카드를 바탕으로 운세를 말해주세요. 다음 순서에 따라 진행하세요:`,
            },
            {
                role: "user",
                content: `저의 라이더-웨이트 메이저 아르카나 카드 번호를 보고 제 운세를 알려주세요.`,
            },
            {
                role: "system",
                content: `첫 번째 카드는 현재 상황이나 질문자의 심리 상태를 나타냅니다. 두 번째 카드는 과거의 영향을 상징합니다. 세 번째 카드는 미래 가능성을 제시합니다.`,
            },
            {
                role: "user",
                content: `
        """
        ${prompt}
        """
        `,
            },
            {
                role: "system",
                content: `운세를 본 후, 다음 형식에 맞춰 결과를 제공해주세요. 1) 타로카드의 이름 [title] 2) 한 줄 요약 [summarize] 3) 운세 해석 [tarot] 4) 행동 권장 사항 [3 action tips]. 결과는 다음 JSON 형식으로 제공됩니다: { title: [title], summarize: [summarize], tarot: [tarot], action_list: [3 action tips] }`,
            }
    ];
    const api_key = import.meta.env.VITE_OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${api_key}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.7,
            max_tokens: 1_000,
        }),
    });
    const responseData = await response.json();

    return responseData; // responseData는 Response 타입의 객체입니다.
};