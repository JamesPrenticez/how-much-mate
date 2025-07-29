export const SubGrid = ({ data }: { data: Record<string, any> }) => (
  <div style={{ padding: '0.5rem', background: '#f4f4f4', marginBottom: '0.5rem' }}>
    {Object.entries(data).map(([key, val]) => (
      <div key={key}>
        <strong>{key}</strong>: {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
      </div>
    ))}
  </div>
);
