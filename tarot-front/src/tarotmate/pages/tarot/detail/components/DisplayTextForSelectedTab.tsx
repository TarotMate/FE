// DisplayTextForSelectedTab.tsx
import React from 'react';
import { Typography } from "@mui/material";

interface DisplayTextForSelectedTabProps {
    selectedFortune: string;
}

const DisplayTextForSelectedTab: React.FC<DisplayTextForSelectedTabProps> = ({ selectedFortune }) => {
    switch (selectedFortune) {
        case '오늘의 운세':
            return (
                <>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>당신의 하루는 어떨까요?</Typography>
                    <Typography variant="subtitle2">오늘을 생각하며 카드를 뽑으세요</Typography>
                </>
            );
        case '연애운':
            return (
                <>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>나의 애정운</Typography>
                    <Typography variant="subtitle2">이달을 생각하며 카드를 뽑아주세요</Typography>
                </>
            );
        case '이번달 운세':
            return (
                <>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>이번달 운세</Typography>
                    <Typography variant="subtitle2">이번달 당신의 기운은 어떨까요?</Typography>
                </>
            );
        default:
            return <></>;
    }
};

export default DisplayTextForSelectedTab;
