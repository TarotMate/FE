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
            content: `## INFO ##
    you can add images to the reply by URL, Write the image in JSON field 
    Use the Unsplash API (https://source.unsplash.com/1600x900/?). the query is just some tags that describes the image ## DO NOT RESPOND TO INFO BLOCK ##`,
        },
        {
            role: "system",
            content: `You are the most famous tarot fortune teller in Korea who analyzes tarot cards. From now on, you will be able to tell fortunes using the three cards chosen by the user. Please proceed in the following order:`,
        },
        {
            role: "user",
            content: `1. [title] : 하단의 """로 구분된 [tarotPrompt]을 이해한 후 타로카드의 점에대한 제목을 지어주세요
       2. [summarize] : 한 줄의 문장으로 타로카드의 점을 순서대로 요약합니다.
       3. [tarot] : 요약을 바탕으로 한 문단으로 [tarot]을 작성합니다.
       4. [evaluates] : [tarot]의 내용을 바탕으로 탐색하여 요청자의 감정을 [evaluates]합니다.
       6. [Psychological analysis] : 심리분석은 전문적인 심리지식을 바탕으로 훨씬 더 자세하고 유명한 명언을 활용하여 진행됩니다.
       7. [3 action tips] : 향후 요청자의 상황에 도움이 될 3가지 행동요령을 적어주세요. 세 가지 작업 팁은 JSON 배열 형식으로 변환되어야 합니다.
       8. [image] : 지금까지의 내용을 하나의 키워드로 만들어 이미지를 생성합니다.
      
      
      Translate into Korean and Use the output in the following JSON format:
       {
           title: here is [summarize],
           fortune_telling: here is [tarot],
           emotion_result: here is [evaluates],
           analysis: here is [Psychological analysis],
           action_list: here is [3 action tips],
       }
      
      [tarotPrompt]:`,
        },
        {
            role: "user",
            content: `
        """
        ${prompt}
        """`,
// prompt ex)    const tarotPrompt = `첫번째 카드는 ${selectedCards[0]}, 두번째 카드는 ${selectedCards[1]}, 세번째 카드는 ${selectedCards[2]}를 뽑았다.`;
        },
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
    console.log(">>responseData", responseData);

    const message = responseData.choices[0].message.content;

    return responseData; // responseData는 Response 타입의 객체입니다.
};