// FortuneTabs.tsx
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
                width: '100%',
                maxWidth: '100%', // 모바일 화면에서 최대 너비로 설정
                overflowX: 'auto', // 가로 스크롤을 허용하여 잘린 탭을 스크롤 가능하게 함
            }}
        >
            {fortunes.map((fortune, index) => (
                <Tab key={index} label={fortune.label} value={fortune.value} />
            ))}
        </Tabs>
    );
};

export default FortuneTabs;
