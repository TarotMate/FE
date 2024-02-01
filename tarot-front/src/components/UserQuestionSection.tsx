import React, { useState } from 'react';

const UserQuestionSection: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleQuestionSubmit = () => {
        // 질문에 대한 답변 로직
        setAnswer('여기에 타로 카드의 해석이 표시됩니다.');
    };

    return (
        <div className="user-question-section">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 입력하세요"
            />
            <button onClick={handleQuestionSubmit}>질문하기</button>
            {answer && <p>{answer}</p>}
        </div>
    );
};

export default UserQuestionSection;
