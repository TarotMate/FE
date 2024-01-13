// TarotResultPage.tsx
import { useLocation } from 'react-router-dom';
import { Typography, Card, CardContent, Rating } from "@mui/material";
import styles from './TarotResultPage.module.css';

const TarotResultPage = () => {
    const location = useLocation();
    const { resultData } = location.state || {};

    return (
        <div className={styles.pageContainer}>
            {resultData && resultData.fortune.map((card: any, index:any) => (
                <Card key={index} className={styles.resultCard}>
                    <CardContent>
                        <Typography variant="h5" className={styles.title}>{card.cardName}</Typography>
                        {card.starRating && <Rating value={card.starRating} readOnly />}
                        <Typography variant="body2" className={styles.comment}>{card.shortComment}</Typography>
                        <Typography variant="body1" className={styles.detail}>{card.detail}</Typography>
                        <ul className={styles.hashTags}>
                            {card.hashTags.map((tag, tagIndex) => (
                                <li key={tagIndex}>{tag}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TarotResultPage;
