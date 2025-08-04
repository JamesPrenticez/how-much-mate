import React from 'react';
import { useViewportStore } from './viewport.store';

interface ViewportControlsProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ViewportControls = ({
  className,
  style,
}: ViewportControlsProps) => {
  const viewport = useViewportStore((s) => s.viewport);
  const limits = useViewportStore((s) => s.limits);
  const zoomIn = useViewportStore((s) => s.zoomIn);
  const zoomOut = useViewportStore((s) => s.zoomOut);
  const resetView = useViewportStore((s) => s.resetView);

  const zoomPercentage = Math.round(viewport.scale * 100);
  const canZoomIn = viewport.scale < limits.maxScale;
  const canZoomOut = viewport.scale > limits.minScale;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px',
        zIndex: 1000,
        ...style,
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {zoomPercentage}%
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => zoomIn()}
          disabled={!canZoomIn}
          style={{
            padding: '4px 8px',
            border: 'none',
            borderRadius: '2px',
            background: canZoomIn ? '#4CAF50' : '#666',
            color: 'white',
            cursor: canZoomIn ? 'pointer' : 'not-allowed',
            fontSize: '12px',
          }}
        >
          +
        </button>
        <button
          onClick={() => zoomOut()}
          disabled={!canZoomOut}
          style={{
            padding: '4px 8px',
            border: 'none',
            borderRadius: '2px',
            background: canZoomOut ? '#4CAF50' : '#666',
            color: 'white',
            cursor: canZoomOut ? 'pointer' : 'not-allowed',
            fontSize: '12px',
          }}
        >
          -
        </button>
        <button
          onClick={resetView}
          style={{
            padding: '4px 8px',
            border: 'none',
            borderRadius: '2px',
            background: '#2196F3',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Reset
        </button>
      </div>
      <div style={{ fontSize: '10px', opacity: 0.7, textAlign: 'center' }}>
        Wheel: Zoom
        <br />
        Ctrl+Drag: Pan
      </div>
    </div>
  );
};
