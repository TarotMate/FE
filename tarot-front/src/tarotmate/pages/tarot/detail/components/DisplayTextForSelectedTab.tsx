// DisplayTextForSelectedTab.tsx
import { Typography } from "@mui/material";

interface DisplayTextForSelectedTabProps {
    fortuneDetails: {
        descriptions: Array<{
            title: string;
            subtitle: string;
        }>;
    };
}

const DisplayTextForSelectedTab: React.FC<DisplayTextForSelectedTabProps> = ({ fortuneDetails }) => {
    // Assuming we want to display the first description in the array
    const { title, subtitle } = fortuneDetails.descriptions[0];

    return (
        <>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>{title}</Typography>
            <Typography variant="subtitle2">{subtitle}</Typography>
        </>
    );
};

export default DisplayTextForSelectedTab;

