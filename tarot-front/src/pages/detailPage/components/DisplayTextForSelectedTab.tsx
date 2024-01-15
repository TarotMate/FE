// DisplayTextForSelectedTab.tsx
import { Typography } from "@mui/material";

interface DisplayTextForSelectedTabProps {
    title: string;
}

const DisplayTextForSelectedTab: React.FC<DisplayTextForSelectedTabProps> = ({ title }) => {
    return (
        <>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>{title}</Typography>
        </>
    );
};

export default DisplayTextForSelectedTab;

