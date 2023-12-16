import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Card, CardContent } from "@mui/material";

const TarotResultPage = () => {
    const location = useLocation();
    const { resultData } = location.state || {};

    // 응답 데이터 파싱
    let parsedData = null;
    if (resultData && resultData.length > 0) {
        try {
            const content = resultData[0].message.content;
            parsedData = JSON.parse(content);
        } catch (error) {
            console.error('Error parsing result data:', error);
        }
    }

    return (
        <div>
            {/* 파싱된 데이터를 화면에 표시 */}
            {parsedData && (
                <Card style={{ margin: '10px', maxWidth: 600 }}>
                    <CardContent>
                        <Typography variant="h5">{parsedData.title}</Typography>
                        <Typography variant="body1">{parsedData.summarize}</Typography>
                        <Typography variant="body2">{parsedData.tarot}</Typography>
                        {parsedData.action_list.map((action, index) => (
                            <Typography key={index} variant="body2">{action}</Typography>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default TarotResultPage;
