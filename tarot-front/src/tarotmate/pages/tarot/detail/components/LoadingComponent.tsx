// LoadingComponent.tsx
import React from 'react';
import { CircularProgress, Typography } from "@mui/material";

const LoadingComponent: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1000,
        }}>
            <CircularProgress style={{ color: 'blue', margin: 5 }} size={80} />
            <Typography variant="h6">로딩 중...</Typography>
        </div>
    );
};

export default LoadingComponent;
