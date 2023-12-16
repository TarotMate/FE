// FortuneTabs.tsx
import React from 'react';
import { Tab, Tabs } from "@mui/material";

interface FortuneTabsProps {
    selectedFortune: string;
    handleFortuneChange: (newValue: string) => void;
    fortunes: { label: string; value: string; }[];
}

const FortuneTabs: React.FC<FortuneTabsProps> = ({ selectedFortune, handleFortuneChange, fortunes }) => {
    return (
        <Tabs
            value={selectedFortune}
            onChange={(_, newValue) => handleFortuneChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
            aria-label="fortune selection tabs"
            style={{
                backgroundColor: 'white',
                width: '500px',
                maxWidth: '500px',
            }}
        >
            {fortunes.map((fortune, index) => (
                <Tab key={index} label={fortune.label} value={fortune.value} />
            ))}
        </Tabs>
    );
};

export default FortuneTabs;
