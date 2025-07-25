import { useControlsGridStore } from '../../../../../../libs/draw/ui/stores/src/lib/controls-grid.store';

export const GridControls = () => {
  const { snapToGrid, setSnapToGrid, showGrid, setShowGrid, setViewBox } =
    useControlsGridStore();

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        display: 'flex',
        gap: 8,
        background: 'rgba(var(--color-background-opacity), 0.8)',
        padding: 8,
        borderRadius: 4,
      }}
    >
      <button
        style={{ padding: '4px 8px', fontSize: '12px' }}
        onClick={() => setSnapToGrid(!snapToGrid)}
      >
        Snap: {snapToGrid ? 'ON' : 'OFF'} (G)
      </button>
      <button
        style={{ padding: '4px 8px', fontSize: '12px' }}
        onClick={() => setShowGrid(!showGrid)}
      >
        Grid: {showGrid ? 'ON' : 'OFF'} (H)
      </button>
      <button
        style={{ padding: '4px 8px', fontSize: '12px' }}
        onClick={() =>
          setViewBox({ x: -400, y: -300, w: 800, h: 600 })
        }
      >
        Reset View (R)
      </button>
    </div>
  );
};
