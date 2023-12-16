// EmptyCardSlot.tsx

const EmptyCardSlot = ({ borderColor = 'gray' }) => (
    <div style={{
        border: `2px dashed ${borderColor}`,
        width: '100px',
        height: '180px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
    </div>
);

export default EmptyCardSlot;
