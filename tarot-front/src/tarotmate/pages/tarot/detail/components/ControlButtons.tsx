// ControlButtons.tsx
import React from 'react';
import { Button } from "@mui/material";

interface ControlButtonsProps {
    handleReset: () => void;
    handleButtonClick: () => void;
    isLoading: boolean;
    isButtonDisabled: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ handleReset, handleButtonClick, isLoading, isButtonDisabled }) => {
    return (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center' }}>
            <Button
                variant="contained"
                sx={{backgroundColor:'#1f2024', color:'white', fontWeight:'bold'}}
                onClick={handleReset}
                style={{ width: '250px', height: '48px', borderRadius: '0' }}
                disabled={isButtonDisabled || isLoading}
            >
                다시하기
            </Button>
            <Button
                variant="contained" sx={{backgroundColor:'#fff854', color:'#1f2024', fontWeight:'bold'}}
                onClick={handleButtonClick}
                disabled={isButtonDisabled || isLoading}
                style={{ width: '250px', height: '48px', borderRadius: '0' }}
            >
                타로하기
            </Button>
        </div>
    );
};

export default ControlButtons;