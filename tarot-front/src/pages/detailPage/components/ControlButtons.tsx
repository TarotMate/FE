// ControlButtons.tsx
import React from 'react';
import { Button } from "@mui/material";

interface ControlButtonsProps {
    handleReset: () => void;
    handleButtonClick: () => void;
    isLoading: boolean;
    selectedCards: string[];
    isButtonDisabled: boolean;
}


const ControlButtons: React.FC<ControlButtonsProps> = ({ handleReset, handleButtonClick, isLoading, selectedCards, isButtonDisabled }) => {
    const buttonStyle = window.innerWidth < 600 ?
        { width: '50%', height: '40px'} : // 모바일 스타일
        { width: '250px', height: '48px'}; // 기본 스타일

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Button
                variant="contained"
                sx={{backgroundColor:'#1f2024', color:'white', fontWeight:'bold'}}
                onClick={handleReset}
                style={buttonStyle}
                disabled={selectedCards.length === 0  || isLoading}
            >
                다시하기
            </Button>
            <Button
                variant="contained"
                sx={{backgroundColor:'#fff854', color:'#1f2024', fontWeight:'bold'}}
                onClick={handleButtonClick}
                style={buttonStyle}
                disabled={isButtonDisabled || isLoading || selectedCards.length === 0}
            >
                타로하기
            </Button>
        </div>
    );
};

export default ControlButtons;

