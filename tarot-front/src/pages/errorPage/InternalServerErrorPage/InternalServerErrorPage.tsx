// UnauthorizedPage.tsx
import { Container, Typography, Button } from '@mui/material';
import {Link} from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <Container>
            <Typography variant="h1">401 Unauthorized</Typography>
            <Typography variant="body1">Sorry, you don't have access to this page.</Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Back to Home
            </Button>
        </Container>
    );
};

export default UnauthorizedPage;
