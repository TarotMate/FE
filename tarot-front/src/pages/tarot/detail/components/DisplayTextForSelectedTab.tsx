// DisplayTextForSelectedTab.tsx
import { Typography } from "@mui/material";

interface DisplayTextForSelectedTabProps {
    title: string;
    subtitle: string;
}

const DisplayTextForSelectedTab: React.FC<DisplayTextForSelectedTabProps> = ({ title, subtitle }) => {
    return (
        <>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>{title}</Typography>
            <Typography variant="subtitle2">{subtitle}</Typography>
        </>
    );
};

export default DisplayTextForSelectedTab;

