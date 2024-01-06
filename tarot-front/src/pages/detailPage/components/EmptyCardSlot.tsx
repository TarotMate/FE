// EmptyCardSlot.tsx

const EmptyCardSlot = ({ borderColor = 'gray' }) => (
    <div style={{
        border: `2px dashed ${borderColor}`,
        width: '150px', // 너비 조정
        height: '270px', // 높이 조정
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
    </div>
);

export default EmptyCardSlot;
