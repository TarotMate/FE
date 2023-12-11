import { Typography, Box } from "@mui/material";

function TarotMateBanner() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            p={4}
            style={{
                backgroundImage: 'url("/tarotMainBanner.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                boxSizing: 'border-box',
                minHeight: '100px', // 높이 조절
                position: 'relative', // 오버레이를 위한 위치 설정
            }}
        >
            <Box
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검은색 오버레이
                }}
            />
            <Box
                zIndex="1" // 텍스트를 오버레이 위에 표시
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: 'white' }}>
                    당신의 점을 봐 드립니다.
                </Typography>
                <Typography variant="h6" style={{ fontWeight: 'bold', color: 'white' }}>
                    오늘 당신의 점을 봐 보는게 어떨까요?
                </Typography>
            </Box>
        </Box>
    );
}

export default TarotMateBanner;




