// TarotResultPage.tsx
import { useLocation } from 'react-router-dom';
import { Typography, Card, CardContent } from "@mui/material";
import styles from './TarotResultPage.module.css';
interface ActionItem {
    text: string;
    // other fields...
}
const TarotResultPage = () => {
    const location = useLocation();
    const { resultData } = location.state || {};

    console.log(resultData)
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
        <div className={styles.pageContainer}>
            {parsedData && (
                <Card className={styles.resultCard}>
                    <CardContent>
                        <Typography variant="h5" className={styles.title}>{parsedData.title}</Typography>
                        <Typography variant="body1" className={styles.summarize}>{parsedData.summarize}</Typography>
                        <Typography variant="body2" className={styles.tarot}>{parsedData.tarot}</Typography>
                        {parsedData.action_list.map((action: ActionItem, index: number) => (
                            <Typography key={index} variant="body2" className={styles.action}>{action}</Typography>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default TarotResultPage;
